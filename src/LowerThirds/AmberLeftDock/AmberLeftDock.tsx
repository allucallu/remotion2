import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const AMBER_LEFT_DOCK_DURATION = 300;
export const AMBER_LEFT_DOCK_FPS = 30;
export const AMBER_LEFT_DOCK_PALETTE = {
  background: "#000000",
  accent: "#F3AC24",
  accentDark: "#C77D12",
  paper: "#FFF9EA",
  panel: "#292B2D",
  shadow: "#45484A",
} as const;

const color = z.string().min(1);
export const amberLeftDockSchema = z.object({
  accentColor: color.default(AMBER_LEFT_DOCK_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({ x: z.number().min(40).max(500), y: z.number().min(500).max(850) })
    .default({ x: 96, y: 700 }),
});
export type AmberLeftDockProps = z.infer<typeof amberLeftDockSchema>;

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

const MAIN_REVEAL_WIDTH = 1060;
const SECONDARY_REVEAL_WIDTH = 900;
const mainPath =
  "M 236 48 L 1134 48 Q 1192 48 1215 94 Q 1228 120 1215 146 Q 1192 192 1134 192 L 236 192 Z";
const mainShadowPath =
  "M 236 57 L 1138 57 Q 1198 57 1222 104 Q 1235 132 1221 159 Q 1197 205 1138 205 L 236 205 Z";
const secondaryPath =
  "M 238 198 L 1040 198 L 1018 270 L 330 270 Q 306 270 286 260 L 238 260 Z";
const endCapPath =
  "M 1016 198 L 1062 198 L 1044 255 Q 1040 270 1024 270 L 996 270 Z";

export const AmberLeftDock = ({
  accentColor = AMBER_LEFT_DOCK_PALETTE.accent,
  scale = 1,
  position = { x: 96, y: 700 },
}: AmberLeftDockProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `amber-main-${uid}`;
  const secondaryRevealId = `amber-secondary-${uid}`;

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
  const mainWidth = MAIN_REVEAL_WIDTH * mainVisible;
  const mainShift = (1 - mainIn) * -14;
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * 20 + secondaryOut * 20;
  const decorationVisible = decorationIn * decorationOut;

  return (
    <AbsoluteFill
      style={{ backgroundColor: AMBER_LEFT_DOCK_PALETTE.background }}
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
            <rect x={220} y={34} width={mainWidth} height={188} />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={228}
              y={184}
              width={SECONDARY_REVEAL_WIDTH * secondaryVisible}
              height={108}
            />
          </clipPath>
        </defs>

        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g opacity={markerVisible} transform={`translate(${markerShift} 0)`}>
            <rect
              x={0}
              y={0}
              width={286}
              height={260}
              rx={48}
              fill={AMBER_LEFT_DOCK_PALETTE.shadow}
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
                fill={AMBER_LEFT_DOCK_PALETTE.shadow}
                transform="translate(0 8)"
              />
              <path d={secondaryPath} fill={AMBER_LEFT_DOCK_PALETTE.panel} />
              <path d={endCapPath} fill={accentColor} />
            </g>
          </g>

          <g
            clipPath={`url(#${mainRevealId})`}
            transform={`translate(${mainShift} 0)`}
          >
            <path d={mainShadowPath} fill={AMBER_LEFT_DOCK_PALETTE.shadow} />
            <path d={mainPath} fill={AMBER_LEFT_DOCK_PALETTE.paper} />
            <path
              d="M 250 181 L 1132 181 Q 1176 181 1198 149"
              fill="none"
              stroke={accentColor}
              strokeWidth={9}
              strokeLinecap="round"
              opacity={decorationVisible}
            />
          </g>

          <g opacity={markerVisible} transform={`translate(${markerShift} 0)`}>
            <rect
              x={0}
              y={0}
              width={286}
              height={260}
              rx={48}
              fill={accentColor}
              stroke={AMBER_LEFT_DOCK_PALETTE.accentDark}
              strokeWidth={4}
            />
            <rect
              x={22}
              y={18}
              width={242}
              height={224}
              rx={40}
              fill={AMBER_LEFT_DOCK_PALETTE.panel}
            />
            <rect
              x={38}
              y={34}
              width={210}
              height={192}
              rx={32}
              fill={AMBER_LEFT_DOCK_PALETTE.paper}
              stroke={AMBER_LEFT_DOCK_PALETTE.shadow}
              strokeWidth={3}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
