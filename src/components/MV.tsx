import React from "react";
import { Audio, Sequence, useVideoConfig } from "remotion";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { mvConfig } from "../config";
import { lyrics } from "../lyrics";
import { getLyricGroups } from "../layout";
import { Paper } from "./Paper";
import { LineBoilFilter } from "./LineBoilFilter";
import { Intro } from "./Intro";
import { LyricGroup } from "./LyricGroup";
import { Doodles } from "./Doodles";

// Muat font pilihan Gaegu
const { fontFamily } = loadGaegu("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export const MV: React.FC = () => {
  const { fps } = useVideoConfig();
  const groups = getLyricGroups(lyrics);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: mvConfig.paper.bgMid,
        overflow: "hidden",
        fontFamily,
      }}
    >
      {/* 1. Audio Trek Utama */}
      <Audio src={mvConfig.audioSrc} />

      {/* 2. Latar Kertas Krem Hangat Bertekstur */}
      <Paper />

      {/* 3. Filter Goyang Tinta Sketsa (Line Boil) */}
      <LineBoilFilter />

      {/* 4. Intro Judul & Artis Lagu */}
      <Sequence
        from={0}
        durationInFrames={mvConfig.intro.durationInFrames}
        name="Intro"
      >
        <Intro />
      </Sequence>

      {/* 5. Sequence Berdasarkan Kelompok Tata Letak Lirik (src/layout.ts) */}
      {groups.map((group) => {
        const from = Math.round(group.start * fps);
        const durationInFrames = Math.max(
          1,
          Math.round((group.end - group.start) * fps)
        );

        return (
          <Sequence
            key={`lyric-group-${group.groupId}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`Group-${group.groupId}-${group.layout}`}
          >
            {/* Hiasan sketsa tangan yang mengisi negative space */}
            {mvConfig.doodles.enabled && (
              <Doodles layout={group.layout} groupId={group.groupId} />
            )}
            <LyricGroup
              group={group}
              durationInFrames={durationInFrames}
            />
          </Sequence>
        );
      })}
    </div>
  );
};

