import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionStackedSlatsProps = {
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

export const CaptionStackedSlatsConfig = {
  id: "CaptionStackedSlats",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionStackedSlats: React.FC<CaptionStackedSlatsProps> = ({
  background = "black",
  panelColor = "#F3F1EA",
  accentColor = "#8C9BB7",
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
  const clipId = `CaptionStackedSlats-${uid}`;

  const slats = [
    part(0, 0.68, 9.06, 9.8),
    part(0.14, 0.84, 8.96, 9.64),
    part(0.28, 1, 8.86, 9.5),
  ];
  const lock = part(0.93, 1.23, 8.7, 8.98);
  const detail = part(1.06, 1.35, 8.6, 8.82);
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
              <rect x={-530} y={-104} width={1060} height={208} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            {slats.map((arrival, i) => {
              const dx = i === 0 ? -1060 : i === 1 ? 1060 : 0;
              const dy = i === 2 ? 180 : 0;
              return (
                <g
                  key={i}
                  transform={`translate(${dx * (1 - arrival)} ${dy * (1 - arrival)})`}
                  visibility={arrival > 0 ? "visible" : "hidden"}
                >
                  {/* Preserve the 0.3px overlap at rest; never stroke the writing surface. */}
                  <rect
                    x={-520}
                    y={-72 + i * 48}
                    width={1040}
                    height={48.3}
                    fill={panelColor}
                  />
                  <rect
                    x={i === 1 ? 512 : -520}
                    y={-72 + i * 48}
                    width={8}
                    height={48.3}
                    fill={accentColor}
                  />
                </g>
              );
            })}
          </g>
          <rect
            x={-539}
            y={-47 * lock}
            width={5}
            height={94 * lock}
            rx={2}
            fill={accentColor}
          />
          <path
            d="M 427 84 H 463 M 474 84 H 491 M 502 84 H 510"
            stroke={secondaryColor}
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

export default CaptionStackedSlats;
