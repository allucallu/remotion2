import React from "react";
import { useCurrentFrame } from "remotion";

export const HAND_FILTER_ID = "hand-drawn-boil";

interface HandFilterProps {
  /** Frame saat ini (opsional, otomatis mengambil dari useCurrentFrame jika kosong) */
  frame?: number;
  /** ID filter SVG (default: hand-drawn-boil) */
  id?: string;
  /** Kekuatan getaran garis (default: 2.5, disarankan 2-4) */
  scale?: number;
}

/**
 * Filter SVG untuk memberikan tekstur garis tulisan tangan yang hidup ("line boil").
 * Mengubah seed turbulence setiap 4 frame sehingga garis doodle tampak bergetar lembut.
 */
export const HandFilter: React.FC<HandFilterProps> = ({
  frame: propFrame,
  id = HAND_FILTER_ID,
  scale = 2.5,
}) => {
  const hookFrame = useCurrentFrame();
  const currentFrame = propFrame ?? hookFrame;

  // Ganti seed setiap 4 frame untuk efek animasi frame-by-frame manual (line boil)
  const seed = Math.floor(currentFrame / 4);

  return (
    <svg
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.025"
            numOctaves={2}
            seed={seed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};
