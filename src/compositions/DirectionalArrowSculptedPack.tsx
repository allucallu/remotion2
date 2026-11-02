import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Five NEW sequential arrow designs in one 30-second composition.
 * Register locally: 3840 x 2160, 30 fps, 900 frames. No registry included.
 * Slots: 0-6 / 6-12 / 12-18 / 18-24 / 24-30 seconds.
 * Each slot: .7 s entry, 4.3 s hold, .7 s exit, .3 s clean black gap.
 * First arrow starts complete for a useful thumbnail. Later arrows assemble in.
 * Only one arrow is mounted at any time. No text, logos, glow, or external assets.
 * Stable hold frames: local 1.2-1.6, 2.4-3.3, 4.3-5 seconds.
 * Set directionalNudges=false for a completely still hold; ideal for freeze frames.
 * SVG coordinates use 1920 x 1080 design pixels and scale cleanly to 4K.
 */

export type DirectionalArrowSculptedPackProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  firstArrowVisibleAtStart?: boolean;
  directionalNudges?: boolean;
  x?: number;
  y?: number;
  scale?: number;
};

export const DirectionalArrowSculptedPackConfig = {
  id: 'DirectionalArrowSculptedPack', width: 3840, height: 2160,
  fps: 30, durationInFrames: 900,
} as const;

export const DirectionalArrowSculptedPackSegments = [
  {name: 'Folded Ribbon', startSeconds: 0, endSeconds: 6},
  {name: 'Rounded Elbow', startSeconds: 6, endSeconds: 12},
  {name: 'Hook Return', startSeconds: 12, endSeconds: 18},
  {name: 'Converging Lanes', startSeconds: 18, endSeconds: 24},
  {name: 'Chisel Brush', startSeconds: 24, endSeconds: 30},
] as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const phase = (t: number, a: number, b: number) => {
  const x = clamp((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const bump = (t: number, start: number, duration: number) => {
  const p = (t - start) / duration;
  return p <= 0 || p >= 1 ? 0 : Math.sin(Math.PI * p) ** 2;
};
type ArrowProps = {
  t: number; first: boolean; color: string; secondaryColor: string;
  nudge: number; id: string;
};

const FoldedRibbon: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge, id}) => {
  const enter = first ? 1 : phase(t, 0.02, 0.65);
  const exit = phase(t, 5, 5.7);
  const p = enter * (1 - exit);
  const fold = 1 - phase(t, 0, 0.7);
  return <g transform={`translate(${nudge * 15} 0)`}>
    <defs><clipPath id={id} clipPathUnits="userSpaceOnUse">
      <rect x={-570} y={-190} width={1140 * p} height={380} />
    </clipPath></defs>
    <g clipPath={`url(#${id})`}>
      <path d="M -540 0 H -117 L -49 75 H -540 Z" fill={secondaryColor} />
      <g transform={`translate(0 ${fold * 6})`}>
        <path d="M -540 -33 H -122 L -51 42 H -540 Z" fill={color} />
        <path d="M -122 -33 L -51 42 L 31 -33 L -40 -108 Z" fill={secondaryColor} />
        <path d="M -40 -108 H 295 V -168 L 548 -1 L 295 166 V 43 H -51 L 31 -33 H -40 Z" fill={color} />
        <path d="M -40 -108 L 31 -33 H 295 V -48 H 38 L -23 -108 Z" fill={secondaryColor} opacity={0.72} />
        <path d="M -519 -21 H -136 M 317 -128 L 498 -8" stroke={secondaryColor} strokeWidth={2.5} fill="none" />
      </g>
    </g>
  </g>;
};

const RoundedElbow: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge}) => {
  const draw = first ? 1 : phase(t, 0.02, 0.6);
  const erase = phase(t, 5, 5.65);
  const remain = Math.max(0, draw - erase);
  const head = (first ? 1 : phase(t, 0.4, 0.7)) * (1 - phase(t, 5.3, 5.7));
  return <g transform={`translate(${nudge * 14} 0)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M -525 123 H -182 Q -112 123 -112 53 V -65 Q -112 -123 -54 -123 H 509"
      stroke={color} strokeWidth={24} pathLength={1} strokeDasharray={`${remain} 2`}
      strokeDashoffset={-erase} opacity={remain > 0 ? 1 : 0} />
    <path d="M 364 -240 L 509 -123 L 364 -6" stroke={color} strokeWidth={24}
      pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - head} opacity={head} />
    <path d="M -525 151 H -303" stroke={secondaryColor} strokeWidth={4}
      opacity={draw * (1 - phase(t, 5, 5.35))} />
  </g>;
};

const HookReturn: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge}) => {
  const draw = first ? 1 : phase(t, 0.02, 0.61);
  const erase = phase(t, 5, 5.65);
  const remain = Math.max(0, draw - erase);
  const head = (first ? 1 : phase(t, 0.42, 0.7)) * (1 - phase(t, 5.3, 5.7));
  return <g transform={`translate(${-nudge * 14} 0)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M -501 129 H 260 C 430 129 430 -129 260 -129 H -266" stroke={color} strokeWidth={26}
      pathLength={1} strokeDasharray={`${remain} 2`} strokeDashoffset={-erase} opacity={remain > 0 ? 1 : 0} />
    <path d="M -135 -241 L -266 -129 L -135 -17" stroke={color} strokeWidth={26}
      pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - head} opacity={head} />
    <path d="M 269 96 C 386 96 386 -96 269 -96" stroke={secondaryColor} strokeWidth={4}
      pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} opacity={draw * (1 - erase)} />
  </g>;
};

const ConvergingLanes: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge}) => {
  const lanes = [
    'M -541 -131 H -256 C -75 -131 -81 -28 144 -28 H 359',
    'M -541 0 H 376',
    'M -541 131 H -256 C -75 131 -81 28 144 28 H 359',
  ] as const;
  const head = (first ? 1 : phase(t, 0.4, 0.7)) * (1 - phase(t, 5.27, 5.7));
  return <g transform={`translate(${nudge * 15} 0)`}>
    {lanes.map((d, i) => {
      const delay = i === 1 ? 0 : 0.06;
      const draw = first ? 1 : phase(t, 0.02 + delay, 0.55 + delay);
      const erase = phase(t, 5 + delay, 5.61 + delay);
      const remain = Math.max(0, draw - erase);
      return <path key={i} d={d} stroke={i === 1 ? color : secondaryColor} strokeWidth={i === 1 ? 17 : 13}
        fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${remain} 2`}
        strokeDashoffset={-erase} opacity={remain > 0 ? 1 : 0} />;
    })}
    <g transform={`translate(352 0) scale(${Math.max(0.001, head)} 1) translate(-352 0)`} opacity={head}>
      <path d="M 352 -139 L 551 0 L 352 139 L 392 0 Z" fill={color} />
      <path d="M 383 -104 L 520 -5" stroke={secondaryColor} strokeWidth={2.5} fill="none" />
    </g>
  </g>;
};

const ChiselBrush: React.FC<ArrowProps> = ({t, first, color, secondaryColor, nudge, id}) => {
  const draw = first ? 1 : phase(t, 0.01, 0.7);
  const erase = phase(t, 5, 5.7);
  return <g transform={`translate(${nudge * 14} ${-nudge * 2})`}>
    <defs><clipPath id={id} clipPathUnits="userSpaceOnUse">
      <rect x={-580 + 1160 * erase} y={-220} width={1160 * Math.max(0, draw - erase)} height={440} />
    </clipPath></defs>
    <g clipPath={`url(#${id})`}>
      <path d="M -549 -29 L -517 -40 L -484 -37 C -258 -28 -15 -59 258 -48 L 248 -171 L 281 -161 L 302 -150 L 549 -19 L 527 2 L 278 170 L 262 177 L 267 62 C 24 34 -247 60 -520 49 L -546 37 L -527 22 L -553 10 L -532 -5 Z" fill={color} />
      <path d="M -523 -55 C -403 -50 -310 -48 -232 -51" stroke={secondaryColor} strokeWidth={4}
        fill="none" strokeLinecap="round" />
      <path d="M -520 65 C -413 71 -306 67 -224 66" stroke={color} strokeWidth={5}
        fill="none" strokeLinecap="round" />
      <path d="M -502 78 L -453 80 M -442 80 L -421 80" stroke={secondaryColor} strokeWidth={2.5}
        fill="none" strokeLinecap="round" />
      <path d="M 286 -140 C 363 -99 425 -65 499 -28" stroke={secondaryColor} strokeWidth={3}
        fill="none" strokeLinecap="round" />
    </g>
  </g>;
};

const arrows = [FoldedRibbon, RoundedElbow, HookReturn, ConvergingLanes, ChiselBrush] as const;

export const DirectionalArrowSculptedPack: React.FC<DirectionalArrowSculptedPackProps> = ({
  background = 'black', color = '#F4F0E7', secondaryColor = '#A9BCC1',
  firstArrowVisibleAtStart = true, directionalNudges = true, x = 960, y = 540, scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slot = Math.round(6 * fps);
  const index = Math.floor(frame / slot);
  const t = (frame - index * slot) / fps;
  const ActiveArrow = index >= 0 && index < arrows.length ? arrows[index] : null;
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const first = index === 0 && firstArrowVisibleAtStart;
  const nudge = directionalNudges ? bump(t, 1.7, 0.55) + bump(t, 3.55, 0.55) : 0;
  const backgrounds = {black: '#000000', green: '#00FF00', transparent: 'transparent'};
  return <AbsoluteFill style={{backgroundColor: backgrounds[background], overflow: 'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid meet" style={{display: 'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.max(0.3, Math.min(1.4, scale))})`}>
        {ActiveArrow && t < 5.7 ? <g data-arrow-index={index}>
          <ActiveArrow t={t} first={first} color={color} secondaryColor={secondaryColor}
            nudge={nudge} id={`arrow-sculpted-pack-${uid}`} />
        </g> : null}
      </g>
    </svg>
  </AbsoluteFill>;
};

export default DirectionalArrowSculptedPack;
