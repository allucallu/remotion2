import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Gerakan radial gradient sangat lambat dan halus
  const angle = (frame / durationInFrames) * Math.PI * 4;

  const cx1 = 50 + Math.sin(angle * 0.8) * 16;
  const cy1 = 45 + Math.cos(angle * 0.6) * 12;

  const cx2 = 50 - Math.cos(angle * 0.7) * 20;
  const cy2 = 55 + Math.sin(angle * 0.5) * 15;

  // Sedikit pergeseran rona warna (hue) yang elegan dan lambat
  const hueShift = interpolate(
    Math.sin(angle * 0.5),
    [-1, 1],
    [-8, 8]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: mvConfig.colors.bgDark,
        overflow: "hidden",
      }}
    >
      {/* Layer Gradasi Radial Utama */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at ${cx1}% ${cy1}%, rgba(20, 36, 65, 0.45) 0%, transparent 60%),
            radial-gradient(circle at ${cx2}% ${cy2}%, rgba(13, 40, 56, 0.35) 0%, transparent 65%),
            radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.6) 0%, ${mvConfig.colors.bgDark} 100%)
          `,
          filter: `hue-rotate(${hueShift}deg)`,
        }}
      />

      {/* Layer Vignette Halus di Pinggir Layar */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, transparent 60%, rgba(3, 4, 7, 0.8) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Micro-grain / Noise Halus untuk Kedalaman Visual Premium (Rule 80-20) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.03,
          pointerEvents: "none",
        }}
      >
        <filter id="mv-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves={3}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#mv-noise)" />
      </svg>
    </div>
  );
};

