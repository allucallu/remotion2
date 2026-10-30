import {useId} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type Part = {
  name: string;
  box: readonly [number, number, number, number];
  fill: string;
  enter: readonly [number, number];
  exit: readonly [number, number];
  direction: 'left' | 'right' | 'top' | 'bottom';
  points?: string;
  label?: string;
  fontSize?: number;
  slideY?: number;
};
const ENTER = Easing.bezier(0.22, 1, 0.36, 1);
const EXIT = Easing.bezier(0.64, 0, 0.78, 0);

const PARTS: readonly Part[] = [
  {
    "name": "lower",
    "box": [
      250,
      1770,
      2770,
      145
    ],
    "fill": "#102B50",
    "enter": [
      0.8,
      1.55
    ],
    "exit": [
      10.3,
      10.95
    ],
    "direction": "right",
    "points": "320,1770 3020,1770 2950,1915 250,1915"
  },
  {
    "name": "headline",
    "box": [
      320,
      1490,
      2840,
      280
    ],
    "fill": "#F2EFE6",
    "enter": [
      0.35,
      1.2
    ],
    "exit": [
      10.55,
      11.25
    ],
    "direction": "right",
    "points": "460,1490 3160,1490 3020,1770 320,1770"
  },
  {
    "name": "right-block",
    "box": [
      2990,
      1490,
      610,
      425
    ],
    "fill": "#102B50",
    "enter": [
      0.55,
      1.3
    ],
    "exit": [
      10.8,
      11.4
    ],
    "direction": "left",
    "points": "3200,1490 3600,1490 3390,1915 2990,1915"
  },
  {
    "name": "separator",
    "box": [
      320,
      1760,
      2710,
      12
    ],
    "fill": "#C5A052",
    "enter": [
      0.9,
      1.6
    ],
    "exit": [
      11.2,
      11.6
    ],
    "direction": "right"
  },
  {
    "name": "gold-anchor",
    "box": [
      2944,
      1490,
      246,
      425
    ],
    "fill": "#C5A052",
    "enter": [
      0.1,
      0.65
    ],
    "exit": [
      11.5,
      11.85
    ],
    "direction": "bottom",
    "points": "3154,1490 3190,1490 2980,1915 2944,1915"
  },
  {
    "name": "tab-gold",
    "box": [
      420,
      1350,
      125,
      140
    ],
    "fill": "#C5A052",
    "enter": [
      1.15,
      1.75
    ],
    "exit": [
      10.15,
      10.6
    ],
    "direction": "bottom",
    "points": "490,1350 545,1350 475,1490 420,1490"
  },
  {
    "name": "category",
    "box": [
      465,
      1350,
      1080,
      140
    ],
    "fill": "#102B50",
    "enter": [
      1.15,
      1.75
    ],
    "exit": [
      10.15,
      10.6
    ],
    "direction": "bottom",
    "points": "535,1350 1545,1350 1475,1490 465,1490",
    "label": "SPECIAL REPORT",
    "fontSize": 64
  }
];

// 3840 x 2160, 30fps, 360 frames. Pure black background; empty buyer panels.
export const BNNavyAngleReport = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const uid = useId().replace(/:/g, '');
  const time = frame / fps;
  const exitShift = Math.max(4, durationInFrames / fps) - 12;
  const progress = (range: readonly [number, number], closing = false) =>
    interpolate(time, [range[0] + (closing ? exitShift : 0), range[1] + (closing ? exitShift : 0)], [0, 1], {
      easing: closing ? EXIT : ENTER,
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  return (
    <AbsoluteFill style={{backgroundColor: '#000000', overflow: 'hidden'}}>
      <svg width="100%" height="100%" viewBox="0 0 3840 2160"
        preserveAspectRatio="xMidYMid meet" style={{display: 'block'}}>
        {PARTS.map((part) => {
          const [x, y, width, height] = part.box;
          const incoming = progress(part.enter);
          const outgoing = progress(part.exit, true);
          const visible = incoming * (1 - outgoing);
          const horizontal = part.direction === 'left' || part.direction === 'right';
          const maskWidth = horizontal ? width * visible : width;
          const maskHeight = horizontal ? height : height * visible;
          const maskX = part.direction === 'right' ? x + width - maskWidth : x;
          const maskY = part.direction === 'bottom' ? y + height - maskHeight : y;
          const clipId = `${uid}-${part.name}`;
          // Sliding pieces keep their original dimensions within a fixed window.
          const slideY = part.slideY ? part.slideY * (1 - incoming + outgoing) : 0;
          const labelIn = progress([part.enter[0] + 0.20, part.enter[1] + 0.15]);
          const labelOut = progress([part.exit[0], part.exit[0] + 0.20], true);
          const labelOpacity = labelIn * (1 - labelOut);
          return (
            <g key={part.name}>
              <defs>
                <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                  <rect x={part.slideY ? x : maskX} y={part.slideY ? y : maskY}
                    width={part.slideY ? width : maskWidth}
                    height={part.slideY ? height : maskHeight} />
                </clipPath>
                {part.label ? <clipPath id={`${clipId}-shape`} clipPathUnits="userSpaceOnUse">
                  {part.points ? <polygon points={part.points} /> : <rect x={x} y={y} width={width} height={height} />}
                </clipPath> : null}
              </defs>
              <g clipPath={`url(#${clipId})`}>
                <g transform={`translate(0 ${slideY})`}>
                  {part.points ? <polygon points={part.points} fill={part.fill} /> :
                    <rect x={x} y={y} width={width} height={height} fill={part.fill} />}
                  {part.label ? <g clipPath={`url(#${clipId}-shape)`}>
                    <text x={x + 105} y={y + height / 2}
                      dominantBaseline="central" fontFamily="Arial, Helvetica, sans-serif"
                      fontWeight={700} fontSize={part.fontSize ?? 66}
                      fill={part.fill === '#F2EFE6' ? '#202832' : '#FFFFFF'}
                      opacity={labelOpacity}
                      transform={`translate(0 ${16 * (1 - labelIn + labelOut)})`}>
                      {part.label}
                    </text>
                  </g> : null}
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
