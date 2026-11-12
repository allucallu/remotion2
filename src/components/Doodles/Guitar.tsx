import React from "react";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

export const Guitar: React.FC<DoodleProps> = ({
  start = 0,
  progress,
  size = 180,
  mode = "day",
  color,
  rotate = -12,
}) => {
  const strokeColor =
    color ?? (mode === "night" ? mvConfig.palette.nightChalk : mvConfig.palette.graphite);
  const accentColor =
    mode === "night" ? mvConfig.palette.mint : mvConfig.palette.penBlue;

  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 140 200"
      style={{
        overflow: "visible",
        transform: `rotate(${rotate}deg)`,
        filter: `url(#${HAND_FILTER_ID})`,
      }}
    >
      {/* Badan Gitar Figure-8 Sederhana */}
      <DrawPath
        d="M 55 85 C 40 85, 32 102, 42 118 C 30 130, 26 158, 45 174 C 58 184, 82 184, 95 174 C 114 158, 110 130, 98 118 C 108 102, 100 85, 85 85 Z"
        start={start}
        duration={24}
        progress={progress}
        color={strokeColor}
        strokeWidth={3.5}
        fill={mode === "night" ? "rgba(255,255,255,0.06)" : "rgba(255, 230, 109, 0.25)"}
      />
      {/* Leher Gitar (Neck) */}
      <DrawPath
        d="M 63 85 L 63 26 L 77 26 L 77 85"
        start={start + 10}
        duration={15}
        progress={progress}
        color={strokeColor}
        strokeWidth={3}
        fill={mode === "night" ? "rgba(255,255,255,0.08)" : "rgba(247, 242, 231, 0.8)"}
      />
      {/* Kepala Gitar (Headstock) */}
      <DrawPath
        d="M 60 26 L 58 10 L 82 10 L 80 26 Z"
        start={start + 16}
        duration={12}
        progress={progress}
        color={strokeColor}
        strokeWidth={3}
      />
      {/* Lubang Suara (Sound Hole) */}
      <DrawPath
        d="M 70 110 A 13 13 0 1 1 69.9 110 Z"
        start={start + 12}
        duration={15}
        progress={progress}
        color={accentColor}
        strokeWidth={3}
      />
      {/* Bridge & Senar Tipis */}
      <DrawPath
        d="M 55 154 L 85 154"
        start={start + 18}
        duration={10}
        progress={progress}
        color={strokeColor}
        strokeWidth={4}
      />
      <DrawPath
        d="M 66 26 L 66 154 M 70 26 L 70 154 M 74 26 L 74 154"
        start={start + 20}
        duration={12}
        progress={progress}
        color={accentColor}
        strokeWidth={1.3}
        opacity={0.7}
      />
    </svg>
  );
};

