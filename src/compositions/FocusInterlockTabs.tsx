import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Standalone component. Register locally: 3840 x 2160, 30 fps, 300 frames.
 * Coordinates below use a 1920 x 1080 design canvas and scale cleanly to 4K.
 * Default: fully visible first frame, focus-lock entry, steady hold, retract exit.
 * Set drawOnEntry=true for a blank first frame and a drawn entrance.
 * No registry, assets, fonts, CSS animation, effects, timers, or random values.
 */
export type FocusInterlockTabsProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  /** Width/height of the bracket boundary in design pixels, not output pixels. */
  bracketWidth?: number;
  bracketHeight?: number;
  drawOnEntry?: boolean;
};

export const FocusInterlockTabsConfig = {
  id: 'FocusInterlockTabs', width: 3840, height: 2160, fps: 30, durationInFrames: 300,
} as const;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (v: number) => {const x = clamp(v); return x * x * (3 - 2 * x);};
const phase = (t: number, a: number, b: number) => ease((t - a) / Math.max(0.001, b - a));

type CornerProps = {
  t: number; out: number; drawOnEntry: boolean; index: number;
  color: string; secondaryColor: string;
};

const Corner: React.FC<CornerProps> = ({t, out, drawOnEntry, color, secondaryColor}) => {
  const enter = phase(t, 0.06, 0.96);
  const p = (drawOnEntry ? enter : 1) * (1 - phase(out, 0.24, 1));
  const travel = 26 * (1 - enter) + 45 * out;
  const latch = (drawOnEntry ? phase(t, 0.58, 1.12) : 1) * (1 - phase(out, 0, 0.35));
  // Complementary stepped ends assemble around a deliberate 3 px seam.
  return <g fill={color} opacity={p}>
    <g transform={`translate(${-travel} 0)`}>
      <path d="M 0 0 H 112 V 10 H 25 V 20 H 13 V 10 H 0 Z" />
      <path d="M 86 14 H 112 V 17 H 86 Z" fill={secondaryColor} />
    </g>
    <g transform={`translate(0 ${-travel})`}>
      <path d="M 0 13 H 10 V 26 H 22 V 36 H 10 V 99 H 0 Z" />
      <path d="M 14 73 H 17 V 99 H 14 Z" fill={secondaryColor} />
    </g>
    <g transform={`translate(${9 * (1 - latch)} ${9 * (1 - latch)})`} opacity={latch}>
      <path d="M 28 24 H 41 V 28 H 32 V 37 H 28 Z" fill={secondaryColor} />
    </g>
  </g>;
};

export const FocusInterlockTabs: React.FC<FocusInterlockTabsProps> = ({
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
          const drift = 30 * (1 - lock) + 20 * out;
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

export default FocusInterlockTabs;
