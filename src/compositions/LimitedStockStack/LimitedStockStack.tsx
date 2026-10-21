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
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const colors = {
  black: "#000000",
  cream: "#FFF1D2",
  yellow: "#FFD21A",
  yellowSide: "#FFDE00",
  orange: "#FF7908",
  orangeSide: "#D95405",
  pink: "#F30578",
  pinkSide: "#B90061",
  purple: "#5B1697",
  ink: "#26064F",
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const ramp = (frame: number, start: number, end: number, easing = easeOut) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Outline: React.FC<{ d: string; fill: string; width?: number }> = ({
  d,
  fill,
  width = 13,
}) => (
  <path
    d={d}
    fill={fill}
    stroke={colors.cream}
    strokeWidth={width + 12}
    strokeLinejoin="round"
    strokeLinecap="round"
  />
);

const InkLine: React.FC<{ d: string; width?: number }> = ({
  d,
  width = 13,
}) => (
  <path
    d={d}
    fill="none"
    stroke={colors.ink}
    strokeWidth={width}
    strokeLinejoin="round"
    strokeLinecap="round"
  />
);

type Point = readonly [number, number];
const poly = (points: readonly Point[]) => points.map((p,i)=>`${i?"L":"M"} ${p[0]} ${p[1]}`).join(" ")+" Z";
const Box: React.FC<{x:number;y:number;top:readonly Point[];depth:number;fill:string;side:string}> = ({x,y,top,depth,fill,side}) => {
 const [a,b,c,d]=top;
 const down=(p:Point):Point=>[p[0],p[1]+depth];
 const ad=down(a),cd=down(c),dd=down(d);
 const outer=poly([a,b,c,cd,dd,ad]);
 const lerp=(p:Point,q:Point,t:number):Point=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
 // Tape traverses the top and continues onto the same face without a gap.
 const t1=lerp(a,b,.55),t2=lerp(a,b,.69),t3=lerp(d,c,.69),t4=lerp(d,c,.55);
 const lower=(p:Point):Point=>[p[0],p[1]+depth*.42];
 return <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
  <path d={outer} fill={fill} stroke={colors.cream} strokeWidth={25}/>
  <path d={poly([a,d,dd,ad])} fill={fill}/>
  <path d={poly([d,c,cd,dd])} fill={side}/>
  <path d={poly(top)} fill={fill}/>
  <path d={poly([t1,t2,t3,t4])} fill={colors.ink}/>
  <path d={poly([t4,t3,lower(t3),lower(t4)])} fill={colors.ink}/>
  <path d={outer} fill="none" stroke={colors.ink} strokeWidth={13}/>
  <path d={`M${a[0]} ${a[1]} L${d[0]} ${d[1]} L${c[0]} ${c[1]} M${d[0]} ${d[1]} L${dd[0]} ${dd[1]}`} fill="none" stroke={colors.ink} strokeWidth={13}/>
 </g>;
};
const FrontBox: React.FC<{y:number}> = ({y}) => <Box x={0} y={y} top={[[200,460],[430,380],[665,432],[415,520]]} depth={260} fill={colors.yellow} side={colors.yellowSide}/>;
const OrangeBox: React.FC<{x:number;y:number}> = ({x,y}) => <Box x={x} y={y} top={[[120,340],[300,285],[415,323],[225,377]]} depth={158} fill={colors.orange} side={colors.orangeSide}/>;
const PinkBox: React.FC<{x:number;y:number}> = ({x,y}) => <Box x={x} y={y} top={[[365,257],[500,207],[715,245],[565,303]]} depth={137} fill={colors.pink} side={colors.pinkSide}/>;

const PanelShape: React.FC<{ fill: string; offsetY?: number }> = ({
  fill,
  offsetY = 0,
}) => (
  <g transform={`translate(0 ${offsetY})`}>
    <Outline
      d="M 640 315 L 1497 200 L 1487 671 L 481 774 Z"
      fill={fill}
      width={10}
    />
    <InkLine
      d="M 640 315 L 1497 200 L 1487 671 L 481 774 Z"
      width={10}
    />
  </g>
);

const YellowBacking: React.FC = () => (
  <g aria-label="yellow panel backing">
    <Outline
      d="M 680 365 L 1543 300 L 1408 730 L 480 784 Z"
      fill={colors.yellow}
      width={10}
    />
    <InkLine d="M 680 365 L 1543 300 L 1408 730 L 480 784 Z" width={10} />
  </g>
);

// Embedded outlines avoid machine-dependent Impact substitution.
const WORDS = {"LIMITED": "M0.0 0 316.8 1760H668.8L406.0 300H768.0L714.0 0ZM813.0 0 1129.8 1760H1469.8L1153.0 0ZM1308.0 0 1624.8 1760H2160.8L2115.66 687L2455.8 1760H2996.8L2680.0 0H2358.0L2586.24 1268L2156.0 0H1840.0L1854.24 1268L1626.0 0ZM2835.0 0 3151.8 1760H3491.8L3175.0 0ZM3481.0 0 3736.96 1422H3527.96L3588.8 1760H4358.8L4297.96 1422H4088.96L3833.0 0ZM4155.0 0 4471.8 1760H5175.8L5114.6 1420H4768.6L4706.86 1077H5038.86L4979.28 746H4647.28L4574.74 343H4943.74L4882.0 0ZM5013.0 0 5329.8 1760H5813.8Q6003.8 1760 6080.8099999999995 1654.5Q6157.82 1549 6121.28 1346L5972.96 522Q5927.96 272 5815.98 136.0Q5704.0 0 5485.0 0ZM5422.98 311H5483.98Q5580.98 311 5597.9 405L5761.34 1313Q5777.18 1401 5758.27 1426.5Q5739.36 1452 5667.36 1452H5628.36Z", "STOCK": "M380.4813266696956 0Q139.4813266696956 0 54.58132666969559 120.0Q-30.318673330304406 240 16.84132666969559 502L47.8013266696956 674H395.8013266696956L356.2013266696956 454Q345.2213266696956 393 357.51132666969556 358.5Q369.8013266696956 324 415.80132666969564 324Q463.80132666969564 324 487.3413266696956 352.0Q510.88132666969557 380 522.4013266696955 444Q536.9813266696956 525 530.7913266696955 579.5Q524.6013266696956 634 494.01132666969556 683.5Q463.42132666969553 733 405.30132666969564 799L274.3013266696956 949Q127.3613266696956 1116 166.06132666969557 1331Q206.56132666969557 1556 332.30132666969564 1674.0Q458.04132666969565 1792 656.0413266696956 1792Q898.0413266696956 1792 976.3213266696957 1663.0Q1054.6013266696957 1534 1007.2613266696957 1271H649.2613266696956L671.0413266696955 1392Q677.5213266696956 1428 660.6213266696956 1448.0Q643.7213266696956 1468 608.7213266696956 1468Q566.7213266696956 1468 542.9913266696956 1444.5Q519.2613266696956 1421 512.6013266696956 1384Q505.9413266696955 1347 518.2013266696956 1304.0Q530.4613266696956 1261 579.3813266696956 1205L747.2813266696955 1010Q797.8413266696956 952 837.2313266696956 887.5Q876.6213266696956 823 892.2313266696956 737.5Q907.8413266696956 652 885.7013266696956 529Q841.0613266696956 281 724.2713266696956 140.5Q607.4813266696956 0 380.4813266696956 0ZM1076.3613266696957 16 1332.3213266696955 1438H1123.3213266696955L1184.1613266696957 1776H1954.1613266696954L1893.3213266696957 1438H1684.3213266696957L1428.3613266696957 16ZM2167.4813266696956 0Q1956.4813266696956 0 1867.9313266696956 127.5Q1779.3813266696957 255 1822.7613266696958 496L1973.2413266696958 1332Q2013.9213266696956 1558 2145.4813266696956 1675.0Q2277.041326669696 1792 2490.041326669696 1792Q2703.041326669696 1792 2792.4813266696956 1675.0Q2881.9213266696956 1558 2841.241326669696 1332L2690.761326669696 496Q2647.3813266696957 255 2512.9313266696954 127.5Q2378.4813266696956 0 2167.4813266696956 0ZM2228.8013266696958 324Q2308.8013266696958 324 2336.701326669696 479L2491.3213266696957 1338Q2514.721326669696 1468 2436.721326669696 1468Q2348.721326669696 1468 2324.7813266696958 1335L2170.3413266696957 477Q2155.581326669696 395 2169.1913266696956 359.5Q2182.8013266696958 324 2228.8013266696958 324ZM3168.4813266696956 0Q2977.4813266696956 0 2882.4013266696957 119.0Q2787.3213266696957 238 2825.8413266696957 452L2972.0013266696956 1264Q3018.0813266696955 1520 3144.0613266696955 1656.0Q3270.041326669696 1792 3499.041326669696 1792Q3624.041326669696 1792 3713.261326669696 1746.0Q3802.4813266696956 1700 3842.011326669696 1608.5Q3881.541326669696 1517 3856.5213266696956 1378L3801.8013266696958 1074H3451.8013266696958L3498.6013266696955 1334Q3512.8213266696957 1413 3497.7713266696956 1440.5Q3482.721326669696 1468 3440.721326669696 1468Q3391.721326669696 1468 3368.331326669696 1432.5Q3344.9413266696956 1397 3334.3213266696957 1338L3175.741326669696 457Q3162.6013266696955 384 3178.701326669696 354.0Q3194.8013266696958 324 3234.8013266696958 324Q3279.8013266696958 324 3304.961326669696 361.0Q3330.121326669696 398 3340.741326669696 457L3397.8013266696958 774H3751.8013266696958L3691.8613266696957 441Q3650.1013266696955 209 3514.2913266696955 104.5Q3378.4813266696956 0 3168.4813266696956 0ZM3747.3613266696957 16 4064.161326669696 1776H4412.161326669696L4285.261326669695 1071L4576.161326669696 1776H4930.161326669696L4588.081326669696 970L4654.361326669696 16H4289.361326669696L4250.721326669695 868L4097.361326669696 16Z"};
const Word: React.FC<{
 value: "LIMITED" | "STOCK"; fill:string;opacity:number;
}> = ({value,fill,opacity}) => {
 const top=value==="LIMITED";
 const x=top?700:710, y=top?286:477, w=top?730:690, h=top?187:188;
 const naturalWidth=top?6133.038446499339:4930.161326669696;
 const naturalHeight=top?1760:1792;
 return <g opacity={opacity} transform={`rotate(-7 ${x+w/2} ${y+h/2})`}>
  <g transform={`translate(${x} ${y+h}) scale(${w/naturalWidth} ${-h/naturalHeight})`}>
   <path d={WORDS[value]} fill={colors.ink} transform={`translate(${12*naturalWidth/w} ${-17*naturalHeight/h})`}/>
   <path d={WORDS[value]} fill={fill}/>
  </g>
 </g>;
};

const Plus: React.FC<{x:number;y:number;opacity:number}> = ({x,y,opacity}) => <g transform={`translate(${x} ${y}) rotate(12) scale(${.7+.3*opacity})`} opacity={opacity} strokeLinejoin="round">
 <path d="M-12 -39 H12 V-12 H39 V12 H12 V39 H-12 V12 H-39 V-12 H-12 Z" fill={colors.pink} stroke={colors.cream} strokeWidth={25}/>
 <path d="M-12 -39 H12 V-12 H39 V12 H12 V39 H-12 V12 H-39 V-12 H-12 Z" fill={colors.pink} stroke={colors.ink} strokeWidth={12}/>
</g>;

const Lightning: React.FC<{x:number;y:number;flip?:boolean;opacity:number}> = ({x,y,flip=false,opacity}) => {
 const d=flip?"M55 -91 L-48 8 H-3 L-45 92 L72 -19 H24 Z":"M-25 -78 L52 -2 H13 L58 73 L-30 4 H6 Z";
 return <g transform={`translate(${x} ${y}) scale(${.7+.3*opacity})`} opacity={opacity} strokeLinejoin="round">
  <path d={d} fill={colors.yellow} stroke={colors.cream} strokeWidth={27}/>
  <path d={d} fill={colors.yellow} stroke={colors.ink} strokeWidth={12}/>
 </g>;
};

export const LimitedStockStack: React.FC = () => {
  const frame = useCurrentFrame();
  const yellowIn = ramp(frame, 0, 16);
  const landing = ramp(frame, 16, 19, easeInOut);
  const frontY = 560 * (1 - yellowIn) - 4 * (1 - landing);

  const orangeIn = ramp(frame, 10, 30);
  const pinkIn = ramp(frame, 18, 34);
  const orangeGone = ramp(frame, 242, 263, easeInOut);
  const pinkGone = ramp(frame, 248, 270, easeInOut);

  const backingOpen = ramp(frame, 22, 49);
  const panelOpen = ramp(frame, 27, 54);
  const backingClose = ramp(frame, 245, 274, easeInOut);
  const panelClose = ramp(frame, 240, 269, easeInOut);
  const backingVisible = backingOpen * (1 - backingClose);
  const panelVisible = panelOpen * (1 - panelClose);
  const limitedVisible = Math.min(panelVisible, ramp(frame, 38, 53));
  const stockVisible = Math.min(panelVisible, ramp(frame, 43, 59));

  const accentA = ramp(frame, 50, 57) * (1 - ramp(frame, 240, 247));
  const accentB = ramp(frame, 55, 62) * (1 - ramp(frame, 240, 247));
  const accentC = ramp(frame, 60, 67) * (1 - ramp(frame, 240, 247));
  const frontOut = ramp(frame, 275, 299, easeIn);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1672 941"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="backing-reveal">
            <rect x="420" y="150" width={1200 * backingVisible} height="920" />
          </clipPath>
          <clipPath id="panel-reveal">
            <rect x="430" y="120" width={1150 * panelVisible} height="920" />
          </clipPath>
        </defs>

        <g transform="translate(0 0)" opacity={frame <= 0 ? 0 : 1}>
          <g opacity={1-ramp(frame,250,263,easeInOut)}><OrangeBox
            x={-480 * (1 - orangeIn) + 160 * orangeGone}
            y={120 * orangeGone}
          /></g>
          <g opacity={1-ramp(frame,257,270,easeInOut)}><PinkBox x={100 * pinkGone} y={-520 * (1 - pinkIn) + 200 * pinkGone} /></g>
          <g clipPath="url(#backing-reveal)">
            <YellowBacking />
          </g>
          <g clipPath="url(#panel-reveal)">
            <PanelShape fill={colors.pink} />
            <Word
              value="LIMITED"
              fill={colors.cream}
              opacity={limitedVisible}
            />
            <Word
              value="STOCK"
              fill={colors.yellow}
              opacity={stockVisible}
            />
          </g>



          <g opacity={accentA}>
            <Lightning x={245} y={209} opacity={accentA} />
          </g>
          <g opacity={accentB}>
            <Plus x={835} y={205} opacity={accentB} />
          </g>
          <g opacity={accentC}>
            <Lightning x={1480} y={558} flip opacity={accentC} />
          </g>

          <g transform={`translate(0 ${frontOut * 1300})`}>
            <FrontBox y={frontY} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
