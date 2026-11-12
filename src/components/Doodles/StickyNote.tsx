import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../../config";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

interface StickyNoteProps extends DoodleProps {
  children?: React.ReactNode;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  start = 0,
  progress: overrideProgress,
  size = 180,
  color = mvConfig.palette.highlighterYellow,
  rotate = 3,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const noteSpring =
    overrideProgress !== undefined
      ? overrideProgress
      : spring({
          frame: Math.max(0, frame - start),
          fps,
          config: { damping: 16, stiffness: 120, mass: 0.7 },
        });

  if (frame < start && overrideProgress === undefined) {
    return null;
  }

  const scale = interpolate(noteSpring, [0, 1], [0.85, 1]);
  const opacity = interpolate(noteSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        opacity,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
        filter: "drop-shadow(3px 6px 10px rgba(0, 0, 0, 0.14))",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: `url(#${HAND_FILTER_ID})`,
        }}
      >
        {/* Kertas Sticky Note dengan sudut terlipat kanan bawah */}
        <path
          d="M 8 12 L 152 10 L 150 130 L 128 152 L 10 150 Z"
          fill={color}
          stroke={mvConfig.palette.graphite}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* Lipatan sudut */}
        <path
          d="M 128 152 L 130 130 L 150 130 Z"
          fill="rgba(0, 0, 0, 0.12)"
          stroke={mvConfig.palette.graphite}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Selotip atas */}
        <path
          d="M 55 2 L 105 2 L 102 18 L 58 18 Z"
          fill="rgba(255, 255, 255, 0.55)"
          stroke="rgba(51, 54, 61, 0.2)"
          strokeWidth={1.2}
        />
      </svg>

      {children && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            color: mvConfig.palette.graphite,
            textAlign: "center",
            fontSize: 24,
            lineHeight: 1.25,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
