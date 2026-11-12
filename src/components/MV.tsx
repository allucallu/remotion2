import React from "react";
import { Audio, Sequence, useVideoConfig } from "remotion";
import { mvConfig } from "../config";
import { lyrics } from "../lyrics";
import { getLyricGroups } from "../layout";
import { MidnightRoomBackground } from "./MidnightRoomBackground";
import { FloatingCharacterCard } from "./FloatingCharacterCard";
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

        // Posisi kartu karakter berlawanan dengan letak teks:
        // Jika teks di left-block -> kartu di kanan (right-card)
        // Jika teks di right-block -> kartu di kiri (left-card)
        // Jika center -> kartu di atas/tengah (center-card)
        const cardLayout =
          group.layout === "left-block"
            ? "right-card"
            : group.layout === "right-block"
            ? "left-card"
            : "center-card";

        return (
          <Sequence
            key={`grp-seq-${group.groupId}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`Group-${group.groupId}-${group.layout}`}
          >
            {/* Kartu Karakter Nona Berhijab (Pose 1 s/d 6) */}
            {group.poseId && (
              <FloatingCharacterCard
                poseId={group.poseId}
                layout={cardLayout}
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

      {/* 5. Outro Kartu Penutup Lagu (Detik 228 s/d Selesai 232.1s) */}
      <Sequence
        from={Math.round(227.5 * fps)}
        durationInFrames={Math.round((mvConfig.durationInSeconds - 227.5) * fps)}
        name="SongOutro"
      >
        <SongOutro
          durationInFrames={Math.round(
            (mvConfig.durationInSeconds - 227.5) * fps
          )}
        />
      </Sequence>
    </div>
  );
};
