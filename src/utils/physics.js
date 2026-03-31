import { PAD, X_LO, X_HI, Y_LO, Y_HI, BARRIER, W, H } from "../constants";

export function toX(lx) { return ((lx - X_LO) / (X_HI - X_LO)) * W; }
export function toY(ly) { return PAD + ((Y_HI - ly) / (Y_HI - Y_LO)) * (H - 2 * PAD); }
export function fromX(cx){ return ((cx / W) * (X_HI - X_LO)) + X_LO; }
export function lerp(a, b, t) { return a + (b - a) * t; }

export function energy(x, p) {
  let y = p.wallStr * x * x;
  for (const w of p.wells) {
    if (w.depth < 0.001) continue;
    const d = x - w.cx;
    y -= w.depth * Math.exp(-d * d / (2 * w.w * w.w));
  }
  if (p.barrierH > 0.01) {
    const d = x - BARRIER.cx;
    y += p.barrierH * Math.exp(-d * d / (2 * BARRIER.w * BARRIER.w));
  }
  return y;
}

export function grad(x, p) {
  let dy = 2 * p.wallStr * x;
  for (const w of p.wells) {
    if (w.depth < 0.001) continue;
    const d = x - w.cx;
    dy += w.depth * (d / (w.w * w.w)) * Math.exp(-d * d / (2 * w.w * w.w));
  }
  if (p.barrierH > 0.01) {
    const d = x - BARRIER.cx;
    dy += p.barrierH * (-d / (BARRIER.w * BARRIER.w)) * Math.exp(-d * d / (2 * BARRIER.w * BARRIER.w));
  }
  return dy;
}

export function hexRgb(h) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}
