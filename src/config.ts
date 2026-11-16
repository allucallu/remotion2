import { staticFile } from "remotion";
import { loadFont as loadGochiHand } from "@remotion/google-fonts/GochiHand";
import { loadFont as loadReenieBeanie } from "@remotion/google-fonts/ReenieBeanie";

// Muat Google Fonts sesuai PRD Bagian 3 & tunggu kesiapan font sebelum render
const { fontFamily: gochiHandFont, waitUntilDone: waitGochiHand } =
  loadGochiHand();
const { fontFamily: reenieBeanieFont, waitUntilDone: waitReenieBeanie } =
  loadReenieBeanie();

export async function ensureFontsLoaded(): Promise<void> {
  await Promise.all([waitGochiHand(), waitReenieBeanie()]);
}

export const SINGER_COLORS: Record<string, string> = {
  "Jonah Marais": "#D9532B",
  "Jonah": "#D9532B",
  "Zach Herron": "#4A7FB5",
  "Zach": "#4A7FB5",
  "Jack Avery": "#5E9E6E",
  "Jack": "#5E9E6E",
  "Corbyn Besson": "#8E5BA8",
  "Corbyn": "#8E5BA8",
  "Daniel Seavey": "#E0A526",
  "Daniel": "#E0A526",
};

export function getSingerColor(singerName: string): string {
  for (const [name, color] of Object.entries(SINGER_COLORS)) {
    if (singerName.toLowerCase().includes(name.toLowerCase())) {
      return color;
    }
  }
  return "#D9532B"; // Default aksen oranye
}

export function getSingerGradient(singers: string[]): string {
  if (singers.length === 0) return "#D9532B";
  if (singers.length === 1) return getSingerColor(singers[0]);
  const colors = singers.map(getSingerColor);
  return `linear-gradient(90deg, ${colors.join(", ")})`;
}

export const mvConfig = {
  title: "8 Letters",
  artist: "Why Don't We",
  audioFileName: "audio.mp3",
  get audioSrc() {
    return staticFile(this.audioFileName);
  },

  fps: 30,
  width: 1920,
  height: 1080,
  safeArea: 96,
  lyricOffsetSec: 0, // Konstanta pergeseran sinkronisasi global
  sectionTransitionFrames: 12, // Transisi konsisten ±12 frame antar seksi

  fonts: {
    primary: gochiHandFont,
    secondary: reenieBeanieFont,
  },

  colors: {
    paper: "#FFF7E3",        // Kertas krem
    inkDark: "#1B1A2E",      // Tinta navy-hitam
    pencilOrange: "#D9532B", // Pensil oranye-merah
    blushYellow: "#F4B942",  // Arsiran kuning (blush/stabilo)
    paperDark: "#1F2340",    // Kertas malam (Bridge/Verse 1)
    chalkNight: "#F4EFE2",   // Garis malam (kapur)
    glowNight: "#FFB65C",    // Glow hangat malam
    singers: SINGER_COLORS,
  },

  defaultDurationInSeconds: 192.2,
  defaultDurationInFrames: 5766,
} as const;

export type MVConfig = typeof mvConfig;
