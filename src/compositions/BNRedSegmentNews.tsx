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
      240,
      1835,
      3360,
      105
    ],
    "fill": "#252A30",
    "enter": [
      1.15,
      1.8
    ],
    "exit": [
      10,
      10.5
    ],
    "direction": "left"
  },
  {
    "name": "sub-back",
    "box": [
      240,
      1670,
      3230,
      150
    ],
    "fill": "#810B15",
    "enter": [
      0.85,
      1.5
    ],
    "exit": [
      10.2,
      10.8
    ],
    "direction": "top",
    "points": "240,1670 3470,1670 3395,1820 240,1820",
    "slideY": -150
  },
  {
    "name": "sub",
    "box": [
      240,
      1670,
      3100,
      150
    ],
    "fill": "#B80F1C",
    "enter": [
      0.85,
      1.5
    ],
    "exit": [
      10.2,
      10.8
    ],
    "direction": "top",
    "points": "240,1670 3340,1670 3265,1820 240,1820",
    "slideY": -150
  },
  {
    "name": "headline",
    "box": [
      240,
      1350,
      3190,
      320
    ],
    "fill": "#F2EFE6",
    "enter": [
      0.4,
      1.2
    ],
    "exit": [
      10.65,
      11.35
    ],
    "direction": "left"
  },
  {
    "name": "endcap",
    "box": [
      3360,
      1350,
      240,
      320
    ],
    "fill": "#B80F1C",
    "enter": [
      0.75,
      1.35
    ],
    "exit": [
      10.55,
      11
    ],
    "direction": "bottom",
    "points": "3520,1350 3600,1350 3600,1670 3360,1670"
  },
  {
    "name": "slash",
    "box": [
      3300,
      1350,
      180,
      320
    ],
    "fill": "#B80F1C",
    "enter": [
      0.8,
      1.4
    ],
    "exit": [
      10.55,
      11
    ],
    "direction": "bottom",
    "points": "3460,1350 3480,1350 3320,1670 3300,1670"
  },
  {
    "name": "category",
    "box": [
      240,
      1215,
      1130,
      135
    ],
    "fill": "#B80F1C",
    "enter": [
      0.1,
      0.6
    ],
    "exit": [
      11.35,
      11.85
    ],
    "direction": "left",
    "points": "240,1215 1300,1215 1370,1350 240,1350",
    "label": "BREAKING NEWS",
    "fontSize": 70
  }
];

// 3840 x 2160, 30fps, 360 frames. Pure black background; empty buyer panels.
export const BNRedSegmentNews = () => {
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
