import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "./config";
import type { Line } from "./data/buildTimeline";
import { HandFilter } from "./components/HandFilter";
import { PaperBackground, type PaperMode } from "./components/PaperBackground";
import { LyricBlock } from "./components/LyricBlock";
import { Aku, NonaSilhouette } from "./components/Characters";
import {
  Clock,
  Cup,
  Guitar,
  Heart,
  Lamp,
  MusicNote,
  Phone,
  QuestionMark,
  Star,
  StickyNote,
  StoryRing,
  WashiTape,
} from "./components/Doodles";

const sampleLines: Line[] = [
  {
    text: "Hei, Nona, bolehkah kuminta?",
    start: 0.4,
    end: 3.2,
    words: [
      { text: "Hei,", start: 0.4, end: 1.0 },
      { text: "Nona,", start: 1.0, end: 1.8 },
      { text: "bolehkah", start: 1.8, end: 2.5 },
      { text: "kuminta?", start: 2.5, end: 3.2 },
    ],
  },
  {
    text: "Cukup biarkan kulihat senyummu",
    start: 3.5,
    end: 6.5,
    words: [
      { text: "Cukup", start: 3.5, end: 4.1 },
      { text: "biarkan", start: 4.1, end: 4.9 },
      { text: "kulihat", start: 4.9, end: 5.6 },
      { text: "senyummu", start: 5.6, end: 6.5 },
    ],
  },
  {
    text: "Mengapa aku merindukanmu?",
    start: 6.8,
    end: 9.8,
    words: [
      { text: "Mengapa", start: 6.8, end: 7.7 },
      { text: "aku", start: 7.7, end: 8.4 },
      { text: "merindukanmu?", start: 8.4, end: 9.8 },
    ],
  },
];

/**
 * Komposisi Pengujian Desain (DesignTest):
 * Menampilkan seluruh komponen dasar, doodle, karakter, filter line-boil, dan 3 mode latar kertas.
 */
export const DesignTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Siklus otomatis 3 mode latar kertas tiap 4 detik (120 frame)
  const mode: PaperMode =
    frame < 120 ? "day" : frame < 240 ? "night" : "golden";

  const labelColor =
    mode === "night" ? mvConfig.palette.nightChalk : mvConfig.palette.penBlue;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Filter Line Boil Aktif */}
      <HandFilter frame={frame} scale={2.5} />

      {/* Latar Kertas Bergaris */}
      <PaperBackground mode={mode} />

      {/* Header Info Mode */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 145,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: labelColor,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <WashiTape width={110} color={mvConfig.palette.mint} rotate={-4} />
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
            DESIGN SYSTEM SHOWCASE — Mode: {mode.toUpperCase()}
          </h2>
        </div>
        <span style={{ fontSize: 20, fontFamily: "monospace" }}>
          Frame: {frame} / 360 (Line-boil seed: {Math.floor(frame / 4)})
        </span>
      </div>

      {/* Kolom Kiri: LyricBlock + Karakter Utama */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 150,
          width: 820,
          display: "flex",
          flexDirection: "column",
          gap: 30,
          zIndex: 5,
        }}
      >
        <div
          style={{
            padding: 24,
            borderRadius: 12,
            border: `2px dashed ${mode === "night" ? "rgba(255,255,255,0.2)" : "rgba(43,74,139,0.2)"}`,
          }}
        >
          <LyricBlock
            lines={sampleLines}
            align="left"
            sectionStart={0}
            mode={mode}
            fontSize={58}
          />
        </div>

        {/* Barisan Karakter Aku (Pose & Ekspresi Beragam) & Nona */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            marginTop: 10,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Aku pose="holdingGuitar" expression="smile" scale={0.85} mode={mode} />
            <p style={{ margin: "4px 0 0", color: labelColor, fontSize: 16 }}>
              Aku (Guitar / Smile)
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <Aku pose="holdingPhone" expression="shy" scale={0.85} mode={mode} />
            <p style={{ margin: "4px 0 0", color: labelColor, fontSize: 16 }}>
              Aku (Phone / Shy)
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <Aku pose="sitting" expression="confused" scale={0.85} mode={mode} />
            <p style={{ margin: "4px 0 0", color: labelColor, fontSize: 16 }}>
              Aku (Sitting / Confused)
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <NonaSilhouette variant="standing" scale={0.85} mode={mode} />
            <p style={{ margin: "4px 0 0", color: labelColor, fontSize: 16 }}>
              Nona (Standing)
            </p>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Galeri 12 Doodles + Phone + StoryRing */}
      <div
        style={{
          position: "absolute",
          top: 110,
          right: 60,
          width: 840,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          alignItems: "center",
          justifyItems: "center",
          zIndex: 5,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Guitar size={80} start={0} mode={mode} />
          <div style={{ color: labelColor, fontSize: 14 }}>Guitar</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <MusicNote size={64} start={10} mode={mode} />
          <div style={{ color: labelColor, fontSize: 14 }}>MusicNote</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Heart size={64} start={15} mode={mode} />
          <div style={{ color: labelColor, fontSize: 14 }}>Heart</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <QuestionMark size={64} start={20} mode={mode} />
          <div style={{ color: labelColor, fontSize: 14 }}>QuestionMark</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Clock size={90} start={25} spin={true} mode={mode} />
          <div style={{ color: labelColor, fontSize: 14 }}>Clock (Spin)</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Cup size={85} start={30} mode={mode} />
          <div style={{ color: labelColor, fontSize: 14 }}>Cup</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Star size={64} start={35} variant="five-point" mode={mode} />
          <div style={{ color: labelColor, fontSize: 14 }}>Star</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Lamp size={90} start={40} mode={mode} lit={mode === "night"} />
          <div style={{ color: labelColor, fontSize: 14 }}>Lamp</div>
        </div>

        <div style={{ textAlign: "center", gridColumn: "span 2" }}>
          <Phone size={120} start={45} mode={mode}>
            <StoryRing size={85} start={55} mode={mode}>
              <NonaSilhouette variant="in-ring" scale={0.55} mode={mode} />
            </StoryRing>
          </Phone>
          <div style={{ color: labelColor, fontSize: 14, marginTop: 6 }}>
            Phone + StoryRing + Nona (in-ring)
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <StickyNote size={135} start={50}>
            <span>unggah dong :)</span>
          </StickyNote>
          <div style={{ color: labelColor, fontSize: 14, marginTop: 6 }}>
            StickyNote
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <WashiTape width={120} start={55} pattern="dots" color={mvConfig.palette.highlighterPink} />
          <div style={{ color: labelColor, fontSize: 14, marginTop: 14 }}>
            WashiTape
          </div>
        </div>
      </div>
    </div>
  );
};

