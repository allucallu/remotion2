export const VIDEO_FORMAT_IDS = [
  "landscape-hd",
  "landscape-4k",
  "portrait-hd",
  "portrait-4k",
  "square",
  "square-4k",
] as const;

export type VideoFormatId = (typeof VIDEO_FORMAT_IDS)[number];

export const videoFormats: Record<
  VideoFormatId,
  { width: number; height: number }
> = {
  "landscape-hd": { width: 1920, height: 1080 },
  "landscape-4k": { width: 3840, height: 2160 },
  "portrait-hd": { width: 1080, height: 1920 },
  "portrait-4k": { width: 2160, height: 3840 },
  square: { width: 1080, height: 1080 },
  "square-4k": { width: 2160, height: 2160 },
};

export const getVideoFormat = (format: VideoFormatId) => videoFormats[format];
