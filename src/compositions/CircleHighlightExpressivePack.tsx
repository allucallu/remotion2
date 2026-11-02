import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Five new circle highlights, sequentially packaged in ONE 35-second video.
 * Register: 3840 x 2160 / 30 fps / 1050 frames. No registry included.
 * Slots: 0-7, 7-14, 14-21, 21-28, 28-35 seconds.
 * Each draws in, holds completely still, then erases to a clean black interval.
 * Centers stay empty. No text, logos, glow, assets, or external dependencies.
 * Frame-driven deterministic SVG; physical dash lengths work across renderers.
 * The first frame is empty by default. Set firstHighlightVisibleAtStart=true
 * only when a fully formed first thumbnail is needed.
 */
export type CircleHighlightExpressivePackProps = {
  background?: 'black' | 'green' | 'transparent';
  primaryColor?: string;
  secondaryColor?: string;
  firstHighlightVisibleAtStart?: boolean;
  x?: number;
  y?: number;
  scale?: number;
};
export const CircleHighlightExpressivePackConfig = {
  id: 'CircleHighlightExpressivePack', width: 3840, height: 2160, fps: 30, durationInFrames: 1050,
} as const;
export const CircleHighlightExpressivePackSegments = [
  {name: 'Felt Marker', startSeconds: 0, endSeconds: 7, color: '#ECDDBF', edge: '#BAA786'},
  {name: 'Hatched Oval', startSeconds: 7, endSeconds: 14, color: '#B8D0BA', edge: '#8AAB99'},
  {name: 'Triple Orbit', startSeconds: 14, endSeconds: 21, color: '#A4BBCD', edge: '#DFE6E3'},
  {name: 'Folded Ribbon', startSeconds: 21, endSeconds: 28, color: '#DDBA74', edge: '#9E804A'},
  {name: 'Sketch Emphasis', startSeconds: 28, endSeconds: 35, color: '#E1A18D', edge: '#F0D9BE'},
] as const;

type Point = readonly [number, number];
type Line = {points: Point[]; d: string; length: number};
const phase = (t: number, a: number, b: number) => {
  const p = Math.max(0, Math.min(1, (t-a)/(b-a))); return p*p*(3-2*p);
};
const line = (points: Point[]): Line => {
  let length=0; points.forEach((p,i)=>{if(i) length+=Math.hypot(p[0]-points[i-1][0],p[1]-points[i-1][1]);});
  return {points,d:points.map(([x,y],i)=>`${i?'L':'M'} ${x} ${y}`).join(' '),length:length+2};
};
const point = (rx: number, ry: number, a: number, seed: number): Point => {
  const w=Math.sin(a*3+seed)*6+Math.sin(a*7+seed*0.37)*2;
  return [(rx+w)*Math.cos(a)+Math.sin(a*2+seed)*4,(ry+w*0.6)*Math.sin(a)+Math.cos(a*4+seed)*3];
};
const oval = (rx: number,ry: number,start: number,span: number,seed: number): Line => {
  const steps=Math.max(24,Math.ceil(Math.abs(span)/1.1));
  return line(Array.from({length:steps+1},(_,i)=>point(rx,ry,(start+span*i/steps)*Math.PI/180,seed)));
};
const state = (t: number,first: boolean,start: number,end: number,outStart=5.7,outEnd=6.66) => ({
  draw:first?1:phase(t,start,end),erase:phase(t,outStart,outEnd),
});
type TraceProps={g:Line;draw:number;erase:number;color:string;width:number;opacity?:number};
const Trace:React.FC<TraceProps>=({g,draw,erase,color,width,opacity=1})=>{
  const remaining=Math.max(0,draw-erase);
  return <path d={g.d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
    opacity={remaining<=0?0:opacity} strokeDasharray={`${g.length*remaining} ${g.length*2+8}`}
    strokeDashoffset={-erase*g.length}/>;
};
const loopBand=(g:Line,thickness:number)=>{
  const n=g.points.length-1;const outer:Point[]=[];const inner:Point[]=[];
  g.points.forEach(([x,y],i)=>{
    const prev=g.points[(i-1+n)%n],next=g.points[(i+1)%n];
    const dx=next[0]-prev[0],dy=next[1]-prev[1];const norm=Math.max(0.001,Math.hypot(dx,dy));
    const a=i/n*Math.PI*2;const w=thickness*(0.85+0.13*Math.sin(a*2+0.5)+0.04*Math.sin(a*9));
    outer.push([x+dy/norm*w/2,y-dx/norm*w/2]);inner.push([x-dy/norm*w/2,y+dx/norm*w/2]);
  });
  return line(outer).d+' Z '+line(inner.reverse()).d+' Z';
};

const marker=oval(326,295,-113,360,3);
const markerBody=loopBand(marker,31);
const markerEdge=oval(334,302,-106,313,3.02);
const markerFinish=oval(326,295,235,47,3);
const hatchInner=oval(397,244,-119,360,2);
const hatchOuter=oval(420,267,-119,360,2);
const hatches=Array.from({length:100},(_,i)=>{
  const a=(-119+i*3.6)*Math.PI/180;
  const p=point(400,247,a-0.011,2);const q=point(417,264,a+0.011,2);
  return line([p,q]);
});
const spiral=line(Array.from({length:1001},(_,i)=>{
  const u=i/1000;const a=(-117+u*360*2.62)*Math.PI/180;
  return point(364+u*34,235+u*24,a,8);
}));
const ribbon=oval(376,279,-126,360,5);
const ribbonBody=loopBand(ribbon,35);
const ribbonInner=oval(366,269,-126,360,5);
const sketch=oval(396,258,-125,376,11);
const sketchEcho=oval(403,266,-120,290,11.5);
const emphasisLines=[
  line([[302,-271],[320,-304],[323,-315]]),line([[337,-248],[375,-278]]),line([[358,-217],[401,-230]]),
  line([[-319,245],[-348,273]]),line([[-282,270],[-293,304]]),
];

type HighlightProps={t:number;first:boolean;color:string;edge:string;id:string};
const FeltMarker:React.FC<HighlightProps>=({t,first,color,edge,id})=>{
  const s=state(t,first,0.025,1.02);
  return <g transform="rotate(-7)">
    <defs><mask id={id} maskUnits="userSpaceOnUse" x={-450} y={-400} width={900} height={800}>
      <Trace g={marker} {...s} color="white" width={65}/>
    </mask></defs>
    <g mask={`url(#${id})`}>
      <path d={markerBody} fill={color} fillRule="evenodd"/>
      <path d={markerEdge.d} stroke={edge} strokeWidth={1.8} opacity={0.5} fill="none"/>
    </g>
    <Trace g={markerFinish} {...state(t,first,0.9,1.35,5.68,6.18)} color={edge} width={6.5} opacity={0.7}/>
  </g>;
};
const HatchedOval:React.FC<HighlightProps>=({t,first,color,edge})=><g transform="rotate(5)">
  <Trace g={hatchInner} {...state(t,first,0.02,0.97)} color={color} width={3.5}/>
  <Trace g={hatchOuter} {...state(t,first,0.13,1.1)} color={edge} width={2.4} opacity={0.9}/>
  {hatches.map((g,i)=><Trace key={i} g={g} {...state(t,first,0.03+i*0.009,0.18+i*0.009,5.7+i*0.004,6.22+i*0.004)}
    color={i%4===0?edge:color} width={i%5===0?3.3:2.5} opacity={0.95}/>)}
</g>;
const TripleOrbit:React.FC<HighlightProps>=({t,first,color,edge})=><g transform="rotate(-4)">
  <Trace g={spiral} {...state(t,first,0.02,1.4)} color={color} width={5.3}/>
  <Trace g={oval(364,235,-117,74,8)} {...state(t,first,0.02,0.24,5.7,5.95)} color={edge} width={2.1} opacity={0.6}/>
</g>;
const FoldedRibbon:React.FC<HighlightProps>=({t,first,color,edge,id})=>{
  const s=state(t,first,0.02,1.08);
  return <g transform="rotate(4)">
    <defs>
      <mask id={id} maskUnits="userSpaceOnUse" x={-500} y={-400} width={1000} height={800}>
        <Trace g={ribbon} {...s} color="white" width={65}/>
      </mask>
      <clipPath id={`${id}-band`}><path d={ribbonBody} clipRule="evenodd"/></clipPath>
    </defs>
    <g mask={`url(#${id})`}>
      <path d={ribbonBody} fill={color} fillRule="evenodd"/>
      <g clipPath={`url(#${id}-band)`}>
        {[[-338,-127,12],[322,-144,-22],[252,207,36],[-252,210,-35]].map(([x,y,a],i)=><g key={i}
          transform={`translate(${x} ${y}) rotate(${a})`}>
          <path d="M -33 -43 H 5 L 35 43 H -3 Z" fill={edge}/>
          <path d="M -25 -43 H -20 L 10 43 H 5 Z" fill={color} opacity={0.65}/>
        </g>)}
        <path d={ribbonInner.d} stroke={edge} strokeWidth={2.1} fill="none" opacity={0.48}/>
      </g>
    </g>
  </g>;
};
const SketchEmphasis:React.FC<HighlightProps>=({t,first,color,edge})=><g transform="rotate(-6)">
  <Trace g={sketch} {...state(t,first,0.02,0.96)} color={color} width={7.5}/>
  <Trace g={sketchEcho} {...state(t,first,0.29,1.17,5.74,6.37)} color={edge} width={1.8} opacity={0.8}/>
  {emphasisLines.map((g,i)=><Trace key={i} g={g} {...state(t,first,0.81+i*0.065,1.05+i*0.065,5.68,6.1)}
    color={i%2?edge:color} width={i<3?6.2:4.6}/>)}
</g>;

const highlights=[FeltMarker,HatchedOval,TripleOrbit,FoldedRibbon,SketchEmphasis] as const;
export const CircleHighlightExpressivePack:React.FC<CircleHighlightExpressivePackProps>=({
  background='black',primaryColor,secondaryColor,firstHighlightVisibleAtStart=false,x=960,y=540,scale=1,
})=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const slot=Math.round(7*fps);
  const index=Math.floor(frame/slot);const t=(frame-index*slot)/fps;
  const segment=index>=0&&index<5?CircleHighlightExpressivePackSegments[index]:null;
  const ActiveHighlight=segment?highlights[index]:null;const uid=React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
  const backgrounds={black:'#000000',green:'#00FF00',transparent:'transparent'};
  return <AbsoluteFill style={{backgroundColor:backgrounds[background],overflow:'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet" style={{display:'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.max(0.3,Math.min(1.3,scale))})`}>
        {segment&&ActiveHighlight&&t<6.72?<g data-highlight-index={index}>
          <ActiveHighlight t={t} first={index===0&&firstHighlightVisibleAtStart} color={primaryColor??segment.color}
            edge={secondaryColor??segment.edge} id={`expressive-circle-${uid}`}/>
        </g>:null}
      </g>
    </svg>
  </AbsoluteFill>;
};
export default CircleHighlightExpressivePack;
