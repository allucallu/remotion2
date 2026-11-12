import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

interface SongOutroProps {
  durationInFrames: number;
}

export const SongOutro: React.FC<SongOutroProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk spring lembut
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 75, mass: 0.9 },
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const scale = interpolate(enterSpring, [0, 1], [0.94, 1]);
  const floatY = Math.sin((frame / 45) * Math.PI) * 4;

  // Fade out ke hitam pekat di 45 frame terakhir sebelum video berakhir
  const fadeOutStart = Math.max(1, durationInFrames - 45);
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: opacity * fadeOut,
        pointerEvents: "none",
        textAlign: "center",
        zIndex: 50,
        transform: `translateY(${floatY}px) scale(${scale})`,
      }}
    >
      {/* 1. Ikon Bintang Akustik Elegan (Minimalis, Tanpa Duplikat Karakter) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
          opacity: 0.85,
        }}
      >
        <span
          style={{
            color: mvConfig.theme.accentAmber,
            fontSize: "22px",
            filter: "drop-shadow(0 0 10px rgba(243, 179, 83, 0.6))",
          }}
        >
          ✦
        </span>
        <span
          style={{
            color: mvConfig.theme.accentCoral,
            fontSize: "30px",
            filter: "drop-shadow(0 0 14px rgba(231, 121, 98, 0.7))",
          }}
        >
          ✦
        </span>
        <span
          style={{
            color: mvConfig.theme.accentAmber,
            fontSize: "22px",
            filter: "drop-shadow(0 0 10px rgba(243, 179, 83, 0.6))",
          }}
        >
          ✦
        </span>
      </div>

      {/* 2. Teks Penutup Elegan */}
      <h2
        style={{
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif",
          fontSize: 44,
          fontWeight: 700,
          color: mvConfig.theme.textPrimary,
          margin: "0 0 14px 0",
          letterSpacing: "-0.01em",
          textShadow: "0 4px 24px rgba(0, 0, 0, 0.85)",
        }}
      >
        Terima Kasih Sudah Mendengarkan
      </h2>

      {/* 3. Subtitle Judul & Sumber Artis */}
      <p
        style={{
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif",
          fontSize: 22,
          color: mvConfig.theme.accentAmber,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          margin: "0 0 20px 0",
          textShadow: "0 2px 14px rgba(0, 0, 0, 0.8)",
        }}
      >
        Tolong Unggah Senyummu — {mvConfig.artist}
      </p>

      {/* 4. Garis Aksen Akustik Tipis Bernafas */}
      <div
        style={{
          width: "120px",
          height: "2px",
          background: `linear-gradient(90deg, transparent 0%, ${mvConfig.theme.accentAmber} 50%, transparent 100%)`,
          opacity: 0.6,
        }}
      />
    </div>
  );
};
