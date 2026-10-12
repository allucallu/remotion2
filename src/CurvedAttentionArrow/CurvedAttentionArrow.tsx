import { Easing, interpolate, useCurrentFrame } from "remotion";

export const CURVED_ARROW_WIDTH = 3840;
export const CURVED_ARROW_HEIGHT = 2160;
export const CURVED_ARROW_FPS = 30;
export const CURVED_ARROW_DURATION = 180;

const COLORS = { background: "#000000", stroke: "#FFFFFF" } as const;
const PATH_LENGTH = 100;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = Easing.bezier(0.37, 0, 0.63, 1);

const progress = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { ...clamp, easing: smooth });

const dashOffset = (draw: number) => PATH_LENGTH * (1 - draw);

const ArrowPath = ({
  d,
  width,
  draw,
  retract = 0,
}: {
  d: string;
  width: number;
  draw: number;
  retract?: number;
}) => (
  <path
    d={d}
    fill="none"
    stroke={COLORS.stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={PATH_LENGTH}
    strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
    strokeDashoffset={dashOffset(draw) + PATH_LENGTH * retract}
  />
);

export const CurvedAttentionArrow = () => {
  const frame = useCurrentFrame();
  const bendPhase = progress(frame, 31, 44);
  const bend = Math.sin(Math.PI * bendPhase) * (1 - bendPhase) * 16;
  const mainDraw = progress(frame, 0, 20);
  const headOneDraw = progress(frame, 21, 25);
  const headTwoDraw = progress(frame, 26, 30);
  const headRetract = progress(frame, 150, 156);
  const shaftRetract = progress(frame, 154, 173);

  const tipX = 1320 + bend * 0.75;
  const tipY = 410 - bend * 0.35;
  const mainPath = `M 570 760 C ${603 + bend * 0.12} ${600 + bend * 0.34} ${664 + bend * 0.42} ${440 - bend * 0.34} ${822 + bend * 0.54} ${390 - bend * 0.55} C ${1002 + bend * 0.7} ${330 - bend * 0.74} ${1170 + bend * 0.65} ${345 - bend * 0.42} ${tipX} ${tipY}`;
  const headOne = `M ${1228 + bend * 0.38} ${310 - bend * 0.52} C ${1260 + bend * 0.55} ${338 - bend * 0.3} ${1289 + bend * 0.68} ${380 - bend * 0.18} ${tipX} ${tipY}`;
  const headTwo = `M ${1208 + bend * 0.2} ${474 - bend * 0.05} C ${1252 + bend * 0.44} ${456 - bend * 0.25} ${1280 + bend * 0.6} ${430 - bend * 0.3} ${tipX} ${tipY}`;

  return (
    <svg
      width={CURVED_ARROW_WIDTH}
      height={CURVED_ARROW_HEIGHT}
      viewBox="0 0 1920 1080"
      style={{ display: "block", backgroundColor: COLORS.background }}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <rect width={1920} height={1080} fill={COLORS.background} />
      <g>
        <ArrowPath
          d={mainPath}
          width={16}
          draw={mainDraw}
          retract={shaftRetract}
        />
        <g opacity={1 - headRetract}>
          <ArrowPath d={headOne} width={15} draw={headOneDraw} />
          <ArrowPath d={headTwo} width={14} draw={headTwoDraw} />
        </g>
      </g>
    </svg>
  );
};
