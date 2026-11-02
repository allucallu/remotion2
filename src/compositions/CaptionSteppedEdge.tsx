import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionSteppedEdgeProps = {
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

export const CaptionSteppedEdgeConfig = {
  id: "CaptionSteppedEdge",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionSteppedEdge: React.FC<CaptionSteppedEdgeProps> = ({
  background = "black",
  panelColor = "#F3F1EA",
  accentColor = "#A093B4",
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

  const rail = part(0, 0.3, 9.48, 9.8);
  const panel = part(0.18, 0.88, 8.98, 9.53);
  const step1 = part(0.67, 1.02, 8.9, 9.16);
  const step2 = part(0.79, 1.14, 8.82, 9.08);
  const edge = part(0.99, 1.3, 8.68, 8.92);
  const detail = part(1.08, 1.35, 8.6, 8.83);
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
          <rect
            x={-530}
            y={-68}
            width={1020 * panel}
            height={136}
            fill={panelColor}
          />
          {/* Adjacent sections overlap by 1px on their interior edge. */}
          <rect
            x={489}
            y={-48}
            width={41 * step1}
            height={96}
            fill={panelColor}
          />
          <rect
            x={529}
            y={-18}
            width={21 * step2}
            height={36}
            fill={panelColor}
          />
          <path
            d="M 482 -68 H 490 V -48 H 530 V -18 H 550 V 18 H 530 V 48 H 490 V 68 H 482 V 40 H 522 V 10 H 542 V -10 H 522 V -40 H 482 Z"
            fill={accentColor}
            transform={`translate(${18 * (1 - edge)} 0)`}
            opacity={edge}
          />
          <rect
            x={-530}
            y={-68 * rail}
            width={11}
            height={136 * rail}
            fill={accentColor}
          />
          <g visibility={detail > 0 ? "visible" : "hidden"}>
            <path
              d="M -509 80 H -430 M -418 80 H -388"
              stroke={secondaryColor}
              strokeWidth={3}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - detail}
            />
            <path
              d="M -542 -42 V 42"
              stroke={panelColor}
              strokeWidth={2.5}
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

export default CaptionSteppedEdge;
