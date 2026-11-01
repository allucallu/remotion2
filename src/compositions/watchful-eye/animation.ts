// All timing is in seconds; phase wraps exactly at the virtual frame 360.
const smooth = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const ramp = (t: number, a: number, b: number) => smooth((t - a) / (b - a));
export const loopTime = (frame: number, fps: number) =>
  (((frame / fps) % 12) + 12) % 12;
export const gazeAt = (t: number) => {
  const right = ramp(t, 1.2, 1.45) * (1 - ramp(t, 103 / 30, 104 / 30));
  const left = ramp(t, 5.2, 5.45) * (1 - ramp(t, 8.8, 9.55));
  const correction = ramp(t, 1.65, 1.85) * (1 - ramp(t, 103 / 30, 104 / 30));
  const near = ramp(t, 6.5, 6.75) * (1 - ramp(t, 8.8, 9.55));
  const p = (t / 12) * Math.PI * 2;
  return {
    x:
      150 * right -
      130 * left -
      5 * correction +
      4 * near +
      3 * Math.sin(3 * p),
    y: -40 * right + 30 * left + 2 * Math.sin(2 * p),
  };
};
export const blinkAt = (t: number) =>
  ramp(t, 99 / 30, 103 / 30) * (1 - ramp(t, 104 / 30, 111 / 30));
export const pupilAt = (t: number) =>
  95 -
  12.5 * ramp(t, 2, 3.3) * (1 - ramp(t, 3.7, 5.2)) +
  7.5 * ramp(t, 6, 7.6) * (1 - ramp(t, 8.8, 10.4));
export const lidsAt = (t: number) => {
  const gaze = gazeAt(Math.max(0, t - 2.5 / 30));
  const p = (t / 12) * Math.PI * 2;
  const squint = ramp(t, 7.6, 8.25) * (1 - ramp(t, 8.8, 10.4));
  return {
    blink: blinkAt(t),
    upper: gaze.y * 0.45 + 65 * squint + 3 * Math.sin(2 * p),
    lower:
      -22 * squint -
      5 * ramp(t, 6, 7.6) * (1 - ramp(t, 8.8, 10.4)) +
      2 * Math.sin(2 * p),
  };
};
export type Point = { x: number; y: number };
export const lidPoint = (u: number, upper: boolean, t: number): Point => {
  const v = 1 - u;
  const lids = lidsAt(t);
  const a = upper ? -420 + lids.upper : 420 + lids.lower;
  const b = upper ? -470 + lids.upper : 340 + lids.lower;
  const c1 = a + (115 - a) * lids.blink;
  const c2 = b + (165 - b) * lids.blink;
  return {
    x:
      v * v * v * -900 +
      3 * v * v * u * -450 +
      3 * v * u * u * 420 +
      u * u * u * 900,
    y: 3 * v * v * u * c1 + 3 * v * u * u * c2 + u * u * u * -30,
  };
};
export const lidCurve = (upper: boolean, t: number, reverse = false) => {
  const lids = lidsAt(t);
  const a = upper ? -420 + lids.upper : 420 + lids.lower;
  const b = upper ? -470 + lids.upper : 340 + lids.lower;
  const c1 = a + (115 - a) * lids.blink;
  const c2 = b + (165 - b) * lids.blink;
  return reverse
    ? `C420,${c2} -450,${c1} -900,0`
    : `C-450,${c1} 420,${c2} 900,-30`;
};
export const apertureAt = (t: number) =>
  `M-900,0 ${lidCurve(true, t)} ${lidCurve(false, t, true)} Z`;
// Skin coordinates attach to the lid; shortening is local to each tissue layer.
export const skinPoint = (
  u: number,
  distance: number,
  upper: boolean,
  t: number,
): Point => {
  const base = lidPoint(u, upper, t);
  const b = blinkAt(t);
  const envelope = Math.pow(Math.sin(Math.PI * u), 0.55);
  return {
    x: base.x + (u - 0.5) * distance * 0.42,
    y:
      base.y +
      (upper ? -1 : 1) * distance * envelope * (1 - (upper ? 0.48 : 0.3) * b),
  };
};
