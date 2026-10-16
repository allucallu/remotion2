import {Easing, interpolate, useCurrentFrame} from "remotion";

export const EDITORIAL_SERIF_IDENTIFIER_WIDTH = 3840;
export const EDITORIAL_SERIF_IDENTIFIER_HEIGHT = 2160;
export const EDITORIAL_SERIF_IDENTIFIER_FPS = 30;
export const EDITORIAL_SERIF_IDENTIFIER_DURATION = 300;

const PALETTE = {
  background: "#000000",
  ivory: "#F5EEDF",
} as const;

const VIEWBOX = {width: 1920, height: 1080} as const;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const enterEase = Easing.bezier(0.2, 0.8, 0.24, 1);
const exitEase = Easing.bezier(0.6, 0, 0.82, 0.28);

const progress = (frame: number, start: number, end: number, easing = enterEase) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing});

const RevealedPath = ({d, visible}: {d: string; visible: number}) => (
  <path
    d={d}
    fill="none"
    stroke={PALETTE.ivory}
    strokeWidth="7"
    strokeLinecap="square"
    strokeLinejoin="miter"
    pathLength={1}
    strokeDasharray="1"
    strokeDashoffset={1 - visible}
  />
);

export const EditorialSerifIdentifier = () => {
  const frame = useCurrentFrame();
  const indexVisible = progress(frame, 0, 17) * (1 - progress(frame, 280, 291, exitEase));
  const axisVisible = progress(frame, 12, 29) * (1 - progress(frame, 280, 291, exitEase));
  const baselineVisible = progress(frame, 22, 43) * (1 - progress(frame, 266, 283, exitEase));

  const axisHalfHeight = 102 * axisVisible;
  const baselineLength = 855 * baselineVisible;

  return (
    <svg
      width={EDITORIAL_SERIF_IDENTIFIER_WIDTH}
      height={EDITORIAL_SERIF_IDENTIFIER_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{display: "block", backgroundColor: PALETTE.background}}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />

      <RevealedPath d="M 104 879 V 796 H 184 V 879 H 104 Z" visible={indexVisible} />
      <path
        d={`M 230 ${870 - axisHalfHeight} V ${870 + axisHalfHeight}`}
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="7"
        strokeLinecap="square"
      />
      <path
        d={`M 280 870 H ${280 + baselineLength}`}
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="6"
        strokeLinecap="square"
      />
    </svg>
  );
};
