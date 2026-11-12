import React from "react";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

export const Cup: React.FC<DoodleProps> = ({
  start = 0,
  progress,
  size = 90,
  mode = "day",
  color,
  rotate = 0,
}) => {
  const strokeColor =
    color ?? (mode === "night" ? mvConfig.palette.nightChalk : mvConfig.palette.graphite);
  const steamColor =
    mode === "night" ? mvConfig.palette.mint : mvConfig.palette.penBlue;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        overflow: "visible",
        transform: `rotate(${rotate}deg)`,
        filter: `url(#${HAND_FILTER_ID})`,
      }}
    >
      {/* Badan Cangkir */}
      <DrawPath
        d="M 25 46 L 30 78 C 30 85, 65 85, 65 78 L 70 46 Z"
        start={start}
        duration={18}
        progress={progress}
        color={strokeColor}
        strokeWidth={3.5}
        fill={mode === "night" ? "rgba(255,255,255,0.1)" : "#FFFFFF"}
      />
      {/* Pegangan Cangkir */}
      <DrawPath
        d="M 68 52 C 84 52, 84 72, 66 72"
        start={start + 8}
        duration={12}
        progress={progress}
        color={strokeColor}
        strokeWidth={3.5}
      />
      {/* Piringan Bawah */}
      <DrawPath
        d="M 18 85 L 78 85"
        start={start + 12}
        duration={10}
        progress={progress}
        color={strokeColor}
        strokeWidth={3.5}
      />
      {/* Uap Hangat */}
      <DrawPath
        d="M 38 38 C 33 28, 43 22, 38 14"
        start={start + 14}
        duration={12}
        progress={progress}
        color={steamColor}
        strokeWidth={2.2}
        opacity={0.75}
      />
      <DrawPath
        d="M 54 36 C 49 26, 59 20, 54 12"
        start={start + 18}
        duration={12}
        progress={progress}
        color={steamColor}
        strokeWidth={2.2}
        opacity={0.75}
      />
    </svg>
  );
};

