import base from './base.yaml';
import { lerp } from '../utils/physics';

const modules = import.meta.glob('./modifiers/*.yaml', { eager: true });

export const MODIFIERS = Object.fromEntries(
  Object.entries(modules)
    .map(([path, mod]) => [
      path.replace('./modifiers/', '').replace('.yaml', ''),
      mod.default ?? mod,
    ])
    .filter(([key]) => !key.startsWith('_'))
);

export const BASE = base.default ?? base;

/**
 * Compute the landscape parameters for a single modifier at a given concentration.
 * Used by the canvas to draw per-drug fill regions showing what each drug contributes.
 * (For blending multiple active drugs together, see blendParams in useSimulation.js.)
 */
export function blendSingleModifier(key, conc) {
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
