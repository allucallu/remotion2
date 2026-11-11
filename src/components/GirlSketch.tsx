import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";
import { LayoutPreset } from "../layout";
import { getLineBoilTransform } from "./LineBoilFilter";

export type GirlPose =
  | "smile-portrait" // Wajah tersenyum manis dari samping/tiga perempat (Reff: Satu foto senyum)
  | "camera-pose"     // Berpose memegang kamera / HP selfie (Nona pap dong / cuma di story)
  | "reading-dreamy"  // Menatap melamun anggun dengan rambut terurai (Merindu / seolah punya masa lalu)
  | "waving-shy";     // Tersenyum melambaikan tangan lembut (Hei Nona / sapa saja belum)

interface GirlSketchProps {
  pose: GirlPose;
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
      stiffness: 80,
      mass: 0.9,
    },
  });

  const opacity = interpolate(enterSpring, [0, 0.25, 1], [0, 0.85, 0.95]);
  const scale = interpolate(enterSpring, [0, 1], [0.93, 1]);

  // Line-boil jitter
  const boil = getLineBoilTransform(frame, `girl-sketch-${groupId}`, {
    posJitter: 2.2,
    rotJitter: 0.9,
  });

  // Bernapas pelan lembut
  const breathe = Math.sin((frame / 45) * Math.PI * 2) * 5;

  // Letak posisi berlawanan dengan letak teks:
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
      case "smile-portrait":
        // Sketsa Potret Wajah Nona Tersenyum Manis (Rambut ikal terurai, mata teduh, pipi merona)
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Siluet leher & bahu */}
            <path d="M 125 190 L 125 230 C 125 240, 70 250, 45 270" strokeWidth={3} />
            <path d="M 165 190 L 165 230 C 165 240, 210 250, 240 270" strokeWidth={3} />
            <path d="M 90 260 Q 145 280 200 260" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />

            {/* Bentuk dagu & pipi */}
            <path d="M 95 125 C 95 170, 120 205, 145 205 C 170 205, 195 170, 195 125" fill="rgba(251, 242, 219, 0.7)" strokeWidth={3.5} />

            {/* Telinga & anting mutiara kecil */}
            <path d="M 95 130 C 85 135, 85 155, 96 160" strokeWidth={3} />
            <circle cx="90" cy="165" r="3.5" fill={mvConfig.ink.highlight} stroke={mvConfig.ink.primary} strokeWidth={2} />

            {/* Mata kiri & kanan (tersenyum melengkung manis) */}
            <path d="M 112 135 Q 124 126 136 135" strokeWidth={4} />
            <path d="M 116 128 L 112 124" strokeWidth={2.5} />
            <path d="M 132 128 L 136 124" strokeWidth={2.5} />

            <path d="M 154 135 Q 166 126 178 135" strokeWidth={4} />
            <path d="M 158 128 L 154 124" strokeWidth={2.5} />
            <path d="M 174 128 L 178 124" strokeWidth={2.5} />

            {/* Alis halus */}
            <path d="M 110 120 Q 124 112 138 118" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <path d="M 152 118 Q 166 112 180 120" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />

            {/* Hidung mungil */}
            <path d="M 144 140 Q 146 155 142 158" strokeWidth={2.5} />

            {/* Senyum manis melengkung dengan gigi/bibir lembut */}
            <path d="M 126 175 Q 145 195 164 175" stroke={mvConfig.ink.highlight} strokeWidth={3.8} />
            <path d="M 124 173 Q 120 169 123 165" stroke={mvConfig.ink.secondary} strokeWidth={2} />
            <path d="M 166 173 Q 170 169 167 165" stroke={mvConfig.ink.secondary} strokeWidth={2} />

            {/* Blush / rona pipi sketsa terakota */}
            <g stroke={mvConfig.ink.highlight} strokeWidth={2} opacity={0.75}>
              <line x1="102" y1="155" x2="114" y2="151" />
              <line x1="104" y1="160" x2="116" y2="156" />
              <line x1="174" y1="151" x2="186" y2="155" />
              <line x1="172" y1="156" x2="184" y2="160" />
            </g>

            {/* Rambut terurai bergelombang anggun */}
            <path d="M 80 145 C 65 95, 100 50, 145 50 C 195 50, 225 95, 210 145" strokeWidth={4.5} />
            {/* Poni samping */}
            <path d="M 105 75 Q 145 95 185 80" strokeWidth={3.5} />
            <path d="M 115 85 Q 155 110 175 92" strokeWidth={3} />
            {/* Gelombang helaian rambut samping jatuh ke pundak */}
            <path d="M 80 140 C 70 180, 55 220, 65 270" strokeWidth={4} />
            <path d="M 68 180 C 60 215, 48 245, 55 280" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <path d="M 210 140 C 220 180, 235 220, 225 270" strokeWidth={4} />
            <path d="M 222 180 C 230 215, 242 245, 235 280" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />

            {/* Bunga sketsa di selipan rambut */}
            <circle cx="85" cy="85" r="7" fill={mvConfig.ink.highlight} stroke={mvConfig.ink.primary} strokeWidth={2.5} />
            <circle cx="85" cy="72" r="5" stroke={mvConfig.ink.secondary} strokeWidth={2} />
            <circle cx="97" cy="82" r="5" stroke={mvConfig.ink.secondary} strokeWidth={2} />
            <circle cx="73" cy="88" r="5" stroke={mvConfig.ink.secondary} strokeWidth={2} />
          </g>
        );

      case "camera-pose":
        // Sketsa Karakter Mengangkat Kamera / HP Selfie
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Siluet kepala & rambut ikal terikat */}
            <path d="M 110 70 C 110 50, 150 45, 175 60 C 200 75, 200 110, 185 130" strokeWidth={4} />
            {/* Cepolan rambut di atas */}
            <ellipse cx="170" cy="45" rx="20" ry="16" fill="rgba(251, 242, 219, 0.8)" strokeWidth={3.5} />
            <path d="M 160 30 Q 185 45 165 58" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />

            {/* Wajah mengintip di balik kamera */}
            <path d="M 115 110 Q 120 135 135 140" strokeWidth={3} />
            {/* Satu mata berkedip genit (wink) */}
            <path d="M 125 105 Q 135 95 145 105" strokeWidth={4} />
            <line x1="123" y1="102" x2="118" y2="98" strokeWidth={2.5} />
            <line x1="147" y1="102" x2="152" y2="98" strokeWidth={2.5} />

            {/* Tangan memegang kamera polaroid/HP vintage */}
            <rect x="130" y="110" width="105" height="75" rx="12" fill="rgba(251, 242, 219, 0.85)" strokeWidth={4} />
            {/* Lensa besar kamera */}
            <circle cx="182" cy="147" r="24" strokeWidth={3.5} />
            <circle cx="182" cy="147" r="14" stroke={mvConfig.ink.highlight} strokeWidth={3} />
            <circle cx="177" cy="142" r="4" fill="#fff" stroke="none" />
            {/* Flash / lampu kamera menyala dengan kilau */}
            <rect x="142" y="122" width="16" height="12" rx="3" strokeWidth={2.5} />
            <path d="M 135 100 L 125 90 M 145 95 L 145 80 M 160 100 L 170 90" stroke={mvConfig.ink.highlight} strokeWidth={3} />

            {/* Jari-jari tangan memegang kamera */}
            <path d="M 115 140 Q 130 145 132 155" strokeWidth={3.5} />
            <path d="M 235 130 Q 242 145 233 160" strokeWidth={3.5} />

            {/* Lengan baju */}
            <path d="M 100 230 C 95 180, 115 160, 125 150" strokeWidth={3.5} />
            <path d="M 220 230 C 230 180, 235 170, 233 160" strokeWidth={3.5} />
          </g>
        );

      case "reading-dreamy":
        // Sketsa Karakter Anggun Menatap ke Samping Melamun (Romantic dreamy profile)
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Profil samping hidung, bibir, dagu yang anggun */}
            <path
              d="M 115 90 Q 125 110 135 118 L 130 126 Q 138 128 132 136 Q 136 146 122 154 Q 126 170 105 180"
              strokeWidth={3.8}
            />
            {/* Mata teduh menatap samping dengan bulu mata lentik */}
            <path d="M 112 114 Q 120 110 126 116" strokeWidth={3.5} />
            <path d="M 124 112 L 128 108" strokeWidth={2.5} />
            {/* Alis anggun */}
            <path d="M 108 104 Q 118 100 128 106" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />

            {/* Rambut lebat bergelombang mengalir ke belakang */}
            <path d="M 115 90 C 105 60, 140 45, 175 55 C 215 65, 230 110, 220 160 C 210 210, 225 250, 215 280" strokeWidth={4.5} />
            <path d="M 160 85 C 185 115, 195 165, 185 220 C 180 250, 195 270, 190 285" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />

            {/* Garis leher & gaun lembut */}
            <path d="M 110 180 C 115 210, 105 240, 80 270" strokeWidth={3.5} />
            <path d="M 155 185 C 160 215, 155 245, 175 275" strokeWidth={3} />

            {/* Hati kecil melayang di depan wajahnya (merindu) */}
            <path
              d="M 85 110 C 75 98, 60 86, 60 76 C 60 66, 68 62, 74 65 C 80 68, 83 74, 85 78 C 87 74, 90 68, 96 65 C 102 62, 110 66, 110 76 C 110 86, 95 98, 85 110 Z"
              stroke={mvConfig.ink.highlight}
              strokeWidth={3}
              fill="rgba(184, 74, 34, 0.15)"
            />
          </g>
        );

      case "waving-shy":
        // Sketsa Karakter Tersenyum Malu Sambil Melambaikan Tangan Halus
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Wajah tersenyum manis */}
            <path d="M 105 110 C 105 160, 125 185, 150 185 C 175 185, 195 160, 195 110" fill="rgba(251, 242, 219, 0.7)" strokeWidth={3.5} />
            {/* Mata tersenyum riang */}
            <path d="M 120 125 Q 130 118 140 125" strokeWidth={4} />
            <path d="M 160 125 Q 170 118 180 125" strokeWidth={4} />
            {/* Senyum mungil */}
            <path d="M 135 155 Q 150 170 165 155" stroke={mvConfig.ink.highlight} strokeWidth={3.5} />

            {/* Rambut pendek bob mengembang menggemaskan */}
            <path d="M 90 120 C 80 75, 110 50, 150 50 C 195 50, 215 75, 210 125 C 205 155, 195 170, 195 170" strokeWidth={4} />
            <path d="M 90 120 C 90 155, 105 170, 105 170" strokeWidth={3.5} />
            {/* Poni depan */}
            <path d="M 115 80 Q 150 100 185 80" strokeWidth={3} />

            {/* Tangan mungil melambaikan tangan di samping kepala */}
            <path d="M 70 135 Q 65 105 80 90" strokeWidth={3.5} />
            {/* Jari-jari melambai */}
            <path d="M 78 90 Q 75 75 80 70 M 82 72 Q 87 65 91 72 M 93 74 Q 97 70 99 78" strokeWidth={3} />
            {/* Garis getar lambaian */}
            <path d="M 60 75 Q 55 85 62 95" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />

            {/* Baju leher bulat */}
            <path d="M 130 185 L 130 220 C 130 230, 80 245, 60 270" strokeWidth={3} />
            <path d="M 170 185 L 170 220 C 170 230, 220 245, 240 270" strokeWidth={3} />
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
        viewBox="0 0 280 280"
        width={280}
        height={280}
        style={{ overflow: "visible" }}
      >
        {renderPose()}
      </svg>
    </div>
  );
};

// Menentukan kapan karakter perempuan (Nona) tampil di bait-bait penting yang menyebutkan dirinya
export function getGirlPoseForGroup(groupId: number): GirlPose | null {
  switch (groupId) {
    case 9:  // Hei, Nona, bolehkah aku minta satu foto senyum (Chorus 1)
      return "smile-portrait";
    case 10: // Cukup di story, biar kusimpan sendiri
      return "camera-pose";
    case 14: // Tapi anehnya aku bisa merindu... seolah kita punya masa lalu
      return "reading-dreamy";
    case 18: // Belum jadi siapa-siapa bagimu, tapi sudah jadi penggemar senyummu
      return "smile-portrait";
    case 19: // Hei, Nona, bolehkah aku minta? (Chorus 2)
      return "camera-pose";
    case 24: // Aku hanya ingin melihat senyummu meski tak tahu siapa aku
      return "smile-portrait";
    case 27: // Hei, Nona, sekali lagi kuminta! (Final Chorus)
      return "smile-portrait";
    case 28: // Aku tahu diri, jangan khawatir, Nona!
      return "waving-shy";
    case 33: // Nona, pap dong...
      return "camera-pose";
    default:
      return null;
  }
}

