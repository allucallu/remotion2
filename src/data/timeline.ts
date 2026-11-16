import { Section, buildTimeline } from "./buildTimeline";
import { RAW_LYRICS } from "./rawLyrics";
import whisperJson from "./whisper-raw2.json";
import { mvConfig } from "../config";

export const timeline: Section[] = buildTimeline(
  RAW_LYRICS,
  whisperJson,
  mvConfig.defaultDurationInSeconds,
  mvConfig.lyricOffsetSec
);

export type { Word, Line, Section } from "./buildTimeline";
