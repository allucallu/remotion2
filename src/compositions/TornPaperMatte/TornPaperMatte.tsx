import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

const WIDTH = 3840;
const HEIGHT = 2160;
const MARGIN = 620;
type Point = {x: number; y: number};
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => {
  const t = clamp01(n);
  return t * t * (3 - 2 * t);
};
const seeded = (index: number, salt: number) => {
  const n = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453123;
  return n - Math.floor(n);
};
const noise = (x: number, scale: number, salt: number) => {
  const p = x / scale;
  const i = Math.floor(p);
  return seeded(i, salt) + (seeded(i + 1, salt) - seeded(i, salt)) * smooth(p - i);
};

// Fixed, irregular x spacing. No per-frame random noise or changing topology.
// Large torn chunks, smaller broken fibres and fine teeth have separate scales.
const PROFILE: readonly Point[] = (() => {
  const points: Point[] = [];
  let x = -MARGIN;
  let i = 0;
  while (x < WIDTH + MARGIN) {
    const broad = 400 * (noise(x + MARGIN, 510, 3) - 0.5);
    const chunks = 135 * (noise(x + MARGIN, 110, 8) - 0.5);
    const fibres = (seeded(i, 11) - 0.5) * 20;
    const rip = seeded(i, 19) > 0.91 ? -12 - seeded(i, 24) * 26 : 0;
    // A shallow skew makes one side lead without rotating the entire matte.
    const slope = (x / WIDTH - 0.5) * 120;
    points.push({x, y: broad + chunks + fibres + rip + slope});
    x += 5 + seeded(i, 16) * 11;
    i++;
  }
  points.push({x: WIDTH + MARGIN, y: points[points.length - 1].y});
  return points;
})();

const MIN_PROFILE = Math.min(...PROFILE.map(point => point.y));
const MAX_PROFILE = Math.max(...PROFILE.map(point => point.y));
const FRONT_START = -MAX_PROFILE - 65;
const FRONT_END = HEIGHT - MIN_PROFILE + 30;

const tornPath = (progress: number, layer: number) => {
  const edge = PROFILE.map((p, i) => {
    // Tension travels from left to right. Every local tear advances only down.
    const delay = 0.10 * clamp01(p.x / WIDTH) +
      0.02 * noise(p.x + MARGIN, 460, 34);
    const local = clamp01((progress - delay) / (1 - delay));
    // Three overlapping pulls create short catches and releases, not a slide.
    const tug = 0.32 * smooth(local / 0.38) +
      0.40 * smooth((local - 0.22) / 0.50) +
      0.28 * smooth((local - 0.62) / 0.38);
    const pull = 0.72 * local + 0.28 * tug;
    const front = FRONT_START + (FRONT_END - FRONT_START) * pull;
    // Narrow exposed fibre layers follow the same jagged tear in fixed order.
    const fringe = layer * (5 + 12 * noise(p.x + MARGIN, 63, 28) +
      11 * seeded(i, 29));
    return `L ${p.x.toFixed(3)} ${(front + p.y + fringe).toFixed(3)}`;
  }).join(' ');
  return `M ${-MARGIN} ${-MARGIN} ${edge} L ${WIDTH + MARGIN} ${-MARGIN} Z`;
};

/** 3840×2160, 30 fps, 180 frames. Opaque top-to-bottom luma matte.
 * Black 0–11; tear 12–113; white 114–179. Gray fringe gives a textured
 * partial reveal along the torn fibres; the finished area is pure white.
 */
export const TornPaperMatte: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = Math.round(0.4 * fps);
  const finish = Math.round(3.8 * fps);
  const p = clamp01((frame - start) / Math.max(1, finish - start - 1));
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid slice" aria-label="Torn paper luma matte">
        <rect width={WIDTH} height={HEIGHT} fill="#000000" />
        {frame >= start && frame < finish && (
          <g>
            <path d={tornPath(p, 1.7)} fill="#777777" />
            <path d={tornPath(p, 0.7)} fill="#CCCCCC" />
            <path d={tornPath(p, 0)} fill="#FFFFFF" />
          </g>
        )}
        {frame >= finish && <rect width={WIDTH} height={HEIGHT} fill="#FFFFFF" />}
      </svg>
    </AbsoluteFill>
  );
};
