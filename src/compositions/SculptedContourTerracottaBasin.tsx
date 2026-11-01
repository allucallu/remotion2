import { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// One shared, positive radial field in an affine ellipse space keeps rings nested.
const PALETTE = {
  cream: "#F0E5D2",
  beige: "#E1C6A6",
  clay: "#C88F71",
  ink: "#995B47",
  softInk: "#B4765A",
};
const TAU = Math.PI * 2;
const RINGS = 56;
const SAMPLES = 240;
const ASPECT = 170 / 240;
const SHEAR = 0.1;
const ANGLE_STEP = TAU / SAMPLES;
type Point = { x: number; y: number };
type RingSample = { point: Point; tangent: Point };
const phaseAt = (frame: number, loopFrames: number) =>
  (TAU * (((frame % loopFrames) + loopFrames) % loopFrames)) / loopFrames;
const centerAt = (phase: number): Point => ({
  x: 2920 + 22 * Math.sin(phase),
  y: 1450 + 10 * (Math.cos(phase) - 1),
});
const radiusAt = (ring: number) => 240 + 26 * ring + 0.9 * ring * ring;
const ringSettings = Array.from({ length: RINGS }, (_, i) => {
  const depth = i / (RINGS - 1);
  return {
    radius: radiusAt(i),
    depth,
    breathing: 12 + 22 * depth + 28 * Math.sin(Math.PI * depth),
    wave: 4 + 19 * Math.sin(Math.PI * depth) ** 2,
    width: 3.35 + 0.28 * Math.sin(i * 0.19 + 0.3),
  };
});
const radialField = (ring: number, angle: number, phase: number) => {
  const settings = ringSettings[ring];
  const { radius, depth } = settings;
  // Low angular harmonics are shared by the entire family, never per-ring noise.
  const phase3 = -0.8 + 0.34 * depth;
  const form =
    1 +
    0.045 * Math.cos(2 * angle + 0.9) +
    0.072 * Math.cos(3 * angle + phase3) +
    0.018 * Math.sin(5 * angle + 0.4) +
    0.035 * Math.cos(angle - 0.7);
  const formDerivative =
    -0.09 * Math.sin(2 * angle + 0.9) -
    0.216 * Math.sin(3 * angle + phase3) +
    0.09 * Math.cos(5 * angle + 0.4) -
    0.035 * Math.sin(angle - 0.7);
  // Opposing slopes expand/contract, rather than scaling the whole group.
  const breath = settings.breathing * Math.sin(2 * phase + 0.45);
  const waveAngle = angle + phase - 0.42 * depth;
  return {
    radius:
      radius * form +
      breath * Math.cos(angle - 0.65) +
      settings.wave * Math.cos(waveAngle),
    derivative:
      radius * formDerivative -
      breath * Math.sin(angle - 0.65) -
      settings.wave * Math.sin(waveAngle),
  };
};
const ringSample = (ring: number, angle: number, phase: number): RingSample => {
  const field = radialField(ring, angle, phase),
    center = centerAt(phase);
  const c = Math.cos(angle),
    s = Math.sin(angle),
    r = field.radius,
    dr = field.derivative;
  return {
    point: { x: center.x + r * (c + SHEAR * s), y: center.y + ASPECT * r * s },
    tangent: {
      x: dr * (c + SHEAR * s) + r * (-s + SHEAR * c),
      y: ASPECT * (dr * s + r * c),
    },
  };
};
const samplesAt = (ring: number, phase: number) =>
  Array.from({ length: SAMPLES }, (_, i) =>
    ringSample(ring, i * ANGLE_STEP, phase),
  );
const closedPath = (ring: number, phase: number) => {
  const samples = samplesAt(ring, phase);
  const f = (n: number) => n.toFixed(4);
  const pair = (p: Point) => `${f(p.x)},${f(p.y)}`;
  const commands = samples.map((a, i) => {
    const b = samples[(i + 1) % SAMPLES];
    // Analytic tangents, short spans: C1 closure and no Catmull-Rom seam overshoot.
    const control1 = {
      x: a.point.x + (a.tangent.x * ANGLE_STEP) / 3,
      y: a.point.y + (a.tangent.y * ANGLE_STEP) / 3,
    };
    const control2 = {
      x: b.point.x - (b.tangent.x * ANGLE_STEP) / 3,
      y: b.point.y - (b.tangent.y * ANGLE_STEP) / 3,
    };
    return `C${pair(control1)} ${pair(control2)} ${pair(b.point)}`;
  });
  return `M${pair(samples[0].point)} ${commands.join(" ")} Z`;
};

export const SculptedContourTerracottaBasin = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = phaseAt(frame, Math.round(12 * fps));
  const uid = useId().replace(/:/g, "") + "-terracotta-basin";
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.beige }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient
            id={uid + "-ground"}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="3840"
            y2="2160"
          >
            <stop offset="0" stopColor={PALETTE.cream} />
            <stop offset=".52" stopColor={PALETTE.beige} />
            <stop offset="1" stopColor={PALETTE.clay} />
          </linearGradient>
          <linearGradient
            id={uid + "-ink"}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="3840"
            y2="2160"
          >
            <stop offset="0" stopColor={PALETTE.softInk} stopOpacity=".35" />
            <stop offset=".38" stopColor={PALETTE.softInk} stopOpacity=".39" />
            <stop offset=".68" stopColor={PALETTE.ink} stopOpacity=".5" />
            <stop offset="1" stopColor={PALETTE.ink} stopOpacity=".64" />
          </linearGradient>
        </defs>
        <rect width="3840" height="2160" fill={`url(#${uid}-ground)`} />
        <g
          fill="none"
          stroke={`url(#${uid}-ink)`}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ringSettings.map((settings, i) => (
            <path
              key={i}
              d={closedPath(i, phase)}
              strokeWidth={settings.width}
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
