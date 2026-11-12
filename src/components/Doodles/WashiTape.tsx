import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { mvConfig } from "../../config";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

interface WashiTapeProps extends DoodleProps {
  /** Panjang pita isolasi */
  width?: number;
  /** Motif strip atau titik-titik */
  pattern?: "solid" | "stripes" | "dots";
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  start = 0,
  progress: overrideProgress,
  width = 140,
  color = mvConfig.palette.mint,
  rotate = -15,
  pattern = "stripes",
}) => {
  const frame = useCurrentFrame();
  const animProgress =
    overrideProgress !== undefined
      ? overrideProgress
      : interpolate(frame, [start, start + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  if (animProgress <= 0) return null;

  const height = 36;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 140 36"
      style={{
        overflow: "visible",
        transform: `rotate(${rotate}deg) scaleX(${animProgress})`,
        transformOrigin: "left center",
        opacity: 0.85,
        filter: `url(#${HAND_FILTER_ID})`,
      }}
    >
      {/* Bentuk pita dengan tepi sobek kiri kanan */}
      <path
        d="M 4 2 L 136 2 L 132 8 L 138 15 L 133 22 L 139 30 L 135 34 L 5 34 L 9 27 L 2 20 L 7 12 L 2 6 Z"
        fill={color}
        stroke="rgba(51, 54, 61, 0.25)"
        strokeWidth="1.2"
      />
      {pattern === "stripes" && (
        <g stroke="rgba(255, 255, 255, 0.45)" strokeWidth="3">
          <line x1="20" y1="2" x2="10" y2="34" />
          <line x1="40" y1="2" x2="30" y2="34" />
          <line x1="60" y1="2" x2="50" y2="34" />
          <line x1="80" y1="2" x2="70" y2="34" />
          <line x1="100" y1="2" x2="90" y2="34" />
          <line x1="120" y1="2" x2="110" y2="34" />
        </g>
      )}
      {pattern === "dots" && (
        <g fill="rgba(255, 255, 255, 0.6)">
          <circle cx="25" cy="12" r="3" />
          <circle cx="50" cy="24" r="3" />
          <circle cx="75" cy="12" r="3" />
          <circle cx="100" cy="24" r="3" />
          <circle cx="122" cy="14" r="3" />
        </g>
      )}
    </svg>
  );
};

