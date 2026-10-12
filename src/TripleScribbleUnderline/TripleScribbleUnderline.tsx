import { Easing, interpolate, useCurrentFrame } from "remotion";

export const TRIPLE_SCRIBBLE_WIDTH = 3840;
export const TRIPLE_SCRIBBLE_HEIGHT = 2160;
export const TRIPLE_SCRIBBLE_FPS = 30;
export const TRIPLE_SCRIBBLE_DURATION = 150;

const COLORS = { background: "#000000", stroke: "#FFFFFF" } as const;
const PATH_LENGTH = 100;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const markerEase = Easing.bezier(0.25, 0.1, 0.25, 1);
const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing: markerEase });

const Stroke = ({
  d,
  width,
  draw,
  opacity,
}: {
  d: string;
  width: number;
  draw: number;
  opacity: number;
}) => (
  <path
    d={d}
    fill="none"
    stroke={COLORS.stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={PATH_LENGTH}
    strokeDasharray="100 100"
    strokeDashoffset={PATH_LENGTH * (1 - draw)}
    opacity={opacity}
  />
);

export const TripleScribbleUnderline = () => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={TRIPLE_SCRIBBLE_WIDTH}
      height={TRIPLE_SCRIBBLE_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: COLORS.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={COLORS.background} />
      <Stroke
        d="M 530 620 C 710 616 850 628 1028 617 C 1165 608 1274 611 1390 610"
        width={22}
        draw={progress(frame, 0, 9)}
        opacity={1 - progress(frame, 142, 147)}
      />
      <Stroke
        d="M 1320 651 C 1152 654 1018 648 878 658 C 758 667 682 663 610 664"
        width={16}
        draw={progress(frame, 10, 18)}
        opacity={1 - progress(frame, 134, 141)}
      />
      <Stroke
        d="M 850 700 C 928 697 1017 704 1110 690"
        width={12}
        draw={progress(frame, 19, 23)}
        opacity={1 - progress(frame, 126, 133)}
      />
    </svg>
  );
};
