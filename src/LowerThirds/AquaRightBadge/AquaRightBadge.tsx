import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const AQUA_RIGHT_BADGE_DURATION = 300;
export const AQUA_RIGHT_BADGE_FPS = 30;
export const AQUA_RIGHT_BADGE_PALETTE = {
  background: "#000000",
  accent: "#62B7BE",
  accentDark: "#3E8F96",
  paper: "#FFF9EA",
  outline: "#292B2D",
  shadow: "#45484A",
} as const;

const color = z.string().min(1);
export const aquaRightBadgeSchema = z.object({
  accentColor: color.default(AQUA_RIGHT_BADGE_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({ x: z.number().min(40).max(500), y: z.number().min(500).max(850) })
    .default({ x: 96, y: 700 }),
});
export type AquaRightBadgeProps = z.infer<typeof aquaRightBadgeSchema>;

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

const MAIN_REVEAL_WIDTH = 1084;
const SECONDARY_REVEAL_WIDTH = 930;
const mainPath =
  "M 64 48 L 1036 48 L 1036 184 L 64 184 Q 16 184 16 136 L 16 96 Q 16 48 64 48 Z";
const mainShadowPath =
  "M 58 56 L 1043 56 L 1043 195 L 58 195 Q 8 195 8 145 L 8 106 Q 8 56 58 56 Z";
const secondaryPath =
  "M 136 191 L 1042 191 L 1042 263 L 172 263 Q 136 263 136 227 Z";

export const AquaRightBadge = ({
  accentColor = AQUA_RIGHT_BADGE_PALETTE.accent,
  scale = 1,
  position = { x: 96, y: 700 },
}: AquaRightBadgeProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `aqua-main-${uid}`;
  const secondaryRevealId = `aqua-secondary-${uid}`;

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

  const markerVisible = markerIn * (1 - markerOut);
  const markerShift = (1 - markerIn) * 18 + markerOut * 18;
  const mainVisible = mainIn * (1 - mainOut);
  const mainWidth = MAIN_REVEAL_WIDTH * mainVisible;
  const mainShift = (1 - mainIn) * -14;
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * 20 + secondaryOut * 20;
  const decorationVisible = decorationIn * decorationOut;

  return (
    <AbsoluteFill
      style={{ backgroundColor: AQUA_RIGHT_BADGE_PALETTE.background }}
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
            <rect x={0} y={34} width={mainWidth} height={178} />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={124}
              y={180}
              width={SECONDARY_REVEAL_WIDTH * secondaryVisible}
              height={102}
            />
          </clipPath>
        </defs>

        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g clipPath={`url(#${secondaryRevealId})`}>
            <g
              opacity={secondaryVisible}
              transform={`translate(0 ${secondaryShift})`}
            >
              <path
                d={secondaryPath}
                fill={AQUA_RIGHT_BADGE_PALETTE.shadow}
                transform="translate(0 8)"
              />
              <path d={secondaryPath} fill={accentColor} />
            </g>
          </g>

          <g
            clipPath={`url(#${mainRevealId})`}
            transform={`translate(${mainShift} 0)`}
          >
            <path d={mainShadowPath} fill={AQUA_RIGHT_BADGE_PALETTE.shadow} />
            <path d={mainPath} fill={AQUA_RIGHT_BADGE_PALETTE.paper} />
            <path
              d="M 74 177 L 1042 177"
              fill="none"
              stroke={AQUA_RIGHT_BADGE_PALETTE.outline}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={decorationVisible}
            />
          </g>

          <g opacity={markerVisible} transform={`translate(${markerShift} 0)`}>
            <circle
              cx={1030}
              cy={128}
              r={136}
              fill={AQUA_RIGHT_BADGE_PALETTE.shadow}
              transform="translate(7 8)"
            />
            <circle
              cx={1030}
              cy={128}
              r={136}
              fill={AQUA_RIGHT_BADGE_PALETTE.outline}
            />
            <circle cx={1030} cy={128} r={112} fill={accentColor} />
            <circle
              cx={1030}
              cy={128}
              r={101}
              fill={AQUA_RIGHT_BADGE_PALETTE.paper}
              stroke={AQUA_RIGHT_BADGE_PALETTE.accentDark}
              strokeWidth={3}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
