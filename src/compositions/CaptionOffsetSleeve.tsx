import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionOffsetSleeveProps = {
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

export const CaptionOffsetSleeveConfig = {
  id: "CaptionOffsetSleeve",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionOffsetSleeve: React.FC<CaptionOffsetSleeveProps> = ({
  background = "black",
  panelColor = "#F3F1EA",
  accentColor = "#859177",
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
  const clipId = `CaptionOffsetSleeve-${uid}`;

  const back = part(0, 0.46, 9.32, 9.8);
  const panel = part(0.25, 0.98, 8.95, 9.45);
  const binding = part(0.88, 1.26, 8.7, 9.03);
  const detail = part(1.06, 1.35, 8.6, 8.8);
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
              <rect x={-532} y={-79} width={1054} height={144} />
            </clipPath>
          </defs>
          <g visibility={back > 0 ? "visible" : "hidden"}>
            <path
              d={`M -502 -59 H ${-502 + 1044 * back} V 87 H -502 Z`}
              fill={accentColor}
            />
            <path
              d="M -502 87 L -520 69 H -502 Z"
              fill={secondaryColor}
              transform={`translate(-502 69) scale(${back}) translate(502 -69)`}
            />
          </g>
          <g
            clipPath={`url(#${clipId})`}
            visibility={panel > 0 ? "visible" : "hidden"}
          >
            <path
              d="M -532 -79 H 508 L 522 -65 V 65 H -518 L -532 51 Z"
              fill={panelColor}
              transform={`translate(${-1054 * (1 - panel)} 0)`}
            />
          </g>
          <g
            transform={`translate(508 -57) skewY(${-28 * (1 - binding)}) scale(${binding} 1) translate(-508 57)`}
            visibility={binding > 0 ? "visible" : "hidden"}
          >
            <path
              d="M 495 -79 H 508 L 522 -65 V 65 H 508 V -57 L 495 -70 Z"
              fill={secondaryColor}
            />
          </g>
          <path
            d="M -532 -59 V 36"
            stroke={accentColor}
            strokeWidth={5}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - binding}
            visibility={binding > 0 ? "visible" : "hidden"}
          />
          <path
            d="M -479 77 H -432 M -421 77 H -396"
            stroke={panelColor}
            strokeWidth={2.5}
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

export default CaptionOffsetSleeve;
