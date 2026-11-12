import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { mvConfig } from "../config";

interface HighlighterProps {
  /** Frame mulai sapuan stabilo (jika tidak memakai override progress) */
  start?: number;
  /** Frame selesai sapuan stabilo */
  end?: number;
  /** Override progres secara langsung (0 s/d 1) */
  progress?: number;
  /** Warna stabilo (default: kuning #FFE66D) */
  color?: string;
  /** Opasitas stabilo */
  opacity?: number;
  /** Sedikit kemiringan alami goresan spidol (derajat) */
  tiltDeg?: number;
}

/**
 * Sapuan stabilo semi-transparan di belakang kata aktif yang melebar dari 0% ke 100%.
 */
export const Highlighter: React.FC<HighlighterProps> = ({
  start = 0,
  end = 15,
  progress: overrideProgress,
  color = mvConfig.palette.highlighterYellow,
  opacity = 0.72,
  tiltDeg = -1.2,
}) => {
  const frame = useCurrentFrame();

  const widthPct =
    overrideProgress !== undefined
      ? Math.max(0, Math.min(1, overrideProgress)) * 100
      : interpolate(frame, [start, Math.max(start + 1, end)], [0, 100], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  if (widthPct <= 0) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: -4,
        bottom: "10%",
        height: "62%",
        width: `calc(${widthPct}% + 8px)`,
        backgroundColor: color,
        opacity,
        borderRadius: "6px 10px 5px 8px",
        transform: `rotate(${tiltDeg}deg)`,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};
