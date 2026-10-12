import { Easing, interpolate, useCurrentFrame } from "remotion";
export const CHECK_WIDTH = 3840,
  CHECK_HEIGHT = 2160,
  CHECK_FPS = 30,
  CHECK_DURATION = 150;
const C = { background: "#000000", stroke: "#FFFFFF" } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.25, 0.1, 0.25, 1);
const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const check = "M 650 535 Q 760 650 850 725 Q 1060 520 1290 330";
const companion = "M 938 640 Q 1015 565 1097 492";
const Stroke = ({
  d,
  w,
  draw,
  erase,
}: {
  d: string;
  w: number;
  draw: number;
  erase: number;
}) => (
  <path
    d={d}
    fill="none"
    stroke={C.stroke}
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={100}
    strokeDasharray="100 100"
    strokeDashoffset={100 * (1 - draw) - 100 * erase}
  />
);
export const SketchCheckmark = () => {
  const f = useCurrentFrame();
  const settle = p(f, 26, 30) * (1 - p(f, 31, 35));
  const mainDraw = f < 8 ? p(f, 0, 7) * 0.35 : 0.35 + 0.65 * p(f, 8, 19);
  return (
    <svg
      width={CHECK_WIDTH}
      height={CHECK_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: C.background }}
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={C.background} />
      <g transform={"translate(0 " + -8 * settle + ")"}>
        <Stroke d={check} w={26} draw={mainDraw} erase={p(f, 126, 147)} />
        <Stroke
          d="M 780 665 Q 815 700 850 725"
          w={30}
          draw={mainDraw}
          erase={p(f, 126, 147)}
        />
        <Stroke
          d={companion}
          w={9}
          draw={p(f, 20, 25)}
          erase={p(f, 126, 140)}
        />
      </g>
    </svg>
  );
};
