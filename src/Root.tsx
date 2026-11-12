import { Composition } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { MV } from "./MV";
import { mvConfig } from "./config";
import "./index.css";

export const RemotionRoot = () => (
  <Composition
    id="MV"
    component={MV}
    durationInFrames={mvConfig.defaultDurationInFrames}
    fps={mvConfig.fps}
    width={mvConfig.width}
    height={mvConfig.height}
    calculateMetadata={async () => {
      try {
        const durationInSeconds = await getAudioDurationInSeconds(
          mvConfig.audioSrc
        );
        return {
          durationInFrames: Math.ceil(durationInSeconds * mvConfig.fps),
        };
      } catch {
        return {
          durationInFrames: mvConfig.defaultDurationInFrames,
        };
      }
    }}
  />
);
