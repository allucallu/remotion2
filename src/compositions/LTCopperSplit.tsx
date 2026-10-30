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
  copper: '#B96F47',
} as const;

const MAIN: Rectangle = {x: 225, y: 1390, width: 2430, height: 360};
const END_CAP: Rectangle = {x: 2680, y: 1390, width: 310, height: 360};
const SECONDARY: Rectangle = {x: 225, y: 1770, width: 2050, height: 160};
const SLOT_TOP: Rectangle = {x: 2740, y: 1510, width: 190, height: 35};
const SLOT_BOTTOM: Rectangle = {x: 2740, y: 1580, width: 190, height: 35};

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

const Clip = ({id, box, mask, fill}: {
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

// Registered at 3840x2160, 30 fps, durationInFrames: 360.
// Shapes remain at their final dimensions; only their SVG clipping rectangles
// change, preserving the mechanical end-cap anchor and exact 25px gap.
export const LTCopperSplit = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const uid = useId().replace(/:/g, '');

  const capIn = animate(time, [0.1, 0.6], [0, 1], ENTER_EASING);
  const mainIn = animate(time, [0.4, 1.35], [0, 1], ENTER_EASING);
  const secondaryIn = animate(time, [0.95, 1.75], [0, 1], ENTER_EASING);
  const topSlotIn = animate(time, [0.7, 1.1], [0, 1], ENTER_EASING);
  const bottomSlotIn = animate(time, [0.85, 1.25], [0, 1], ENTER_EASING);

  const secondaryOut = animate(time, [10, 10.6], [0, 1], EXIT_EASING);
  const mainOut = animate(time, [10.2, 11.15], [0, 1], EXIT_EASING);
  const bottomSlotOut = animate(time, [10.8, 11.15], [0, 1], EXIT_EASING);
  const topSlotOut = animate(time, [10.95, 11.3], [0, 1], EXIT_EASING);
  const capOut = animate(time, [11.25, 11.75], [0, 1], EXIT_EASING);

  const capHeight = END_CAP.height * capIn * (1 - capOut);
  const mainWidth = MAIN.width * mainIn * (1 - mainOut);
  const secondaryWidth = SECONDARY.width * secondaryIn * (1 - secondaryOut);
  const topSlotWidth = SLOT_TOP.width * topSlotIn * (1 - topSlotOut);
  const bottomSlotWidth = SLOT_BOTTOM.width * bottomSlotIn * (1 - bottomSlotOut);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background, overflow: 'hidden'}}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 3840 2160"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="crispEdges"
        style={{display: 'block'}}
      >
        <Clip
          id={`${uid}-copper-secondary`}
          box={SECONDARY}
          fill={COLORS.copper}
          mask={{...SECONDARY, width: secondaryWidth}}
        />
        <Clip
          id={`${uid}-copper-main`}
          box={MAIN}
          fill={COLORS.ivory}
          mask={{
            ...MAIN,
            x: MAIN.x + MAIN.width - mainWidth,
            width: mainWidth,
          }}
        />
        <Clip
          id={`${uid}-copper-end-cap`}
          box={END_CAP}
          fill={COLORS.copper}
          mask={{
            ...END_CAP,
            y: END_CAP.y + END_CAP.height - capHeight,
            height: capHeight,
          }}
        />
        <Clip
          id={`${uid}-copper-slot-top`}
          box={SLOT_TOP}
          fill={COLORS.ivory}
          mask={{...SLOT_TOP, width: topSlotWidth}}
        />
        <Clip
          id={`${uid}-copper-slot-bottom`}
          box={SLOT_BOTTOM}
          fill={COLORS.ivory}
          mask={{...SLOT_BOTTOM, width: bottomSlotWidth}}
        />
      </svg>
    </AbsoluteFill>
  );
};
