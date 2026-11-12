import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { mvConfig } from "../config";

interface DrawPathProps {
  /** Data path SVG (`d`) */
  d: string;
  /** Frame mulai menggambar (default: 0) */
  start?: number;
  /** Durasi animasi menggambar dalam frame (default: 24) */
  duration?: number;
  /** Warna garis tinta (default: penBlue) */
  color?: string;
  /** Ketebalan garis (default: 3.5) */
  strokeWidth?: number;
  /** Bentuk ujung garis (default: round) */
  linecap?: "round" | "butt" | "square";
  /** Warna isi bentuk jika ada (default: none) */
  fill?: string;
  /** Opasitas garis/isi */
  opacity?: number;
  /** Override progres gambar secara manual (0..1), menonaktifkan hitung frame */
  progress?: number;
  /** Garis putus-putus opsional */
  strokeDasharray?: string;
}

/**
 * Komponen path SVG yang menganimasikan goresan seperti sedang digambar pena tangan.
 * Menggunakan teknik pathLength=1 dan strokeDashoffset untuk konsistensi deterministik.
 */
export const DrawPath: React.FC<DrawPathProps> = ({
  d,
  start = 0,
  duration = 24,
  color = mvConfig.palette.penBlue,
  strokeWidth = 3.5,
  linecap = "round",
  fill = "none",
  opacity = 1,
  progress: overrideProgress,
  strokeDasharray,
}) => {
  const frame = useCurrentFrame();

  const drawProgress =
    overrideProgress !== undefined
      ? Math.max(0, Math.min(1, overrideProgress))
      : interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  if (drawProgress <= 0) {
    return null;
  }

  return (
    <path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap={linecap}
      strokeLinejoin="round"
      opacity={opacity}
      pathLength={1}
      strokeDasharray={strokeDasharray ?? "1"}
      strokeDashoffset={strokeDasharray ? 0 : 1 - drawProgress}
    />
  );
};
