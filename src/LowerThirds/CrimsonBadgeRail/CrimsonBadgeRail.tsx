import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const CRIMSON_BADGE_RAIL_DURATION = 300;
export const CRIMSON_BADGE_RAIL_FPS = 30;
export const CRIMSON_BADGE_RAIL_PALETTE = {
  background: "#000000",
  accent: "#A81236",
  paper: "#FFF9E9",
  panel: "#292A2C",
  outline: "#242527",
  shadow: "#444548",
} as const;

const color = z.string().min(1);
export const crimsonBadgeRailSchema = z.object({
  accentColor: color.default(CRIMSON_BADGE_RAIL_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({ x: z.number().min(40).max(500), y: z.number().min(500).max(850) })
    .default({ x: 96, y: 720 }),
});
export type CrimsonBadgeRailProps = z.infer<typeof crimsonBadgeRailSchema>;

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

const MAIN_WIDTH = 1110;
const SECONDARY_WIDTH = 900;
const mainPath =
  "M 20 50 L 40 30 L 1010 30 Q 1064 30 1093 62 Q 1112 84 1112 112 L 1112 158 Q 1081 136 1038 136 L 20 136 L 4 120 L 4 66 Z";
const secondaryPath =
  "M 68 136 L 944 136 Q 977 136 988 106 L 1008 106 Q 1002 191 944 212 L 68 212 Z";
const secondaryInsetPath =
  "M 82 146 L 913 146 Q 944 146 957 122 L 976 122 Q 961 184 918 197 L 82 197 Z";

export const CrimsonBadgeRail = ({
  accentColor = CRIMSON_BADGE_RAIL_PALETTE.accent,
  scale = 1,
  position = { x: 96, y: 720 },
}: CrimsonBadgeRailProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `crimson-main-${uid}`;
  const secondaryRevealId = `crimson-secondary-${uid}`;
  const decorationRevealId = `crimson-decoration-${uid}`;

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
  const mainWidth = (MAIN_WIDTH + 28) * mainIn * (1 - mainOut);
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * 22 + secondaryOut * 22;
  const decorationVisible = decorationIn * decorationOut;
  const mainShift = (1 - mainIn) * -14;

  return (
    <AbsoluteFill
      style={{ backgroundColor: CRIMSON_BADGE_RAIL_PALETTE.background }}
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
            <rect x={-8} y={12} width={mainWidth} height={174} />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={35}
              y={90}
              width={(SECONDARY_WIDTH + 85) * secondaryVisible}
              height={125}
            />
          </clipPath>
          <clipPath id={decorationRevealId}>
            <rect x={0} y={118} width={1130 * decorationVisible} height={72} />
          </clipPath>
        </defs>

        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g clipPath={`url(#${secondaryRevealId})`}>
            <g
              transform={`translate(0 ${secondaryShift})`}
              opacity={secondaryVisible}
            >
              <path
                d={secondaryPath}
                fill={CRIMSON_BADGE_RAIL_PALETTE.shadow}
                transform="translate(0 8)"
              />
              <path d={secondaryPath} fill={CRIMSON_BADGE_RAIL_PALETTE.panel} />
              <path
                d={secondaryInsetPath}
                fill={CRIMSON_BADGE_RAIL_PALETTE.outline}
              />
            </g>
          </g>

          <g
            clipPath={`url(#${mainRevealId})`}
            transform={`translate(${mainShift} 0)`}
          >
            <path
              d={mainPath}
              fill={CRIMSON_BADGE_RAIL_PALETTE.shadow}
              transform="translate(7 9)"
            />
            <path
              d={mainPath}
              fill={CRIMSON_BADGE_RAIL_PALETTE.paper}
              stroke={CRIMSON_BADGE_RAIL_PALETTE.outline}
              strokeWidth={5}
              strokeLinejoin="round"
            />
            <path
              d="M 40 30 L 1010 30 Q 1047 30 1074 49 L 1058 58 Q 1038 45 1007 45 L 47 45 Z"
              fill={CRIMSON_BADGE_RAIL_PALETTE.shadow}
              opacity={0.32}
            />
          </g>

          <g clipPath={`url(#${decorationRevealId})`}>
            <path
              d="M 20 136 L 1036 136 Q 1082 136 1111 166"
              fill="none"
              stroke={accentColor}
              strokeWidth={11}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>

          <g
            opacity={markerOpacity}
            transform={`translate(${1068 + markerShift} 0)`}
          >
            <rect
              x={6}
              y={7}
              width={252}
              height={250}
              rx={51}
              fill={CRIMSON_BADGE_RAIL_PALETTE.shadow}
            />
            <rect
              x={0}
              y={0}
              width={252}
              height={250}
              rx={51}
              fill={CRIMSON_BADGE_RAIL_PALETTE.panel}
              stroke={accentColor}
              strokeWidth={11}
            />
            <rect
              x={18}
              y={18}
              width={216}
              height={214}
              rx={37}
              fill={CRIMSON_BADGE_RAIL_PALETTE.paper}
              stroke={CRIMSON_BADGE_RAIL_PALETTE.outline}
              strokeWidth={8}
            />
            <path
              d="M 8 68 L 8 45 Q 8 9 46 9 L 72 9"
              fill="none"
              stroke={accentColor}
              strokeWidth={6}
              strokeLinecap="square"
            />
            <path
              d="M 244 182 L 244 206 Q 244 241 207 241 L 181 241"
              fill="none"
              stroke={accentColor}
              strokeWidth={6}
              strokeLinecap="square"
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
