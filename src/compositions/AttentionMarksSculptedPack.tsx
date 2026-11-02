import * as React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** ONE video, five sequential assets. 3840x2160, 30 fps, 1050 frames.
 * 0/7/14/21/28 seconds: clean entrance, static hold, exit, black gap.
 * x/y: invisible focus point, in the 1920x1080 design coordinate system.
 * No text, external assets, fonts, random runtime values, or registry edits.
 */
export type AttentionMarksSculptedPackProps = {
  background?: 'black' | 'green' | 'transparent';
  primaryColor?: string;
  secondaryColor?: string;
  firstMarkVisibleAtStart?: boolean;
  x?: number;
  y?: number;
  scale?: number;
};
export const AttentionMarksSculptedPackConfig = {
  id: 'AttentionMarksSculptedPack', width: 3840, height: 2160,
  fps: 30, durationInFrames: 1050,
} as const;
export const AttentionMarksSculptedPackSegments = [
  {name:'Split Lightning',startSeconds:0,endSeconds:7,color:'#F2C76F',edge:'#B17D3F'},
  {name:'Ribbon Curls',startSeconds:7,endSeconds:14,color:'#B5CFDF',edge:'#6F94AE'},
  {name:'Sculpted Exclamations',startSeconds:14,endSeconds:21,color:'#ECA990',edge:'#B87565'},
  {name:'Petal Crown',startSeconds:21,endSeconds:28,color:'#B7C9A3',edge:'#7D9C7C'},
  {name:'Cross Hatch Sparks',startSeconds:28,endSeconds:35,color:'#EEE3D1',edge:'#BCA68C'},
] as const;
const ease=(t:number,a:number,b:number)=>{
  const p=Math.max(0,Math.min(1,(t-a)/(b-a)));return p*p*(3-2*p);
};
const state=(t:number,first:boolean,i:number)=>({
  enter:first?1:ease(t,0.06+i*0.13,0.64+i*0.13),
  exit:ease(t,5.63+i*0.055,6.22+i*0.055),
});
type MarkProps={t:number;first:boolean;color:string;edge:string;id:string};
type Point=readonly[number,number];
type Curve={d:string;length:number};
const bezier=(a:Point,b:Point,c:Point,d:Point):Curve=>{
  let length=0,previous=a;
  for(let n=1;n<=100;n++){
    const t=n/100,u=1-t;
    const point:Point=[u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],
      u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]];
    length+=Math.hypot(point[0]-previous[0],point[1]-previous[1]);previous=point;
  }
  return{d:`M ${a.join(' ')} C ${b.join(' ')} ${c.join(' ')} ${d.join(' ')}`,length:length+1};
};
const Stroke:React.FC<{g:Curve;p:number;q:number;color:string;width:number}>=({g,p,q,color,width})=>
  <path d={g.d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
    opacity={p<=q?0:1} strokeDasharray={`${Math.max(0,p-q)*g.length} ${g.length*2+8}`}
    strokeDashoffset={-q*g.length}/>;

const SplitLightning:React.FC<MarkProps>=({t,first,color,edge})=><g>
  {[-137,-87,-37].map((angle,i)=>{
    const s=state(t,first,i),p=s.enter*(1-s.exit);
    return <g key={i} transform={`rotate(${angle}) translate(130 0) scale(${p} 1)`} opacity={p}>
      <path d="M 0 8 L 67 -11 L 51 -34 L 154 -16 L 81 16 L 92 37 Z" fill={color}/>
      <path d="M 0 8 L 81 16 L 92 37 L 42 19 Z M 51 -34 L 67 -11 L 94 -17 Z" fill={edge}/>
      <path d="M 26 7 L 69 0 M 90 -12 L 118 -14" fill="none" stroke="#FFF1CC" strokeWidth={2.4}/>
      <path d="M 162 -20 L 179 -25 L 173 -10 Z" fill={edge}/>
    </g>;
  })}
</g>;
const curls=[
  bezier([-135,-115],[-329,-120],[-281,-348],[-181,-261]),
  bezier([135,-115],[329,-120],[281,-348],[181,-261]),
];
const curlShapes=[
  'M -133 -103 C -363 -112 -291 -377 -184 -279 C -161 -258 -174 -226 -202 -226 C -220 -226 -230 -243 -223 -256 C -239 -262 -253 -244 -247 -224 C -226 -173 -173 -151 -133 -126 Z',
  'M 133 -103 C 363 -112 291 -377 184 -279 C 161 -258 174 -226 202 -226 C 220 -226 230 -243 223 -256 C 239 -262 253 -244 247 -224 C 226 -173 173 -151 133 -126 Z',
];
const RibbonCurls:React.FC<MarkProps>=({t,first,color,edge,id})=><g>
  {curls.map((g,i)=>{
    const s=state(t,first,i);const tail=state(t,first,i+2);
    return <g key={i}>
      <defs><mask id={`${id}-curl-${i}`} maskUnits="userSpaceOnUse" x={-380} y={-370} width={760} height={340}>
        <Stroke g={g} p={s.enter} q={s.exit} color="white" width={95}/>
      </mask></defs>
      <g mask={`url(#${id}-curl-${i})`}>
        <path d={curlShapes[i]} fill={color}/>
        <path d={i?'M 181 -278 C 232 -311 285 -263 263 -208 C 281 -266 229 -323 181 -278 Z':
          'M -181 -278 C -232 -311 -285 -263 -263 -208 C -281 -266 -229 -323 -181 -278 Z'} fill={edge}/>
      </g>
      <g transform={`translate(${i?128:-128} -168) rotate(${i?25:-25})`} opacity={tail.enter*(1-tail.exit)}>
        <path d="M -5 -27 Q 0 -44 5 -27 L 3 -4 L -3 -4 Z" fill={edge}/>
      </g>
    </g>;
  })}
</g>;
const SculptedExclamations:React.FC<MarkProps>=({t,first,color,edge})=><g>
  {[-134,-90,-46].map((angle,i)=>{
    const s=state(t,first,i);const dot=state(t,first,i+1);const p=s.enter*(1-s.exit);
    return <g key={i} transform={`rotate(${angle}) translate(143 0)`}>
      <g transform={`translate(40 0) scale(${p} 1)`} opacity={p}>
        <path d="M 0 -8 L 135 -22 Q 148 -22 149 -8 L 149 9 Q 148 22 135 22 L 0 8 Z" fill={color}/>
        <path d="M 0 8 L 135 22 Q 148 22 149 9 L 137 7 Z" fill={edge}/>
        <path d="M 30 -7 L 126 -16" stroke="#FAD8C4" strokeWidth={2.5} strokeLinecap="round"/>
      </g>
      <g transform={`scale(${dot.enter*(1-dot.exit)})`}>
        <rect x={-10} y={-10} width={20} height={20} rx={5} transform="rotate(12)" fill={color}/>
      </g>
    </g>;
  })}
</g>;
const PetalCrown:React.FC<MarkProps>=({t,first,color,edge})=><g>
  {[-150,-120,-90,-60,-30].map((angle,i)=>{
    const s=state(t,first,i),p=s.enter*(1-s.exit);const length=[85,112,134,112,85][i];
    return <g key={i} transform={`rotate(${angle}) translate(143 0) scale(${p} ${0.6+0.4*p})`} opacity={p}>
      <path d={`M 0 0 C ${length*0.36} -26 ${length*0.78} -35 ${length} 0 C ${length*0.76} 32 ${length*0.28} 22 0 0 Z`} fill={color}/>
      <path d={`M 0 0 L ${length} 0 C ${length*0.76} 32 ${length*0.28} 22 0 0 Z`} fill={edge}/>
      <path d={`M 21 0 L ${length-18} 0`} stroke="#DDE6CA" strokeWidth={2}/>
    </g>;
  })}
</g>;
const crossLines=[
  bezier([-225,-175],[-194,-200],[-151,-212],[-122,-215]),
  bezier([-195,-241],[-177,-219],[-163,-189],[-158,-164]),
  bezier([122,-215],[151,-212],[194,-200],[225,-175]),
  bezier([158,-164],[163,-189],[177,-219],[195,-241]),
  bezier([-21,-284],[-9,-285],[8,-283],[21,-282]),
  bezier([2,-306],[0,-292],[0,-273],[-2,-259]),
];
const CrossHatchSparks:React.FC<MarkProps>=({t,first,color,edge})=><g>
  {crossLines.map((g,i)=>{const s=state(t,first,i*0.55);return <Stroke key={i} g={g}
    p={s.enter} q={s.exit} color={i%2?edge:color} width={i>3?7:11}/>;})}
  {[-1,1].map((side,i)=>{
    const s=state(t,first,3+i*0.4),p=s.enter*(1-s.exit);
    return <g key={side} transform={`translate(${side*251} -244) rotate(45) scale(${p})`}>
      <path d="M -7 0 L 0 -10 L 7 0 L 0 10 Z" fill={color}/>
    </g>;
  })}
</g>;
const marks=[SplitLightning,RibbonCurls,SculptedExclamations,PetalCrown,CrossHatchSparks] as const;
export const AttentionMarksSculptedPack:React.FC<AttentionMarksSculptedPackProps>=({
  background='black',primaryColor,secondaryColor,firstMarkVisibleAtStart=false,x=960,y=600,scale=1,
})=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const slot=Math.round(7*fps);
  const index=Math.floor(frame/slot),t=(frame-index*slot)/fps;
  const segment=index>=0&&index<5?AttentionMarksSculptedPackSegments[index]:null;
  const Mark=segment?marks[index]:null;
  const id=React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
  return <AbsoluteFill style={{backgroundColor:{black:'#000000',green:'#00FF00',transparent:'transparent'}[background],overflow:'hidden'}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%" style={{display:'block'}}>
      <g transform={`translate(${x} ${y}) scale(${Math.max(0.3,Math.min(1.4,scale))})`}>
        {Mark&&segment&&t<6.7?<g data-mark-index={index}>
          <Mark t={t} first={index===0&&firstMarkVisibleAtStart} color={primaryColor??segment.color}
            edge={secondaryColor??segment.edge} id={`sculpted-${id}`}/>
        </g>:null}
      </g>
    </svg>
  </AbsoluteFill>;
};
export default AttentionMarksSculptedPack;
