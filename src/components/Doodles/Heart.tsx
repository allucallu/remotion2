import React from "react";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

export const Heart: React.FC<DoodleProps> = ({
  start = 0,
  progress,
  size = 54,
  mode = "day",
  color,
  rotate = -8,
}) => {
  const strokeColor =
    color ?? (mode === "night" ? mvConfig.palette.nightChalk : mvConfig.palette.graphite);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{
        overflow: "visible",
        transform: `rotate(${rotate}deg)`,
        filter: `url(#${HAND_FILTER_ID})`,
      }}
    >
      <DrawPath
        d="M 32 54 C 32 54 10 38 10 22 C 10 13 17 8 24 8 C 28.5 8 31 11 32 13 C 33 11 35.5 8 40 8 C 47 8 54 13 54 22 C 54 38 32 54 32 54 Z"
        start={start}
        duration={18}
        progress={progress}
        color={strokeColor}
        strokeWidth={3.2}
        fill={mvConfig.palette.highlighterPink}
      />
      {/* Garis pantulan cahaya lucu */}
      <DrawPath
        d="M 18 18 C 16 20, 16 24, 17 26"
        start={start + 10}
        duration={8}
        progress={progress}
        color="#FFFFFF"
        strokeWidth={2.5}
      />
    </svg>
  );
};
