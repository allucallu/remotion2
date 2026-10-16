import { Easing, interpolate, useCurrentFrame } from "remotion";

export const HALLOWEEN_CANDLE_WIDTH = 3840;
export const HALLOWEEN_CANDLE_HEIGHT = 2160;
export const HALLOWEEN_CANDLE_FPS = 30;
export const HALLOWEEN_CANDLE_DURATION = 300;

const PALETTE = {
  background: "#000000",
  candle: "#6E4D82",
  wax: "#9B7AB1",
  wick: "#25232A",
  flameOuter: "#F0781C",
  flameInner: "#F4E7CD",
} as const;

const VIEWBOX = { width: 1920, height: 1080 } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.18, 0.76, 0.24, 1);
const easeIn = Easing.bezier(0.58, 0, 0.82, 0.32);
const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);

const progress = (frame: number, start: number, end: number, easing = easeInOut) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing });

const outerFlamePath = (tipShift: number, height: number) => {
  const tipY = 220 - (height - 1) * 215;
  const upperRightY = 308 - (height - 1) * 120;
  return `M 960 452
    C 909 425 890 379 906 330
    C 923 278 ${955 + tipShift * 0.45} 246 ${963 + tipShift} ${tipY}
    C ${1001 + tipShift * 0.65} 269 1028 300 ${1033 + tipShift * 0.25} ${upperRightY}
    C 1044 375 1012 426 960 452 Z`;
};

const innerFlamePath = (tipShift: number, height: number) => {
  const tipY = 305 - (height - 1) * 108;
  return `M 960 447
    C 934 427 925 393 934 362
    C 942 334 ${954 + tipShift * 0.55} 320 ${962 + tipShift} ${tipY}
    C ${985 + tipShift * 0.45} 338 1001 364 1001 391
    C 1001 420 983 439 960 447 Z`;
};

const Drip = ({
  x,
  width,
  bottom,
  extra,
}: {
  x: number;
  width: number;
  bottom: number;
  extra: number;
}) => {
  const left = x - width / 2;
  const right = x + width / 2;
  const finalBottom = bottom + extra;
  return (
    <path
      d={`M ${left} 504 L ${right} 504 L ${right} ${finalBottom - 34}
        C ${right} ${finalBottom - 10} ${right - width * 0.18} ${finalBottom} ${x} ${finalBottom}
        C ${left + width * 0.18} ${finalBottom} ${left} ${finalBottom - 10} ${left} ${finalBottom - 34} Z`}
      fill={PALETTE.wax}
    />
  );
};

export const HalloweenCandle = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 23, easeOut);
  const exit = progress(frame, 270, 293, easeIn);
  const candleOpacity = Math.min(enter, 1 - exit);
  const candleY = interpolate(enter, [0, 1], [30, 0]) + interpolate(exit, [0, 1], [0, 30]);

  const idleFrame = Math.max(0, frame - 42);
  const hold = progress(frame, 42, 54, easeOut) * (1 - progress(frame, 251, 269, easeIn));
  const tipShift = hold * (6.5 * Math.sin((idleFrame / 73) * Math.PI * 2) + 2 * Math.sin((idleFrame / 31) * Math.PI * 2 + 0.8));
  const outerHeight = 1 + hold * (0.04 * Math.sin((idleFrame / 59) * Math.PI * 2 + 0.3));
  const innerShift = tipShift * 0.52;
  const innerHeight = 1 + hold * (0.024 * Math.sin((idleFrame / 59) * Math.PI * 2 + 0.5));
  const waxProgress = progress(frame, 42, 251, easeInOut);

  const outerFlameEnter = progress(frame, 24, 41, easeOut);
  const outerFlameExit = progress(frame, 252, 269, easeIn);
  const outerFlameVisible = outerFlameEnter * (1 - outerFlameExit);
  const innerFlameEnter = progress(frame, 28, 41, easeOut);
  const innerFlameExit = progress(frame, 252, 265, easeIn);
  const innerFlameVisible = innerFlameEnter * (1 - innerFlameExit);

  return (
    <svg
      width={HALLOWEEN_CANDLE_WIDTH}
      height={HALLOWEEN_CANDLE_HEIGHT}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={{ display: "block", backgroundColor: PALETTE.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill={PALETTE.background} />

      <g opacity={candleOpacity} transform={`translate(0 ${candleY})`}>
        <path
          d="M 720 500 C 720 467 827 440 960 440 C 1093 440 1200 467 1200 500 L 1200 808 C 1200 858 1092 890 960 890 C 828 890 720 858 720 808 Z"
          fill={PALETTE.candle}
        />
        <ellipse cx={960} cy={500} rx={240} ry={60} fill={PALETTE.wax} />
        <path d="M 720 500 C 760 530 1160 530 1200 500 L 1200 548 C 1150 572 1094 581 1032 582 L 888 582 C 826 580 770 570 720 548 Z" fill={PALETTE.wax} />

        <Drip x={803} width={78} bottom={620} extra={waxProgress * 8} />
        <Drip x={960} width={104} bottom={690} extra={waxProgress * 17} />
        <Drip x={1118} width={74} bottom={646} extra={waxProgress * 6} />

        {outerFlameVisible > 0.0001 ? (
          <g transform={`translate(960 452) scale(${outerFlameVisible}) translate(-960 -452)`}>
            <path d={outerFlamePath(tipShift, outerHeight)} fill={PALETTE.flameOuter} />
          </g>
        ) : null}
        {innerFlameVisible > 0.0001 ? (
          <g transform={`translate(960 447) scale(${innerFlameVisible}) translate(-960 -447)`}>
            <path d={innerFlamePath(innerShift, innerHeight)} fill={PALETTE.flameInner} />
          </g>
        ) : null}
        <path d="M 949 474 C 949 448 953 427 960 416 C 967 427 971 448 971 474 L 968 489 L 952 489 Z" fill={PALETTE.wick} />
      </g>
    </svg>
  );
};
