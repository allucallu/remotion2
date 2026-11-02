import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Standalone component. Register locally: 3840 x 2160, 30 fps, 300 frames.
 * Coordinates below use a 1920 x 1080 design canvas and scale cleanly to 4K.
 * Default: fully visible first frame, focus-lock entry, steady hold, retract exit.
 * Set drawOnEntry=true for a blank first frame and a drawn entrance.
 * No registry, assets, fonts, CSS animation, effects, timers, or random values.
 */
export type FocusPixelAssemblyProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  /** Width/height of the bracket boundary in design pixels, not output pixels. */
  bracketWidth?: number;
  bracketHeight?: number;
  drawOnEntry?: boolean;
};

export const FocusPixelAssemblyConfig = {
  id: 'FocusPixelAssembly', width: 3840, height: 2160, fps: 30, durationInFrames: 300,
} as const;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (v: number) => {const x = clamp(v); return x * x * (3 - 2 * x);};
const phase = (t: number, a: number, b: number) => ease((t - a) / Math.max(0.001, b - a));

type CornerProps = {
  t: number; out: number; drawOnEntry: boolean; index: number;
  color: string; secondaryColor: string;
};

const Corner: React.FC<CornerProps> = ({t, out, drawOnEntry, color, secondaryColor}) => {
  const tiles = [[0, 0, 17, 17], [23, 0, 27, 12], [56, 0, 22, 12],
    [84, 0, 17, 12], [0, 23, 12, 27], [0, 56, 12, 22], [0, 84, 12, 17],
    [23, 23, 8, 8]] as const;
  return <g>
    {tiles.map(([x, y, w, h], i) => {
      const order = i === 0 ? 0 : i === 7 ? 4 : i < 4 ? i : i - 3;
      const snap = phase(t, order * 0.13, 0.36 + order * 0.13);
      const p = (drawOnEntry ? snap : 1)
        * (1 - phase(out, (4 - order) * 0.1, 0.54 + (4 - order) * 0.1));
      const displacement = 17 * (1 - snap) + out * (8 + order * 4);
      const dx = x > y ? displacement : 0;
      const dy = y > x ? displacement : 0;
      return <rect key={i} x={x + dx} y={y + dy} width={w} height={h}
        fill={i === 7 || i === 3 || i === 6 ? secondaryColor : color} opacity={p} />;
    })}
  </g>;
};

export const FocusPixelAssembly: React.FC<FocusPixelAssemblyProps> = ({
  background = 'black', color = '#F5F3EC', secondaryColor = '#AAAEB3',
  bracketWidth = 800, bracketHeight = 460, drawOnEntry = false,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const seconds = Math.max(0, durationInFrames - 1) / fps;
  const t = frame / fps;
  // Keep entry/exit disjoint even if the local composition is shorter than 10 s.
  const timeScale = Math.min(1, Math.max(0.01, seconds / 3));
  const localTime = t / timeScale;
  const out = phase(t, Math.max(0, seconds - 0.95 * timeScale), seconds);
  const lock = phase(localTime, 0.12, 1.0);
  const w = clamp(bracketWidth, 440, 1440);
  const h = clamp(bracketHeight, 300, 760);
  const backgrounds = {black: '#000000', green: '#00FF00', transparent: 'transparent'};

  return (
    <AbsoluteFill style={{backgroundColor: backgrounds[background], overflow: 'hidden'}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"
        width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
        style={{display: 'block'}}>
        {([[1, 1], [-1, 1], [-1, -1], [1, -1]] as const).map(([sx, sy], index) => {
          const drift = 28 * (1 - lock) + 16 * out;
          const x = 960 - sx * (w / 2 + drift);
          const y = 540 - sy * (h / 2 + drift);
          return (
            <g key={index} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}
              opacity={1 - phase(out, 0.84, 1)}>
              <Corner t={localTime} out={out} drawOnEntry={drawOnEntry} index={index}
                color={color} secondaryColor={secondaryColor} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export default FocusPixelAssembly;
