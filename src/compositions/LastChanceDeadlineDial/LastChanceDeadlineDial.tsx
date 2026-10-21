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
// Composition: 3840 × 2160, 30 fps, durationInFrames: 300.
const c={cream:'#FFF7E7',orange:'#FF6107'};
const ease=Easing.bezier(.16,1,.3,1),exitEase=Easing.bezier(.7,0,.84,0);
const p=(f:number,a:number,b:number,e=ease)=>f<=a?0:f>=b?1:interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const words={"LAST": {"d": "M0 0V1760H352V300H714V0ZM786 0 956 1760H1553L1720 0H1387L1362 284H1150L1128 0ZM1175 565H1335L1258 1460H1242ZM2266 -16Q2025 -16 1918.5 104.0Q1812 224 1812 486V658H2160V438Q2160 377 2178.5 342.5Q2197 308 2243 308Q2291 308 2309.5 336.0Q2328 364 2328 428Q2328 509 2312.0 563.5Q2296 618 2256.5 667.5Q2217 717 2147 783L1989 933Q1812 1100 1812 1315Q1812 1540 1916.5 1658.0Q2021 1776 2219 1776Q2461 1776 2562.5 1647.0Q2664 1518 2664 1255H2306V1376Q2306 1412 2285.5 1432.0Q2265 1452 2230 1452Q2188 1452 2168.5 1428.5Q2149 1405 2149 1368Q2149 1331 2169.0 1288.0Q2189 1245 2248 1189L2451 994Q2512 936 2563.0 871.5Q2614 807 2645.0 721.5Q2676 636 2676 513Q2676 265 2584.5 124.5Q2493 -16 2266 -16ZM2964 0V1422H2755V1760H3525V1422H3316V0Z", "w": 3525}, "CHANCE": {"d": "M424 -16Q233 -16 116.5 103.0Q0 222 0 436V1248Q0 1504 101.5 1640.0Q203 1776 432 1776Q557 1776 654.5 1730.0Q752 1684 808.0 1592.5Q864 1501 864 1362V1058H514V1318Q514 1397 494.0 1424.5Q474 1452 432 1452Q383 1452 366.0 1416.5Q349 1381 349 1322V441Q349 368 370.5 338.0Q392 308 432 308Q477 308 495.5 345.0Q514 382 514 441V758H868V425Q868 193 751.0 88.5Q634 -16 424 -16ZM1005 0V1760H1355V1131H1521V1760H1871V0H1521V798H1355V0ZM1999 0 2169 1760H2766L2933 0H2600L2575 284H2363L2341 0ZM2388 565H2548L2471 1460H2455ZM3061 0V1760H3423L3585 917V1760H3925V0H3581L3405 880V0ZM4511 -16Q4320 -16 4203.5 103.0Q4087 222 4087 436V1248Q4087 1504 4188.5 1640.0Q4290 1776 4519 1776Q4644 1776 4741.5 1730.0Q4839 1684 4895.0 1592.5Q4951 1501 4951 1362V1058H4601V1318Q4601 1397 4581.0 1424.5Q4561 1452 4519 1452Q4470 1452 4453.0 1416.5Q4436 1381 4436 1322V441Q4436 368 4457.5 338.0Q4479 308 4519 308Q4564 308 4582.5 345.0Q4601 382 4601 441V758H4955V425Q4955 193 4838.0 88.5Q4721 -16 4511 -16ZM5092 0V1760H5796V1420H5450V1077H5782V746H5450V343H5819V0Z", "w": 5819}};
const Word=({word,x,y,w,h}:{word:keyof typeof words;x:number;y:number;w:number;h:number})=><g transform={`translate(${x} ${y}) scale(${w/words[word].w} ${-h/1760})`}><path d={words[word].d} fill={c.cream}/></g>;
const CX=439,CY=454,R=257;
const start=3.5*Math.PI/180,end=86.5*Math.PI/180;
const arcPath=`M${CX+R*Math.sin(start)} ${CY-R*Math.cos(start)} A${R} ${R} 0 0 1 ${CX+R*Math.sin(end)} ${CY-R*Math.cos(end)}`;
const arcLength=R*(end-start);
export const LastChanceDeadlineDial:React.FC=()=>{
 const f=useCurrentFrame(),id=useId().replace(/:/g,'');
 const enter=p(f,8,38),leave=p(f,266,291,exitEase);
 const bridge=p(f,30,45)*(1-p(f,266,279,exitEase));
 const angle=40.2*p(f,46,58)*(1-p(f,244,262,exitEase));
 const hand=p(f,39,48)*(1-p(f,263,272,exitEase));
 const arc=p(f,44,64)*(1-p(f,244,262,exitEase));
 const underline=p(f,57,70)*(1-p(f,240,251,exitEase));
 const lx=-800*(1-enter)-800*leave,rx=950*(1-enter)+950*leave;
 return <AbsoluteFill style={{backgroundColor:'#000'}}><svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs><linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#202121"/><stop offset="1" stopColor="#141515"/></linearGradient></defs>
 <g opacity={f<=7||f>=292?0:1}>
 {/* Bracket stays anchored to the message panel; both ends are occluded by housings. */}
 <g transform={`translate(${rx} 0)`}>
 <g opacity={bridge>0?1:0} fill="none" stroke={c.cream} strokeWidth="14">
 <path d={`M${830-116*bridge} 394 H830 M${830-116*bridge} 521 H830`}/>
 </g>
 <rect x="820" y="203" width="708" height="514" rx="28" fill={`url(#${id}-face)`} stroke={c.cream} strokeWidth="12"/>
 <Word word="LAST" x={879} y={431} w={474} h={184}/>
 <Word word="CHANCE" x={875} y={622} w={615} h={167}/>
 <line x1="893" y1="662" x2={893+580*underline} y2="662" stroke={c.orange} strokeWidth="31" strokeLinecap="round" opacity={underline>0?1:0}/>
 </g>
 <g transform={`translate(${lx} 0)`}>
 <circle cx={CX} cy={CY} r="297" fill={`url(#${id}-face)`} stroke={c.cream} strokeWidth="14"/>
 <path d="M439 183 V249 M654 454 H714 M439 657 V721 M165 454 H225" fill="none" stroke={c.cream} strokeWidth="16"/>
 <path d={arcPath} fill="none" stroke={c.orange} strokeWidth="43" strokeLinecap="butt" strokeDasharray={`${arcLength} ${arcLength}`} strokeDashoffset={arcLength*(1-arc)} opacity={arc>0?1:0}/>
 <g transform={`rotate(${angle} ${CX} ${CY})`}>
 <line x1={CX} y1={CY} x2={CX} y2={CY-196*hand} stroke={c.orange} strokeWidth="35" strokeLinecap="round" opacity={hand>0?1:0}/>
 </g>
 <circle cx={CX} cy={CY} r="35" fill="#171818" stroke={c.cream} strokeWidth="7"/>
 <circle cx={CX} cy={CY} r="26" fill={c.orange}/>
 </g></g></svg></AbsoluteFill>;
};
