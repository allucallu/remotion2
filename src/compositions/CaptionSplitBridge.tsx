import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionSplitBridgeProps = {
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

export const CaptionSplitBridgeConfig = {
  id: "CaptionSplitBridge",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionSplitBridge: React.FC<CaptionSplitBridgeProps> = ({
  background = "black",
  panelColor = "#F3F1EA",
  accentColor = "#C3A165",
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

  const left = part(0, 0.78, 8.98, 9.7);
  const right = part(0.1, 0.88, 8.9, 9.62);
  const edges = part(0.72, 1.07, 8.74, 8.99);
  const top = part(0.88, 1.22, 8.6, 8.84);
  const bottom = part(1, 1.35, 8.68, 8.92);
  const bridge = Math.min(left, right);
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
            x={-520 * left}
            y={-72}
            width={520 * left}
            height={144}
            rx={5}
            fill={panelColor}
          />
          <rect
            x={0}
            y={-72}
            width={520 * right}
            height={144}
            rx={5}
            fill={panelColor}
          />
          {/* Overlap covers both inner corner radii without a seam. */}
          <rect
            x={-7 * bridge}
            y={-72}
            width={14 * bridge}
            height={144}
            fill={panelColor}
          />
          <g visibility={edges > 0 ? "visible" : "hidden"}>
            <rect
              x={-520}
              y={-72 * edges}
              width={8}
              height={144 * edges}
              fill={accentColor}
            />
            <rect
              x={512}
              y={-72 * edges}
              width={8}
              height={144 * edges}
              fill={accentColor}
            />
          </g>
          <g
            transform={`translate(0 ${-28 * (1 - top)})`}
            visibility={top > 0 ? "visible" : "hidden"}
          >
            <path
              d="M -37 -84 H 37 M -23 -90 H 23"
              stroke={secondaryColor}
              strokeWidth={4}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - top}
            />
          </g>
          <g
            transform={`translate(0 ${28 * (1 - bottom)})`}
            visibility={bottom > 0 ? "visible" : "hidden"}
          >
            <path
              d="M -37 84 H 37 M -23 90 H 23"
              stroke={secondaryColor}
              strokeWidth={4}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - bottom}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CaptionSplitBridge;
