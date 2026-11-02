import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionCapsuleTrackProps = {
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

export const CaptionCapsuleTrackConfig = {
  id: "CaptionCapsuleTrack",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionCapsuleTrack: React.FC<CaptionCapsuleTrackProps> = ({
  background = "black",
  panelColor = "#F3F1EA",
  accentColor = "#849FA8",
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

  const body = part(0, 0.86, 8.98, 9.8);
  const caps = part(0, 0.2, 9.56, 9.8);
  const leftArc = part(0.65, 1.12, 8.79, 9.04);
  const rightArc = part(0.76, 1.23, 8.7, 8.95);
  const track = part(0.98, 1.28, 8.66, 8.88);
  const indicator = part(1.1, 1.35, 8.6, 8.8);
  const halfWidth = 72 * caps + 448 * body;
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
          {/* Extend the straight span without stretching the cap radius. Once the
              ends meet on release, close their radius to zero instead of popping off. */}
          <rect
            x={-halfWidth}
            y={-72 * caps}
            width={2 * halfWidth}
            height={144 * caps}
            rx={72 * caps}
            fill={panelColor}
            visibility={body > 0 ? "visible" : "hidden"}
          />
          <g
            transform={`translate(${448 * (1 - body)} 0)`}
            visibility={leftArc > 0 ? "visible" : "hidden"}
          >
            <path
              d="M -427 -59 H -448 A 59 59 0 0 0 -448 59 H -427"
              stroke={accentColor}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - leftArc}
            />
          </g>
          <g
            transform={`translate(${-448 * (1 - body)} 0)`}
            visibility={rightArc > 0 ? "visible" : "hidden"}
          >
            <path
              d="M 427 -59 H 448 A 59 59 0 0 1 448 59 H 427"
              stroke={secondaryColor}
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - rightArc}
            />
          </g>
          <path
            d="M -366 84 H 366"
            stroke={secondaryColor}
            strokeWidth={2}
            opacity={0.8}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - track}
            visibility={track > 0 ? "visible" : "hidden"}
          />
          <rect
            x={-28 * indicator}
            y={80 + 15 * (1 - indicator)}
            width={56 * indicator}
            height={7}
            rx={3.5}
            fill={accentColor}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CaptionCapsuleTrack;
