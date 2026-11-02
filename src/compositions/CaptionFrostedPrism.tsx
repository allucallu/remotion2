import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionFrostedPrismProps = {
  background?: "black" | "green" | "transparent";
  panelColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  /** Position and scale in the 1920 x 1080 design canvas. */
  x?: number;
  y?: number;
  scale?: number;
  /** Animated entrance is enabled by default. */
  revealOnEntry?: boolean;
};

export const CaptionFrostedPrismConfig = {
  id: "CaptionFrostedPrism",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionFrostedPrism: React.FC<CaptionFrostedPrismProps> = ({
  background = "black",
  panelColor = "#E3EAE9",
  accentColor = "#8CAFB8",
  secondaryColor = "#657E8D",
  x = 960,
  y = 810,
  scale = 1,
  revealOnEntry = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  // Each piece owns its assembly and release windows (seconds).
  // Clamping gives an exactly stationary 1.35–8.6s hold and clean 9.8–10s tail.
  const part = (start: number, end: number, release: number, clear: number) =>
    (revealOnEntry ? phase(time, start, end) : 1) *
    (1 - phase(time, release, clear));
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `CaptionFrostedPrism-${uid}`;

  const back = part(0, 0.42, 9.37, 9.8);
  const bevel = part(0.16, 0.63, 9.2, 9.62);
  const panel = part(0.4, 1.04, 8.96, 9.34);
  const reflection = part(0.96, 1.28, 8.69, 8.96);
  const detail = part(1.08, 1.35, 8.6, 8.84);
  const backgrounds = {
    black: "#000000",
    green: "#00FF00",
    transparent: "transparent",
  };

  return (
    <AbsoluteFill
      style={{ backgroundColor: backgrounds[background], overflow: "hidden" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        <g transform={`translate(${x} ${y}) scale(${clamp(scale, 0.3, 1.4)})`}>
          <defs>
            <clipPath id={clipId}>
              <rect
                x={-533 * panel}
                y={-82}
                width={1066 * panel}
                height={149}
              />
            </clipPath>
            <linearGradient
              id={`${clipId}-rim`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0" stopColor="#B9DADB" />
              <stop offset="0.44" stopColor={accentColor} />
              <stop offset="0.7" stopColor="#849CAD" />
              <stop offset="1" stopColor="#D4E7DD" />
            </linearGradient>
          </defs>
          <path
            d="M -518 -90 H 493 L 552 -31 V 60 L 520 92 H -503 L -552 43 V -56 Z"
            fill={secondaryColor}
            transform={`translate(${50 * (1 - back)} ${18 * (1 - back)})`}
            opacity={back}
          />
          <path
            d="M -518 -98 H 493 L 552 -39 V 52 L 520 84 H -503 L -552 35 V -64 Z"
            fill={`url(#${clipId}-rim)`}
            transform={`translate(${-36 * (1 - bevel)} ${-20 * (1 - bevel)})`}
            opacity={bevel}
          />
          <g clipPath={`url(#${clipId})`}>
            <path
              d="M -511 -81 H 485 L 532 -34 V 45 L 511 66 H -495 L -532 29 V -57 Z"
              fill={panelColor}
            />
          </g>
          <path
            d="M -515 -91 H 485 M -542 -58 V 25 M 515 76 H -492"
            stroke="#F5F9F6"
            strokeWidth={2}
            opacity={0.8}
            fill="none"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - reflection}
            visibility={reflection > 0 ? "visible" : "hidden"}
          />
          <g visibility={detail > 0 ? "visible" : "hidden"}>
            <path
              d="M -520 -49 L -499 -70 M -520 -33 L -483 -70 M 501 51 L 522 30"
              stroke={accentColor}
              strokeWidth={4}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - detail}
            />
            <path
              d="M 497 -81 L 536 -42"
              stroke="#F7FCFA"
              strokeWidth={3}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - detail}
            />
            <path
              d="M -41 94 H 41"
              stroke={accentColor}
              strokeWidth={3}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - detail}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CaptionFrostedPrism;
