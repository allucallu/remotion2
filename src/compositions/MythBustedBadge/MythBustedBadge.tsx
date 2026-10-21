/* Letter outlines adapted from Anton.
Copyright 2020 The Anton Project Authors (https://github.com/googlefonts/AntonFont.git)

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
import React from 'react';
import {AbsoluteFill,Easing,interpolate,useCurrentFrame} from 'remotion';
// Composition: 3840 × 2160, 30 fps, durationInFrames: 300.
const c={cream:'#FFF1D2',blue:'#2469D8',yellow:'#FFD51C',coral:'#FF6962',purple:'#291055',ink:'#210849'};
const out=Easing.bezier(.16,1,.3,1),inn=Easing.bezier(.7,0,.84,0);
const p=(f:number,a:number,b:number,e=out)=>f<=a?0:f>=b?1:interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const words={"MYTH": {"d": "M0.0 0 281.6 1760H817.6L793.92 687L1112.6 1760H1653.6L1372.0 0H1050.0L1252.88 1268L848.0 0H532.0L520.88 1268L318.0 0ZM1761.0 0 1853.6399999999999 579 1761.6 1760H2110.6L2113.24 1164L2306.6 1760H2654.6L2185.64 579L2093.0 0ZM2633.0 0 2860.52 1422H2651.52L2705.6 1760H3475.6L3421.52 1422H3212.52L2985.0 0ZM3312.0 0 3593.6 1760H3943.6L3842.96 1131H4008.96L4109.6 1760H4459.6L4178.0 0H3828.0L3955.6800000000003 798H3789.6800000000003L3662.0 0Z", "w": 4459.6}, "BUSTED": {"d": "M0.0 0 281.6 1760H758.6Q950.5999999999999 1760 1023.14 1666.5Q1095.68 1573 1061.28 1358L1048.96 1281Q1029.12 1157 972.3 1080.0Q915.48 1003 820.64 979Q934.84 949 957.6600000000001 838.5Q980.48 728 955.04 569Q927.68 398 875.2 270.0Q822.72 142 727.36 71.0Q632.0 0 477.0 0ZM519.52 1097H591.52Q640.52 1097 660.6 1135.0Q680.6800000000001 1173 689.16 1226L717.48 1403Q731.08 1488 656.08 1488H582.08ZM428.6 310Q565.6 310 586.4 440L621.6 660Q633.6 735 618.06 778.5Q602.52 822 540.52 822H475.52L393.92 312Q415.6 310 428.6 310ZM1404.44 -16Q1184.44 -16 1100.2 107.5Q1015.96 231 1054.3600000000001 471L1260.6 1760H1602.6L1398.6 485Q1391.56 441 1390.08 400.5Q1388.6 360 1402.44 334.0Q1416.28 308 1456.28 308Q1497.28 308 1519.3600000000001 333.5Q1541.44 359 1552.5 400.0Q1563.56 441 1570.6 485L1774.6 1760H2116.6L1910.3600000000001 471Q1871.96 231 1748.2 107.5Q1624.44 -16 1404.44 -16ZM2405.44 -16Q2164.44 -16 2077.14 104.0Q1989.84 224 2031.76 486L2059.28 658H2407.2799999999997L2372.08 438Q2362.32 377 2375.3 342.5Q2388.2799999999997 308 2434.2799999999997 308Q2482.2799999999997 308 2505.2599999999998 336.0Q2528.24 364 2538.48 428Q2551.44 509 2544.16 563.5Q2536.88 618 2505.3 667.5Q2473.7200000000003 717 2414.2799999999997 783L2280.2799999999997 933Q2130.0 1100 2164.4 1315Q2200.4 1540 2323.7799999999997 1658.0Q2447.16 1776 2645.16 1776Q2887.16 1776 2968.02 1647.0Q3048.88 1518 3006.8 1255H2648.8L2668.16 1376Q2673.92 1412 2656.62 1432.0Q2639.3199999999997 1452 2604.3199999999997 1452Q2562.3199999999997 1452 2539.06 1428.5Q2515.8 1405 2509.88 1368Q2503.96 1331 2517.08 1288.0Q2530.2 1245 2580.24 1189L2752.04 994Q2803.76 936 2844.44 871.5Q2885.12 807 2902.44 721.5Q2919.76 636 2900.08 513Q2860.4 265 2746.42 124.5Q2632.44 -16 2405.44 -16ZM3106.0 0 3333.52 1422H3124.52L3178.6 1760H3948.6L3894.52 1422H3685.52L3458.0 0ZM3785.0 0 4066.6 1760H4770.6L4716.2 1420H4370.2L4315.32 1077H4647.32L4594.36 746H4262.36L4197.88 343H4566.88L4512.0 0ZM4648.0 0 4929.6 1760H5413.6Q5603.6 1760 5682.72 1654.5Q5761.84 1549 5729.360000000001 1346L5597.52 522Q5557.52 272 5448.26 136.0Q5339.0 0 5120.0 0ZM5051.76 311H5112.76Q5209.76 311 5224.8 405L5370.08 1313Q5384.16 1401 5364.74 1426.5Q5345.32 1452 5273.32 1452H5234.32Z", "w": 5738.812960573477}};
const Word=({word,y,h,amount,fill}:{word:keyof typeof words;y:number;h:number;amount:number;fill:string})=>{
 const scale=h/1760,w=words[word].w*scale;
 return <g opacity={amount>0?1:0} transform={`translate(${1100-w/2} ${y+16*(1-amount)}) scale(${scale} ${-scale})`}><path d={words[word].d} fill={fill}/></g>;
};
const Panel=({x,y,w,h,fill}:{x:number;y:number;w:number;h:number;fill:string})=><g>
 <rect x={x} y={y} width={w} height={h} rx="48" fill={fill} stroke={c.cream} strokeWidth="30"/>
 <rect x={x} y={y} width={w} height={h} rx="48" fill="none" stroke={c.ink} strokeWidth="14"/>
</g>;
export const MythBustedBadge:React.FC=()=>{
 const f=useCurrentFrame();
 const leave=p(f,260,299,inn),pan=p(f,1,31),circle=p(f,10,37);
 const lineA=p(f,31,45)*(1-p(f,247,260,inn));
 const lineB=p(f,40,54)*(1-p(f,241,255,inn));
 const myth=p(f,39,53)*(1-p(f,247,260,inn));
 const busted=p(f,46,62)*(1-p(f,241,255,inn));
 const accent=p(f,52,65)*(1-p(f,241,255,inn));
 const px=2200*(1-pan)+2200*leave,cx=-1250*(1-circle)-1250*leave;
 const line=(x1:number,y1:number,x2:number,y2:number,amount:number)=><line x1={x1} y1={y1} x2={x1+(x2-x1)*amount} y2={y1+(y2-y1)*amount} opacity={amount>0?1:0} stroke={c.coral} strokeWidth="66" strokeLinecap="round"/>;
 return <AbsoluteFill style={{backgroundColor:'#000'}}><svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet">
 <g opacity={f<=0||f>=299?0:1} transform="translate(130 115) scale(.86)">
 <g transform={`translate(${px} 0)`}>
 {/* Full opaque panels translate as a rigid stack: no clipped outlines or stretching. */}
 <Panel x={600} y={155} w={915} h={350} fill={c.blue}/>
 <Panel x={585} y={465} w={1015} h={350} fill={c.yellow}/>
 <Word word="MYTH" y={423} h={198} amount={myth} fill={c.cream}/>
 <Word word="BUSTED" y={736} h={184} amount={busted} fill={c.ink}/>
 </g>
 <g transform={`translate(${cx} 0) rotate(${-7*(1-circle)} 500 487)`}>
 <circle cx="500" cy="487" r="245" fill={c.purple} stroke={c.cream} strokeWidth="32"/>
 <circle cx="500" cy="487" r="245" fill="none" stroke={c.ink} strokeWidth="14"/>
 {line(405,392,595,582,lineA)}
 {line(595,392,405,582,lineB)}
 <g stroke={c.coral} strokeWidth="26" strokeLinecap="round" opacity={accent>0?1:0}>
 <line x1="296" y1="269" x2={296-49*accent} y2={269-32*accent}/>
 <line x1="351" y1="224" x2={351-30*accent} y2={224-50*accent}/>
 </g></g></g></svg></AbsoluteFill>;
};
