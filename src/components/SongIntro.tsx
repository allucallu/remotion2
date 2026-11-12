import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export const SongIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk Title & Artist
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.8 },
  });

  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [30, 0]);

  const artistSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.8 },
  });

  const artistOpacity = interpolate(artistSpring, [0, 1], [0, 0.85]);

  // Animasi fade out sebelum lirik pertama masuk di detik 16.9 (frame ~507)
  const exitOpacity = interpolate(
    frame,
    [360, 480],
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
        opacity: exitOpacity,
        pointerEvents: "none",
        textAlign: "center",
        padding: "0 40px",
      }}
    >
      {/* Icon Musik Akustik Lembut di Atas Judul */}
      <div
        style={{
          marginBottom: 20,
          color: mvConfig.theme.accentAmber,
          fontSize: 28,
          opacity: titleOpacity * 0.9,
          transform: `translateY(${titleY}px)`,
          letterSpacing: "0.2em",
        }}
      >
        ✦ ♫ ✦
      </div>

      {/* Judul Lagu */}
      <h1
        style={{
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif",
          fontSize: mvConfig.fonts.titleSize,
          fontWeight: 800,
          color: mvConfig.theme.textPrimary,
          letterSpacing: "-0.02em",
          margin: 0,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textShadow: "0 4px 30px rgba(0, 0, 0, 0.8), 0 0 40px rgba(243, 179, 83, 0.2)",
        }}
      >
        {mvConfig.title}
      </h1>

      {/* Nama Artis / Platform */}
      <p
        style={{
          fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif",
          fontSize: mvConfig.fonts.artistSize,
          fontWeight: 500,
          color: mvConfig.theme.accentAmber,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          margin: "24px 0 0 0",
          opacity: artistOpacity,
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
        }}
      >
        {mvConfig.artist}
      </p>

      {/* Catatan Suasana Intim */}
      <span
        style={{
          marginTop: 18,
          fontSize: 18,
          color: mvConfig.theme.textMuted,
          letterSpacing: "0.08em",
          opacity: artistOpacity * 0.8,
        }}
      >
        Acoustic Intimate Version
      </span>
    </div>
  );
};

