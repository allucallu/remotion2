import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Standalone component. Register locally: 3840 x 2160, 30 fps, 300 frames.
 * Coordinates below use a 1920 x 1080 design canvas and scale cleanly to 4K.
 * Default: fully visible first frame, focus-lock entry, steady hold, retract exit.
 * Set drawOnEntry=true for a blank first frame and a drawn entrance.
 * No registry, assets, fonts, CSS animation, effects, timers, or random values.
 */
export type FocusCutCornerProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  /** Width/height of the bracket boundary in design pixels, not output pixels. */
  bracketWidth?: number;
  bracketHeight?: number;
  drawOnEntry?: boolean;
};

export const FocusCutCornerConfig = {
  id: 'FocusCutCorner', width: 3840, height: 2160, fps: 30, durationInFrames: 300,
} as const;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (v: number) => {const x = clamp(v); return x * x * (3 - 2 * x);};
const phase = (t: number, a: number, b: number) => ease((t - a) / Math.max(0.001, b - a));

type CornerProps = {
  t: number; out: number; drawOnEntry: boolean; index: number;
  color: string; secondaryColor: string;
};

const Corner: React.FC<CornerProps> = ({t, out, drawOnEntry, color, secondaryColor}) => {
  const bridge = (drawOnEntry ? phase(t, 0, 0.32) : 1) * (1 - phase(out, 0.7, 1));
  const arm = (drawOnEntry ? phase(t, 0.17, 0.74) : 1) * (1 - phase(out, 0.12, 0.8));
  const tip = (drawOnEntry ? phase(t, 0.45, 0.95) : 1) * (1 - phase(out, 0, 0.5));
  const gap = 8 + 15 * (1 - phase(t, 0.45, 1.03));
  return <g fill="none" strokeLinecap="butt" strokeLinejoin="bevel">
    <path d={`M ${22 * (1 - bridge)} ${22 * bridge} L 22 0`} stroke={color} strokeWidth={6} opacity={bridge} />
    <path d={`M 22 0 H ${22 + 57 * arm} M 0 22 V ${22 + 42 * arm}`} stroke={color} strokeWidth={6} opacity={arm} />
    <path d={`M ${79 + gap} 0 h ${29 * tip} M 0 ${64 + gap} v ${21 * tip}`}
      stroke={color} strokeWidth={6} opacity={tip} />
    <path d={`M 29 12 H ${29 + 20 * tip}`} stroke={secondaryColor} strokeWidth={2.5} opacity={tip} />
  </g>;
};

export const FocusCutCorner: React.FC<FocusCutCornerProps> = ({
  background = 'black', color = '#F5F3EC', secondaryColor = '#AAAEB3',
  bracketWidth = 780, bracketHeight = 440, drawOnEntry = false,
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
          const drift = 46 * (1 - lock) + 10 * out;
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

export default FocusCutCorner;
