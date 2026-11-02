import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Five natural painted caption backgrounds in one sequential 42-second video.
 * Register: 3840 x 2160 / 30 FPS / 1260 frames. No registry included.
 * Cut at 8,16,24,33 seconds. All strokes paint in, hold still, then wipe out.
 * Fine independently timed filaments form the moving brush front and feathered tips.
 * A continuous pigment bed keeps the center opaque enough for editor-added text.
 * Seeded geometry is precomputed once: no temporal noise, random(), or flickering.
 * No fonts, external assets, brush objects, hands, text, blur, glow, or audio.
 * Design coordinates are 1920 x 1080, scaled cleanly to the output resolution.
 */
export type NaturalBrushCaptionPackProps = {
  background?: 'black' | 'green' | 'transparent';
  primaryColor?: string;
  secondaryColor?: string;
  x?: number;
  y?: number;
  scale?: number;
  firstBrushVisibleAtStart?: boolean;
};
export const NaturalBrushCaptionPackConfig = {
  id: 'NaturalBrushCaptionPack', width: 3840, height: 2160, fps: 30, durationInFrames: 1260,
} as const;
export const NaturalBrushCaptionPackSegments = [
  {name: 'Ivory Hog Bristle', startSeconds: 0, endSeconds: 8, color: '#EADABE', edge: '#BBA482'},
  {name: 'Clay Gouache', startSeconds: 8, endSeconds: 16, color: '#CD8F77', edge: '#9A624F'},
  {name: 'Dry Indigo', startSeconds: 16, endSeconds: 24, color: '#7F9FB5', edge: '#416278'},
  {name: 'Sage Overpaint', startSeconds: 24, endSeconds: 33, color: '#9DAF8F', edge: '#667E5C'},
  {name: 'Ochre Arc', startSeconds: 33, endSeconds: 42, color: '#DDB968', edge: '#A7803D'},
] as const;

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const phase = (t: number, a: number, b: number) => {
  const p = clamp((t - a) / (b - a)); return p * p * (3 - 2 * p);
};
const seeded = (seed: number) => {
  let n = seed >>> 0;
  return () => {n = (Math.imul(1664525, n) + 1013904223) >>> 0; return n / 4294967296;};
};
type Point = readonly [number, number];
// Closed Catmull-Rom contour: organic rounding, no repeated zigzag teeth.
const contour = (points: Point[]) => {
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length; i++) {
    const a = points[(i - 1 + points.length) % points.length];
    const b = points[i]; const c = points[(i + 1) % points.length]; const e = points[(i + 2) % points.length];
    d += ` C ${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`;
  }
  return d + ' Z';
};

type Filament = {d: string; length: number; width: number; opacity: number; light: boolean; delay: number; offset: number};
type Geometry = {body: string; filaments: Filament[]; mask: Filament[]; flecks: {d: string; opacity: number}[]};
const makeGeometry = (seed: number, height: number, arch: number, tilt: number, dry: boolean): Geometry => {
  const rng = seeded(seed);
  const center = (u: number) => -arch * Math.sin(Math.PI * u) + tilt * (u - 0.5);
  const points: Point[] = [];
  for (let i = 0; i <= 24; i++) {
    const u = i / 24; const press = 0.77 + 0.23 * Math.sin(Math.PI * u) ** 0.35;
    points.push([-530 + 1060 * u, center(u) - height * press + (rng() - 0.5) * 6]);
  }
  for (let i = 1; i < 12; i++) {
    const v = i / 12;
    points.push([532 + rng() * 23 + Math.sin(v * Math.PI) * 6,
      center(1) + height * (-0.77 + v * 1.54)]);
  }
  for (let i = 24; i >= 0; i--) {
    const u = i / 24; const press = 0.77 + 0.23 * Math.sin(Math.PI * u) ** 0.35;
    points.push([-530 + 1060 * u, center(u) + height * press + (rng() - 0.5) * 6]);
  }
  for (let i = 1; i < 12; i++) {
    const v = i / 12;
    points.push([-532 - rng() * 24 - Math.sin(v * Math.PI) * 5,
      center(0) + height * (0.77 - v * 1.54)]);
  }
  const strand = (y: number, spread: number, width: number, opacity: number): Filament => {
    const left = -536 - rng() * spread;
    const right = 536 + rng() * spread;
    const wobble = (rng() - 0.5) * 6;
    const a: Point = [left, center(0) + y * 0.89];
    const b: Point = [-265, center(0.25) + y + wobble];
    const c: Point = [250, center(0.75) + y - wobble];
    const d: Point = [right, center(1) + y * 0.9];
    let length = 0; let previous: Point = a;
    for (let j = 1; j <= 64; j++) {
      const t = j / 64; const u = 1 - t;
      const next: Point = [u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
        u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]];
      length += Math.hypot(next[0] - previous[0], next[1] - previous[1]); previous = next;
    }
    return {d: `M ${a[0]} ${a[1]} C ${b[0]} ${b[1]} ${c[0]} ${c[1]} ${d[0]} ${d[1]}`, length: length + 2,
      width, opacity, light: rng() > 0.54, delay: rng() * 0.06, offset: rng() * 0.06};
  };
  const filaments: Filament[] = [];
  for (let i = 0; i < 104; i++) {
    const norm = i / 103 * 2 - 1;
    const outer = Math.abs(norm) > 0.64;
    filaments.push(strand(norm * height * (1.02 + rng() * 0.05), outer ? 35 + (dry ? 27 : 0) : 22,
      outer ? 0.65 + rng() * 1.35 : 0.4 + rng() * 0.55,
      outer ? 0.26 + rng() * 0.42 : 0.01 + rng() * 0.015));
  }
  const mask: Filament[] = [];
  for (let i = 0; i < 75; i++) mask.push(strand(-height * 1.22 + i / 74 * height * 2.44, 71,
    height * 2.44 / 74 + 10.1, 1));
  const flecks = Array.from({length: 100}, (_, i) => {
    const x = -500 + rng() * 1000; const u = (x + 530) / 1060;
    const y = center(u) + (i % 2 ? -1 : 1) * height * (0.72 + rng() * 0.31);
    const len = 2 + rng() * (dry ? 19 : 11);
    return {d: `M ${x} ${y} q ${len * 0.5} ${(rng() - 0.5) * 1.3} ${len} ${(rng() - 0.5) * 1.2}`,
      opacity: 0.08 + rng() * (dry ? 0.18 : 0.1)};
  });
  return {body: contour(points), filaments, mask, flecks};
};
const geometries = [makeGeometry(211, 83, 4, -4, true), makeGeometry(420, 96, 3, -9, false),
  makeGeometry(813, 82, 8, -14, true), makeGeometry(1052, 89, 3, 5, false), makeGeometry(1601, 87, 24, 7, false)];

type PaintProps = {geometry: Geometry; id: string; t: number; start: number; finish: number;
  exitStart: number; exitFinish: number; color: string; edge: string; reverse?: boolean; first: boolean};
const PaintedStroke: React.FC<PaintProps> = ({geometry, id, t, start, finish, exitStart, exitFinish,
  color, edge, reverse = false, first}) => {
  const enter = first ? 1 : phase(t, start, finish + 0.06);
  const leave = phase(t, exitStart, exitFinish + 0.06);
  return <g opacity={enter <= 0 || leave >= 1 ? 0 : 1}>
    <defs><mask id={id} x={-720} y={-220} width={1440} height={440}
      maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
      <g transform={reverse ? 'scale(-1 1)' : undefined} fill="none" stroke="white" strokeLinecap="butt">
        {geometry.mask.map((strand, i) => {
          const draw = first ? 1 : phase(t, start + strand.delay, finish + strand.offset);
          const erase = phase(t, exitStart + strand.delay, exitFinish + strand.offset);
          return <path key={i} d={strand.d} strokeWidth={strand.width}
            strokeDasharray={`${Math.max(0, draw - erase) * strand.length} ${strand.length * 2 + 8}`}
            strokeDashoffset={-erase * strand.length} />;
        })}
      </g>
    </mask></defs>
    <g mask={`url(#${id})`}>
      <path d={geometry.body} fill={color} />
      <g fill="none" strokeLinecap="round">
        {geometry.filaments.map((strand, i) => <path key={i} d={strand.d} strokeWidth={strand.width}
          stroke={strand.light ? '#FFF8E9' : edge} opacity={strand.opacity} />)}
        {geometry.flecks.map((f, i) => <path key={i} d={f.d} stroke={edge} strokeWidth={0.7} opacity={f.opacity} />)}
      </g>
    </g>
  </g>;
};

export const NaturalBrushCaptionPack: React.FC<NaturalBrushCaptionPackProps> = ({
  background = 'black', primaryColor, secondaryColor, x = 960, y = 780, scale = 1,
  firstBrushVisibleAtStart = false,
}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const index = NaturalBrushCaptionPackSegments.findIndex(s => frame >= Math.round(s.startSeconds * fps)
    && frame < Math.round(s.endSeconds * fps));
  const segment = index >= 0 ? NaturalBrushCaptionPackSegments[index] : null;
  const t = segment ? (frame - Math.round(segment.startSeconds * fps)) / fps : 0;
  const duration = segment ? segment.endSeconds - segment.startSeconds : 0;
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const first = index === 0 && firstBrushVisibleAtStart;
  const backgrounds = {black: '#000000', green: '#00FF00', transparent: 'transparent'};
  const color = primaryColor ?? segment?.color ?? '#EADABE';
  const edge = secondaryColor ?? segment?.edge ?? '#BBA482';
  return <AbsoluteFill style={{backgroundColor: backgrounds[background], overflow: 'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet" style={{display: 'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.max(0.3, Math.min(1.25, scale))})`}>
        {segment && index >= 0 ? <g data-brush-index={index}>
          {index === 3 ? <g transform="translate(5 -18) rotate(-0.7)">
            <PaintedStroke geometry={geometries[0]} id={`natural-under-${uid}`} t={t} start={0.02} finish={0.9}
              exitStart={duration - 0.9} exitFinish={duration - 0.3} color="#DCD0B4" edge="#B7A586" first={false} />
          </g> : null}
          <PaintedStroke geometry={geometries[index]} id={`natural-brush-${uid}`} t={t}
            start={index === 3 ? 0.37 : 0.025} finish={index === 3 ? 1.48 : index === 4 ? 1.25 : 1.08}
            exitStart={duration - (index === 3 ? 1.5 : 1.25)} exitFinish={duration - (index === 3 ? 0.63 : 0.3)}
            color={color} edge={edge} reverse={index === 2 || index === 3} first={first} />
        </g> : null}
      </g>
    </svg>
  </AbsoluteFill>;
};
export default NaturalBrushCaptionPack;
