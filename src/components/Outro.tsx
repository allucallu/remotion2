import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { mvConfig } from "../config";
import { getLineBoilTransform } from "./LineBoilFilter";

interface OutroProps {
  durationInFrames: number;
}

export const Outro: React.FC<OutroProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 20,
      stiffness: 90,
      mass: 0.8,
    },
  });

  const exitStart = Math.max(1, durationInFrames - 30);
  const exitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) * exitOpacity;
  const scale = interpolate(enterSpring, [0, 1], [0.95, 1]);

  const boil = getLineBoilTransform(frame, "outro-illustration", {
    posJitter: 2.0,
    rotJitter: 0.8,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
        transform: `translate(${boil.x}px, ${boil.y}px) scale(${scale})`,
        filter: "url(#line-boil-filter)",
      }}
    >
      {/* Sketsa Buku Harian & Pena Terbuka */}
      <svg
        viewBox="0 0 400 300"
        width={340}
        height={255}
        style={{ overflow: "visible" }}
      >
        <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Garis tengah lipatan buku */}
          <path d="M 200 70 L 200 230" strokeWidth={4} />

          {/* Halaman kiri buku */}
          <path d="M 200 70 C 150 65, 80 80, 50 75 L 50 235 C 80 240, 150 225, 200 230" fill="rgba(251, 242, 219, 0.6)" />
          {/* Garis-garis tulisan di halaman kiri */}
          <line x1="75" y1="110" x2="175" y2="108" stroke={mvConfig.ink.muted} strokeWidth={2.5} />
          <line x1="75" y1="135" x2="165" y2="133" stroke={mvConfig.ink.muted} strokeWidth={2.5} />
          <line x1="75" y1="160" x2="180" y2="158" stroke={mvConfig.ink.muted} strokeWidth={2.5} />
          <line x1="75" y1="185" x2="150" y2="183" stroke={mvConfig.ink.muted} strokeWidth={2.5} />

          {/* Halaman kanan buku */}
          <path d="M 200 70 C 250 65, 320 80, 350 75 L 350 235 C 320 240, 250 225, 200 230" fill="rgba(251, 242, 219, 0.6)" />
          {/* Coretan hati kecil & garis di halaman kanan */}
          <path d="M 275 140 C 265 130, 250 120, 250 110 C 250 100, 260 95, 267 100 C 272 103, 275 108, 275 112 C 275 108, 278 103, 283 100 C 290 95, 300 100, 300 110 C 300 120, 285 130, 275 140 Z" stroke={mvConfig.ink.highlight} strokeWidth={2.5} />
          <line x1="225" y1="170" x2="325" y2="168" stroke={mvConfig.ink.muted} strokeWidth={2.5} />
          <line x1="225" y1="195" x2="295" y2="193" stroke={mvConfig.ink.muted} strokeWidth={2.5} />

          {/* Pena bulu/tinta di samping */}
          <path d="M 330 240 L 370 120 C 375 110, 385 115, 380 125 L 340 245 Z" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
        </g>
      </svg>

      <span
        style={{
          fontFamily: mvConfig.fontFamily,
          fontSize: 42,
          fontWeight: 700,
          color: mvConfig.ink.primary,
          letterSpacing: "0.08em",
          marginTop: -10,
        }}
      >
        Terima Kasih
      </span>

      <span
        style={{
          fontFamily: mvConfig.fontFamily,
          fontSize: 26,
          color: mvConfig.ink.secondary,
          letterSpacing: "0.12em",
          marginTop: 6,
        }}
      >
        suno.ai
      </span>
    </div>
  );
};

