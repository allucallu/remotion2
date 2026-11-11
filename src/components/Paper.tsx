import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export const Paper: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Pergeseran sangat pelan agar kertas terkesan hidup dan organik
  const slowAngle = (frame / durationInFrames) * Math.PI * 2;
  const offsetX = Math.sin(slowAngle) * 8;
  const offsetY = Math.cos(slowAngle * 0.8) * 6;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: mvConfig.paper.bgMid,
        overflow: "hidden",
      }}
    >
      {/* 1. Gradasi Radial Kertas Hangat (Tengah terang, tepi vignette cokelat keemasan) */}
      <div
        style={{
          position: "absolute",
          inset: "-20px",
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          background: `
            radial-gradient(ellipse at 50% 48%, ${mvConfig.paper.bgLight} 0%, ${mvConfig.paper.bgMid} 50%, ${mvConfig.paper.bgDark} 82%, ${mvConfig.paper.vignette} 100%)
          `,
        }}
      />

      {/* 2. Tekstur Serat Kertas Halus (SVG feTurbulence) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: mvConfig.paper.grainOpacity,
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      >
        <filter id="paper-texture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves={4}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-texture)" />
      </svg>

      {/* 3. Noda Cat Air / Tekstur Lembut Kertas Kuno */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.035,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      >
        <filter id="paper-stain">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.008"
            numOctaves={3}
            result="stain"
          />
          <feDisplacementMap in="SourceGraphic" in2="stain" scale="15" />
        </filter>
        <rect width="100%" height="100%" fill="#784a1e" filter="url(#paper-stain)" />
      </svg>

      {/* 4. Vignette Dalam Halus di Sudut Layar */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 120px rgba(145, 95, 38, 0.28)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
