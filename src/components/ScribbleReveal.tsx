import React, { useId, useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ScribbleRevealProps {
  /** Nilai progres 0 -> 1 (jika diberikan secara langsung) */
  progress?: number;
  /** Frame mulai animasi (opsional, jika ingin otomatis digerakkan waktu) */
  start?: number;
  /** Durasi animasi dalam frame (default: 30) */
  duration?: number;
  /** Lebar area reveal (default: 400) */
  width?: number;
  /** Tinggi area reveal (default: 400) */
  height?: number;
  /** Ketebalan sapuan coretan spidol/pensil (default: 50) */
  strokeWidth?: number;
  /** Jarak vertikal antar baris zig-zag (default: 35) */
  step?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Membuat path zig-zag padat dari kiri ke kanan yang menutupi area kotak w x h.
 */
function createScribblePath(w: number, h: number, step: number): string {
  let d = `M 0 0`;
  let y = 0;
  let goingRight = true;

  while (y <= h + step) {
    const targetX = goingRight ? w : 0;
    // Tambahkan sedikit jitter/goyangan agar goresan terasa seperti coretan tangan manusia
    d += ` L ${targetX} ${y}`;
    y += step;
    d += ` L ${targetX} ${y}`;
    goingRight = !goingRight;
  }

  return d;
}

/**
 * Komponen ScribbleReveal: Memunculkan elemen anak (children)
 * seolah-olah sedang diarsir/diwarnai dengan spidol tebal menggunakan SVG mask.
 */
export const ScribbleReveal: React.FC<ScribbleRevealProps> = ({
  progress: directProgress,
  start = 0,
  duration = 30,
  width = 400,
  height = 400,
  strokeWidth = 50,
  step = 35,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rawId = useId();
  const maskId = `scribble-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Hitung progres (dari prop directProgress atau via spring/frame)
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
      config: { damping: 16, stiffness: 100 },
    });
    return interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  }, [directProgress, frame, start, duration, fps]);

  // Path zig-zag stabil
  const zigZagD = useMemo(
    () => createScribblePath(width, height, step),
    [width, height, step]
  );

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        ...style,
      }}
    >
      {/* SVG Mask Definition */}
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
          <path
            d={zigZagD}
            fill="none"
            stroke="white"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - computedProgress}
          />
        </mask>
      </svg>

      {/* Konten yang dimask */}
      <div
        style={{
          width: "100%",
          height: "100%",
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
