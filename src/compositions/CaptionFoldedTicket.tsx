import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionFoldedTicketProps = {
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

export const CaptionFoldedTicketConfig = {
  id: "CaptionFoldedTicket",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionFoldedTicket: React.FC<CaptionFoldedTicketProps> = ({
  background = "black",
  panelColor = "#F3F1EA",
  accentColor = "#BA8877",
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
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `CaptionFoldedTicket-${uid}`;

  const tab = part(0, 0.32, 9.46, 9.8);
  const panel = part(0.18, 0.94, 8.96, 9.5);
  const fold = part(0.83, 1.22, 8.76, 9.02);
  const detail = part(1.04, 1.35, 8.6, 8.83);
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
              <rect x={-536} y={-72} width={1072 * panel} height={144} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <path
              d="M -536 -52 L -516 -72 H 488 L 536 -24 V 52 L 516 72 H -516 L -536 52 Z"
              fill={panelColor}
            />
          </g>
          <g
            transform={`translate(-517 0) scale(1 ${tab}) translate(517 0)`}
            visibility={tab > 0 ? "visible" : "hidden"}
          >
            <path
              d="M -536 -52 L -516 -72 H -498 V 72 H -516 L -536 52 Z"
              fill={accentColor}
            />
          </g>
          {/* The crease at x=488 stays fixed while the triangular flap unfolds. */}
          <g
            transform={`translate(488 -72) skewY(${-34 * (1 - fold)}) scale(${fold} 1)`}
            visibility={fold > 0 ? "visible" : "hidden"}
          >
            <path d="M 0 0 L 48 48 H 0 Z" fill={accentColor} />
            <path d="M 0 48 H 48 L 0 56 Z" fill={secondaryColor} />
          </g>
          <g visibility={detail > 0 ? "visible" : "hidden"}>
            <path
              d="M -522 -30 V 30 M -513 -30 V 30"
              stroke={panelColor}
              strokeWidth={2.5}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - detail}
            />
            <path
              d="M 442 82 H 510 L 523 69"
              stroke={accentColor}
              strokeWidth={3}
              fill="none"
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

export default CaptionFoldedTicket;
