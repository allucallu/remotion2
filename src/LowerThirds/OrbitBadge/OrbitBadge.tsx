import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const ORBIT_BADGE_DURATION = 300;
export const ORBIT_BADGE_FPS = 30;

export const ORBIT_BADGE_PALETTE = {
  background: "#000000",
  accent: "#4BA79E",
  paper: "#FFF5DC",
  outline: "#202120",
  shadow: "#343533",
  dots: "#343533",
} as const;

const color = z.string().min(1);

export const orbitBadgeSchema = z.object({
  accentColor: color.default(ORBIT_BADGE_PALETTE.accent),
  scale: z.number().min(0.6).max(1.25).default(1),
  position: z
    .object({
      x: z.number().min(40).max(500),
      y: z.number().min(480).max(840),
    })
    .default({ x: 92, y: 700 }),
});

export type OrbitBadgeProps = z.infer<typeof orbitBadgeSchema>;

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

const PANEL_WIDTH = 1200;
const SECONDARY_WIDTH = 590;
const SECONDARY_HEIGHT = 76;
const BADGE_X = 150;
const BADGE_Y = 128;
const BADGE_RADIUS = 116;

const mainPath =
  "M 150 22 L 1132 22 Q 1152 22 1143 42 L 1048 217 Q 1040 232 1019 232 L 150 232 Z";
const secondaryPath = `M 18 0 L ${SECONDARY_WIDTH} 0 L ${SECONDARY_WIDTH - 22} ${SECONDARY_HEIGHT} L 0 ${SECONDARY_HEIGHT} Z`;

const halftoneDots = Array.from({ length: 68 }, (_, index) => {
  const column = index % 8;
  const row = Math.floor(index / 8);
  return { column, row };
});

export const OrbitBadge = ({
  accentColor = ORBIT_BADGE_PALETTE.accent,
  scale = 1,
  position = { x: 92, y: 700 },
}: OrbitBadgeProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainRevealId = `orbit-main-reveal-${uid}`;
  const secondaryRevealId = `orbit-secondary-reveal-${uid}`;

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
  const mainRevealWidth = (PANEL_WIDTH + 40) * mainIn * (1 - mainOut);
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const secondaryShift = (1 - secondaryIn) * 22 + secondaryOut * 22;
  const decorationOpacity = decorationIn * decorationOut;

  return (
    <AbsoluteFill style={{ backgroundColor: ORBIT_BADGE_PALETTE.background }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={mainRevealId}>
            <rect x={120} y={-10} width={mainRevealWidth} height={290} />
          </clipPath>
          <clipPath id={secondaryRevealId}>
            <rect
              x={-16}
              y={-18}
              width={(SECONDARY_WIDTH + 44) * secondaryVisible}
              height={SECONDARY_HEIGHT + 36}
            />
          </clipPath>
        </defs>

        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
          <g opacity={decorationOpacity} fill={ORBIT_BADGE_PALETTE.dots}>
            {halftoneDots.map(({ column, row }, index) => {
              const cx = 4 + column * 25;
              const cy = 12 + row * 31;
              const distance = Math.hypot(cx - BADGE_X, cy - BADGE_Y);
              const visible = distance > BADGE_RADIUS - 8;
              const radius = 2.2 + ((column + row) % 4) * 1.15;
              return visible ? (
                <circle key={index} cx={cx} cy={cy} r={radius} />
              ) : null;
            })}
          </g>

          <g clipPath={`url(#${mainRevealId})`}>
            <path
              d={mainPath}
              fill={ORBIT_BADGE_PALETTE.shadow}
              transform="translate(18 22)"
            />
            <path
              d={mainPath}
              fill={accentColor}
              stroke={ORBIT_BADGE_PALETTE.outline}
              strokeWidth={10}
              strokeLinejoin="round"
            />
          </g>

          <g
            clipPath={`url(#${secondaryRevealId})`}
            opacity={secondaryVisible}
            transform={`translate(${340 - secondaryShift} 150)`}
          >
            <path
              d={secondaryPath}
              fill={ORBIT_BADGE_PALETTE.shadow}
              transform="translate(8 10)"
            />
            <path
              d={secondaryPath}
              fill={ORBIT_BADGE_PALETTE.paper}
              stroke={ORBIT_BADGE_PALETTE.outline}
              strokeWidth={7}
              strokeLinejoin="round"
            />
          </g>

          <g opacity={markerOpacity} transform={`translate(${markerShift} 0)`}>
            <circle
              cx={BADGE_X + 10}
              cy={BADGE_Y + 14}
              r={BADGE_RADIUS + 2}
              fill={ORBIT_BADGE_PALETTE.shadow}
            />
            <circle
              cx={BADGE_X}
              cy={BADGE_Y}
              r={BADGE_RADIUS}
              fill={ORBIT_BADGE_PALETTE.outline}
            />
            <circle
              cx={BADGE_X}
              cy={BADGE_Y}
              r={BADGE_RADIUS - 15}
              fill={ORBIT_BADGE_PALETTE.paper}
            />
            <circle
              cx={BADGE_X}
              cy={BADGE_Y}
              r={BADGE_RADIUS - 27}
              fill={ORBIT_BADGE_PALETTE.outline}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
