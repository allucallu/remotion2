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
      240,
      1665,
      3360,
      190
    ],
    "fill": "#253036",
    "enter": [
      0.9,
      1.6
    ],
    "exit": [
      10.6,
      11.15
    ],
    "direction": "top",
    "slideY": -190
  },
  {
    "name": "headline",
    "box": [
      340,
      1330,
      3160,
      335
    ],
    "fill": "#F2EFE6",
    "enter": [
      0.35,
      1.2
    ],
    "exit": [
      11.15,
      11.65
    ],
    "direction": "left"
  },
  {
    "name": "left-clamp",
    "box": [
      240,
      1330,
      100,
      335
    ],
    "fill": "#269DA3",
    "enter": [
      0.1,
      0.55
    ],
    "exit": [
      11.55,
      11.9
    ],
    "direction": "bottom"
  },
  {
    "name": "right-clamp",
    "box": [
      3500,
      1330,
      100,
      335
    ],
    "fill": "#269DA3",
    "enter": [
      0.95,
      1.4
    ],
    "exit": [
      10.95,
      11.3
    ],
    "direction": "top"
  },
  {
    "name": "baseline",
    "box": [
      240,
      1855,
      3360,
      15
    ],
    "fill": "#269DA3",
    "enter": [
      1.15,
      1.75
    ],
    "exit": [
      10.45,
      10.95
    ],
    "direction": "left"
  },
  {
    "name": "divider",
    "box": [
      3010,
      1665,
      20,
      190
    ],
    "fill": "#269DA3",
    "enter": [
      1.35,
      1.8
    ],
    "exit": [
      10.25,
      10.65
    ],
    "direction": "bottom"
  },
  {
    "name": "category",
    "box": [
      340,
      1180,
      980,
      150
    ],
    "fill": "#269DA3",
    "enter": [
      1.2,
      1.75
    ],
    "exit": [
      10.15,
      10.6
    ],
    "direction": "bottom",
    "points": "340,1180 1200,1180 1320,1330 340,1330",
    "label": "LIVE REPORT",
    "fontSize": 68
  }
];

// 3840 x 2160, 30fps, 360 frames. Pure black background; empty buyer panels.
export const BNTealLiveDesk = () => {
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
