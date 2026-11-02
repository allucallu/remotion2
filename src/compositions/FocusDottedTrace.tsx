import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Standalone component. Register locally: 3840 x 2160, 30 fps, 300 frames.
 * Coordinates below use a 1920 x 1080 design canvas and scale cleanly to 4K.
 * Default: fully visible first frame, focus-lock entry, steady hold, retract exit.
 * Set drawOnEntry=true for a blank first frame and a drawn entrance.
 * No registry, assets, fonts, CSS animation, effects, timers, or random values.
 */
export type FocusDottedTraceProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  /** Width/height of the bracket boundary in design pixels, not output pixels. */
  bracketWidth?: number;
  bracketHeight?: number;
  drawOnEntry?: boolean;
};

export const FocusDottedTraceConfig = {
  id: 'FocusDottedTrace', width: 3840, height: 2160, fps: 30, durationInFrames: 300,
} as const;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (v: number) => {const x = clamp(v); return x * x * (3 - 2 * x);};
const phase = (t: number, a: number, b: number) => ease((t - a) / Math.max(0.001, b - a));

type CornerProps = {
  t: number; out: number; drawOnEntry: boolean; index: number;
  color: string; secondaryColor: string;
};

const Corner: React.FC<CornerProps> = ({t, out, drawOnEntry, color, secondaryColor}) => {
  const settle = phase(t, 0.05, 1.1);
  // Distinct square beads build away from a broad elbow; the hold is static.
  const anchor = (drawOnEntry ? phase(t, 0, 0.25) : 1) * (1 - phase(out, 0.7, 1));
  return <g fill={color}>
    <path d="M 0 24 V 0 H 24 V 6 H 6 V 24 Z" opacity={anchor} />
    {Array.from({length: 5}, (_, i) => {
      const p = (drawOnEntry ? phase(t, 0.13 + i * 0.1, 0.4 + i * 0.1) : 1)
        * (1 - phase(out, (4 - i) * 0.1, 0.48 + (4 - i) * 0.1));
      const distance = 34 + i * 18 + (1 - settle) * (i + 1) * 2;
      const side = 7 - i * 0.55;
      return <g key={i} opacity={p}>
        <rect x={distance} y={-0.5 * side + 3} width={side * p} height={side} rx={0.7} />
        <rect x={-0.5 * side + 3} y={distance} width={side} height={side * p} rx={0.7} />
      </g>;
    })}
    <path d="M 15 15 H 23 V 18 H 18 V 23 H 15 Z" fill={secondaryColor} opacity={anchor * 0.8} />
  </g>;
};

export const FocusDottedTrace: React.FC<FocusDottedTraceProps> = ({
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
          const drift = 28 * (1 - lock) + 12 * out;
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

export default FocusDottedTrace;
