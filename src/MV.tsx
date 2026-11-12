import React from "react";
import { Audio, Sequence, useVideoConfig } from "remotion";
import { mvConfig } from "./config";
import { timeline } from "./data/timeline";
import { IntroScene } from "./scenes/IntroScene";
import { Verse1Scene } from "./scenes/Verse1Scene";
import { PreChorusScene } from "./scenes/PreChorusScene";
import { ChorusScene } from "./scenes/ChorusScene";
import { Verse2Scene } from "./scenes/Verse2Scene";
import { BridgeScene } from "./scenes/BridgeScene";
import { FinalChorusScene } from "./scenes/FinalChorusScene";
import { OutroScene } from "./scenes/OutroScene";
import {
  SECTION_TRANSITION_FRAMES,
  SectionTransition,
} from "./scenes/SubSceneTransition";

export const MV: React.FC = () => {
  const { fps, width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: mvConfig.palette.paperCream,
        overflow: "hidden",
      }}
    >
      {/* 1. Pemutar Trek Audio Lagu */}
      <Audio src={mvConfig.audioSrc} />

      {/* 2. Sequence Per Section dari Timeline dengan Overlap 12 Frame (Zero Blank/Black Frame) */}
      {timeline.map((sec, idx) => {
        const from = Math.round(sec.start * fps);
        const isLastSection = idx === timeline.length - 1;
        const nextFrom = !isLastSection
          ? Math.round(timeline[idx + 1].start * fps)
          : Math.round(sec.end * fps);

        // Tambahkan overlap 12 frame pada akhir seksi non-terakhir agar seksi berikutnya
        // dapat cross-fade/geser masuk di atasnya tanpa celah frame kosong.
        const baseDuration = Math.max(1, nextFrom - from);
        const durationInFrames = isLastSection
          ? Math.max(1, Math.round((sec.end - sec.start) * fps))
          : baseDuration + SECTION_TRANSITION_FRAMES;

        let sceneNode: React.ReactNode = null;
        if (idx === 0 && sec.kind === "intro") {
          sceneNode = <IntroScene section={sec} />;
        } else if (idx === 1 && sec.kind === "verse") {
          sceneNode = <Verse1Scene section={sec} />;
        } else if (idx === 2 && sec.kind === "pre") {
          sceneNode = <PreChorusScene section={sec} variant={1} />;
        } else if (idx === 3 && sec.kind === "chorus") {
          sceneNode = <ChorusScene section={sec} variant={1} />;
        } else if (idx === 4 && sec.kind === "verse") {
          sceneNode = <Verse2Scene section={sec} />;
        } else if (idx === 5 && sec.kind === "pre") {
          sceneNode = <PreChorusScene section={sec} variant={2} />;
        } else if (idx === 6 && sec.kind === "chorus") {
          sceneNode = <ChorusScene section={sec} variant={2} />;
        } else if (sec.kind === "bridge") {
          sceneNode = <BridgeScene section={sec} />;
        } else if (sec.kind === "final") {
          sceneNode = <FinalChorusScene section={sec} />;
        } else if (sec.kind === "outro") {
          sceneNode = <OutroScene section={sec} />;
        }

        return (
          <Sequence
            key={`sec-${idx}-${sec.kind}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`${idx + 1}. ${sec.name}`}
          >
            <SectionTransition sectionIndex={idx}>
              {sceneNode}
            </SectionTransition>
          </Sequence>
        );
      })}
    </div>
  );
};
