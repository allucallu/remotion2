import { Easing, interpolate, useCurrentFrame } from "remotion";
export const SPIRAL_WIDTH = 3840,
  SPIRAL_HEIGHT = 2160,
  SPIRAL_FPS = 30,
  SPIRAL_DURATION = 180;
const C = { background: "#000000", stroke: "#FFFFFF" } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.34, 0.06, 0.22, 1);
const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const spiral =
  "M 1380 345 C 1510 425 1518 635 1375 755 C 1215 885 705 850 510 680 C 350 535 420 350 610 275 C 825 190 1225 220 1380 345 C 1470 420 1460 585 1330 690 C 1180 810 790 780 635 650 C 520 555 570 420 720 365 C 895 300 1190 325 1330 425 C 1415 488 1390 605 1280 670";
export const SpiralFocusCircle = () => {
  const f = useCurrentFrame();
  const draw = p(f, 0, 35),
    erase = p(f, 144, 173);
  return (
    <svg
      width={SPIRAL_WIDTH}
      height={SPIRAL_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: C.background }}
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={C.background} />
      <path
        d={spiral}
        fill="none"
        stroke={C.stroke}
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        strokeDasharray="100 100"
        strokeDashoffset={100 * (1 - draw) - 100 * erase}
      />
    </svg>
  );
};
