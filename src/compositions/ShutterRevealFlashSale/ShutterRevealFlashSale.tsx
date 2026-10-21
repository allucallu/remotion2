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
const c={cream:'#FFF7E7',orange:'#FF6107',dark:'#121617',steel:'#686E6D'};
const ease=Easing.bezier(.16,1,.3,1),exitEase=Easing.bezier(.7,0,.84,0);
const p=(f:number,a:number,b:number,e=ease)=>f<=a?0:f>=b?1:interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const words={"FLASH": {"d": "M0 0V1760H704V1417H354V1137H686V798H354V0ZM837 0V1760H1189V300H1551V0ZM1623 0 1793 1760H2390L2557 0H2224L2199 284H1987L1965 0ZM2012 565H2172L2095 1460H2079ZM3103 -16Q2862 -16 2755.5 104.0Q2649 224 2649 486V658H2997V438Q2997 377 3015.5 342.5Q3034 308 3080 308Q3128 308 3146.5 336.0Q3165 364 3165 428Q3165 509 3149.0 563.5Q3133 618 3093.5 667.5Q3054 717 2984 783L2826 933Q2649 1100 2649 1315Q2649 1540 2753.5 1658.0Q2858 1776 3056 1776Q3298 1776 3399.5 1647.0Q3501 1518 3501 1255H3143V1376Q3143 1412 3122.5 1432.0Q3102 1452 3067 1452Q3025 1452 3005.5 1428.5Q2986 1405 2986 1368Q2986 1331 3006.0 1288.0Q3026 1245 3085 1189L3288 994Q3349 936 3400.0 871.5Q3451 807 3482.0 721.5Q3513 636 3513 513Q3513 265 3421.5 124.5Q3330 -16 3103 -16ZM3650 0V1760H4000V1131H4166V1760H4516V0H4166V798H4000V0Z", "w": 4516}, "SALE": {"d": "M454 -16Q213 -16 106.5 104.0Q0 224 0 486V658H348V438Q348 377 366.5 342.5Q385 308 431 308Q479 308 497.5 336.0Q516 364 516 428Q516 509 500.0 563.5Q484 618 444.5 667.5Q405 717 335 783L177 933Q0 1100 0 1315Q0 1540 104.5 1658.0Q209 1776 407 1776Q649 1776 750.5 1647.0Q852 1518 852 1255H494V1376Q494 1412 473.5 1432.0Q453 1452 418 1452Q376 1452 356.5 1428.5Q337 1405 337 1368Q337 1331 357.0 1288.0Q377 1245 436 1189L639 994Q700 936 751.0 871.5Q802 807 833.0 721.5Q864 636 864 513Q864 265 772.5 124.5Q681 -16 454 -16ZM953 0 1123 1760H1720L1887 0H1554L1529 284H1317L1295 0ZM1342 565H1502L1425 1460H1409ZM2015 0V1760H2367V300H2729V0ZM2849 0V1760H3553V1420H3207V1077H3539V746H3207V343H3576V0Z", "w": 3576}};
const Word=({word,x,y,w,h}:{word:keyof typeof words;x:number;y:number;w:number;h:number})=><g transform={`translate(${x} ${y}) scale(${w/words[word].w} ${-h/1760})`}><path d={words[word].d} fill="#111515"/></g>;
const Bolt=({x,y,r=7}:{x:number;y:number;r?:number})=><g transform={`translate(${x} ${y})`}><circle r={r} fill={c.steel} stroke="#0A0C0C" strokeWidth="2"/><path d={`M${-r*.4} ${-r*.4} L${r*.4} ${r*.4} M${r*.4} ${-r*.4} L${-r*.4} ${r*.4}`} stroke="#111" strokeWidth="2"/></g>;
export const ShutterRevealFlashSale:React.FC=()=>{
 const f=useCurrentFrame(),id=useId().replace(/:/g,'');
 const enter=p(f,8,31),leave=p(f,278,291,exitEase),y=1000*(1-enter)+1000*leave;
 const opened=p(f,40,69)*(1-p(f,240,270));
 const release=p(f,32,39)*(1-p(f,271,277,exitEase));
 const leaf=(right:boolean)=><g transform={right?`translate(${1672+450*opened} 0) scale(-1 1)`:`translate(${-450*opened} 0)`}>
 {/* One rigid leaf, including slots and its inner-edge bracket. */}
 <rect x="136" y="230" width="701" height="475" fill={`url(#${id}-leaf)`} stroke="#080B0B" strokeWidth="5"/>
 {[369,551].map(sy=><g key={sy}><rect x="622" y={sy} width="175" height="13" rx="1" fill="#080B0B" stroke="#0C1010" strokeWidth="2"/><path d={`M623 ${sy+14} H796`} stroke="#495050" strokeWidth="2"/></g>)}
 <rect x="813" y="419" width="25" height="94" rx="2" fill={c.cream} stroke="#111" strokeWidth="3"/>
 <Bolt x={825} y={435} r={6}/><Bolt x={825} y={498} r={6}/>
 </g>;
 return <AbsoluteFill style={{backgroundColor:'#000'}}><svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs>
 <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#242A2B"/><stop offset="1" stopColor="#191E1F"/></linearGradient>
 <clipPath id={`${id}-viewport`}><rect x="136" y="230" width="1400" height="475"/></clipPath>
 </defs>
 <g opacity={f<=7||f>=292?0:1} transform={`translate(0 ${y})`}>
 <rect x="130" y="209" width="1412" height="523" fill="#121617" stroke={c.cream} strokeWidth="8"/>
 <rect x="385" y="241" width="905" height="464" fill={c.orange} stroke="#B83C00" strokeWidth="6"/>
 <Word word="FLASH" x={518} y={470} w={640} h={201}/>
 <Word word="SALE" x={584} y={687} w={514} h={200}/>
 <g clipPath={`url(#${id}-viewport)`}>{leaf(false)}{leaf(true)}</g>
 {/* Foreground rail lips hide all portions inside the housings. */}
 {[224,710].map(ry=><g key={ry}><rect x="143" y={ry-6} width="1387" height="15" fill="#0B0E0E"/><path d={`M145 ${ry} H1528`} stroke="#69706F" strokeWidth="4"/><path d={`M145 ${ry+5} H1528`} stroke="#2D3232" strokeWidth="3"/></g>)}
 <path d="M139 230 V704 M1533 230 V704" stroke={c.cream} strokeWidth="9"/>
 {[{x:363,y:224},{x:1292,y:224},{x:363,y:702},{x:1292,y:702}].map(({x,y:gy})=><rect key={`${x}-${gy}`} x={x} y={gy-5*release} width="20" height="18" fill={c.steel} stroke="#0A0D0D" strokeWidth="2"/>)}
 {[{x:127,y:206},{x:1518,y:206},{x:127,y:707},{x:1518,y:707}].map(({x,y:by})=><g key={`${x}-${by}`}><rect x={x} y={by} width="28" height="28" fill={c.cream}/><Bolt x={x+14} y={by+14}/></g>)}
 </g></svg></AbsoluteFill>;
};
