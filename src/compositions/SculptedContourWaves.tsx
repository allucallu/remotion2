import { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// This asset is self-contained. Every row samples the same smooth surface.
const STYLE = {
  navy: "#10243B",
  petroleum: "#123D50",
  teal: "#17616A",
  contour: [150, 206, 201],
  secondary: [104, 170, 169],
} as const;
const TAU = Math.PI * 2;
const ROWS = 72;
const SAMPLES = 184;
const X_MIN = -480;
const X_MAX = 4320;
const Y_MIN = -550;
const Y_MAX = 2750;
const STEP = (X_MAX - X_MIN) / (SAMPLES - 1);
type Point = { x: number; y: number };
type Contour = { points: Point[]; slopes: number[]; path: string };
const gaussian = (x: number, y: number, sx: number, sy: number) =>
  Math.exp(-0.5 * ((x / sx) ** 2 + (y / sy) ** 2));
const rowPosition = (row: number) =>
  Y_MIN + (row * (Y_MAX - Y_MIN)) / (ROWS - 1);
const loopPhase = (frame: number, loopFrames: number) =>
  (TAU * (((frame % loopFrames) + loopFrames) % loopFrames)) / loopFrames;

// Broad falloffs have no edges. Their positions and intensities never animate.
const calmAt = (x: number, baseY: number) =>
  gaussian(x - 1920, baseY - 1080, 960, 590);
const energyAt = (x: number, baseY: number) => 1 - 0.68 * calmAt(x, baseY);

const staticRelief = (x: number, baseY: number, phase: number) => {
  const width = 820 + 65 * Math.sin(phase - 0.4);
  const leftY = baseY - 1550;
  const left = -355 * gaussian(x - 830 + 0.32 * leftY, leftY, width, 980);
  const shift = 58 * Math.sin(phase + 0.7);
  const ridgeY = baseY - 460 + shift * 0.62;
  const right =
    -230 * gaussian(x - 3110 - shift * 0.78 - 0.2 * ridgeY, ridgeY, 670, 870);
  const basin =
    (150 + 27 * Math.sin(phase - 0.9)) *
    gaussian(x - 2080, baseY - 1730, 870, 810);
  return left + right + basin;
};
const travelingRelief = (x: number, baseY: number, phase: number) => {
  const energy = energyAt(x, baseY);
  // Direction -39 degrees, two passages per loop; the secondary travels at -16.
  const primary =
    86 * Math.sin(TAU * (x / 3650 - baseY / 2950) - 2 * phase + 0.4);
  const secondary =
    24 * Math.sin(TAU * (x / 5400 - baseY / 18800) - phase + 2.1);
  return energy * (primary + secondary);
};
const surfaceY = (x: number, baseY: number, phase: number) =>
  baseY -
  0.145 * (x - 1920) +
  staticRelief(x, baseY, phase) +
  travelingRelief(x, baseY, phase);

// PCHIP on a uniform grid: zero tangent at extrema, harmonic mean elsewhere.
// Each cubic stays between its two sample heights; no spline ringing at crests.
const contourAt = (row: number, phase: number): Contour => {
  const baseY = rowPosition(row);
  const points = Array.from({ length: SAMPLES }, (_, i) => {
    const x = X_MIN + i * STEP;
    return { x, y: surfaceY(x, baseY, phase) };
  });
  const secants = points.slice(1).map((p, i) => (p.y - points[i].y) / STEP);
  const slopes = points.map((_, i) => {
    if (i === 0) return secants[0];
    if (i === SAMPLES - 1) return secants[SAMPLES - 2];
    const a = secants[i - 1],
      b = secants[i];
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  });
  const f = (v: number) => v.toFixed(4);
  const commands = points.slice(1).map((p, i) => {
    const a = points[i];
    return `C${f(a.x + STEP / 3)},${f(a.y + (slopes[i] * STEP) / 3)} ${f(p.x - STEP / 3)},${f(p.y - (slopes[i + 1] * STEP) / 3)} ${f(p.x)},${f(p.y)}`;
  });
  return {
    points,
    slopes,
    path: `M${f(points[0].x)},${f(points[0].y)} ${commands.join(" ")}`,
  };
};
const contourColor = (row: number) => {
  const blend = 0.26 + 0.17 * Math.sin(row * 0.18 + 0.5);
  return `rgb(${STYLE.contour.map((v, i) => Math.round(v + (STYLE.secondary[i] - v) * blend)).join(",")})`;
};
const contrastAt = (x: number, baseY: number) => {
  const left = gaussian(x - 650, baseY - 1690, 1250, 1200);
  const right = gaussian(x - 3150, baseY - 470, 1050, 1000);
  return 0.39 + 0.23 * left + 0.1 * right - 0.055 * calmAt(x, baseY);
};
// All paint data stays identical on every frame; only path geometry changes.
const ROW_STYLE = Array.from({ length: ROWS }, (_, row) => ({
  color: contourColor(row),
  width: 2.85 + 0.25 * Math.sin(row * 0.16 + 0.6),
  stops: Array.from({ length: 17 }, (_, i) => ({
    offset: i / 16,
    opacity: contrastAt(X_MIN + ((X_MAX - X_MIN) * i) / 16, rowPosition(row)),
  })),
}));

export const SculptedContourWaves = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = loopPhase(frame, Math.round(12 * fps));
  const uid = useId().replace(/:/g, "") + "-sculpted-contours";
  return (
    <AbsoluteFill style={{ backgroundColor: STYLE.petroleum }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient
            id={uid + "-ocean"}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="2160"
            x2="3840"
            y2="0"
          >
            <stop offset="0" stopColor={STYLE.navy} />
            <stop offset="0.52" stopColor={STYLE.petroleum} />
            <stop offset="1" stopColor={STYLE.teal} />
          </linearGradient>
          {ROW_STYLE.map((style, row) => (
            <linearGradient
              key={row}
              id={`${uid}-ink-${row}`}
              gradientUnits="userSpaceOnUse"
              x1={X_MIN}
              x2={X_MAX}
              y1="0"
              y2="0"
            >
              {style.stops.map((stop, i) => (
                <stop
                  key={i}
                  offset={stop.offset}
                  stopColor={style.color}
                  stopOpacity={stop.opacity}
                />
              ))}
            </linearGradient>
          ))}
        </defs>
        <rect width="3840" height="2160" fill={`url(#${uid}-ocean)`} />
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {ROW_STYLE.map((style, row) => (
            <path
              key={row}
              d={contourAt(row, phase).path}
              stroke={`url(#${uid}-ink-${row})`}
              strokeWidth={style.width}
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
