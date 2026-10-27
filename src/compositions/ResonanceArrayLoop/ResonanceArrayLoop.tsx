import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
const WHITE='#FFF1DF',CORAL='#FF9C8E',TAU=Math.PI*2;
const p=(r:number,a:number)=>({x:r*Math.cos(a),y:r*Math.sin(a)});
const arc=(r:number,a:number,b:number)=>{
 const s=p(r,a),e=p(r,b);
 return `M ${s.x.toFixed(4)} ${s.y.toFixed(4)} A ${r} ${r} 0 ${b-a>Math.PI?1:0} 1 ${e.x.toFixed(4)} ${e.y.toFixed(4)}`;
};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
const mix=(a:string,b:string,t:number)=>{
 const x=a.match(/[\da-f]{2}/gi)!.map(v=>parseInt(v,16));
 const y=b.match(/[\da-f]{2}/gi)!.map(v=>parseInt(v,16));
 return `#${x.map((v,i)=>Math.round(v+(y[i]-v)*clamp(t)).toString(16).padStart(2,'0')).join('')}`;
};
const response=(age:number)=>age>=0&&age<14?smooth(age/4)*(1-smooth((age-5)/9)):0;
const Medal:React.FC<{a:number;frame:number;i:number}>=({a,frame,i})=>{
 const q=p(770,a),local=(frame-i*8+80)%80;
 return <g transform={`translate(${q.x} ${q.y}) rotate(${a*180/Math.PI+90})`} fill="none">
  <circle r="80" stroke={WHITE} strokeWidth="9"/>
  <path d="M -40 0 Q 0 -43 40 0" stroke={mix(CORAL,'#FFF8ED',response(local-36))} strokeWidth="11"/>
  <path d="M -27 22 Q 0 -8 27 22" stroke={mix(CORAL,'#FFF8ED',response(local-40))} strokeWidth="9"/>
  <circle cy="-105" r="7" fill={WHITE}/>
 </g>;
};

/** 4K / 30fps / 240 frames. Three outward resonance cycles. */
export const ResonanceArrayLoop:React.FC=()=>{
 const frame=((useCurrentFrame()%240)+240)%240;
 const radii=[330,440,550,660,770];
 const local=frame%80;
 const axes=[-Math.PI/2,Math.PI/6,Math.PI*5/6];
 return <AbsoluteFill style={{backgroundColor:'#000000'}}>
  <svg width="100%" height="100%" viewBox="0 0 3840 2160" aria-label="Outward resonance array loop">
   <rect width={3840} height={2160} fill="#000000"/>
   <g transform="translate(1920 1080)">
    {radii.map((radius,j)=>{
     const age=local-j*9;
     const intensity=age>=0&&age<20?smooth(age/4)*(1-smooth((age-14)/6)):0;
     const travel=smooth((age-4)/10);
     return <g key={radius} fill="none" strokeLinecap="butt">
      {Array.from({length:6},(_,i)=>{
       const sector=-Math.PI/2+i*TAU/6;
       // Gaps at radial connectors and emitter positions remain open.
       const gap=(j===4?9:j%2===0?5:7)*Math.PI/180;
       const extra=(i+j)%3===0?5*Math.PI/180:0;
       const a=sector+gap,b=sector+TAU/6-gap-extra;
       const color=(i+j)%3===0 || j===0?CORAL:WHITE;
       const packet=(b-a)*.30;
       const head=a+(b-a-packet)*travel;
       return <g key={i}>
        <path d={arc(radius,a,b)} stroke={color} strokeWidth="12"/>
        {intensity>0 && <path d={arc(radius,head,head+packet)}
         stroke={color===CORAL?'#FFD1C6':'#FFFFFF'} strokeWidth="14" opacity={intensity}/>}
       </g>;
      })}
     </g>;
    })}
    {axes.map((a,i)=>{
     const start=p(290,a),end=p(675,a);
     const age=(frame-i*8+80)%80;
     const progress=age/36;
     const dot=p(290+385*clamp(progress),a);
     const opacity=age<36?smooth(age/4)*(1-smooth((age-31)/5)):0;
     return <g key={i}>
      <path d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} stroke={WHITE} strokeWidth="5" strokeDasharray="10 18"/>
      {opacity>0 && <circle cx={dot.x} cy={dot.y} r="11" fill={CORAL} opacity={opacity}/>}
      <Medal a={a} frame={frame} i={i}/>
     </g>;
    })}
    {/* Three identical curved blades preserve 120-degree rotational symmetry. */}
    <g transform={`rotate(${120*frame/240})`}>
     {[0,120,240].map(angle=><g key={angle} transform={`rotate(${angle})`}>
      <path d="M 20 -245 C -142 -269 -248 -128 -180 -24 C -209 -134 -105 -235 20 -245 Z" fill={WHITE}/>
      <path d="M -162 -49 C -181 -108 -145 -166 -94 -184 C -132 -152 -149 -100 -142 -62 Z" fill={CORAL}/>
     </g>)}
    </g>
    <circle r="55" fill="none" stroke={WHITE} strokeWidth="10"/>
    {/* Stationary nodes mark six gap axes without blocking their connectors. */}
    {Array.from({length:6},(_,i)=>{
     const a=-Math.PI/2+i*TAU/6;
     return [330,550].map(r=>{const q=p(r,a);return <circle key={`${i}-${r}`} cx={q.x} cy={q.y} r="11" fill={CORAL}/>;});
    })}
   </g>
  </svg>
 </AbsoluteFill>;
};
