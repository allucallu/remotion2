import React from "react";
import { Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { mvConfig } from "../config";
import type { Line, Section } from "../data/buildTimeline";
import { HandFilter, HAND_FILTER_ID } from "../components/HandFilter";
import { PaperBackground } from "../components/PaperBackground";
import { LyricBlock } from "../components/LyricBlock";
import { Aku, NonaSilhouette } from "../components/Characters";
import { DrawPath as DrawPathHelper } from "../components/DrawPath";
import { Cup, Heart, Phone, QuestionMark, StoryRing, WashiTape } from "../components/Doodles";
import { SubSceneTransition } from "./SubSceneTransition";

const { fontFamily: gaeguFont } = loadGaegu();

interface Verse1SceneProps {
  section: Section;
}

/**
 * Scene 2: Verse 1 (0:16.34 - 0:47.32)
 * Terdiri dari 4 sub-scene bergantian sisi (kiri-kanan-kiri-kanan),
 * bercerita tentang berpapasan di jalan, teringat di meja, mencari kabar di HP, hingga tanda tanya rindu.
 */
export const Verse1Scene: React.FC<Verse1SceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Kelompokkan menjadi 2 baris per sub-scene (total 4 kelompok)
  const groups: Array<{
    lines: Line[];
    startSec: number;
    endSec: number;
    lyricAlign: "left" | "right";
  }> = [];

  for (let i = 0; i < section.lines.length; i += 2) {
    const chunk = section.lines.slice(i, i + 2);
    if (chunk.length === 0) continue;

    const startSec = i === 0 ? section.start : chunk[0].start;
    const nextChunk = section.lines[i + 2];
    const endSec = nextChunk ? nextChunk.start : section.end;

    groups.push({
      lines: chunk,
      startSec,
      endSec,
      lyricAlign: (i / 2) % 2 === 0 ? "left" : "right",
    });
  }

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
      }}
    >
      <HandFilter frame={frame} scale={2.5} />
      <PaperBackground mode="day" />

      {/* Label Bab Buku Harian di Pojok Kiri Atas (safe-area 96px) */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 150,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
        }}
      >
        <WashiTape width={90} color={mvConfig.palette.mint} rotate={-3} progress={1} />
        <span
          style={{
            fontFamily: `${gaeguFont}, cursive`,
            fontSize: 28,
            color: mvConfig.palette.graphite,
            opacity: 0.7,
            transform: "rotate(-1deg)",
          }}
        >
          bab 1: awalnya hanya saling melihat
        </span>
      </div>

      {/* Render 4 Sub-Scene secara Berurutan */}
      {groups.map((grp, gIdx) => {
        const isLastSub = gIdx === groups.length - 1;
        const from = Math.max(0, Math.round((grp.startSec - section.start) * fps));
        const durationInFrames =
          Math.max(1, Math.round((grp.endSec - grp.startSec) * fps)) +
          (isLastSub ? 12 : 0);
        const isLyricLeft = grp.lyricAlign === "left";

        return (
          <Sequence
            key={`v1-sub-${gIdx}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`Verse1-Sub-${gIdx + 1}`}
          >
            <SubSceneTransition
              durationInFrames={durationInFrames}
              direction={isLyricLeft ? "right" : "left"}
              disableExit={isLastSub}
            >
              {/* Blok Lirik (safe-area 96px) */}
              <div
                style={{
                  position: "absolute",
                  top: "52%",
                  transform: "translateY(-50%)",
                  left: isLyricLeft ? 150 : undefined,
                  right: isLyricLeft ? undefined : 96,
                  width: 780,
                  zIndex: 5,
                }}
              >
                <LyricBlock
                  lines={grp.lines}
                  align={grp.lyricAlign}
                  sectionStart={grp.startSec}
                  mode="day"
                  fontSize={70}
                />
              </div>

              {/* Blok Ilustrasi di Sisi Seberang Lirik */}
              <div
                style={{
                  position: "absolute",
                  top: "52%",
                  transform: "translateY(-50%)",
                  right: isLyricLeft ? 96 : undefined,
                  left: isLyricLeft ? undefined : 150,
                  width: 740,
                  height: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 4,
                }}
              >
                {gIdx === 0 && <SubScene1Passing />}
                {gIdx === 1 && <SubScene2Thinking />}
                {gIdx === 2 && <SubScene3Searching />}
                {gIdx === 3 && <SubScene4Missing />}
              </div>
            </SubSceneTransition>
          </Sequence>
        );
      })}
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 1: Aku dan siluet Nona berpapasan, senyum kecil muncul
 * ============================================================================ */
const SubScene1Passing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gerak berjalan saling mendekat lalu berpapasan
  const walkProgress = interpolate(frame, [0, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const akuX = interpolate(walkProgress, [0, 1], [-180, -35]);
  const nonaX = interpolate(walkProgress, [0, 1], [180, 45]);

  // Muncul senyum malu dan hati kecil saat sudah dekat (sekitar frame 65+)
  const sparkSpring = spring({
    frame: Math.max(0, frame - 65),
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.6 },
  });

  return (
    <div style={{ position: "relative", width: 640, height: 480 }}>
      {/* Garis jalan koridor coretan pena */}
      <svg
        width="640"
        height="480"
        viewBox="0 0 640 480"
        style={{ position: "absolute", inset: 0, filter: `url(#${HAND_FILTER_ID})` }}
      >
        <DrawPathHelper
          d="M 40 390 Q 320 382 600 392"
          start={0}
          duration={24}
          strokeWidth={3.5}
        />
        <DrawPathHelper
          d="M 80 410 L 140 410 M 240 408 L 310 408 M 440 412 L 520 412"
          start={10}
          duration={20}
          strokeWidth={2}
          opacity={0.5}
        />
      </svg>

      {/* Karakter Aku berjalan dari kiri */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 85,
          transform: `translateX(${akuX - 90}px)`,
        }}
      >
        <Aku
          pose="standing"
          expression={frame > 70 ? "shy" : "smile"}
          scale={0.95}
        />
      </div>

      {/* Siluet Nona berjalan dari kanan */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 85,
          transform: `translateX(${nonaX - 80}px)`,
        }}
      >
        <NonaSilhouette variant="standing" showSmile={frame > 60} scale={0.95} />
      </div>

      {/* Hati kecil & percikan senyum di antara keduanya */}
      {frame > 65 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 90,
            transform: `translateX(-50%) scale(${sparkSpring})`,
          }}
        >
          <Heart size={58} progress={1} />
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 2: Aku di meja, gelembung pikir berisi senyum Nona
 * ============================================================================ */
const SubScene2Thinking: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubbleSpring = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.7 },
  });

  const floatBubble = Math.sin(frame * 0.06) * 5;

  return (
    <div style={{ position: "relative", width: 640, height: 500 }}>
      {/* Meja duduk sederhana coretan pena */}
      <svg
        width="640"
        height="500"
        viewBox="0 0 640 500"
        style={{ position: "absolute", inset: 0, filter: `url(#${HAND_FILTER_ID})` }}
      >
        {/* Meja */}
        <DrawPathHelper
          d="M 100 360 L 540 360"
          start={0}
          duration={20}
          strokeWidth={4.5}
          color={mvConfig.palette.graphite}
        />
        <DrawPathHelper
          d="M 140 360 L 140 460 M 500 360 L 500 460"
          start={8}
          duration={16}
          strokeWidth={4}
          color={mvConfig.palette.graphite}
        />

        {/* Gelembung pikir menuju awan */}
        {frame > 20 && (
          <g fill="#FFFFFF" stroke={mvConfig.palette.penBlue} strokeWidth={2.5}>
            <circle cx="290" cy="235" r="8" opacity={bubbleSpring} />
            <circle cx="325" cy="205" r="13" opacity={bubbleSpring} />
          </g>
        )}
      </svg>

      {/* Aku duduk di meja */}
      <div style={{ position: "absolute", left: 110, top: 155 }}>
        <Aku pose="sitting" expression="smile" scale={0.95} />
      </div>

      {/* Secangkir Kopi di Meja */}
      <div style={{ position: "absolute", right: 145, top: 275 }}>
        <Cup size={85} start={12} />
      </div>

      {/* Gelembung Awan Berisi Senyum Nona */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 20 + floatBubble,
          width: 240,
          height: 190,
          transform: `scale(${bubbleSpring})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="240"
          height="190"
          viewBox="0 0 240 190"
          style={{ position: "absolute", inset: 0, filter: `url(#${HAND_FILTER_ID})` }}
        >
          <path
            d="M 55 140 C 25 140, 15 105, 35 85 C 25 50, 65 25, 95 40 C 120 15, 165 25, 175 55 C 210 55, 225 95, 200 120 C 210 148, 175 160, 150 148 C 125 162, 75 160, 55 140 Z"
            fill="#FFFFFF"
            stroke={mvConfig.palette.penBlue}
            strokeWidth={3.5}
          />
        </svg>
        <div style={{ position: "relative", zIndex: 2, marginTop: -5 }}>
          <NonaSilhouette variant="in-ring" scale={0.78} />
        </div>
        <div style={{ position: "absolute", right: 12, top: 10 }}>
          <Heart size={42} start={45} />
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 3: Aku memegang HP, mengusap layar, ikon cari
 * ============================================================================ */
const SubScene3Searching: React.FC = () => {
  const frame = useCurrentFrame();

  // Gerak swipe jari/tangan di layar secara berulang
  const swipeY = Math.sin(frame * 0.14) * 18;

  return (
    <div style={{ position: "relative", width: 640, height: 500 }}>
      {/* Karakter Aku memegang HP */}
      <div style={{ position: "absolute", left: 60, top: 145 }}>
        <Aku pose="holdingPhone" expression="shy" scale={1} />
      </div>

      {/* Zoom HP Besar dengan StoryRing & Ikon Kaca Pembesar Cari */}
      <div style={{ position: "absolute", right: 110, top: 75 }}>
        <Phone size={185} start={0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              transform: `translateY(${swipeY}px)`,
            }}
          >
            {/* Kolom Pencarian Doodle */}
            <div
              style={{
                width: 105,
                height: 26,
                borderRadius: 14,
                border: `2px solid ${mvConfig.palette.penBlue}`,
                backgroundColor: "rgba(188, 211, 232, 0.25)",
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 13 }}>🔍</span>
              <span
                style={{
                  fontSize: 12,
                  color: mvConfig.palette.penBlue,
                  fontWeight: 700,
                }}
              >
                nona...
              </span>
            </div>

            <StoryRing size={95} start={12}>
              <NonaSilhouette variant="in-ring" scale={0.62} />
            </StoryRing>
          </div>
        </Phone>
      </div>

      {/* Panah Swipe Gerak Layar Coretan Tangan */}
      <svg
        width="120"
        height="160"
        viewBox="0 0 120 160"
        style={{
          position: "absolute",
          right: 35,
          top: 170,
          filter: `url(#${HAND_FILTER_ID})`,
        }}
      >
        <DrawPathHelper
          d="M 40 110 C 48 80, 48 50, 40 30 M 30 42 L 40 28 L 52 42"
          start={20}
          duration={18}
          color={mvConfig.palette.highlighterPink}
          strokeWidth={4}
        />
      </svg>
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 4: Tanda tanya bertebaran & hati kecil muncul
 * ============================================================================ */
const SubScene4Missing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questions = [
    { x: 110, y: 70, size: 58, delay: 10, rot: -15 },
    { x: 430, y: 55, size: 68, delay: 22, rot: 14 },
    { x: 75, y: 210, size: 46, delay: 36, rot: -8 },
    { x: 470, y: 195, size: 52, delay: 48, rot: 20 },
  ];

  // Hati kecil berdenyut muncul di bagian "mengapa aku merindukanmu?" (sekitar frame 100+)
  const heartPop = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.6 },
  });

  const pulse = 1 + Math.sin(frame * 0.16) * 0.08;

  return (
    <div style={{ position: "relative", width: 640, height: 500 }}>
      {/* Karakter Aku Ekspresi Bingung */}
      <div style={{ position: "absolute", left: "50%", top: 145, transform: "translateX(-50%)" }}>
        <Aku pose="standing" expression="confused" scale={1.05} />
      </div>

      {/* Tanda Tanya Bertebaran */}
      {questions.map((q, idx) => {
        const float = Math.sin(frame * 0.08 + idx * 1.5) * 8;
        return (
          <div
            key={`v1-q-${idx}`}
            style={{
              position: "absolute",
              left: q.x,
              top: q.y + float,
            }}
          >
            <QuestionMark size={q.size} start={q.delay} rotate={q.rot} />
          </div>
        );
      })}

      {/* Hati Kecil Muncul Saat Kata "Merindukanmu" */}
      {frame > 95 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 40,
            transform: `translateX(-50%) scale(${heartPop * pulse})`,
          }}
        >
          <Heart size={70} progress={1} />
        </div>
      )}
    </div>
  );
};
