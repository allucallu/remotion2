import React, { useState } from "react";
import { Img, staticFile, useVideoConfig } from "remotion";
import { isAssetAvailable } from "../assetsManifest";
import { mvConfig } from "../config";

export type BackgroundMode = "day" | "night" | "golden";

export interface SketchBackgroundProps {
  mode?: BackgroundMode;
  /** Nama file latar custom dari public/assets/ (misal: "bg_ceiling_night", "bg_room_day") */
  bgName?: string;
  /** Tampilkan tekstur grain halus (default: true) */
  showGrain?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const SketchBackground: React.FC<SketchBackgroundProps> = ({
  mode = "day",
  bgName,
  showGrain = true,
  children,
  style,
}) => {
  const { width, height } = useVideoConfig();
  const [imgError, setImgError] = useState(false);

  // Penentuan warna dasar dan kandidat file gambar latar
  let baseColor: string = mvConfig.colors.paper; // #FFF7E3
  let defaultBgCandidate = "assets/bg_paper_plain.png";
  let overlayGradient: string | null = null;

  if (mode === "night") {
    baseColor = mvConfig.colors.paperDark; // #1F2340
    defaultBgCandidate = "assets/bg_ceiling_night.png";
  } else if (mode === "golden") {
    baseColor = mvConfig.colors.paper;
    defaultBgCandidate = "assets/bg_golden.png";
    overlayGradient =
      "linear-gradient(135deg, rgba(244, 185, 66, 0.3) 0%, rgba(217, 83, 43, 0.18) 100%)";
  } else {
    // Mode day
    defaultBgCandidate = "assets/bg_room_day.png";
  }

  // Pilih berkas gambar jika diminta secara eksplisit atau ada di aset
  const targetBgFile = bgName
    ? `assets/${bgName.replace(/\.png$/i, "")}.png`
    : defaultBgCandidate;

  const hasImage = isAssetAvailable(targetBgFile) && !imgError;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: baseColor,
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* 1. Gambar latar (jika tersedia di public/assets) */}
      {hasImage && (
        <Img
          src={staticFile(targetBgFile)}
          alt="background"
          onError={() => setImgError(true)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: mode === "night" ? 0.85 : 0.95,
          }}
        />
      )}

      {/* 2. Overlay nuansa sore hangat untuk mode 'golden' */}
      {overlayGradient && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: overlayGradient,
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />
      )}

      {/* 3. Prosedural Grain / Tekstur Kertas Halus (SVG Noise) */}
      {showGrain && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            opacity: mode === "night" ? 0.07 : 0.05,
            mixBlendMode: mode === "night" ? "screen" : "multiply",
          }}
          aria-hidden="true"
        >
          <filter id={`sketch-paper-grain-${mode}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves={3}
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0 0 0 1 0"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter={`url(#sketch-paper-grain-${mode})`}
          />
        </svg>
      )}

      {/* 4. Children isi scene */}
      {children}
    </div>
  );
};
