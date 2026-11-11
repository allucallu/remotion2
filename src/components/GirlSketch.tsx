import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";
import { LayoutPreset } from "../layout";
import { getLineBoilTransform } from "./LineBoilFilter";

export type HijabPose =
  | "sweet-smile"   // Referensi 1: Menghadap depan, mata > < tertutup senang, senyum imut w, blush pipi, hoodie resleting
  | "cool-turn"     // Referensi 2: Menoleh ke belakang (over-the-shoulder), mata melirik kalem, tangan di saku hoodie
  | "gentle-calm"   // Ekspresi senyum teduh & anggun (mata melengkung tenang, hembusan lembut)
  | "camera-pap";   // Pose selfie/kamera memegang HP (Nona, pap dong / cukup di story)

interface GirlSketchProps {
  pose: HijabPose;
  layout: LayoutPreset;
  groupId: number;
}

export const GirlSketch: React.FC<GirlSketchProps> = ({
  pose,
  layout,
  groupId,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 85,
      mass: 0.9,
    },
  });

  const opacity = interpolate(enterSpring, [0, 0.25, 1], [0, 0.88, 0.98]);
  const scale = interpolate(enterSpring, [0, 1], [0.93, 1]);

  // Line-boil getar tinta tangan 10 fps
  const boil = getLineBoilTransform(frame, `hijab-sketch-${groupId}`, {
    posJitter: 2.2,
    rotJitter: 0.9,
  });

  // Bernapas pelan halus
  const breathe = Math.sin((frame / 45) * Math.PI * 2) * 5;

  let posX = 1380;
  let posY = 510;

  if (layout === "left-block") {
    posX = 1380;
    posY = 500;
  } else if (layout === "right-block") {
    posX = 540;
    posY = 500;
  } else if (layout === "split") {
    posX = 960;
    posY = 490;
  } else {
    // center
    posX = 1450;
    posY = 510;
  }

  const renderPose = () => {
    switch (pose) {
      case "sweet-smile":
        // REFERENSI 1: Karakter Hijab Berhoodie Menghadap Depan, Mata > <, Mulut Imut :3 / ^w^, Pipi Merona
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Lingkaran Wajah Bulat Imut */}
            <path
              d="M 90 120 C 85 165, 105 195, 150 195 C 195 195, 215 165, 210 120"
              fill="rgba(251, 242, 219, 0.85)"
              strokeWidth={3.8}
            />

            {/* Ciput / Inner Hijab di Dahi */}
            <path d="M 102 96 Q 150 78 198 96" strokeWidth={3} />

            {/* Kerudung / Hijab Melengkung Membingkai Wajah */}
            <path
              d="M 90 120 C 72 85, 95 45, 150 45 C 205 45, 228 85, 210 120 C 218 165, 210 195, 185 210 L 150 215 L 115 210 C 90 195, 82 165, 90 120 Z"
              fill="rgba(251, 242, 219, 0.75)"
              strokeWidth={4.8}
            />

            {/* Bros / Pin Bunga di Kerudung Samping Kiri (Sesuai Referensi 1) */}
            <g stroke={mvConfig.ink.primary} strokeWidth={2.5}>
              <circle cx="205" cy="175" r="4" fill={mvConfig.ink.highlight} />
              <circle cx="212" cy="171" r="3" />
              <circle cx="212" cy="179" r="3" />
            </g>

            {/* Mata ">" dan "<" (Ekspresi Senang Manis Tertawa) */}
            <path d="M 108 128 L 130 138 L 108 148" strokeWidth={5} />
            <path d="M 192 128 L 170 138 L 192 148" strokeWidth={5} />

            {/* Mulut Imut Kucing "w" / ^w^ */}
            <path d="M 136 158 Q 143 168 150 160 Q 157 168 164 158" strokeWidth={4.5} />

            {/* Blush / Pipi Merona Merah Terakota Manis (Sesuai Referensi 1) */}
            <ellipse cx="112" cy="164" rx="14" ry="7" fill={mvConfig.ink.highlight} stroke="none" opacity={0.8} />
            <ellipse cx="188" cy="164" rx="14" ry="7" fill={mvConfig.ink.highlight} stroke="none" opacity={0.8} />

            {/* Kerah Jaket / Hoodie Kebesaran (Oversized Hoodie) */}
            <path d="M 105 210 L 80 235 L 95 310" strokeWidth={4.5} />
            <path d="M 195 210 L 220 235 L 205 310" strokeWidth={4.5} />
            {/* Bahu turun santai */}
            <path d="M 80 235 L 45 285 L 35 320" strokeWidth={4.5} />
            <path d="M 220 235 L 255 285 L 265 320" strokeWidth={4.5} />

            {/* Resleting Depan Terbuka Sedikit */}
            <line x1="145" y1="225" x2="145" y2="320" strokeWidth={3.5} />
            <line x1="155" y1="225" x2="155" y2="320" strokeWidth={3.5} />
            {/* Tali hoodie zig-zag */}
            <path d="M 138 235 Q 143 250 136 265 Q 143 275 138 285" strokeWidth={3} />
            <path d="M 162 235 Q 157 250 164 265 Q 157 275 162 285" strokeWidth={3} />
          </g>
        );

      case "cool-turn":
        // REFERENSI 2: Karakter Hijab Menoleh ke Belakang (Over-the-shoulder), Mata Melirik Kalem, Tangan di Saku Hoodie
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Badan Hoodie dari Belakang Menghadap Samping */}
            <path
              d="M 125 155 C 135 150, 185 155, 195 190 L 215 315 L 95 315 L 105 230 Z"
              fill="rgba(251, 242, 219, 0.75)"
              strokeWidth={4.5}
            />

            {/* Tudung Hoodie Jatuh di Punggung */}
            <path d="M 135 152 C 160 152, 195 165, 190 200 C 180 215, 150 205, 140 195" strokeWidth={3.5} />

            {/* Tangan Masuk ke Saku Hoodie Depan (Pouch Pocket) */}
            <path d="M 115 210 L 100 280 C 100 300, 130 305, 145 285" strokeWidth={4.2} />
            <path d="M 120 275 L 140 270" strokeWidth={4.5} stroke={mvConfig.ink.primary} />

            {/* Kepala & Hijab Menoleh ke Belakang */}
            {/* Bagian Belakang Hijab Menjulur */}
            <path
              d="M 125 90 C 105 105, 98 150, 115 195 C 125 215, 138 200, 138 185"
              strokeWidth={4.5}
              fill="rgba(251, 242, 219, 0.85)"
            />

            {/* Lengkungan Hijab Membingkai Wajah Samping */}
            <path
              d="M 115 90 C 120 50, 165 50, 180 90 C 190 125, 175 165, 145 165 C 125 165, 120 135, 115 90 Z"
              fill="rgba(251, 242, 219, 0.9)"
              strokeWidth={4.5}
            />

            {/* Garis Dagu & Pipi Menoleh */}
            <path d="M 125 110 Q 130 148 145 150" strokeWidth={3.5} />

            {/* Mata Melirik Kalem / Cool Gaze (Sesuai Referensi 2) */}
            {/* Mata Kiri (Lebih Dekat) */}
            <path d="M 140 115 Q 155 108 165 118" strokeWidth={4.5} />
            <ellipse cx="152" cy="122" rx="7" ry="8" fill={mvConfig.ink.primary} stroke="none" />
            <circle cx="150" cy="119" r="2.2" fill="#fff" stroke="none" />
            <line x1="140" y1="126" x2="160" y2="126" strokeWidth={2.5} />

            {/* Mata Kanan (Jauh di Ujung) */}
            <path d="M 125 118 Q 130 114 135 120" strokeWidth={3.5} />
            <ellipse cx="130" cy="123" rx="4" ry="5" fill={mvConfig.ink.primary} stroke="none" />

            {/* Alis Tegas Kalem */}
            <path d="M 138 105 Q 152 100 165 108" strokeWidth={4} />

            {/* Hidung & Bibir Mungil Kalem */}
            <circle cx="138" cy="138" r="1.5" fill={mvConfig.ink.primary} />

            {/* Kilau Bintang / Sparkle di Dekat Kerudung (Sesuai Referensi 2) */}
            <path d="M 188 78 L 188 92 M 181 85 L 195 85" stroke={mvConfig.ink.highlight} strokeWidth={2.5} />
            <path d="M 88 135 L 94 138 M 86 142 L 92 145" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
          </g>
        );

      case "gentle-calm":
        // Ekspresi Hijab Kalem Teduh: Menghadap depan-tiga perempat, mata tersenyum lembut melengkung, hembusan rindu
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 95 125 C 90 165, 110 195, 150 195 C 190 195, 210 165, 205 125"
              fill="rgba(251, 242, 219, 0.85)"
              strokeWidth={3.8}
            />
            {/* Ciput & Kerudung Lembut */}
            <path d="M 105 100 Q 150 82 195 100" strokeWidth={3} />
            <path
              d="M 95 125 C 75 85, 100 48, 150 48 C 200 48, 225 85, 205 125 C 215 168, 205 200, 180 215 L 150 220 L 120 215 C 95 200, 85 168, 95 125 Z"
              fill="rgba(251, 242, 219, 0.75)"
              strokeWidth={4.5}
            />

            {/* Mata Tersenyum Lembut Melengkung Teduh */}
            <path d="M 115 130 Q 128 118 140 130" strokeWidth={4.2} />
            <path d="M 160 130 Q 172 118 185 130" strokeWidth={4.2} />

            {/* Alis Halus Melengkung */}
            <path d="M 114 116 Q 128 108 140 114" stroke={mvConfig.ink.secondary} strokeWidth={2.8} />
            <path d="M 160 114 Q 172 108 186 116" stroke={mvConfig.ink.secondary} strokeWidth={2.8} />

            {/* Senyuman Tipis Kalem Menenangkan */}
            <path d="M 136 162 Q 150 174 164 162" stroke={mvConfig.ink.highlight} strokeWidth={3.8} />

            {/* Rona pipi halus */}
            <line x1="108" y1="148" x2="120" y2="148" stroke={mvConfig.ink.highlight} strokeWidth={2.5} />
            <line x1="180" y1="148" x2="192" y2="148" stroke={mvConfig.ink.highlight} strokeWidth={2.5} />

            {/* Pundak Hoodie Nyaman */}
            <path d="M 115 215 L 75 255 L 60 315" strokeWidth={4} />
            <path d="M 185 215 L 225 255 L 240 315" strokeWidth={4} />
            <path d="M 125 240 Q 150 255 175 240" stroke={mvConfig.ink.secondary} strokeWidth={3} />
          </g>
        );

      case "camera-pap":
        // Pose Hijab Memegang HP / Kamera Selfie (Nona, pap dong / cukup di story)
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Kerudung & Wajah */}
            <path
              d="M 95 115 C 80 75, 105 48, 150 48 C 195 48, 220 75, 205 115 C 215 155, 205 195, 180 205 L 150 210 L 120 205 C 95 195, 85 155, 95 115 Z"
              fill="rgba(251, 242, 219, 0.8)"
              strokeWidth={4.5}
            />
            {/* Satu Mata Mengedip Manis (Wink) */}
            <path d="M 118 125 Q 128 112 138 125" strokeWidth={4.5} />
            <line x1="114" y1="120" x2="110" y2="116" strokeWidth={2.5} />
            {/* Mata Satu Lagi Terbuka Bulat */}
            <ellipse cx="172" cy="122" rx="7" ry="8" fill={mvConfig.ink.primary} stroke="none" />
            <circle cx="170" cy="119" r="2.2" fill="#fff" stroke="none" />
            {/* Senyum Ceria */}
            <path d="M 135 155 Q 148 170 160 155" stroke={mvConfig.ink.highlight} strokeWidth={4} />
            <ellipse cx="115" cy="148" rx="8" ry="4" fill={mvConfig.ink.highlight} stroke="none" opacity={0.7} />

            {/* Handphone Sketsa Diangkat untuk Foto Selfie */}
            <rect x="155" y="140" width="85" height="135" rx="14" fill="rgba(251, 242, 219, 0.9)" strokeWidth={4} />
            {/* Layar & Lensa HP */}
            <circle cx="175" cy="160" r="8" strokeWidth={3} />
            <circle cx="175" cy="160" r="3" fill={mvConfig.ink.highlight} stroke="none" />
            {/* Kilau Flash Foto */}
            <path d="M 150 125 L 140 115 M 165 125 L 165 110 M 180 130 L 190 120" stroke={mvConfig.ink.highlight} strokeWidth={3} />

            {/* Jari Tangan Mungil Memegang HP */}
            <path d="M 145 180 Q 155 185 158 195" strokeWidth={3.8} />
            <path d="M 148 200 Q 156 205 158 215" strokeWidth={3.8} />

            {/* Lengan Baju Hoodie */}
            <path d="M 105 205 L 70 250 L 55 310" strokeWidth={4.2} />
            <path d="M 185 205 L 225 250 L 245 310" strokeWidth={4.2} />
          </g>
        );
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: posX - 140,
        top: posY - 140 + breathe,
        width: 280,
        height: 280,
        pointerEvents: "none",
        opacity,
        transform: `translate(${boil.x}px, ${boil.y}px) scale(${scale})`,
        filter: "url(#line-boil-filter)",
      }}
    >
      <svg
        viewBox="0 0 280 320"
        width={280}
        height={320}
        style={{ overflow: "visible" }}
      >
        {renderPose()}
      </svg>
    </div>
  );
};

// Pemetaan pose hijab Nona sesuai getaran (vibe) lirik:
export function getGirlPoseForGroup(groupId: number): HijabPose | null {
  switch (groupId) {
    case 9:  // Hei, Nona, bolehkah aku minta satu foto senyum (Chorus 1) -> VIBE: Manis ceria (^w^ / > <)
      return "sweet-smile";
    case 10: // Cukup di story, biar kusimpan sendiri -> VIBE: Foto selfie story
      return "camera-pap";
    case 13: // Kita bahkan jarang berbicara, sapa saja belum pernah terlaksana -> VIBE: Menoleh kalem (over-the-shoulder)
      return "cool-turn";
    case 14: // Tapi anehnya aku bisa merindu... seolah kita punya masa lalu -> VIBE: Kalem melamun teduh
      return "gentle-calm";
    case 18: // Belum jadi siapa-siapa bagimu, tapi sudah jadi penggemar senyummu -> VIBE: Senyum manis gemas
      return "sweet-smile";
    case 19: // Hei, Nona, bolehkah aku minta? (Chorus 2) -> VIBE: Manis ceria
      return "sweet-smile";
    case 24: // Aku hanya ingin melihat senyummu meski tak tahu siapa aku -> VIBE: Senyum teduh menenangkan
      return "gentle-calm";
    case 26: // Orang lain sibuk cari kepastian, aku menunggu story tanpa kepastian -> VIBE: Menoleh kalem hoodie
      return "cool-turn";
    case 27: // Hei, Nona, sekali lagi kuminta! (Final Chorus) -> VIBE: Manis ceria
      return "sweet-smile";
    case 28: // Aku tahu diri, jangan khawatir, Nona! -> VIBE: Menoleh kalem
      return "cool-turn";
    case 33: // Nona, pap dong... -> VIBE: Kamera pap selfie
      return "camera-pap";
    default:
      return null;
  }
}
