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
const c={black:"#000000",cream:"#FFF3D8",yellow:"#FFCE16",blue:"#205BC0",coral:"#F96960",ink:"#281047"};
const out=Easing.bezier(.16,1,.3,1),inn=Easing.bezier(.7,0,.84,0);
const p=(f:number,a:number,b:number,e=out)=>f<=a?0:f>=b?1:interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:"clamp",extrapolateRight:"clamp"});
const Shape:React.FC<{d:string;fill:string}>=({d,fill})=><g strokeLinejoin="round"><path d={d} fill={fill} stroke={c.cream} strokeWidth={36}/><path d={d} fill={fill} stroke={c.ink} strokeWidth={20}/></g>;
const WORDS={"DID YOU": "M0.0 16 387.2 1776H871.2Q1061.2 1776 1133.99 1670.5Q1206.78 1565 1162.12 1362L980.8399999999999 538Q925.84 288 808.4200000000001 152.0Q691.0 16 472.0 16ZM422.42 327H483.41999999999996Q580.42 327 601.1 421L800.86 1329Q820.22 1417 802.33 1442.5Q784.44 1468 712.44 1468H673.44ZM1012.0 16 1399.2 1776H1739.2L1352.0 16ZM1510.0 16 1897.2 1776H2381.2Q2571.2 1776 2643.99 1670.5Q2716.7799999999997 1565 2672.12 1362L2490.84 538Q2435.84 288 2318.42 152.0Q2201.0 16 1982.0 16ZM1932.42 327H1993.42Q2090.42 327 2111.1 421L2310.86 1329Q2330.2200000000003 1417 2312.33 1442.5Q2294.44 1468 2222.44 1468H2183.44ZM3249.0 16 3376.38 595 3355.2 1776H3704.2L3671.08 1180L3900.2 1776H4248.2L3708.38 595L3581.0 16ZM4384.48 0Q4173.48 0 4090.0299999999997 127.5Q4006.58 255 4059.6 496L4243.52 1332Q4293.24 1558 4429.48 1675.0Q4565.72 1792 4778.72 1792Q4991.72 1792 5076.48 1675.0Q5161.24 1558 5111.52 1332L4927.6 496Q4874.58 255 4735.03 127.5Q4595.48 0 4384.48 0ZM4458.76 324Q4538.76 324 4572.86 479L4761.84 1338Q4790.4400000000005 1468 4712.4400000000005 1468Q4624.4400000000005 1468 4595.18 1335L4406.42 477Q4388.38 395 4400.57 359.5Q4412.76 324 4458.76 324ZM5385.48 0Q5165.48 0 5088.65 123.5Q5011.82 247 5064.62 487L5348.2 1776H5690.2L5409.7 501Q5400.02 457 5396.110000000001 416.5Q5392.2 376 5404.48 350.0Q5416.76 324 5456.76 324Q5497.76 324 5521.37 349.5Q5544.98 375 5558.5 416.0Q5572.02 457 5581.7 501L5862.2 1776H6204.2L5920.62 487Q5867.82 247 5736.65 123.5Q5605.48 0 5385.48 0Z", "KNOW?": "M0.0 16 387.2 1776H735.2L580.1 1071L899.2 1776H1253.2L878.88 970L907.0 16H542.0L537.44 868L350.0 16ZM985.0 16 1372.2 1776H1734.2L1710.74 933L1896.2 1776H2236.2L1849.0 16H1505.0L1522.6 896L1329.0 16ZM2439.48 0Q2228.48 0 2145.0299999999997 127.5Q2061.58 255 2114.6 496L2298.52 1332Q2348.24 1558 2484.48 1675.0Q2620.7200000000003 1792 2833.7200000000003 1792Q3046.7200000000003 1792 3131.48 1675.0Q3216.24 1558 3166.52 1332L2982.6 496Q2929.58 255 2790.0299999999997 127.5Q2650.48 0 2439.48 0ZM2513.76 324Q2593.76 324 2627.86 479L2816.84 1338Q2845.44 1468 2767.44 1468Q2679.44 1468 2650.1800000000003 1335L2461.42 477Q2443.38 395 2455.57 359.5Q2467.76 324 2513.76 324ZM3175.0 16 3373.2 1776H3717.2L3569.7799999999997 665L3913.2 1776H4241.2L4090.7799999999997 665L4429.2 1776H4777.2L4198.0 16H3776.0L3874.34 863L3604.0 16ZM4662.1 471 4753.62 887Q4878.62 887 4970.98 900.0Q5063.34 913 5130.08 955.0Q5196.82 997 5243.02 1082.0Q5289.22 1167 5320.68 1310Q5334.98 1375 5329.26 1424.0Q5323.54 1473 5263.54 1473Q5220.54 1473 5194.49 1445.5Q5168.4400000000005 1418 5153.59 1375.5Q5138.74 1333 5128.62 1287L5096.5 1141H4730.5L4786.38 1395Q4830.82 1597 4980.77 1694.5Q5130.72 1792 5333.72 1792Q5511.72 1792 5600.139999999999 1728.0Q5688.5599999999995 1664 5705.11 1541.5Q5721.66 1419 5682.72 1242Q5644.66 1069 5558.24 933.0Q5471.82 797 5339.66 719.0Q5207.5 641 5032.5 641L4995.1 471ZM4551.22 17 4616.78 315H4974.78L4909.22 17Z"};
const Word:React.FC<{value:"DID YOU"|"KNOW?";amount:number}>=({value,amount})=>{
 const first=value==="DID YOU",x=first?728:701,y=first?326:522,w=first?567:591,h=first?158:175;
 const nw=first?6204.2:5710.046069562083,nh=first?1792:1792,id=first?"knowledge-line-a":"knowledge-line-b";
 return <g transform={`rotate(-7 ${x+w/2} ${y+h/2})`}>
 <defs><clipPath id={id}><rect x={x-25} y={y-25} width={(w+60)*amount} height={h+60}/></clipPath></defs>
 <g clipPath={`url(#${id})`} transform={`translate(${14*(1-amount)} 0)`}><path d={WORDS[value]} fill={c.cream} transform={`translate(${x} ${y+h}) scale(${w/nw} ${-h/nh})`}/></g>
 </g>;
};
const panel="M465 325 L1280 230 Q1340 219 1343 285 L1310 651 Q1307 688 1260 696 L550 786 Q495 791 490 739 Z";
const bulb="M430 663 C413 621 381 607 350 576 C250 490 248 365 329 286 C392 222 490 207 569 233 C684 269 732 383 684 489 C661 545 620 578 612 646 Z";
const filamentPaths=["M500 654 L477 531 C440 531 406 515 408 480 C410 445 448 444 465 476 C475 493 477 514 477 531 L539 521", "M548 649 L535 521 C535 487 543 446 574 442 C612 437 620 477 591 501 C575 514 551 520 535 521"];
const filamentLengths=[424.583, 373.314];
// Three equal rays, mirrored around the bulb's vertical axis.
const rayPositions=[{x:500,y:155,angle:0},{x:406,y:185,angle:-38},{x:594,y:185,angle:38}];
const Ray:React.FC<{x:number;y:number;angle:number;amount:number}>=({x,y,angle,amount})=><g opacity={amount>0?1:0} transform={`translate(${x} ${y}) rotate(${angle})`} strokeLinecap="round">
 <line x1={0} y1={0} x2={0} y2={-60*amount} stroke={c.cream} strokeWidth={44}/>
 <line x1={0} y1={0} x2={0} y2={-60*amount} stroke={c.ink} strokeWidth={30}/>
 <line x1={0} y1={0} x2={0} y2={-60*amount} stroke={c.cream} strokeWidth={14}/>
</g>;

export const DidYouKnowBadge:React.FC=()=>{
 const f=useCurrentFrame(),enter=p(f,1,29),exit=p(f,260,299,inn);
 const y=1120*(1-enter)+1120*exit;
 const first=p(f,25,44)*(1-p(f,248,259,inn));
 const second=p(f,30,49)*(1-p(f,240,252,inn));
 const filament=p(f,34,54)*(1-p(f,244,259,inn));
 const rays=[p(f,40,50),p(f,43,53),p(f,46,56)].map(a=>a*(1-p(f,240,252,inn)));
 return <AbsoluteFill style={{backgroundColor:c.black}}><svg width="100%" height="100%" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
 <defs>
 <linearGradient id="knowledge-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#286ACB"/><stop offset="1" stopColor="#2056B8"/></linearGradient>
 <linearGradient id="knowledge-yellow" x1="0" y1="0" x2=".9" y2="1"><stop offset="0" stopColor="#FFE23D"/><stop offset="1" stopColor="#FFC300"/></linearGradient>
 <clipPath id="knowledge-bulb-inner"><path d={bulb}/></clipPath>
 </defs>
 {/* Panels stay solid and travel together: no layered opacity fades or shape clipping. */}
 <g opacity={f<=0||f>=299?0:1} transform={`translate(0 ${y})`}>
 <g transform={`translate(${29+10*(1-enter)} ${35+8*(1-enter)})`}><Shape d={panel} fill={c.coral}/></g>
 <Shape d={panel} fill="url(#knowledge-blue)"/>
 <Word value="DID YOU" amount={first}/><Word value="KNOW?" amount={second}/>
 <Shape d={bulb} fill="url(#knowledge-yellow)"/>
 <g clipPath="url(#knowledge-bulb-inner)">
 <path d="M354 385 Q363 339 415 312" fill="none" stroke={c.cream} strokeWidth={33} strokeLinecap="round"/>
 {filamentPaths.map((d,i)=><path key={i} d={d} fill="none" stroke={c.cream} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" opacity={filament>0?1:0} strokeDasharray={`${filamentLengths[i]} ${filamentLengths[i]}`} strokeDashoffset={filamentLengths[i]*(1-filament)}/>)}
 </g>
 <Shape d="M461 772 L611 754 Q600 807 545 815 Q493 819 461 772 Z" fill="url(#knowledge-blue)"/>
 <Shape d="M448 719 L600 698 Q631 695 634 721 Q637 747 609 752 L463 777 Q434 780 431 754 Q428 729 448 719 Z" fill="url(#knowledge-blue)"/>
 <Shape d="M446 660 L603 638 Q633 635 636 663 Q639 690 610 695 L457 718 Q430 722 424 697 Q419 670 446 660 Z" fill="url(#knowledge-blue)"/>
 {rayPositions.map((ray,i)=><Ray key={i} {...ray} amount={rays[i]}/>)}
 </g></svg></AbsoluteFill>;
};
