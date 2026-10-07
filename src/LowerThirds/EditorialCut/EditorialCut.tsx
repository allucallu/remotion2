import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const EDITORIAL_CUT_DURATION = 300;
export const EDITORIAL_CUT_FPS = 30;

export const EDITORIAL_CUT_PALETTE = {
  background: "#000000",
  paper: "#FFF3D6",
  accent: "#C9573F",
  accentDark: "#963C30",
  outline: "#171717",
  shadow: "#2A2A28",
} as const;

const color = z.string().min(1);

export const editorialCutSchema = z.object({
  accentColor: color.default(EDITORIAL_CUT_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({
      x: z.number().min(40).max(500),
      y: z.number().min(500).max(900),
    })
    .default({ x: 112, y: 760 }),
});

export type EditorialCutProps = z.infer<typeof editorialCutSchema>;

const ease = (
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

const dots = Array.from({ length: 54 }, (_, index) => ({
  column: index % 9,
  row: Math.floor(index / 9),
}));

const MAIN_WIDTH = 1120;
const SECONDARY_X = 610;
const SECONDARY_Y = 152;
const SECONDARY_WIDTH = 520;
const SECONDARY_HEIGHT = 96;

const mainPath = `M 10 8 L 994 8 L 1062 72 L 1102 176 L 44 176 Z`;
const secondaryPath = `M 0 0 L ${SECONDARY_WIDTH} 0 L ${SECONDARY_WIDTH - 48} ${SECONDARY_HEIGHT} L 34 ${SECONDARY_HEIGHT} Z`;

export const EditorialCut = ({
  accentColor = EDITORIAL_CUT_PALETTE.accent,
  scale = 1,
  position = { x: 112, y: 760 },
}: EditorialCutProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `editorial-main-reveal-${uid}`;
  const mainShapeId = `editorial-main-shape-${uid}`;
  const secondaryRevealId = `editorial-secondary-reveal-${uid}`;

  const markerIn = ease(
    frame,
    [0.25 * fps, 0.55 * fps],
    [0, 1],
    Easing.out(Easing.cubic),
  );
  const mainIn = ease(
    frame,
    [0.4 * fps, 1 * fps],
    [0, 1],
    Easing.out(Easing.cubic),
  );
  const secondaryIn = ease(
    frame,
    [0.85 * fps, 1.3 * fps],
    [0, 1],
    Easing.out(Easing.cubic),
  );
  const decorationIn = ease(
    frame,
    [1.05 * fps, 1.5 * fps],
    [0, 1],
    Easing.out(Easing.cubic),
  );

  const decorationOut = ease(
    frame,
    [8 * fps, 8.3 * fps],
    [1, 0],
    Easing.in(Easing.cubic),
  );
  const secondaryOut = ease(
    frame,
    [8.2 * fps, 8.7 * fps],
    [0, 1],
    Easing.in(Easing.cubic),
  );
  const mainOut = ease(
    frame,
    [8.55 * fps, 9.2 * fps],
    [0, 1],
    Easing.in(Easing.cubic),
  );
  const markerOut = ease(
    frame,
    [9.1 * fps, 9.5 * fps],
    [0, 1],
    Easing.in(Easing.cubic),
  );

  const markerOpacity = markerIn * (1 - markerOut);
  const markerShift = (1 - markerIn) * -18 - markerOut * 18;
  const mainRevealWidth = (MAIN_WIDTH + 30) * mainIn * (1 - mainOut);
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * 22 + secondaryOut * 22;
  const decorationOpacity = decorationIn * decorationOut;

  return (
    <AbsoluteFill style={{ backgroundColor: EDITORIAL_CUT_PALETTE.background }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={mainRevealId}>
            <rect x={-36} y={-38} width={mainRevealWidth} height={290} />
          </clipPath>
          <clipPath id={mainShapeId}>
            <path d={mainPath} />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={-28}
              y={-28}
              width={(SECONDARY_WIDTH + 70) * secondaryVisible}
              height={SECONDARY_HEIGHT + 70}
            />
          </clipPath>
        </defs>

        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g opacity={markerOpacity} transform={`translate(${markerShift} 0)`}>
            <path
              d="M -8 30 L 54 30 L 92 176 L 20 176 Z"
              fill={EDITORIAL_CUT_PALETTE.shadow}
            />
            <path
              d="M 8 14 L 64 14 L 88 106 L 40 128 Z"
              fill={accentColor}
              stroke={EDITORIAL_CUT_PALETTE.outline}
              strokeWidth={8}
              strokeLinejoin="miter"
            />
          </g>

          <g clipPath={`url(#${mainRevealId})`}>
            <path
              d={mainPath}
              fill={EDITORIAL_CUT_PALETTE.shadow}
              transform="translate(-16 20)"
            />
            <path
              d={mainPath}
              fill={EDITORIAL_CUT_PALETTE.paper}
              stroke={EDITORIAL_CUT_PALETTE.outline}
              strokeWidth={10}
              strokeLinejoin="miter"
            />
            <g clipPath={`url(#${mainShapeId})`} opacity={decorationOpacity}>
              {dots.map(({ column, row }, index) => {
                const radius = 1.8 + column * 0.55 + row * 0.1;
                return (
                  <circle
                    key={index}
                    cx={936 + column * 18}
                    cy={24 + row * 25}
                    r={radius}
                    fill={accentColor}
                  />
                );
              })}
            </g>
            <path
              d="M 1001 12 L 1062 72 L 1084 128"
              fill="none"
              stroke={accentColor}
              strokeWidth={5}
              strokeLinejoin="miter"
              opacity={decorationOpacity}
            />
          </g>

          <g
            clipPath={`url(#${secondaryRevealId})`}
            transform={`translate(${SECONDARY_X} ${SECONDARY_Y + secondaryShift})`}
            opacity={secondaryVisible}
          >
            <path
              d={secondaryPath}
              fill={EDITORIAL_CUT_PALETTE.shadow}
              transform="translate(-10 16)"
            />
            <path
              d={secondaryPath}
              fill={accentColor}
              stroke={EDITORIAL_CUT_PALETTE.outline}
              strokeWidth={10}
              strokeLinejoin="miter"
            />
          </g>

          <g opacity={decorationOpacity}>
            <path d="M 35 188 L 112 188" stroke={accentColor} strokeWidth={5} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
