import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Five sequential circle/oval highlights, ONE video, no text or external assets.
 * Register: 3840 x 2160, 30 fps, 1050 frames = 35 seconds.
 * Cut at 7,14,21,28 seconds. Each asset draws in, holds still, then erases.
 * Every center remains empty. Background defaults to solid black; no glow.
 * First frame is empty so all five drawing entrances are visible by default.
 * firstHighlightVisibleAtStart=true optionally supplies a fully formed thumbnail.
 * SVG uses physical dash lengths, compatible with browser and still rasterizers.
 * All contours are precomputed; no randomness, temporal jitter, or CSS animation.
 */
export type CircleHighlightFivePackProps = {
  background?: 'black' | 'green' | 'transparent';
  primaryColor?: string;
  secondaryColor?: string;
  firstHighlightVisibleAtStart?: boolean;
  x?: number;
  y?: number;
  scale?: number;
};
export const CircleHighlightFivePackConfig = {
  id: 'CircleHighlightFivePack', width: 3840, height: 2160, fps: 30, durationInFrames: 1050,
} as const;
export const CircleHighlightFivePackSegments = [
  {name: 'Pencil Orbit', startSeconds: 0, endSeconds: 7, color: '#F0E8DA', edge: '#AEA99F'},
  {name: 'Dry Brush Loop', startSeconds: 7, endSeconds: 14, color: '#E3BA64', edge: '#B58F4E'},
  {name: 'Double Sweep', startSeconds: 14, endSeconds: 21, color: '#DF9E87', edge: '#EDCFB8'},
  {name: 'Segmented Lock', startSeconds: 21, endSeconds: 28, color: '#A6C6BE', edge: '#6F9391'},
  {name: 'Ink Oval Flourish', startSeconds: 28, endSeconds: 35, color: '#EBE2CE', edge: '#A6B5AE'},
] as const;

type Point = readonly [number, number];
type Line = {points: Point[]; d: string; length: number};
const phase = (t: number, a: number, b: number) => {
  const p = Math.max(0, Math.min(1, (t - a) / (b - a))); return p * p * (3 - 2 * p);
};
const line = (points: Point[]): Line => {
  let length = 0;
  points.forEach((p, i) => {if (i) length += Math.hypot(p[0] - points[i-1][0], p[1] - points[i-1][1]);});
  return {points, d: points.map(([x,y],i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' '), length: length + 2};
};
const oval = (rx: number, ry: number, start: number, span: number, seed: number, dx = 0, dy = 0): Line => {
  const steps = Math.max(28, Math.ceil(Math.abs(span) / 1.2));
  return line(Array.from({length: steps + 1}, (_, i) => {
    const a = (start + span * i / steps) * Math.PI / 180;
    const w = Math.sin(a * 3 + seed) * 3 + Math.sin(a * 7 + seed * 0.7) * 1.4;
    return [dx + (rx + w) * Math.cos(a) + Math.sin(a * 2 + seed) * 3,
      dy + (ry + w * 0.7) * Math.sin(a) + Math.cos(a * 4 + seed) * 2] as const;
  }));
};
const strokeState = (t: number, first: boolean, begin: number, end: number, exitBegin = 5.72, exitEnd = 6.68) => ({
  draw: first ? 1 : phase(t, begin, end), erase: phase(t, exitBegin, exitEnd),
});
type TraceProps = {geometry: Line; draw: number; erase: number; color: string; width: number; opacity?: number};
const Trace: React.FC<TraceProps> = ({geometry, draw, erase, color, width, opacity = 1}) => {
  const remaining = Math.max(0, draw - erase);
  return <path d={geometry.d} stroke={color} strokeWidth={width} fill="none"
    strokeLinecap="round" strokeLinejoin="round" opacity={remaining <= 0 ? 0 : opacity}
    strokeDasharray={`${remaining * geometry.length} ${geometry.length * 2 + 8}`}
    strokeDashoffset={-erase * geometry.length} />;
};
const paintedOutline = (geometry: Line, thickness: number, seed: number) => {
  const outer: Point[] = []; const inner: Point[] = [];
  const n = geometry.points.length;
  geometry.points.forEach(([x,y],i) => {
    const previous = geometry.points[(i - 1 + n - 1) % (n - 1)];
    const next = geometry.points[(i + 1) % (n - 1)];
    const tx = next[0] - previous[0]; const ty = next[1] - previous[1];
    const norm = Math.max(0.001, Math.hypot(tx,ty));
    const a = i / (n - 1) * Math.PI * 2;
    const w = thickness * (0.77 + 0.23 * Math.sin(a * 2 + seed) + 0.08 * Math.sin(a * 11 + seed));
    outer.push([x + ty/norm*w/2, y - tx/norm*w/2]);
    inner.push([x - ty/norm*w/2, y + tx/norm*w/2]);
  });
  const loop = (p: Point[]) => line(p).d + ' Z';
  return loop(outer) + ' ' + loop(inner.reverse());
};

const pencil = oval(390, 259, -117, 378, 2);
const pencilEcho = oval(397, 264, -111, 362, 7, -2, 3);
const pencilFibers = [-1.8, -0.7, 0.8, 1.9].map((d,i) => oval(390+d,259+d,-117,375,2+i*0.08));
const brush = oval(355, 286, -101, 360, 3);
const brushBody = paintedOutline(brush, 24, 2);
const brushFibers = [-12,-9,9,12].map((d,i) => oval(355+d,286+d,-97+i*11,310+i*7,3+i*0.04));
const doubleA = oval(406,247,-115,370,4);
const doubleB = oval(417,254,51,353,6,9,5);
const segments = Array.from({length:8},(_,i) => oval(326,286,-90+i*45,34,0));
const segmentEchoes = Array.from({length:8},(_,i) => oval(306,266,-86+i*45,22,0));
const ink = oval(427,237,-139,360,9);
const inkBody = paintedOutline(ink,18,5);
const inkFiber = oval(431,240,-135,333,9.1);
const flourish = line(Array.from({length:101},(_,i) => {
  const u=i/100;const v=1-u;
  return [v*v*v*365 + 3*v*v*u*505 + 3*v*u*u*56 + u*u*u*(-286),
    v*v*v*135 + 3*v*v*u*340 + 3*v*u*u*319 + u*u*u*279] as const;
}));

type HighlightProps = {t: number; first: boolean; color: string; edge: string; id: string};
const PencilOrbit: React.FC<HighlightProps> = ({t,first,color,edge}) => <g transform="rotate(-4)">
  <Trace geometry={pencil} {...strokeState(t,first,0.025,0.97)} color={color} width={5.5} />
  <Trace geometry={pencilEcho} {...strokeState(t,first,0.36,1.35,5.7,6.44)} color={edge} width={1.7} opacity={0.7} />
  {pencilFibers.map((g,i) => <Trace key={i} geometry={g} {...strokeState(t,first,0.04+i*0.015,1.01+i*0.015)}
    color={i%2 ? color : edge} width={0.7} opacity={0.48} />)}
</g>;

const DryBrushLoop: React.FC<HighlightProps> = ({t,first,color,edge,id}) => {
  const state=strokeState(t,first,0.025,1.09);
  return <g transform="rotate(6)">
    <defs><mask id={id} maskUnits="userSpaceOnUse" x={-500} y={-400} width={1000} height={800}>
      <Trace geometry={brush} {...state} color="white" width={52} />
    </mask></defs>
    <g mask={`url(#${id})`}>
      <path d={brushBody} fill={color} fillRule="evenodd" />
      {brushFibers.map((g,i) => <path key={i} d={g.d} stroke={i%2 ? color : edge} strokeWidth={1.3}
        opacity={i%2 ? 0.75 : 0.58} fill="none" strokeLinecap="round" />)}
    </g>
  </g>;
};

const DoubleSweep: React.FC<HighlightProps> = ({t,first,color,edge}) => <g transform="rotate(-5)">
  <Trace geometry={doubleA} {...strokeState(t,first,0.03,0.85,5.94,6.68)} color={color} width={9} />
  <Trace geometry={doubleB} {...strokeState(t,first,0.53,1.38,5.68,6.3)} color={edge} width={4.5} />
</g>;

const SegmentedLock: React.FC<HighlightProps> = ({t,first,color,edge}) => <g>
  {segments.map((g,i) => <Trace key={i} geometry={g}
    {...strokeState(t,first,0.03+i*0.075,0.38+i*0.075,5.7+i*0.035,6.32+i*0.04)} color={color} width={12} />)}
  {segmentEchoes.map((g,i) => <Trace key={i} geometry={g}
    {...strokeState(t,first,0.36+i*0.075,0.64+i*0.075,5.68,6.25)} color={edge} width={2.7} />)}
</g>;

const InkOvalFlourish: React.FC<HighlightProps> = ({t,first,color,edge,id}) => {
  const state=strokeState(t,first,0.02,0.98,5.95,6.69);
  return <g transform="rotate(-3)">
    <defs><mask id={id} maskUnits="userSpaceOnUse" x={-550} y={-400} width={1100} height={800}>
      <Trace geometry={ink} {...state} color="white" width={44} />
    </mask></defs>
    <g mask={`url(#${id})`}>
      <path d={inkBody} fill={color} fillRule="evenodd" />
      <path d={inkFiber.d} fill="none" stroke={edge} strokeWidth={1} opacity={0.55} />
    </g>
    <Trace geometry={flourish} {...strokeState(t,first,0.77,1.42,5.68,6.12)} color={edge} width={5.3} />
  </g>;
};

const highlights=[PencilOrbit,DryBrushLoop,DoubleSweep,SegmentedLock,InkOvalFlourish] as const;
export const CircleHighlightFivePack: React.FC<CircleHighlightFivePackProps> = ({
  background='black',primaryColor,secondaryColor,firstHighlightVisibleAtStart=false,x=960,y=540,scale=1,
}) => {
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  const slot=Math.round(7*fps);const index=Math.floor(frame/slot);const t=(frame-index*slot)/fps;
  const segment=index>=0&&index<5 ? CircleHighlightFivePackSegments[index] : null;
  const ActiveHighlight=segment ? highlights[index] : null;
  const uid=React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
  const backgrounds={black:'#000000',green:'#00FF00',transparent:'transparent'};
  return <AbsoluteFill style={{backgroundColor:backgrounds[background],overflow:'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet" style={{display:'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.max(0.3,Math.min(1.3,scale))})`}>
        {segment&&ActiveHighlight&&t<6.72 ? <g data-highlight-index={index}>
          <ActiveHighlight t={t} first={index===0&&firstHighlightVisibleAtStart}
            color={primaryColor??segment.color} edge={secondaryColor??segment.edge} id={`circle-highlight-${uid}`} />
        </g> : null}
      </g>
    </svg>
  </AbsoluteFill>;
};
export default CircleHighlightFivePack;
