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
const c={cream:'#FFF7E7',orange:'#FF6107',ink:'#101010'};
const ease=Easing.bezier(.16,1,.3,1),exitEase=Easing.bezier(.7,0,.84,0);
const p=(f:number,a:number,b:number,e=ease)=>f<=a?0:f>=b?1:interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const words={"BLACK": {"d": "M0 0V1760H477Q669 1760 756.5 1666.5Q844 1573 844 1358V1281Q844 1157 799.5 1080.0Q755 1003 664 979Q783 949 823.5 838.5Q864 728 864 569Q864 398 832.0 270.0Q800 142 716.0 71.0Q632 0 477 0ZM344 1097H416Q465 1097 479.0 1135.0Q493 1173 493 1226V1403Q493 1488 418 1488H344ZM379 310Q516 310 516 440V660Q516 735 493.5 778.5Q471 822 409 822H344V312Q366 310 379 310ZM1000 0V1760H1352V300H1714V0ZM1786 0 1956 1760H2553L2720 0H2387L2362 284H2150L2128 0ZM2175 565H2335L2258 1460H2242ZM3258 -16Q3067 -16 2950.5 103.0Q2834 222 2834 436V1248Q2834 1504 2935.5 1640.0Q3037 1776 3266 1776Q3391 1776 3488.5 1730.0Q3586 1684 3642.0 1592.5Q3698 1501 3698 1362V1058H3348V1318Q3348 1397 3328.0 1424.5Q3308 1452 3266 1452Q3217 1452 3200.0 1416.5Q3183 1381 3183 1322V441Q3183 368 3204.5 338.0Q3226 308 3266 308Q3311 308 3329.5 345.0Q3348 382 3348 441V758H3702V425Q3702 193 3585.0 88.5Q3468 -16 3258 -16ZM3839 0V1760H4187V1055L4351 1760H4705L4508 954L4746 0H4381L4189 852V0Z", "w": 4746}, "FRIDAY": {"d": "M0 0V1760H704V1417H354V1137H686V798H354V0ZM837 0V1760H1377Q1512 1760 1581.0 1698.5Q1650 1637 1673.5 1526.5Q1697 1416 1697 1267Q1697 1123 1660.5 1037.0Q1624 951 1523 918Q1606 901 1639.5 835.5Q1673 770 1673 666V0H1326V689Q1326 766 1294.5 784.5Q1263 803 1193 803V0ZM1195 1108H1280Q1353 1108 1353 1267Q1353 1370 1337.0 1402.0Q1321 1434 1277 1434H1195ZM1817 0V1760H2157V0ZM2317 0V1760H2801Q2991 1760 3087.0 1654.5Q3183 1549 3183 1346V522Q3183 272 3095.5 136.0Q3008 0 2789 0ZM2671 311H2732Q2829 311 2829 405V1313Q2829 1401 2805.5 1426.5Q2782 1452 2710 1452H2671ZM3299 0 3469 1760H4066L4233 0H3900L3875 284H3663L3641 0ZM3688 565H3848L3771 1460H3755ZM4574 0V579L4293 1760H4642L4740 1164L4838 1760H5186L4906 579V0Z", "w": 5186}};
const Word=({word,y}:{word:keyof typeof words;y:number})=><g transform={`translate(370 ${y}) scale(${940/words[word].w} ${-212/1760})`}><path d={words[word].d} fill={c.cream}/></g>;
const Screw=({x,y,r=19}:{x:number;y:number;r?:number})=><g transform={`translate(${x} ${y})`}><circle r={r} fill="#747675" stroke="#111" strokeWidth="3"/><path d={`M${-r*.42} ${-r*.42} L${r*.42} ${r*.42} M${r*.42} ${-r*.42} L${-r*.42} ${r*.42}`} stroke="#111" strokeWidth="6" strokeLinecap="round"/><path d={`M${-r*.7} ${-r*.35} A${r*.8} ${r*.8} 0 0 1 ${r*.6} ${-r*.6}`} fill="none" stroke="#BBB" strokeWidth="1.5"/></g>;
export const LockedBlackFridaySign:React.FC=()=>{
 const f=useCurrentFrame(),id=useId().replace(/:/g,'');
 const enter=p(f,8,38),leave=p(f,269,291,exitEase);
 const bar=p(f,47,62)*(1-p(f,248,260,exitEase));
 const pin=p(f,63,70)*(1-p(f,240,247,exitEase));
 const travel=1050*(1-enter)+1050*leave;
 const plate=(right:boolean)=>{
 const x=right?836:231,bolt=right?1398:272,accent=right?1382:265;
 return <g transform={`translate(${right?travel:-travel} 0)`}>
 <rect x={x} y="206" width="605" height="566" rx="29" fill={`url(#${id}-plate)`} />
 <path d={right?"M836 206 H1412 Q1441 206 1441 235 V743 Q1441 772 1412 772 H865 Q836 772 836 743":"M836 206 H260 Q231 206 231 235 V743 Q231 772 260 772 H807 Q836 772 836 743"} fill="none" stroke={c.cream} strokeWidth="6"/>
 <g clipPath={`url(#${id}-${right?'right':'left'})`}><Word word="BLACK" y={505}/><Word word="FRIDAY" y={734}/></g>
 <path d={`M${right?837:835} 207 V768`} stroke="#080808" strokeWidth="2"/>
 <rect x={accent} y="368" width="25" height="256" fill={c.orange}/>
 <Screw x={bolt} y={245}/><Screw x={bolt} y={735}/>
 <g transform={`translate(${right?965:630} 0)`}>
 <rect x="0" y="165" width="80" height="110" rx="9" fill="#050505"/>
 <rect x="0" y="159" width="80" height="110" rx="9" fill={c.orange} stroke="#FFAE64" strokeWidth="2"/>
 <Screw x={34} y={193} r={17}/><circle cx="34" cy="246" r="4" fill="#101010"/>
 </g>

 </g>;
 };
 return <AbsoluteFill style={{backgroundColor:'#000'}}><svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs>
 <linearGradient id={`${id}-plate`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#222323"/><stop offset="1" stopColor="#171818"/></linearGradient>
 <clipPath id={`${id}-left`}><rect x="231" y="206" width="605" height="566" rx="29"/></clipPath>
 <clipPath id={`${id}-right`}><rect x="836" y="206" width="605" height="566" rx="29"/></clipPath>
 <clipPath id={`${id}-bracket`}><rect x="620" y="157" width="433" height="122"/></clipPath>
 <clipPath id={`${id}-bar`}><rect x="698" y="185" width="278" height="67"/></clipPath>
 </defs>
 <g opacity={f<=7||f>=292?0:1}>
 {plate(false)}{plate(true)}
 {/* Narrow seam is independent of rounded outer plate edges. */}
 <g transform={`translate(${-travel} 0)`}>
 <g clipPath={`url(#${id}-bar)`}>
 <rect x="698" y="190" width="126" height="59" rx="5" fill="#0E0E0E"/>
 <g opacity={bar>0?1:0} clipPath={`url(#${id}-bar)`}>
 <g transform={`translate(${-280*(1-bar)} 0)`}>
 <rect x="702" y="191" width="270" height="54" rx="5" fill={c.orange} stroke="#B63B00" strokeWidth="4"/>
 <rect x="748" y="205" width="83" height="23" rx="5" fill="#080808" stroke="#FFAC61" strokeWidth="2"/>
 </g></g>
 <g opacity={pin>0?1:0} transform={`translate(${-132*(1-pin)} 0)`}>
 <rect x="818" y="185" width="40" height="65" rx="6" fill="#EE5703" stroke="#FFAC61" strokeWidth="2"/>
 <path d="M823 186 H852" stroke={c.cream} strokeWidth="4" strokeLinecap="round"/>
 </g>
 </g></g></g></svg></AbsoluteFill>;
};
