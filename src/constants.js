// Canvas dimensions (pixels)
export const W = 800;
export const H = 420;

// Vertical padding inside the canvas for the curve drawing area
export const PAD = 52;

// Ball radius (pixels)
export const BALL_R = 14;

// Landscape x-axis range (physics units)
export const X_LO = -1.12;
export const X_HI =  1.12;

// Landscape y-axis range (energy units, for display scaling)
export const Y_LO = -2.5;
export const Y_HI =  2.8;

// D2 receptor barrier — a Gaussian bump placed between mania and euthymia wells,
// representing dopamine blockade by antipsychotic drugs.
// cx: center position (physics units), w: width (standard deviation)
export const BARRIER = { cx: -0.38, w: 0.10 };
