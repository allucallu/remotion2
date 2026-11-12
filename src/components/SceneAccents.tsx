import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export type SceneAccentType =
  | "wallet-coins"  // Bait 1 & Outro: Celengan & koin doodle tangan
  | "ktp-alarm"     // Bait 2: Jam weker & kalender kamar tidur sketsa tangan
  | "story-ring"    // Bait 3: Lingkaran story & hati melayang estetik
  | "coffee-steam"; // Bait 15: Secangkir kopi hangat & buku kamar tidur

interface SceneAccentsProps {
  type: SceneAccentType;
  layout: "left-accent" | "right-accent";
}

export const SceneAccents: React.FC<SceneAccentsProps> = ({ type, layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 85, mass: 0.8 },
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 0.85]);
  const scale = interpolate(enterSpring, [0, 1], [0.92, 1]);
  const floatY = Math.sin((frame / 45) * Math.PI) * 6;

  const posX = layout === "left-accent" ? 480 : 1420;
  const posY = 510;

  const renderHandDrawnArtwork = () => {
    switch (type) {
      case "coffee-steam":
        return (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Latar Lengkung Terracotta Lembut */}
            <path
              d="M 40 220 L 40 120 A 70 70 0 0 1 180 120 L 180 220 Z"
              fill="rgba(231, 121, 98, 0.16)"
            />
            {/* Matahari/Bulan Hangat Kecil */}
            <circle cx="150" cy="85" r="28" fill="rgba(243, 179, 83, 0.25)" />

            {/* Sketsa Tangan Cangkir Kopi Keramik Hangat */}
            <g stroke={mvConfig.theme.textPrimary} strokeWidth="2.5" fill="none">
              <path d="M 65 110 L 75 180 C 75 198, 145 198, 145 180 L 155 110 Z" fill="rgba(20, 26, 40, 0.7)" />
              {/* Pegangan Cangkir */}
              <path d="M 150 125 C 178 125, 178 165, 148 165" strokeWidth="2.8" />
              {/* Piringan / Alas Cangkir */}
              <line x1="50" y1="198" x2="170" y2="198" strokeWidth="3" stroke={mvConfig.theme.accentAmber} />
              {/* Tumpukan Buku Di Bawah Cangkir */}
              <rect x="35" y="202" width="150" height="18" rx="3" stroke={mvConfig.theme.accentAmber} strokeWidth="2" fill="rgba(243, 179, 83, 0.08)" />
            </g>

            {/* Uap Hangat Melingkar Organik Goresan Tangan */}
            <path
              d="M 95 95 C 90 75, 105 60, 100 40"
              stroke={mvConfig.theme.accentAmber}
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M 125 98 C 120 78, 135 63, 130 42"
              stroke={mvConfig.theme.accentCoral}
              strokeWidth="1.8"
              fill="none"
              opacity="0.7"
            />

            {/* Doodle Daun & Bintang */}
            <path
              d="M 195 90 Q 195 98 203 98 Q 195 98 195 106 Q 195 98 187 98 Q 195 98 195 90 Z"
              fill={mvConfig.theme.accentAmber}
            />
          </g>
        );

      case "wallet-coins":
        return (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Latar Bentuk Organik Terracotta */}
            <ellipse cx="110" cy="140" rx="80" ry="60" fill="rgba(243, 179, 83, 0.14)" />
            <circle cx="150" cy="100" r="38" fill="rgba(231, 121, 98, 0.18)" />

            {/* Sketsa Tangan Dompet & Koin Melayang */}
            <g stroke={mvConfig.theme.textPrimary} strokeWidth="2.5" fill="none">
              <rect x="55" y="105" width="120" height="80" rx="12" fill="rgba(20, 26, 40, 0.7)" />
              <path d="M 55 130 C 95 120, 135 120, 175 130" strokeWidth="2" />
              <path d="M 135 135 L 175 135 C 180 135, 180 150, 175 150 L 135 150 Z" fill="rgba(243, 179, 83, 0.3)" stroke={mvConfig.theme.accentAmber} strokeWidth="2" />
              <circle cx="158" cy="142" r="3" fill="#fff" />
            </g>

            {/* Koin Doodle Tangan Melayang dengan Simbol Rp */}
            <g stroke={mvConfig.theme.accentAmber} strokeWidth="2.2" fill="rgba(243, 179, 83, 0.15)">
              <circle cx="80" cy="75" r="18" />
              <text x="80" y="81" textAnchor="middle" fill={mvConfig.theme.accentAmber} fontSize="12" fontWeight="bold">Rp</text>

              <circle cx="140" cy="65" r="14" />
              <text x="140" y="70" textAnchor="middle" fill={mvConfig.theme.accentAmber} fontSize="10" fontWeight="bold">0</text>
            </g>

            {/* Bintang Berkilau Doodle */}
            <path
              d="M 180 75 Q 180 82 187 82 Q 180 82 180 89 Q 180 82 173 82 Q 180 82 180 75 Z"
              fill={mvConfig.theme.accentCoral}
            />
          </g>
        );

      case "ktp-alarm":
        return (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Latar Arsitektural Hangat */}
            <path
              d="M 50 200 L 50 90 A 60 60 0 0 1 170 90 L 170 200 Z"
              fill="rgba(243, 179, 83, 0.15)"
            />

            {/* Jam Weker Kamar Malam Sketsa Tangan */}
            <g stroke={mvConfig.theme.textPrimary} strokeWidth="2.5" fill="none">
              <circle cx="110" cy="140" r="42" fill="rgba(20, 26, 40, 0.75)" />
              {/* Jarum jam menunjuk larut malam */}
              <line x1="110" y1="140" x2="110" y2="115" strokeWidth="2.5" stroke={mvConfig.theme.accentAmber} />
              <line x1="110" y1="140" x2="128" y2="148" strokeWidth="2.5" stroke={mvConfig.theme.accentCoral} />
              {/* Lonceng jam weker */}
              <path d="M 80 102 C 75 90, 92 85, 95 95" strokeWidth="2.2" />
              <path d="M 140 102 C 145 90, 128 85, 125 95" strokeWidth="2.2" />
              {/* Kaki jam weker */}
              <line x1="85" y1="178" x2="75" y2="195" strokeWidth="3" />
              <line x1="135" y1="178" x2="145" y2="195" strokeWidth="3" />
            </g>

            {/* Daun Botani Estetik di Samping Jam */}
            <path
              d="M 165 190 Q 185 140 180 90"
              stroke={mvConfig.theme.accentAmber}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 172 150 Q 192 140 188 158 Z"
              fill="rgba(243, 179, 83, 0.3)"
              stroke={mvConfig.theme.accentAmber}
              strokeWidth="1.5"
            />
            <path
              d="M 178 120 Q 198 110 194 128 Z"
              fill="rgba(243, 179, 83, 0.3)"
              stroke={mvConfig.theme.accentAmber}
              strokeWidth="1.5"
            />
          </g>
        );

      case "story-ring":
        return (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Cincin Gradasi Story Melayang */}
            <circle
              cx="110"
              cy="110"
              r="62"
              fill="rgba(20, 26, 40, 0.75)"
              stroke="url(#insta-grad-art)"
              strokeWidth="4.5"
            />
            {/* Siluet Wajah Kontemplatif / User Minimalis */}
            <circle cx="110" cy="98" r="18" stroke={mvConfig.theme.accentAmber} strokeWidth="2.5" fill="none" />
            <path d="M 84 140 C 84 122, 136 122, 136 140" stroke={mvConfig.theme.accentAmber} strokeWidth="2.5" fill="none" />

            {/* Hati & Bintang Doodle Melayang */}
            <path
              d="M 165 70 C 160 60, 145 60, 145 70 C 145 80, 165 92, 165 92 C 165 92, 185 80, 185 70 C 185 60, 170 60, 165 70 Z"
              fill={mvConfig.theme.accentCoral}
            />
            <path
              d="M 55 140 Q 55 148 63 148 Q 55 148 55 156 Q 55 148 47 148 Q 55 148 55 140 Z"
              fill={mvConfig.theme.accentAmber}
            />

            <defs>
              <linearGradient id="insta-grad-art" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3b353" />
                <stop offset="50%" stopColor="#e77962" />
                <stop offset="100%" stopColor="#d15478" />
              </linearGradient>
            </defs>
          </g>
        );
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: posX - 140,
        top: posY - 140 + floatY,
        width: 280,
        height: 280,
        pointerEvents: "none",
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 25px rgba(243, 179, 83, 0.15))",
      }}
    >
      <svg viewBox="0 0 240 240" width={280} height={280} style={{ overflow: "visible" }}>
        {renderHandDrawnArtwork()}
      </svg>
    </div>
  );
};
