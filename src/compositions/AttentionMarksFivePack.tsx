import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** Five attention-mark assets, sequentially packaged in ONE 35-second video.
 * Registry: 3840 x 2160 / 30 FPS / 1050 frames. Cut at 7,14,21,28 seconds.
 * No registry, external assets, text, logo, glow, or audio included.
 * Each draws/assembles, holds completely still, then erases to black.
 * x/y is the INVISIBLE focus point: place it at the object to emphasize.
 * Marks sit above or beside that point, leaving room for the object itself.
 * All drawing entrances are enabled; first frame empty by default.
 * firstMarkVisibleAtStart=true optionally supplies a fully formed first thumbnail.
 * Deterministic geometry and frame-based animation; physical SVG dash lengths.
 */
export type AttentionMarksFivePackProps = {
  background?: 'black' | 'green' | 'transparent';
  primaryColor?: string;
  secondaryColor?: string;
  firstMarkVisibleAtStart?: boolean;
  x?: number;
  y?: number;
  scale?: number;
};
export const AttentionMarksFivePackConfig = {
  id: 'AttentionMarksFivePack', width: 3840, height: 2160, fps: 30, durationInFrames: 1050,
} as const;
export const AttentionMarksFivePackSegments = [
  {name: 'Pencil Triplet', startSeconds: 0, endSeconds: 7, color: '#F0E7D6', edge: '#B6B0A3'},
  {name: 'Brush Braces', startSeconds: 7, endSeconds: 14, color: '#DEB771', edge: '#A98D5A'},
  {name: 'Fan Strokes', startSeconds: 14, endSeconds: 21, color: '#DFA38E', edge: '#E9CDBC'},
  {name: 'Folded Tabs', startSeconds: 21, endSeconds: 28, color: '#A5BFCE', edge: '#698B9E'},
  {name: 'Ink Arches', startSeconds: 28, endSeconds: 35, color: '#B1C6AA', edge: '#7E9E85'},
] as const;
const phase = (t: number,a: number,b: number) => {
  const p=Math.max(0,Math.min(1,(t-a)/(b-a)));return p*p*(3-2*p);
};
type Point=readonly [number,number];
type Line={d:string;length:number};
const curve=(a:Point,b:Point,c:Point,d:Point):Line=>{
  let length=0;let previous=a;
  for(let i=1;i<=80;i++){
    const t=i/80,u=1-t;
    const next:Point=[u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],
      u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]];
    length+=Math.hypot(next[0]-previous[0],next[1]-previous[1]);previous=next;
  }
  return {d:`M ${a[0]} ${a[1]} C ${b[0]} ${b[1]} ${c[0]} ${c[1]} ${d[0]} ${d[1]}`,length:length+2};
};
type TraceProps={g:Line;draw:number;erase:number;color:string;width:number;opacity?:number};
const Trace:React.FC<TraceProps>=({g,draw,erase,color,width,opacity=1})=>{
  const remaining=Math.max(0,draw-erase);
  return <path d={g.d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
    opacity={remaining<=0?0:opacity} strokeDasharray={`${remaining*g.length} ${g.length*2+8}`}
    strokeDashoffset={-erase*g.length}/>;
};
const motion=(t:number,first:boolean,i:number,delay=0.09)=>({
  draw:first?1:phase(t,0.03+i*delay,0.57+i*delay),
  erase:phase(t,5.72+i*0.045,6.4+i*0.055),
});
type MarkProps={t:number;first:boolean;color:string;edge:string;id:string};
const pencil=[
  curve([-80,-114],[-109,-155],[-164,-218],[-192,-241]),
  curve([-4,-141],[-13,-197],[-11,-258],[-1,-292]),
  curve([79,-117],[116,-166],[156,-211],[183,-220]),
];
const pencilEcho=[
  curve([-105,-122],[-132,-161],[-154,-184],[-170,-195]),
  curve([18,-168],[16,-211],[20,-241],[23,-258]),
  curve([107,-113],[137,-150],[155,-165],[173,-177]),
];
const PencilTriplet:React.FC<MarkProps>=({t,first,color,edge})=><g>
  {pencil.map((g,i)=><g key={i} transform={`translate(0 ${9*(1-phase(t,0.03,0.84))})`}>
    <Trace g={g} {...motion(t,first,i)} color={color} width={i===1?13:10}/>
    <Trace g={pencilEcho[i]} {...motion(t,first,i+1)} color={edge} width={2.2} opacity={0.85}/>
  </g>)}
</g>;
const leftBrace=curve([-188,-135],[-269,-88],[-266,80],[-190,134]);
const rightBrace=curve([188,135],[269,88],[266,-80],[190,-134]);
const leftShape='M -186 -143 C -279 -92 -279 91 -188 143 C -249 75 -245 -75 -186 -143 Z';
const rightShape='M 186 143 C 279 92 279 -91 188 -143 C 249 -75 245 75 186 143 Z';
const braceEcho=[curve([-211,-146],[-297,-73],[-280,82],[-211,143]),
  curve([211,146],[297,73],[280,-82],[211,-143])];
const BrushBraces:React.FC<MarkProps>=({t,first,color,edge,id})=><g>
  {[leftBrace,rightBrace].map((g,i)=><g key={i}>
    <defs><mask id={`${id}-${i}`} maskUnits="userSpaceOnUse" x={-350} y={-210} width={700} height={420}>
      <Trace g={g} {...motion(t,first,i,0.22)} color="white" width={64}/>
    </mask></defs>
    <path d={i?rightShape:leftShape} fill={color} mask={`url(#${id}-${i})`}/>
    <Trace g={braceEcho[i]} {...motion(t,first,i+2,0.14)} color={edge} width={2.5} opacity={0.8}/>
  </g>)}
</g>;
const FanStrokes:React.FC<MarkProps>=({t,first,color,edge})=><g>
  {[-152,-121,-90,-59,-28].map((angle,i)=>{
    const s=motion(t,first,i,0.075);const p=s.draw*(1-s.erase);
    const length=[92,123,157,123,92][i];const width=[11,15,19,15,11][i];
    const base=133+12*(1-phase(t,0.04,0.94));
    return <g key={i} transform={`rotate(${angle})`} opacity={p}>
      <path d={`M ${base} ${-width*0.3} Q ${base+length*p*0.5} ${-width*0.72} ${base+length*p} 0 Q ${base+length*p*0.53} ${width*0.51} ${base} ${width*0.3} Z`}
        fill={i%2?edge:color}/>
      {i%2===0?<path d={`M ${base+length*p*0.28} -17 l ${24*p} -3`} stroke={edge} strokeWidth={2.2}
        strokeLinecap="round" fill="none" opacity={p}/>:null}
    </g>;
  })}
</g>;
const FoldedTabs:React.FC<MarkProps>=({t,first,color,edge})=><g>
  {[-142,-90,-38].map((angle,i)=>{
    const s=motion(t,first,i,0.14);const p=s.draw*(1-s.erase);
    const settle=phase(t,0.05,0.95);const base=140+15*(1-settle);
    return <g key={i} transform={`rotate(${angle}) translate(${base} 0) rotate(${-10*(1-settle)}) scale(${p} 1)`} opacity={p}>
      <path d="M 0 -11 L 89 -21 L 124 -7 L 95 17 L 0 11 Z" fill={color}/>
      <path d="M 89 -21 L 124 -7 L 95 17 L 83 2 Z" fill={edge}/>
      <path d="M 10 -6 L 78 -13" stroke={edge} strokeWidth={2} opacity={0.6} fill="none"/>
      <path d="M 132 -6 L 145 -2 L 134 7 Z" fill={edge}/>
    </g>;
  })}
</g>;
const arches=[curve([-100,-111],[-69,-175],[66,-178],[104,-109]),
  curve([-164,-103],[-116,-239],[113,-239],[168,-101]),
  curve([-226,-91],[-158,-304],[155,-308],[231,-90])];
const archEcho=curve([-235,-117],[-167,-326],[101,-335],[209,-168]);
const InkArches:React.FC<MarkProps>=({t,first,color,edge})=><g transform="rotate(-6)">
  {arches.map((g,i)=><Trace key={i} g={g} {...motion(t,first,i,0.16)} color={i===1?edge:color}
    width={[10,6,11][i]}/>)}
  <Trace g={archEcho} {...motion(t,first,3,0.14)} color={edge} width={2} opacity={0.75}/>
</g>;

const marks=[PencilTriplet,BrushBraces,FanStrokes,FoldedTabs,InkArches] as const;
export const AttentionMarksFivePack:React.FC<AttentionMarksFivePackProps>=({
  background='black',primaryColor,secondaryColor,firstMarkVisibleAtStart=false,x=960,y=600,scale=1,
})=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const slot=Math.round(7*fps);
  const index=Math.floor(frame/slot);const t=(frame-index*slot)/fps;
  const segment=index>=0&&index<5?AttentionMarksFivePackSegments[index]:null;
  const ActiveMark=segment?marks[index]:null;const uid=React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
  const backgrounds={black:'#000000',green:'#00FF00',transparent:'transparent'};
  return <AbsoluteFill style={{backgroundColor:backgrounds[background],overflow:'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet" style={{display:'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.max(0.3,Math.min(1.4,scale))})`}>
        {segment&&ActiveMark&&t<6.72?<g data-mark-index={index}>
          <ActiveMark t={t} first={index===0&&firstMarkVisibleAtStart} color={primaryColor??segment.color}
            edge={secondaryColor??segment.edge} id={`attention-mark-${uid}`}/>
        </g>:null}
      </g>
    </svg>
  </AbsoluteFill>;
};
export default AttentionMarksFivePack;
