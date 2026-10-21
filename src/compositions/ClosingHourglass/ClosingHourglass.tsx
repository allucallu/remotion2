/*
Letter outlines adapted from Anton. Copyright 2020 The Anton Project Authors (https://github.com/googlefonts/AntonFont.git)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.

*/
import React from "react";
import {AbsoluteFill,Easing,interpolate,useCurrentFrame} from "remotion";
const c={black:"#000000",cream:"#FFF3D8",yellow:"#FFCF16",orange:"#FF8A12",pink:"#E91A78",purple:"#62208F",ink:"#320B4F",glass:"#1D0A2D"};
const out=Easing.bezier(.16,1,.3,1),inn=Easing.bezier(.7,0,.84,0),both=Easing.bezier(.65,0,.35,1);
const p=(f:number,a:number,b:number,e=out)=>interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:"clamp",extrapolateRight:"clamp"});
const Shape:React.FC<{d:string;fill:string}>=({d,fill})=><g strokeLinejoin="round"><path d={d} fill={fill} stroke={c.cream} strokeWidth={27}/><path d={d} fill={fill} stroke={c.ink} strokeWidth={13}/></g>;
const WORDS={"ENDS": "M0.0 16 404.8 1776H1108.8L1030.6 1436H684.6L605.71 1093H937.71L861.58 762H529.58L436.89 359H805.89L727.0 16ZM853.0 16 1257.8 1776H1619.8L1587.9099999999999 933L1781.8 1776H2121.8L1717.0 16H1373.0L1399.4 896L1197.0 16ZM1883.0 16 2287.8 1776H2771.8Q2961.8 1776 3033.535 1670.5Q3105.27 1565 3058.58 1362L2869.06 538Q2811.56 288 2692.7799999999997 152.0Q2574.0 16 2355.0 16ZM2308.5299999999997 327H2369.5299999999997Q2466.5299999999997 327 2488.15 421L2696.99 1329Q2717.23 1417 2699.5950000000003 1442.5Q2681.96 1468 2609.96 1468H2570.96ZM3317.32 0Q3076.32 0 2997.42 120.0Q2918.52 240 2978.78 502L3018.34 674H3366.34L3315.74 454Q3301.71 393 3312.275 358.5Q3322.84 324 3368.84 324Q3416.84 324 3441.78 352.0Q3466.7200000000003 380 3481.44 444Q3500.07 525 3496.605 579.5Q3493.14 634 3465.0249999999996 683.5Q3436.91 733 3382.09 799L3258.59 949Q3120.0 1116 3169.45 1331Q3221.2 1556 3352.84 1674.0Q3484.48 1792 3682.48 1792Q3924.48 1792 3996.3100000000004 1663.0Q4068.1400000000003 1534 4007.65 1271H3649.65L3677.48 1392Q3685.76 1428 3669.86 1448.0Q3653.96 1468 3618.96 1468Q3576.96 1468 3552.0550000000003 1444.5Q3527.15 1421 3518.64 1384Q3510.13 1347 3520.24 1304.0Q3530.35 1261 3576.4700000000003 1205L3734.62 1010Q3782.2799999999997 952 3818.4449999999997 887.5Q3854.61 823 3865.9449999999997 737.5Q3877.2799999999997 652 3848.99 529Q3791.95 281 3668.135 140.5Q3544.32 0 3317.32 0Z", "SOON": "M364.63419085944236 0Q123.63419085944236 0 44.734190859442364 120.0Q-34.16580914055763 240 26.094190859442364 502L65.65419085944237 674H413.6541908594424L363.0541908594424 454Q349.0241908594424 393 359.5891908594424 358.5Q370.1541908594424 324 416.1541908594424 324Q464.1541908594424 324 489.0941908594424 352.0Q514.0341908594423 380 528.7541908594424 444Q547.3841908594425 525 543.9191908594424 579.5Q540.4541908594424 634 512.3391908594424 683.5Q484.22419085944233 733 429.4041908594424 799L305.9041908594424 949Q167.31419085944236 1116 216.76419085944235 1331Q268.51419085944235 1556 400.15419085944234 1674.0Q531.7941908594423 1792 729.7941908594423 1792Q971.7941908594423 1792 1043.6241908594425 1663.0Q1115.4541908594424 1534 1054.9641908594424 1271H696.9641908594424L724.7941908594423 1392Q733.0741908594423 1428 717.1741908594423 1448.0Q701.2741908594423 1468 666.2741908594423 1468Q624.2741908594423 1468 599.3691908594424 1444.5Q574.4641908594424 1421 565.9541908594424 1384Q557.4441908594424 1347 567.5541908594424 1304.0Q577.6641908594424 1261 623.7841908594423 1205L781.9341908594424 1010Q829.5941908594423 952 865.7591908594424 887.5Q901.9241908594424 823 913.2591908594424 737.5Q924.5941908594423 652 896.3041908594423 529Q839.2641908594424 281 715.4491908594424 140.5Q591.6341908594425 0 364.63419085944236 0ZM1321.6341908594422 0Q1110.6341908594422 0 1028.4591908594423 127.5Q946.2841908594423 255 1001.7141908594423 496L1193.9941908594424 1332Q1245.9741908594424 1558 1383.3841908594422 1675.0Q1520.7941908594423 1792 1733.7941908594423 1792Q1946.7941908594423 1792 2030.3841908594422 1675.0Q2113.9741908594424 1558 2061.9941908594424 1332L1869.7141908594424 496Q1814.2841908594423 255 1673.4591908594423 127.5Q1532.6341908594422 0 1321.6341908594422 0ZM1399.1541908594422 324Q1479.1541908594422 324 1514.8041908594423 479L1712.3741908594423 1338Q1742.2741908594423 1468 1664.2741908594423 1468Q1576.2741908594423 1468 1545.6841908594424 1335L1348.3441908594423 477Q1329.4841908594424 395 1341.3191908594422 359.5Q1353.1541908594422 324 1399.1541908594422 324ZM2327.6341908594422 0Q2116.6341908594422 0 2034.4591908594423 127.5Q1952.2841908594423 255 2007.7141908594424 496L2199.9941908594424 1332Q2251.9741908594424 1558 2389.3841908594422 1675.0Q2526.794190859442 1792 2739.794190859442 1792Q2952.794190859442 1792 3036.3841908594422 1675.0Q3119.9741908594424 1558 3067.9941908594424 1332L2875.714190859442 496Q2820.2841908594423 255 2679.459190859442 127.5Q2538.6341908594422 0 2327.6341908594422 0ZM2405.154190859442 324Q2485.154190859442 324 2520.8041908594423 479L2718.374190859442 1338Q2748.2741908594426 1468 2670.2741908594426 1468Q2582.2741908594426 1468 2551.6841908594424 1335L2354.3441908594423 477Q2335.484190859442 395 2347.319190859442 359.5Q2359.154190859442 324 2405.154190859442 324ZM2917.3141908594425 16 3322.1141908594427 1776H3684.1141908594427L3652.2241908594424 933L3846.1141908594427 1776H4186.114190859443L3781.3141908594425 16H3437.3141908594425L3463.7141908594426 896L3261.3141908594425 16Z"};
const Word:React.FC<{value:"ENDS"|"SOON";amount:number}>=({value,amount})=>{
 const upper=value==="ENDS",x=upper?730:730,y=upper?206:513,w=upper?620:617,h=upper?214:210;
 const nw=upper?4035.3029632708585:4186.114190859443,nh=upper?1792:1792;
 return <g transform={`rotate(-7 ${x+w/2} ${y+h/2})`}>
 <defs><clipPath id={`${value}-reveal`}><rect x={x-25} y={y-25} width={(w+70)*amount} height={h+80}/></clipPath></defs>
 <g clipPath={`url(#${value}-reveal)`}><g transform={`translate(${x} ${y+h}) scale(${w/nw} ${-h/nh})`}>
 {!upper&&<path d={WORDS[value]} fill="#870D57" transform={`translate(${6*nw/w} ${-8*nh/h})`}/>}<path d={WORDS[value]} fill={upper?c.ink:c.cream}/>
 </g></g></g>;
};
const CX=515;
const upperWidth=(y:number)=>8+150*(1-Math.pow((y-220)/240,2));
const lowerWidth=(y:number)=>8+150*(1-Math.pow((725-y)/245,2));
const chamber=(top:boolean)=>{
 const a=top?220:480,b=top?460:725,fun=top?upperWidth:lowerWidth;
 const left=Array.from({length:65},(_,i)=>{const y=a+(b-a)*i/64;return `${CX-fun(y)},${y}`});
 const right=Array.from({length:65},(_,i)=>{const y=b-(b-a)*i/64;return `${CX+fun(y)},${y}`});
 return "M"+left.join(" L")+" L"+right.join(" L")+" Z";
};
const upper=chamber(true),lower=chamber(false);
// Match visible sand area transferred between chambers, rather than scaling two unrelated shapes.
const integrate=(fn:(y:number)=>number,a:number,b:number)=>{const n=180,dy=(b-a)/n;let area=0;for(let i=0;i<n;i++)area+=fn(a+(i+.5)*dy)*dy;return area;};
const initialUpperArea=integrate(y=>2*upperWidth(y),305,460),initialLowerArea=13000;
const solve=(target:number,area:(v:number)=>number,lo:number,hi:number)=>{for(let i=0;i<32;i++){const mid=(lo+hi)/2;if(area(mid)>target)lo=mid;else hi=mid;}return (lo+hi)/2;};
const topLevel=(flow:number)=>solve(initialUpperArea*(1-flow),v=>integrate(y=>2*upperWidth(y),v,460),220,460);
const moundArea=(peak:number)=>integrate(y=>2*Math.min(lowerWidth(y),158*Math.max(0,(y-peak)/(725-peak))),Math.max(480,peak),725);
const bottomPeak=(flow:number)=>solve(initialLowerArea+initialUpperArea*flow,moundArea,485,724);
const Caps=()=> <g>
 <Shape d="M300 151 Q310 110 495 105 Q662 94 681 130 L690 193 Q668 230 493 239 Q326 246 301 214 Z" fill={c.purple}/>
 <ellipse cx={491} cy={158} rx={177} ry={30} fill="#8A33BD" transform="rotate(-5 491 158)"/>
 <path d="M319 179 Q485 203 674 161 L680 193 Q615 226 487 230 Q358 236 315 210 Z" fill="#471263"/>
 <Shape d="M312 734 Q337 704 512 711 Q674 708 705 733 L706 791 Q678 825 515 826 Q341 827 310 796 Z" fill={c.purple}/>
 <ellipse cx={509} cy={733} rx={181} ry={24} fill="#8A33BD"/>
 <path d="M338 758 L352 763 V791 L338 786 Z" fill="#9A4CC2"/>
 </g>;
const Glass:React.FC<{flow:number;frame:number}>=({flow,frame})=>{
 const level=topLevel(flow),peak=bottomPeak(flow);
 const active=frame>=60&&frame<209;
 return <g>
 <defs><clipPath id="hour-upper"><path d={upper}/></clipPath><clipPath id="hour-lower"><path d={lower}/></clipPath><clipPath id="hour-stream"><path d={lower}/><rect x={502} y={457} width={26} height={27}/></clipPath></defs>
 <path d="M357 211 C307 297 352 377 464 444 Q497 467 464 493 C356 562 316 647 359 735 H671 C714 647 674 562 566 493 Q533 467 566 444 C678 377 723 297 673 211 Z" fill={c.glass} stroke={c.cream} strokeWidth={22} strokeLinejoin="round"/>
 <g clipPath="url(#hour-upper)">{flow<1&&<rect x={340} y={level} width={350} height={460-level} fill="url(#hour-sand-color)"/>}</g>
 <g clipPath="url(#hour-lower)"><path d={`M357 725 L515 ${peak} L673 725 Z`} fill="url(#hour-sand-color)"/></g>
 {active&&<g clipPath="url(#hour-stream)">{Array.from({length:9},(_,i)=>{
 const distance=Math.max(1,peak-461),phase=((frame-60)*5.5+i*27)%distance;
 return <rect key={i} x={508} y={461+phase} width={14} height={19} rx={7} fill={c.orange}/>;
 })}</g>}
 <path d="M383 275 Q379 301 397 325 M396 655 Q399 611 428 581" fill="none" stroke={c.cream} strokeWidth={18} strokeLinecap="round"/>
 </g>;
};
const Bolt:React.FC<{x:number;y:number;amount:number;flip?:boolean}>=({x,y,amount,flip=false})=><path opacity={amount} transform={`translate(${x} ${y}) scale(${flip?-1:1} 1)`} d="M-65 -83 L45 -1 H7 L65 84 L-45 4 H-10 Z" fill={c.pink}/>;
const Plus:React.FC<{x:number;y:number;amount:number}>=({x,y,amount})=><path opacity={amount} transform={`translate(${x} ${y})`} d="M-8 -30 H8 V-8 H30 V8 H8 V30 H-8 V8 H-30 V-8 H-8 Z" fill={c.yellow}/>;
export const ClosingHourglass:React.FC=()=>{
 const f=useCurrentFrame(),arrival=p(f,0,28),exit=p(f,275,299,inn);
 const ends=p(f,15,49)*(1-p(f,240,260,inn)),soon=p(f,23,57)*(1-p(f,235,253,inn));
 const accents=p(f,42,59)*(1-p(f,235,247,inn)),flow=p(f,60,209,both);
 // Retract panels as rigid pieces behind the hourglass; no translucent fades or distorted scaleX.
 const endsShift=850*(1-ends),soonShift=850*(1-soon);
 const rotation=180*p(f,263,287,both);
 return <AbsoluteFill style={{backgroundColor:c.black}}><svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs>
 <linearGradient id="hour-ends-color" x1="0" y1="0" x2=".8" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stopColor="#FFE146"/><stop offset=".55" stopColor="#FFD01C"/><stop offset="1" stopColor="#F5AA0D"/></linearGradient>
 <linearGradient id="hour-soon-color" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stopColor="#F72E8B"/><stop offset=".55" stopColor="#E91678"/><stop offset="1" stopColor="#CA125F"/></linearGradient>
 <linearGradient id="hour-sand-color" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE347"/><stop offset="1" stopColor="#F8BC0D"/></linearGradient>
 <clipPath id="hour-panels"><rect x={570} y={85} width={940} height={730}/></clipPath></defs>
 <g opacity={f<=0||f>=299?0:1} transform={`translate(0 ${1120*(1-arrival)+1120*exit})`}>
 <g clipPath="url(#hour-panels)">
 <g opacity={ends>0?1:0} transform={`translate(${-endsShift} 0)`}><Shape d="M560 226 L1380 126 L1426 178 L1351 459 L613 513 L552 462 Z" fill="url(#hour-ends-color)"/><Word value="ENDS" amount={p(f,33,58)*(1-p(f,240,254,inn))}/></g>
 <g opacity={soon>0?1:0} transform={`translate(${-soonShift} 0)`}><Shape d="M587 506 L1408 456 L1434 487 L1373 730 L637 782 L570 728 Z" fill="url(#hour-soon-color)"/><Word value="SOON" amount={p(f,40,64)*(1-p(f,235,249,inn))}/></g>
 </g>
 <g transform={`rotate(${rotation} 510 465)`}><Glass flow={flow} frame={f}/><Caps/></g>
 <Bolt x={276} y={367} amount={accents}/><Bolt x={1454} y={589} amount={accents} flip/>
 <Plus x={310} y={516} amount={accents}/><Plus x={1440} y={370} amount={accents}/>
 </g></svg></AbsoluteFill>;
};
