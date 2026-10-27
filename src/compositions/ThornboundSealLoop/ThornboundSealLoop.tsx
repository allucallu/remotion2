import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
const SAGE='#A9C98D',SAGE2='#789C69',CREAM='#FFF0CC',TAU=Math.PI*2;
const wrap=(n:number,size=1)=>((n%size)+size)%size;
const vinePoint=(u:number,vine:number)=>{
 const angle=-Math.PI/2+TAU*u;
 const radius=710+34*Math.sin(4*TAU*u+vine*Math.PI);
 return {x:radius*Math.cos(angle),y:radius*Math.sin(angle),angle};
};
const vinePath=(vine:number,start=0,length=1)=>{
 const count=Math.max(8,Math.ceil(length*600));
 const points=Array.from({length:count+1},(_,i)=>{
  const q=vinePoint(start+length*i/count,vine);
  return `${i?'L':'M'} ${q.x.toFixed(3)} ${q.y.toFixed(3)}`;
 });
 return points.join(' ')+(length===1?' Z':'');
};
const VINES=[vinePath(0),vinePath(1)];
const Leaf:React.FC<{i:number;frame:number}>=({i,frame})=>{
 const vine=i%2;
 const u=wrap(i/18+Math.sin(i*1.73)*.009);
 const anchor=vinePoint(u,vine);
 const direction=vine===0?1:-1;
 // Each leaf responds immediately after the energy packet reaches its stem.
 const age=wrap(frame-direction*u*120,120);
 const hit=age<4?.5-.5*Math.cos(Math.PI*age/4):age<16?.5+.5*Math.cos(Math.PI*(age-4)/12):0;
 const inward=i%3===1;
 const rotation=anchor.angle*180/Math.PI+(inward?180:0)+(i%2?1:-1)*(12+8*hit);
 const length=inward?84:108;
 const width=(inward?24:29)*(1+.08*hit);
 return <g transform={`translate(${anchor.x} ${anchor.y}) rotate(${rotation})`} strokeLinejoin="round">
  <path d={`M 0 0 C ${length*.32} ${-width} ${length*.8} ${-width} ${length} 0 C ${length*.75} ${width} ${length*.3} ${width} 0 0 Z`}
   fill={SAGE2} stroke={SAGE} strokeWidth="6"/>
  <path d={`M 0 0 L ${length*.87} 0 M ${length*.36} 0 L ${length*.53} ${-width*.48} M ${length*.57} 0 L ${length*.73} ${width*.4}`}
   fill="none" stroke={CREAM} strokeWidth="4" strokeLinecap="round"/>
 </g>;
};

/** 4K / 30fps / 240 frames. Braided vines with anchored foliage and petals. */
export const ThornboundSealLoop:React.FC=()=>{
 const frame=wrap(useCurrentFrame(),240);
 return <AbsoluteFill style={{backgroundColor:'#000000'}}>
  <svg width="100%" height="100%" viewBox="0 0 3840 2160" aria-label="Living thornbound seal">
   <rect width={3840} height={2160} fill="#000000"/>
   <defs>
    {[0,1].map(vine=><mask key={vine} id={`thorn-weave-${vine}`} maskUnits="userSpaceOnUse" x="-950" y="-950" width="1900" height="1900">
     <rect x="-950" y="-950" width="1900" height="1900" fill="white"/>
     {Array.from({length:8},(_,i)=>i).filter(i=>i%2!==vine).map(i=><path key={i}
      d={vinePath(1-vine,i/8-.016,.032)} fill="none" stroke="black" strokeWidth="43" strokeLinecap="round"/>)}
    </mask>)}
   </defs>
   <g transform="translate(1920 1080)">
    {/* Thorns join actual vine coordinates and remain behind the ribbon. */}
    {Array.from({length:18},(_,i)=>{
     const vine=i%2,u=wrap((i+.45)/18),q=vinePoint(u,vine);
     return <path key={`thorn-${i}`} transform={`translate(${q.x} ${q.y}) rotate(${q.angle*180/Math.PI})`}
      d="M -4 -12 L 44 -23 L 6 13 Z" fill={SAGE}/>;
    })}
    {[0,1].map(vine=>{
     const head=(vine===0?1:-1)*frame/120;
     return <g key={vine} mask={`url(#thorn-weave-${vine})`} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={VINES[vine]} stroke={vine===0?SAGE:SAGE2} strokeWidth="30"/>
      <path d={vinePath(vine,head-.12,.12)} stroke={vine===0?CREAM:'#C4DDA9'} strokeWidth="10"/>
     </g>;
    })}
    {Array.from({length:18},(_,i)=><Leaf key={i} i={i} frame={frame}/>)}
    <circle r="500" fill="none" stroke={CREAM} strokeWidth="8"/>
    {Array.from({length:6},(_,i)=>{
     const phase=TAU*(frame-i*6)/120;
     const tip=455+18*Math.sin(phase);
     const width=108*(1+.1*Math.sin(phase));
     return <g key={i} transform={`rotate(${i*60})`} fill="none" strokeLinejoin="round">
      <path d={`M -16 -104 C ${-width} -125 ${-width} ${-tip+105} 0 ${-tip} C ${width} ${-tip+105} ${width} -125 16 -104 Z`}
       stroke={CREAM} strokeWidth="9"/>
      <path d={`M 0 -111 Q -5 ${-tip*.6} 0 ${-tip+28}`} stroke={SAGE} strokeWidth="7" strokeLinecap="round"/>
     </g>;
    })}
    <circle r="105" fill="#000000" stroke={CREAM} strokeWidth="9"/>
   </g>
  </svg>
 </AbsoluteFill>;
};
