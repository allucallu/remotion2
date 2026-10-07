import { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const ANGULAR_PANELS_DURATION = 300;
export const ANGULAR_PANELS_FPS = 30;

export const ANGULAR_PANELS_PALETTE = {
  background: "#000000",
  ink: "#18191B",
  outline: "#303236",
  shadow: "#414347",
  paper: "#FFF8E9",
  plum: "#824565",
  mint: "#C8EEE0",
  cobalt: "#3468C9",
  copper: "#CC7940",
} as const;

const color = z.string().min(1);
const position = z
  .object({ x: z.number().min(40).max(500), y: z.number().min(500).max(900) })
  .default({ x: 96, y: 720 });

export const plumStripeSchema = z.object({
  accentColor: color.default(ANGULAR_PANELS_PALETTE.plum),
  scale: z.number().min(0.6).max(1.25).default(1),
  position,
});
export const mintFrameSchema = z.object({
  accentColor: color.default(ANGULAR_PANELS_PALETTE.mint),
  scale: z.number().min(0.6).max(1.25).default(1),
  position,
});
export const cobaltNotchSchema = z.object({
  accentColor: color.default(ANGULAR_PANELS_PALETTE.cobalt),
  scale: z.number().min(0.6).max(1.25).default(1),
  position,
});
export const copperFoldSchema = z.object({
  accentColor: color.default(ANGULAR_PANELS_PALETTE.copper),
  scale: z.number().min(0.6).max(1.25).default(1),
  position,
});

type PanelProps = z.infer<typeof plumStripeSchema>;
type Variant = "plum" | "mint" | "cobalt" | "copper";

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

const AngularPanel = ({
  variant,
  accentColor,
  scale,
  position: panelPosition,
}: PanelProps & { variant: Variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const mainClip = `angular-main-${uid}`;
  const secondaryClip = `angular-secondary-${uid}`;

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
  const detailIn = tween(
    frame,
    [1.05 * fps, 1.5 * fps],
    [0, 1],
    Easing.out(Easing.cubic),
  );
  const detailOut = tween(
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

  const effectiveMarkerOut = variant === "copper" ? mainOut : markerOut;
  const markerVisible = markerIn * (1 - effectiveMarkerOut);
  const secondaryVisible = secondaryIn * (1 - secondaryOut);
  const detailVisible = detailIn * detailOut;
  const mainWidth = 1320 * mainIn * (1 - mainOut);
  const markerShift = (1 - markerIn) * -18 - markerOut * 18;
  const secondaryShift = (1 - secondaryIn) * 22 + secondaryOut * 22;

  const mainLayer = (() => {
    if (variant === "plum") {
      return (
        <>
          <path
            d="M 70 10 L 1280 10 L 1208 154 L 16 154 Z"
            fill={ANGULAR_PANELS_PALETTE.shadow}
            transform="translate(14 -18)"
          />
          <path
            d="M 48 0 L 1240 0 L 1160 150 L 0 150 Z"
            fill={accentColor}
            stroke={ANGULAR_PANELS_PALETTE.ink}
            strokeWidth={10}
            strokeLinejoin="miter"
          />
        </>
      );
    }
    if (variant === "mint") {
      return (
        <>
          <path
            d="M 86 -18 L 286 -18 L 302 -6 L 1260 -6 L 1214 98 L 1240 98 L 1200 158 L 8 158 Z"
            fill={ANGULAR_PANELS_PALETTE.shadow}
          />
          <path
            d="M 82 0 L 1228 0 L 1174 140 L 20 140 Z"
            fill={accentColor}
            stroke={ANGULAR_PANELS_PALETTE.ink}
            strokeWidth={10}
            strokeLinejoin="miter"
          />
        </>
      );
    }
    if (variant === "cobalt") {
      return (
        <>
          <path
            d="M 64 8 L 1100 8 L 1062 96 L 1136 96 L 1088 184 L 0 184 Z"
            fill={ANGULAR_PANELS_PALETTE.shadow}
            transform="translate(8 10)"
          />
          <path
            d="M 62 0 L 1092 0 L 1050 92 L 1010 92 L 990 148 L 0 148 Z"
            fill={ANGULAR_PANELS_PALETTE.paper}
            stroke={ANGULAR_PANELS_PALETTE.ink}
            strokeWidth={10}
            strokeLinejoin="miter"
          />
        </>
      );
    }
    return (
      <>
        <path
          d="M 86 12 L 1192 12 L 1124 104 L 72 104 L 0 12 Z"
          fill={ANGULAR_PANELS_PALETTE.shadow}
          transform="translate(0 16)"
        />
        <path
          d="M 1186 0 L 1234 38 L 1234 164 L 1160 104 L 1080 104 Z"
          fill={ANGULAR_PANELS_PALETTE.shadow}
        />
        <path
          d="M 1186 0 L 1234 38 L 1234 164 L 1186 126 Z"
          fill={ANGULAR_PANELS_PALETTE.outline}
        />
        <path d="M 74 0 L 1186 0 L 1080 122 L 0 122 Z" fill={accentColor} />
      </>
    );
  })();

  const secondaryLayer = (() => {
    if (variant === "plum") {
      return (
        <path
          d="M 600 146 L 1198 146 L 1158 210 L 574 210 Z"
          fill={ANGULAR_PANELS_PALETTE.paper}
          stroke={ANGULAR_PANELS_PALETTE.ink}
          strokeWidth={9}
        />
      );
    }
    if (variant === "mint") {
      return (
        <path
          d="M 592 138 L 1178 138 L 1150 206 L 618 206 Z"
          fill={ANGULAR_PANELS_PALETTE.paper}
          stroke={ANGULAR_PANELS_PALETTE.ink}
          strokeWidth={9}
        />
      );
    }
    if (variant === "cobalt") {
      return (
        <path
          d="M 178 146 L 1024 146 L 1084 94 L 1136 94 L 1082 204 L 144 204 Z"
          fill={ANGULAR_PANELS_PALETTE.ink}
          stroke={ANGULAR_PANELS_PALETTE.outline}
          strokeWidth={9}
        />
      );
    }
    return (
      <path
        d="M 56 114 L 676 114 L 620 190 L 56 190 Z"
        fill={ANGULAR_PANELS_PALETTE.paper}
        stroke={ANGULAR_PANELS_PALETTE.ink}
        strokeWidth={9}
      />
    );
  })();

  return (
    <AbsoluteFill
      style={{ backgroundColor: ANGULAR_PANELS_PALETTE.background }}
    >
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={mainClip}>
            <rect x={-40} y={-60} width={mainWidth} height={300} />
          </clipPath>
          <clipPath id={secondaryClip}>
            <rect x={-30} y={70} width={1320 * secondaryVisible} height={190} />
          </clipPath>
        </defs>
        <g
          transform={`translate(${panelPosition.x} ${panelPosition.y}) scale(${scale})`}
        >
          <g
            clipPath={`url(#${secondaryClip})`}
            opacity={secondaryVisible}
            transform={`translate(0 ${secondaryShift})`}
          >
            {secondaryLayer}
          </g>
          {variant === "copper" ? (
            <g
              opacity={markerVisible}
              transform={`translate(${markerShift} 0)`}
            >
              <path
                d="M 0 48 L 48 48 L 24 94 L 10 112 Z"
                fill={ANGULAR_PANELS_PALETTE.shadow}
              />
            </g>
          ) : null}
          <g clipPath={`url(#${mainClip})`}>{mainLayer}</g>

          {variant === "plum" ? (
            <g
              opacity={detailVisible}
              transform={`translate(${markerShift} 0)`}
            >
              {[0, 1, 2].map((item) => (
                <path
                  key={item}
                  d={`M ${66 + item * 26} 0 L ${86 + item * 26} 0 L ${28 + item * 26} 150 L ${8 + item * 26} 150 Z`}
                  fill={ANGULAR_PANELS_PALETTE.paper}
                />
              ))}
            </g>
          ) : null}
          {variant === "mint" ? (
            <g
              opacity={markerVisible}
              transform={`translate(${markerShift} 0)`}
            >
              <path
                d="M 12 0 L 46 0 L -10 140 L -44 140 Z"
                fill={accentColor}
                stroke={ANGULAR_PANELS_PALETTE.ink}
                strokeWidth={8}
              />
            </g>
          ) : null}
          {variant === "cobalt" ? (
            <g
              opacity={markerVisible}
              transform={`translate(${markerShift} 0)`}
            >
              <path
                d="M 0 0 L 62 0 L 0 148 L -62 148 Z"
                fill={accentColor}
                stroke={ANGULAR_PANELS_PALETTE.outline}
                strokeWidth={6}
              />
            </g>
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const PlumStripe = (props: PanelProps) => (
  <AngularPanel {...props} variant="plum" />
);
export const MintFrame = (props: PanelProps) => (
  <AngularPanel {...props} variant="mint" />
);
export const CobaltNotch = (props: PanelProps) => (
  <AngularPanel {...props} variant="cobalt" />
);
export const CopperFold = (props: PanelProps) => (
  <AngularPanel {...props} variant="copper" />
);
