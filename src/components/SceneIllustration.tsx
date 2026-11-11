import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";
import { LayoutPreset } from "../layout";
import { getLineBoilTransform } from "./LineBoilFilter";

export type SceneIconType =
  | "bill-receipt"     // Tagihan / nota kertas (Verse 1: Pagi datang membawa tagihan)
  | "coffee-mug"       // Cangkir kopi mengepul (Verse 1: Berita buruk jadi sarapan)
  | "empty-wallet"     // Dompet tipis koin (Verse 1: Isi dompet menipis)
  | "chart-down"       // Grafik krisis/inflasi (Krisis ekonomi)
  | "tired-eyes"       // Kantung mata lelah & alarm (Verse 2: Kantung mata jadi kawan)
  | "creaky-door"      // Punggung berderit seperti pintu tua
  | "phone-story"      // Layar HP membuka story IG/medsos (Pre-Chorus & Chorus)
  | "photo-polaroid"   // Bingkai foto polaroid senyum (Satu foto senyum)
  | "sparkle-heart"    // Hati bercahaya / rindu
  | "calendar-clock"   // Waktu kesendirian / jam dinding
  | "broken-chain"     // Dunia tak ramah / drama
  | "notification";    // Notifikasi lonceng terbaru (Notifikasi story terbaru darimu)

interface SceneIllustrationProps {
  type: SceneIconType;
  layout: LayoutPreset;
  groupId: number;
}

export const SceneIllustration: React.FC<SceneIllustrationProps> = ({
  type,
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

  const opacity = interpolate(enterSpring, [0, 0.3, 1], [0, 0.85, 0.95]);
  const scale = interpolate(enterSpring, [0, 1], [0.92, 1]);

  // Line boil
  const boil = getLineBoilTransform(frame, `scene-ill-${groupId}`, {
    posJitter: 2.2,
    rotJitter: 1.0,
  });

  // Bernapas pelan
  const breathe = Math.sin((frame / 40) * Math.PI * 2) * 4;

  // Tentukan posisi berlawanan dengan letak teks:
  // left-block -> teks di kiri -> ilustrasi di kanan (x: 1380, y: 520)
  // right-block -> teks di kanan -> ilustrasi di kiri (x: 520, y: 520)
  // split / center -> di sudut atau tengah atas
  let posX = 1380;
  let posY = 520;

  if (layout === "left-block") {
    posX = 1380;
    posY = 500;
  } else if (layout === "right-block") {
    posX = 540;
    posY = 500;
  } else if (layout === "split") {
    posX = 960;
    posY = 480;
  } else {
    // center
    posX = 1450;
    posY = 520;
  }

  const renderContent = () => {
    switch (type) {
      case "bill-receipt":
        // Kertas tagihan panjang berlipat & stempel krisis
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="50" y="30" width="140" height="200" rx="8" fill="rgba(251, 242, 219, 0.7)" />
            <line x1="75" y1="65" x2="165" y2="65" strokeWidth={4} />
            <line x1="75" y1="95" x2="150" y2="95" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <line x1="75" y1="120" x2="165" y2="120" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <line x1="75" y1="145" x2="135" y2="145" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <line x1="75" y1="175" x2="165" y2="175" strokeWidth={3} strokeDasharray="6 4" />
            <circle cx="150" cy="195" r="18" stroke={mvConfig.ink.highlight} strokeWidth={3} fill="none" />
            <path d="M 142 195 L 148 201 L 158 190" stroke={mvConfig.ink.highlight} strokeWidth={3} />
          </g>
        );

      case "coffee-mug":
        // Cangkir kopi hangat mengepul dengan koran berita
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Cangkir */}
            <path d="M 70 80 L 80 180 C 80 200, 160 200, 160 180 L 170 80 Z" fill="rgba(251, 242, 219, 0.7)" />
            <path d="M 165 105 C 195 105, 195 155, 160 155" strokeWidth={4} />
            {/* Piring tatakan */}
            <line x1="50" y1="200" x2="190" y2="200" strokeWidth={4.5} />
            {/* Asap mengepul */}
            <path d="M 95 65 C 90 45, 110 35, 105 15" stroke={mvConfig.ink.secondary} strokeWidth={3} />
            <path d="M 120 70 C 115 50, 135 40, 130 18" stroke={mvConfig.ink.secondary} strokeWidth={3} />
            <path d="M 145 65 C 140 45, 160 35, 155 15" stroke={mvConfig.ink.secondary} strokeWidth={3} />
          </g>
        );

      case "empty-wallet":
        // Dompet terbuka kosong dengan koin menggelinding
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="40" y="70" width="160" height="110" rx="16" fill="rgba(251, 242, 219, 0.7)" />
            <path d="M 40 100 C 90 90, 150 90, 200 100" strokeWidth={3} />
            {/* Pengait dompet */}
            <path d="M 160 110 L 205 110 C 212 110, 212 135, 205 135 L 160 135 Z" fill="rgba(251, 242, 219, 0.9)" />
            <circle cx="185" cy="122" r="4" fill={mvConfig.ink.highlight} />
            {/* Koin kecil menggelinding */}
            <ellipse cx="65" cy="205" rx="16" ry="12" stroke={mvConfig.ink.secondary} fill="none" strokeWidth={3} />
            <ellipse cx="105" cy="210" rx="12" ry="8" stroke={mvConfig.ink.secondary} fill="none" strokeWidth={2.5} />
          </g>
        );

      case "chart-down":
        // Grafik turun drastis (inflasi & krisis)
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Sumbu koordinat */}
            <line x1="50" y1="40" x2="50" y2="190" strokeWidth={4} />
            <line x1="50" y1="190" x2="200" y2="190" strokeWidth={4} />
            {/* Garis tren curam turun */}
            <path d="M 60 70 L 95 100 L 130 85 L 175 165" stroke={mvConfig.ink.highlight} strokeWidth={4.5} />
            {/* Panah ke bawah */}
            <path d="M 155 165 L 175 165 L 175 145" stroke={mvConfig.ink.highlight} strokeWidth={4.5} />
            {/* Titik-titik krisis */}
            <circle cx="60" cy="70" r="4" fill={mvConfig.ink.highlight} />
            <circle cx="95" cy="100" r="4" fill={mvConfig.ink.highlight} />
            <circle cx="130" cy="85" r="4" fill={mvConfig.ink.highlight} />
            <circle cx="175" cy="165" r="5" fill={mvConfig.ink.highlight} />
          </g>
        );

      case "tired-eyes":
        // Jam beker alarm & mata lesu lelah
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Jam weker */}
            <circle cx="120" cy="125" r="60" fill="rgba(251, 242, 219, 0.7)" strokeWidth={4} />
            <path d="M 75 65 C 65 50, 85 45, 95 60" strokeWidth={3.5} />
            <path d="M 165 65 C 175 50, 155 45, 145 60" strokeWidth={3.5} />
            <line x1="90" y1="180" x2="75" y2="200" strokeWidth={4} />
            <line x1="150" y1="180" x2="165" y2="200" strokeWidth={4} />
            {/* Jarum jam */}
            <line x1="120" y1="125" x2="120" y2="90" strokeWidth={3.5} />
            <line x1="120" y1="125" x2="148" y2="140" strokeWidth={3.5} />
            {/* Coretan getar alarm */}
            <path d="M 50 110 C 40 120, 40 135, 50 145" stroke={mvConfig.ink.secondary} strokeWidth={3} />
            <path d="M 190 110 C 200 120, 200 135, 190 145" stroke={mvConfig.ink.secondary} strokeWidth={3} />
          </g>
        );

      case "creaky-door":
        // Pintu tua sedikit terbuka & engsel berderit
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Kusen pintu */}
            <rect x="60" y="30" width="120" height="190" strokeWidth={4} />
            {/* Daun pintu miring terbuka */}
            <path d="M 60 30 L 150 45 L 150 215 L 60 220 Z" fill="rgba(251, 242, 219, 0.75)" strokeWidth={3.5} />
            {/* Gagang pintu */}
            <circle cx="135" cy="130" r="5" fill={mvConfig.ink.highlight} stroke={mvConfig.ink.primary} strokeWidth={2} />
            {/* Garis tekstur kayu */}
            <line x1="90" y1="65" x2="90" y2="190" stroke={mvConfig.ink.secondary} strokeWidth={2} />
            <line x1="120" y1="60" x2="120" y2="185" stroke={mvConfig.ink.secondary} strokeWidth={2} />
            {/* Efek getar suara derit */}
            <path d="M 165 115 Q 180 125 165 135" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <path d="M 175 105 Q 195 125 175 145" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
          </g>
        );

      case "phone-story":
        // Handphone membuka story media sosial dengan hati bersinar
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="65" y="25" width="110" height="200" rx="16" fill="rgba(251, 242, 219, 0.8)" strokeWidth={4} />
            {/* Lingkaran profil story */}
            <circle cx="95" cy="60" r="11" stroke={mvConfig.ink.highlight} strokeWidth={2.5} />
            <line x1="115" y1="58" x2="155" y2="58" strokeWidth={2.5} />
            {/* Hati besar di story */}
            <path
              d="M 120 135 C 105 120, 85 105, 85 92 C 85 80, 95 76, 102 79 C 110 82, 115 89, 120 94 C 125 89, 130 82, 138 79 C 145 76, 155 80, 155 92 C 155 105, 135 120, 120 135 Z"
              stroke={mvConfig.ink.highlight}
              strokeWidth={3}
              fill="rgba(184, 74, 34, 0.12)"
            />
            {/* Kolom pesan teks di bawah */}
            <rect x="80" y="165" width="80" height="22" rx="10" stroke={mvConfig.ink.secondary} strokeWidth={2} />
            <line x1="90" y1="176" x2="135" y2="176" stroke={mvConfig.ink.muted} strokeWidth={2} />
          </g>
        );

      case "photo-polaroid":
        // Foto polaroid dengan jepitan kayu & gambar senyuman
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Jepitan kayu di atas */}
            <rect x="110" y="15" width="20" height="35" rx="3" fill="rgba(251, 242, 219, 0.9)" strokeWidth={3} />
            {/* Kertas polaroid */}
            <polygon points="50,45 190,45 190,215 50,215" fill="rgba(251, 242, 219, 0.85)" strokeWidth={4} />
            {/* Jendela foto */}
            <rect x="65" y="60" width="110" height="105" strokeWidth={2.5} fill="rgba(244, 222, 174, 0.3)" />
            {/* Garis senyum di dalam foto */}
            <path d="M 90 115 Q 120 145 150 115" stroke={mvConfig.ink.highlight} strokeWidth={4} />
            <circle cx="95" cy="95" r="3.5" fill={mvConfig.ink.primary} />
            <circle cx="145" cy="95" r="3.5" fill={mvConfig.ink.primary} />
            {/* Tulisan tangan di bawah polaroid */}
            <line x1="80" y1="188" x2="160" y2="188" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
          </g>
        );

      case "sparkle-heart":
        // Dua hati saling terhubung dengan kilau bintang
        return (
          <g stroke={mvConfig.ink.highlight} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 100 120 C 85 105, 65 90, 65 77 C 65 65, 75 61, 82 64 C 90 67, 95 74, 100 79 C 105 74, 110 67, 118 64 C 125 61, 135 65, 135 77 C 135 90, 115 105, 100 120 Z" strokeWidth={3.5} />
            <path d="M 145 165 C 135 155, 120 145, 120 135 C 120 125, 128 122, 133 124 C 140 127, 143 132, 145 136 C 148 132, 151 127, 157 124 C 163 122, 170 125, 170 135 C 170 145, 155 155, 145 165 Z" strokeWidth={3} stroke={mvConfig.ink.secondary} />
            {/* Bintang kilau */}
            <path d="M 60 160 L 60 180 M 50 170 L 70 170" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <path d="M 175 60 L 175 80 M 165 70 L 185 70" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
          </g>
        );

      case "calendar-clock":
        // Lembaran kalender robek & jam pasir
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="55" y="45" width="130" height="150" rx="10" fill="rgba(251, 242, 219, 0.8)" strokeWidth={4} />
            {/* Cincin spiral kalender */}
            <line x1="80" y1="35" x2="80" y2="55" strokeWidth={4} />
            <line x1="120" y1="35" x2="120" y2="55" strokeWidth={4} />
            <line x1="160" y1="35" x2="160" y2="55" strokeWidth={4} />
            {/* Header bulan */}
            <line x1="55" y1="80" x2="185" y2="80" strokeWidth={3} />
            {/* Angka tanggal besar */}
            <text x="120" y="150" textAnchor="middle" fontFamily={mvConfig.fontFamily} fontSize="62" fontWeight="bold" fill={mvConfig.ink.highlight} stroke="none">
              31
            </text>
          </g>
        );

      case "broken-chain":
        // Buku quote / kumpulan kata bijak
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 50 60 C 90 55, 120 70, 120 70 C 120 70, 150 55, 190 60 L 190 190 C 150 185, 120 200, 120 200 C 120 200, 90 185, 50 190 Z" fill="rgba(251, 242, 219, 0.8)" strokeWidth={4} />
            <line x1="120" y1="70" x2="120" y2="200" strokeWidth={3.5} />
            <line x1="68" y1="100" x2="105" y2="98" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <line x1="68" y1="125" x2="105" y2="123" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <line x1="68" y1="150" x2="95" y2="148" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <line x1="135" y1="100" x2="172" y2="98" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
            <line x1="135" y1="125" x2="172" y2="123" stroke={mvConfig.ink.secondary} strokeWidth={2.5} />
          </g>
        );

      case "notification":
        // Lonceng notifikasi bergetar dengan badge 1 baru
        return (
          <g stroke={mvConfig.ink.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Lonceng */}
            <path d="M 120 45 C 100 45, 80 65, 80 115 L 65 145 L 175 145 L 160 115 C 160 65, 140 45, 120 45 Z" fill="rgba(251, 242, 219, 0.8)" strokeWidth={4} />
            <circle cx="120" cy="165" r="14" fill={mvConfig.ink.secondary} strokeWidth={3} />
            <circle cx="120" cy="35" r="6" strokeWidth={3} />
            {/* Badge lonceng 1 baru */}
            <circle cx="165" cy="55" r="18" fill={mvConfig.ink.highlight} stroke={mvConfig.ink.primary} strokeWidth={3} />
            <text x="165" y="62" textAnchor="middle" fontFamily={mvConfig.fontFamily} fontSize="20" fontWeight="bold" fill="#fff" stroke="none">
              1
            </text>
            {/* Garis getar lonceng */}
            <path d="M 50 115 C 42 125, 42 135, 50 145" stroke={mvConfig.ink.highlight} strokeWidth={3} />
            <path d="M 190 115 C 198 125, 198 135, 190 145" stroke={mvConfig.ink.highlight} strokeWidth={3} />
          </g>
        );
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: posX - 120,
        top: posY - 120 + breathe,
        width: 240,
        height: 240,
        pointerEvents: "none",
        opacity,
        transform: `translate(${boil.x}px, ${boil.y}px) scale(${scale})`,
        filter: "url(#line-boil-filter)",
      }}
    >
      <svg
        viewBox="0 0 240 240"
        width={240}
        height={240}
        style={{ overflow: "visible" }}
      >
        {renderContent()}
      </svg>
    </div>
  );
};

// Pemetaan otomatis ikon ilustrasi sketsa per grup lirik lagu
export function getIllustrationForGroup(groupId: number): SceneIconType | null {
  switch (groupId) {
    case 3: // Pagi datang membawa tagihan
      return "bill-receipt";
    case 4: // Harga naik, isi dompet menipis... belum juga sembuh krisis lagi
      return "empty-wallet";
    case 5: // Katanya hidup harus diperjuangkan... sisa tenaga
      return "chart-down";
    case 6: // Kantung mata jadi kawan, punggung berderit seperti pintu tua
      return "tired-eyes";
    case 7: // Di tengah dunia tak ramah...
      return "coffee-mug";
    case 8: // Bukan uang, bukan jabatan, cuma senyummu di layar genggaman
      return "photo-polaroid";
    case 9: // Hei, Nona, bolehkah aku minta satu foto senyum
      return "phone-story";
    case 10: // Tak perlu lewat pesan pribadi, cukup di story
      return "phone-story";
    case 11: // Sebab dunia sudah cukup menyiksa, ekonomi runtuh negara penuh drama
      return "chart-down";
    case 12: // Storymu isinya kata-kata bijaksana
      return "broken-chain";
    case 13: // Kita bahkan jarang berbicara, sapa saja belum
      return "calendar-clock";
    case 14: // Tapi anehnya aku bisa merindu... seolah kita punya masa lalu
      return "sparkle-heart";
    case 15: // Kau sibuk membagikan makna kehidupan, aku sibuk mencari makna unggahan
      return "broken-chain";
    case 16: // Kubaca quotemu sampai tiga kali
      return "broken-chain";
    case 17: // Mungkin aku memang kurang kerjaan / banyak kesendirian
      return "coffee-mug";
    case 18: // Belum jadi siapa-siapa, tapi sudah jadi penggemar senyummu
      return "sparkle-heart";
    case 19: // Hei Nona, bolehkah minta foto senyum (Chorus 2)
      return "photo-polaroid";
    case 20: // Cukup di story, biar kusimpan sendiri
      return "phone-story";
    case 21: // Ekonomi runtuh negara penuh drama
      return "chart-down";
    case 22: // Storymu isinya kata-kata bijaksana
      return "broken-chain";
    case 23: // Aku tak meminta kau membalas rasa / mengubah jalan cerita
      return "sparkle-heart";
    case 24: // Aku hanya ingin melihat senyummu meski tak tahu siapa aku
      return "photo-polaroid";
    case 25: // Mencari bahagia di tengah inflasi
      return "empty-wallet";
    case 26: // Menunggu story tanpa kepastian
      return "calendar-clock";
    case 27: // Sekali lagi kuminta satu foto senyum
      return "photo-polaroid";
    case 28: // Aku tahu diri jangan khawatir Nona
      return "phone-story";
    case 29: // Biar dompet tipis dan punggung merana
      return "empty-wallet";
    case 30: // Setidaknya ada satu yang kutunggu: Notifikasi story terbaru darimu!
      return "notification";
    case 31: // Oh-oh-oh...
      return "sparkle-heart";
    case 32: // Belum pernah dekat sudah terlanjur rindu
      return "sparkle-heart";
    case 33: // Nona, pap dong...
      return "photo-polaroid";
    case 34: // Aku sudah lelah menjadi dewasa tanpamu.
      return "coffee-mug";
    default:
      return null;
  }
}

