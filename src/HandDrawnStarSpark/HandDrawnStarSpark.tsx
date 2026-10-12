import { Easing, interpolate, useCurrentFrame } from "remotion";
export const STAR_WIDTH = 3840,
  STAR_HEIGHT = 2160,
  STAR_FPS = 30,
  STAR_DURATION = 150;
const C = { background: "#000000", stroke: "#FFFFFF" } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.25, 0.1, 0.25, 1);
const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const star =
  "M 991 316 L 1032 447 L 1176 450 L 1058 532 L 1096 670 L 982 592 L 866 675 L 904 538 L 789 455 L 934 447 Z";
const accents = [
  "M 1190 370 L 1252 337",
  "M 740 378 L 685 344",
  "M 1173 705 L 1230 738",
] as const;
const Line = ({
  d,
  w,
  draw,
  opacity,
}: {
  d: string;
  w: number;
  draw: number;
  opacity: number;
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
    strokeDashoffset={100 * (1 - draw)}
    opacity={opacity}
  />
);
export const HandDrawnStarSpark = () => {
  const f = useCurrentFrame();
  const pop = p(f, 33, 38) * (1 - p(f, 39, 44));
  const scale = 1 + 0.06 * pop;
  const accentOpacity = 1 - p(f, 126, 137);
  const starOpacity = 1 - p(f, 132, 147);
  const shrink = 1 - 0.06 * p(f, 132, 147);
  return (
    <svg
      width={STAR_WIDTH}
      height={STAR_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: C.background }}
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={C.background} />
      <g
        transform={
          "translate(960 540) scale(" +
          scale * shrink +
          ") translate(-960 -540)"
        }
        opacity={starOpacity}
      >
        <Line d={star} w={15} draw={p(f, 0, 23)} opacity={1} />
      </g>
      <g
        transform={
          "translate(960 540) scale(" + scale + ") translate(-960 -540)"
        }
        opacity={accentOpacity}
      >
        {accents.map((d, i) => (
          <Line
            key={d}
            d={d}
            w={12}
            draw={p(f, 24 + i * 3, 27 + i * 3)}
            opacity={1}
          />
        ))}
      </g>
    </svg>
  );
};
