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
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
// 3840 × 2160, 30 fps, 300 frames. Artwork coordinates match the reference.
const c={cream:'#FFF3D6',ink:'#21082F',blue:'#304DFF',coral:'#FF7063',yellow:'#FFD044'};
const ease=Easing.bezier(.16,1,.3,1),exitEase=Easing.bezier(.7,0,.84,0);
const progress=(f:number,a:number,b:number,e=ease)=>f<=a?0:f>=b?1:interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const words={"FACT": {"d": "M0.0 0 352.0 1760H1056.0L987.4000000000001 1417H637.4000000000001L581.4 1137H913.4L845.6 798H513.6L354.0 0ZM789.0 0 1311.0 1760H1908.0L1723.0 0H1390.0L1421.8 284H1209.8L1131.0 0ZM1291.0 565H1451.0L1553.0 1460H1537.0ZM2257.8 -16Q2066.8 -16 1974.1000000000001 103.0Q1881.4 222 1924.2 436L2086.6 1248Q2137.8 1504 2266.5 1640.0Q2395.2 1776 2624.2 1776Q2749.2 1776 2837.5 1730.0Q2925.8 1684 2963.5 1592.5Q3001.2 1501 2973.4 1362L2912.6 1058H2562.6L2614.6 1318Q2630.4 1397 2615.9 1424.5Q2601.4 1452 2559.4 1452Q2510.4 1452 2486.3 1416.5Q2462.2 1381 2450.4 1322L2274.2 441Q2259.6 368 2275.1 338.0Q2290.6 308 2330.6 308Q2375.6 308 2401.5 345.0Q2427.4 382 2439.2 441L2502.6 758H2856.6L2790.0 425Q2743.6 193 2605.7 88.5Q2467.8 -16 2257.8 -16ZM2993.0 0 3277.4 1422H3068.4L3136.0 1760H3906.0L3838.4 1422H3629.4L3345.0 0Z", "w": 3906.0}, "CHECK": {"d": "M347.1191143911439 -16Q156.1191143911439 -16 63.41911439114391 103.0Q-29.280885608856096 222 13.519114391143887 436L175.91911439114392 1248Q227.1191143911439 1504 355.8191143911439 1640.0Q484.51911439114394 1776 713.519114391144 1776Q838.519114391144 1776 926.8191143911439 1730.0Q1015.1191143911439 1684 1052.8191143911438 1592.5Q1090.5191143911438 1501 1062.719114391144 1362L1001.9191143911438 1058H651.9191143911439L703.9191143911439 1318Q719.719114391144 1397 705.219114391144 1424.5Q690.719114391144 1452 648.719114391144 1452Q599.719114391144 1452 575.619114391144 1416.5Q551.519114391144 1381 539.719114391144 1322L363.5191143911439 441Q348.9191143911439 368 364.4191143911439 338.0Q379.9191143911439 308 419.9191143911439 308Q464.9191143911439 308 490.8191143911439 345.0Q516.7191143911439 382 528.519114391144 441L591.9191143911439 758H945.9191143911438L879.3191143911439 425Q832.9191143911439 193 695.0191143911438 88.5Q557.1191143911439 -16 347.1191143911439 -16ZM931.3191143911439 0 1283.319114391144 1760H1633.319114391144L1507.5191143911438 1131H1673.5191143911438L1799.319114391144 1760H2149.319114391144L1797.319114391144 0H1447.319114391144L1606.919114391144 798H1440.919114391144L1281.319114391144 0ZM1973.319114391144 0 2325.319114391144 1760H3029.319114391144L2961.319114391144 1420H2615.319114391144L2546.719114391144 1077H2878.719114391144L2812.5191143911443 746H2480.5191143911443L2399.919114391144 343H2768.919114391144L2700.319114391144 0ZM3243.119114391144 -16Q3052.119114391144 -16 2959.419114391144 103.0Q2866.719114391144 222 2909.519114391144 436L3071.919114391144 1248Q3123.119114391144 1504 3251.8191143911445 1640.0Q3380.5191143911443 1776 3609.5191143911443 1776Q3734.5191143911443 1776 3822.819114391144 1730.0Q3911.1191143911437 1684 3948.819114391144 1592.5Q3986.5191143911443 1501 3958.719114391144 1362L3897.919114391144 1058H3547.919114391144L3599.919114391144 1318Q3615.719114391144 1397 3601.219114391144 1424.5Q3586.719114391144 1452 3544.719114391144 1452Q3495.719114391144 1452 3471.619114391144 1416.5Q3447.5191143911443 1381 3435.719114391144 1322L3259.519114391144 441Q3244.919114391144 368 3260.419114391144 338.0Q3275.919114391144 308 3315.919114391144 308Q3360.919114391144 308 3386.819114391144 345.0Q3412.719114391144 382 3424.5191143911443 441L3487.919114391144 758H3841.919114391144L3775.319114391144 425Q3728.919114391144 193 3591.019114391144 88.5Q3453.1191143911437 -16 3243.119114391144 -16ZM3827.319114391144 0 4179.3191143911445 1760H4527.3191143911445L4386.3191143911445 1055L4691.3191143911445 1760H5045.3191143911445L4687.119114391144 954L4734.3191143911445 0H4369.3191143911445L4347.719114391144 852L4177.3191143911445 0Z", "w": 5045.319114391144}};
const Word=({word,baseline,amount,height}:{word:keyof typeof words;baseline:number;amount:number;height:number})=>{
 const s=height/1760,w=words[word].w*s;
 return <g opacity={amount>0?1:0} transform={`translate(${1060-w/2} ${baseline+18*(1-amount)}) scale(${s} ${-s})`}><path d={words[word].d} fill={c.ink}/></g>;
};
export const FactCheckBadge:React.FC=()=>{
 const f=useCurrentFrame();
 const panel=progress(f,1,31),glass=progress(f,12,42),leave=progress(f,260,299,exitEase);
 const scan=progress(f,35,42)*(1-progress(f,42,50));
 const tick=progress(f,43,62)*(1-progress(f,246,260,exitEase));
 const a=progress(f,45,55)*(1-progress(f,247,260,exitEase));
 const b=progress(f,50,62)*(1-progress(f,242,257,exitEase));
 const rays=progress(f,52,65)*(1-progress(f,242,255,exitEase));
 const px=1770*(1-panel)+1770*leave;
 const gx=-920*(1-glass)-920*leave+12*scan;
 const tickLength=Math.hypot(52,52)+Math.hypot(116,-130);
 const handle='M440 517 L307 633 Q284 656 307 681 L333 707 Q357 730 381 706 L504 584 Z';
 return <AbsoluteFill style={{backgroundColor:'#000'}}>
 <svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs><clipPath id="fact-lens"><circle cx="609" cy="433" r="158"/></clipPath></defs>
 <g opacity={f<=0||f>=299?0:1}>
 <g transform={`translate(${px} 0)`}>
 {/* Both layers remain complete opaque shapes during entry. */}
 <rect x="618" y="296" width="770" height="404" rx="62" fill={c.blue} stroke={c.cream} strokeWidth="32"/>
 <rect x="618" y="296" width="770" height="404" rx="62" fill="none" stroke={c.ink} strokeWidth="14"/>
 <path d="M687 265 H1300 Q1358 265 1351 325 L1326 599 Q1322 653 1270 653 H662 Q610 653 615 601 L640 319 Q644 265 687 265 Z" fill={c.cream} stroke={c.cream} strokeWidth="32" strokeLinejoin="round"/>
 <path d="M687 265 H1300 Q1358 265 1351 325 L1326 599 Q1322 653 1270 653 H662 Q610 653 615 601 L640 319 Q644 265 687 265 Z" fill="none" stroke={c.ink} strokeWidth="15" strokeLinejoin="round"/>
 <Word word="FACT" baseline={465} height={156} amount={a}/>
 <Word word="CHECK" baseline={614} height={132} amount={b}/>
 </g>
 <g transform={`translate(${gx} 0) rotate(${-8*(1-glass)} 609 433)`}>
 <path d={handle} fill={c.coral} stroke={c.cream} strokeWidth="38" strokeLinejoin="round"/>
 <path d={handle} fill="none" stroke={c.ink} strokeWidth="18" strokeLinejoin="round"/>
 <path d="M337 656 L411 590" fill="none" stroke="#FFC0A3" strokeWidth="14" strokeLinecap="round"/>
 <circle cx="609" cy="433" r="211" fill={c.blue} stroke={c.cream} strokeWidth="31"/>
 <circle cx="609" cy="433" r="211" fill="none" stroke={c.ink} strokeWidth="15"/>
 <circle cx="609" cy="433" r="158" fill="#000"/>
 <g clipPath="url(#fact-lens)" opacity={tick>0?1:0}>
 <path d="M529 444 L581 496 L697 366" fill="none" stroke={c.cream} strokeWidth="51" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={tickLength} strokeDashoffset={tickLength*(1-tick)}/>
 </g>
 {/* Emphasis bars grow from fixed anchors; no stray round-cap dots. */}
 <g opacity={rays>0?1:0} stroke={c.yellow} strokeWidth="31" strokeLinecap="round">
 <line x1="423" y1="269" x2={423-31*rays} y2={269-44*rays}/>
 <line x1="385" y1="318" x2={385-49*rays} y2={318-29*rays}/>
 </g>
 </g></g></svg></AbsoluteFill>;
};
