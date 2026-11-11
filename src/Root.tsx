import { Fragment } from "react";
import { Composition } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { assetRegistry } from "./compositions/registry";
import { MV } from "./components/MV";
import { FontComparison } from "./components/FontComparison";
import { BoilTest } from "./components/BoilTest";
import { mvConfig } from "./config";
import "./index.css";

export const RemotionRoot = () => (
  <>
    {/* Komposisi Perbandingan Font (Sub-fase 1) */}
    <Composition
      id="FontComparison"
      component={FontComparison}
      durationInFrames={120}
      fps={mvConfig.fps}
      width={mvConfig.width}
      height={mvConfig.height}
    />

    {/* Komposisi Uji Goyang Line-Boil Tunggal di Atas Kertas (Sub-fase 1) */}
    <Composition
      id="BoilTest"
      component={BoilTest}
      durationInFrames={120}
      fps={mvConfig.fps}
      width={mvConfig.width}
      height={mvConfig.height}
    />

    {/* Komposisi Musik Video (MV) */}
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

    {/* Komposisi Aset Bawaan */}
    {assetRegistry.map((asset) => (
      <Fragment key={asset.id}>{asset.render()}</Fragment>
    ))}
  </>
);
