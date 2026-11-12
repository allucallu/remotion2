export type LayoutPreset = "left-block" | "right-block" | "center";

export interface LyricLayoutConfig {
  lineIndex: number;
  group: number;
  layout: LayoutPreset;
}

export const lyricLayoutMap: Record<number, LyricLayoutConfig> = {};
