import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

const WIDTH = 3840;
const HEIGHT = 2160;
const SAMPLES = 240;
const TAU = Math.PI * 2;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => {
  const t = clamp01(n);
  return t * t * (3 - 2 * t);
};
const grow = (p: number, start: number, end: number) =>
  ease((p - start) / (end - start));

// Fixed angular lobes: their radii only increase, so the ink never recedes.
// The late core expansion fills the spaces between the earlier ink fingers.
const LOBES = [
  {angle: -2.65, width: 0.30, reach: 620, start: 0.00, end: 0.50},
  {angle: -1.18, width: 0.38, reach: 790, start: 0.03, end: 0.62},
  {angle: 0.10, width: 0.33, reach: 1050, start: 0.08, end: 0.77},
  {angle: 1.13, width: 0.39, reach: 760, start: 0.00, end: 0.59},
  {angle: 2.42, width: 0.36, reach: 920, start: 0.12, end: 0.79},
];

const inkPath = (progress: number) => {
  const core = 170 * grow(progress, 0, 0.36) +
    2350 * grow(progress, 0.24, 1);
  const points = Array.from({length: SAMPLES}, (_, i) => {
    const angle = i * TAU / SAMPLES;
    let radius = core;
    for (const lobe of LOBES) {
      const delta = Math.atan2(Math.sin(angle - lobe.angle), Math.cos(angle - lobe.angle));
      const profile = Math.exp(-0.5 * (delta / lobe.width) ** 2);
      radius += lobe.reach * profile * grow(progress, lobe.start, lobe.end);
    }
    // Small, broad edge variations, fixed in space; no animated noise.
    radius += 75 * (1 + Math.sin(7 * angle + 0.6)) * grow(progress, 0.15, 0.8);
    return {x: WIDTH / 2 + radius * Math.cos(angle),
      y: HEIGHT / 2 + radius * Math.sin(angle)};
  });
  const mid = (a: typeof points[number], b: typeof points[number]) =>
    `${((a.x + b.x) / 2).toFixed(3)} ${((a.y + b.y) / 2).toFixed(3)}`;
  const commands = [`M ${mid(points[SAMPLES - 1], points[0])}`];
  points.forEach((point, i) => {
    commands.push(`Q ${point.x.toFixed(3)} ${point.y.toFixed(3)} ${mid(point, points[(i + 1) % SAMPLES])}`);
  });
  return commands.join(' ') + ' Z';
};

/** 3840 × 2160, 30 fps, 180 frames. Opaque white-on-black luma matte.
 * 0–11 black; 12–107 organic spread; 108–179 solid white.
 * No blur, opacity fades, random frame noise, reverse motion, or loop reset.
 */
export const InkBloomMatte: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = Math.round(0.4 * fps);
  const finish = Math.round(3.6 * fps);
  const progress = clamp01((frame - start) / Math.max(1, finish - 1 - start));
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid slice" aria-label="Organic ink bloom luma matte">
        <rect width={WIDTH} height={HEIGHT} fill="#000000" />
        {frame > start && frame < finish && <path d={inkPath(progress)} fill="#FFFFFF" />}
        {frame >= finish && <rect width={WIDTH} height={HEIGHT} fill="#FFFFFF" />}
      </svg>
    </AbsoluteFill>
  );
};
