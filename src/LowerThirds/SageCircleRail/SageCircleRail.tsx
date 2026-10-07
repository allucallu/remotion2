import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const SAGE_CIRCLE_RAIL_DURATION = 300;
export const SAGE_CIRCLE_RAIL_FPS = 30;
export const SAGE_CIRCLE_RAIL_PALETTE = {
  background: "#000000",
  accent: "#819E73",
  accentDark: "#617A58",
  paper: "#FFF8E8",
  panel: "#292B2D",
  shadow: "#45484A",
} as const;

const color = z.string().min(1);
export const sageCircleRailSchema = z.object({
  accentColor: color.default(SAGE_CIRCLE_RAIL_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({ x: z.number().min(40).max(500), y: z.number().min(500).max(850) })
    .default({ x: 96, y: 700 }),
});
export type SageCircleRailProps = z.infer<typeof sageCircleRailSchema>;

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

const MAIN_LEFT = 172;
const MAIN_RIGHT = 1190;
const MAIN_REVEAL_WIDTH = MAIN_RIGHT - MAIN_LEFT + 18;
const SECONDARY_REVEAL_WIDTH = 930;

const mainPath =
  "M 170 52 L 1114 52 Q 1164 52 1183 91 Q 1195 116 1183 143 Q 1164 184 1114 184 L 170 184 Z";
const mainShadowPath =
  "M 170 60 L 1116 60 Q 1170 60 1190 101 Q 1202 128 1189 156 Q 1168 198 1117 198 L 170 198 Z";
const secondaryPath =
  "M 218 191 L 950 191 Q 986 191 986 227 Q 986 263 950 263 L 310 263 Q 282 263 262 250 L 218 226 Z";

export const SageCircleRail = ({
  accentColor = SAGE_CIRCLE_RAIL_PALETTE.accent,
  scale = 1,
  position = { x: 96, y: 700 },
}: SageCircleRailProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `sage-main-${uid}`;
  const secondaryRevealId = `sage-secondary-${uid}`;

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
  const markerShift = (1 - markerIn) * -18 - markerOut * 18;
  const mainVisible = mainIn * (1 - mainOut);
  const mainRevealWidth = MAIN_REVEAL_WIDTH * mainVisible;
  const mainShift = (1 - mainIn) * -14;
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * 20 + secondaryOut * 20;
  const decorationVisible = decorationIn * decorationOut;

  return (
    <AbsoluteFill
      style={{ backgroundColor: SAGE_CIRCLE_RAIL_PALETTE.background }}
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
            <rect
              x={MAIN_LEFT - 12}
              y={36}
              width={mainRevealWidth}
              height={178}
            />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={208}
              y={180}
              width={SECONDARY_REVEAL_WIDTH * secondaryVisible}
              height={100}
            />
          </clipPath>
        </defs>

        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g opacity={markerVisible} transform={`translate(${markerShift} 0)`}>
            <circle
              cx={142}
              cy={128}
              r={126}
              fill={SAGE_CIRCLE_RAIL_PALETTE.shadow}
              transform="translate(7 8)"
            />
          </g>

          <g clipPath={`url(#${secondaryRevealId})`}>
            <g
              opacity={secondaryVisible}
              transform={`translate(0 ${secondaryShift})`}
            >
              <path
                d={secondaryPath}
                fill={SAGE_CIRCLE_RAIL_PALETTE.shadow}
                transform="translate(0 8)"
              />
              <path d={secondaryPath} fill={accentColor} />
            </g>
          </g>

          <g
            clipPath={`url(#${mainRevealId})`}
            transform={`translate(${mainShift} 0)`}
          >
            <path d={mainShadowPath} fill={SAGE_CIRCLE_RAIL_PALETTE.shadow} />
            <path
              d={mainPath}
              fill={SAGE_CIRCLE_RAIL_PALETTE.paper}
              stroke={accentColor}
              strokeWidth={8}
              strokeLinejoin="round"
            />
            <path
              d="M 184 181 L 1112 181 Q 1158 181 1177 148"
              fill="none"
              stroke={SAGE_CIRCLE_RAIL_PALETTE.accentDark}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={decorationVisible}
            />
          </g>

          <g opacity={markerVisible} transform={`translate(${markerShift} 0)`}>
            <circle
              cx={142}
              cy={128}
              r={126}
              fill={accentColor}
              stroke={SAGE_CIRCLE_RAIL_PALETTE.accentDark}
              strokeWidth={6}
            />
            <circle
              cx={142}
              cy={128}
              r={108}
              fill={SAGE_CIRCLE_RAIL_PALETTE.paper}
            />
            <circle
              cx={142}
              cy={128}
              r={98}
              fill={SAGE_CIRCLE_RAIL_PALETTE.panel}
              stroke={SAGE_CIRCLE_RAIL_PALETTE.shadow}
              strokeWidth={4}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
