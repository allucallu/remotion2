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

const c = {
  black: "#000000",
  cream: "#FFF1D2",
  yellow: "#FFD719",
  magenta: "#F30578",
  orange: "#FF7910",
  purple: "#6514AF",
  ink: "#25064C",
} as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const inn = Easing.bezier(0.7, 0, 0.84, 0);
const smooth = Easing.bezier(0.65, 0, 0.35, 1);
const p = (f: number, a: number, b: number, easing = out) =>
  interpolate(f, [a, b], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Shape: React.FC<{ d: string; fill: string; stroke?: boolean }> = ({
  d,
  fill,
  stroke = true,
}) => (
  <path
    d={d}
    fill={fill}
    stroke={stroke ? c.cream : undefined}
    strokeWidth={stroke ? 27 : undefined}
    strokeLinejoin="round"
  />
);
const Edge: React.FC<{ d: string; width?: number }> = ({ d, width = 14 }) => (
  <path
    d={d}
    fill="none"
    stroke={c.ink}
    strokeWidth={width}
    strokeLinejoin="round"
    strokeLinecap="round"
  />
);

// Fixed glyph outlines keep the render independent of installed fonts.
const WORDS = {"BLACK": "M0.0 16 440.0 1776H917.0Q1109.0 1776 1173.125 1682.5Q1237.25 1589 1183.5 1374L1164.25 1297Q1133.25 1173 1069.5 1096.0Q1005.75 1019 908.75 995Q1020.25 965 1033.125 854.5Q1046.0 744 1006.25 585Q963.5 414 899.5 286.0Q835.5 158 733.75 87.0Q632.0 16 477.0 16ZM618.25 1113H690.25Q739.25 1113 762.75 1151.0Q786.25 1189 799.5 1242L843.75 1419Q865.0 1504 790.0 1504H716.0ZM456.5 326Q593.5 326 626.0 456L681.0 676Q699.75 751 688.125 794.5Q676.5 838 614.5 838H549.5L422.0 328Q443.5 326 456.5 326ZM990.0 16 1430.0 1776H1782.0L1417.0 316H1779.0L1704.0 16ZM1766.0 16 2376.0 1776H2973.0L2700.0 16H2367.0L2413.0 300H2201.0L2108.0 16ZM2296.25 581H2456.25L2603.0 1476H2587.0ZM3224.0 0Q3033.0 0 2946.25 119.0Q2859.5 238 2913.0 452L3116.0 1264Q3180.0 1520 3315.5 1656.0Q3451.0 1792 3680.0 1792Q3805.0 1792 3891.0 1746.0Q3977.0 1700 4010.125 1608.5Q4043.25 1517 4008.5 1378L3932.5 1074H3582.5L3647.5 1334Q3667.25 1413 3654.125 1440.5Q3641.0 1468 3599.0 1468Q3550.0 1468 3524.125 1432.5Q3498.25 1397 3483.5 1338L3263.25 457Q3245.0 384 3259.0 354.0Q3273.0 324 3313.0 324Q3358.0 324 3385.75 361.0Q3413.5 398 3428.25 457L3507.5 774H3861.5L3778.25 441Q3720.25 209 3577.125 104.5Q3434.0 0 3224.0 0ZM3799.0 16 4239.0 1776H4587.0L4410.75 1071L4751.0 1776H5105.0L4706.5 970L4706.0 16H4341.0L4362.0 868L4149.0 16Z", "FRIDAY": "M0.0 0 440.0 1760H1144.0L1058.25 1417H708.25L638.25 1137H970.25L885.5 798H553.5L354.0 0ZM827.0 0 1267.0 1760H1807.0Q1942.0 1760 1995.625 1698.5Q2049.25 1637 2045.125 1526.5Q2041.0 1416 2003.75 1267Q1967.75 1123 1909.75 1037.0Q1851.75 951 1742.5 918Q1821.25 901 1838.375 835.5Q1855.5 770 1829.5 666L1663.0 0H1316.0L1488.25 689Q1507.5 766 1480.625 784.5Q1453.75 803 1383.75 803L1183.0 0ZM1462.0 1108H1547.0Q1620.0 1108 1659.75 1267Q1685.5 1370 1677.5 1402.0Q1669.5 1434 1625.5 1434H1543.5ZM1797.0 0 2237.0 1760H2577.0L2137.0 0ZM2287.0 0 2727.0 1760H3211.0Q3401.0 1760 3470.625 1654.5Q3540.25 1549 3489.5 1346L3283.5 522Q3221.0 272 3099.5 136.0Q2978.0 0 2759.0 0ZM2718.75 311H2779.75Q2876.75 311 2900.25 405L3127.25 1313Q3149.25 1401 3132.125 1426.5Q3115.0 1452 3043.0 1452H3004.0ZM3259.0 0 3869.0 1760H4466.0L4193.0 0H3860.0L3906.0 284H3694.0L3601.0 0ZM3789.25 565H3949.25L4096.0 1460H4080.0ZM4524.0 0 4668.75 579 4683.0 1760H5032.0L4981.0 1164L5228.0 1760H5576.0L5000.75 579L4856.0 0Z"};
const Word: React.FC<{value:"BLACK"|"FRIDAY";fill:string;opacity:number;dx:number}> = ({value,fill,opacity,dx}) => {
 const upper=value==="BLACK";
 const x=upper?375:310,y=upper?263:486,w=upper?950:1025,h=upper?207:233;
 const nw=upper?5105.0:5576.0,nh=upper?1792:1760;
 return <g opacity={opacity} transform={`translate(${dx} 0) rotate(-6 ${x+w/2} ${y+h/2})`}>
  <g transform={`translate(${x} ${y+h}) scale(${w/nw} ${-h/nh})`}>
   <path d={WORDS[value]} fill={c.ink} stroke={c.ink} strokeWidth={16} transform={`translate(${11*nw/w} ${-16*nh/h})`} strokeLinejoin="round"/>
   <path d={WORDS[value]} fill={fill}/>
  </g>
 </g>;
};

const BigBolt: React.FC<{ reveal: number; opacity: number }> = ({
  reveal,
  opacity,
}) => (
  <g
    opacity={opacity > 0 ? 1 : 0}
    clipPath="url(#bolt-mask)"
    transform={`translate(${5 * (1 - reveal)} ${-5 * (1 - reveal)})`}
  >
    <Shape
      d="M 300 128 L 485 59 L 393 211 L 465 198 L 170 589 L 282 322 L 190 355 Z"
      fill={c.orange}
    />
    <Edge d="M 300 128 L 485 59 L 393 211 L 465 198 L 170 589 L 282 322 L 190 355 Z" />
  </g>
);

const Burst: React.FC<{ amount: number }> = ({ amount }) => (
  <g
    transform={`translate(1360 720) scale(${0.65 + amount * 0.35})`}
    opacity={amount}
  >
    <path
      d="M 0 -122 L 35 -42 L 112 -91 L 64 -18 L 171 8 L 57 27 L 86 117 L 17 48 L -44 154 L -31 43 L -139 91 L -59 14 L -157 -32 L -46 -39 L -73 -131 L -5 -58 Z"
      fill={c.cream}
      stroke={c.ink}
      strokeWidth="9"
      strokeLinejoin="round"
    />
  </g>
);
const SmallBolt: React.FC<{
  x: number;
  y: number;
  opacity: number;
  flip?: boolean;
}> = ({ x, y, opacity, flip }) => (
  <g
    opacity={opacity}
    transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1) scale(${0.75 + opacity * 0.25})`}
  >
    <path
      d="M 0 -52 L 43 -8 L 18 -8 L 44 49 L -13 5 L 10 5 Z"
      fill={c.yellow}
      stroke={c.ink}
      strokeWidth="10"
      strokeLinejoin="round"
    />
  </g>
);
const Plus: React.FC<{
  x: number;
  y: number;
  opacity: number;
  fill: string;
}> = ({ x, y, opacity, fill }) => (
  <path
    opacity={opacity}
    transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * opacity})`}
    d="M -10 -31 H 10 V -10 H 31 V 10 H 10 V 31 H -10 V 10 H -31 V -10 H -10 Z"
    fill={fill}
    stroke={c.ink}
    strokeWidth="7"
    strokeLinejoin="round"
  />
);

export const BlackFridayImpact: React.FC = () => {
  const frame = useCurrentFrame();
  // Keep the solid panel assembly together during entrance and exit.
  const assemblyIn = p(frame, 0, 28);
  const assemblyOut = p(frame, 275, 299, inn);
  const assemblyY = 1120 * (1 - assemblyIn) + 1120 * assemblyOut;
  const blackIn = p(frame, 25, 44);
  const fridayIn = p(frame, 31, 50);
  const textOut = p(frame, 260, 279, inn);
  const boltIn = p(frame, 38, 52);
  const boltOut = p(frame, 240, 259, inn);
  const boltAmount = boltIn * (1 - boltOut);
  const burstIn = p(frame, 48, 61);
  const burstSettle = p(frame, 61, 64, smooth);
  const burstAmount =
    burstIn * (1 + (1 - burstSettle) * 0.04) * (1 - p(frame, 240, 259, inn));
  const accents = p(frame, 52, 64) * (1 - p(frame, 240, 252, inn));
  return (
    <AbsoluteFill style={{ backgroundColor: c.black }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1672 941"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="black-text">
            <rect
              x="200"
              y="100"
              width={1450 * blackIn * (1 - textOut)}
              height="460"
            />
          </clipPath>
          <clipPath id="friday-text">
            <rect
              x={1560 - 1450 * fridayIn * (1 - textOut)}
              y="375"
              width={1450 * fridayIn * (1 - textOut)}
              height="445"
            />
          </clipPath>
          <clipPath id="bolt-mask">
            <rect x="120" y="20" width="460" height={610 * boltAmount} />
          </clipPath>
        </defs>
        <g transform={`translate(0 ${assemblyY})`} opacity={frame <= 0 || frame >= 299 ? 0 : 1}>
          <g
            transform={`translate(${-18 * (1 - assemblyIn)} ${-12 * (1 - assemblyIn)})`}
          >
            <Shape
              d="M 150 280 L 1040 110 L 1280 700 L 274 772 Z"
              fill={c.yellow}
            />
            <Edge d="M 150 280 L 1040 110 L 1280 700 L 274 772 Z" />
          </g>
          <g
            transform={`translate(${18 * (1 - assemblyIn)} ${12 * (1 - assemblyIn)})`}
          >
            <Shape
              d="M 600 400 L 1483 329 L 1411 762 L 609 829 Z"
              fill={c.magenta}
            />
            <Edge d="M 600 400 L 1483 329 L 1411 762 L 609 829 Z" />
          </g>
          <g
            aria-label="solid main panel"
          >
            <Shape
              d="M 427 245 L 1328 155 L 1435 280 L 1358 730 L 235 800 L 215 776 Z"
              fill={c.purple}
            />
            <Edge d="M 427 245 L 1328 155 L 1435 280 L 1358 730 L 235 800 L 215 776 Z" />
            <path
              d="M 440 257 L 1315 170 L 1334 190 L 432 278 Z"
              fill="#8B29D2"
              opacity=".7"
            />
            <g clipPath="url(#black-text)">
              <Word
                value="BLACK"
                fill={c.cream}
                opacity={1}
                dx={-32 * (1 - blackIn) + 35 * textOut}
              />
            </g>
            <g clipPath="url(#friday-text)">
              <Word
                value="FRIDAY"
                fill={c.yellow}
                opacity={1}
                dx={32 * (1 - fridayIn) - 35 * textOut}
              />
            </g>
          </g>
          <BigBolt reveal={boltAmount} opacity={boltAmount} />
          <Burst amount={burstAmount} />
          <SmallBolt x={1525} y={483} opacity={accents} />
          <g opacity={accents}><path d="M160 647 L222 608 L189 685 Z" fill={c.yellow}/><path d="M196 127 L235 100 L231 184 Z" fill={c.yellow}/><path d="M150 174 L182 211 L213 229 Z" fill={c.yellow}/><path d="M1455 659 L1507 624 L1477 689 Z" fill={c.cream}/><path d="M1480 706 L1540 679 L1550 720 Z" fill={c.yellow}/></g>
          <Plus x={149} y={463} opacity={accents} fill={c.magenta} />
          <Plus x={1539} y={598} opacity={accents} fill={c.magenta} />
          <Plus x={135} y={535} opacity={accents} fill={c.yellow} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
