import { Composition } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { MV } from "./components/MV";
import { FontComparison } from "./components/FontComparison";
import { BoilTest } from "./components/BoilTest";
import { mvConfig } from "./config";
import "./index.css";

export const RemotionRoot = () => (
  <>
    {/* Komposisi Musik Video (MV) Utama */}
    <Composition
      id="MV"
      component={MV}
      durationInFrames={mvConfig.durationInFrames}
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
            durationInFrames: mvConfig.durationInFrames,
          };
        }
      }}
    />

    {/* Komposisi Uji & Preview (Opsional) */}
    <Composition
      id="FontComparison"
      component={FontComparison}
      durationInFrames={120}
      fps={mvConfig.fps}
      width={mvConfig.width}
      height={mvConfig.height}
    />

    <Composition
      id="BoilTest"
      component={BoilTest}
      durationInFrames={120}
      fps={mvConfig.fps}
      width={mvConfig.width}
      height={mvConfig.height}
    />
  </>
);
