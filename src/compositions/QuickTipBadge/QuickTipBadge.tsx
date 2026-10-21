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
const c={black:"#000000",cream:"#FFF3D8",yellow:"#FFD435",coral:"#FA6B61",ink:"#291047"};
const out=Easing.bezier(.16,1,.3,1),inn=Easing.bezier(.7,0,.84,0),both=Easing.bezier(.65,0,.35,1);
const p=(f:number,a:number,b:number,e=out)=>f<=a?0:f>=b?1:interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:"clamp",extrapolateRight:"clamp"});
const Shape:React.FC<{d:string;fill:string}>=({d,fill})=><g strokeLinejoin="round"><path d={d} fill={fill} stroke={c.cream} strokeWidth={34}/><path d={d} fill={fill} stroke={c.ink} strokeWidth={18}/></g>;
// Preserve the original glyph aspect ratio: only uniform scaling, never separate X/Y stretching.
const WORDS={"QUICK": "M709.2480683436165 -187 458.68806834361646 -3Q408.60806834361654 -16 357.60806834361654 -16Q151.6080683436165 -16 62.62806834361651 106.0Q-26.351931656383485 228 11.088068343616513 462L147.24806834361655 1313Q183.5680683436165 1540 313.9480683436165 1658.0Q444.32806834361656 1776 655.3280683436166 1776Q866.3280683436166 1776 958.9480683436166 1658.0Q1051.5680683436167 1540 1015.2480683436164 1313L879.0880683436164 462Q844.2080683436164 244 726.2080683436164 119L861.8480683436164 23ZM420.44806834361646 308Q458.44806834361646 308 479.4280683436165 336.0Q500.4080683436165 364 511.4680683436165 405.0Q522.5280683436165 446 528.6080683436165 484L660.2880683436165 1307Q669.2480683436165 1363 660.8680683436164 1407.5Q652.4880683436164 1452 601.4880683436164 1452Q549.4880683436164 1452 526.5280683436165 1408.5Q503.56806834361646 1365 494.44806834361646 1308L361.48806834361653 477Q355.8880683436165 442 354.0680683436165 402.5Q352.2480683436165 363 365.8480683436165 335.5Q379.44806834361646 308 420.44806834361646 308ZM1411.6080683436164 -16Q1191.6080683436164 -16 1107.3680683436164 107.5Q1023.1280683436165 231 1061.5280683436165 471L1267.7680683436165 1760H1609.7680683436165L1405.7680683436165 485Q1398.7280683436165 441 1397.2480683436165 400.5Q1395.7680683436165 360 1409.6080683436164 334.0Q1423.4480683436163 308 1463.4480683436163 308Q1504.4480683436163 308 1526.5280683436165 333.5Q1548.6080683436167 359 1559.6680683436166 400.0Q1570.7280683436165 441 1577.7680683436165 485L1781.7680683436165 1760H2123.7680683436165L1917.5280683436165 471Q1879.1280683436166 231 1755.3680683436166 107.5Q1631.6080683436167 -16 1411.6080683436164 -16ZM1996.1680683436166 0 2277.7680683436165 1760H2617.7680683436165L2336.1680683436166 0ZM2918.6080683436167 -16Q2727.6080683436167 -16 2630.1480683436166 103.0Q2532.6880683436166 222 2566.9280683436164 436L2696.8480683436164 1248Q2737.8080683436165 1504 2861.0680683436167 1640.0Q2984.328068343617 1776 3213.328068343617 1776Q3338.328068343617 1776 3428.468068343617 1730.0Q3518.6080683436167 1684 3559.968068343617 1592.5Q3601.328068343617 1501 3579.0880683436167 1362L3530.448068343617 1058H3180.448068343617L3222.0480683436167 1318Q3234.6880683436166 1397 3219.0880683436167 1424.5Q3203.4880683436168 1452 3161.4880683436168 1452Q3112.4880683436168 1452 3089.8080683436165 1416.5Q3067.1280683436166 1381 3057.6880683436166 1322L2916.7280683436165 441Q2905.0480683436167 368 2921.748068343617 338.0Q2938.448068343617 308 2978.448068343617 308Q3023.448068343617 308 3047.868068343617 345.0Q3072.2880683436165 382 3081.7280683436165 441L3132.448068343617 758H3486.448068343617L3433.1680683436166 425Q3396.0480683436167 193 3262.328068343617 88.5Q3128.6080683436167 -16 2918.6080683436167 -16ZM3517.1680683436166 0 3798.7680683436165 1760H4146.7680683436165L4033.9680683436163 1055L4310.7680683436165 1760H4664.7680683436165L4338.8080683436165 954L4424.168068343617 0H4059.1680683436166L4003.4880683436168 852L3867.1680683436166 0Z", "TIP": "M0.0 0 227.51999999999998 1422H18.52000000000001L72.60000000000002 1760H842.5999999999999L788.52 1422H579.52L352.0 0ZM678.0 0 959.6 1760H1299.6L1018.0 0ZM1193.0 0 1474.6 1760H1939.6Q2085.6 1760 2160.7 1695.0Q2235.8 1630 2253.6000000000004 1510.0Q2271.4 1390 2244.84 1224Q2219.24 1064 2169.2799999999997 945.5Q2119.3199999999997 827 2029.4199999999998 762.0Q1939.52 697 1793.52 697H1650.52L1539.0 0ZM1701.08 1013H1721.08Q1819.08 1013 1849.88 1068.0Q1880.68 1123 1897.8 1230Q1913.8 1330 1901.02 1384.5Q1888.24 1439 1808.24 1439H1769.24Z"};
const Word:React.FC<{value:"QUICK"|"TIP";amount:number}>=({value,amount})=>{
 const first=value==="QUICK",capHeight=first?153:180,scale=capHeight/1760;
 const width=(first?4664.7680683436165:2260.7424706943193)*scale;
 const centerX=992,baseline=first?505:710,x=centerX-width/2,top=baseline-capHeight;
 const id=first?"quick-word":"tip-word";
 return <g transform={`rotate(-3 ${centerX} ${baseline-capHeight/2})`}>
 <defs><clipPath id={id}><rect x={x-25} y={top-25} width={(width+60)*amount} height={capHeight+65}/></clipPath></defs>
 <g clipPath={`url(#${id})`}><path d={WORDS[value]} fill={c.ink} transform={`translate(${x+12*(1-amount)} ${baseline}) scale(${scale} ${-scale})`}/></g>
 </g>;
};

const panel="M715 313 H1192 Q1209 313 1220 325 L1280 386 Q1293 399 1293 417 V697 Q1293 730 1260 730 H615 Q595 730 581 716 L548 683 Z";
const pencil="M-85 -350 L0 -510 L85 -350 V80 Q85 116 48 116 H-48 Q-85 116 -85 80 Z";
const Pencil:React.FC<{x:number;y:number;rotation:number}>=({x,y,rotation})=><g transform={`translate(${x} ${y}) rotate(${rotation})`} strokeLinejoin="round">
 <defs><clipPath id="quick-pencil-clip"><path d={pencil}/></clipPath></defs>
 <Shape d={pencil} fill="url(#quick-coral)"/>
 <g clipPath="url(#quick-pencil-clip)">
 <path d="M-85 -350 L0 -510 L85 -350 L43 -370 L0 -350 L-43 -370 Z" fill={c.cream} stroke={c.ink} strokeWidth={12}/>
 <path d="M-22 -468 L0 -510 L22 -468 Q0 -455 -22 -468 Z" fill={c.ink}/>
 <path d="M-28 -357 V-18 M28 -357 V-18" fill="none" stroke={c.ink} strokeWidth={11}/>
 <path d="M-85 -15 H85 V34 H-85 Z" fill={c.cream} stroke={c.ink} strokeWidth={12}/>
 </g>
</g>;
const Emphasis:React.FC<{x:number;y:number;angle:number;amount:number}>=({x,y,angle,amount})=><g opacity={amount>0?1:0} transform={`translate(${x} ${y}) rotate(${angle})`}><line x1={0} y1={0} x2={0} y2={-52*amount} stroke={c.cream} strokeWidth={22} strokeLinecap="round"/></g>;
export const QuickTipBadge:React.FC=()=>{
 const f=useCurrentFrame(),panelIn=p(f,1,27),panelOut=p(f,275,299,inn),penIn=p(f,8,35),penOut=p(f,260,283,inn);
 const swing=2.1*Math.sin(Math.PI*p(f,42,59,both));
 const py=1120*(1-panelIn)+1120*panelOut;
 const penX=480-1200*(1-penIn)-1200*penOut,penY=620+900*(1-penIn)+900*penOut;
 const rotation=36-5*(1-penIn)+swing;
 const quick=p(f,29,47)*(1-p(f,248,259,inn)),tip=p(f,34,52)*(1-p(f,240,253,inn));
 const rayA=p(f,48,57)*(1-p(f,240,249,inn)),rayB=p(f,51,59)*(1-p(f,243,252,inn));
 return <AbsoluteFill style={{backgroundColor:c.black}}><svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs><linearGradient id="quick-yellow" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stopColor="#FFE365"/><stop offset="1" stopColor="#FFD035"/></linearGradient><linearGradient id="quick-coral" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F15D58"/><stop offset=".5" stopColor="#FF8074"/><stop offset="1" stopColor="#F76D64"/></linearGradient></defs>
 <g opacity={f<=0||f>=299?0:1}>
 <g transform={`translate(0 ${py})`}>
 <path d={panel} fill={c.ink} transform="translate(5 12)" stroke={c.cream} strokeWidth={32} strokeLinejoin="round"/>
 <Shape d={panel} fill="url(#quick-yellow)"/>
 <Word value="QUICK" amount={quick}/><Word value="TIP" amount={tip}/>
 </g>
 <Pencil x={penX} y={penY} rotation={rotation}/>
 <Emphasis x={840} y={205} angle={34} amount={rayA}/><Emphasis x={877} y={241} angle={58} amount={rayB}/>
 </g></svg></AbsoluteFill>;
};
