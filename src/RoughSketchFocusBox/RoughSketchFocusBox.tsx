import { Easing, interpolate, useCurrentFrame } from "remotion";
export const BOX_WIDTH = 3840,
  BOX_HEIGHT = 2160,
  BOX_FPS = 30,
  BOX_DURATION = 210;
const C = { background: "#000000", stroke: "#FFFFFF" } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.25, 0.1, 0.25, 1);
const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const variants = {
  top: [
    "M 460 302 C 700 297 975 306 1230 300 C 1320 298 1400 303 1474 298",
    "M 460 303 C 700 299 974 305 1230 301 C 1321 299 1400 304 1474 299",
    "M 460 301 C 699 298 976 307 1231 299 C 1320 297 1401 302 1475 300",
  ],
  right: [
    "M 1460 312 C 1456 430 1463 562 1458 680 C 1457 720 1461 754 1455 790",
    "M 1461 312 C 1457 429 1464 563 1459 680 C 1458 721 1462 754 1456 790",
    "M 1459 312 C 1455 431 1462 561 1457 681 C 1456 719 1460 755 1454 790",
  ],
  bottom: [
    "M 1470 780 C 1215 785 965 775 725 782 C 620 784 540 778 448 783",
    "M 1470 779 C 1215 784 965 776 724 783 C 620 785 540 779 448 782",
    "M 1471 781 C 1214 786 966 774 725 781 C 621 783 540 777 449 784",
  ],
  left: [
    "M 460 792 C 466 670 456 552 462 438 C 463 380 458 340 465 288",
    "M 461 792 C 467 670 457 552 463 438 C 464 380 459 340 466 288",
    "M 459 792 C 465 671 455 551 461 438 C 462 381 457 340 464 288",
  ],
} as const;
const accents = [
  "M 1490 280 Q 1515 255 1540 235",
  "M 1505 315 Q 1540 310 1575 305",
] as const;
const Side = ({
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
export const RoughSketchFocusBox = () => {
  const f = useCurrentFrame(),
    v = Math.floor(f / 5) % 3;
  const sides = [
    { d: variants.top[v], w: 15, i: 0, o: 0, e: 184 },
    { d: variants.right[v], w: 14, i: 8, o: 8, e: 190 },
    { d: variants.bottom[v], w: 15, i: 16, o: 16, e: 196 },
    { d: variants.left[v], w: 13, i: 24, o: 24, e: 202 },
  ];
  return (
    <svg
      width={BOX_WIDTH}
      height={BOX_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: C.background }}
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={C.background} />
      {sides.map((s) => (
        <Side
          key={s.i}
          d={s.d}
          w={s.w}
          draw={p(f, s.i, s.i + 7)}
          erase={p(f, s.e, s.e + 5)}
        />
      ))}
      {accents.map((d, i) => (
        <Side
          key={d}
          d={d}
          w={11}
          draw={p(f, 32 + i * 1, 35)}
          erase={p(f, 180, 183)}
        />
      ))}
    </svg>
  );
};
