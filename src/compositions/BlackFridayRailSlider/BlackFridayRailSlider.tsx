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
const Word=({word,x,y,w,h}:{word:keyof typeof words;x:number;y:number;w:number;h:number})=><g transform={`translate(${x} ${y}) scale(${w/words[word].w} ${-h/1760})`}><path d={words[word].d} fill={c.cream}/></g>;
export const BlackFridayRailSlider:React.FC=()=>{
 const f=useCurrentFrame(),id=useId().replace(/:/g,'');
 const rail=p(f,8,24)*(1-p(f,282,291,exitEase));
 const leftStop=p(f,16,23)*(1-p(f,273,281,exitEase));
 const rightStop=p(f,24,28)*(1-p(f,273,281,exitEase));
 const enter=p(f,25,56),settle=p(f,56,64),leave=p(f,240,272,exitEase);
 // Arrive eight design pixels past the final position, then settle once.
 const x=-1480*(1-enter)+8*enter*(1-settle)-1480*leave;
 const stop=(right:boolean,y:number)=>{
 const a=right?rightStop:leftStop;
 return <rect x={(right?1483:129)+(right?20:-20)*(1-a)} y={y} width="61" height="45" rx="2" fill={c.orange} stroke={c.cream} strokeWidth="1.6" opacity={a}/>;
 };
 return <AbsoluteFill style={{backgroundColor:'#000'}}><svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs><linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#222323"/><stop offset="1" stopColor="#171818"/></linearGradient></defs>
 <g opacity={f<=7||f>=292?0:1}>
 {/* Each rail grows from a fixed left anchor; stroke thickness stays constant. */}
 <g opacity={rail>0?1:0}>
 {[251,652].map(y=><rect key={y} x="159" y={y} width={1355*rail} height="35" fill="#1C1D1D" stroke={c.cream} strokeWidth="3"/>)}
 </g>
 <g opacity={f>=25&&f<273?1:0} transform={`translate(${x} 0)`}>
 <path d="M270 273 H1404 Q1414 273 1414 283 V583 L1345 662 Q1342 666 1336 666 H269 Q259 666 259 656 V283 Q259 273 270 273 Z" fill={`url(#${id}-face)`} stroke={c.cream} strokeWidth="3" strokeLinejoin="round"/>
 <Word word="BLACK" x={516} y={465} w={650} h={166}/>
 <Word word="FRIDAY" x={501} y={640} w={684} h={162}/>
 <rect x="1370" y="295" width="32" height="268" rx="13" fill={c.orange}/>
 </g>
 {stop(false,245)}{stop(true,245)}{stop(false,646)}{stop(true,646)}
 </g></svg></AbsoluteFill>;
};
