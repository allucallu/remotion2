import React from "react";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

interface PhoneProps extends DoodleProps {
  children?: React.ReactNode;
}

export const Phone: React.FC<PhoneProps> = ({
  start = 0,
  progress,
  size = 160,
  mode = "day",
  color,
  rotate = 0,
  children,
}) => {
  const strokeColor =
    color ?? (mode === "night" ? mvConfig.palette.nightChalk : mvConfig.palette.graphite);
  const screenBg = mode === "night" ? "#263159" : "#FFFFFF";

  const height = size * 1.85;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height,
        transform: `rotate(${rotate}deg)`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={height}
        viewBox="0 0 120 220"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: `url(#${HAND_FILTER_ID})`,
        }}
      >
        {/* Bodi HP */}
        <DrawPath
          d="M 18 10 L 102 10 Q 112 10 112 20 L 112 200 Q 112 210 102 210 L 18 210 Q 8 210 8 200 L 8 20 Q 8 10 18 10 Z"
          start={start}
          duration={20}
          progress={progress}
          color={strokeColor}
          strokeWidth={4}
          fill={mode === "night" ? "#151c36" : "#E5E7EB"}
        />
        {/* Layar HP */}
        <DrawPath
          d="M 16 26 L 104 26 L 104 188 L 16 188 Z"
          start={start + 8}
          duration={16}
          progress={progress}
          color={strokeColor}
          strokeWidth={2.5}
          fill={screenBg}
        />
        {/* Speaker atas */}
        <DrawPath
          d="M 48 18 L 72 18"
          start={start + 14}
          duration={8}
          progress={progress}
          color={strokeColor}
          strokeWidth={2.5}
        />
        {/* Tombol / Garis Home bawah */}
        <DrawPath
          d="M 45 200 L 75 200"
          start={start + 16}
          duration={8}
          progress={progress}
          color={strokeColor}
          strokeWidth={3}
        />
      </svg>

      {/* Konten layar HP (mis. StoryRing atau teks kutipan) */}
      {children && (
        <div
          style={{
            position: "relative",
            width: "70%",
            height: "70%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
