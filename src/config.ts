import { staticFile } from "remotion";

export const mvConfig = {
  // Metadata Lagu
  title: "Hei, Nona",
  artist: "Suno AI",
  audioFileName: "lagu.mp3",
  get audioSrc() {
    return staticFile(this.audioFileName);
  },

  // Timeline Video
  fps: 30,
  width: 1920,
  height: 1080,
  defaultDurationInSeconds: 260,
  defaultDurationInFrames: 7800,

  // Offset sinkronisasi global lirik (dalam detik)
  LYRIC_OFFSET_SEC: 0,

  // Palet Warna: Buku Harian si Pengagum Diam-diam (PRD Bagian 4.2)
  palette: {
    paperCream: "#F7F2E7",           // Kertas krem
    bookLine: "#BCD3E8",             // Garis buku
    marginRed: "#F0A6A6",            // Garis margin merah
    penBlue: "#2B4A8B",              // Tinta bolpoin biru (utama)
    highlighterPink: "#FF8FA8",      // Pink stabilo (aksen Nona)
    highlighterYellow: "#FFE66D",    // Kuning stabilo (highlight kata aktif)
    mint: "#9ADBC5",                 // Mint (aksen tenang)
    graphite: "#33363D",             // Grafit (outline karakter)
    nightPaperNavy: "#1C2442",       // Mode malam: kertas navy
    nightChalk: "#F4F1EA",           // Mode malam: tinta kapur
    storyGradient: "linear-gradient(45deg, #F9CE34 0%, #EE2A7B 50%, #6228D7 100%)",
  },

  // Tipografi (PRD Bagian 4.3)
  fonts: {
    lyric: "Caveat",                 // Alternatif: Patrick Hand
    sectionLabel: "Gaegu",           // Label seksi/judul kecil
    sfx: "Indie Flower",             // SFX/doodle text
  },
} as const;

export type MVConfig = typeof mvConfig;
