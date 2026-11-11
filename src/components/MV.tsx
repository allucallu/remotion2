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
import { SceneIllustration, getIllustrationForGroup } from "./SceneIllustration";
import { CharacterArt, getCharacterArtForGroup } from "./CharacterArt";
import { InstrumentalBreak } from "./InstrumentalBreak";
import { Outro } from "./Outro";

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
        durationInFrames={mvConfig.intro.durationInFrames}
        name="Intro"
      >
        <Intro />
      </Sequence>

      {/* 4b. Visual Sketsa Jeda Musik (Instrumental Break setelah Intro: 14.5s - 25.8s) */}
      <Sequence
        from={Math.round(14.5 * fps)}
        durationInFrames={Math.round((25.8 - 14.5) * fps)}
        name="InstrumentalBreak"
      >
        <InstrumentalBreak
          durationInFrames={Math.round((25.8 - 14.5) * fps)}
        />
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
            {/* 1. Visual Gambar Karakter Asli dari folder calon (1.jpg - 4.jpg) */}
            {(() => {
              const artId = getCharacterArtForGroup(group.groupId);
              if (artId) {
                return (
                  <CharacterArt
                    artId={artId}
                    layout={group.layout}
                    groupId={group.groupId}
                  />
                );
              }
              // 2. Jika bukan bait karakter, tampilkan ilustrasi objek tema (tagihan, kopi, dompet, dll)
              const illType = getIllustrationForGroup(group.groupId);
              if (illType) {
                return (
                  <SceneIllustration
                    type={illType}
                    layout={group.layout}
                    groupId={group.groupId}
                  />
                );
              }
              return null;
            })()}

            {/* Hiasan sketsa tangan yang mengitari teks & gambar */}
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

      {/* 6. Visual Outro / Penutup (setelah lirik terakhir: 213s - selesai) */}
      <Sequence
        from={Math.round(213.0 * fps)}
        durationInFrames={Math.round((mvConfig.durationInSeconds - 213.0) * fps)}
        name="Outro"
      >
        <Outro
          durationInFrames={Math.round(
            (mvConfig.durationInSeconds - 213.0) * fps
          )}
        />
      </Sequence>
    </div>
  );
};

