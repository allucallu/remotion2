import React from "react";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

export const QuestionMark: React.FC<DoodleProps> = ({
  start = 0,
  progress,
  size = 54,
  mode = "day",
  color,
  rotate = 10,
}) => {
  const strokeColor =
    color ?? (mode === "night" ? mvConfig.palette.highlighterYellow : mvConfig.palette.penBlue);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 80"
      style={{
        overflow: "visible",
        transform: `rotate(${rotate}deg)`,
        filter: `url(#${HAND_FILTER_ID})`,
      }}
    >
      <DrawPath
        d="M 18 24 C 18 12, 46 12, 46 26 C 46 36, 32 38, 32 50"
        start={start}
        duration={16}
        progress={progress}
        color={strokeColor}
        strokeWidth={5.5}
      />
      <DrawPath
        d="M 32 62 A 3 3 0 1 1 31.9 62 Z"
        start={start + 12}
        duration={6}
        progress={progress}
        color={strokeColor}
        fill={strokeColor}
        strokeWidth={3}
      />
    </svg>
  );
};
