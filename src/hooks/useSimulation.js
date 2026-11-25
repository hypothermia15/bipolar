import { useState, useRef, useCallback } from "react";
import { MODIFIERS, BASE } from "../data/modifiers";
import { lerp, advanceBall, stressorVelocity } from "../utils/physics";

function createRun(startIndex) {
  return {
    ball: { x: BASE.wells[startIndex].cx, vx: 0, dragging: false },
    p: { ...BASE, wells: BASE.wells.map(w => ({ ...w })) },
    trail: [],
    lastTime: null,
    elapsed: 0,
  };
}

export function useSimulation() {
  const [activeModifiers, setActiveModifiers] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [startIndex, setStartIndex] = useState(2);
  const modifiersRef = useRef({});
  const [, forceUpdate] = useState(0);
  const sim = useRef(null);
  if (sim.current === null) sim.current = createRun(startIndex);

  const reset = (index = startIndex) => {
    sim.current = createRun(index);
    modifiersRef.current = {};
    setActiveModifiers({});
    setStartIndex(index);
  };

  const launch = (velocity) => {
    const state = sim.current;
    state.ball = { x: BASE.wells[startIndex].cx, vx: velocity, dragging: false };
    state.trail = [];
    state.lastTime = null;
  };

  const togglePause = () => {
    sim.current.lastTime = null;
    sim.current.ball.dragging = false;
    setIsPaused(paused => !paused);
  };

  const toggleModifier = useCallback((key) => {
    const cur = modifiersRef.current[key];
    if (cur && cur.on) {
      modifiersRef.current[key] = { ...cur, on: false, phase: "decay" };
    } else {
      const conc = cur?.conc ?? 0;
      modifiersRef.current[key] = { on: true, conc, phase: "onset", kicked: conc >= 0.5 };
    }
    setActiveModifiers({ ...modifiersRef.current });
  }, []);

  const disturb = useCallback((scale = 1) => {
    // Scale the impulse while preserving the original moderate stressor.
    sim.current.ball.vx += stressorVelocity(scale);
  }, []);

  const blendParams = useCallback((activeList) => {
    let totalWeight = 0;
    const avg = {
      wallStr: BASE.wallStr,
      wells: BASE.wells.map(w => ({ ...w })),
      damping: BASE.damping,
      gravity: BASE.gravity,
      barrierH: 0,
      jitter: 0,
    };

    for (const { key, conc } of activeList) {
      if (conc < 0.001) continue;
      const d = MODIFIERS[key];
      totalWeight += conc;
      const w = conc / totalWeight;
      avg.wallStr = lerp(avg.wallStr, d.wallStr, w);
      avg.damping = lerp(avg.damping, d.damping, w);
      avg.gravity = lerp(avg.gravity, d.gravity, w);
      avg.barrierH = Math.max(avg.barrierH, (d.barrierH || 0) * conc);
      avg.jitter = Math.max(avg.jitter, (d.jitter || 0) * conc);
      for (let i = 0; i < 3; i++) {
        avg.wells[i].depth = lerp(avg.wells[i].depth, d.wells[i].depth, w);
        avg.wells[i].w = lerp(avg.wells[i].w, d.wells[i].w, w);
      }
    }

    if (totalWeight < 0.001) return BASE;

    const blend = Math.min(1, totalWeight);
    const result = { ...BASE, wells: BASE.wells.map(w => ({ ...w })) };
    result.wallStr = lerp(BASE.wallStr, avg.wallStr, blend);
    result.damping = lerp(BASE.damping, avg.damping, blend);
    result.gravity = lerp(BASE.gravity, avg.gravity, blend);
    result.barrierH = avg.barrierH;
    result.jitter = avg.jitter;
    for (let i = 0; i < 3; i++) {
      result.wells[i].depth = lerp(BASE.wells[i].depth, avg.wells[i].depth, blend);
      result.wells[i].w = lerp(BASE.wells[i].w, avg.wells[i].w, blend);
    }
    return result;
  }, []);

  const loop = useCallback((ts) => {
    if (isPaused) return;
    const s = sim.current;
    if (s.lastTime === null) s.lastTime = ts;
    // Cap dt at 40 ms so physics don't explode if the tab is backgrounded
    const dt = Math.min((ts - s.lastTime) / 1000, 0.04);
    s.lastTime = ts;
    s.elapsed += dt;

    let changed = false;
    const modifiers = modifiersRef.current;
    for (const key of Object.keys(modifiers)) {
      const d = modifiers[key];
      const cfg = MODIFIERS[key];
      if (d.phase === "onset") {
        const rate = dt / cfg.onset;
        d.conc = Math.min(1, d.conc + rate);
        // Trigger the "kick" once when the drug crosses 50% peak concentration —
        // models the acute destabilising effect some drugs have on initial onset.
        // The ±30% jitter (0.7–1.3 multiplier) prevents identical-looking effects.
        if (cfg.kick && !d.kicked && d.conc >= 0.5) {
          s.ball.vx += (Math.random() > 0.5 ? 1 : -1) * (cfg.kick * (0.7 + Math.random() * 0.6));
          d.kicked = true;
        }
        if (d.conc >= 0.999) { d.conc = 1; d.phase = "decay"; }
        changed = true;
      } else if (d.phase === "decay" && d.conc > 0) {
        // When manually turned off, use a 3× faster decay to simulate abrupt discontinuation
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
    // Smoothing speed: parameters follow the target with a ~3.5× real-time rate,
    // giving a ~0.3 s visual transition when a drug activates or wears off
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
      // Jitter: superimpose two sine waves at different frequencies on the mania and
      // depression wells (not euthymia, i === 1) to simulate the unpredictability of
      // those states. The two frequencies per well are chosen to be incommensurate so
      // the combined motion never exactly repeats.
      wells: s.p.wells.map((w, i) => {
        if (s.p.jitter < 0.01 || i === 1) return w;
        const time = s.elapsed;
        const j = s.p.jitter * (
          Math.sin(time * (i === 0 ? 2.3 : 1.7) + i * 1.5) * 0.35 +
          Math.sin(time * (i === 0 ? 3.9 : 4.3) + i * 0.8) * 0.2
        );
        return { ...w, depth: Math.max(0.3, w.depth + j) };
      }),
    };

    if (!s.ball.dragging) advanceBall(s.ball, physP, dt);

    s.trail.push(s.ball.x);
    if (s.trail.length > 28) s.trail.shift();

    sim.current.physP = physP;
  }, [blendParams, isPaused]);

  return { sim, activeModifiers, toggleModifier, disturb, loop, isPaused, togglePause, startIndex, reset, launch };
}
