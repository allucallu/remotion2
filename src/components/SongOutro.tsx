import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

interface SongOutroProps {
  durationInFrames: number;
}

export const SongOutro: React.FC<SongOutroProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.9 },
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const scale = interpolate(enterSpring, [0, 1], [0.94, 1]);
  const floatY = Math.sin((frame / 45) * Math.PI) * 5;

  // Fade out ke hitam pekat di ujung lagu
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
        zIndex: 50,
      }}
    >
      {/* Karakter Pose 1 Senyum Berdiri Mandiri (Tanpa Frame Bertumpuk) */}
      <div
        style={{
          width: 280,
          height: 290,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${floatY}px) scale(${scale})`,
          filter: "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 30px rgba(243, 179, 83, 0.25))",
        }}
      >
        <Img
          src={staticFile("art/1.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Teks Penutup Elegan */}
      <h2
        style={{
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif",
          fontSize: 38,
          fontWeight: 700,
          color: mvConfig.theme.textPrimary,
          margin: "24px 0 8px 0",
          letterSpacing: "-0.01em",
          textShadow: "0 2px 20px rgba(0, 0, 0, 0.8)",
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
