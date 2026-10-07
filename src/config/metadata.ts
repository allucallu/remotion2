import type { BaseCompositionProps } from "../types";
import { getVideoFormat } from "./video-formats";

export const DEFAULT_ASSET_SETTINGS = {
  format: "landscape-hd",
  durationInSeconds: 6,
  fps: 30,
} as const satisfies Required<
  Pick<BaseCompositionProps, "format" | "durationInSeconds" | "fps">
>;

export const resolveAssetMetadata = (props: BaseCompositionProps) => {
  const format = props.format ?? DEFAULT_ASSET_SETTINGS.format;
  const fps = props.fps ?? DEFAULT_ASSET_SETTINGS.fps;
  const durationInSeconds =
    props.durationInSeconds ?? DEFAULT_ASSET_SETTINGS.durationInSeconds;
  const preset = getVideoFormat(format);
  const width = props.width ?? preset.width;
  const height = props.height ?? preset.height;

  if (!Number.isFinite(fps) || fps <= 0) {
    throw new Error("fps must be a positive finite number.");
  }

  if (!Number.isFinite(durationInSeconds) || durationInSeconds <= 0) {
    throw new Error("durationInSeconds must be a positive finite number.");
  }

  if (!Number.isInteger(width) || width <= 0) {
    throw new Error("width must be a positive integer.");
  }

  if (!Number.isInteger(height) || height <= 0) {
    throw new Error("height must be a positive integer.");
  }

  return {
    width,
    height,
    fps,
    durationInFrames: Math.max(1, Math.round(durationInSeconds * fps)),
  };
};
