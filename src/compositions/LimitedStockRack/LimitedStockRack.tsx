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
import React,{useId} from 'react';
import {AbsoluteFill,Easing,interpolate,useCurrentFrame} from 'remotion';
// Composition: 3840 × 2160, 30 fps, 300 frames.
const c={cream:'#FFF7E7',orange:'#FF6107'};
const ease=Easing.bezier(.16,1,.3,1),exitEase=Easing.bezier(.7,0,.84,0);
const p=(f:number,a:number,b:number,e=ease)=>f<=a?0:f>=b?1:interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const words={"LIMITED": {"d": "M0 0V1760H352V300H714V0ZM818 0V1760H1158V0ZM1318 0V1760H1854L2002 687L2149 1760H2690V0H2368V1268L2166 0H1850L1636 1268V0ZM2850 0V1760H3190V0ZM3501 0V1422H3292V1760H4062V1422H3853V0ZM4180 0V1760H4884V1420H4538V1077H4870V746H4538V343H4907V0ZM5043 0V1760H5527Q5717 1760 5813.0 1654.5Q5909 1549 5909 1346V522Q5909 272 5821.5 136.0Q5734 0 5515 0ZM5397 311H5458Q5555 311 5555 405V1313Q5555 1401 5531.5 1426.5Q5508 1452 5436 1452H5397Z", "w": 5909}, "STOCK": {"d": "M454 -16Q213 -16 106.5 104.0Q0 224 0 486V658H348V438Q348 377 366.5 342.5Q385 308 431 308Q479 308 497.5 336.0Q516 364 516 428Q516 509 500.0 563.5Q484 618 444.5 667.5Q405 717 335 783L177 933Q0 1100 0 1315Q0 1540 104.5 1658.0Q209 1776 407 1776Q649 1776 750.5 1647.0Q852 1518 852 1255H494V1376Q494 1412 473.5 1432.0Q453 1452 418 1452Q376 1452 356.5 1428.5Q337 1405 337 1368Q337 1331 357.0 1288.0Q377 1245 436 1189L639 994Q700 936 751.0 871.5Q802 807 833.0 721.5Q864 636 864 513Q864 265 772.5 124.5Q681 -16 454 -16ZM1152 0V1422H943V1760H1713V1422H1504V0ZM2251 -16Q2040 -16 1928.5 111.5Q1817 239 1817 480V1316Q1817 1542 1927.5 1659.0Q2038 1776 2251 1776Q2464 1776 2574.5 1659.0Q2685 1542 2685 1316V480Q2685 239 2573.5 111.5Q2462 -16 2251 -16ZM2254 308Q2334 308 2334 463V1322Q2334 1452 2256 1452Q2168 1452 2168 1319V461Q2168 379 2188.0 343.5Q2208 308 2254 308ZM3257 -16Q3066 -16 2949.5 103.0Q2833 222 2833 436V1248Q2833 1504 2934.5 1640.0Q3036 1776 3265 1776Q3390 1776 3487.5 1730.0Q3585 1684 3641.0 1592.5Q3697 1501 3697 1362V1058H3347V1318Q3347 1397 3327.0 1424.5Q3307 1452 3265 1452Q3216 1452 3199.0 1416.5Q3182 1381 3182 1322V441Q3182 368 3203.5 338.0Q3225 308 3265 308Q3310 308 3328.5 345.0Q3347 382 3347 441V758H3701V425Q3701 193 3584.0 88.5Q3467 -16 3257 -16ZM3838 0V1760H4186V1055L4350 1760H4704L4507 954L4745 0H4380L4188 852V0Z", "w": 4745}};
const Word=({word,y,h}:{word:keyof typeof words;y:number;h:number})=><g transform={`translate(727 ${y}) scale(${649/words[word].w} ${-h/1760})`}><path d={words[word].d} fill={c.cream}/></g>;
export const LimitedStockRack:React.FC=()=>{
 const f=useCurrentFrame(),id=useId().replace(/:/g,'');
 const base=p(f,8,23)*(1-p(f,283,291,exitEase));
 const bottom=p(f,20,35)*(1-p(f,270,282,exitEase));
 const mid=p(f,30,44)*(1-p(f,258,270,exitEase));
 const top=p(f,40,54)*(1-p(f,248,260,exitEase));
 const panel=p(f,24,56)*(1-p(f,250,278,exitEase));
 const stop=p(f,57,68)*(1-p(f,240,250,exitEase));
 const box=(x:number,y:number,w:number,h:number,a:number,travel:number,orange=false)=><g opacity={a>0?1:0} transform={`translate(0 ${travel*(1-a)})`}><rect x={x} y={y} width={w} height={h} rx="3" fill={orange?c.orange:`url(#${id}-face)`} stroke={c.cream} strokeWidth="8"/></g>;
 return <AbsoluteFill style={{backgroundColor:'#000'}}><svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs>
 <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#222323"/><stop offset="1" stopColor="#161717"/></linearGradient>
 <clipPath id={`${id}-floor`}><rect x="190" y="180" width="1310" height="513"/></clipPath>
 <clipPath id={`${id}-middle`}><rect x="240" y="180" width="420" height="329"/></clipPath>
 <clipPath id={`${id}-stop`}><rect x="1430" y="662" width="60" height="54"/></clipPath>
 <clipPath id={`${id}-top`}><rect x="285" y="180" width="320" height="187"/></clipPath>
 </defs>
 <g opacity={f<=7||f>=292?0:1}>
 <g clipPath={`url(#${id}-floor)`}>
 {/* Back-to-front stack prevents hidden portions leaking through lower blocks. */}
 <g clipPath={`url(#${id}-top)`}>{box(335,237,220,134,top,142,true)}</g>
 <g clipPath={`url(#${id}-middle)`}>{box(296,367,302,146,mid,154)}</g>
 {box(251,509,394,184,bottom,194)}
 <g opacity={panel>0?1:0} transform={`translate(0 ${467*(1-panel)})`}>
 <rect x="679" y="237" width="740" height="456" rx="3" fill={`url(#${id}-face)`} stroke={c.cream} strokeWidth="8"/>
 <Word word="LIMITED" y={447} h={171}/><Word word="STOCK" y={662} h={195}/>
 </g>
 </g>
 {/* Baseline sits in front of the reveal boundary to cover cut edges. */}
 <rect x="204" y="685" width={1229*base} height="16" fill={c.orange} opacity={base>0?1:0}/>
 <g clipPath={`url(#${id}-stop)`}>
 <rect x="1435" y={662+66*(1-stop)} width="49" height="54" fill={c.orange} opacity={stop>0?1:0}/>
 </g>
 </g></svg></AbsoluteFill>;
};
