import React, { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { W, H, PAD, BALL_R, X_LO, X_HI, BARRIER } from "../constants";
import { toX, toY, fromX, energy, hexRgb } from "../utils/physics";
import { MODIFIERS, BASE, blendSingleModifier } from "../data/modifiers";

export default function SimulationCanvas({ sim, loop, disturb }) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const onDown = (e) => {
    const s = sim.current;
    if (Math.abs(mouseX(e) - toX(s.ball.x)) < 30) {
      s.ball.dragging = true; s.ball.vx = 0;
    }
  };
  const onMove = (e) => {
    const s = sim.current;
    if (!s.ball.dragging) return;
    s.ball.x = Math.max(X_LO + 0.02, Math.min(X_HI - 0.02, fromX(mouseX(e))));
  };
  const onUp = () => { sim.current.ball.dragging = false; };

  const mouseX = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const c = e.touches ? e.touches[0].clientX : e.clientX;
    return (c - r.left) * (canvasRef.current.width / r.width);
  };

  const draw = useCallback((ts) => {
    loop(ts);
    const s = sim.current;
    const physP = s.physP || s.p;
    const activeList = s.activeList || [];
    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(draw); return; }
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0b18";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
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
    const baseFg = ctx.createLinearGradient(0, 0, 0, H);
    baseFg.addColorStop(0, "rgba(231,76,60,0.02)");
    baseFg.addColorStop(1, "rgba(231,76,60,0.08)");
    ctx.fillStyle = baseFg;
    ctx.fill();

    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      if (i === 0) ctx.moveTo(basePts[i][0], basePts[i][1]);
      else ctx.lineTo(basePts[i][0], basePts[i][1]);
    }
    ctx.strokeStyle = activeList.length > 0 ? "rgba(231,76,60,0.25)" : "#e74c3c";
    ctx.lineWidth = activeList.length > 0 ? 1.5 : 2.5;
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
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
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
      ctx.fillStyle = `rgba(52,152,219,${alpha})`;
      ctx.font = "bold 8px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(t("ui.barrier"), bx, bTop - 55);
    }

    // ── 6. Zone labels ───────────────────────────────────────────────
    const zones = [
      { lx: -0.68, label: t("ui.mania"),      zc: "#e74c3c" },
      { lx:  0.00, label: t("ui.euthymia"),   zc: "#f1c40f" },
      { lx:  0.68, label: t("ui.depression"), zc: "#3498db" },
    ];
    for (const z of zones) {
      const ly  = energy(z.lx, physP);
      const cx  = toX(z.lx);
      const cy  = toY(ly);
      // Finite-difference second derivative: positive → concave up → local minimum → stable well
      const g2  = energy(z.lx + 0.01, physP) - 2 * energy(z.lx, physP) + energy(z.lx - 0.01, physP);
      const stb = g2 > 0;
      ctx.strokeStyle = z.zc + "44";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy + (stb ? 4 : -4));
      ctx.lineTo(cx, cy + (stb ? 26 : -26));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = z.zc + "bb";
      ctx.font = "bold 9px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(z.label, cx, cy + (stb ? 38 : -36));
      ctx.font = "8px system-ui";
      ctx.fillStyle = z.zc + "77";
      ctx.fillText(stb ? "▼" : "▲", cx, cy + (stb ? 27 : -26));
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
      ctx.fillStyle = `rgba(26,188,156,${oilAlpha + 0.15})`;
      ctx.font = "bold 9px system-ui, sans-serif";
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
    glow.addColorStop(0, "rgba(160,200,255,0.26)");
    glow.addColorStop(1, "rgba(100,150,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bCX, bCY, 26, 0, Math.PI * 2);
    ctx.fill();

    const ballG = ctx.createRadialGradient(bCX - 3, bCY - 3, 2, bCX, bCY, BALL_R);
    ballG.addColorStop(0,    "#ffffff");
    ballG.addColorStop(0.45, "#c8dcff");
    ballG.addColorStop(1,    "#3355aa");
    ctx.fillStyle = ballG;
    ctx.beginPath();
    ctx.arc(bCX, bCY, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    rafRef.current = requestAnimationFrame(draw);
  }, [loop, sim, t]); // t changes when language changes, triggering redraw

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div className="canvas-container" style={{ position: "relative", flexShrink: 1, minWidth: 0 }}>
      <canvas ref={canvasRef} width={W} height={H}
        style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", cursor: "grab", touchAction: "none", display: "block", boxShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      />
      <button
        onClick={(e) => { e.stopPropagation(); disturb(); }}
        style={{
          position: "absolute", bottom: 14, left: 14, zIndex: 10,
          padding: "5px 11px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 11,
          border: "1px solid rgba(255,190,60,0.35)", color: "rgba(255,190,60,0.75)",
          background: "rgba(255,190,60,0.07)", backdropFilter: "blur(6px)",
          transition: "all 0.2s", fontFamily: "'DM Sans', system-ui, sans-serif"
        }}
      >
        {t("ui.stressor")}
      </button>
    </div>
  );
}
