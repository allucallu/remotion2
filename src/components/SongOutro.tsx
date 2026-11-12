import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

interface SongOutroProps {
  durationInFrames: number;
}

export const SongOutro: React.FC<SongOutroProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk kartu penutup
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.9 },
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const scale = interpolate(enterSpring, [0, 1], [0.94, 1]);
  const floatY = Math.sin((frame / 45) * Math.PI) * 5;

  // Fade out ke hitam pekat di akhir lagu (30 frame terakhir)
  const fadeOutStart = Math.max(1, durationInFrames - 35);
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
      }}
    >
      {/* Kartu Senyum Terakhir Nona (Pose 1) */}
      <div
        style={{
          width: 220,
          height: 250,
          padding: "10px 10px 24px 10px",
          backgroundColor: "rgba(24, 30, 44, 0.8)",
          backdropFilter: "blur(14px)",
          borderRadius: 20,
          border: "1px solid rgba(243, 179, 83, 0.3)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(243, 179, 83, 0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${floatY}px) scale(${scale})`,
        }}
      >
        <div
          style={{
            width: "100%",
            flex: 1,
            borderRadius: 14,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, rgba(32, 40, 58, 0.6) 0%, rgba(18, 22, 34, 0.8) 100%)",
          }}
        >
          <Img
            src={staticFile("art/1.png")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
        <span
          style={{
            marginTop: 10,
            color: mvConfig.theme.accentAmber,
            fontSize: 13,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          ✦ Senyummu ✦
        </span>
      </div>

      {/* Teks Penutup Manis */}
      <h2
        style={{
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif",
          fontSize: 36,
          fontWeight: 700,
          color: mvConfig.theme.textPrimary,
          margin: "24px 0 8px 0",
          letterSpacing: "-0.01em",
          textShadow: "0 2px 15px rgba(0, 0, 0, 0.8)",
        }}
      >
        Terima Kasih Sudah Mendengarkan
      </h2>

      <p
        style={{
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif",
          fontSize: 20,
          color: mvConfig.theme.accentAmber,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        Tolong Unggah Senyummu — {mvConfig.artist}
      </p>
    </div>
  );
};

