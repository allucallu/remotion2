import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Five designed impact accents, sequentially packaged in ONE 30-second video.
 * Register: 3840 x 2160 / 30 fps / 900 frames. No registry or assets required.
 * Cut at 6, 12, 18, and 24 s. Slots contain THREE independent hits at 0, 1.9, 3.8 s.
 * Each hit lasts <=1.55 s; a clean black interval separates hits and slots.
 * Impact accents need quick attacks and decays rather than a long static hold.
 * Only the first hit in slot 1 starts at its fully formed peak, for the thumbnail.
 * Set firstAccentVisibleAtStart=false for a normal full entrance on that hit too.
 * All geometry is deterministic; no CSS animation, random(), blur, glow, or text.
 * Coordinates below are design pixels on a 1920 x 1080 canvas, scaled to output.
 */

export type ImpactAccentFivePackProps = {
  background?: 'black' | 'green' | 'transparent';
  color?: string;
  secondaryColor?: string;
  firstAccentVisibleAtStart?: boolean;
  x?: number;
  y?: number;
  scale?: number;
};

export const ImpactAccentFivePackConfig = {
  id: 'ImpactAccentFivePack', width: 3840, height: 2160, fps: 30, durationInFrames: 900,
} as const;

export const ImpactAccentFivePackSegments = [
  {name: 'Radial Snap', startSeconds: 0, endSeconds: 6},
  {name: 'Facet Break', startSeconds: 6, endSeconds: 12},
  {name: 'Ink Flick', startSeconds: 12, endSeconds: 18},
  {name: 'Prism Star', startSeconds: 18, endSeconds: 24},
  {name: 'Polygon Shock', startSeconds: 24, endSeconds: 30},
] as const;

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const phase = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const smooth = (v: number) => {const x = clamp(v); return x * x * (3 - 2 * x);};
const out = (v: number) => 1 - (1 - clamp(v)) ** 3;
const rad = (deg: number) => deg * Math.PI / 180;
const polar = (r: number, a: number) => [Math.cos(rad(a)) * r, Math.sin(rad(a)) * r] as const;
const polygon = (r: number, sides: number, rotation: number) => Array.from({length: sides}, (_, i) => {
  const [x, y] = polar(r, rotation + i * 360 / sides);
  return `${x},${y}`;
}).join(' ');

type AccentProps = {age: number; color: string; secondaryColor: string};

const rays = [
  [-91, 194, 16], [-63, 122, 11], [-32, 178, 15], [-3, 131, 11],
  [28, 207, 18], [59, 114, 10], [91, 173, 14], [120, 128, 10],
  [151, 202, 17], [181, 112, 10], [210, 167, 14], [239, 122, 10],
] as const;

const RadialSnap: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  return <g>
    {rays.map(([angle, length, width], i) => {
      const delay = (i % 3) * 0.017;
      const a = age - delay;
      const born = out(phase(a, 0, 0.115));
      const travel = out(phase(a, 0, 0.95));
      const vanish = smooth(phase(a, 0.32, 1.12));
      const base = 42 + 132 * travel;
      const len = length * born * (1 - vanish);
      const half = width * (1 - vanish) / 2;
      return <g key={i} transform={`rotate(${angle})`} opacity={1 - vanish}>
        <path d={`M ${base} ${-half * 0.45} Q ${base + len * 0.32} ${-half} ${base + len} 0 Q ${base + len * 0.32} ${half} ${base} ${half * 0.45} Z`}
          fill={i % 3 === 1 ? secondaryColor : color} />
        {i % 2 === 0 ? <path d={`M ${base + 23} -17 h ${22 * born * (1 - vanish)}`}
          stroke={secondaryColor} strokeWidth={2.5} strokeLinecap="round" opacity={born * 0.7} /> : null}
      </g>;
    })}
  </g>;
};

const shards = [[-108, 88, 35], [-62, 114, 40], [-18, 94, 34], [26, 120, 43],
  [72, 82, 32], [119, 106, 38], [163, 90, 35], [207, 117, 39]] as const;

const FacetBreak: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  return <g>
    {shards.map(([angle, length, width], i) => {
      const a = age - (i % 2) * 0.025;
      const born = out(phase(a, 0, 0.14));
      const travel = out(phase(a, 0, 1.12));
      const decay = 1 - smooth(phase(a, 0.43, 1.28));
      const r = 40 + 183 * travel;
      const [x, y] = polar(r, angle);
      const stretch = born * (0.6 + 0.4 * decay);
      return <g key={i} transform={`translate(${x} ${y}) rotate(${angle + 11 * travel}) scale(${stretch} ${born * decay})`} opacity={decay}>
        <path d={`M 0 0 L ${length * 0.42} ${-width / 2} L ${length} 0 L ${length * 0.33} ${width / 2} Z`} fill={color} />
        <path d={`M 0 0 L ${length * 0.42} ${-width / 2} L ${length * 0.55} 0 Z`} fill={secondaryColor} />
        <path d={`M ${length * 0.55} 0 L ${length} 0 L ${length * 0.33} ${width / 2} Z`} fill={secondaryColor} opacity={0.55} />
        <path d="M -31 0 H -12" stroke={secondaryColor} strokeWidth={3} strokeLinecap="round" />
      </g>;
    })}
  </g>;
};

const ink = [[-101, 161, 35], [-49, 127, 25], [-5, 184, 39], [45, 140, 28],
  [91, 177, 37], [145, 133, 28], [195, 173, 33], [239, 121, 25]] as const;

const InkFlick: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  const reveal = out(phase(age, 0, 0.14));
  const travel = out(phase(age, 0, 0.86));
  const fade = 1 - smooth(phase(age, 0.42, 1.32));
  return <g opacity={fade}>
    {ink.map(([angle, length, width], i) => {
      const inner = 23 + 60 * travel;
      const l = length * reveal;
      const w = width * reveal * (0.55 + 0.45 * fade);
      return <g key={i} transform={`rotate(${angle + 4 * travel})`}>
        <path d={`M ${inner} ${-w * 0.14} C ${inner + l * 0.22} ${-w * 0.63} ${inner + l * 0.45} ${-w * 0.39} ${inner + l * 0.76} ${-w * 0.14} L ${inner + l * 0.88} ${-w * 0.18} L ${inner + l} 0 L ${inner + l * 0.86} ${w * 0.17} L ${inner + l * 0.72} ${w * 0.15} C ${inner + l * 0.44} ${w * 0.55} ${inner + l * 0.21} ${w * 0.34} ${inner} ${w * 0.14} Z`}
          fill={color} />
        <ellipse cx={inner + l + 21 + 23 * travel} cy={i % 2 ? 9 : -9} rx={7 * reveal * fade} ry={3.7 * reveal * fade}
          transform={`rotate(${i % 2 ? 13 : -13} ${inner + l + 21 + 23 * travel} ${i % 2 ? 9 : -9})`} fill={color} />
        {i % 2 === 0 ? <circle cx={inner + l * 0.63} cy={w * 0.85} r={3 * reveal * fade} fill={secondaryColor} /> : null}
      </g>;
    })}
  </g>;
};

const starPath = 'M 0 -238 C 15 -52 26 -25 215 0 C 26 22 16 49 0 238 C -15 51 -26 25 -215 0 C -26 -22 -15 -49 0 -238 Z';

const PrismStar: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  const grow = out(phase(age, 0, 0.145));
  const settle = smooth(phase(age, 0.15, 0.38));
  const collapse = smooth(phase(age, 0.38, 1.0));
  const size = grow * (1.07 - 0.07 * settle) * (1 - collapse);
  const fade = 1 - smooth(phase(age, 0.62, 1.08));
  return <g opacity={fade}>
    <g transform={`rotate(${-12 + 15 * out(phase(age, 0, 0.8))}) scale(${size})`}>
      <path d={starPath} fill="none" stroke={secondaryColor} strokeWidth={3} transform="rotate(35) scale(0.82)" />
      <path d={starPath} fill={color} />
      <path d="M 0 -238 C 15 -52 26 -25 215 0 H 0 Z" fill={secondaryColor} opacity={0.78} />
      <path d="M 0 0 H -215 C -26 25 -15 51 0 238 Z" fill={secondaryColor} opacity={0.45} />
    </g>
    {([[-276, -125, 0.19], [257, 160, 0.13]] as const).map(([x, y, s], i) => {
      const a = age - 0.035 * i;
      const satellite = out(phase(a, 0.025, 0.19)) * (1 - smooth(phase(a, 0.4, 1.02)));
      const d = out(phase(a, 0, 0.7));
      return <path key={i} d={starPath} fill={i ? secondaryColor : color}
        transform={`translate(${x * (0.7 + 0.3 * d)} ${y * (0.7 + 0.3 * d)}) rotate(12) scale(${s * satellite})`} />;
    })}
  </g>;
};

const PolygonShock: React.FC<AccentProps> = ({age, color, secondaryColor}) => {
  return <g fill="none" strokeLinejoin="miter">
    {[0, 1, 2].map(i => {
      const a = age - i * 0.07;
      const expand = out(phase(a, 0, 1.12));
      const born = out(phase(a, 0, 0.11));
      const fade = 1 - smooth(phase(a, 0.28, 1.17));
      return <polygon key={i} points={polygon(34 + (276 - i * 24) * expand, 6, -30)}
        stroke={i === 0 ? color : secondaryColor} strokeWidth={(i === 0 ? 12 : 5) * (1 - expand) + 1.4}
        opacity={born * fade * (1 - i * 0.16)} />;
    })}
    {Array.from({length: 6}, (_, i) => {
      const a = age - 0.035;
      const travel = out(phase(a, 0, 1.0));
      const born = out(phase(a, 0, 0.15));
      const fade = 1 - smooth(phase(a, 0.35, 1.2));
      const angle = -30 + i * 60;
      const [x, y] = polar(75 + 267 * travel, angle);
      return <g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${born * fade})`} opacity={fade}>
        <path d="M -10 0 L 4 -7 L 20 0 L 4 7 Z" fill={i % 2 ? secondaryColor : color} stroke="none" />
        <path d="M -37 0 H -22" stroke={secondaryColor} strokeWidth={2.5} strokeLinecap="round" />
      </g>;
    })}
  </g>;
};

const accents = [RadialSnap, FacetBreak, InkFlick, PrismStar, PolygonShock] as const;

export const ImpactAccentFivePack: React.FC<ImpactAccentFivePackProps> = ({
  background = 'black', color = '#F5F1E8', secondaryColor = '#ACBDC1',
  firstAccentVisibleAtStart = true, x = 960, y = 540, scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slotFrames = Math.round(6 * fps);
  const index = Math.floor(frame / slotFrames);
  const t = (frame - index * slotFrames) / fps;
  const hitIndex = Math.min(2, Math.floor(t / 1.9));
  const age = t - hitIndex * 1.9 + (index === 0 && hitIndex === 0 && firstAccentVisibleAtStart ? 0.16 : 0);
  const ActiveAccent = index >= 0 && index < accents.length ? accents[index] : null;
  const visible = t < 5.7 && age >= 0 && age < 1.55;
  const backgrounds = {black: '#000000', green: '#00FF00', transparent: 'transparent'};
  return <AbsoluteFill style={{backgroundColor: backgrounds[background], overflow: 'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid meet" style={{display: 'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.max(0.3, Math.min(1.25, scale))})`}>
        {ActiveAccent && visible ? <g data-accent-index={index} data-hit-index={hitIndex}>
          <ActiveAccent age={age} color={color} secondaryColor={secondaryColor} />
        </g> : null}
      </g>
    </svg>
  </AbsoluteFill>;
};

export default ImpactAccentFivePack;
