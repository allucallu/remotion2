import React, { useMemo } from "react";
import { evolvePath } from "@remotion/paths";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export interface PalmLinesProps {
  /** Progres animasi 0 -> 1 */
  progress?: number;
  /** Frame mulai (opsional) */
  start?: number;
  /** Durasi frame (default: 45) */
  duration?: number;
  width?: number;
  height?: number;
  /** Warna garis telapak tangan (default: pensil oranye-merah) */
  color?: string;
  /** Warna garis tepi tangan (default: tinta navy samar) */
  outlineColor?: string;
  strokeWidth?: number;
  /** Tampilkan sketsa siluet telapak tangan (default: true) */
  showHandsOutline?: boolean;
  style?: React.CSSProperties;
}

// 4 Path Garis Tangan Kiri (Life line, Head line, Heart line, Fate line)
const LEFT_PALM_PATHS = [
  "M 260 480 C 310 440, 360 380, 420 330", // Heart line
  "M 270 420 C 340 390, 400 370, 470 360", // Head line
  "M 290 350 C 350 370, 420 440, 460 510", // Life line
  "M 370 540 C 385 450, 400 380, 410 300", // Fate line
];

// 4 Path Garis Tangan Kanan (Simetris / Bercermin di sumbu X=500)
const RIGHT_PALM_PATHS = [
  "M 740 480 C 690 440, 640 380, 580 330", // Heart line kanan
  "M 730 420 C 660 390, 600 370, 530 360", // Head line kanan
  "M 710 350 C 650 370, 580 440, 540 510", // Life line kanan
  "M 630 540 C 615 450, 600 380, 590 300", // Fate line kanan
];

// Garis jembatan penghubung yang menyambungkan kedua tangan di tengah
const CONNECTING_PATHS = [
  "M 420 330 Q 500 310, 580 330", // Sambungan Heart line
  "M 470 360 Q 500 355, 530 360", // Sambungan Head line
];

export const PalmLines: React.FC<PalmLinesProps> = ({
  progress: directProgress,
  start = 0,
  duration = 45,
  width = 1000,
  height = 700,
  color = mvConfig.colors.pencilOrange,
  outlineColor = "rgba(27, 26, 46, 0.4)",
  strokeWidth = 3,
  showHandsOutline = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const computedProgress = useMemo(() => {
    if (typeof directProgress === "number") {
      return Math.max(0, Math.min(1, directProgress));
    }
    const localFrame = frame - start;
    if (localFrame <= 0) return 0;
    if (localFrame >= duration) return 1;

    const s = spring({
      frame: localFrame,
      fps,
      config: { damping: 18, stiffness: 90 },
    });
    return interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  }, [directProgress, frame, start, duration, fps]);

  // Fase 1 (0 -> 0.7): Garis masing-masing telapak tangan tumbuh ke arah tengah
  const palmProgress = Math.min(1, computedProgress / 0.7);

  // Fase 2 (0.6 -> 1.0): Garis kedua telapak tangan menyambung di tengah
  const bridgeProgress = Math.max(0, (computedProgress - 0.6) / 0.4);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1000 700"
      style={{ overflow: "visible", display: "block", ...style }}
    >
      {/* 1. Sketsa samar kontur kedua telapak tangan */}
      {showHandsOutline && (
        <g stroke={outlineColor} strokeWidth={2} fill="none" strokeDasharray="6 4">
          {/* Kontur Tangan Kiri (Ray) */}
          <path d="M 180 580 C 190 460, 240 310, 310 260 C 340 240, 380 250, 430 280 C 470 305, 490 340, 500 370 C 490 480, 450 600, 380 630 Z" />
          {/* Kontur Tangan Kanan (Sol) */}
          <path d="M 820 580 C 810 460, 760 310, 690 260 C 660 240, 620 250, 570 280 C 530 305, 510 340, 500 370 C 510 480, 550 600, 620 630 Z" />
        </g>
      )}

      {/* 2. Garis telapak tangan kiri */}
      {LEFT_PALM_PATHS.map((pathD, idx) => {
        const evolved = evolvePath(palmProgress, pathD);
        return (
          <path
            key={`left-${idx}`}
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={evolved.strokeDasharray}
            strokeDashoffset={evolved.strokeDashoffset}
          />
        );
      })}

      {/* 3. Garis telapak tangan kanan */}
      {RIGHT_PALM_PATHS.map((pathD, idx) => {
        const evolved = evolvePath(palmProgress, pathD);
        return (
          <path
            key={`right-${idx}`}
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={evolved.strokeDasharray}
            strokeDashoffset={evolved.strokeDashoffset}
          />
        );
      })}

      {/* 4. Garis jembatan penghubung di tengah (menyambung saat progress > 0.6) */}
      {bridgeProgress > 0 &&
        CONNECTING_PATHS.map((pathD, idx) => {
          const evolved = evolvePath(bridgeProgress, pathD);
          return (
            <path
              key={`bridge-${idx}`}
              d={pathD}
              fill="none"
              stroke={mvConfig.colors.blushYellow}
              strokeWidth={strokeWidth * 1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={evolved.strokeDasharray}
              strokeDashoffset={evolved.strokeDashoffset}
            />
          );
        })}
    </svg>
  );
};
