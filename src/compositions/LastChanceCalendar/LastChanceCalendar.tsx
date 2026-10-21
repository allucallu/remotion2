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
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const theme = {
  colors: {
    background: "#000000",
    cream: "#FFF1D2",
    creamBack: "#E8CFA0",
    yellow: "#FFD91A",
    orange: "#FF7808",
    magenta: "#F40073",
    purple: "#5B129B",
    purpleDark: "#270655",
    textPurple: "#461087",
  },
  font: "Impact",
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
  },
} as const;

const progress = (
  frame: number,
  start: number,
  end: number,
  easing: (value: number) => number = theme.ease.inOut,
) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const PanelShape: React.FC<{ d: string; fill: string }> = ({ d, fill }) => (
  <g strokeLinejoin="round">
    <path d={d} fill={theme.colors.purpleDark} transform="translate(14 17)" />
    <path d={d} fill={fill} stroke={theme.colors.cream} strokeWidth={28} />
    <path d={d} fill={fill} stroke={theme.colors.purpleDark} strokeWidth={14} />
  </g>
);

const LAST_PANEL =
  "M 560 310 L 1510 151 Q 1544 146 1561 174 Q 1568 184 1564 201 L 1501 457 Q 1496 478 1472 482 L 630 585 Q 603 588 590 564 Z";
const CHANCE_PANEL =
  "M 452 635 Q 456 608 484 602 L 1535 505 Q 1565 502 1584 521 L 1695 557 Q 1713 568 1707 591 L 1618 900 Q 1610 928 1582 934 L 493 985 Q 470 986 455 971 L 391 911 Q 379 898 386 879 Z";

type TextLayerProps = {
  value: "LAST" | "CHANCE";
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  reveal: number;
  revealX: number;
  revealY: number;
  revealWidth: number;
  revealHeight: number;
  letterSpacing: number;
  rotation: number;
  rotationX: number;
  rotationY: number;
};

const WORD_PATHS = {
  LAST: "M0.0 16 316.8 1776H668.8L406.0 316H768.0L714.0 16ZM731.0 16 1217.8 1776H1814.8L1665.0 16H1332.0L1358.12 300H1146.12L1073.0 16ZM1221.7 581H1381.7L1465.8 1476H1449.8ZM2153.12 0Q1912.12 0 1827.2199999999998 120.0Q1742.32 240 1789.48 502L1820.44 674H2168.44L2128.84 454Q2117.86 393 2130.15 358.5Q2142.44 324 2188.44 324Q2236.44 324 2259.98 352.0Q2283.52 380 2295.04 444Q2309.62 525 2303.43 579.5Q2297.24 634 2266.6499999999996 683.5Q2236.06 733 2177.94 799L2046.94 949Q1900.0 1116 1938.7 1331Q1979.2 1556 2104.94 1674.0Q2230.6800000000003 1792 2428.6800000000003 1792Q2670.6800000000003 1792 2748.96 1663.0Q2827.24 1534 2779.9 1271H2421.9L2443.68 1392Q2450.16 1428 2433.26 1448.0Q2416.36 1468 2381.36 1468Q2339.36 1468 2315.63 1444.5Q2291.9 1421 2285.24 1384Q2278.58 1347 2290.84 1304.0Q2303.1 1261 2352.02 1205L2519.92 1010Q2570.48 952 2609.87 887.5Q2649.26 823 2664.87 737.5Q2680.48 652 2658.34 529Q2613.7 281 2496.91 140.5Q2380.12 0 2153.12 0ZM2799.0 16 3054.96 1438H2845.96L2906.8 1776H3676.8L3615.96 1438H3406.96L3151.0 16Z",
  CHANCE: "M353.7462155688623 0Q162.74621556886228 0 67.66621556886228 119.0Q-27.413784431137714 238 11.106215568862297 452L157.26621556886226 1264Q203.34621556886225 1520 329.32621556886227 1656.0Q455.30621556886234 1792 684.3062155688624 1792Q809.3062155688624 1792 898.5262155688623 1746.0Q987.7462155688622 1700 1027.2762155688624 1608.5Q1066.8062155688624 1517 1041.7862155688624 1378L987.0662155688624 1074H637.0662155688624L683.8662155688623 1334Q698.0862155688624 1413 683.0362155688623 1440.5Q667.9862155688622 1468 625.9862155688622 1468Q576.9862155688622 1468 553.5962155688622 1432.5Q530.2062155688623 1397 519.5862155688624 1338L361.0062155688623 457Q347.8662155688623 384 363.96621556886225 354.0Q380.0662155688623 324 420.06621556886233 324Q465.06621556886233 324 490.22621556886236 361.0Q515.3862155688623 398 526.0062155688622 457L583.0662155688624 774H937.0662155688624L877.1262155688623 441Q835.3662155688623 209 699.5562155688623 104.5Q563.7462155688622 0 353.7462155688623 0ZM882.6262155688623 16 1199.4262155688623 1776H1549.4262155688623L1436.2062155688623 1147H1602.2062155688623L1715.4262155688623 1776H2065.426215568862L1748.6262155688623 16H1398.6262155688623L1542.2662155688622 814H1376.2662155688622L1232.6262155688623 16ZM1821.6262155688623 16 2308.426215568862 1776H2905.426215568862L2755.6262155688623 16H2422.6262155688623L2448.746215568862 300H2236.746215568862L2163.6262155688623 16ZM2312.3262155688626 581H2472.3262155688626L2556.426215568862 1476H2540.426215568862ZM2828.6262155688623 16 3145.4262155688625 1776H3507.426215568862L3517.6862155688623 933L3669.426215568862 1776H4009.426215568862L3692.6262155688623 16H3348.6262155688623L3331.0262155688624 896L3172.6262155688623 16ZM4220.746215568863 0Q4029.746215568862 0 3934.6662155688623 119.0Q3839.5862155688624 238 3878.1062155688624 452L4024.266215568862 1264Q4070.346215568862 1520 4196.326215568863 1656.0Q4322.306215568862 1792 4551.306215568862 1792Q4676.306215568862 1792 4765.526215568862 1746.0Q4854.746215568863 1700 4894.276215568862 1608.5Q4933.806215568862 1517 4908.786215568863 1378L4854.066215568862 1074H4504.066215568862L4550.866215568863 1334Q4565.086215568863 1413 4550.036215568863 1440.5Q4534.9862155688625 1468 4492.9862155688625 1468Q4443.9862155688625 1468 4420.596215568862 1432.5Q4397.206215568862 1397 4386.586215568863 1338L4228.006215568862 457Q4214.866215568863 384 4230.966215568862 354.0Q4247.066215568862 324 4287.066215568862 324Q4332.066215568862 324 4357.226215568862 361.0Q4382.386215568862 398 4393.006215568862 457L4450.066215568862 774H4804.066215568862L4744.126215568862 441Q4702.366215568863 209 4566.556215568862 104.5Q4430.746215568863 0 4220.746215568863 0ZM4749.626215568862 16 5066.426215568862 1776H5770.426215568862L5709.226215568862 1436H5363.226215568862L5301.486215568862 1093H5633.486215568862L5573.906215568862 762H5241.906215568862L5169.366215568862 359H5538.366215568862L5476.626215568862 16Z",
};

const PanelText: React.FC<TextLayerProps> = ({value, reveal}) => {
  // Fixed vector outlines: no Impact fallback, no font loading race.
  const last = value === "LAST";
  const box = last ? {x:820,y:248,w:650,h:222,cx:1130,cy:365,r:-8}
    : {x:548,y:659,w:1010,h:230,cx:1050,cy:770,r:-4.5};
  return <g transform={`rotate(${box.r} ${box.cx} ${box.cy})`}>
    <defs><clipPath id={`${value}-vector-reveal`}><rect x={box.x-20} y={box.y-25} width={(box.w+60)*reveal} height={box.h+65}/></clipPath></defs>
    <g clipPath={`url(#${value}-vector-reveal)`}>
      <g transform={`translate(${box.x} ${box.y+box.h}) scale(${box.w / (last ? 3676.8 : 5770.426215568862)} ${-box.h / 1792})`}>
        <path d={WORD_PATHS[value]} fill={theme.colors.purpleDark} transform="translate(30 -48)"/>
        <path d={WORD_PATHS[value]} fill={last ? theme.colors.textPurple : theme.colors.cream}/>
      </g>
    </g>
  </g>;
};

const Panels: React.FC<{
  lastProgress: number;
  chanceProgress: number;
  lastText: number;
  chanceText: number;
  lastCorrection: number;
  chanceCorrection: number;
}> = ({
  lastProgress,
  chanceProgress,
  lastText,
  chanceText,
  lastCorrection,
  chanceCorrection,
}) => (
  <g aria-label="LAST and CHANCE panels">
    <defs>
      <clipPath id="last-panel-clip">
        <rect x={545} y={120} width={1060 * lastProgress} height={500} />
      </clipPath>
      <clipPath id="chance-panel-clip">
        <rect x={370} y={395} width={1370 * chanceProgress} height={650} />
      </clipPath>
    </defs>
    <g clipPath="url(#last-panel-clip)">
      <g
        transform={`translate(${-35 * (1 - lastProgress) + lastCorrection} 0)`}
      >
        <PanelShape d={LAST_PANEL} fill={theme.colors.yellow} />
      </g>
    </g>
    <g clipPath="url(#chance-panel-clip)">
      <g
        transform={`translate(${-45 * (1 - chanceProgress) + chanceCorrection} ${
          55 * (1 - chanceProgress)
        })`}
      >
        <PanelShape d={CHANCE_PANEL} fill={theme.colors.magenta} />
      </g>
    </g>
    <g transform={`translate(${-35 * (1 - lastProgress) + lastCorrection} 0)`}>
      <PanelText
        value="LAST"
        x={840}
        y={500}
        fontSize={300}
        fill={theme.colors.textPurple}
        reveal={lastText}
        revealX={735}
        revealY={205}
        revealWidth={790}
        revealHeight={390}
        letterSpacing={1}
        rotation={-7.5}
        rotationX={1110}
        rotationY={380}
      />
    </g>
    <g
      transform={`translate(${-45 * (1 - chanceProgress) + chanceCorrection} ${
        55 * (1 - chanceProgress)
      })`}
    >
      <PanelText
        value="CHANCE"
        x={555}
        y={875}
        fontSize={310}
        fill={theme.colors.cream}
        reveal={chanceText}
        revealX={465}
        revealY={515}
        revealWidth={1130}
        revealHeight={405}
        letterSpacing={2}
        rotation={-3.5}
        rotationX={1050}
        rotationY={740}
      />
    </g>
  </g>
);

const Calendar: React.FC<{
  x:number;y:number;rotation:number;opacity:number;firstFlip:number;secondFlip:number;
}> = ({x,y,rotation,opacity,firstFlip,secondFlip}) => {
  const page = "M25 180 H535 V437 Q535 455 515 468 L451 523 Q438 535 417 535 H50 Q25 535 25 510 Z";
  const fold = "M451 523 Q461 477 515 468 Q492 505 451 523 Z";
  return <g transform={`translate(${x} ${y}) rotate(${rotation} 285 285)`} opacity={opacity} strokeLinejoin="round">
    <rect x={32} y={94} width={520} height={461} rx={27} fill={theme.colors.purpleDark} stroke={theme.colors.cream} strokeWidth={22}/>
    <rect x={32} y={94} width={520} height={461} rx={27} fill={theme.colors.creamBack} stroke={theme.colors.purpleDark} strokeWidth={10}/>
    <rect x={10} y={72} width={535} height={132} rx={24} fill={theme.colors.orange} stroke={theme.colors.cream} strokeWidth={24}/>
    <rect x={10} y={72} width={535} height={132} rx={24} fill={theme.colors.orange} stroke={theme.colors.purpleDark} strokeWidth={11}/>
    <path d={page} fill={theme.colors.cream} stroke={theme.colors.cream} strokeWidth={22}/>
    <path d={page} fill={theme.colors.cream} stroke={theme.colors.purpleDark} strokeWidth={10}/>
    <path d={fold} fill={theme.colors.yellow} stroke={theme.colors.purpleDark} strokeWidth={8}/>
    {[firstFlip,secondFlip].map((p,i)=> {
      if(p<=0||p>=1)return null;
      const c=Math.cos(Math.PI*p);
      return <g key={i} opacity={1-progress(p,.84,1)} transform={`translate(0 182) scale(1 ${c >= 0 ? c : c * 0.18}) translate(0 -182)`}>
        <path d="M25 182 H535 V510 Q535 535 510 535 H50 Q25 535 25 510 Z" fill={c>=0?theme.colors.cream:theme.colors.creamBack} stroke={theme.colors.purpleDark} strokeWidth={5}/>
      </g>;
    })}
    {[113,278,443].map((cx)=><g key={cx}>
      <ellipse cx={cx+29} cy={147} rx={20} ry={14} fill={theme.colors.yellow} stroke={theme.colors.purpleDark} strokeWidth={7}/>
      <path d={`M${cx-25} 93 C${cx-43} 15 ${cx+38} 13 ${cx+34} 91 L${cx+29} 140`} fill="none" stroke={theme.colors.cream} strokeWidth={40} strokeLinecap="round"/>
      <path d={`M${cx-25} 93 C${cx-43} 15 ${cx+38} 13 ${cx+34} 91 L${cx+29} 140`} fill="none" stroke={theme.colors.purpleDark} strokeWidth={30} strokeLinecap="round"/>
      <path d={`M${cx-25} 93 C${cx-43} 15 ${cx+38} 13 ${cx+34} 91 L${cx+29} 140`} fill="none" stroke={theme.colors.purple} strokeWidth={19} strokeLinecap="round"/>
      <path d={`M${cx-19} 79 C${cx-25} 30 ${cx+25} 27 ${cx+26} 79`} fill="none" stroke="#9761C1" strokeWidth={5} strokeLinecap="round"/>
    </g>)}
  </g>;
};

const Lightning: React.FC<{
  x: number;
  y: number;
  rotation: number;
  scale: number;
}> = ({ x, y, rotation, scale }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
    <path
      d="M 0 -88 L 90 -8 L 46 0 L 83 92 L -21 18 L 22 8 Z"
      fill={theme.colors.orange}
      stroke={theme.colors.cream}
      strokeWidth={24}
      strokeLinejoin="round"
    />
    <path
      d="M 0 -88 L 90 -8 L 46 0 L 83 92 L -21 18 L 22 8 Z"
      fill="none"
      stroke={theme.colors.purpleDark}
      strokeWidth={11}
      strokeLinejoin="round"
    />
  </g>
);

const Plus: React.FC<{ x: number; y: number; scale: number }> = ({
  x,
  y,
  scale,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path
      d="M -11 -39 H 11 V -11 H 39 V 11 H 11 V 39 H -11 V 11 H -39 V -11 H -11 Z"
      fill={theme.colors.cream}
      stroke={theme.colors.purpleDark}
      strokeWidth={8}
      strokeLinejoin="round"
    />
  </g>
);

export const LastChanceCalendar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (at30: number) => (at30 / 30) * fps;

  const calendarIn = progress(frame, f(0), f(24), theme.ease.out);
  const calendarOpacity = progress(frame, f(0), f(6), theme.ease.out);
  const settle =
    1.6 *
    progress(frame, f(16), f(20), theme.ease.out) *
    (1 - progress(frame, f(20), f(24), theme.ease.inOut));
  const calendarOut = progress(frame, f(275), f(299), theme.ease.in);
  const calendarX = 205 - 155 * (1 - calendarIn) - 1050 * calendarOut;
  const calendarY = 105 - 105 * (1 - calendarIn) - 430 * calendarOut;
  const calendarRotation = -12 - 6 * (1 - calendarIn) + settle - 7 * calendarOut;

  const firstFlip = progress(frame, f(18), f(38), theme.ease.inOut);
  const secondFlip = progress(frame, f(28), f(49), theme.ease.inOut);

  const lastOpen = progress(frame, f(30), f(55), theme.ease.out);
  const chanceOpen = progress(frame, f(36), f(59), theme.ease.out);
  const chanceClose = progress(frame, f(240), f(258), theme.ease.in);
  const lastClose = progress(frame, f(252), f(274), theme.ease.in);
  const lastProgress = lastOpen * (1 - lastClose);
  const chanceProgress = chanceOpen * (1 - chanceClose);

  const lastText = Math.min(
    progress(frame, f(39), f(57), theme.ease.out),
    lastProgress,
  );
  const chanceText = Math.min(
    progress(frame, f(45), f(64), theme.ease.out),
    chanceProgress,
  );
  const lastCorrection =
    4 *
    progress(frame, f(50), f(57), theme.ease.out) *
    (1 - progress(frame, f(57), f(69), theme.ease.inOut));
  const chanceCorrection =
    -4 *
    progress(frame, f(54), f(60), theme.ease.out) *
    (1 - progress(frame, f(60), f(69), theme.ease.inOut));

  const accentExit = progress(frame, f(240), f(248), theme.ease.in);
  const accentVisibility = 1 - accentExit;
  const topPlus =
    progress(frame, f(51), f(58), theme.ease.out) * accentVisibility;
  const topLightning =
    progress(frame, f(55), f(62), theme.ease.out) * accentVisibility;
  const rightPlus =
    progress(frame, f(59), f(65), theme.ease.out) * accentVisibility;
  const leftLightning =
    progress(frame, f(62), f(68), theme.ease.out) * accentVisibility;
  const lowerPlus =
    progress(frame, f(65), f(69), theme.ease.out) * accentVisibility;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Last chance calendar badge"
      >
        <g transform="translate(96 30) scale(0.92)">
          <Panels
            lastProgress={lastProgress}
            chanceProgress={chanceProgress}
            lastText={lastText}
            chanceText={chanceText}
            lastCorrection={lastCorrection}
            chanceCorrection={chanceCorrection}
          />

          <Plus x={820} y={166} scale={topPlus * 0.88} />
          <Lightning
            x={1005}
            y={166}
            rotation={-17}
            scale={topLightning * 0.9}
          />
          <Plus x={1650} y={400} scale={rightPlus * 0.82} />
          <Lightning
            x={180}
            y={690}
            rotation={8}
            scale={leftLightning * 0.88}
          />
          <Plus x={365} y={845} scale={lowerPlus * 0.66} />

          <Calendar
            x={calendarX}
            y={calendarY}
            rotation={calendarRotation}
            opacity={calendarOpacity}
            firstFlip={firstFlip}
            secondFlip={secondFlip}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
