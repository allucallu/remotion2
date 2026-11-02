import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionOrigamiWingProps = {
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

export const CaptionOrigamiWingConfig = {
  id: "CaptionOrigamiWing",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionOrigamiWing: React.FC<CaptionOrigamiWingProps> = ({
  background = "black",
  panelColor = "#F2E9D7",
  accentColor = "#9EB4BB",
  secondaryColor = "#587885",
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
  const clipId = `CaptionOrigamiWing-${uid}`;

  const left = part(0, 0.62, 9.22, 9.8);
  const right = part(0.12, 0.74, 9.14, 9.72);
  const panel = part(0.3, 1.03, 8.95, 9.35);
  const folds = part(0.9, 1.27, 8.72, 9.02);
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
              <rect x={-490 * panel} y={-76} width={980 * panel} height={152} />
            </clipPath>
          </defs>
          <g
            transform={`translate(-468 0) skewY(${-32 * (1 - left)}) scale(${left} 1)`}
            visibility={left > 0 ? "visible" : "hidden"}
          >
            <path d="M 0 -83 L -112 -49 L -84 64 L 0 86 Z" fill={accentColor} />
            <path
              d="M -112 -49 L -36 9 L -84 64 Z"
              fill={secondaryColor}
              transform={`translate(-36 9) scale(${0.25 + 0.75 * folds} 1) translate(36 -9)`}
            />
            <path d="M -36 9 L 0 -83 V 86 Z" fill="#D1A18B" />
            <path
              d="M -112 -49 L -36 9 L -84 64"
              stroke={panelColor}
              strokeWidth={1.4}
              fill="none"
              opacity={0.65}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - folds}
              visibility={folds > 0 ? "visible" : "hidden"}
            />
          </g>
          <g
            transform={`translate(468 0) skewY(${32 * (1 - right)}) scale(${right} 1)`}
            visibility={right > 0 ? "visible" : "hidden"}
          >
            <path d="M 0 -83 L 112 -49 L 84 64 L 0 86 Z" fill={accentColor} />
            <path
              d="M 112 -49 L 36 9 L 84 64 Z"
              fill="#D1A18B"
              transform={`translate(36 9) scale(${0.25 + 0.75 * folds} 1) translate(-36 -9)`}
            />
            <path d="M 36 9 L 0 -83 V 86 Z" fill={secondaryColor} />
            <path
              d="M 112 -49 L 36 9 L 84 64"
              stroke={panelColor}
              strokeWidth={1.4}
              fill="none"
              opacity={0.65}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - folds}
              visibility={folds > 0 ? "visible" : "hidden"}
            />
          </g>
          <g clipPath={`url(#${clipId})`}>
            <path
              d="M -478 -75 H 462 L 489 -48 V 75 H -462 L -489 48 V -64 Z"
              fill={panelColor}
            />
          </g>
          <g visibility={folds > 0 ? "visible" : "hidden"}>
            <path
              d="M -478 -75 H 462 L 489 -48 H 474 L 454 -63 H -478 Z"
              fill="#E3D8C4"
              transform={`translate(0 -75) scale(1 ${folds}) translate(0 75)`}
            />
            <path
              d="M -462 75 L -489 48 H -476 L -455 64 H 477 V 75 Z"
              fill="#D7C9B0"
              transform={`translate(0 75) scale(1 ${folds}) translate(0 -75)`}
            />
          </g>
          <path
            d="M -433 -84 H -362 M 362 84 H 433"
            stroke={accentColor}
            strokeWidth={3}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - detail}
            visibility={detail > 0 ? "visible" : "hidden"}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CaptionOrigamiWing;
