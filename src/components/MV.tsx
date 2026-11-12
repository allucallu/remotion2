import React from "react";
import { Audio, Sequence, useVideoConfig } from "remotion";
import { mvConfig } from "../config";
import { lyrics } from "../lyrics";
import { getLyricGroups } from "../layout";
import { MidnightRoomBackground } from "./MidnightRoomBackground";
import { StandaloneCharacter } from "./StandaloneCharacter";
import { SceneAccents } from "./SceneAccents";
import { LyricCardBlock } from "./LyricCardBlock";
import { SongIntro } from "./SongIntro";
import { SongOutro } from "./SongOutro";

export const MV: React.FC = () => {
  const { fps } = useVideoConfig();
  const groups = getLyricGroups(lyrics);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: mvConfig.theme.bgMidnight,
        overflow: "hidden",
      }}
    >
      {/* 1. Trek Audio Lagu Intim Akustik */}
      <Audio src={mvConfig.audioSrc} />

      {/* 2. Latar Suasana Kamar Malam Hangat (Midnight Warm Room Glow & Floating Dust) */}
      <MidnightRoomBackground />

      {/* 3. Intro Judul & Artis Lagu (Detik 0 s/d 16) */}
      <Sequence durationInFrames={Math.round(16.5 * fps)} name="SongIntro">
        <SongIntro />
      </Sequence>

      {/* 4. Sequence Per Kelompok Bait Lirik & Kartu Karakter */}
      {groups.map((group) => {
        const from = Math.round(group.start * fps);
        const durationInFrames = Math.max(
          1,
          Math.round((group.end - group.start) * fps)
        );

        // Posisi karakter berdiri mandiri berlawanan dengan letak teks:
        // Jika teks di left-block -> karakter di kanan (right-character)
        // Jika teks di right-block -> karakter di kiri (left-character)
        // Jika center -> karakter di tengah (center-character)
        const characterLayout =
          group.layout === "left-block"
            ? "right-character"
            : group.layout === "right-block"
            ? "left-character"
            : "center-character";

        return (
          <Sequence
            key={`grp-seq-${group.groupId}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`Group-${group.groupId}-${group.layout}`}
          >
            {/* Karakter Nona Berhijab Berdiri Mandiri Tanpa Bingkai (Pose 1 s/d 6) */}
            {group.poseId && (
              <StandaloneCharacter
                poseId={group.poseId}
                layout={characterLayout}
              />
            )}

            {/* Aksen Ikon Tipis di Ruang Seberang Lirik (untuk bait tanpa kartu karakter) */}
            {!group.poseId && group.accentType && (
              <SceneAccents
                type={group.accentType}
                layout={group.layout === "left-block" ? "right-accent" : "left-accent"}
              />
            )}

            {/* Blok Tipografi Teks Lirik */}
            <LyricCardBlock
              group={group}
              durationInFrames={durationInFrames}
            />
          </Sequence>
        );
      })}

      {/* 5. Outro Kartu Penutup Lagu (Detik 233.0 s/d 246.4 saat vokal lirik sudah selesai) */}
      <Sequence
        from={Math.round(233.0 * fps)}
        durationInFrames={Math.round((mvConfig.durationInSeconds - 233.0) * fps)}
        name="SongOutro"
      >
        <SongOutro
          durationInFrames={Math.round(
            (mvConfig.durationInSeconds - 233.0) * fps
          )}
        />
      </Sequence>
    </div>
  );
};
