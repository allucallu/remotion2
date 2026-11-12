import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../../config";
import { HAND_FILTER_ID } from "../HandFilter";
import type { PaperMode } from "../PaperBackground";

interface NonaSilhouetteProps {
  /** Versi di dalam cincin Story Instagram atau versi berdiri penuh di jalan */
  variant?: "in-ring" | "standing";
  /** Tampilkan senyum manis & pipi blush */
  showSmile?: boolean;
  /** Skala ukuran */
  scale?: number;
  /** Mode kertas */
  mode?: PaperMode;
}

/**
 * Karakter doodle "Nona":
 * Tidak pernah digambar mata atau detail wajahnya. Hanya siluet rambut panjang/sebahu,
 * lengkung senyum kecil yang hangat, dan semburat pipi pink (blush).
 */
export const NonaSilhouette: React.FC<NonaSilhouetteProps> = ({
  variant = "standing",
  showSmile = true,
  scale = 1,
  mode = "day",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isNight = mode === "night";
  const outline = isNight
    ? mvConfig.palette.nightChalk
    : mvConfig.palette.graphite;
  const hairFill = isNight
    ? "rgba(244, 241, 234, 0.25)"
    : "rgba(51, 54, 61, 0.85)";
  const dressFill = isNight
    ? "rgba(255, 143, 168, 0.3)"
    : "rgba(255, 143, 168, 0.35)";
  const faceFill = isNight ? "#2a355c" : "#FFFDF9";

  // Gerak nafas halus mengikuti ritme ±90 BPM
  const beatCycle = (frame / ((fps * 60) / 90)) * Math.PI;
  const floatY = Math.sin(beatCycle * 0.5) * 2.5;

  if (variant === "in-ring") {
    return (
      <svg
        width={130 * scale}
        height={130 * scale}
        viewBox="0 0 120 120"
        style={{
          overflow: "visible",
          transform: `translateY(${floatY * 0.5}px)`,
          filter: `url(#${HAND_FILTER_ID})`,
        }}
      >
        {/* Siluet Rambut Panjang/Sebahu Belakang */}
        <path
          d="M 28 118 C 24 85, 28 36, 60 32 C 92 36, 96 85, 92 118 Z"
          fill={hairFill}
          stroke={outline}
          strokeWidth={3}
          strokeLinejoin="round"
        />

        {/* Bahu / Kerah Baju Tipis */}
        <path
          d="M 32 120 C 36 98, 84 98, 88 120 Z"
          fill={dressFill}
          stroke={outline}
          strokeWidth={2.5}
        />

        {/* Wajah Kosong (Tanpa Mata/Hidung) */}
        <ellipse
          cx="60"
          cy="66"
          rx="22"
          ry="24"
          fill={faceFill}
          stroke={outline}
          strokeWidth={2.5}
        />

        {/* Poni Rambut Lembut di Atas Wajah */}
        <path
          d="M 38 62 C 42 42, 78 42, 82 62 C 74 52, 65 50, 60 56 C 55 50, 46 52, 38 62 Z"
          fill={hairFill}
        />

        {/* Hanya Senyum Lengkung Kecil & Blush Pink */}
        {showSmile && (
          <g>
            <ellipse
              cx="47"
              cy="73"
              rx="5"
              ry="3"
              fill={mvConfig.palette.highlighterPink}
              opacity={0.75}
            />
            <ellipse
              cx="73"
              cy="73"
              rx="5"
              ry="3"
              fill={mvConfig.palette.highlighterPink}
              opacity={0.75}
            />
            <path
              d="M 53 76 Q 60 83 67 76"
              fill="none"
              stroke={outline}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    );
  }

  // Variant 'standing' (berdiri utuh di halaman jurnal)
  return (
    <svg
      width={200 * scale}
      height={280 * scale}
      viewBox="0 0 180 260"
      style={{
        overflow: "visible",
        transform: `translateY(${floatY}px)`,
        filter: `url(#${HAND_FILTER_ID})`,
      }}
    >
      {/* Bayangan Alas Kaki */}
      <ellipse
        cx="90"
        cy="242"
        rx="40"
        ry="8"
        fill={isNight ? "rgba(0,0,0,0.35)" : "rgba(255, 143, 168, 0.2)"}
      />

      {/* Siluet Rambut Panjang Mengembang */}
      <path
        d="M 50 135 C 44 90, 52 34, 90 32 C 128 34, 136 90, 130 135 C 122 142, 114 140, 112 132 L 68 132 C 66 140, 58 142, 50 135 Z"
        fill={hairFill}
        stroke={outline}
        strokeWidth={3.2}
        strokeLinejoin="round"
      />

      {/* Kaki */}
      <g stroke={outline} strokeWidth={3.2} strokeLinecap="round" fill="none">
        <path d="M 78 195 L 78 236 L 70 238" />
        <path d="M 102 195 L 102 236 L 110 238" />
      </g>

      {/* Cardigan / Gaun Sederhana Pink Stabilo */}
      <path
        d="M 65 112 L 54 195 L 126 195 L 115 112 C 105 104, 75 104, 65 112 Z"
        fill={dressFill}
        stroke={outline}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />

      {/* Tangan Santai */}
      <g stroke={outline} strokeWidth={3.2} strokeLinecap="round" fill="none">
        <path d="M 64 116 C 52 138, 52 160, 58 168" />
        <path d="M 116 116 C 128 138, 128 160, 122 168" />
      </g>

      {/* Wajah Tanpa Mata/Hidung */}
      <ellipse
        cx="90"
        cy="72"
        rx="26"
        ry="28"
        fill={faceFill}
        stroke={outline}
        strokeWidth={3}
      />

      {/* Poni Rambut */}
      <path
        d="M 64 68 C 68 42, 112 42, 116 68 C 106 54, 95 54, 90 60 C 85 54, 74 54, 64 68 Z"
        fill={hairFill}
      />

      {/* Senyum Kecil Hangat & Semburat Pink */}
      {showSmile && (
        <g>
          <ellipse
            cx="75"
            cy="80"
            rx="6"
            ry="3.5"
            fill={mvConfig.palette.highlighterPink}
            opacity={0.75}
          />
          <ellipse
            cx="105"
            cy="80"
            rx="6"
            ry="3.5"
            fill={mvConfig.palette.highlighterPink}
            opacity={0.75}
          />
          <path
            d="M 82 83 Q 90 91 98 83"
            fill="none"
            stroke={outline}
            strokeWidth={2.8}
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
};
