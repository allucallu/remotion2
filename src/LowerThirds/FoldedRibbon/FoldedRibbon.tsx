import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const FOLDED_RIBBON_DURATION = 300;
export const FOLDED_RIBBON_FPS = 30;

export const FOLDED_RIBBON_PALETTE = {
  background: "#000000",
  accent: "#F2CF3A",
  fold: "#D0A91F",
  paper: "#FFF4D8",
  outline: "#1E1F1E",
  shadow: "#373734",
  dots: "#A98A20",
} as const;

const color = z.string().min(1);

export const foldedRibbonSchema = z.object({
  accentColor: color.default(FOLDED_RIBBON_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({
      x: z.number().min(40).max(500),
      y: z.number().min(500).max(860),
    })
    .default({ x: 100, y: 720 }),
});

export type FoldedRibbonProps = z.infer<typeof foldedRibbonSchema>;

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

const MAIN_WIDTH = 1120;
const SECONDARY_WIDTH = 650;
const SECONDARY_HEIGHT = 76;
const mainPath = "M 70 0 L 1100 0 L 1020 170 L 116 170 Z";
const secondaryPath = `M 0 0 L ${SECONDARY_WIDTH} 0 L ${SECONDARY_WIDTH - 38} ${SECONDARY_HEIGHT} L 25 ${SECONDARY_HEIGHT} Z`;

const dots = Array.from({ length: 48 }, (_, index) => ({
  column: index % 6,
  row: Math.floor(index / 6),
}));

const slashOffsets = [0, 24, 48] as const;

export const FoldedRibbon = ({
  accentColor = FOLDED_RIBBON_PALETTE.accent,
  scale = 1,
  position = { x: 100, y: 720 },
}: FoldedRibbonProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `folded-main-reveal-${uid}`;
  const mainShapeId = `folded-main-shape-${uid}`;
  const secondaryRevealId = `folded-secondary-reveal-${uid}`;

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
  const markerShift = (1 - markerIn) * -18 - markerOut * 18;
  const mainRevealWidth = (MAIN_WIDTH + 20) * mainIn * (1 - mainOut);
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * 22 + secondaryOut * 22;
  const decorationOpacity = decorationIn * decorationOut;

  return (
    <AbsoluteFill style={{ backgroundColor: FOLDED_RIBBON_PALETTE.background }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={mainRevealId}>
            <rect x={55} y={-24} width={mainRevealWidth} height={235} />
          </clipPath>
          <clipPath id={mainShapeId}>
            <path d={mainPath} />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={-20}
              y={-18}
              width={(SECONDARY_WIDTH + 55) * secondaryVisible}
              height={SECONDARY_HEIGHT + 44}
            />
          </clipPath>
        </defs>

        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g opacity={markerOpacity} transform={`translate(${markerShift} 0)`}>
            <path
              d="M 0 58 L 74 10 L 108 112 L 24 164 Z"
              fill={accentColor}
              stroke={FOLDED_RIBBON_PALETTE.outline}
              strokeWidth={7}
              strokeLinejoin="miter"
            />
            <path
              d="M 24 164 L 108 112 L 114 158 Z"
              fill={FOLDED_RIBBON_PALETTE.fold}
              stroke={FOLDED_RIBBON_PALETTE.outline}
              strokeWidth={6}
              strokeLinejoin="miter"
            />
          </g>

          <g clipPath={`url(#${mainRevealId})`}>
            <path
              d={mainPath}
              fill={FOLDED_RIBBON_PALETTE.shadow}
              transform="translate(9 14)"
            />
            <path
              d={mainPath}
              fill={accentColor}
              stroke={FOLDED_RIBBON_PALETTE.outline}
              strokeWidth={10}
              strokeLinejoin="miter"
            />
            <g
              clipPath={`url(#${mainShapeId})`}
              fill={FOLDED_RIBBON_PALETTE.dots}
              opacity={decorationOpacity}
            >
              {dots.map(({ column, row }, index) => (
                <circle
                  key={index}
                  cx={934 + column * 24}
                  cy={18 + row * 22}
                  r={2.6 + column * 0.6 + ((row + column) % 2) * 0.45}
                />
              ))}
            </g>
          </g>

          <g
            clipPath={`url(#${secondaryRevealId})`}
            opacity={secondaryVisible}
            transform={`translate(${410 - secondaryShift} 166)`}
          >
            <path
              d={secondaryPath}
              fill={FOLDED_RIBBON_PALETTE.shadow}
              transform="translate(5 10)"
            />
            <path
              d={secondaryPath}
              fill={FOLDED_RIBBON_PALETTE.paper}
              stroke={FOLDED_RIBBON_PALETTE.outline}
              strokeWidth={8}
              strokeLinejoin="miter"
            />
          </g>

          <g
            opacity={decorationOpacity}
            stroke={FOLDED_RIBBON_PALETTE.outline}
            strokeWidth={7}
            strokeLinecap="square"
          >
            {slashOffsets.map((offset) => (
              <path
                key={offset}
                d={`M ${1092 + offset} 118 L ${1132 + offset} 34`}
              />
            ))}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
