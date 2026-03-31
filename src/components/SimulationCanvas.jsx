import React, { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { W, H, PAD, BALL_R, X_LO, X_HI, BARRIER } from "../constants";
import { toX, toY, fromX, energy, lerp, hexRgb } from "../utils/physics";
import { MODIFIERS, BASE } from "../data/modifiers";

function blendSingleModifier(key, conc) {
  const d = MODIFIERS[key];
  const result = {
    wallStr: BASE.wallStr,
    wells: BASE.wells.map(w => ({ ...w })),
    damping: BASE.damping,
    gravity: BASE.gravity,
    barrierH: BASE.barrierH,
    jitter: BASE.jitter,
  };
  result.wallStr  = lerp(result.wallStr,  d.wallStr,  conc);
  result.damping  = lerp(result.damping,  d.damping,  conc);
  result.gravity  = lerp(result.gravity,  d.gravity,  conc);
  result.barrierH = Math.max(result.barrierH, (d.barrierH || 0) * conc);
  result.jitter   = Math.max(result.jitter,   (d.jitter   || 0) * conc);
  for (let i = 0; i < 3; i++) {
    result.wells[i].depth = lerp(result.wells[i].depth, d.wells[i].depth, conc);
    result.wells[i].w     = lerp(result.wells[i].w,     d.wells[i].w,     conc);
  }
  return result;
}

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
    ctx.fillStyle = "#0d0d1b";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let yv = -2; yv <= 2.5; yv += 0.5) {
      const cy = toY(yv);
      ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke();
    }

    const N = 500;
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
        ctx.beginPath();
        let drawing = false;
        for (let i = 0; i <= N; i++) {
          const baseY = basePts[i][1];
          const modifierY = modifierPts[i];
          const x = basePts[i][0];
          if (modifierY < baseY - 0.5) {
            if (!drawing) { ctx.moveTo(x, baseY); drawing = true; }
            ctx.lineTo(x, modifierY);
          } else {
            if (drawing) { ctx.lineTo(x, basePts[i][1]); drawing = false; }
          }
        }
        if (drawing) ctx.lineTo(basePts[N][0], basePts[N][1]);
        ctx.closePath();

        const fillAlpha = Math.min(0.35, conc * 0.4);
        ctx.fillStyle = `rgba(${dr},${dg},${db},${fillAlpha})`;
        ctx.fill();

        // Top edge of fill
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const baseY = basePts[i][1];
          const modifierY = modifierPts[i];
          const x = basePts[i][0];
          if (modifierY < baseY - 0.5) {
            if (i === 0 || !(modifierPts[i-1] < basePts[i-1][1] - 0.5)) ctx.moveTo(x, modifierY);
            else ctx.lineTo(x, modifierY);
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
    const valpConc = activeList.find(a => a.key === "valproate")?.conc || 0;
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
        style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", cursor: "grab", touchAction: "none", display: "block" }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      />
      <button
        onClick={(e) => { e.stopPropagation(); disturb(); }}
        style={{
          position: "absolute", bottom: 15, left: 15, zIndex: 10,
          padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12,
          border: "2px solid #ffbe3c55", color: "#ffbe3cbb", background: "rgba(255,190,60,0.1)",
          backdropFilter: "blur(4px)", transition: "all 0.2s"
        }}
      >
        {t("ui.stressor")}
      </button>
    </div>
  );
}
