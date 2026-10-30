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
    "name": "rail",
    "box": [
      450,
      1825,
      3100,
      25
    ],
    "fill": "#821A3D",
    "enter": [
      0.8,
      1.5
    ],
    "exit": [
      10.5,
      11.1
    ],
    "direction": "left"
  },
  {
    "name": "sub",
    "box": [
      450,
      1770,
      1490,
      140
    ],
    "fill": "#252A30",
    "enter": [
      0.95,
      1.65
    ],
    "exit": [
      10.3,
      10.9
    ],
    "direction": "top",
    "points": "450,1770 1940,1770 1840,1910 450,1910",
    "slideY": -140
  },
  {
    "name": "headline",
    "box": [
      450,
      1430,
      3130,
      340
    ],
    "fill": "#F2EFE6",
    "enter": [
      0.5,
      1.35
    ],
    "exit": [
      10.85,
      11.45
    ],
    "direction": "left",
    "points": "450,1430 3580,1430 3440,1770 450,1770"
  },
  {
    "name": "anchor",
    "box": [
      250,
      1290,
      170,
      620
    ],
    "fill": "#821A3D",
    "enter": [
      0.1,
      0.65
    ],
    "exit": [
      11.45,
      11.85
    ],
    "direction": "bottom"
  },
  {
    "name": "anchor-notch",
    "box": [
      250,
      1430,
      170,
      32
    ],
    "fill": "#F2EFE6",
    "enter": [
      0.4,
      0.8
    ],
    "exit": [
      11.35,
      11.6
    ],
    "direction": "left"
  },
  {
    "name": "category",
    "box": [
      450,
      1290,
      1060,
      140
    ],
    "fill": "#821A3D",
    "enter": [
      1.1,
      1.7
    ],
    "exit": [
      10.15,
      10.65
    ],
    "direction": "bottom",
    "points": "450,1290 1410,1290 1510,1430 450,1430",
    "label": "WORLD NEWS",
    "fontSize": 68
  }
];

// 3840 x 2160, 30fps, 360 frames. Pure black background; empty buyer panels.
export const BNBurgundyEditorialNews = () => {
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
