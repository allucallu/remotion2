import { Easing, interpolate, useCurrentFrame } from "remotion";
export const BRACKET_WIDTH = 3840,
  BRACKET_HEIGHT = 2160,
  BRACKET_FPS = 30,
  BRACKET_DURATION = 180;
const C = { background: "#000000", stroke: "#FFFFFF" } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.25, 0.1, 0.25, 1);
const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const left =
  "M 620 340 C 578 338 540 342 500 340 C 495 450 503 608 499 740 C 542 742 580 738 620 740";
const right =
  "M 1300 340 C 1342 337 1382 342 1420 340 C 1425 455 1417 606 1421 740 C 1379 742 1340 737 1300 740";
const Bracket = ({
  d,
  x,
  draw,
  opacity,
}: {
  d: string;
  x: number;
  draw: number;
  opacity: number;
}) => (
  <g transform={"translate(" + x + " 0)"} opacity={opacity}>
    <path
      d={d}
      fill="none"
      stroke={C.stroke}
      strokeWidth={17}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={100}
      strokeDasharray="100 100"
      strokeDashoffset={100 * (1 - draw)}
    />
  </g>
);
export const OpposingSketchBrackets = () => {
  const f = useCurrentFrame();
  const enter = p(f, 0, 23);
  const close = p(f, 24, 30);
  const settle = p(f, 30, 35);
  const exit = p(f, 150, 173);
  const inward = 18 * close - 6 * settle;
  return (
    <svg
      width={BRACKET_WIDTH}
      height={BRACKET_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: C.background }}
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={C.background} />
      <Bracket
        d={left}
        x={inward - 35 * exit}
        draw={enter}
        opacity={1 - exit}
      />
      <Bracket
        d={right}
        x={-inward + 35 * exit}
        draw={enter}
        opacity={1 - exit}
      />
    </svg>
  );
};
