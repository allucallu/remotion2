import { staticFile } from "remotion";

export const mvConfig = {
  // Metadata Lagu
  title: "New Music Video",
  artist: "Artist",
  audioFileName: "audio.mp3",
  get audioSrc() {
    return staticFile(this.audioFileName);
  },

  // Timeline Video Default
  width: 1920,
  height: 1080,
  fps: 30,
  durationInSeconds: 30,
  durationInFrames: 900,
} as const;

export type MVConfig = typeof mvConfig;
