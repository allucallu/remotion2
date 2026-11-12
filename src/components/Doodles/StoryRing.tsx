import React from "react";
import { mvConfig } from "../../config";
import { DrawPath } from "../DrawPath";
import { HAND_FILTER_ID } from "../HandFilter";
import type { DoodleProps } from "./types";

interface StoryRingProps extends DoodleProps {
  /** Konten siluet Nona di dalam lingkaran story */
  children?: React.ReactNode;
  /** Apakah cincin dalam status sudah dilihat (abu-abu) atau belum (gradien aktif) */
  seen?: boolean;
}

/**
 * Cincin Story Instagram bergaya doodle dengan gradien kuning -> pink -> ungu (#F9CE34 -> #EE2A7B -> #6228D7).
 */
export const StoryRing: React.FC<StoryRingProps> = ({
  start = 0,
  progress,
  size = 180,
  mode = "day",
  rotate = 0,
  children,
  seen = false,
}) => {
  const innerBg = mode === "night" ? "#212b52" : "#FFFFFF";
  const ringGradId = "story-ring-grad-id";

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: `url(#${HAND_FILTER_ID})`,
        }}
      >
        <defs>
          <linearGradient id={ringGradId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F9CE34" />
            <stop offset="50%" stopColor="#EE2A7B" />
            <stop offset="100%" stopColor="#6228D7" />
          </linearGradient>
        </defs>

        {/* Lingkaran dalam avatar */}
        <circle
          cx="60"
          cy="60"
          r="46"
          fill={innerBg}
          stroke={mode === "night" ? "rgba(255,255,255,0.12)" : "#E5E7EB"}
          strokeWidth="2"
        />

        {/* Cincin Luar Story */}
        <DrawPath
          d="M 60 6 A 54 54 0 1 1 59.9 6 Z"
          start={start}
          duration={24}
          progress={progress}
          color={seen ? "#9CA3AF" : `url(#${ringGradId})`}
          strokeWidth={6.5}
        />

        {/* Aksen bintang kecil di sudut cincin */}
        {!seen && (
          <DrawPath
            d="M 102 18 L 106 22 M 106 18 L 102 22"
            start={start + 18}
            duration={10}
            progress={progress}
            color={mvConfig.palette.highlighterPink}
            strokeWidth={2.5}
          />
        )}
      </svg>

      {/* Isi siluet di dalam lingkaran */}
      <div
        style={{
          position: "relative",
          width: "76%",
          height: "76%",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

