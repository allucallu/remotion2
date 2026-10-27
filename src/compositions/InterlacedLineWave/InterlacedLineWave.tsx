import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Composition: 3840 × 2160, 30 fps, 240 frames / 8 seconds. */
const WIDTH = 3840;
const HEIGHT = 2160;
const LINE_WIDTH = 1440;
const STEP = 12;
const GAP = 76;
const AMPLITUDE = 76;
const DISPLAY_SCALE = 1.15;
const STROKE = 12;

// Cubic Hermite segments match the analytic position and tangent at each join.
// The sin² envelope fixes both endpoint positions and endpoint tangents.
const sample = (u: number, line: number, phase: number) => {
  const envelope = Math.sin(Math.PI * u) ** 2;
  const envelopeSlope = Math.PI * Math.sin(2 * Math.PI * u);
  const a = 3 * Math.PI * u - phase + line * 0.28;
  const wave = Math.sin(a) + 0.16 * Math.sin(2 * a + 0.6);
  const waveSlope = Math.cos(a) + 0.32 * Math.cos(2 * a + 0.6);
  return {
    x: -LINE_WIDTH / 2 + LINE_WIDTH * u,
    y: (line - 3) * GAP + AMPLITUDE * envelope * wave,
    slope: AMPLITUDE * (envelopeSlope * wave + envelope * waveSlope * 3 * Math.PI) / LINE_WIDTH,
  };
};
const n = (value: number) => value.toFixed(4);
const makePath = (line: number, phase: number) => {
  let previous = sample(0, line, phase);
  const commands = [`M${n(previous.x)} ${n(previous.y)}`];
  for (let x = STEP; x <= LINE_WIDTH; x += STEP) {
    const next = sample(x / LINE_WIDTH, line, phase);
    commands.push(`C${n(previous.x + STEP / 3)} ${n(previous.y + previous.slope * STEP / 3)} ${n(next.x - STEP / 3)} ${n(next.y - next.slope * STEP / 3)} ${n(next.x)} ${n(next.y)}`);
    previous = next;
  }
  return commands.join(" ");
};

export const InterlacedLineWave: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = Math.max(1, Math.round(8 * fps));
  const wrapped = ((frame % cycle) + cycle) % cycle;
  const phase = 2 * Math.PI * wrapped / cycle;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet">
        <rect width={WIDTH} height={HEIGHT} fill="#000000" />
        <g transform={`translate(${WIDTH / 2} ${HEIGHT / 2}) scale(${DISPLAY_SCALE})`}>
          {Array.from({ length: 7 }, (_, line) => (
            <path key={line} d={makePath(line, phase)} fill="none" stroke="#F1EEE7" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
