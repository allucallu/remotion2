import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export const AbstractWallArt: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Goyangan/nafas lembut lukisan dinding mengikuti ritme akustik (85 BPM)
  const breath = Math.sin((frame / 30) * Math.PI * 0.7) * 3;
  const slowSway = Math.sin((frame / durationInFrames) * Math.PI * 2) * 2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* ============================================================ */}
      {/* 1. LUKISAN KANVAS DINDING UTAMA (Main Abstract Canvas Diptych) */}
      {/* Terpasang di dinding kamar malam, memberikan estetika loft hangat */}
      {/* ============================================================ */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          top: "8%",
          width: 330,
          height: 450,
          borderRadius: 14,
          background: "linear-gradient(145deg, rgba(26, 32, 48, 0.75) 0%, rgba(14, 18, 28, 0.85) 100%)",
          border: "1.5px solid rgba(243, 179, 83, 0.2)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.55), inset 0 0 35px rgba(243, 179, 83, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          opacity: 0.7,
          transform: `translateY(${breath}px) rotate(${slowSway * 0.15}deg)`,
        }}
      >
        <svg
          viewBox="0 0 300 420"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            {/* Gradasi Terracotta Bohemian */}
            <linearGradient id="warmArchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e77962" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f3b353" stopOpacity="0.15" />
            </linearGradient>

            {/* Gradasi Matahari Senja Hangat */}
            <radialGradient id="sunOchre" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f3b353" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f3b353" stopOpacity="0.08" />
            </radialGradient>
          </defs>

          {/* Bentuk Abstrak Geometris Organik (Arches & Organic Blobs) */}
          {/* Lengkungan Arsitektural Terracotta */}
          <path
            d="M 50 380 L 50 210 A 100 100 0 0 1 250 210 L 250 380 Z"
            fill="url(#warmArchGrad)"
          />

          {/* Matahari/Bulan Malam Abstrak */}
          <circle cx="150" cy="155" r="58" fill="url(#sunOchre)" />

          {/* Lapisan Garis Horison Kuas Abstrak */}
          <path
            d="M 20 290 C 80 270, 160 320, 280 280"
            fill="none"
            stroke={mvConfig.theme.accentAmber}
            strokeWidth="2"
            strokeDasharray="4 6"
            opacity="0.6"
          />
          <path
            d="M 25 325 C 100 340, 190 295, 275 330"
            fill="none"
            stroke={mvConfig.theme.accentCoral}
            strokeWidth="1.5"
            opacity="0.5"
          />

          {/* Lukisan Tangan Kontur Tunggal (Single Continuous Line Art) */}
          {/* Siluet Petikan Gitar Akustik & Sosok Kontemplatif */}
          <g
            stroke={mvConfig.theme.textPrimary}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          >
            {/* Siluet gitar akustik satu tarikan garis */}
            <path d="M 125 180 C 115 155, 135 130, 150 130 C 165 130, 185 155, 175 180 C 170 195, 195 230, 190 260 C 185 285, 150 290, 150 290 C 150 290, 115 285, 110 260 C 105 230, 130 195, 125 180 Z" />
            {/* Lubang resonansi gitar */}
            <circle cx="150" cy="225" r="14" strokeWidth="2" stroke={mvConfig.theme.accentAmber} />
            {/* Bridge & senar */}
            <line x1="140" y1="260" x2="160" y2="260" strokeWidth="3" stroke={mvConfig.theme.accentAmber} />
            <line x1="150" y1="260" x2="150" y2="120" strokeWidth="1.2" stroke={mvConfig.theme.accentAmber} strokeDasharray="3 3" opacity="0.7" />
            {/* Neck gitar naik ke atas */}
            <line x1="147" y1="130" x2="147" y2="70" strokeWidth="2.5" />
            <line x1="153" y1="130" x2="153" y2="70" strokeWidth="2.5" />
            <rect x="144" y="55" width="12" height="18" rx="2" strokeWidth="2" />
          </g>

          {/* Daun Botani Estetik Goresan Tangan di Sisi Lukisan */}
          <g
            stroke={mvConfig.theme.accentAmber}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          >
            {/* Tangkai daun melengkung lembut */}
            <path d="M 60 380 Q 80 270 95 190" />
            {/* Helai-helai daun organik */}
            <path d="M 72 320 Q 95 305 105 325 Q 85 335 72 320 Z" fill="rgba(243, 179, 83, 0.12)" />
            <path d="M 80 270 Q 55 255 50 275 Q 70 285 80 270 Z" fill="rgba(243, 179, 83, 0.12)" />
            <path d="M 88 230 Q 115 215 120 235 Q 100 245 88 230 Z" fill="rgba(243, 179, 83, 0.12)" />
            <path d="M 95 190 Q 95 165 110 175 Q 105 195 95 190 Z" fill="rgba(243, 179, 83, 0.15)" />
          </g>

          {/* Bintang Lukisan Tangan (Hand-Drawn Twinkle Stars) */}
          <path
            d="M 230 110 Q 230 120 240 120 Q 230 120 230 130 Q 230 120 220 120 Q 230 120 230 110 Z"
            fill={mvConfig.theme.accentAmber}
            opacity="0.8"
          />
          <path
            d="M 80 120 Q 80 128 88 128 Q 80 128 80 136 Q 80 128 72 128 Q 80 128 80 120 Z"
            fill={mvConfig.theme.accentCoral}
            opacity="0.7"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 2. LUKISAN PENDAMPING KECIL (Companion Minimalist Botanical Art) */}
      {/* Memberi kedalaman galeri seni dinding kamar */}
      {/* ============================================================ */}
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "14%",
          width: 170,
          height: 240,
          borderRadius: 10,
          background: "linear-gradient(135deg, rgba(22, 28, 42, 0.6) 0%, rgba(12, 16, 25, 0.75) 100%)",
          border: "1px solid rgba(231, 121, 98, 0.18)",
          boxShadow: "0 14px 30px rgba(0, 0, 0, 0.45)",
          padding: 12,
          opacity: 0.55,
          transform: `translateY(${-breath * 0.8}px)`,
        }}
      >
        <svg viewBox="0 0 150 210" style={{ width: "100%", height: "100%" }}>
          {/* Lingkaran abstrak terracotta */}
          <circle cx="85" cy="115" r="42" fill="rgba(231, 121, 98, 0.2)" />
          <ellipse cx="60" cy="75" rx="30" ry="20" fill="rgba(243, 179, 83, 0.22)" />
          {/* Daun Monstera Minimalis Satu Tarikan Garis */}
          <path
            d="M 75 190 Q 75 120 75 40"
            stroke={mvConfig.theme.textPrimary}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 75 150 C 45 130, 30 155, 75 170"
            stroke={mvConfig.theme.textPrimary}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 75 130 C 105 110, 120 135, 75 150"
            stroke={mvConfig.theme.textPrimary}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 75 100 C 40 80, 25 105, 75 120"
            stroke={mvConfig.theme.textPrimary}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 75 70 C 110 50, 125 75, 75 90"
            stroke={mvConfig.theme.textPrimary}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 3. ORNAMEN LUKISAN TANGAN MELAYANG DI RUANGAN (Floating Doodles) */}
      {/* Gelombang senar akustik, doodle bintang & getaran musik melankolis */}
      {/* ============================================================ */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Garis Gelombang Akustik Kuas Tangan (Hand-drawn Wavy Acoustic River) */}
        <path
          d={`M 0 540 C 350 ${510 + breath * 2}, 700 ${570 - breath * 2}, 1100 ${530 + breath}, 1500 ${560 - breath}, 1920 535`}
          fill="none"
          stroke={mvConfig.theme.accentAmber}
          strokeWidth="1.5"
          strokeDasharray="8 12"
          opacity="0.32"
        />

        <path
          d={`M 0 575 C 400 ${600 - breath}, 850 ${550 + breath}, 1300 ${600 - breath}, 1920 570`}
          fill="none"
          stroke={mvConfig.theme.accentCoral}
          strokeWidth="1"
          opacity="0.22"
        />

        {/* Doodle Bintang Tangan Berkilau (Hand-Drawn Sparkle Stars di Ruangan) */}
        <g transform={`translate(740, 160) scale(${1 + Math.sin(frame / 25) * 0.12})`}>
          <path
            d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"
            fill={mvConfig.theme.accentAmber}
            opacity="0.6"
          />
          <circle cx="0" cy="0" r="2.5" fill="#fff" />
        </g>

        <g transform={`translate(1180, 220) scale(${1 + Math.cos(frame / 28) * 0.15})`}>
          <path
            d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z"
            fill={mvConfig.theme.accentCoral}
            opacity="0.55"
          />
        </g>

        <g transform={`translate(1620, 140) scale(${1 + Math.sin(frame / 32) * 0.1})`}>
          <path
            d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"
            fill={mvConfig.theme.accentAmber}
            opacity="0.5"
          />
          <circle cx="0" cy="0" r="3" fill="#fff" />
        </g>

        <g transform={`translate(420, 720) scale(${1 + Math.cos(frame / 30) * 0.12})`}>
          <path
            d="M 0 -14 Q 0 0 14 0 Q 0 0 0 14 Q 0 0 -14 0 Q 0 0 0 -14 Z"
            fill={mvConfig.theme.accentAmber}
            opacity="0.45"
          />
        </g>

        {/* Doodle Notasi Melodi Gitar Mengambang Halus */}
        <g
          transform={`translate(1320, 680) translateY(${breath * 1.5}px)`}
          stroke={mvConfig.theme.accentAmber}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        >
          {/* Not balok doodle tangan */}
          <circle cx="10" cy="20" r="5" fill={mvConfig.theme.accentAmber} />
          <line x1="15" y1="20" x2="15" y2="4" />
          <path d="M 15 4 C 20 2, 24 7, 26 12" />
        </g>

        <g
          transform={`translate(620, 480) translateY(${-breath * 1.2}px)`}
          stroke={mvConfig.theme.accentCoral}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.35"
        >
          {/* Dua not bersambung doodle tangan */}
          <circle cx="10" cy="22" r="4.5" fill={mvConfig.theme.accentCoral} />
          <line x1="14" y1="22" x2="14" y2="6" />
          <circle cx="28" cy="18" r="4.5" fill={mvConfig.theme.accentCoral} />
          <line x1="32" y1="18" x2="32" y2="2" />
          <line x1="14" y1="6" x2="32" y2="2" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
};
