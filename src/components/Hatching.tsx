import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export interface HatchingProps {
  /** Nilai progres menggambar 0 -> 1 */
  progress?: number;
  /** Frame mulai animasi (opsional) */
  start?: number;
  /** Durasi animasi dalam frame (default: 25) */
  duration?: number;
  width?: number;
  height?: number;
  /** Sudut kemiringan garis arsiran dalam derajat (default: 45) */
  angle?: number;
  /** Jarak antar garis arsiran dalam px (default: 14) */
  spacing?: number;
  /** Warna garis arsiran (default: tinta navy-hitam) */
  color?: string;
  /** Ketebalan garis (default: 1.5) */
  strokeWidth?: number;
  /** Opasitas arsiran (default: 0.85) */
  opacity?: number;
  /** ID clipPath SVG jika ingin mengarsir bentuk bebas */
  clipPathId?: string;
  style?: React.CSSProperties;
}

interface LineCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
}

export const Hatching: React.FC<HatchingProps> = ({
  progress: directProgress,
  start = 0,
  duration = 25,
  width = 300,
  height = 200,
  angle = 45,
  spacing = 14,
  color = mvConfig.colors.inkDark,
  strokeWidth = 1.5,
  opacity = 0.85,
  clipPathId,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hitung progres animasi
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
      config: { damping: 15, stiffness: 120 },
    });
    return interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  }, [directProgress, frame, start, duration, fps]);

  // Bangun garis arsiran paralel melintasi bounding box
  const lines: LineCoords[] = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Diagonal bounding box
    const diagonal = Math.sqrt(width * width + height * height);
    const count = Math.ceil((diagonal * 2) / spacing);
    const result: LineCoords[] = [];

    const cx = width / 2;
    const cy = height / 2;

    for (let i = -count / 2; i <= count / 2; i++) {
      const offset = i * spacing;
      // Titik tengah garis
      const mx = cx + offset * -sin;
      const my = cy + offset * cos;

      // Panjang setengah garis menjangkau diagonal
      const halfLen = diagonal;
      const x1 = mx - halfLen * cos;
      const y1 = my - halfLen * sin;
      const x2 = mx + halfLen * cos;
      const y2 = my + halfLen * sin;

      result.push({
        x1,
        y1,
        x2,
        y2,
        length: halfLen * 2,
      });
    }

    return result;
  }, [width, height, angle, spacing]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        overflow: "hidden",
        display: "block",
        ...style,
      }}
    >
      <g clipPath={clipPathId ? `url(#${clipPathId})` : undefined} opacity={opacity}>
        {lines.map((l, idx) => {
          // Garis muncul secara bertahap dari kiri ke kanan sesuai progres
          const lineFraction = idx / lines.length;
          // Sub-progres untuk garis ini (0 -> 1)
          const lineProgress = Math.max(
            0,
            Math.min(1, (computedProgress - lineFraction * 0.7) / 0.3)
          );

          if (lineProgress <= 0) return null;

          return (
            <line
              key={idx}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - lineProgress}
            />
          );
        })}
      </g>
    </svg>
  );
};
