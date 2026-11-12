import React from "react";
import { mvConfig } from "../config";

export type PaperMode = "day" | "night" | "golden";

interface PaperBackgroundProps {
  mode?: PaperMode;
}

/**
 * Latar kertas buku tulis bergaris bergaya catatan harian.
 * Mendukung mode siang (day), malam (night untuk Bridge), dan senja hangat (golden untuk Final Chorus).
 */
export const PaperBackground: React.FC<PaperBackgroundProps> = ({
  mode = "day",
}) => {
  const isNight = mode === "night";
  const isGolden = mode === "golden";

  const bgColor = isNight
    ? mvConfig.palette.nightPaperNavy
    : mvConfig.palette.paperCream;

  const lineColor = isNight
    ? "rgba(188, 211, 232, 0.12)"
    : mvConfig.palette.bookLine;

  const marginColor = isNight
    ? "rgba(240, 166, 166, 0.25)"
    : mvConfig.palette.marginRed;

  // Jarak antar garis buku tulis (px)
  const lineSpacing = 54;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: bgColor,
        overflow: "hidden",
      }}
    >
      {/* 1. Garis Horisontal Buku Tulis */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent ${lineSpacing - 2}px,
            ${lineColor} ${lineSpacing - 2}px,
            ${lineColor} ${lineSpacing}px
          )`,
          backgroundPosition: "0px 40px",
          pointerEvents: "none",
        }}
      />

      {/* 2. Garis Margin Merah Vertikal Ganda di Sisi Kiri */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 112,
          width: 2,
          backgroundColor: marginColor,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 120,
          width: 1,
          backgroundColor: marginColor,
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* 3. Lubang Binder Buku Tulis Halus di Kiri */}
      {[210, 540, 870].map((topY, idx) => (
        <div
          key={`hole-${idx}`}
          style={{
            position: "absolute",
            left: 40,
            top: topY,
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: isNight ? "#111629" : "#E5DFD2",
            boxShadow: isNight
              ? "inset 2px 2px 5px rgba(0, 0, 0, 0.6)"
              : "inset 2px 2px 5px rgba(0, 0, 0, 0.14)",
            border: `1px solid ${isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* 4. Pendaran Suasana Mode Malam (Lampu Meja Belajar) */}
      {isNight && (
        <div
          style={{
            position: "absolute",
            right: "10%",
            top: "5%",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 224, 150, 0.14) 0%, rgba(28, 36, 66, 0) 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* 5. Overlay Golden Hour Hangat untuk Final Chorus */}
      {isGolden && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(255, 168, 76, 0.25) 0%, rgba(255, 143, 168, 0.12) 45%, rgba(247, 242, 231, 0) 80%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* 6. Tekstur Grain Kertas Halus (SVG FractalNoise Overlay) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: isNight ? 0.05 : 0.04,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <filter id="paper-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain-filter)" />
      </svg>

      {/* 7. Vignette Tepi Kertas Lembut */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: isNight
            ? "inset 0 0 180px rgba(8, 11, 24, 0.75)"
            : "inset 0 0 120px rgba(130, 110, 85, 0.15)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

