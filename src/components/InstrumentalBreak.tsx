import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { mvConfig } from "../config";
import { getLineBoilTransform } from "./LineBoilFilter";

interface BreakProps {
  durationInFrames: number;
}

export const InstrumentalBreak: React.FC<BreakProps> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi masuk & keluar sketsa
  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 80,
      mass: 0.9,
    },
  });

  const exitStart = Math.max(1, durationInFrames - 24);
  const exitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) * exitOpacity;
  const scale = interpolate(enterSpring, [0, 1], [0.94, 1]);

  // Line-boil jitter
  const boil = getLineBoilTransform(frame, "instrumental-illustration", {
    posJitter: 2.2,
    rotJitter: 0.9,
  });

  // Animasi detak/getar gelombang audio di dalam layar HP
  const waveCycle = Math.sin((frame / 30) * Math.PI * 2);

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
      <svg
        viewBox="0 0 500 500"
        width={420}
        height={420}
        style={{ overflow: "visible" }}
      >
        {/* Catatan Musik Mengambang di Luar */}
        <g stroke={mvConfig.ink.secondary} strokeWidth={3} fill="none" strokeLinecap="round">
          {/* Notasi balok 1 */}
          <path d="M 80 180 C 80 140, 110 130, 110 130 L 110 200 M 110 140 L 140 130 L 140 190" />
          <ellipse cx="70" cy="200" rx="14" ry="10" fill={mvConfig.ink.secondary} transform="rotate(-20 70 200)" />
          <ellipse cx="130" cy="190" rx="14" ry="10" fill={mvConfig.ink.secondary} transform="rotate(-20 130 190)" />

          {/* Notasi balok 2 kanan atas */}
          <path d="M 380 160 L 380 100 C 380 100, 410 110, 420 80" />
          <ellipse cx="370" cy="160" rx="13" ry="9" fill={mvConfig.ink.secondary} transform="rotate(-20 370 160)" />

          {/* Kilau & Bintang sketsa */}
          <path d="M 100 320 L 115 320 M 107 312 L 107 328" strokeWidth={2.5} />
          <path d="M 390 280 L 410 280 M 400 270 L 400 290" strokeWidth={2.5} />
        </g>

        {/* Handphone Sketsa (Frame HP) */}
        <rect
          x="170"
          y="80"
          width="160"
          height="300"
          rx="24"
          fill="rgba(251, 242, 219, 0.75)"
          stroke={mvConfig.ink.primary}
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Speaker / Kamera Depan HP */}
        <line
          x1="225"
          y1="102"
          x2="275"
          y2="102"
          stroke={mvConfig.ink.secondary}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx="212" cy="102" r="3" fill={mvConfig.ink.secondary} />

        {/* Header Story Media Sosial di Layar */}
        <g stroke={mvConfig.ink.secondary} strokeWidth={2.5} strokeLinecap="round" fill="none">
          {/* Avatar Story Lingkaran */}
          <circle cx="205" cy="140" r="14" stroke={mvConfig.ink.highlight} strokeWidth={2.5} />
          <circle cx="205" cy="136" r="5" fill={mvConfig.ink.highlight} />
          <path d="M 197 149 C 197 144, 213 144, 213 149" fill={mvConfig.ink.highlight} />

          {/* Garis nama & waktu */}
          <line x1="228" y1="136" x2="280" y2="136" strokeWidth={3} stroke={mvConfig.ink.primary} />
          <line x1="228" y1="145" x2="260" y2="145" strokeWidth={2} stroke={mvConfig.ink.muted} />
        </g>

        {/* Konten Story: Ikon Hati Besar Berdenyut */}
        <path
          d="M 250 250 C 230 230, 205 210, 205 190 C 205 174, 218 168, 228 172 C 238 176, 245 185, 250 190 C 255 185, 262 176, 272 172 C 282 168, 295 174, 295 190 C 295 210, 270 230, 250 250 Z"
          fill="none"
          stroke={mvConfig.ink.highlight}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`scale(${1 + waveCycle * 0.05}) translate(${(-250 * waveCycle * 0.05)}, ${(-210 * waveCycle * 0.05)})`}
        />

        {/* Gelombang Nada Audio di Bagian Bawah Layar */}
        <g stroke={mvConfig.ink.secondary} strokeWidth={2.5} strokeLinecap="round">
          <line x1="195" y1="290" x2="195" y2={305 + waveCycle * 8} />
          <line x1="210" y1="280" x2="210" y2={315 - waveCycle * 6} />
          <line x1="225" y1="285" x2="225" y2={310 + waveCycle * 10} />
          <line x1="240" y1="275" x2="240" y2={320 - waveCycle * 8} />
          <line x1="250" y1="270" x2="250" y2={325 + waveCycle * 7} />
          <line x1="260" y1="275" x2="260" y2={320 - waveCycle * 9} />
          <line x1="275" y1="285" x2="275" y2={310 + waveCycle * 8} />
          <line x1="290" y1="280" x2="290" y2={315 - waveCycle * 6} />
          <line x1="305" y1="290" x2="305" y2={305 + waveCycle * 7} />
        </g>

        {/* Tombol Home Bar HP */}
        <line
          x1="220"
          y1="362"
          x2="280"
          y2="362"
          stroke={mvConfig.ink.secondary}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </svg>

      {/* Teks Sketsa Halus di Bawah Gambar */}
      <span
        style={{
          fontFamily: mvConfig.fontFamily,
          fontSize: 34,
          color: mvConfig.ink.secondary,
          letterSpacing: "0.08em",
          marginTop: -20,
          opacity: 0.85,
        }}
      >
        ~ Instrumental ~
      </span>
    </div>
  );
};

