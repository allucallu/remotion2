import {useId} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const COLORS = {
  background: '#000000',
  ivory: '#F1EDE4',
  slate: '#547B93',
} as const;

const MAIN: Rectangle = {x: 260, y: 1400, width: 2610, height: 375};
const MAIN_CENTER_X = MAIN.x + MAIN.width / 2;
// The 1px overlap sits behind ivory, keeping the final join seam-free.
const SECONDARY: Rectangle = {x: 1595, y: 1774, width: 1275, height: 186};
const SECONDARY_START_Y = SECONDARY.y - SECONDARY.height;
const TOP_LINE: Rectangle = {x: 260, y: 1260, width: 2610, height: 22};
const BOTTOM_LINE: Rectangle = {x: 260, y: 1300, width: 2610, height: 22};
const LEFT_SUPPORT: Rectangle = {x: 435, y: 1300, width: 28, height: 100};
const RIGHT_SUPPORT: Rectangle = {x: 2665, y: 1300, width: 28, height: 100};

const ENTER_EASING = Easing.bezier(0.22, 1, 0.36, 1);
const EXIT_EASING = Easing.bezier(0.64, 0, 0.78, 0);

const animate = (
  time: number,
  input: readonly [number, number],
  output: readonly [number, number],
  easing: (value: number) => number,
) =>
  interpolate(time, input, output, {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const ClippedRect = ({id, box, mask, fill}: {
  id: string;
  box: Rectangle;
  mask: Rectangle;
  fill: string;
}) => (
  <g>
    <defs>
      <clipPath id={id} clipPathUnits="userSpaceOnUse">
        <rect {...mask} />
      </clipPath>
    </defs>
    <rect {...box} fill={fill} clipPath={`url(#${id})`} />
  </g>
);

// Register at 3840x2160, 30 fps, durationInFrames: 360.
// No text, logos, gradients, glow, or external assets.
// All geometry remains at its final dimensions. The main panel uses a centered
// reveal, while the secondary panel translates rigidly inside its final bounds.
export const LTSlateSuspended = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const exitTime = time - (Math.max(4, durationInFrames / fps) - 12);
  const uid = useId().replace(/:/g, '');

  const topLineIn = animate(time, [0.1, 0.75], [0, 1], ENTER_EASING);
  const bottomLineIn = animate(time, [0.25, 0.9], [0, 1], ENTER_EASING);
  const leftSupportIn = animate(time, [0.55, 1], [0, 1], ENTER_EASING);
  const rightSupportIn = animate(time, [0.7, 1.15], [0, 1], ENTER_EASING);
  const mainIn = animate(time, [0.85, 1.50], [0, 1], ENTER_EASING);
  const secondaryIn = animate(time, [1.50, 1.95], [0, 1], ENTER_EASING);

  const secondaryOut = animate(exitTime, [10, 10.6], [0, 1], EXIT_EASING);
  const mainOut = animate(exitTime, [10.60, 11.10], [0, 1], EXIT_EASING);
  const rightSupportOut = animate(exitTime, [11.10, 11.35], [0, 1], EXIT_EASING);
  const leftSupportOut = animate(exitTime, [11.20, 11.45], [0, 1], EXIT_EASING);
  const bottomLineOut = animate(exitTime, [11.45, 11.70], [0, 1], EXIT_EASING);
  const topLineOut = animate(exitTime, [11.60, 11.90], [0, 1], EXIT_EASING);

  const topLineWidth = TOP_LINE.width * topLineIn * (1 - topLineOut);
  const bottomLineWidth = BOTTOM_LINE.width * bottomLineIn * (1 - bottomLineOut);
  const leftSupportHeight = LEFT_SUPPORT.height * leftSupportIn * (1 - leftSupportOut);
  const rightSupportHeight = RIGHT_SUPPORT.height * rightSupportIn * (1 - rightSupportOut);
  const mainWidth = MAIN.width * mainIn * (1 - mainOut);
  const secondaryTravel = SECONDARY.y - SECONDARY_START_Y;
  const secondaryY = SECONDARY.y - secondaryTravel * (1 - secondaryIn + secondaryOut);
  const secondaryClipId = `${uid}-slate-secondary-final-bounds`;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background, overflow: 'hidden'}}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
        style={{display: 'block'}}
      >
        <ClippedRect
          id={`${uid}-slate-top-line`}
          box={TOP_LINE}
          fill={COLORS.slate}
          mask={{...TOP_LINE, width: topLineWidth}}
        />
        <ClippedRect
          id={`${uid}-slate-bottom-line`}
          box={BOTTOM_LINE}
          fill={COLORS.slate}
          mask={{...BOTTOM_LINE, width: bottomLineWidth}}
        />

        <ClippedRect
          id={`${uid}-slate-left-support`}
          box={LEFT_SUPPORT}
          fill={COLORS.slate}
          mask={{...LEFT_SUPPORT, height: leftSupportHeight}}
        />
        <ClippedRect
          id={`${uid}-slate-right-support`}
          box={RIGHT_SUPPORT}
          fill={COLORS.slate}
          mask={{...RIGHT_SUPPORT, height: rightSupportHeight}}
        />

        <defs>
          <clipPath id={secondaryClipId} clipPathUnits="userSpaceOnUse">
            <rect {...SECONDARY} />
          </clipPath>
        </defs>
        <rect
          x={SECONDARY.x}
          y={secondaryY}
          width={SECONDARY.width}
          height={SECONDARY.height}
          fill={COLORS.slate}
          clipPath={`url(#${secondaryClipId})`}
        />

        <ClippedRect
          id={`${uid}-slate-main`}
          box={MAIN}
          fill={COLORS.ivory}
          mask={{
            ...MAIN,
            x: MAIN_CENTER_X - mainWidth / 2,
            width: mainWidth,
          }}
        />
      </svg>
    </AbsoluteFill>
  );
};
