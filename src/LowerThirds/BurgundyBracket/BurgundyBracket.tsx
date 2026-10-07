import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const BURGUNDY_BRACKET_DURATION = 300;
export const BURGUNDY_BRACKET_FPS = 30;
export const BURGUNDY_BRACKET_PALETTE = {
  background: "#000000",
  accent: "#A62F46",
  accentDark: "#812537",
  paper: "#FFF7DD",
  outline: "#292A2A",
  shadow: "#414242",
  dots: "#C65B6D",
} as const;

const color = z.string().min(1);
export const burgundyBracketSchema = z.object({
  accentColor: color.default(BURGUNDY_BRACKET_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({ x: z.number().min(40).max(500), y: z.number().min(500).max(860) })
    .default({ x: 96, y: 720 }),
});
export type BurgundyBracketProps = z.infer<typeof burgundyBracketSchema>;

const tween = (
  frame: number,
  input: readonly [number, number],
  output: readonly [number, number],
  easing: (value: number) => number,
) =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const MAIN_WIDTH = 1190;
const SECONDARY_WIDTH = 610;
const mainPath =
  "M 90 8 L 1070 8 L 1142 112 L 1072 218 L 72 218 L 8 157 L 70 62 Z";
const secondaryPath = `M 68 0 L ${SECONDARY_WIDTH - 34} 0 L ${SECONDARY_WIDTH} 38 L ${SECONDARY_WIDTH - 34} 84 L 34 84 L 4 44 Z`;
const bracketPath = "M 0 0 L 38 0 L 104 108 L 46 214 L 8 214 L 64 108 Z";
const dots = Array.from({ length: 42 }, (_, index) => ({
  column: index % 7,
  row: Math.floor(index / 7),
}));

export const BurgundyBracket = ({
  accentColor = BURGUNDY_BRACKET_PALETTE.accent,
  scale = 1,
  position = { x: 96, y: 720 },
}: BurgundyBracketProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `burgundy-main-${uid}`;
  const mainShapeId = `burgundy-shape-${uid}`;
  const secondaryRevealId = `burgundy-secondary-${uid}`;

  const markerIn = tween(
    frame,
    [0.25 * fps, 0.55 * fps],
    [0, 1],
    Easing.out(Easing.cubic),
  );
  const mainIn = tween(
    frame,
    [0.4 * fps, 1 * fps],
    [0, 1],
    Easing.out(Easing.cubic),
  );
  const secondaryIn = tween(
    frame,
    [0.85 * fps, 1.3 * fps],
    [0, 1],
    Easing.out(Easing.cubic),
  );
  const decorationIn = tween(
    frame,
    [1.05 * fps, 1.5 * fps],
    [0, 1],
    Easing.out(Easing.cubic),
  );
  const decorationOut = tween(
    frame,
    [8 * fps, 8.3 * fps],
    [1, 0],
    Easing.in(Easing.cubic),
  );
  const secondaryOut = tween(
    frame,
    [8.2 * fps, 8.7 * fps],
    [0, 1],
    Easing.in(Easing.cubic),
  );
  const mainOut = tween(
    frame,
    [8.55 * fps, 9.2 * fps],
    [0, 1],
    Easing.in(Easing.cubic),
  );
  const markerOut = tween(
    frame,
    [9.1 * fps, 9.5 * fps],
    [0, 1],
    Easing.in(Easing.cubic),
  );

  const markerOpacity = markerIn * (1 - markerOut);
  const markerShift = (1 - markerIn) * 18 + markerOut * 18;
  const mainWidth = (MAIN_WIDTH + 18) * mainIn * (1 - mainOut);
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * -22 - secondaryOut * 22;
  const decorationOpacity = decorationIn * decorationOut;

  return (
    <AbsoluteFill
      style={{ backgroundColor: BURGUNDY_BRACKET_PALETTE.background }}
    >
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={mainRevealId}>
            <rect x={-12} y={-18} width={mainWidth} height={260} />
          </clipPath>
          <clipPath id={mainShapeId}>
            <path d={mainPath} />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={-15}
              y={-15}
              width={(SECONDARY_WIDTH + 35) * secondaryVisible}
              height={112}
            />
          </clipPath>
        </defs>
        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g
            opacity={markerOpacity}
            transform={`translate(${1166 + markerShift} 4)`}
          >
            <path
              d={bracketPath}
              fill={BURGUNDY_BRACKET_PALETTE.shadow}
              transform="translate(10 10)"
            />
            <path
              d={bracketPath}
              fill={BURGUNDY_BRACKET_PALETTE.paper}
              stroke={BURGUNDY_BRACKET_PALETTE.outline}
              strokeWidth={9}
              strokeLinejoin="miter"
            />
          </g>

          <g clipPath={`url(#${mainRevealId})`}>
            <path
              d={mainPath}
              fill={BURGUNDY_BRACKET_PALETTE.shadow}
              transform="translate(8 11)"
            />
            <path
              d={mainPath}
              fill={accentColor}
              stroke={BURGUNDY_BRACKET_PALETTE.outline}
              strokeWidth={10}
              strokeLinejoin="miter"
            />
            <path
              d="M 78 19 L 1058 19 L 1070 36 L 83 36 Z"
              fill={BURGUNDY_BRACKET_PALETTE.accentDark}
              opacity={0.55}
            />
            <g
              clipPath={`url(#${mainShapeId})`}
              fill={BURGUNDY_BRACKET_PALETTE.dots}
              opacity={decorationOpacity}
            >
              {dots.map(({ column, row }, index) => (
                <circle
                  key={index}
                  cx={916 + column * 25}
                  cy={58 + row * 25}
                  r={2.1 + column * 0.7 + row * 0.16}
                />
              ))}
            </g>
          </g>

          <g
            clipPath={`url(#${secondaryRevealId})`}
            opacity={secondaryVisible}
            transform={`translate(${38 + secondaryShift} 196)`}
          >
            <path
              d={secondaryPath}
              fill={BURGUNDY_BRACKET_PALETTE.shadow}
              transform="translate(7 9)"
            />
            <path
              d={secondaryPath}
              fill={BURGUNDY_BRACKET_PALETTE.paper}
              stroke={BURGUNDY_BRACKET_PALETTE.outline}
              strokeWidth={9}
              strokeLinejoin="miter"
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
