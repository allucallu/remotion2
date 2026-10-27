import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

const WIDTH = 3840;
const HEIGHT = 2160;
const OVERSCAN = 180;
const EDGE_SAMPLES = 800;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => {
  const t = clamp01(n);
  return t * t * (3 - 2 * t);
};

// Bristles stay at fixed vertical positions. Their rounded tips travel with
// the brush, leaving a continuous opaque trail without moving black holes.
const BRISTLES = Array.from({length: 64}, (_, i) => ({
  y: -120 + i * 39 + 8 * Math.sin(i * 2.17),
  width: 7 + ((i * 13) % 11),
  length: 24 + ((i * 37) % 105),
}));

// Long valleys between bristle bundles create visible dry-brush streaks.
// Each valley is attached to the unrevealed side and fills as the brush passes.
const CHANNELS = Array.from({length: 21}, (_, i) => ({
  y: 36 + i * 107 + 24 * Math.sin(i * 1.81),
  width: 3.5 + ((i * 11) % 16),
  depth: 180 + ((i * 73) % 430),
}));
const FILAMENTS = Array.from({length: 95}, (_, i) => ({
  y: 8 + i * 23 + 8 * Math.sin(i * 2.31),
  reach: 140 + ((i * 67) % 320),
  thickness: 2 + ((i * 7) % 6),
  value: 105 + ((i * 41) % 130),
}));

const edgeOffset = (y: number) => {
  // The centre of a broad brush leads, while the shoulders trail slightly.
  const arch = 190 * Math.exp(-0.5 * ((y - 1130) / 710) ** 2);
  const contour = 95 * Math.sin(y / 203 + 0.4) + 45 * Math.sin(y / 91) + 18 * Math.sin(y / 31);
  const tips = BRISTLES.reduce((sum, bristle) => {
    const distance = (y - bristle.y) / bristle.width;
    return sum + bristle.length * Math.exp(-0.5 * distance * distance);
  }, 0);
  const channels = CHANNELS.reduce((sum, channel) => {
    const distance = (y - channel.y) / channel.width;
    return sum + channel.depth * Math.exp(-0.5 * distance * distance);
  }, 0);
  return arch + contour + tips - channels;
};

const sweepPath = (head: number) => {
  const points = Array.from({length: EDGE_SAMPLES + 1}, (_, i) => {
    const y = -OVERSCAN + (HEIGHT + OVERSCAN * 2) * i / EDGE_SAMPLES;
    return {x: head + edgeOffset(y), y};
  });
  const first = points[0];
  const commands = [`M ${-OVERSCAN} ${first.y}`, `L ${first.x.toFixed(3)} ${first.y}`];
  // Quadratic midpoints round the bristle tips instead of sharp polygon teeth.
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    commands.push(`Q ${a.x.toFixed(3)} ${a.y.toFixed(3)} ${((a.x + b.x) / 2).toFixed(3)} ${((a.y + b.y) / 2).toFixed(3)}`);
  }
  const last = points[points.length - 1];
  commands.push(`L ${last.x.toFixed(3)} ${last.y} L ${-OVERSCAN} ${last.y} Z`);
  return commands.join(' ');
};

/** 3840×2160, 30 fps, 180 frames (6 seconds).
 * Black hold: 0–11. Left-to-right brush sweep: 12–101.
 * Solid white hold: 102–179. White reveals; black conceals.
 */
export const BrushSweepMatte: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = Math.round(0.4 * fps);
  const finish = Math.round(3.4 * fps);
  const progress = clamp01((frame - start) / Math.max(1, finish - start - 1));
  // Mostly constant travel, with a short acceleration and deceleration.
  // The end margins put every bristle offscreen before switching to white.
  const travel = 0.8 * progress + 0.2 * smooth(progress);
  const head = -900 + (WIDTH + 2000) * travel;
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid slice" aria-label="Brush sweep luma matte">
        <rect width={WIDTH} height={HEIGHT} fill="#000000" />
        {frame >= start && frame < finish && (
          <g>
            {/* Grayscale filaments lead the dense paint. Fixed luminance and
                left-anchored geometry ensure pixels only become brighter. */}
            {FILAMENTS.map((fiber, i) => {
              const tip = head + edgeOffset(fiber.y) + fiber.reach;
              const y = fiber.y;
              return tip > -OVERSCAN ? (
                <path key={i}
                  d={`M ${-OVERSCAN} ${y - fiber.thickness / 2} L ${tip - 65} ${y - fiber.thickness / 2} Q ${tip + 15} ${y} ${tip - 65} ${y + fiber.thickness / 2} L ${-OVERSCAN} ${y + fiber.thickness / 2} Z`}
                  fill={`rgb(${fiber.value},${fiber.value},${fiber.value})`} />
              ) : null;
            })}
            <path d={sweepPath(head)} fill="#FFFFFF" />
          </g>
        )}
        {frame >= finish && <rect width={WIDTH} height={HEIGHT} fill="#FFFFFF" />}
      </svg>
    </AbsoluteFill>
  );
};
