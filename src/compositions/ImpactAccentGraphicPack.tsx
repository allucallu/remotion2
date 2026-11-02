import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Five NEW impact accents in a single sequential 30-second composition.
 * Registry: 3840 x 2160, 30 fps, 900 frames. No registry file included.
 * Cut at seconds 6, 12, 18, 24. Three isolated hits per slot: 0, 1.9, 3.8 s.
 * Each hit lasts <=1.55 s. Black gaps separate hits; slots never overlap.
 * The first accent starts at its formed peak for the thumbnail. Set
 * firstAccentVisibleAtStart=false for the normal entrance on that hit as well.
 * Frame-driven SVG only: no external assets, fonts, timers, random(), or glow.
 * Geometry is designed on a 1920 x 1080 canvas and scales to the output.
 */
export type ImpactAccentGraphicPackProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  firstAccentVisibleAtStart?: boolean;
  x?: number;
  y?: number;
  scale?: number;
};
export const ImpactAccentGraphicPackConfig = {
  id: 'ImpactAccentGraphicPack', width: 3840, height: 2160, fps: 30, durationInFrames: 900,
} as const;
export const ImpactAccentGraphicPackSegments = [
  {name: 'Comic Crack', startSeconds: 0, endSeconds: 6},
  {name: 'Crescent Whip', startSeconds: 6, endSeconds: 12},
  {name: 'Block Shatter', startSeconds: 12, endSeconds: 18},
  {name: 'Ribbon Spring', startSeconds: 18, endSeconds: 24},
  {name: 'Corner Clap', startSeconds: 24, endSeconds: 30},
] as const;

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const phase = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const smooth = (v: number) => {const x = clamp(v); return x * x * (3 - 2 * x);};
const out = (v: number) => 1 - (1 - clamp(v)) ** 3;
const polar = (r: number, a: number) => [r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)] as const;
type AccentProps = {age: number; color: string; secondaryColor: string};

// Unequal spikes create an authored comic contour; the topology never jitters.
const teeth = [1, 0.55, 0.84, 0.58, 1.07, 0.57, 0.9, 0.54, 1.02, 0.58, 0.86, 0.56,
  1.06, 0.55, 0.87, 0.59, 1, 0.54, 0.89, 0.57, 1.08, 0.55, 0.88, 0.58] as const;
const jagged = (r: number) => teeth.map((m, i) => {
  const [x, y] = polar(r * m, -90 + i * 15);
  return `${i ? 'L' : 'M'} ${x} ${y}`;
}).join(' ') + ' Z';

const ComicCrack: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  const expand = out(phase(age, 0, 0.84));
  const appear = out(phase(age, 0, 0.12));
  const fade = 1 - smooth(phase(age, 0.38, 1.14));
  const r = (100 + 218 * expand) * appear;
  const hole = 0.55 + 0.43 * smooth(phase(age, 0.23, 1.04));
  return <g opacity={appear * fade}>
    <path d={`${jagged(r)} ${jagged(r * hole)}`} fill={color} fillRule="evenodd" />
    {[-68, 24, 112, 205].map((a, i) => {
      const [x, y] = polar(r * 1.08, a);
      return <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${appear * fade})`}>
        <path d="M -8 -3 L 23 0 L -8 3 Z" fill={secondaryColor} />
      </g>;
    })}
  </g>;
};

const CrescentWhip: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  const appear = out(phase(age, 0, 0.15));
  const travel = out(phase(age, 0, 0.92));
  const fade = 1 - smooth(phase(age, 0.4, 1.24));
  return <g opacity={fade}>
    {[0, 1, 2].map(i => <g key={i}
      transform={`rotate(${i * 120 - 42 + 52 * travel}) translate(${18 * travel} 0) scale(${appear} ${appear * (0.35 + 0.65 * fade)})`}>
      <path d="M 43 -9 C 90 -113 223 -177 298 -72 C 238 -131 133 -77 67 15 C 58 12 49 3 43 -9 Z" fill={color} />
      <path d="M 43 -9 C 90 -113 223 -177 298 -72 C 208 -143 116 -87 43 -9 Z" fill={secondaryColor} opacity={0.72} />
      <path d="M 107 -130 C 167 -179 241 -171 276 -129" stroke={secondaryColor}
        strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M 309 -64 L 327 -39 L 309 -51 Z" fill={color} />
    </g>)}
  </g>;
};

const BlockShatter: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  return <g>
    {[-88, -28, 32, 92, 152, 212].map((angle, i) => {
      const a = age - (i % 2) * 0.025;
      const appear = out(phase(a, 0, 0.12));
      const travel = out(phase(a, 0, 1));
      const fade = 1 - smooth(phase(a, 0.39, 1.23));
      const [x, y] = polar(35 + 192 * travel, angle);
      return <g key={i} transform={`translate(${x} ${y}) rotate(${angle + 13 * travel}) scale(${appear * (0.7 + 0.3 * fade)} ${appear * fade})`} opacity={fade}>
        <path d="M 0 -16 H 28 V -30 H 54 V -17 H 79 V -8 H 95 V 8 H 79 V 17 H 54 V 30 H 28 V 16 H 0 Z" fill={color} />
        <path d="M 0 3 H 28 V 16 H 54 V 30 H 28 V 16 H 0 Z M 54 3 H 79 V 17 H 54 Z" fill={secondaryColor} />
        <path d="M 7 -10 H 23 M 34 -23 H 48" stroke={secondaryColor} strokeWidth={2} />
        <rect x={-25} y={-5} width={10} height={10} fill={secondaryColor} />
      </g>;
    })}
  </g>;
};

const RibbonSpring: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  const appear = out(phase(age, 0, 0.16));
  const travel = out(phase(age, 0, 0.9));
  const fade = 1 - smooth(phase(age, 0.4, 1.25));
  return <g opacity={fade}>
    {[35, 125, 215, 305].map((angle, i) => <g key={i}
      transform={`rotate(${angle - 19 * (1 - travel)}) translate(${35 + 60 * travel} 0) scale(${appear * (0.75 + 0.25 * fade)} ${appear * fade})`}>
      <path d="M 0 -8 L 61 -48 L 105 -10 L 166 -57 L 193 -42 L 105 21 L 62 -16 L 14 17 Z" fill={color} />
      <path d="M 61 -48 L 105 -10 L 105 21 L 62 -16 Z" fill={secondaryColor} />
      <path d="M 105 -10 L 166 -57 L 193 -42 L 169 -41 L 115 1 Z" fill={secondaryColor} opacity={0.55} />
      <path d="M 18 -30 L 53 -54" fill="none" stroke={secondaryColor} strokeWidth={3} strokeLinecap="round" />
      <path d="M 209 -50 L 228 -42 L 209 -34 Z" fill={i % 2 ? secondaryColor : color} />
    </g>)}
  </g>;
};

const CornerClap: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  const appear = out(phase(age, 0, 0.13));
  const travel = out(phase(age, 0, 0.95));
  const fade = 1 - smooth(phase(age, 0.36, 1.2));
  const r = 30 + 117 * travel;
  return <g>
    {([[1, 1], [-1, 1], [-1, -1], [1, -1]] as const).map(([sx, sy], i) => {
      return <g key={i} transform={`translate(${-sx * r} ${-sy * r}) scale(${sx} ${sy})`} opacity={appear * fade}>
        <g transform={`rotate(${-9 * (1 - travel)}) scale(${appear * fade})`}>
          <path d="M -15 94 V -15 H 110 L 78 5 H 6 V 66 Z" fill={color} />
          <path d="M -15 94 V -15 L 6 5 V 66 Z" fill={secondaryColor} />
        </g>
        <path d={`M -30 ${62 * appear} V -31 H ${78 * appear}`} stroke={secondaryColor}
          strokeWidth={3 * fade} fill="none" opacity={fade} />
        <path d="M -45 -35 L -35 -45 L -25 -35 L -35 -25 Z" fill={secondaryColor}
          transform={`translate(${-16 * travel} ${-16 * travel}) scale(${appear * fade})`} />
      </g>;
    })}
  </g>;
};

const accents = [ComicCrack, CrescentWhip, BlockShatter, RibbonSpring, CornerClap] as const;
export const ImpactAccentGraphicPack: React.FC<ImpactAccentGraphicPackProps> = ({
  background = 'black', color = '#F5F1E8', secondaryColor = '#ACBDC1',
  firstAccentVisibleAtStart = true, x = 960, y = 540, scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slot = Math.round(6 * fps);
  const index = Math.floor(frame / slot);
  const t = (frame - index * slot) / fps;
  const hitIndex = Math.min(2, Math.floor(t / 1.9));
  const age = t - hitIndex * 1.9 + (index === 0 && hitIndex === 0 && firstAccentVisibleAtStart ? 0.16 : 0);
  const ActiveAccent = index >= 0 && index < accents.length ? accents[index] : null;
  const backgrounds = {black: '#000000', green: '#00FF00', transparent: 'transparent'};
  return <AbsoluteFill style={{backgroundColor: backgrounds[background], overflow: 'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet" style={{display: 'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.max(0.3, Math.min(1.25, scale))})`}>
        {ActiveAccent && t < 5.7 && age >= 0 && age < 1.55 ? <g data-accent-index={index} data-hit-index={hitIndex}>
          <ActiveAccent age={age} color={color} secondaryColor={secondaryColor} />
        </g> : null}
      </g>
    </svg>
  </AbsoluteFill>;
};
export default ImpactAccentGraphicPack;
