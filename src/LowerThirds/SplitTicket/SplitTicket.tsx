import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const SPLIT_TICKET_DURATION = 300;
export const SPLIT_TICKET_FPS = 30;
export const SPLIT_TICKET_PALETTE = {
  background: "#000000",
  accent: "#78A9E6",
  paper: "#FFF8E5",
  panel: "#252624",
  outline: "#1C1D1C",
  shadow: "#3A3B38",
  dots: "#B8B9B5",
} as const;

const color = z.string().min(1);
export const splitTicketSchema = z.object({
  accentColor: color.default(SPLIT_TICKET_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({ x: z.number().min(40).max(500), y: z.number().min(500).max(860) })
    .default({ x: 96, y: 730 }),
});
export type SplitTicketProps = z.infer<typeof splitTicketSchema>;

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
  "M 150 8 L 1085 8 L 1070 64 L 1140 64 L 1124 126 L 1062 126 L 1048 174 L 128 174 Z";
const secondaryPath = `M 0 0 L ${SECONDARY_WIDTH} 0 L ${SECONDARY_WIDTH - 36} 72 L 18 72 Z`;
const dots = Array.from({ length: 55 }, (_, index) => ({
  column: index % 7,
  row: Math.floor(index / 7),
}));

export const SplitTicket = ({
  accentColor = SPLIT_TICKET_PALETTE.accent,
  scale = 1,
  position = { x: 96, y: 730 },
}: SplitTicketProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `split-main-${uid}`;
  const mainShapeId = `split-shape-${uid}`;
  const secondaryRevealId = `split-secondary-${uid}`;

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
  const mainWidth = (MAIN_WIDTH + 20) * mainIn * (1 - mainOut);
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * 22 + secondaryOut * 22;
  const decorationOpacity = decorationIn * decorationOut;

  return (
    <AbsoluteFill style={{ backgroundColor: SPLIT_TICKET_PALETTE.background }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={mainRevealId}>
            <rect x={110} y={-24} width={mainWidth} height={235} />
          </clipPath>
          <clipPath id={mainShapeId}>
            <path d={mainPath} />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={-18}
              y={-16}
              width={(SECONDARY_WIDTH + 50) * secondaryVisible}
              height={110}
            />
          </clipPath>
        </defs>
        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g opacity={markerOpacity} transform={`translate(${markerShift} 0)`}>
            <path
              d="M 20 0 L 174 0 L 142 202 L 0 202 Z"
              fill={SPLIT_TICKET_PALETTE.panel}
              stroke={SPLIT_TICKET_PALETTE.outline}
              strokeWidth={8}
            />
            <path d="M 118 8 L 151 8 L 122 194 L 88 194 Z" fill={accentColor} />
          </g>
          <g clipPath={`url(#${mainRevealId})`}>
            <path
              d={mainPath}
              fill={SPLIT_TICKET_PALETTE.shadow}
              transform="translate(9 12)"
            />
            <path
              d={mainPath}
              fill={SPLIT_TICKET_PALETTE.paper}
              stroke={SPLIT_TICKET_PALETTE.outline}
              strokeWidth={10}
              strokeLinejoin="miter"
            />
            <g
              clipPath={`url(#${mainShapeId})`}
              fill={SPLIT_TICKET_PALETTE.dots}
              opacity={decorationOpacity}
            >
              {dots.map(({ column, row }, index) => (
                <circle
                  key={index}
                  cx={920 + column * 25}
                  cy={20 + row * 21}
                  r={2.2 + column * 0.65 + ((column + row) % 2) * 0.4}
                />
              ))}
            </g>
          </g>
          <g
            clipPath={`url(#${secondaryRevealId})`}
            opacity={secondaryVisible}
            transform={`translate(${130 - secondaryShift} 166)`}
          >
            <path
              d={secondaryPath}
              fill={SPLIT_TICKET_PALETTE.shadow}
              transform="translate(5 9)"
            />
            <path
              d={secondaryPath}
              fill={SPLIT_TICKET_PALETTE.panel}
              stroke={SPLIT_TICKET_PALETTE.outline}
              strokeWidth={8}
              strokeLinejoin="miter"
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
