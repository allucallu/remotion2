import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { mvConfig } from "../config";
import type { Section } from "../data/buildTimeline";
import { HandFilter, HAND_FILTER_ID } from "../components/HandFilter";
import { PaperBackground } from "../components/PaperBackground";
import { DrawPath } from "../components/DrawPath";
import { Guitar, MusicNote, Star, StickyNote, WashiTape } from "../components/Doodles";

const { fontFamily: gaeguFont } = loadGaegu();

interface IntroSceneProps {
  section: Section;
}

/**
 * Scene 1: Intro (0:00 - 0:16.34)
 * Kertas kosong, judul "Hei, Nona" ditulis bertahap dengan pena biru (DrawPath),
 * gitar akustik digambar perlahan, dan not musik melayang naik mengikuti picking gitar.
 */
export const IntroScene: React.FC<IntroSceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const durationInFrames = Math.max(
    1,
    Math.round((section.end - section.start) * fps)
  );

  // Transisi keluar ±12 frame menuju Verse 1
  const exitOpacity = interpolate(
    frame,
    [Math.max(1, durationInFrames - 12), durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Animasi subtitel masuk lembut
  const subtitleOpacity = interpolate(frame, [105, 130], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4 not musik melayang naik mengikuti petikan gitar (dimulai setelah gitar terbentuk)
  const notes = [
    { startFrame: 140, baseX: 1180, speed: 1.6, swayAmp: 18, variant: "single" as const },
    { startFrame: 195, baseX: 1320, speed: 1.9, swayAmp: 22, variant: "double" as const },
    { startFrame: 255, baseX: 1240, speed: 1.5, swayAmp: 16, variant: "single" as const },
    { startFrame: 315, baseX: 1360, speed: 1.8, swayAmp: 20, variant: "double" as const },
  ];

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      <HandFilter frame={frame} scale={2.5} />
      <PaperBackground mode="day" />

      {/* Dekorasi Washi Tape di Sudut Kiri Atas */}
      <div style={{ position: "absolute", top: 38, left: 160, zIndex: 2 }}>
        <WashiTape width={160} start={8} color={mvConfig.palette.mint} rotate={-6} />
      </div>

      {/* Catatan Kecil / Sticky Note di Kanan Atas */}
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 120,
          zIndex: 2,
          fontFamily: `${gaeguFont}, cursive`,
        }}
      >
        <StickyNote size={175} start={45} rotate={4} color={mvConfig.palette.highlighterYellow}>
          <span style={{ fontSize: 22, fontWeight: 700 }}>
            tentang
            <br />
            senyummu :)
          </span>
        </StickyNote>
      </div>

      {/* Kiri: Judul Tulisan Tangan "Hei, Nona" dengan DrawPath Bertahap */}
      <div
        style={{
          position: "absolute",
          left: 190,
          top: "38%",
          transform: "translateY(-50%)",
          width: 780,
          zIndex: 5,
        }}
      >
        <svg
          width="740"
          height="200"
          viewBox="0 0 440 130"
          style={{
            overflow: "visible",
            filter: `url(#${HAND_FILTER_ID})`,
          }}
        >
          {/* H */}
          <DrawPath d="M 22 25 L 22 92" start={18} duration={14} strokeWidth={5.5} />
          <DrawPath d="M 62 25 L 62 92" start={28} duration={14} strokeWidth={5.5} />
          <DrawPath d="M 22 58 Q 42 54 62 58" start={38} duration={10} strokeWidth={5} />

          {/* e */}
          <DrawPath
            d="M 80 68 L 114 66 C 116 50, 82 48, 80 68 C 78 88, 108 92, 118 82"
            start={46}
            duration={18}
            strokeWidth={5}
          />

          {/* i */}
          <DrawPath d="M 136 52 L 136 88" start={60} duration={10} strokeWidth={5} />
          <DrawPath d="M 136 32 L 136 35" start={68} duration={6} strokeWidth={6} />

          {/* , */}
          <DrawPath d="M 156 84 C 158 92, 152 98, 148 100" start={72} duration={8} strokeWidth={5} />

          {/* N */}
          <DrawPath
            d="M 192 90 L 192 26 L 238 90 L 238 26"
            start={80}
            duration={22}
            strokeWidth={5.5}
          />

          {/* o */}
          <DrawPath
            d="M 276 54 C 254 54, 252 90, 276 90 C 298 90, 298 54, 276 54"
            start={96}
            duration={16}
            strokeWidth={5}
          />

          {/* n */}
          <DrawPath
            d="M 314 90 L 314 54 C 318 52, 346 50, 346 66 L 346 90"
            start={108}
            duration={16}
            strokeWidth={5}
          />

          {/* a */}
          <DrawPath
            d="M 394 60 C 370 50, 358 86, 384 90 C 394 90, 398 74, 396 56 L 398 90"
            start={120}
            duration={18}
            strokeWidth={5}
          />

          {/* Garis bawah lengkung pink stabilo */}
          <DrawPath
            d="M 18 112 Q 210 100 412 110"
            start={135}
            duration={20}
            color={mvConfig.palette.highlighterPink}
            strokeWidth={6}
            opacity={0.75}
          />
        </svg>

        {/* Subtitel buku harian kecil */}
        <p
          style={{
            fontFamily: `${gaeguFont}, cursive`,
            fontSize: 34,
            color: mvConfig.palette.graphite,
            margin: "24px 0 0 10px",
            opacity: subtitleOpacity,
            transform: "rotate(-1deg)",
          }}
        >
          bab 0: gitar akustik & catatan pengagum diam-diam ♫
        </p>
      </div>

      {/* Kanan: Gitar Akustik Digambar Bertahap */}
      <div
        style={{
          position: "absolute",
          right: 260,
          top: "30%",
          zIndex: 4,
        }}
      >
        <Guitar size={260} start={85} mode="day" rotate={-10} />
      </div>

      {/* Not Musik Melayang Naik Mengikuti Petikan Gitar */}
      {notes.map((n, idx) => {
        const elapsed = frame - n.startFrame;
        if (elapsed < 0) return null;

        const riseY = elapsed * n.speed;
        const swayX = Math.sin(elapsed * 0.08 + idx) * n.swayAmp;
        const noteOpacity = interpolate(elapsed, [0, 20, 140, 180], [0, 0.9, 0.9, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        if (noteOpacity <= 0) return null;

        return (
          <div
            key={`intro-note-${idx}`}
            style={{
              position: "absolute",
              left: n.baseX + swayX,
              top: 520 - riseY,
              opacity: noteOpacity,
              zIndex: 6,
            }}
          >
            <MusicNote
              size={58}
              progress={1}
              variant={n.variant}
              color={idx % 2 === 0 ? mvConfig.palette.penBlue : mvConfig.palette.highlighterPink}
            />
          </div>
        );
      })}

      {/* Bintang Doodle Dekoratif */}
      <div style={{ position: "absolute", left: 1020, top: 210, opacity: 0.7 }}>
        <Star size={44} start={160} variant="sparkle" />
      </div>
      <div style={{ position: "absolute", right: 160, bottom: 160, opacity: 0.7 }}>
        <Star size={50} start={210} variant="five-point" />
      </div>
    </div>
  );
};

