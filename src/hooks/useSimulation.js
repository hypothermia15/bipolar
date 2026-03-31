import { useState, useEffect, useRef, useCallback } from "react";
import { MODIFIERS, BASE } from "../data/modifiers";
import { lerp, grad } from "../utils/physics";
import { X_LO, X_HI } from "../constants";

export function useSimulation() {
  const [activeModifiers, setActiveModifiers] = useState({});
  const modifiersRef = useRef({});
  const [, forceUpdate] = useState(0);

  const sim = useRef({
    ball: { x: 0.68, vx: 0, dragging: false },
    p: { ...BASE, wells: BASE.wells.map(w => ({ ...w })) },
    trail: [],
    lastTime: null,
  });

  const toggleModifier = useCallback((key) => {
    const cur = modifiersRef.current[key];
    if (cur && cur.on) {
      modifiersRef.current[key] = { on: false, conc: 0, phase: "decay", kicked: false };
    } else {
      modifiersRef.current[key] = { on: true, conc: cur ? cur.conc : 0, phase: "onset", kicked: false };
    }
    setActiveModifiers({ ...modifiersRef.current });
  }, []);

  const disturb = useCallback(() => {
    sim.current.ball.vx += (Math.random() > 0.5 ? 1 : -1) * (3.5 + Math.random() * 1.2);
  }, []);

  const blendParams = useCallback((activeList) => {
    let totalWeight = 0;
    const result = {
      wallStr: BASE.wallStr,
      wells: BASE.wells.map(w => ({ ...w })),
      damping: BASE.damping,
      gravity: BASE.gravity,
      barrierH: BASE.barrierH,
      jitter: BASE.jitter,
    };

    for (const { key, conc } of activeList) {
      if (conc < 0.001) continue;
      const d = MODIFIERS[key];
      totalWeight += conc;
      result.wallStr  = lerp(result.wallStr,  d.wallStr,  conc / totalWeight);
      result.damping  = lerp(result.damping,  d.damping,  conc / totalWeight);
      result.gravity  = lerp(result.gravity,  d.gravity,  conc / totalWeight);
      result.barrierH = Math.max(result.barrierH, (d.barrierH || 0) * conc);
      result.jitter   = Math.max(result.jitter, (d.jitter || 0) * conc);
      for (let i = 0; i < 3; i++) {
        result.wells[i].depth = lerp(result.wells[i].depth, d.wells[i].depth, conc / totalWeight);
        result.wells[i].w     = lerp(result.wells[i].w,     d.wells[i].w,     conc / totalWeight);
      }
    }
    return result;
  }, []);

  const loop = useCallback((ts) => {
    const s = sim.current;
    if (!s.lastTime) s.lastTime = ts;
    const dt = Math.min((ts - s.lastTime) / 1000, 0.04);
    s.lastTime = ts;

    let changed = false;
    const modifiers = modifiersRef.current;
    for (const key of Object.keys(modifiers)) {
      const d = modifiers[key];
      const cfg = MODIFIERS[key];
      if (d.phase === "onset") {
        const rate = dt / cfg.onset;
        d.conc = Math.min(1, d.conc + rate);
        if (cfg.kick && !d.kicked && d.conc >= 0.5) {
          s.ball.vx += (Math.random() > 0.5 ? 1 : -1) * (cfg.kick * (0.7 + Math.random() * 0.6));
          d.kicked = true;
        }
        if (d.conc >= 0.999) { d.conc = 1; d.phase = "decay"; }
        changed = true;
      } else if (d.phase === "decay") {
        const hl = d.on ? cfg.halfLife : cfg.halfLife / 3;
        d.conc *= Math.pow(0.5, dt / hl);
        if (d.conc < 0.005) { d.conc = 0; }
        changed = true;
      }
    }
    if (changed) forceUpdate(n => n + 1);

    const activeList = Object.entries(modifiers)
      .filter(([, d]) => d.conc > 0.001)
      .map(([key, d]) => ({ key, conc: d.conc }));

    sim.current.activeList = activeList;

    const target = activeList.length > 0 ? blendParams(activeList) : BASE;
    const t = Math.min(dt * 3.5, 1);

    s.p.wallStr  += (target.wallStr  - s.p.wallStr)  * t;
    s.p.damping  += (target.damping  - s.p.damping)  * t;
    s.p.gravity  += (target.gravity  - s.p.gravity)  * t;
    s.p.barrierH += (target.barrierH - s.p.barrierH) * t;
    s.p.jitter   += (target.jitter   - s.p.jitter)   * t;

    for (let i = 0; i < 3; i++) {
      s.p.wells[i].depth += (target.wells[i].depth - s.p.wells[i].depth) * t;
      s.p.wells[i].w     += (target.wells[i].w     - s.p.wells[i].w)     * t;
    }

    const physP = {
      ...s.p,
      wells: s.p.wells.map((w, i) => {
        if (s.p.jitter < 0.01 || i === 1) return w;
        const time = ts / 1000;
        const j = s.p.jitter * (
          Math.sin(time * (i === 0 ? 2.3 : 1.7) + i * 1.5) * 0.35 +
          Math.sin(time * (i === 0 ? 3.9 : 4.3) + i * 0.8) * 0.2
        );
        return { ...w, depth: Math.max(0.3, w.depth + j) };
      }),
    };

    if (!s.ball.dragging) {
      const slope = grad(s.ball.x, physP);
      s.ball.vx += -slope * s.p.gravity * dt;
      s.ball.vx *= Math.pow(s.p.damping, dt * 60);
      s.ball.x  += s.ball.vx * dt;
      if (s.ball.x < X_LO + 0.02) { s.ball.x = X_LO + 0.02; s.ball.vx *= -0.3; }
      if (s.ball.x > X_HI - 0.02) { s.ball.x = X_HI - 0.02; s.ball.vx *= -0.3; }
    }

    s.trail.push(s.ball.x);
    if (s.trail.length > 28) s.trail.shift();

    sim.current.physP = physP;
  }, [blendParams]);

  return { sim, activeModifiers, toggleModifier, disturb, loop };
}
