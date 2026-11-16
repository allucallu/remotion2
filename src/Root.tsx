import React from "react";
import { Composition } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { MV } from "./MV";
import { mvConfig } from "./config";
import { DesignTest } from "./scenes/DesignTest";
import "./index.css";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Komposisi Utama Video Musik */}
    <Composition
      id="MV"
      component={MV}
      fps={mvConfig.fps}
      width={mvConfig.width}
      height={mvConfig.height}
      durationInFrames={mvConfig.defaultDurationInFrames}
      calculateMetadata={async () => {
        try {
          const durationSec = await getAudioDurationInSeconds(mvConfig.audioSrc);
          return {
            durationInFrames: Math.ceil(durationSec * mvConfig.fps),
          };
        } catch (err) {
          console.warn(
            "Gagal mengambil durasi audio secara dinamis, fallback ke durasi default:",
            err
          );
          return {
            durationInFrames: mvConfig.defaultDurationInFrames,
          };
        }
      }}
    />

    {/* Komposisi Pengujian Sistem Desain (DesignTest) */}
    <Composition
      id="DesignTest"
      component={DesignTest}
      fps={mvConfig.fps}
      width={mvConfig.width}
      height={mvConfig.height}
      durationInFrames={300} // 10 detik showcase
    />
  </>
);
