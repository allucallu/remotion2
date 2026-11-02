import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionOpenFrameProps = {
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

export const CaptionOpenFrameConfig = {
  id: "CaptionOpenFrame",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionOpenFrame: React.FC<CaptionOpenFrameProps> = ({
  background = "black",
  panelColor = "#F3F1EA",
  accentColor = "#BEA76A",
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

  const upper = part(0, 0.82, 9.05, 9.8);
  const lower = part(0.14, 1.02, 8.95, 9.7);
  const corner = part(0.87, 1.22, 8.7, 8.98);
  const side = part(1, 1.3, 8.65, 8.9);
  const detail = part(1.09, 1.35, 8.6, 8.82);
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
          <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
            <path
              d="M -520 -28 V -72 H 467"
              stroke={panelColor}
              strokeWidth={5}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - upper}
              visibility={upper > 0 ? "visible" : "hidden"}
            />
            <path
              d="M 520 -25 V 72 H -520 V 14"
              stroke={panelColor}
              strokeWidth={5}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - lower}
              visibility={lower > 0 ? "visible" : "hidden"}
            />
            <path
              d="M 486 -72 H 520 V -44"
              stroke={accentColor}
              strokeWidth={8}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - corner}
              visibility={corner > 0 ? "visible" : "hidden"}
            />
            <path
              d="M -536 -19 V 4"
              stroke={accentColor}
              strokeWidth={5}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - side}
              visibility={side > 0 ? "visible" : "hidden"}
            />
            <path
              d="M -471 84 H -354"
              stroke={secondaryColor}
              strokeWidth={2.5}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - detail}
              visibility={detail > 0 ? "visible" : "hidden"}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CaptionOpenFrame;
