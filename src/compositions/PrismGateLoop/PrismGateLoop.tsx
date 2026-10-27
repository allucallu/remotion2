import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
const LAV='#B47AE0', PURPLE='#D4B0EF', CREAM='#FFF0CC', TAU=Math.PI*2;
const mix=(a:string,b:string,t:number)=>{
 const x=a.match(/[\da-f]{2}/gi)!.map(v=>parseInt(v,16));
 const y=b.match(/[\da-f]{2}/gi)!.map(v=>parseInt(v,16));
 return `#${x.map((v,i)=>Math.round(v+(y[i]-v)*Math.max(0,Math.min(1,t))).toString(16).padStart(2,'0')).join('')}`;
};
const squarePath=(half:number)=>`M ${-half} ${-half} H ${half} V ${half} H ${-half} Z`;
const octagon=(radius:number)=>Array.from({length:8},(_,i)=>{
 const a=Math.PI/8+i*TAU/8;return `${radius*Math.cos(a)},${radius*Math.sin(a)}`;
}).join(' ');
const diamond=(size:number)=>`M 0 ${-size} L ${size} 0 L 0 ${size} L ${-size} 0 Z`;
const alignment=(a:number,b:number)=>{
 const distance=Math.abs((((a-b+45)%90)+90)%90-45);
 const p=Math.max(0,1-distance/8);
 return p*p*(3-2*p);
};
const Square:React.FC<{
 half:number;color:string;width:number;rotation:number;period:number;frame:number;bright:number;
}>=({half,color,width,rotation,period,frame,bright})=>{
 const path=squarePath(half);
 return <g transform={`rotate(${rotation})`} fill="none" strokeLinejoin="miter">
  <path d={path} stroke={color} strokeWidth={width}/>
  {/* Four identical packets preserve square symmetry at the loop boundary. */}
  <path d={path} stroke={mix(color,'#FFF8ED',0.8)} strokeWidth={width}
   strokeDasharray={`${half*8*0.08} ${half*8*0.17}`} strokeDashoffset={-(frame%period)/period*half*8}/>
  {[[-half,-half],[half,-half],[half,half],[-half,half]].map(([x,y],i)=><g key={i}
   transform={`translate(${x} ${y}) rotate(${-rotation})`}>
   <path d={diamond(24)} fill="#000000" stroke={mix(color,'#FFF8ED',bright)} strokeWidth="7"/>
   {bright>0 && <path d={diamond(10)} fill={CREAM} opacity={bright}/>}
  </g>)}
 </g>;
};

/** 3840×2160, 30fps, 240 frames. Three independent square gates. */
export const PrismGateLoop:React.FC=()=>{
 const frame=((useCurrentFrame()%240)+240)%240;
 const t=frame/240;
 // Match the diamond outer square and contrasting tilted inner squares.
 const angles=[45+90*t,12-180*t,-12+270*t];
 const pairs=[alignment(angles[0],angles[1]),alignment(angles[1],angles[2]),alignment(angles[2],angles[0])];
 const core=.5-.5*Math.cos(TAU*frame/120);
 return <AbsoluteFill style={{backgroundColor:'#000000'}}>
  <svg width="100%" height="100%" viewBox="0 0 3840 2160" aria-label="Lavender prism gate loop">
   <rect width={3840} height={2160} fill="#000000"/>
   <g transform="translate(1920 1080)">
    <circle r="820" fill="none" stroke={LAV} strokeWidth="11"/>
    <circle r="780" fill="none" stroke={CREAM} strokeWidth="7"/>
    {[0,90,180,270].map(a=><g key={a} transform={`rotate(${a})`}>
     <path d="M 0 -705 V -755" stroke={CREAM} strokeWidth="7"/>
     <path transform="translate(0 -820)" d={diamond(33)} fill="#000000" stroke={LAV} strokeWidth="8"/>
     <path transform="translate(0 -820)" d={diamond(13)} fill={CREAM}/>
     <path d="M -6 -245 V -285 M 6 -245 V -285" stroke={PURPLE} strokeWidth="5"/>
    </g>)}
    <Square half={527} color={LAV} width={10} rotation={angles[0]} period={120} frame={frame} bright={Math.max(pairs[0],pairs[2])}/>
    <Square half={410} color={PURPLE} width={8} rotation={angles[1]} period={80} frame={frame} bright={Math.max(pairs[0],pairs[1])}/>
    <Square half={315} color={CREAM} width={7} rotation={angles[2]} period={60} frame={frame} bright={Math.max(pairs[1],pairs[2])}/>
    <g fill="none" stroke={mix(LAV,PURPLE,core)} strokeLinejoin="miter">
     <polygon points={octagon(215)} strokeWidth="9"/>
     <polygon points={octagon(194)} strokeWidth="6"/>
    </g>
   </g>
  </svg>
 </AbsoluteFill>;
};
