import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionRibbonEndsProps = {
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

export const CaptionRibbonEndsConfig = {
  id: "CaptionRibbonEnds",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionRibbonEnds: React.FC<CaptionRibbonEndsProps> = ({
  background = "black",
  panelColor = "#F3F1EA",
  accentColor = "#B3917C",
  secondaryColor = "#737B84",
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

  const leftTail = part(0, 0.52, 9.32, 9.8);
  const rightTail = part(0.12, 0.64, 9.24, 9.72);
  const panel = part(0.28, 1.02, 8.94, 9.42);
  const folds = part(0.88, 1.23, 8.73, 9.02);
  const detail = part(1.06, 1.35, 8.6, 8.85);
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
          <g
            transform={`translate(-480 0) rotate(${-48 * (1 - leftTail)}) scale(${leftTail} 1)`}
            visibility={leftTail > 0 ? "visible" : "hidden"}
          >
            <path d="M 0 -48 H -86 L -62 8 L -86 64 H 0 Z" fill={accentColor} />
          </g>
          <g
            transform={`translate(480 0) rotate(${48 * (1 - rightTail)}) scale(${rightTail} 1)`}
            visibility={rightTail > 0 ? "visible" : "hidden"}
          >
            <path d="M 0 -48 H 86 L 62 8 L 86 64 H 0 Z" fill={accentColor} />
          </g>
          <g visibility={folds > 0 ? "visible" : "hidden"}>
            <path
              d="M 0 64 L 26 72 V 45 Z"
              fill={secondaryColor}
              transform={`translate(-480 64) scale(1 ${folds}) translate(0 -64)`}
            />
            <path
              d="M 0 64 L -26 72 V 45 Z"
              fill={secondaryColor}
              transform={`translate(480 64) scale(1 ${folds}) translate(0 -64)`}
            />
          </g>
          <rect
            x={-480 * panel}
            y={-72}
            width={960 * panel}
            height={144}
            rx={3}
            fill={panelColor}
          />
          <g visibility={detail > 0 ? "visible" : "hidden"}>
            <path
              d="M -480 -72 V 72 M 480 -72 V 72"
              stroke={secondaryColor}
              strokeWidth={2}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - detail}
            />
            <path
              d="M -465 -58 h 23 M 442 -58 h 23"
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

export default CaptionRibbonEnds;
