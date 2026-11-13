import { staticFile } from "remotion";

export const mvConfig = {
  title: "New MV Project",
  artist: "Artist",
  audioFileName: "lagu.mp3",
  get audioSrc() {
    return staticFile(this.audioFileName);
  },

  fps: 30,
  width: 1920,
  height: 1080,
  defaultDurationInSeconds: 60,
  defaultDurationInFrames: 1800,
} as const;

export type MVConfig = typeof mvConfig;
