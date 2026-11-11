import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { mvConfig } from "../config";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk Title dengan spring
  const titleSpring = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 110,
      mass: 0.8,
    },
  });

  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [24, 0]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.96, 1]);

  // Animasi masuk Artist (sedikit terlambat / staggered)
  const artistSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: {
      damping: 18,
      stiffness: 120,
      mass: 0.7,
    },
  });

  const artistOpacity = interpolate(artistSpring, [0, 1], [0, 0.75]);
  const artistY = interpolate(artistSpring, [0, 1], [18, 0]);

  // Animasi keluar (Fade out seluruh intro)
  const exitOpacity = interpolate(
    frame,
    [mvConfig.intro.fadeOutStartFrame, mvConfig.intro.durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 160,
        pointerEvents: "none",
        opacity: exitOpacity,
      }}
    >
      {/* Garis Sketsa di Atas Judul */}
      <svg
        width={60}
        height={8}
        style={{
          marginBottom: 16,
          opacity: titleOpacity * 0.7,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <path
          d="M 2,4 Q 30,7 58,3"
          fill="none"
          stroke={mvConfig.ink.secondary}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>

      {/* Judul Lagu */}
      <h1
        style={{
          fontFamily: mvConfig.fontFamily,
          fontSize: mvConfig.titleFontSize,
          fontWeight: 700,
          color: mvConfig.ink.primary,
          letterSpacing: "0.02em",
          margin: 0,
          padding: "0 40px",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          textShadow: "0 1px 2px rgba(255, 255, 255, 0.5)",
          filter: "url(#line-boil-filter)",
        }}
      >
        {mvConfig.title}
      </h1>

      {/* Nama Artis */}
      <p
        style={{
          fontFamily: mvConfig.fontFamily,
          fontSize: mvConfig.artistFontSize,
          fontWeight: 400,
          color: mvConfig.ink.secondary,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: "18px 0 0 0",
          opacity: artistOpacity,
          transform: `translateY(${artistY}px)`,
          textShadow: "0 1px 2px rgba(255, 255, 255, 0.4)",
          filter: "url(#line-boil-filter)",
        }}
      >
        {mvConfig.artist}
      </p>
    </div>
  );
};

