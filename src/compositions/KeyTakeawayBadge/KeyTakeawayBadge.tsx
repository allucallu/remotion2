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
const c={cream:'#FFF1D2',yellow:'#FFD51B',coral:'#FF6B61',ink:'#210849'};
const ease=Easing.bezier(.16,1,.3,1),exitEase=Easing.bezier(.7,0,.84,0);
const ramp=(f:number,a:number,b:number,e=ease)=>f<=a?0:f>=b?1:interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const words={"KEY": {"d": "M0.0 0 281.6 1760H629.6L516.8 1055L793.6 1760H1147.6L821.64 954L907.0 0H542.0L486.31999999999994 852L350.0 0ZM987.0 0 1268.6 1760H1972.6L1918.2 1420H1572.2L1517.32 1077H1849.32L1796.3600000000001 746H1464.3600000000001L1399.88 343H1768.88L1714.0 0ZM2063.0 0 2155.64 579 2063.6 1760H2412.6L2415.24 1164L2608.6 1760H2956.6L2487.64 579L2395.0 0Z", "w": 2956.6}, "TAKEAWAY": {"d": "M0.0 0 227.51999999999998 1422H18.52000000000001L72.60000000000002 1760H842.5999999999999L788.52 1422H579.52L352.0 0ZM631.0 0 1082.6 1760H1679.6L1565.0 0H1232.0L1252.44 284H1040.44L973.0 0ZM1110.4 565H1270.4L1336.6 1460H1320.6ZM1693.0 0 1974.6 1760H2322.6L2209.8 1055L2486.6 1760H2840.6L2514.64 954L2600.0 0H2235.0L2179.3199999999997 852L2043.0 0ZM2680.0 0 2961.6 1760H3665.6L3611.2 1420H3265.2L3210.3199999999997 1077H3542.3199999999997L3489.36 746H3157.36L3092.88 343H3461.88L3407.0 0ZM3495.0 0 3946.6 1760H4543.6L4429.0 0H4096.0L4116.4400000000005 284H3904.44L3837.0 0ZM3974.4 565H4134.4L4200.6 1460H4184.6ZM4695.0 0 4787.6 1760H5131.6L5050.84 649L5327.6 1760H5655.6L5571.84 649L5843.6 1760H6191.6L5718.0 0H5296.0L5343.52 847L5124.0 0ZM5987.0 0 6438.6 1760H7035.6L6921.0 0H6588.0L6608.4400000000005 284H6396.44L6329.0 0ZM6466.4 565H6626.4L6692.6 1460H6676.6ZM7262.0 0 7354.64 579 7262.6 1760H7611.6L7614.24 1164L7807.6 1760H8155.6L7686.64 579L7594.0 0Z", "w": 8155.6}};
const Word=({word,x,y,w,h,amount}:{word:keyof typeof words;x:number;y:number;w:number;h:number;amount:number})=><g opacity={amount} transform={`translate(${x} ${y+12*(1-amount)}) scale(${w/words[word].w} ${-h/1760})`}><path d={words[word].d} fill={c.cream}/></g>;
const panelShape='M605 305 H1302 Q1362 305 1354 365 L1318 652 Q1312 702 1260 702 H565 Q510 702 517 647 L551 358 Q557 305 605 305 Z';
const keyShape='M635 310 L914 211 Q950 198 963 232 L975 267 Q986 300 952 312 L905 329 L923 376 Q929 392 911 399 L876 411 Q858 418 851 399 L833 350 L804 361 L821 407 Q828 425 810 432 L775 444 Q757 450 750 431 L733 389 L657 416 C649 500 588 563 510 563 C422 563 350 495 350 411 C350 325 421 253 509 253 C561 253 607 275 635 310 Z';
export const KeyTakeawayBadge:React.FC=()=>{
 const f=useCurrentFrame();
 const panel=ramp(f,1,32),key=ramp(f,12,43);
 const panelOut=ramp(f,270,299,exitEase),keyOut=ramp(f,260,291,exitEase);
 const title=ramp(f,44,57)*(1-ramp(f,247,261,exitEase));
 const subtitle=ramp(f,50,65)*(1-ramp(f,240,255,exitEase));
 const accents=ramp(f,54,65)*(1-ramp(f,240,255,exitEase));
 const py=1100*(1-panel)+1100*panelOut;
 const kx=-1350*(1-key)-1350*keyOut;
 return <AbsoluteFill style={{backgroundColor:'#000'}}><svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs>
 <linearGradient id="kt-coral" x1="0" y1="0" x2=".2" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#FF6355"/><stop offset="1" stopColor="#FF514B"/></linearGradient>
 <linearGradient id="kt-gold" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#FFDF38"/><stop offset="1" stopColor="#FFD028"/></linearGradient>
 <clipPath id="kt-key"><path d={keyShape}/></clipPath>
 </defs>
 <g opacity={f<=0||f>=299?0:1}>
 <g transform={`translate(0 ${py})`}>
 <path d={panelShape} transform="translate(24 24)" fill="#29103F" stroke="#29103F" strokeWidth="24" strokeLinejoin="round"/>
 <path d={panelShape} fill="url(#kt-coral)" stroke={c.cream} strokeWidth="36" strokeLinejoin="round"/>
 <path d={panelShape} fill="none" stroke={c.ink} strokeWidth="20" strokeLinejoin="round"/>
 <Word word="KEY" x={941} y={506} w={363} h={156} amount={title}/>
 <Word word="TAKEAWAY" x={602} y={663} w={697} h={132} amount={subtitle}/>
 </g>
 <g transform={`translate(${kx} ${-55*(1-key)}) rotate(${-6*(1-key)} 510 411)`}>
 <path d={keyShape} fill="url(#kt-gold)" stroke={c.cream} strokeWidth="38" strokeLinejoin="round"/>
 <path d="M646 382 L980 258 L1004 412 L688 551 L420 584 C557 562 617 532 646 382 Z" fill="#F4AA18" opacity=".65" clipPath="url(#kt-key)"/>
 <path d={keyShape} fill="none" stroke={c.ink} strokeWidth="23" strokeLinejoin="round"/>
 <circle cx="478" cy="414" r="47" fill={c.ink}/>
 <path d="M397 407 C404 354 438 317 485 303" fill="none" stroke={c.cream} strokeWidth="19" strokeLinecap="round"/>
 <g stroke="#FFD335" strokeWidth="30" strokeLinecap="round" opacity={accents>0?1:0}>
 <line x1="380" y1="246" x2={380-24*accents} y2={246-42*accents}/>
 <line x1="336" y1="290" x2={336-51*accents} y2={290-21*accents}/>
 </g></g></g></svg></AbsoluteFill>;
};
