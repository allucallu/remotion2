import { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Self-contained ruled cloth surfaces, sampled once per ribbon and frame.
type Point = { x: number; y: number };
type RGB = readonly [number, number, number];
type Ribbon = {
  id: string;
  fibers: number;
  width: number;
  amplitude: number;
  phase: number;
  baseDark: RGB;
  baseLight: RGB;
  fiberDark: RGB;
  fiberLight: RGB;
};
type Surface = {
  center: Point;
  normal: Point;
  tangent: Point;
  width: number;
  theta: number;
};
const TAU = Math.PI * 2,
  X_MIN = -700,
  X_MAX = 4540,
  SAMPLES = 196,
  COLOR_BANDS = 8;
const BACKGROUND = { plum: "#281F37", purple: "#40324C", mauve: "#62475D" };
// Back-to-front draw order is invariant: C, B, A.
const RIBBONS: readonly Ribbon[] = [
  {
    id: "C",
    fibers: 52,
    width: 250,
    amplitude: 31,
    phase: 4.1,
    baseDark: [83, 73, 103],
    baseLight: [119, 106, 138],
    fiberDark: [126, 113, 146],
    fiberLight: [167, 154, 191],
  },
  {
    id: "B",
    fibers: 76,
    width: 340,
    amplitude: 54,
    phase: 2.1,
    baseDark: [103, 75, 96],
    baseLight: [145, 103, 122],
    fiberDark: [148, 103, 125],
    fiberLight: [184, 135, 152],
  },
  {
    id: "A",
    fibers: 104,
    width: 560,
    amplitude: 82,
    phase: 0.35,
    baseDark: [119, 99, 104],
    baseLight: [177, 156, 137],
    fiberDark: [173, 150, 133],
    fiberLight: [217, 195, 168],
  },
];
const mix = (a: number, b: number, v: number) => a + (b - a) * v;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const color = (a: RGB, b: RGB, v: number) =>
  `rgb(${a.map((c, i) => Math.round(mix(c, b[i], clamp(v)))).join(",")})`;
const phaseAt = (frame: number, loopFrames: number) =>
  (TAU * (((frame % loopFrames) + loopFrames) % loopFrames)) / loopFrames;
const centerAt = (r: Ribbon, u: number, phase: number): Point => {
  const x = mix(X_MIN, X_MAX, u);
  let y: number;
  if (r.id === "A") y = 1750 - 0.27 * x - 430 * Math.tanh((x - 2900) / 600);
  else if (r.id === "B")
    y =
      180 +
      0.1 * x +
      430 / (1 + Math.exp(-(x - 2700) / 450)) +
      110 * Math.sin(x / 1400 + 0.4);
  else y = 2500 - 0.26 * x - 230 * Math.sin((x - 1800) / 1700);
  const wave =
    TAU * (r.id === "C" ? 0.65 : r.id === "B" ? 0.85 : 1.05) * u -
    phase +
    r.phase;
  y +=
    r.amplitude * Math.sin(wave) +
    r.amplitude * 0.11 * Math.sin(TAU * 1.55 * u - 2 * phase + r.phase);
  return { x, y };
};
const surfaceAt = (r: Ribbon, u: number, phase: number): Surface => {
  const center = centerAt(r, u, phase),
    p = centerAt(r, u - 0.0001, phase),
    q = centerAt(r, u + 0.0001, phase);
  const dx = q.x - p.x,
    dy = q.y - p.y,
    length = Math.hypot(dx, dy);
  const tangent = { x: dx / length, y: dy / length };
  const theta =
    0.13 + 0.6 * Math.sin(TAU * 1.08 * u - 2 * phase + r.phase + 0.8);
  const width =
    r.width *
    (0.97 + 0.03 * Math.cos(TAU * 0.8 * u + r.phase)) *
    (1 + 0.045 * Math.sin(phase + TAU * 0.7 * u + r.phase));
  return {
    center,
    tangent,
    normal: { x: -tangent.y, y: tangent.x },
    theta,
    width,
  };
};
const surfaceSamples = (r: Ribbon, phase: number) =>
  Array.from({ length: SAMPLES }, (_, i) =>
    surfaceAt(r, i / (SAMPLES - 1), phase),
  );
const fiberPoint = (s: Surface, v: number): Point => {
  const normalOffset =
    v * s.width * 0.5 * Math.cos(s.theta) +
    s.width * 0.035 * (1 - v * v) * Math.sin(s.theta);
  const tangentOffset = v * s.width * 0.065 * Math.sin(s.theta);
  return {
    x: s.center.x + s.normal.x * normalOffset + s.tangent.x * tangentOffset,
    y: s.center.y + s.normal.y * normalOffset + s.tangent.y * tangentOffset,
  };
};
const lightAt = (s: Surface, v: number) => {
  // Fixed upper-left light in view space; normals follow section angle and camber.
  const angle = s.theta + 0.14 * v;
  const nx = s.normal.x * Math.sin(angle),
    ny = s.normal.y * Math.sin(angle),
    nz = Math.cos(angle);
  const diffuse = Math.max(0, -0.38 * nx - 0.48 * ny + 0.79 * nz);
  return clamp(0.12 + 0.88 * diffuse);
};
const geometryPath = (points: Point[], moveTo = true) => {
  const count = points.length;
  const secants = points
    .slice(1)
    .map((p, i) => (p.y - points[i].y) / (p.x - points[i].x));
  const slopes = points.map((_, i) => {
    if (i === 0) return secants[0];
    if (i === count - 1) return secants[count - 2];
    const a = secants[i - 1],
      b = secants[i];
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  });
  const f = (n: number) => n.toFixed(4);
  const commands = points.slice(1).map((p, i) => {
    const a = points[i],
      h = p.x - a.x;
    return `C${f(a.x + h / 3)},${f(a.y + (slopes[i] * h) / 3)} ${f(p.x - h / 3)},${f(p.y - (slopes[i + 1] * h) / 3)} ${f(p.x)},${f(p.y)}`;
  });
  return `${moveTo ? `M${f(points[0].x)},${f(points[0].y)} ` : ""}${commands.join(" ")}`;
};
const ribbonPath = (samples: Surface[]) => {
  const top = samples.map((s) => fiberPoint(s, -1)),
    bottom = samples.map((s) => fiberPoint(s, 1)).reverse();
  return `${geometryPath(top)} L${bottom[0].x.toFixed(4)},${bottom[0].y.toFixed(4)} ${geometryPath(bottom, false)} Z`;
};
const fiberV = (index: number, count: number) =>
  mix(-0.97, 0.97, index / (count - 1));
const gradientSamples = (samples: Surface[], v: number) =>
  Array.from({ length: 29 }, (_, i) => {
    const sample = samples[Math.round((i * (SAMPLES - 1)) / 28)];
    return {
      offset: clamp((fiberPoint(sample, v).x - X_MIN) / (X_MAX - X_MIN)),
      light: lightAt(sample, v),
    };
  });
const RibbonSurface = ({
  r,
  phase,
  uid,
}: {
  r: Ribbon;
  phase: number;
  uid: string;
}) => {
  const samples = surfaceSamples(r, phase);
  const baseId = `${uid}-${r.id}-base`;
  const bandId = (band: number) => `${uid}-${r.id}-fiber-${band}`;
  return (
    <g>
      <defs>
        <linearGradient
          id={baseId}
          gradientUnits="userSpaceOnUse"
          x1={X_MIN}
          x2={X_MAX}
          y1="0"
          y2="0"
        >
          {gradientSamples(samples, 0).map((s, i) => (
            <stop
              key={i}
              offset={s.offset}
              stopColor={color(r.baseDark, r.baseLight, s.light)}
            />
          ))}
        </linearGradient>
        {Array.from({ length: COLOR_BANDS }, (_, band) => {
          const v = mix(-0.97, 0.97, (band + 0.5) / COLOR_BANDS);
          return (
            <linearGradient
              key={band}
              id={bandId(band)}
              gradientUnits="userSpaceOnUse"
              x1={X_MIN}
              x2={X_MAX}
              y1="0"
              y2="0"
            >
              {gradientSamples(samples, v).map((s, i) => (
                <stop
                  key={i}
                  offset={s.offset}
                  stopColor={color(r.fiberDark, r.fiberLight, s.light)}
                />
              ))}
            </linearGradient>
          );
        })}
      </defs>
      {/* Opaque, continuous material occludes all ribbons drawn behind this one. */}
      <path d={ribbonPath(samples)} fill={`url(#${baseId})`} />
      <g
        fill="none"
        strokeWidth={r.id === "A" ? 2.3 : 2.1}
        strokeLinecap="round"
      >
        {Array.from({ length: r.fibers }, (_, i) => {
          const v = fiberV(i, r.fibers),
            band = Math.min(
              COLOR_BANDS - 1,
              Math.floor((i / r.fibers) * COLOR_BANDS),
            );
          return (
            <path
              key={i}
              d={geometryPath(samples.map((s) => fiberPoint(s, v)))}
              stroke={`url(#${bandId(band)})`}
            />
          );
        })}
      </g>
    </g>
  );
};

export const SatinLineCurrents = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = phaseAt(frame, Math.round(12 * fps));
  const uid = useId().replace(/:/g, "") + "-satin";
  return (
    <AbsoluteFill style={{ backgroundColor: BACKGROUND.purple }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient
            id={uid + "-background"}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="3840"
            y2="2160"
          >
            <stop offset="0" stopColor={BACKGROUND.plum} />
            <stop offset=".52" stopColor={BACKGROUND.purple} />
            <stop offset="1" stopColor={BACKGROUND.mauve} />
          </linearGradient>
        </defs>
        <rect width="3840" height="2160" fill={`url(#${uid}-background)`} />
        {RIBBONS.map((r) => (
          <RibbonSurface key={r.id} r={r} phase={phase} uid={uid} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
