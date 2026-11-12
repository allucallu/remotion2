import React from "react";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

interface LampProps extends DoodleProps {
  lit?: boolean;
}

export const Lamp: React.FC<LampProps> = ({
  start = 0,
  progress,
  size = 130,
  mode = "night",
  color,
  rotate = 0,
  lit = true,
}) => {
  const strokeColor =
    color ?? (mode === "night" ? mvConfig.palette.nightChalk : mvConfig.palette.graphite);

  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 120 140"
      style={{
        overflow: "visible",
        transform: `rotate(${rotate}deg)`,
        filter: `url(#${HAND_FILTER_ID})`,
      }}
    >
      {/* Cahaya Lampu Segitiga Lembut jika menyala */}
      {lit && (
        <polygon
          points="42,58 10,130 90,130 68,58"
          fill="rgba(255, 230, 109, 0.2)"
        />
      )}
      {/* Alas Lampu */}
      <DrawPath
        d="M 48 128 L 92 128 L 86 118 L 54 118 Z"
        start={start}
        duration={12}
        progress={progress}
        color={strokeColor}
        strokeWidth={3.5}
        fill={mode === "night" ? "#334155" : "#D1D5DB"}
      />
      {/* Tiang Lampu Meja */}
      <DrawPath
        d="M 70 118 L 85 75 L 55 42"
        start={start + 6}
        duration={16}
        progress={progress}
        color={strokeColor}
        strokeWidth={3.5}
      />
      {/* Kap Lampu */}
      <DrawPath
        d="M 38 56 L 48 34 L 68 42 L 66 64 Z"
        start={start + 14}
        duration={14}
        progress={progress}
        color={strokeColor}
        strokeWidth={3.5}
        fill={lit ? mvConfig.palette.highlighterYellow : "#9CA3AF"}
      />
      {/* Bohlam Kecil */}
      <DrawPath
        d="M 48 56 C 48 63, 58 65, 60 58"
        start={start + 18}
        duration={8}
        progress={progress}
        color={mvConfig.palette.highlighterYellow}
        strokeWidth={3}
      />
    </svg>
  );
};
