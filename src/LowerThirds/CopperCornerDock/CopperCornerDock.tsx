import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const COPPER_CORNER_DOCK_DURATION = 300;
export const COPPER_CORNER_DOCK_FPS = 30;
export const COPPER_CORNER_DOCK_PALETTE = {
  background: "#000000",
  accent: "#C97945",
  paper: "#FFF8E8",
  panel: "#292B2D",
  outline: "#303235",
  shadow: "#45474A",
} as const;

const color = z.string().min(1);
export const copperCornerDockSchema = z.object({
  accentColor: color.default(COPPER_CORNER_DOCK_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({ x: z.number().min(40).max(500), y: z.number().min(500).max(850) })
    .default({ x: 96, y: 710 }),
});
export type CopperCornerDockProps = z.infer<typeof copperCornerDockSchema>;

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

const MAIN_WIDTH = 1100;
const SECONDARY_WIDTH = 930;
const badgeOuterPath =
  "M 28 0 L 202 0 L 260 56 L 260 218 Q 260 244 234 244 L 28 244 Q 0 244 0 216 L 0 28 Q 0 0 28 0 Z";
const badgeInnerPath =
  "M 35 18 L 194 18 L 241 65 L 241 209 Q 241 225 225 225 L 35 225 Q 18 225 18 208 L 18 35 Q 18 18 35 18 Z";
const mainPath =
  "M 248 48 L 1128 48 Q 1152 48 1152 72 L 1152 156 Q 1152 180 1128 180 L 248 180 Z";
const secondaryPath =
  "M 228 174 L 1096 174 L 1076 252 L 310 252 Q 280 252 260 242 L 228 226 Z";
const endCapPath = "M 1092 174 L 1137 174 L 1117 252 L 1072 252 Z";

export const CopperCornerDock = ({
  accentColor = COPPER_CORNER_DOCK_PALETTE.accent,
  scale = 1,
  position = { x: 96, y: 710 },
}: CopperCornerDockProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `copper-main-${uid}`;
  const secondaryRevealId = `copper-secondary-${uid}`;

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
  const mainWidth = (MAIN_WIDTH + 30) * mainIn * (1 - mainOut);
  const mainShift = (1 - mainIn) * -14;
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * 22 + secondaryOut * 22;
  const decorationVisible = decorationIn * decorationOut;

  return (
    <AbsoluteFill
      style={{ backgroundColor: COPPER_CORNER_DOCK_PALETTE.background }}
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
            <rect x={230} y={28} width={mainWidth} height={178} />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={218}
              y={158}
              width={(SECONDARY_WIDTH + 35) * secondaryVisible}
              height={121}
            />
          </clipPath>
        </defs>

        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g opacity={markerOpacity} transform={`translate(${markerShift} 0)`}>
            <path
              d={badgeOuterPath}
              fill={COPPER_CORNER_DOCK_PALETTE.shadow}
              transform="translate(7 8)"
            />
          </g>

          <g clipPath={`url(#${secondaryRevealId})`}>
            <g
              transform={`translate(0 ${secondaryShift})`}
              opacity={secondaryVisible}
            >
              <path
                d={secondaryPath}
                fill={COPPER_CORNER_DOCK_PALETTE.shadow}
                transform="translate(0 8)"
              />
              <path d={secondaryPath} fill={COPPER_CORNER_DOCK_PALETTE.panel} />
              <path
                d="M 240 185 L 1080 185 L 1068 234 L 240 234 Z"
                fill={COPPER_CORNER_DOCK_PALETTE.outline}
              />
              <path
                d={endCapPath}
                fill={accentColor}
                stroke={COPPER_CORNER_DOCK_PALETTE.outline}
                strokeWidth={5}
                strokeLinejoin="round"
              />
            </g>
          </g>

          <g
            clipPath={`url(#${mainRevealId})`}
            transform={`translate(${mainShift} 0)`}
          >
            <path
              d={mainPath}
              fill={COPPER_CORNER_DOCK_PALETTE.shadow}
              transform="translate(7 9)"
            />
            <path
              d={mainPath}
              fill={COPPER_CORNER_DOCK_PALETTE.paper}
              stroke={accentColor}
              strokeWidth={10}
              strokeLinejoin="round"
            />
            <path
              d="M 262 62 L 1118 62 Q 1136 62 1136 80"
              fill="none"
              stroke={COPPER_CORNER_DOCK_PALETTE.outline}
              strokeWidth={5}
              opacity={0.42 * decorationVisible}
            />
          </g>

          <g opacity={markerOpacity} transform={`translate(${markerShift} 0)`}>
            <path
              d={badgeOuterPath}
              fill={COPPER_CORNER_DOCK_PALETTE.panel}
              stroke={accentColor}
              strokeWidth={11}
              strokeLinejoin="round"
            />
            <path
              d={badgeInnerPath}
              fill={COPPER_CORNER_DOCK_PALETTE.paper}
              stroke={COPPER_CORNER_DOCK_PALETTE.outline}
              strokeWidth={7}
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
