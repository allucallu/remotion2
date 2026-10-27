import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
const JADE='#8CDE9A', JADE2='#5FAE79', GOLD='#F2D58B', CREAM='#FFF1C9';
const p=(r:number,a:number)=>({x:r*Math.cos(a),y:r*Math.sin(a)});
const rad=(degrees:number)=>degrees*Math.PI/180;
const mix=(a:string,b:string,t:number)=>{
 const x=a.match(/[\da-f]{2}/gi)!.map(v=>parseInt(v,16));
 const y=b.match(/[\da-f]{2}/gi)!.map(v=>parseInt(v,16));
 return `#${x.map((v,i)=>Math.round(v+(y[i]-v)*Math.max(0,Math.min(1,t))).toString(16).padStart(2,'0')).join('')}`;
};
const BODY=(()=>{
 const outer:string[]=[],inner:string[]=[];
 for(let i=0;i<=120;i++){
  const u=i/120, a=rad(-255+161*u);
  // A true tapered ribbon, not a rounded thick circle stroke.
  const half=68*Math.min(1,u/0.26)*(0.96+0.04*Math.sin(Math.PI*u));
  const o=p(730+half,a),n=p(730-half,a);
  outer.push(`${o.x.toFixed(3)} ${o.y.toFixed(3)}`);
  inner.push(`${n.x.toFixed(3)} ${n.y.toFixed(3)}`);
 }
 return `M ${outer.join(' L ')} L ${inner.reverse().join(' L ')} Z`;
})();
const tongueLength=(frame:number,offset:number)=>{
 const local=(frame-offset+120)%120;
 return local>=12 && local<24 ? 40*Math.sin(Math.PI*(local-12)/12)**2 : 0;
};
const Serpent:React.FC<{frame:number;index:number}>=({frame,index})=>{
 const angle=360*frame/240+index*180;
 const length=tongueLength(frame,index*60);
 const phase=((frame+index*40)%80)/80;
 const wave=-3+23*phase;
 return <g transform={`rotate(${angle})`} strokeLinecap="round" strokeLinejoin="round">
  <path d={BODY} fill="#000000" stroke={JADE} strokeWidth="9" />
  {Array.from({length:17},(_,i)=>{
   const a=rad(-104-i*8.3),q=p(730,a);
   const width=46*Math.min(1,(17-i)/4);
   const bright=Math.max(0,1-Math.abs(i-wave)/2.5);
   return <g key={i} transform={`translate(${q.x} ${q.y}) rotate(${a*180/Math.PI+90})`} fill="none">
    <path d={`M -21 ${-width} L 15 0 L -21 ${width}`} stroke={mix(JADE,CREAM,bright)} strokeWidth="7" />
    <path d="M -11 -6 L -3 0 L -11 6 L -19 0 Z" fill={mix(GOLD,CREAM,bright)} stroke="none" />
   </g>;
  })}
  {/* Tangential head overlaps the ribbon's neck, concealing its closing seam. */}
  <g transform="translate(0 -730)" fill="none" strokeWidth="8">
   <path d="M -112 -42 L -69 -65 L -14 -58 L 30 -38 L 61 -19 L 68 1 L 54 23 L 10 39 L -47 55 L -103 38 L -84 5 Z" fill="#000000" stroke={JADE} />
   <path d="M -95 -30 L -52 -43 L -20 -37 M -73 31 L -39 36 L 10 20 L 49 11" stroke={JADE2} strokeWidth="6" />
   <path d="M -33 -23 L -12 -30 L 9 -17 L -12 -9 Z" fill={GOLD} stroke="none" />
   <path d="M -12 -24 V -15" stroke="#000000" strokeWidth="6" />
   <path d="M 40 -9 L 47 -5" stroke={JADE} strokeWidth="5" />
   <path d="M -85 -43 L -74 -34 L -86 -25 L -98 -34 Z" fill={JADE} stroke="none" />
   {length>0.1 && <path d={`M 65 2 H ${65+length*.7} M ${65+length*.7} 2 L ${65+length} ${2-length*.21} M ${65+length*.7} 2 L ${65+length} ${2+length*.21}`} stroke={GOLD} strokeWidth="5" />}
  </g>
 </g>;
};

/** 3840×2160 / 30fps / 240 frames. Full design visible from frame zero. */
export const SerpentCovenantLoop:React.FC=()=>{
 const frame=((useCurrentFrame()%240)+240)%240;
 return <AbsoluteFill style={{backgroundColor:'#000000'}}>
  <svg width="100%" height="100%" viewBox="0 0 3840 2160" aria-label="Twin jade serpents surrounding a golden seal">
   <rect width={3840} height={2160} fill="#000000" />
   <g transform="translate(1920 1080)">
    <Serpent frame={frame} index={0}/><Serpent frame={frame} index={1}/>
    {[470,440,410].map(r=><circle key={r} r={r} fill="none" stroke={GOLD} strokeWidth={r===440?5:7}/>)}
    {[0,90,180,270].map(a=><g key={a} transform={`rotate(${a})`}>
     <path d="M 0 -505 L 17 -440 L 0 -365 L -17 -440 Z" fill={GOLD} stroke="#000000" strokeWidth="5" />
    </g>)}
    <g transform={`rotate(${-90*frame/240})`} fill="none" stroke={GOLD} strokeWidth="8" strokeLinejoin="miter">
     <path d="M 0 -140 L 140 0 L 0 140 L -140 0 Z" />
     <path d="M 0 -105 L 105 0 L 0 105 L -105 0 Z" strokeWidth="6" />
    </g>
   </g>
  </svg>
 </AbsoluteFill>;
};
