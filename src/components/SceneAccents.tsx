import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";

export type SceneAccentType =
  | "wallet-coins"  // Bait 1 & Outro: Dompet tipis & koin
  | "ktp-alarm"     // Bait 2: Kartu KTP & jam pensiun
  | "story-ring"    // Bait 3: Cincin gradasi story Instagram
  | "coffee-steam"; // Bait tanpa karakter: Secangkir kopi hangat

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

  const opacity = interpolate(enterSpring, [0, 1], [0, 0.75]);
  const scale = interpolate(enterSpring, [0, 1], [0.92, 1]);
  const floatY = Math.sin((frame / 45) * Math.PI) * 6;

  const posX = layout === "left-accent" ? 480 : 1420;
  const posY = 510;

  const renderIcon = () => {
    switch (type) {
      case "wallet-coins":
        return (
          <g stroke={mvConfig.theme.accentAmber} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Dompet terbuka tipis */}
            <rect x="50" y="70" width="160" height="110" rx="16" fill="rgba(243, 179, 83, 0.08)" />
            <path d="M 50 105 C 100 95, 160 95, 210 105" strokeWidth={2.5} />
            <path d="M 160 115 L 210 115 C 216 115, 216 135, 210 135 L 160 135 Z" fill="rgba(243, 179, 83, 0.2)" />
            <circle cx="185" cy="125" r="4" fill={mvConfig.theme.accentAmber} />
            {/* Koin kecil melayang */}
            <circle cx="85" cy="215" r="14" strokeWidth={2.5} />
            <text x="85" y="220" textAnchor="middle" fill={mvConfig.theme.accentAmber} fontSize="14" fontWeight="bold">Rp</text>
            <circle cx="135" cy="210" r="11" strokeWidth={2} />
          </g>
        );

      case "ktp-alarm":
        return (
          <g stroke={mvConfig.theme.accentAmber} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Kartu KTP Tipis */}
            <rect x="40" y="50" width="180" height="115" rx="10" fill="rgba(243, 179, 83, 0.08)" />
            <line x1="60" y1="75" x2="120" y2="75" strokeWidth={3.5} />
            <line x1="60" y1="95" x2="150" y2="95" strokeWidth={2} opacity={0.6} />
            <line x1="60" y1="110" x2="140" y2="110" strokeWidth={2} opacity={0.6} />
            <line x1="60" y1="125" x2="130" y2="125" strokeWidth={2} opacity={0.6} />
            <rect x="165" y="75" width="40" height="48" rx="4" strokeWidth={2} />
            {/* Jam Weker Pensiun di Depan KTP */}
            <circle cx="175" cy="185" r="32" fill="rgba(24, 30, 44, 0.9)" strokeWidth={3} />
            <line x1="175" y1="185" x2="175" y2="165" strokeWidth={2.5} />
            <line x1="175" y1="185" x2="190" y2="195" strokeWidth={2.5} />
            <line x1="155" y1="212" x2="148" y2="225" strokeWidth={3} />
            <line x1="195" y1="212" x2="202" y2="225" strokeWidth={3} />
          </g>
        );

      case "story-ring":
        return (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Cincin Gradasi Story Instagram Melayang */}
            <circle
              cx="130"
              cy="130"
              r="68"
              fill="rgba(24, 30, 44, 0.7)"
              stroke="url(#insta-grad)"
              strokeWidth={5}
            />
            {/* Ikon User di Dalam Story */}
            <circle cx="130" cy="115" r="22" stroke={mvConfig.theme.accentAmber} strokeWidth={3.5} fill="none" />
            <path d="M 98 165 C 98 145, 162 145, 162 165" stroke={mvConfig.theme.accentAmber} strokeWidth={3.5} fill="none" />
            {/* Partikel Hati Melayang dari Story */}
            <path
              d="M 185 85 C 180 75, 165 75, 165 85 C 165 95, 185 105, 185 105 C 185 105, 205 95, 205 85 C 205 75, 190 75, 185 85 Z"
              fill={mvConfig.theme.accentCoral}
            />
            <defs>
              <linearGradient id="insta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3b353" />
                <stop offset="50%" stopColor="#e77962" />
                <stop offset="100%" stopColor="#c13584" />
              </linearGradient>
            </defs>
          </g>
        );

      case "coffee-steam":
        return (
          <g stroke={mvConfig.theme.accentAmber} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 65 90 L 75 170 C 75 190, 155 190, 155 170 L 165 90 Z" fill="rgba(243, 179, 83, 0.08)" />
            <path d="M 160 110 C 190 110, 190 150, 160 150" strokeWidth={3.5} />
            <line x1="50" y1="190" x2="180" y2="190" strokeWidth={4} />
            {/* Uap Hangat */}
            <path d="M 90 75 Q 85 55 95 35" strokeWidth={2.5} opacity={0.6} />
            <path d="M 115 78 Q 110 58 120 38" strokeWidth={2.5} opacity={0.8} />
            <path d="M 140 75 Q 135 55 145 35" strokeWidth={2.5} opacity={0.6} />
          </g>
        );
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: posX - 130,
        top: posY - 130 + floatY,
        width: 260,
        height: 260,
        pointerEvents: "none",
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="0 0 260 260" width={260} height={260} style={{ overflow: "visible" }}>
        {renderIcon()}
      </svg>
    </div>
  );
};

