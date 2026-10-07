import { z } from "zod";
import { VIDEO_FORMAT_IDS } from "./video-formats";

export const assetSettingsSchema = z.object({
  format: z.enum(VIDEO_FORMAT_IDS).default("landscape-hd"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationInSeconds: z.number().positive().default(6),
  fps: z.number().int().positive().max(120).default(30),
  backgroundColor: z.string().default("transparent"),
});

export type AssetSettings = z.infer<typeof assetSettingsSchema>;
