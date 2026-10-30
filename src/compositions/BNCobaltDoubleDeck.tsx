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
    "name": "ticker",
    "box": [
      300,
      1835,
      3110,
      95
    ],
    "fill": "#252A30",
    "enter": [
      1.25,
      1.95
    ],
    "exit": [
      10,
      10.45
    ],
    "direction": "left",
    "points": "350,1835 3410,1835 3360,1930 300,1930"
  },
  {
    "name": "sub",
    "box": [
      970,
      1650,
      2530,
      170
    ],
    "fill": "#F2EFE6",
    "enter": [
      0.9,
      1.65
    ],
    "exit": [
      10.4,
      11
    ],
    "direction": "left",
    "points": "1055,1650 3500,1650 3415,1820 970,1820"
  },
  {
    "name": "headline",
    "box": [
      240,
      1310,
      3170,
      340
    ],
    "fill": "#1455CD",
    "enter": [
      0.45,
      1.3
    ],
    "exit": [
      10.75,
      11.45
    ],
    "direction": "right",
    "points": "410,1310 3410,1310 3240,1650 240,1650"
  },
  {
    "name": "slash-inner",
    "box": [
      3280,
      1310,
      270,
      340
    ],
    "fill": "#1455CD",
    "enter": [
      0.25,
      0.7
    ],
    "exit": [
      11.35,
      11.7
    ],
    "direction": "bottom",
    "points": "3450,1310 3550,1310 3380,1650 3280,1650"
  },
  {
    "name": "slash-outer",
    "box": [
      3420,
      1310,
      270,
      340
    ],
    "fill": "#1455CD",
    "enter": [
      0.1,
      0.55
    ],
    "exit": [
      11.55,
      11.9
    ],
    "direction": "bottom",
    "points": "3590,1310 3690,1310 3520,1650 3420,1650"
  },
  {
    "name": "category",
    "box": [
      410,
      1180,
      990,
      130
    ],
    "fill": "#F2EFE6",
    "enter": [
      1.05,
      1.7
    ],
    "exit": [
      10.25,
      10.7
    ],
    "direction": "bottom",
    "points": "475,1180 1400,1180 1335,1310 410,1310",
    "label": "NEWS UPDATE",
    "fontSize": 66
  }
];

// 3840 x 2160, 30fps, 360 frames. Pure black background; empty buyer panels.
export const BNCobaltDoubleDeck = () => {
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
