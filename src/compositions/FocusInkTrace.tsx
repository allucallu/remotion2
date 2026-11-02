import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Standalone component. Register locally: 3840 x 2160, 30 fps, 300 frames.
 * Coordinates below use a 1920 x 1080 design canvas and scale cleanly to 4K.
 * Default: fully visible first frame, focus-lock entry, steady hold, retract exit.
 * Set drawOnEntry=true for a blank first frame and a drawn entrance.
 * No registry, assets, fonts, CSS animation, effects, timers, or random values.
 */
export type FocusInkTraceProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  /** Width/height of the bracket boundary in design pixels, not output pixels. */
  bracketWidth?: number;
  bracketHeight?: number;
  drawOnEntry?: boolean;
};

export const FocusInkTraceConfig = {
  id: 'FocusInkTrace', width: 3840, height: 2160, fps: 30, durationInFrames: 300,
} as const;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (v: number) => {const x = clamp(v); return x * x * (3 - 2 * x);};
const phase = (t: number, a: number, b: number) => ease((t - a) / Math.max(0.001, b - a));

type CornerProps = {
  t: number; out: number; drawOnEntry: boolean; index: number;
  color: string; secondaryColor: string;
};

// Fixed hand-shaped paths; each corner has its own contour, never temporal jitter.
const strokes = [
  'M 2 93 C 0 74 4 47 2 24 C 1 9 8 2 24 3 C 53 5 77 0 108 2',
  'M 3 89 C 6 68 0 44 3 23 C 4 7 10 3 27 2 C 53 0 80 5 105 2',
  'M 1 92 C 4 65 2 45 3 25 C 2 11 9 0 25 2 C 50 4 78 1 110 3',
  'M 3 90 C 0 66 5 47 2 26 C 1 10 7 3 24 2 C 54 0 77 4 107 1',
] as const;
const echoes = [
  'M 31 -10 Q 51 -12 71 -10', '', 'M -10 30 Q -12 48 -10 67', '',
] as const;

const Corner: React.FC<CornerProps> = ({t, out, drawOnEntry, index, color}) => {
  const delay = index === 0 || index === 2 ? 0 : 0.12;
  const draw = drawOnEntry ? phase(t, delay, 0.88 + delay) : 1;
  const erase = phase(out, 0, 0.88);
  const echo = (drawOnEntry ? phase(t, 0.7 + delay, 1.12 + delay) : 1)
    * (1 - phase(out, 0.65, 1));
  // Dash window removes the stroke from its starting end, following the ink direction.
  const remaining = Math.max(0, draw - erase);
  return <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <path d={strokes[index]} strokeWidth={6.4} pathLength={1}
      strokeDasharray={`${remaining} 2`} strokeDashoffset={-erase} opacity={remaining > 0.001 ? 1 : 0} />
    <path d={strokes[index]} strokeWidth={3} transform="translate(0.7 -0.5)" pathLength={1}
      strokeDasharray={`${remaining} 2`} strokeDashoffset={-erase} opacity={remaining > 0.001 ? 0.65 : 0} />
    {echoes[index] ? <path d={echoes[index]} strokeWidth={2.8} pathLength={1}
      strokeDasharray="1 1" strokeDashoffset={1 - echo} opacity={echo} /> : null}
  </g>;
};

export const FocusInkTrace: React.FC<FocusInkTraceProps> = ({
  background = 'black', color = '#F5F3EC', secondaryColor = '#AAAEB3',
  bracketWidth = 760, bracketHeight = 440, drawOnEntry = false,
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
          const drift = 22 * (1 - lock) + 8 * out;
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

export default FocusInkTrace;
