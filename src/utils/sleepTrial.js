import { BASE } from "../data/modifiers";
import { advanceBall } from "./physics";

export const weeks = [
  { name: "regular", hours: [7, 7, 7, 7, 7, 7, 7] },
  { name: "variable", hours: [5, 9, 5, 9, 7, 5, 9] },
];
export const stepsPerSecond = 60;
export const duration = 12;

export function simulateWeek(hours, startX, impulse) {
  const mean = hours.reduce((sum, h) => sum + h, 0) / hours.length;
  const spread = Math.sqrt(hours.reduce((sum, h) => sum + (h - mean) ** 2, 0) / hours.length);
  // Illustrative mapping: more variable sleep retains more velocity per step.
  const params = { ...BASE, damping: Math.min(0.999, BASE.damping + 0.004 * spread) };
  const ball = { x: startX, vx: impulse };
  const positions = [startX];
  let peak = 0;
  let lastOutside = -1;
  for (let step = 1; step <= duration * stepsPerSecond; step++) {
    advanceBall(ball, params, 1 / stepsPerSecond);
    positions.push(ball.x);
    const distance = Math.abs(ball.x - startX);
    peak = Math.max(peak, distance);
    if (distance > 0.1) lastOutside = step;
  }
  const returnTime = (lastOutside + 1) / stepsPerSecond;
  return { positions, peak, returnTime: returnTime <= duration - 0.5 ? returnTime : null };
}
