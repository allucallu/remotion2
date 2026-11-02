import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionWovenBorderProps = {
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

export const CaptionWovenBorderConfig = {
  id: "CaptionWovenBorder",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionWovenBorder: React.FC<CaptionWovenBorderProps> = ({
  background = "black",
  panelColor = "#F3E8D6",
  accentColor = "#86A89D",
  secondaryColor = "#4A6868",
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
  const clipId = `CaptionWovenBorder-${uid}`;

  const border = part(0, 0.4, 9.4, 9.8);
  const panel = part(0.18, 0.75, 9.1, 9.5);
  const lock = part(1.02, 1.25, 8.69, 8.9);
  const stitching = part(1.12, 1.35, 8.6, 8.79);
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
                x={-527 * panel}
                y={-72}
                width={1054 * panel}
                height={144}
              />
            </clipPath>
          </defs>
          <rect
            x={-546 * border}
            y={-91}
            width={1092 * border}
            height={182}
            rx={16}
            fill={accentColor}
          />
          <g clipPath={`url(#${clipId})`}>
            <rect
              x={-527}
              y={-72}
              width={1054}
              height={144}
              rx={7}
              fill={panelColor}
            />
          </g>
          <path
            d="M -507 -82 H 507 M -507 82 H 507"
            stroke={secondaryColor}
            strokeWidth={2}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - panel}
            visibility={panel > 0 ? "visible" : "hidden"}
          />
          {([-1, 1] as const).map((side, i) => {
            const first = part(0.5 + i * 0.1, 0.92 + i * 0.1, 8.92, 9.22);
            const second = part(0.68 + i * 0.1, 1.1 + i * 0.1, 8.82, 9.12);
            return (
              <g key={side} transform={`scale(${-side} 1)`}>
                <path
                  d="M -567 -43 L -550 -57 L -487 57 L -504 70 Z"
                  fill={side === -1 ? "#CD9B7A" : secondaryColor}
                  transform={`translate(${-66 * (1 - first)} ${-114 * (1 - first)})`}
                  opacity={first}
                />
                <path
                  d="M -566 43 L -550 57 L -487 -57 L -504 -70 Z"
                  fill={side === -1 ? secondaryColor : "#CD9B7A"}
                  transform={`translate(${-66 * (1 - second)} ${114 * (1 - second)})`}
                  opacity={second}
                />
                <path
                  d="M -535 -2 L -522 -25 L -511 -6 L -523 17 Z"
                  fill={side === -1 ? "#CD9B7A" : secondaryColor}
                  transform={`translate(-523 -4) scale(${lock}) translate(523 4)`}
                  visibility={lock > 0 ? "visible" : "hidden"}
                />
              </g>
            );
          })}
          <g
            stroke={panelColor}
            strokeWidth={2}
            opacity={0.8}
            visibility={stitching > 0 ? "visible" : "hidden"}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <path
                key={i}
                d={`M ${-456 + i * 39} -84 l 7 0 M ${-456 + i * 39} 84 l 7 0`}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - stitching}
              />
            ))}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CaptionWovenBorder;
