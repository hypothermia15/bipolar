import React, { useRef, useEffect, useCallback } from "react";
import { W, H, PAD, BALL_R, X_LO, X_HI, BARRIER } from "../constants";
import { toX, toY, fromX, energy } from "../utils/physics";
import { BASE } from "../data/drugs";
import { translations } from "../locales";

export default function SimulationCanvas({ sim, loop, disturb, lang }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const t = translations[lang].ui;

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
    const canvas = canvasRef.current;
    if (!canvas) return;
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

    const N = 250;
    const ptsBase = [];
    const ptsActive = [];
    for (let i = 0; i <= N; i++) {
      const lx = X_LO + (X_HI - X_LO) * (i / N);
      ptsBase.push({ x: toX(lx), y: toY(energy(lx, BASE)) });
      ptsActive.push({ x: toX(lx), y: toY(energy(lx, physP)) });
    }

    // Fills between curves
    ctx.save();
    for (let i = 0; i < N; i++) {
      const b1 = ptsBase[i], b2 = ptsBase[i+1];
      const a1 = ptsActive[i], a2 = ptsActive[i+1];
      
      const diff = a1.y - b1.y;
      if (Math.abs(diff) > 0.5) {
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(a2.x, a2.y);
        ctx.lineTo(a1.x, a1.y);
        ctx.closePath();
        
        // Color based on side (mania=reddish, depression=blueish)
        const isManiaSide = b1.x < toX(-0.2);
        const color = isManiaSide ? "rgba(231, 76, 60, 0.12)" : "rgba(52, 152, 219, 0.12)";
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
    ctx.restore();

    // Base Curve (Dashed)
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1.5;
    ptsBase.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.setLineDash([]);

    // Active Curve
    ctx.beginPath();
    ctx.strokeStyle = "#ff4757";
    ctx.lineWidth = 3;
    ptsActive.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Barrier Visualization
    if (s.p.barrierH > 0.05) {
      const bx = toX(BARRIER.cx);
      const gradB = ctx.createLinearGradient(bx - 15, 0, bx + 15, 0);
      gradB.addColorStop(0, "transparent");
      gradB.addColorStop(0.5, `rgba(100, 150, 255, ${Math.min(0.4, s.p.barrierH * 0.3)})`);
      gradB.addColorStop(1, "transparent");
      ctx.fillStyle = gradB;
      ctx.fillRect(bx - 15, PAD, 30, H - 2 * PAD);
      
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "bold 8px system-ui";
      ctx.fillText(t.barrier, bx, PAD + 20);
    }

    // State Labels & Arrows
    const drawLabel = (label, lx, color, above = false) => {
      const px = toX(lx);
      const py = toY(energy(lx, physP));
      const dir = above ? -1 : 1;
      
      ctx.fillStyle = color;
      ctx.font = "bold 9px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(label, px, py + dir * 38 + (above ? 0 : 5));
      
      // Dashed Arrow Stem
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(px, py + dir * 8);
      ctx.lineTo(px, py + dir * 28);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Arrow Head
      ctx.beginPath();
      ctx.moveTo(px - 2.5, py + dir * 24);
      ctx.lineTo(px, py + dir * 28);
      ctx.lineTo(px + 2.5, py + dir * 24);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    drawLabel(t.mania, -0.68, "#ff5e57", false);
    drawLabel(t.euthymia, 0.0, "#ffdd59", true);
    drawLabel(t.depression, 0.68, "#54a0ff", false);

    // GABA Effect (Oil)
    if (s.p.damping < 0.86) {
      const oilAlpha = Math.min(0.15, (0.86 - s.p.damping) * 1.2);
      ctx.fillStyle = `rgba(26,188,156,${oilAlpha})`;
      ctx.fillRect(PAD, PAD, W - 2 * PAD, H - 2 * PAD);
    }

    // Ball & Trail
    if (s.trail.length > 2) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      s.trail.forEach((tx, i) => {
        const ty = toY(energy(tx, physP)) - BALL_R;
        if (i === 0) ctx.moveTo(toX(tx), ty); else ctx.lineTo(toX(tx), ty);
      });
      ctx.stroke();
    }

    const bly = energy(s.ball.x, physP);
    const bCX = toX(s.ball.x);
    const bCY = toY(bly) - BALL_R;

    // Ball Glow
    const glow = ctx.createRadialGradient(bCX, bCY, 0, bCX, bCY, 24);
    glow.addColorStop(0, "rgba(100, 180, 255, 0.3)");
    glow.addColorStop(1, "rgba(100, 180, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(bCX, bCY, 24, 0, Math.PI * 2); ctx.fill();

    const ballG = ctx.createRadialGradient(bCX - 3, bCY - 3, 2, bCX, bCY, BALL_R);
    ballG.addColorStop(0, "#ffffff");
    ballG.addColorStop(0.5, "#8ebfff");
    ballG.addColorStop(1, "#3355aa");
    ctx.fillStyle = ballG;
    ctx.beginPath(); ctx.arc(bCX, bCY, BALL_R, 0, Math.PI * 2); ctx.fill();

    rafRef.current = requestAnimationFrame(draw);
  }, [loop, sim, t]);

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
        {t.stressor}
      </button>
    </div>
  );
}
