import React, { useRef, useEffect, useCallback } from "react";
import angryFace from "../assets/mood/angry.svg";
import pensiveFace from "../assets/mood/pensive.svg";
import "@fontsource/barlow-condensed/800.css";
import { useTranslation } from "react-i18next";
import { W, H, PAD, BALL_R, X_LO, X_HI, BARRIER } from "../constants";
import { toX, toY, fromX, energy, hexRgb } from "../utils/physics";
import { MODIFIERS, BASE, blendSingleModifier } from "../data/modifiers";

const zoneColors = ["#ff8777", "#ffd166", "#6ae4ff"];
const displayFont = size => `800 ${size}px "Barlow Condensed", "Arial Narrow", sans-serif`;

export default function SimulationCanvas({ sim, loop, isPaused }) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const gesture = useRef(null);
  const faces = useRef({});

  useEffect(() => {
    for (const [key, url] of Object.entries({ mania: angryFace, depression: pensiveFace })) {
      const img = new Image();
      img.src = url;
      faces.current[key] = img;
    }
  }, []);

  const pointerX = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return fromX((event.clientX - bounds.left) * W / bounds.width);
  };

  const onDown = (event) => {
    const ball = sim.current.ball;
    const x = pointerX(event);
    if (isPaused || !event.isPrimary || event.button !== 0 || Math.abs(toX(x) - toX(ball.x)) >= 30) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { id: event.pointerId, offset: ball.x - x, samples: [{ x: ball.x, time: event.timeStamp }] };
    ball.dragging = true;
    ball.vx = 0;
  };

  const onMove = (event) => {
    const drag = gesture.current;
    const ball = sim.current.ball;
    if (drag?.id !== event.pointerId || !ball.dragging) return;
    ball.x = Math.max(X_LO + 0.02, Math.min(X_HI - 0.02, pointerX(event) + drag.offset));
    drag.samples = drag.samples.filter(point => event.timeStamp - point.time <= 100);
    drag.samples.push({ x: ball.x, time: event.timeStamp });
  };

  const finishDrag = (event) => {
    const drag = gesture.current;
    if (drag?.id !== event.pointerId) return;
    const ball = sim.current.ball;
    if (event.type === "pointerup" && ball.dragging) {
      onMove(event);
      const first = drag.samples[0];
      const duration = Math.max(8, event.timeStamp - first.time);
      ball.vx = Math.max(-10, Math.min(10, (ball.x - first.x) * 1000 / duration));
    }
    ball.dragging = false;
    gesture.current = null;
  };

  const draw = useCallback((ts) => {
    loop(ts);
    const s = sim.current;
    const physP = s.physP || s.p;
    const activeList = s.activeList || [];
    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(draw); return; }
    const width = canvas.clientWidth || W;
    const pixelScale = Math.min(window.devicePixelRatio || 1, 2) * width / W;
    const bufferWidth = Math.round(W * pixelScale);
    const bufferHeight = Math.round(H * pixelScale);
    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    const fs = Math.max(1, W / width);
    const labelSize = Math.round(19 * fs);
    const sky = ctx.createLinearGradient(0, 0, W * 0.5, H);
    sky.addColorStop(0, "#211832");
    sky.addColorStop(0.52, "#11192e");
    sky.addColorStop(1, "#08263b");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(147,185,224,0.12)";
    ctx.lineWidth = 1;
    for (let yv = -2; yv <= 2.5; yv += 0.5) {
      const cy = toY(yv);
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    }

    const N = 500; // curve sample resolution — 500 points gives smooth curves at 800px wide
    const basePts = [];
    const physPts = [];
    for (let i = 0; i <= N; i++) {
      const lx = X_LO + (X_HI - X_LO) * (i / N);
      basePts.push([toX(lx), toY(energy(lx, BASE))]);
      physPts.push([toX(lx), toY(energy(lx, physP))]);
    }

    const lithConc = activeList.find(a => a.key === "lithium")?.conc || 0;
    const hasNonLithium = activeList.some(a => a.key !== "lithium" && a.conc > 0.01);

    // ── 1. Base landscape (ghost) ────────────────────────────────────
    ctx.beginPath();
    ctx.moveTo(basePts[0][0], H);
    for (const [px, py] of basePts) ctx.lineTo(px, py);
    ctx.lineTo(basePts[N][0], H);
    ctx.closePath();
    const terrainFill = ctx.createLinearGradient(0, 0, W, 0);
    terrainFill.addColorStop(0, "#ff766929");
    terrainFill.addColorStop(0.5, "#ffd16617");
    terrainFill.addColorStop(1, "#45d4ff30");
    ctx.fillStyle = terrainFill;
    ctx.fill();

    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      if (i === 0) ctx.moveTo(basePts[i][0], basePts[i][1]);
      else ctx.lineTo(basePts[i][0], basePts[i][1]);
    }
    const terrainEdge = ctx.createLinearGradient(0, 0, W, 0);
    zoneColors.forEach((color, index) => terrainEdge.addColorStop(index / 2, color));
    ctx.strokeStyle = activeList.length ? "#93a6c477" : terrainEdge;
    ctx.lineWidth = activeList.length ? 1.8 : 3.5;
    ctx.stroke();

    // ── 2. Per-modifier colored fills ────────────────────────────────────
    if (hasNonLithium || lithConc > 0.01) {
      for (const { key, conc } of activeList) {
        if (conc < 0.01 || key === "lithium") continue;
        const d = MODIFIERS[key];
        const [dr, dg, db] = hexRgb(d.color);

        const modifierTarget = blendSingleModifier(key, conc);
        const modifierPts = [];
        for (let i = 0; i <= N; i++) {
          const lx = X_LO + (X_HI - X_LO) * (i / N);
          modifierPts.push(toY(energy(lx, modifierTarget)));
        }

        // Fill where modifier raises the landscape (fills a dip)
        let drawing = false;
        let startIdx = 0;
        const fillAlpha = Math.min(0.35, conc * 0.4);
        ctx.fillStyle = `rgba(${dr},${dg},${db},${fillAlpha})`;

        for (let i = 0; i <= N; i++) {
          const baseY = basePts[i][1];
          const physY = physPts[i][1];
          const modifierY = modifierPts[i];
          const x = basePts[i][0];
          // Clip fill surface to the current smoothed landscape (physY)
          const fillTopY = Math.max(modifierY, physY);

          // 0.5 px threshold filters out near-zero differences caused by floating-point noise
          if (fillTopY < baseY - 0.5) {
            if (!drawing) {
              ctx.beginPath();
              ctx.moveTo(x, baseY);
              startIdx = i;
              drawing = true;
            }
            ctx.lineTo(x, fillTopY);
          } else if (drawing) {
            // Trace base curve backward to close correctly
            for (let j = i - 1; j >= startIdx; j--) ctx.lineTo(basePts[j][0], basePts[j][1]);
            ctx.closePath();
            ctx.fill();
            drawing = false;
          }
        }
        if (drawing) {
          for (let j = N; j >= startIdx; j--) ctx.lineTo(basePts[j][0], basePts[j][1]);
          ctx.closePath();
          ctx.fill();
        }

        // Top edge of fill (dashed line along the surface of the fill)
        ctx.beginPath();
        let edgeDrawing = false;
        for (let i = 0; i <= N; i++) {
          const baseY = basePts[i][1];
          const fillTopY = Math.max(modifierPts[i], physPts[i][1]);
          if (fillTopY < baseY - 0.5) {
            if (!edgeDrawing) { ctx.moveTo(basePts[i][0], fillTopY); edgeDrawing = true; }
            else ctx.lineTo(basePts[i][0], fillTopY);
          } else {
            edgeDrawing = false;
          }
        }
        ctx.strokeStyle = `rgba(${dr},${dg},${db},${fillAlpha + 0.15})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // ── 3. Lithium terrain ───────────────────────────────────────────
    if (lithConc > 0.01) {
      const [lr, lg, lb] = hexRgb(MODIFIERS.lithium.color);
      ctx.beginPath();
      ctx.moveTo(physPts[0][0], H);
      for (const [px, py] of physPts) ctx.lineTo(px, py);
      ctx.lineTo(physPts[N][0], H);
      ctx.closePath();
      const litFg = ctx.createLinearGradient(0, 0, 0, H);
      litFg.addColorStop(0, `rgba(${lr},${lg},${lb},0.03)`);
      litFg.addColorStop(1, `rgba(${lr},${lg},${lb},${0.12 * lithConc})`);
      ctx.fillStyle = litFg;
      ctx.fill();

      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        if (i === 0) ctx.moveTo(physPts[i][0], physPts[i][1]);
        else ctx.lineTo(physPts[i][0], physPts[i][1]);
      }
      ctx.strokeStyle = `rgba(${lr},${lg},${lb},${Math.min(1, lithConc + 0.3)})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // ── 4. Effective physics curve (when non-lithium modifiers active) ───
    if (hasNonLithium) {
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        if (i === 0) ctx.moveTo(physPts[i][0], physPts[i][1]);
        else ctx.lineTo(physPts[i][0], physPts[i][1]);
      }
      ctx.strokeStyle = "#e3efffcc";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── 5. D2 Barrier (antipsychotics) ───────────────────────────────
    // Only render the barrier glow once the barrier height exceeds a visible threshold
    if (s.p.barrierH > 0.15) {
      const bx = toX(BARRIER.cx);
      const bTop = toY(energy(BARRIER.cx, physP));
      const alpha = Math.min(0.75, s.p.barrierH / 4);
      const bg = ctx.createLinearGradient(bx, bTop - 50, bx, H);
      bg.addColorStop(0,    `rgba(52,152,219,0)`);
      bg.addColorStop(0.15, `rgba(52,152,219,${alpha * 0.7})`);
      bg.addColorStop(0.7,  `rgba(52,152,219,${alpha * 0.3})`);
      bg.addColorStop(1,    `rgba(52,152,219,0)`);
      ctx.fillStyle = bg;
      ctx.fillRect(bx - 5, bTop - 50, 10, H - bTop + 50);
      ctx.fillStyle = "#8bdcff";
      ctx.font = displayFont(Math.round(13 * fs));
      ctx.textAlign = "center";
      ctx.fillText(t("ui.barrier"), bx, Math.max(16 * fs, bTop - 55));
    }

    // ── 6. Zone labels ───────────────────────────────────────────────
    const zones = [
      { lx: -0.68, label: t("ui.mania"),      zc: zoneColors[0], face: "mania", caption: t("ui.irritability") },
      { lx:  0.00, label: t("ui.euthymia"),   zc: zoneColors[1] },
      { lx:  0.68, label: t("ui.depression"), zc: zoneColors[2], face: "depression" },
    ];
    for (const z of zones) {
      const ly  = energy(z.lx, physP);
      const cx  = toX(z.lx);
      const cy  = toY(ly);
      // Finite-difference second derivative: positive → concave up → local minimum → stable well
      const g2  = energy(z.lx + 0.01, physP) - 2 * energy(z.lx, physP) + energy(z.lx - 0.01, physP);
      const stb = g2 > 0;
      const iconSize = 21 * fs;
      const extraHeight = z.face ? iconSize + 3 * fs : 0;
      const offset = 23 + labelSize * 0.65;
      const below = stb && cy + offset + labelSize / 2 + extraHeight < H - 3 * fs;
      const labelY = Math.max(labelSize / 2 + 3 * fs, Math.min(H - labelSize / 2 - extraHeight - 3 * fs,
        below ? cy + offset : cy - offset - extraHeight));
      const tipY = below ? labelY - labelSize * 0.6 - 3 : labelY + labelSize * 0.6 + extraHeight + 3;
      ctx.strokeStyle = z.zc;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy + (below ? 4 : -4));
      ctx.lineTo(cx, tipY);
      ctx.stroke();
      ctx.fillStyle = z.zc;
      ctx.beginPath();
      ctx.moveTo(cx, tipY);
      ctx.lineTo(cx - 3 * fs, tipY + (stb ? -1 : 1) * 4 * fs);
      ctx.lineTo(cx + 3 * fs, tipY + (stb ? -1 : 1) * 4 * fs);
      ctx.fill();

      ctx.save();
      ctx.font = displayFont(labelSize);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Outline keeps labels legible over active modifier overlays.
      ctx.lineJoin = "round";
      ctx.lineWidth = 4 * fs;
      ctx.strokeStyle = "#101728";
      ctx.strokeText(z.label, cx, labelY, W * 0.29);
      ctx.fillText(z.label, cx, labelY, W * 0.29);
      if (z.face) {
        ctx.font = displayFont(Math.round(13 * fs));
        const gap = 3 * fs;
        const maxTextWidth = W * 0.32 - iconSize - gap;
        const captionWidth = z.caption ? Math.min(maxTextWidth, ctx.measureText(z.caption).width) + gap : 0;
        const left = cx - (iconSize + captionWidth) / 2;
        const top = labelY + labelSize / 2 + gap;
        const image = faces.current[z.face];
        if (image?.complete && image.naturalWidth) ctx.drawImage(image, left, top, iconSize, iconSize);
        if (z.caption) {
          ctx.textAlign = "left";
          ctx.strokeText(z.caption, left + iconSize + gap, top + iconSize / 2, maxTextWidth);
          ctx.fillText(z.caption, left + iconSize + gap, top + iconSize / 2, maxTextWidth);
        }
      }
      ctx.restore();
    }

    // ── 7. GABA oil (clonazepam) ─────────────────────────────────────
    // damping < 0.86 = active sedation; gravity < 4 = not dominated by a stimulant
    // (stimulants override the sedation effect so we skip the oil overlay)
    if (s.p.damping < 0.86 && s.p.gravity < 4) {
      const oilAlpha = Math.min(0.18, (0.86 - s.p.damping) * 2);
      ctx.beginPath();
      ctx.moveTo(basePts[0][0], H);
      for (const [px, py] of basePts) ctx.lineTo(px, py);
      ctx.lineTo(basePts[N][0], H);
      ctx.closePath();
      ctx.fillStyle = `rgba(26,188,156,${oilAlpha})`;
      ctx.fill();
      ctx.fillStyle = "#8ef5d5";
      ctx.font = displayFont(Math.round(13 * fs));
      ctx.textAlign = "center";
      ctx.fillText(t("ui.gabaOil"), W / 2, PAD - 8);
    }

    // ── 8. Valproate trail ───────────────────────────────────────────
    // Show a ghost trail when damping is mildly elevated (0.86–0.96) — the range
    // valproate produces without the full sedation of benzodiazepines (< 0.86)
    if (s.p.damping < 0.96 && s.p.damping >= 0.86 && s.trail.length > 4) {
      for (let i = 0; i < s.trail.length - 1; i++) {
        const a = (i / s.trail.length) * 0.28;
        const tx = s.trail[i];
        const ty = energy(tx, physP);
        ctx.fillStyle = `rgba(155,89,182,${a})`;
        ctx.beginPath();
        ctx.arc(toX(tx), toY(ty) - BALL_R, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ── 9. Ball ──────────────────────────────────────────────────────
    const bly = energy(s.ball.x, physP);
    const bCX = toX(s.ball.x);
    const bCY = toY(bly) - BALL_R;

    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#8ab";
    ctx.beginPath();
    ctx.ellipse(bCX, toY(bly) + 3, BALL_R * 1.3, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const glow = ctx.createRadialGradient(bCX, bCY, 0, bCX, bCY, 26);
    glow.addColorStop(0, "rgba(255,237,187,0.42)");
    glow.addColorStop(1, "rgba(255,215,142,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bCX, bCY, 26, 0, Math.PI * 2);
    ctx.fill();

    const ballG = ctx.createRadialGradient(bCX - 3, bCY - 3, 2, bCX, bCY, BALL_R);
    ballG.addColorStop(0,    "#ffffff");
    ballG.addColorStop(0.45, "#ffefc5");
    ballG.addColorStop(1,    "#b87648");
    ctx.fillStyle = ballG;
    ctx.beginPath();
    ctx.arc(bCX, bCY, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    rafRef.current = requestAnimationFrame(draw);
  }, [loop, sim, t]); // t changes when language changes, triggering redraw

  useEffect(() => {
    document.fonts?.load(displayFont(20), "MANİ ÖTİMİ DEPRESYON").catch(() => {});
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div className="canvas-container" style={{ position: "relative", flexShrink: 1, minWidth: 0 }}>
      <canvas aria-label={t("ui.landscapeDescription")} ref={canvasRef} width={W} height={H}
        style={{ borderRadius: 12, aspectRatio: `${W} / ${H}`, border: "1px solid #405271", cursor: "grab", touchAction: "none", display: "block", boxShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={finishDrag}
        onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}
      />
    </div>
  );
}
