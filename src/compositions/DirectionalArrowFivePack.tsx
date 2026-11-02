import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Five sequential arrow assets in ONE composition; no registry or external assets.
 * Register at 3840 x 2160, 30 fps, 900 frames (30 seconds).
 * Cut at 00:06, 00:12, 00:18, 00:24. Each six-second slot is independent.
 * Per slot: 0-.7 s entrance, .7-5 s hold, 5-5.7 s exit, 5.7-6 s black.
 * Arrow 1 starts fully visible for the thumbnail by default. Arrows 2-5 draw in.
 * Hold motion: two short, bounded directional nudges; otherwise completely still.
 * All five arrows occupy the same central area; only ONE arrow is mounted at once.
 * Design coordinates: 1920 x 1080. SVG scales cleanly to the 4K output.
 * No text, logos, neon, glow, audio, fonts, CSS animations, or network requests.
 */

export type DirectionalArrowFivePackProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  firstArrowVisibleAtStart?: boolean;
  /** Applies to the entire artwork in the 1920 x 1080 design coordinate space. */
  x?: number;
  y?: number;
  scale?: number;
  /** Disable for a completely still holding section. */
  directionalNudges?: boolean;
};

export const DirectionalArrowFivePackConfig = {
  id: 'DirectionalArrowFivePack',
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 900,
} as const;

export const DirectionalArrowFivePackSegments = [
  {name: 'Clean Precision', startSeconds: 0, endSeconds: 6},
  {name: 'Bold Cut', startSeconds: 6, endSeconds: 12},
  {name: 'Hand-drawn Sweep', startSeconds: 12, endSeconds: 18},
  {name: 'Segmented Flow', startSeconds: 18, endSeconds: 24},
  {name: 'Curved Guide', startSeconds: 24, endSeconds: 30},
] as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => {const p = clamp(v); return p * p * (3 - 2 * p);};
const phase = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const bump = (t: number, start: number, duration: number) => {
  const p = (t - start) / duration;
  return p <= 0 || p >= 1 ? 0 : Math.sin(Math.PI * p) ** 2;
};

type ArrowProps = {
  t: number;
  first: boolean;
  color: string;
  secondaryColor: string;
  nudge: number;
  nudges: boolean;
  id: string;
};

const CleanPrecision: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge}) => {
  const exit = phase(t, 5, 5.7);
  const shaft = (first ? 1 : phase(t, 0.04, 0.53)) * (1 - exit);
  const head = (first ? 1 : phase(t, 0.32, 0.7)) * (1 - phase(t, 5, 5.55));
  const tip = -540 + 1055 * shaft;
  return <g transform={`translate(${nudge * 15 - (first ? 12 * (1 - phase(t, 0, 0.7)) : 0)} 0)`}
    fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={`M -540 0 H ${tip}`} stroke={color} strokeWidth={15} opacity={shaft > 0 ? 1 : 0} />
    <path d={`M ${tip - 148 * head} ${-132 * head} L ${tip} 0 L ${tip - 148 * head} ${132 * head}`}
      stroke={color} strokeWidth={15} opacity={head} />
    <path d="M -540 24 H -460" stroke={secondaryColor} strokeWidth={3}
      opacity={(first ? 1 : phase(t, 0.38, 0.7)) * (1 - phase(t, 5, 5.32))} />
  </g>;
};

const BoldCut: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge}) => {
  const pieces = [
    {anchor: -548, d: 'M -548 -48 H -366 V 48 H -548 L -520 0 Z', fill: secondaryColor},
    {anchor: -348, d: 'M -348 -48 H 249 V 48 H -348 Z', fill: color},
    {anchor: 265, d: 'M 265 -143 L 537 0 L 265 143 V 48 H 265 V -48 Z', fill: color},
  ];
  return <g transform={`translate(${nudge * 18} 0)`}>
    {pieces.map(({anchor, d, fill}, i) => {
      const enter = first ? 1 : phase(t, 0.11 * i, 0.4 + 0.13 * i);
      const leave = phase(t, 5 + (2 - i) * 0.07, 5.48 + (2 - i) * 0.08);
      const p = enter * (1 - leave);
      return <g key={i} opacity={p} transform={`translate(${anchor - 22 * (1 - enter)} 0) scale(${Math.max(0.001, p)} 1) translate(${-anchor} 0)`}>
        <path d={d} fill={fill} />
        {i === 2 ? <path d="M 288 -111 L 489 -5" stroke={secondaryColor} strokeWidth={3} opacity={0.65} /> : null}
      </g>;
    })}
  </g>;
};

const HandDrawnSweep: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge, id}) => {
  const draw = first ? 1 : phase(t, 0.02, 0.57);
  const erase = phase(t, 5, 5.6);
  const head = (first ? 1 : phase(t, 0.38, 0.7)) * (1 - phase(t, 5.28, 5.7));
  return <g transform={`translate(${nudge * 13} ${-nudge * 3})`}>
    <defs><clipPath id={id} clipPathUnits="userSpaceOnUse">
      <rect x={-580 + 1140 * erase} y={-170} width={1140 * Math.max(0, draw - erase)} height={340} />
    </clipPath></defs>
    <g clipPath={`url(#${id})`}>
      <path d="M -550 62 C -420 -22 -252 -49 -95 -34 C 78 -18 202 20 325 -13 C 389 -30 455 -54 500 -75 L 506 -58 C 442 -35 391 -11 330 3 C 203 37 64 -4 -97 -17 C -249 -33 -410 -7 -542 79 L -551 75 L -546 69 Z" fill={color} />
      <path d="M -533 91 C -438 32 -365 7 -302 -3" stroke={secondaryColor} strokeWidth={3.5}
        strokeLinecap="round" fill="none" />
    </g>
    <path d="M 377 -139 C 423 -123 474 -105 522 -79 C 490 -35 459 13 431 58"
      fill="none" stroke={color} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - head} opacity={head} />
    <path d="M 391 -142 L 426 -131" fill="none" stroke={secondaryColor} strokeWidth={2.5}
      strokeLinecap="round" opacity={head * 0.65} />
  </g>;
};

const SegmentedFlow: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge, nudges}) => {
  return <g>
    {Array.from({length: 8}, (_, i) => {
      const x = -550 + i * 103;
      const enter = first ? 1 : phase(t, i * 0.045, 0.3 + i * 0.045);
      const leave = phase(t, 5 + (7 - i) * 0.025, 5.42 + (7 - i) * 0.025);
      const pulse = bump(t, 1.6 + i * 0.055, 0.36) + bump(t, 3.45 + i * 0.055, 0.36);
      const move = nudges ? pulse * 9 : 0;
      return <g key={i} transform={`translate(${x + move + 17 * (1 - enter)} 0)`}
        opacity={enter * (1 - leave)}>
        <path d="M 0 -19 H 70 L 84 0 L 70 19 H 0 L 14 0 Z" fill={i < 2 ? secondaryColor : color} />
      </g>;
    })}
    {[0, 1].map(i => {
      const enter = first ? 1 : phase(t, 0.36 + i * 0.06, 0.63 + i * 0.06);
      const leave = phase(t, 5 + i * 0.05, 5.62 + i * 0.07);
      return <path key={i} d={`M ${277 + i * 118} -112 L ${403 + i * 118} 0 L ${277 + i * 118} 112`}
        transform={`translate(${nudge * (10 + i * 5)} 0)`} fill="none"
        stroke={i === 0 ? secondaryColor : color} strokeWidth={17} strokeLinejoin="round" strokeLinecap="round"
        pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - enter} opacity={enter * (1 - leave)} />;
    })}
  </g>;
};

const CurvedGuide: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge}) => {
  const draw = first ? 1 : phase(t, 0.02, 0.59);
  const erase = phase(t, 5, 5.65);
  const remaining = Math.max(0, draw - erase);
  const head = (first ? 1 : phase(t, 0.39, 0.7)) * (1 - phase(t, 5.3, 5.7));
  return <g transform={`translate(${nudge * 9} ${nudge * 9})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M -490 143 C -346 -153 189 -205 470 65" stroke={color} strokeWidth={19}
      pathLength={1} strokeDasharray={`${remaining} 2`} strokeDashoffset={-erase} opacity={remaining > 0 ? 1 : 0} />
    <path d="M 459 -82 L 470 65 L 323 65" stroke={color} strokeWidth={19}
      pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - head} opacity={head} />
    <path d="M -427 119 C -349 -7 -226 -68 -99 -78" stroke={secondaryColor} strokeWidth={3}
      pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} opacity={draw * (1 - erase)} />
  </g>;
};

const arrows = [CleanPrecision, BoldCut, HandDrawnSweep, SegmentedFlow, CurvedGuide] as const;

export const DirectionalArrowFivePack: React.FC<DirectionalArrowFivePackProps> = ({
  background = 'black', color = '#F4F3ED', secondaryColor = '#BAC5C6',
  firstArrowVisibleAtStart = true, x = 960, y = 540, scale = 1, directionalNudges = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const framesPerAsset = Math.round(6 * fps);
  const index = Math.floor(frame / framesPerAsset);
  const t = (frame - index * framesPerAsset) / fps;
  const ActiveArrow = index >= 0 && index < arrows.length ? arrows[index] : null;
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const first = index === 0 && firstArrowVisibleAtStart;
  const nudge = directionalNudges ? bump(t, 1.7, 0.55) + bump(t, 3.55, 0.55) : 0;
  const backgrounds = {black: '#000000', green: '#00FF00', transparent: 'transparent'};
  return <AbsoluteFill style={{backgroundColor: backgrounds[background], overflow: 'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid meet" style={{display: 'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.min(1.45, Math.max(0.3, scale))})`}>
        {ActiveArrow && t < 5.7 ? <g data-arrow-index={index}>
          <ActiveArrow t={t} first={first} color={color} secondaryColor={secondaryColor}
            nudge={nudge} nudges={directionalNudges} id={`arrow-five-pack-${uid}`} />
        </g> : null}
      </g>
    </svg>
  </AbsoluteFill>;
};

export default DirectionalArrowFivePack;
