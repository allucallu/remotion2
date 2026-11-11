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

      {/* 5. Goresan Pensil Pinggir & Bercak Tinta Mikro Sinematik (Poin 4) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.18,
        }}
      >
        <g stroke={mvConfig.ink.primary} fill="none" strokeLinecap="round">
          {/* Coretan pensil halus di sudut kiri atas */}
          <path d="M 40 80 Q 90 40 160 50" strokeWidth={1.5} strokeDasharray="12 8" />
          <path d="M 60 110 Q 110 70 170 85" strokeWidth={1} />
          {/* Noda titik tinta halus kiri atas */}
          <circle cx="85" cy="140" r="1.8" fill={mvConfig.ink.secondary} />
          <circle cx="92" cy="146" r="1.0" fill={mvConfig.ink.secondary} />

          {/* Coretan pensil di sudut kanan bawah */}
          <path d="M 1780 1010 Q 1830 1030 1880 1000" strokeWidth={1.5} strokeDasharray="14 10" />
          <path d="M 1750 1040 Q 1810 1055 1860 1030" strokeWidth={1} />
          {/* Noda titik tinta halus kanan bawah */}
          <circle cx="1770" cy="980" r="2.2" fill={mvConfig.ink.secondary} />
          <circle cx="1780" cy="990" r="1.2" fill={mvConfig.ink.secondary} />
          <circle cx="1760" cy="988" r="0.8" fill={mvConfig.ink.secondary} />

          {/* Aksen sudut kanan atas & kiri bawah */}
          <path d="M 1850 70 Q 1880 120 1870 180" strokeWidth={1} strokeDasharray="8 6" />
          <circle cx="1860" cy="195" r="1.5" fill={mvConfig.ink.secondary} />
          <path d="M 50 990 Q 70 1030 110 1040" strokeWidth={1.2} />
          <circle cx="125" cy="1035" r="1.4" fill={mvConfig.ink.secondary} />
        </g>
      </svg>
    </div>
  );
};
