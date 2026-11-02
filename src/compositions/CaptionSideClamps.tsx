import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionSideClampsProps = {
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

export const CaptionSideClampsConfig = {
  id: "CaptionSideClamps",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionSideClamps: React.FC<CaptionSideClampsProps> = ({
  background = "black",
  panelColor = "#F3F1EA",
  accentColor = "#8DA08A",
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
  const clipId = `CaptionSideClamps-${uid}`;

  const panel = part(0.22, 0.92, 8.98, 9.5);
  const detail = part(1.04, 1.35, 8.6, 8.79);
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
                x={-500 * panel}
                y={-80}
                width={1000 * panel}
                height={160}
              />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <rect
              x={-492}
              y={-68}
              width={984}
              height={136}
              rx={10}
              fill={panelColor}
            />
            <rect
              x={-492}
              y={-68}
              width={7}
              height={136}
              fill={secondaryColor}
            />
            <rect
              x={485}
              y={-68}
              width={7}
              height={136}
              fill={secondaryColor}
            />
          </g>
          {([-1, 1] as const).map((side, i) => {
            const anchor = part(
              i * 0.1,
              0.34 + i * 0.1,
              9.44 - i * 0.08,
              9.8 - i * 0.08,
            );
            const grip = part(0.82 + i * 0.1, 1.2 + i * 0.1, 8.74, 9.04);
            // Rotate around the stationary hinge at (+/-522, 0), independent of assembly travel.
            return (
              <g
                key={side}
                transform={`translate(${side * (522 + 60 * (1 - anchor))} 0) rotate(${side * 38 * (1 - grip)}) scale(${-side} 1)`}
                visibility={anchor > 0 ? "visible" : "hidden"}
              >
                <path
                  d="M 21 -82 H 0 V 82 H 21"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={10}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - anchor}
                />
                <circle cx={-11} cy={0} r={5 * anchor} fill={panelColor} />
                <path
                  d="M -18 -23 V -10 M -18 10 V 23"
                  stroke={secondaryColor}
                  strokeWidth={2}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - detail}
                  visibility={detail > 0 ? "visible" : "hidden"}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CaptionSideClamps;
