import React from "react";
import { Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { mvConfig } from "../config";
import type { Line, Section } from "../data/buildTimeline";
import { HandFilter, HAND_FILTER_ID } from "../components/HandFilter";
import { PaperBackground } from "../components/PaperBackground";
import { LyricBlock } from "../components/LyricBlock";
import { DrawPath } from "../components/DrawPath";
import { Aku } from "../components/Characters";
import { Clock, Heart, MusicNote, Star, WashiTape } from "../components/Doodles";
import { SubSceneTransition } from "./SubSceneTransition";

const { fontFamily: gaeguFont } = loadGaegu();

interface PreChorusSceneProps {
  section: Section;
}

/**
 * Scene 3: Pre-Chorus 1 (0:47.32 - 1:02.90)
 * Terdiri dari 2 sub-scene bergantian sisi (kiri-kanan):
 * 1. Jam berputar cepat & permen/gula untuk "semanis itu senyummu".
 * 2. Kepala Aku penuh coretan senyum Nona dengan energi visual meningkat menuju Chorus.
 */
export const PreChorusScene: React.FC<PreChorusSceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Kelompokkan menjadi 2 baris per sub-scene (2 kelompok)
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
      <HandFilter frame={frame} scale={2.8} />
      <PaperBackground mode="day" />

      {/* Label Bab di Pojok Kiri Atas */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 148,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
        }}
      >
        <WashiTape width={90} color={mvConfig.palette.highlighterYellow} rotate={2} progress={1} />
        <span
          style={{
            fontFamily: `${gaeguFont}, cursive`,
            fontSize: 28,
            color: mvConfig.palette.graphite,
            opacity: 0.75,
            transform: "rotate(-1deg)",
          }}
        >
          bab 2: tak tahu alasannya...
        </span>
      </div>

      {/* Render Sub-Scene secara Berurutan */}
      {groups.map((grp, gIdx) => {
        const from = Math.max(0, Math.round((grp.startSec - section.start) * fps));
        const durationInFrames = Math.max(
          1,
          Math.round((grp.endSec - grp.startSec) * fps)
        );
        const isLyricLeft = grp.lyricAlign === "left";

        return (
          <Sequence
            key={`pre-sub-${gIdx}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`PreChorus-Sub-${gIdx + 1}`}
          >
            <SubSceneTransition
              durationInFrames={durationInFrames}
              direction={isLyricLeft ? "right" : "left"}
            >
              {/* Blok Lirik */}
              <div
                style={{
                  position: "absolute",
                  top: "48%",
                  transform: "translateY(-50%)",
                  left: isLyricLeft ? 155 : undefined,
                  right: isLyricLeft ? undefined : 90,
                  width: 820,
                  zIndex: 5,
                }}
              >
                <LyricBlock
                  lines={grp.lines}
                  align={grp.lyricAlign}
                  sectionStart={grp.startSec}
                  mode="day"
                  fontSize={72}
                />
              </div>

              {/* Blok Ilustrasi */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: isLyricLeft ? 100 : undefined,
                  left: isLyricLeft ? undefined : 155,
                  width: 720,
                  height: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 4,
                }}
              >
                {gIdx === 0 && <SubScene1ClockAndCandy />}
                {gIdx === 1 && <SubScene2HeadFullOfSmiles />}
              </div>
            </SubSceneTransition>
          </Sequence>
        );
      })}
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 1: Jam berputar cepat & doodle permen/gula "semanis itu senyummu"
 * ============================================================================ */
const SubScene1ClockAndCandy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const candySpring = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.6 },
  });

  const bounce = Math.sin(frame * 0.12) * 6;

  return (
    <div style={{ position: "relative", width: 640, height: 500 }}>
      {/* Jam Dinding Berputar Cepat di Atas Kiri */}
      <div style={{ position: "absolute", left: 60, top: 40 }}>
        <Clock size={135} start={0} spin={true} rotate={-5} />
      </div>

      {/* Jam Kecil Tambahan Berputar */}
      <div style={{ position: "absolute", left: 220, top: 20, opacity: 0.65 }}>
        <Clock size={80} start={12} spin={true} rotate={12} />
      </div>

      {/* Karakter Aku */}
      <div style={{ position: "absolute", left: 190, top: 180 }}>
        <Aku pose="standing" expression={frame > 95 ? "happy" : "smile"} scale={0.98} />
      </div>

      {/* Permen Manis & Kubus Gula Doodle (muncul saat baris "semanis itu senyummu") */}
      {frame > 85 && (
        <div
          style={{
            position: "absolute",
            right: 65,
            top: 90 + bounce,
            transform: `scale(${candySpring}) rotate(8deg)`,
          }}
        >
          <svg
            width="170"
            height="170"
            viewBox="0 0 160 160"
            style={{ overflow: "visible", filter: `url(#${HAND_FILTER_ID})` }}
          >
            {/* Permen Bungkus Pink Manis */}
            <DrawPath
              d="M 35 65 L 15 45 L 20 85 Z"
              progress={1}
              color={mvConfig.palette.graphite}
              fill={mvConfig.palette.highlighterPink}
              strokeWidth={3}
            />
            <DrawPath
              d="M 105 65 L 125 45 L 120 85 Z"
              progress={1}
              color={mvConfig.palette.graphite}
              fill={mvConfig.palette.highlighterPink}
              strokeWidth={3}
            />
            <ellipse
              cx="70"
              cy="65"
              rx="36"
              ry="24"
              fill={mvConfig.palette.highlighterPink}
              stroke={mvConfig.palette.graphite}
              strokeWidth={3.5}
            />
            {/* Garis putar permen */}
            <path
              d="M 55 48 C 60 65, 58 75, 52 82 M 80 45 C 85 60, 82 75, 76 85"
              stroke="#FFFFFF"
              strokeWidth={3.5}
              strokeLinecap="round"
              fill="none"
            />

            {/* Dua Kubus Gula Manis di Bawah Permen */}
            <g transform="translate(30, 105) rotate(-8)">
              <rect
                x="0"
                y="0"
                width="34"
                height="34"
                rx="4"
                fill="#FFFFFF"
                stroke={mvConfig.palette.penBlue}
                strokeWidth={3}
              />
              <circle cx="12" cy="12" r="2" fill={mvConfig.palette.penBlue} />
              <circle cx="22" cy="22" r="2" fill={mvConfig.palette.penBlue} />
            </g>
            <g transform="translate(80, 112) rotate(12)">
              <rect
                x="0"
                y="0"
                width="30"
                height="30"
                rx="4"
                fill="#FFFFFF"
                stroke={mvConfig.palette.penBlue}
                strokeWidth={3}
              />
              <circle cx="15" cy="15" r="2" fill={mvConfig.palette.penBlue} />
            </g>
          </svg>
        </div>
      )}

      {/* Bintang Doodle Berkibar */}
      <div style={{ position: "absolute", right: 120, bottom: 80 }}>
        <Star size={54} start={60} variant="sparkle" />
      </div>
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 2: Kepala Aku penuh coretan senyum Nona + energi naik ke Chorus
 * ============================================================================ */
const SubScene2HeadFullOfSmiles: React.FC = () => {
  const frame = useCurrentFrame();

  // Energi gerak meningkat menjelang masuk ke Chorus!
  const energyRamp = interpolate(frame, [0, 220], [1, 1.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jitter = Math.sin(frame * 0.35) * 4 * energyRamp;

  // Daftar posisi coretan senyum Nona (lengkung senyum + pipi blush) mengelilingi kepala Aku
  const smileDoodles = [
    { x: 110, y: 55, rot: -14, scale: 0.9, delay: 8 },
    { x: 380, y: 40, rot: 12, scale: 1.05, delay: 24 },
    { x: 75, y: 185, rot: -20, scale: 0.85, delay: 42 },
    { x: 455, y: 165, rot: 18, scale: 1.1, delay: 60 },
    { x: 245, y: 20, rot: 4, scale: 1.15, delay: 80 },
  ];

  return (
    <div style={{ position: "relative", width: 640, height: 500 }}>
      {/* Garis-garis Energi Aksi Meningkat Menuju Chorus */}
      <svg
        width="640"
        height="500"
        viewBox="0 0 640 500"
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#${HAND_FILTER_ID})`,
          opacity: interpolate(frame, [60, 200], [0.25, 0.85], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <DrawPath d="M 40 60 L 110 110" start={50} duration={15} color={mvConfig.palette.highlighterPink} strokeWidth={3.5} />
        <DrawPath d="M 600 60 L 530 110" start={65} duration={15} color={mvConfig.palette.highlighterPink} strokeWidth={3.5} />
        <DrawPath d="M 30 280 L 95 270" start={85} duration={15} color={mvConfig.palette.highlighterYellow} strokeWidth={4} />
        <DrawPath d="M 610 280 L 545 270" start={95} duration={15} color={mvConfig.palette.highlighterYellow} strokeWidth={4} />
      </svg>

      {/* Karakter Aku di Tengah Bawah */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 190,
          transform: `translateX(-50%) translateY(${jitter * 0.4}px)`,
        }}
      >
        <Aku pose="standing" expression="shy" scale={1.02} />
      </div>

      {/* Coretan Senyum Nona Mengelilingi Kepala Aku */}
      {smileDoodles.map((s, idx) => {
        const floatY = Math.sin(frame * 0.14 + idx * 1.3) * 7 * energyRamp;
        const popOpacity = interpolate(frame, [s.delay, s.delay + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={`pc-smile-${idx}`}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y + floatY,
              transform: `rotate(${s.rot}deg) scale(${s.scale})`,
              opacity: popOpacity,
            }}
          >
            <svg
              width="105"
              height="65"
              viewBox="0 0 100 60"
              style={{ overflow: "visible", filter: `url(#${HAND_FILTER_ID})` }}
            >
              {/* Pipi Blush Pink */}
              <ellipse cx="22" cy="30" rx="10" ry="6" fill={mvConfig.palette.highlighterPink} opacity={0.75} />
              <ellipse cx="78" cy="30" rx="10" ry="6" fill={mvConfig.palette.highlighterPink} opacity={0.75} />
              {/* Lengkung Senyum Nona */}
              <DrawPath
                d="M 28 32 Q 50 52 72 32"
                start={s.delay}
                duration={14}
                color={mvConfig.palette.graphite}
                strokeWidth={4}
              />
            </svg>
          </div>
        );
      })}

      {/* Not Musik & Hati Kecil Melambung Naik (Build Up Chorus) */}
      <div style={{ position: "absolute", left: 110, bottom: 70 + jitter }}>
        <Heart size={46} start={90} />
      </div>
      <div style={{ position: "absolute", right: 110, bottom: 90 - jitter }}>
        <MusicNote size={54} start={110} variant="double" color={mvConfig.palette.highlighterPink} />
      </div>
      <div style={{ position: "absolute", right: 170, top: 45 }}>
        <Star size={48} start={120} variant="sparkle" />
      </div>
    </div>
  );
};

