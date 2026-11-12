import { Composition } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { MV } from "./MV";
import { DesignTest } from "./DesignTest";
import { mvConfig } from "./config";
import { ensureFontsLoaded } from "./utils/fonts";
import "./index.css";

// Mulai pemuatan font sejak inisialisasi bundle root
void ensureFontsLoaded();

export const RemotionRoot = () => (
  <>
    <Composition
      id="MV"
      component={MV}
      durationInFrames={mvConfig.defaultDurationInFrames}
      fps={mvConfig.fps}
      width={mvConfig.width}
      height={mvConfig.height}
      calculateMetadata={async () => {
        await ensureFontsLoaded();
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

    {/* Komposisi uji desain terpisah (tidak masuk ke alur produksi MV) */}
    <Composition
      id="DesignTest"
      component={DesignTest}
      durationInFrames={360}
      fps={mvConfig.fps}
      width={mvConfig.width}
      height={mvConfig.height}
    />
  </>
);
