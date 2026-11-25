import { BASE } from "../data/modifiers";
import { advanceBall } from "./physics";

const stepsPerSecond = 60;
export const observationSeconds = 8;
export const referenceDelay = 0.25;

export function simulateTwoImpulses(startX, impulse, delaySeconds) {
  const ball = { x: startX, vx: impulse };
  const positions = [startX];
  const secondStep = Math.round(delaySeconds * stepsPerSecond);
  let before, after;

  for (let step = 0; step < observationSeconds * stepsPerSecond; step++) {
    if (step === secondStep) {
      before = Math.abs(ball.vx);
      ball.vx += impulse;
      after = Math.abs(ball.vx);
    }
    advanceBall(ball, BASE, 1 / stepsPerSecond);
    positions.push(ball.x);
  }
  return { positions, secondPosition: positions[secondStep], before, after };
}
