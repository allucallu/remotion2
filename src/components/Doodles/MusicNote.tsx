import React from "react";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

interface MusicNoteProps extends DoodleProps {
  variant?: "single" | "double";
}

export const MusicNote: React.FC<MusicNoteProps> = ({
  start = 0,
  progress,
  size = 64,
  mode = "day",
  color,
  rotate = 6,
  variant = "double",
}) => {
  const strokeColor =
    color ?? (mode === "night" ? mvConfig.palette.mint : mvConfig.palette.penBlue);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      style={{
        overflow: "visible",
        transform: `rotate(${rotate}deg)`,
        filter: `url(#${HAND_FILTER_ID})`,
      }}
    >
      {variant === "single" ? (
        <>
          <DrawPath
            d="M 38 56 C 38 62, 26 65, 22 60 C 18 55, 24 46, 33 48 C 36 49, 38 52, 38 56 Z"
            start={start}
            duration={14}
            progress={progress}
            color={strokeColor}
            fill={strokeColor}
            strokeWidth={2.5}
          />
          <DrawPath
            d="M 38 56 L 38 16 C 48 18, 56 26, 56 34"
            start={start + 4}
            duration={14}
            progress={progress}
            color={strokeColor}
            strokeWidth={4}
          />
        </>
      ) : (
        <>
          <DrawPath
            d="M 28 58 C 28 63, 18 66, 14 61 C 11 57, 16 49, 24 51 C 27 52, 28 55, 28 58 Z"
            start={start}
            duration={12}
            progress={progress}
            color={strokeColor}
            fill={strokeColor}
            strokeWidth={2.5}
          />
          <DrawPath
            d="M 60 52 C 60 57, 50 60, 46 55 C 43 51, 48 43, 56 45 C 59 46, 60 49, 60 52 Z"
            start={start + 4}
            duration={12}
            progress={progress}
            color={strokeColor}
            fill={strokeColor}
            strokeWidth={2.5}
          />
          <DrawPath
            d="M 28 58 L 28 22 L 60 15 L 60 52"
            start={start + 6}
            duration={18}
            progress={progress}
            color={strokeColor}
            strokeWidth={3.5}
          />
          <DrawPath
            d="M 28 30 L 60 23"
            start={start + 12}
            duration={10}
            progress={progress}
            color={strokeColor}
            strokeWidth={3}
          />
        </>
      )}
    </svg>
  );
};

