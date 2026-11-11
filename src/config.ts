import { staticFile } from "remotion";

export const mvConfig = {
  // Metadata
  title: "Krisis Hati dan Ekonomi",
  artist: "sardonictop40881",
  audioFileName: "Krisis Hati dan Ekonomi.mp3",
  get audioSrc() {
    return staticFile(this.audioFileName);
  },

  // Dimensi & Video
  width: 1920,
  height: 1080,
  fps: 30,
  durationInSeconds: 229.2,
  durationInFrames: 6876,

  // Palet Warna Kertas & Tinta Sketsa
  paper: {
    bgLight: "#fbf2db", // Krem terang di tengah
    bgMid: "#f4deae",   // Krem hangat
    bgDark: "#e5c583",  // Pinggiran kertas
    vignette: "#cda45e", // Vignette sudut kertas
    grainOpacity: 0.045, // Tekstur serat kertas
  },

  ink: {
    primary: "#6e3f1b",     // Cokelat tua utama (tinta pena/kuas)
    secondary: "#8c5328",   // Cokelat sedang
    muted: "rgba(110, 63, 27, 0.45)", // Sketsa pensil tipis
    highlight: "#b84a22",   // Aksen terakota hangat
  },

  // Font Tulisan Tangan
  fonts: {
    patrickHand: "'Patrick Hand', cursive, sans-serif",
    kalam: "'Kalam', cursive, sans-serif",
    gaegu: "'Gaegu', cursive, sans-serif",
    active: "'Gaegu', cursive, sans-serif", // Pilihan user: Gaegu
  },

  // Properti Tipografi & Kompatibilitas
  fontFamily: "'Gaegu', cursive, sans-serif",
  titleFontSize: 64,
  artistFontSize: 28,
  lyricFontSize: 56,
  lyricLineHeight: 1.4,
  lyricLetterSpacing: "0.015em",
  lyricMaxWidth: 1440,

  colors: {
    bgDark: "#f4deae",
    textPrimary: "#6e3f1b",
    textSecondary: "#8c5328",
    textMuted: "rgba(110, 63, 27, 0.45)",
  },

  // Efek Goyang Gambar Tangan (Line Boil)
  lineBoil: {
    enabled: true,
    stepFrames: 3,          // Tiap 3 frame ganti langkah (~10 fps animasi manual)
    posJitter: 2.5,         // Goyang posisi ±2.5px
    rotJitter: 0.8,         // Goyang rotasi ±0.8 derajat
    displacementScale: 2.5, // Filter getar tepi tinta SVG (2 - 4)
    turbulenceFreq: 0.04,   // Frekuensi noise distorsi tinta
  },

  intro: {
    durationInFrames: 150, // 5 detik
    fadeOutStartFrame: 110,
  },

  // Doodle Hiasan Sketsa Tangan
  doodles: {
    enabled: true,
    bassReactive: false, // Default mati sesuai instruksi
    color: "#8c5328",
    accentColor: "#b84a22",
  },
} as const;

export type MVConfig = typeof mvConfig;
