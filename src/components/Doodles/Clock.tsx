import React from "react";
import { useCurrentFrame } from "remotion";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

interface ClockProps extends DoodleProps {
  /** Putar jarum jam secara cepat (cocok untuk Pre-Chorus "terlalu banyak waktu") */
  spin?: boolean;
}

export const Clock: React.FC<ClockProps> = ({
  start = 0,
  progress,
  size = 110,
  mode = "day",
  color,
  rotate = 0,
  spin = false,
}) => {
  const frame = useCurrentFrame();
  const strokeColor =
    color ?? (mode === "night" ? mvConfig.palette.nightChalk : mvConfig.palette.graphite);

  const minuteAngle = spin ? frame * 12 : 45;
  const hourAngle = spin ? frame * 1.5 : -60;

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
      {/* Lingkaran Jam Dinding */}
      <DrawPath
        d="M 50 10 C 74 10, 90 26, 90 50 C 90 74, 74 90, 50 90 C 26 90, 10 74, 10 50 C 10 26, 26 10, 50 10 Z"
        start={start}
        duration={20}
        progress={progress}
        color={strokeColor}
        strokeWidth={3.5}
        fill={mode === "night" ? "rgba(255,255,255,0.06)" : "#FFFFFF"}
      />
      {/* Tanda Angka 12, 3, 6, 9 */}
      <DrawPath
        d="M 50 16 L 50 22 M 84 50 L 78 50 M 50 84 L 50 78 M 16 50 L 22 50"
        start={start + 10}
        duration={10}
        progress={progress}
        color={mvConfig.palette.penBlue}
        strokeWidth={2.5}
      />
      {/* Jarum Jam */}
      <g transform={`rotate(${hourAngle} 50 50)`}>
        <DrawPath
          d="M 50 50 L 50 30"
          start={start + 14}
          duration={8}
          progress={progress}
          color={strokeColor}
          strokeWidth={4}
        />
      </g>
      {/* Jarum Menit */}
      <g transform={`rotate(${minuteAngle} 50 50)`}>
        <DrawPath
          d="M 50 50 L 50 22"
          start={start + 16}
          duration={8}
          progress={progress}
          color={mvConfig.palette.highlighterPink}
          strokeWidth={2.8}
        />
      </g>
      {/* Titik Tengah */}
      <circle cx="50" cy="50" r="3.5" fill={strokeColor} />
    </svg>
  );
};
