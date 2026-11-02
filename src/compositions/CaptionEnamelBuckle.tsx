import * as React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Standalone blank caption overlay; no text, fonts, external assets, or registry.
 * Recommended registry: 3840 x 2160, 30 fps, 300 frames.
 * The SVG uses 1920 x 1080 design coordinates, scaled to the composition output.
 * Default: animated entrance from an EMPTY first frame, steady hold, then exit.
 * Set revealOnEntry=false only for a fully visible thumbnail or a still preview.
 * Motion is frame-driven and deterministic. The middle holds still for added text.
 */
export type CaptionEnamelBuckleProps = {
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

export const CaptionEnamelBuckleConfig = {
  id: "CaptionEnamelBuckle",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 300,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const phase = (t: number, a: number, b: number) =>
  ease((t - a) / Math.max(0.001, b - a));

export const CaptionEnamelBuckle: React.FC<CaptionEnamelBuckleProps> = ({
  background = "black",
  panelColor = "#EAD9A8",
  accentColor = "#88A99B",
  secondaryColor = "#43645C",
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
  const clipId = `CaptionEnamelBuckle-${uid}`;

  const base = part(0, 0.44, 9.34, 9.8);
  const enamel = part(0.22, 0.85, 9.05, 9.46);
  const detail = part(1.06, 1.35, 8.6, 8.84);
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
            <clipPath id={`${clipId}-base`}>
              <rect x={-540 * base} y={-88} width={1080 * base} height={182} />
            </clipPath>
            <clipPath id={clipId}>
              <rect
                x={-527 * enamel}
                y={-75}
                width={1054 * enamel}
                height={145}
              />
            </clipPath>
            <linearGradient
              id={`${clipId}-metal`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0" stopColor="#A7BBB2" />
              <stop offset="0.28" stopColor="#E8E8D9" />
              <stop offset="0.6" stopColor="#B8C9BE" />
              <stop offset="1" stopColor="#7E9D94" />
            </linearGradient>
          </defs>
          <g clipPath={`url(#${clipId}-base)`}>
            <rect
              x={-539}
              y={-76}
              width={1078}
              height={169}
              rx={39}
              fill={secondaryColor}
            />
            <rect
              x={-539}
              y={-87}
              width={1078}
              height={169}
              rx={39}
              fill={accentColor}
            />
          </g>
          <g clipPath={`url(#${clipId})`}>
            <rect
              x={-526}
              y={-74}
              width={1052}
              height={143}
              rx={29}
              fill={panelColor}
            />
          </g>
          <rect
            x={-514}
            y={-62}
            width={1028}
            height={119}
            rx={20}
            stroke={secondaryColor}
            strokeWidth={1.6}
            fill="none"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - detail}
            visibility={detail > 0 ? "visible" : "hidden"}
          />
          <path
            d="M -489 -79 H 489"
            stroke="#F7F3D8"
            strokeWidth={2}
            opacity={0.7}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - detail}
            visibility={detail > 0 ? "visible" : "hidden"}
          />
          {([-1, 1] as const).map((side, i) => {
            const buckle = part(
              0.67 + i * 0.12,
              1.08 + i * 0.12,
              8.84 + i * 0.06,
              9.18 + i * 0.06,
            );
            return (
              <g
                key={side}
                transform={`translate(${side * (487 + 75 * (1 - buckle))} 0)`}
                opacity={buckle}
              >
                <rect
                  x={-19}
                  y={-102}
                  width={38}
                  height={204}
                  rx={14}
                  fill={secondaryColor}
                />
                <rect
                  x={-13}
                  y={-99}
                  width={26}
                  height={198}
                  rx={10}
                  fill={`url(#${clipId}-metal)`}
                />
                <path
                  d="M -5 -83 V -68 M -5 65 V 81"
                  stroke="#F8F5E5"
                  strokeWidth={2}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - detail}
                  visibility={detail > 0 ? "visible" : "hidden"}
                />
                <circle cx={0} cy={-48} r={3 * detail} fill={secondaryColor} />
                <circle cx={0} cy={48} r={3 * detail} fill={secondaryColor} />
              </g>
            );
          })}
          <path
            d="M -423 76 H -370 M 370 76 H 423"
            stroke={secondaryColor}
            strokeWidth={2}
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

export default CaptionEnamelBuckle;
