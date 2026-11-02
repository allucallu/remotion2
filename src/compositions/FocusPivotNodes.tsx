import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Standalone component. Register locally: 3840 x 2160, 30 fps, 300 frames.
 * Coordinates below use a 1920 x 1080 design canvas and scale cleanly to 4K.
 * Default: fully visible first frame, focus-lock entry, steady hold, retract exit.
 * Set drawOnEntry=true for a blank first frame and a drawn entrance.
 * No registry, assets, fonts, CSS animation, effects, timers, or random values.
 */
export type FocusPivotNodesProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  /** Width/height of the bracket boundary in design pixels, not output pixels. */
  bracketWidth?: number;
  bracketHeight?: number;
  drawOnEntry?: boolean;
};

export const FocusPivotNodesConfig = {
  id: 'FocusPivotNodes', width: 3840, height: 2160, fps: 30, durationInFrames: 300,
} as const;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (v: number) => {const x = clamp(v); return x * x * (3 - 2 * x);};
const phase = (t: number, a: number, b: number) => ease((t - a) / Math.max(0.001, b - a));

type CornerProps = {
  t: number; out: number; drawOnEntry: boolean; index: number;
  color: string; secondaryColor: string;
};

const Corner: React.FC<CornerProps> = ({t, out, drawOnEntry, color, secondaryColor}) => {
  const lock = phase(t, 0.04, 0.95);
  const node = (drawOnEntry ? phase(t, 0, 0.35) : 1) * (1 - phase(out, 0.6, 1));
  const arms = (drawOnEntry ? phase(t, 0.18, 0.9) : 1) * (1 - phase(out, 0, 0.8));
  const terminals = (drawOnEntry ? phase(t, 0.64, 1.08) : 1) * (1 - phase(out, 0, 0.4));
  const angle = 17 * (1 - lock) + 12 * out;
  return <g fill="none" strokeLinecap="butt">
    <circle cx={0} cy={0} r={8 * node} stroke={color} strokeWidth={3.5} opacity={node} />
    <circle cx={0} cy={0} r={2.2 * node} fill={secondaryColor} opacity={node} />
    <g transform={`rotate(${-angle} 0 0)`} stroke={color} opacity={arms}>
      <path d={`M 17 0 H ${17 + 93 * arms}`} strokeWidth={4} />
      <path d={`M ${17 + 93 * arms} ${-8 * terminals} V ${8 * terminals}`}
        strokeWidth={3} opacity={terminals} />
    </g>
    <g transform={`rotate(${angle} 0 0)`} stroke={color} opacity={arms}>
      <path d={`M 0 17 V ${17 + 72 * arms}`} strokeWidth={4} />
      <path d={`M ${-8 * terminals} ${17 + 72 * arms} H ${8 * terminals}`}
        strokeWidth={3} opacity={terminals} />
    </g>
    <path d="M -18 0 H -28 M 0 -18 V -28" stroke={secondaryColor} strokeWidth={2.5} opacity={node} />
  </g>;
};

export const FocusPivotNodes: React.FC<FocusPivotNodesProps> = ({
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
          const drift = 24 * (1 - lock) + 18 * out;
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

export default FocusPivotNodes;
