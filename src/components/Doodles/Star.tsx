import React from "react";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

interface StarProps extends DoodleProps {
  variant?: "sparkle" | "five-point";
}

export const Star: React.FC<StarProps> = ({
  start = 0,
  progress,
  size = 48,
  mode = "day",
  color,
  rotate = 8,
  variant = "five-point",
}) => {
  const strokeColor =
    color ?? (mode === "night" ? mvConfig.palette.highlighterYellow : mvConfig.palette.penBlue);
  const fillColor = mvConfig.palette.highlighterYellow;

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
      {variant === "sparkle" ? (
        <DrawPath
          d="M 32 8 Q 32 32 56 32 Q 32 32 32 56 Q 32 32 8 32 Q 32 32 32 8 Z"
          start={start}
          duration={16}
          progress={progress}
          color={strokeColor}
          strokeWidth={3}
          fill={fillColor}
        />
      ) : (
        <DrawPath
          d="M 32 8 L 38 24 L 56 24 L 41 35 L 47 52 L 32 42 L 17 52 L 23 35 L 8 24 L 26 24 Z"
          start={start}
          duration={18}
          progress={progress}
          color={strokeColor}
          strokeWidth={3}
          fill={fillColor}
        />
      )}
    </svg>
  );
};
