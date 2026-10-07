import type { VideoFormatId } from "./config/video-formats";

export type BackgroundPreset =
  | "transparent"
  | "black"
  | "white"
  | "greenscreen"
  | "bluescreen";

export type CompositionBg = BackgroundPreset | (string & Record<never, never>);

export interface BaseCompositionProps {
  backgroundColor?: CompositionBg;
  format?: VideoFormatId;
  width?: number;
  height?: number;
  durationInSeconds?: number;
  fps?: number;
}

export interface ThemedCompositionProps extends BaseCompositionProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}
