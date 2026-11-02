import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionTornCollageProps = {
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

export const CaptionTornCollageConfig = {
  id: "CaptionTornCollage",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionTornCollage: React.FC<CaptionTornCollageProps> = ({
  background = "black",
  panelColor = "#F2EBDC",
  accentColor = "#9995B5",
  secondaryColor = "#716863",
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
  const clipId = `CaptionTornCollage-${uid}`;

  const back = part(0, 0.46, 9.3, 9.8);
  const panel = part(0.23, 1.01, 8.94, 9.46);
  const leftTape = part(0.91, 1.22, 8.68, 8.92);
  const rightTape = part(1.04, 1.35, 8.6, 8.84);
  const tear = -548 + 1098 * panel;
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
              {/* A moving ragged edge uncovers only the main paper, including its fibers. */}
              <path
                d={`M -550 -90 H ${tear} l -6 20 7 22 -6 24 6 23 -7 24 5 24 -5 22 6 21 H -550 Z`}
              />
            </clipPath>
          </defs>
          <g
            transform={`translate(${12 + 120 * (1 - back)} ${12 + 18 * (1 - back)}) rotate(-1.1)`}
            opacity={back}
            visibility={back > 0 ? "visible" : "hidden"}
          >
            <path
              d="M -536 -75 L -509 -81 L -478 -77 H 502 L 537 -68 V 61 L 521 76 H -505 L -539 65 Z"
              fill={accentColor}
            />
            <path d="M -523 64 H 507" stroke={secondaryColor} strokeWidth={2} />
          </g>
          <g
            clipPath={`url(#${clipId})`}
            visibility={panel > 0 ? "visible" : "hidden"}
          >
            <path
              d="M -540 -61 L -530 -73 L -514 -70 L -497 -78 L -478 -74 L -454 -77 H 459 L 479 -73 L 501 -78 L 521 -69 L 539 -72 L 533 -52 L 540 -31 L 534 -7 L 540 18 L 534 39 L 537 60 L 522 70 L 501 67 L 480 77 L 459 73 H -463 L -484 78 L -505 72 L -522 76 L -536 63 L -532 42 L -540 17 L -533 -5 L -539 -29 Z"
              fill={panelColor}
            />
            <path
              d="M -512 60 L -488 64 L -469 60 M 474 -61 L 495 -64 L 514 -59"
              stroke={secondaryColor}
              strokeWidth={1.5}
              fill="none"
              opacity={0.55}
            />
            {Array.from({ length: 13 }, (_, i) => (
              <g
                key={i}
                stroke={secondaryColor}
                strokeWidth={0.8}
                opacity={0.22}
              >
                <path
                  d={`M ${-522 + (i % 3) * 8} ${-49 + i * 8} l ${4 + (i % 4)} -1`}
                />
                <path
                  d={`M ${499 + (i % 3) * 7} ${-46 + i * 8} l ${3 + (i % 3)} 1`}
                />
              </g>
            ))}
          </g>
          <g
            transform={`translate(-490 ${-65 - 24 * (1 - leftTape)}) rotate(${-14 - 12 * (1 - leftTape)})`}
            opacity={leftTape}
          >
            <path d="M -43 -15 L 41 -17 L 44 13 L -41 16 Z" fill="#CC977D" />
            <path
              d="M -33 -7 H 32 M -32 2 H 33"
              stroke={panelColor}
              strokeWidth={1.2}
              opacity={0.38}
            />
          </g>
          <g
            transform={`translate(493 ${65 - 24 * (1 - rightTape)}) rotate(${-12 + 12 * (1 - rightTape)})`}
            opacity={rightTape}
          >
            <path d="M -34 -13 H 34 L 37 13 H -36 Z" fill="#CC977D" />
            <path
              d="M -27 -5 H 26 M -27 3 H 26"
              stroke={panelColor}
              strokeWidth={1.1}
              opacity={0.38}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default CaptionTornCollage;
