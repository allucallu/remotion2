import React, { useState } from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { isAssetAvailable } from "../assetsManifest";
import { mvConfig } from "../config";
import { BOIL_FILTER_ID } from "./BoilFilter";

export interface SpriteProps {
  /** Nama sprite dari public/assets (misal: "ray_smile", "sol_neutral", "prop_notebook") */
  name: string;
  /** Posisi X dan Y (opsional, bisa juga lewat pos atau style) */
  x?: number;
  y?: number;
  pos?: { x: number; y: number };
  /** Skala sprite (default: 1) */
  scale?: number;
  /** Balik horizontal (default: false) */
  flip?: boolean;
  /** Titik tumpu transform (default: "50% 100%" / dasar sprite untuk idle goyang & napas) */
  pivot?: string;
  /** Frame kemunculan awal (default: 0) */
  start?: number;
  /** Durasi tampil dalam frame untuk spring keluar (opsional) */
  duration?: number;
  /** Aktifkan idle breathing & head sway (default: true) */
  idle?: boolean;
  /** Aktifkan kedip 4 frame tiap ~3 detik jika varian eyesclosed ada (default: true) */
  blink?: boolean;
  /** Aktifkan line-boil filter / A/B swap (default: true) */
  boil?: boolean;
  /** Lebar kotak / sprite (default: 260 untuk karakter, 160 untuk properti) */
  width?: number;
  /** Tinggi kotak / sprite (default: 360 untuk karakter, 160 untuk properti) */
  height?: number;
  style?: React.CSSProperties;
}

/** Hash stabil berbasis nama string untuk offset kedip unik per instans */
function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const Sprite: React.FC<SpriteProps> = ({
  name,
  x = 0,
  y = 0,
  pos,
  scale = 1,
  flip = false,
  pivot = "50% 100%",
  start = 0,
  duration,
  idle = true,
  blink = true,
  boil = true,
  width: customWidth,
  height: customHeight,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [loadError, setLoadError] = useState(false);

  // Koordinat akhir
  const posX = pos ? pos.x : x;
  const posY = pos ? pos.y : y;

  // Ukuran default berdasarkan jenis aset (properti vs karakter)
  const isProp = name.toLowerCase().startsWith("prop_");
  const width = customWidth ?? (isProp ? 180 : 280);
  const height = customHeight ?? (isProp ? 180 : 380);

  // Normalisasi nama dasar tanpa ekstensi dan sufiks varian
  const baseName = name
    .replace(/\.(png|jpg|webp)$/i, "")
    .replace(/_[AB]$/i, "");

  // 1. Logika Kedip (Blink): tiap ±90 frame (3 detik) selama 4 frame
  const blinkCycle = 90;
  const blinkOffset = stableHash(name) % blinkCycle;
  const cycleFrame = (frame + blinkOffset) % blinkCycle;
  const isBlinkingNow = blink && cycleFrame < 4;

  const eyesClosedFile = `assets/${baseName}_eyesclosed.png`;
  const hasEyesClosed = isAssetAvailable(eyesClosedFile);

  // 2. Logika Efek Boil (Tukar A/B tiap 3 frame)
  const boilStep = Math.floor(frame / 3) % 2;
  const fileA = `assets/${baseName}_A.png`;
  const fileB = `assets/${baseName}_B.png`;
  const filePlain = `assets/${baseName}.png`;

  const hasA = isAssetAvailable(fileA);
  const hasB = isAssetAvailable(fileB);
  const hasPlain = isAssetAvailable(filePlain);

  let activeAssetSrc: string | null = null;
  let useSvgFilter = false;

  if (isBlinkingNow && hasEyesClosed) {
    activeAssetSrc = staticFile(eyesClosedFile);
    useSvgFilter = boil;
  } else if (hasA && hasB && boil) {
    activeAssetSrc = staticFile(boilStep === 0 ? fileA : fileB);
    useSvgFilter = false;
  } else if (hasA) {
    activeAssetSrc = staticFile(fileA);
    useSvgFilter = boil;
  } else if (hasPlain) {
    activeAssetSrc = staticFile(filePlain);
    useSvgFilter = boil;
  }

  // 3. Animasi Spring Masuk (scale 0.9 -> 1 + opasitas)
  const localFrame = frame - start;
  if (localFrame < 0) {
    return null;
  }

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const entranceScale = interpolate(entrance, [0, 1], [0.9, 1]);
  const entranceOpacity = interpolate(entrance, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 4. Animasi Spring Keluar (jika duration ditentukan)
  let exitScale = 1;
  let exitOpacity = 1;
  if (duration) {
    const exitFrame = localFrame - (duration - 15);
    if (exitFrame > 0) {
      const exitSpring = spring({
        frame: exitFrame,
        fps,
        config: { damping: 14, stiffness: 120 },
      });
      exitScale = interpolate(exitSpring, [0, 1], [1, 0.9]);
      exitOpacity = interpolate(exitSpring, [0, 1], [1, 0], {
        extrapolateRight: "clamp",
      });
    }
  }

  // 5. Animasi Idle: Napas (scaleY 1 -> 1.015) & Goyang Kepala (±1.5°) dari pivot bawah
  const breath = idle
    ? 1 + 0.015 * Math.sin(((frame + stableHash(name)) * 2 * Math.PI) / 60)
    : 1;
  const sway = idle
    ? 1.5 * Math.sin(((frame + stableHash(name) * 2) * 2 * Math.PI) / 90)
    : 0;

  // Transform gabungan
  const flipScaleX = flip ? -1 : 1;
  const totalScale = scale * entranceScale * exitScale;
  const totalOpacity = entranceOpacity * exitOpacity;

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: posX,
    top: posY,
    width,
    height,
    transformOrigin: pivot,
    transform: `scale(${totalScale}) scaleX(${flipScaleX}) scaleY(${breath}) rotate(${sway}deg)`,
    opacity: totalOpacity,
    filter: useSvgFilter ? `url(#${BOIL_FILTER_ID})` : undefined,
    pointerEvents: "none",
    ...style,
  };

  // Jika file gambar belum tersedia atau gagal dimuat, tampilkan kotak placeholder berlabel
  if (!activeAssetSrc || loadError) {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 247, 227, 0.85)",
          border: `2px dashed ${mvConfig.colors.pencilOrange}`,
          borderRadius: 12,
          padding: 12,
          boxSizing: "border-box",
          color: mvConfig.colors.inkDark,
          fontFamily: mvConfig.fonts.primary,
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(27, 26, 46, 0.08)",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 4 }}>
          {isProp ? "📦" : "👤"}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            wordBreak: "break-all",
            lineHeight: 1.2,
            color: mvConfig.colors.pencilOrange,
          }}
        >
          {name}.png
        </div>
        <div
          style={{
            fontSize: 13,
            opacity: 0.7,
            marginTop: 6,
            fontFamily: "monospace",
          }}
        >
          {isBlinkingNow ? "• eyesclosed" : boilStep === 0 ? "• var_A" : "• var_B"}
        </div>
        <div
          style={{
            fontSize: 11,
            opacity: 0.5,
            marginTop: 2,
            fontFamily: "monospace",
          }}
        >
          {width}×{height}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Img
        src={activeAssetSrc}
        alt={name}
        onError={() => setLoadError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
};
