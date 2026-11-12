import { staticFile } from "remotion";

export const mvConfig = {
  // Metadata Lagu
  title: "Tolong Unggah Senyummu",
  artist: "suno.ai",
  audioFileName: "Tolong Unggah Senyummu.mp3",
  get audioSrc() {
    return staticFile(this.audioFileName);
  },

  // Video & Timeline (Durasi lagu: 232.08 detik -> 6963 frames @ 30fps)
  width: 1920,
  height: 1080,
  fps: 30,
  durationInSeconds: 232.1,
  durationInFrames: 6963,

  // Palet Warna: Warm Midnight Loft / Late-Night Bedroom Acoustic
  theme: {
    bgMidnight: "#10141e",     // Biru-malam pekat
    bgNavy: "#161b29",         // Midnight room depth
    bgWarmTungsten: "#2a2224", // Pendaran lampu kamar tidur hangat
    accentAmber: "#f3b353",    // Cahaya lampu meja keemasan (Highlight Chorus)
    accentCoral: "#e77962",    // Aksen manis pipi & hati
    textPrimary: "#fff7eb",    // Ivory hangat (kontras tinggi, sangat mudah dibaca)
    textSecondary: "#cfc0aa",  // Krem lembut untuk baris kedua
    textMuted: "#8e8375",      // Detail mikro & subtitle pelan
  },

  // Tipografi
  fonts: {
    titleSize: 64,
    artistSize: 26,
    lyricSize: 52,
    lyricLineHeight: 1.45,
  },
} as const;

export type MVConfig = typeof mvConfig;
