import React from "react";
import { Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";
import { mvConfig } from "../config";
import type { Line, Section } from "../data/buildTimeline";
import { HandFilter, HAND_FILTER_ID } from "../components/HandFilter";
import { PaperBackground } from "../components/PaperBackground";
import { LyricBlock } from "../components/LyricBlock";
import { DrawPath } from "../components/DrawPath";
import { Aku, NonaSilhouette } from "../components/Characters";
import { Clock, Cup, Heart, MusicNote, Star, StickyNote, WashiTape } from "../components/Doodles";
import { SubSceneTransition } from "./SubSceneTransition";

const { fontFamily: gaeguFont } = loadGaegu();
const { fontFamily: patrickHandFont } = loadPatrickHand();

interface PreChorusSceneProps {
  section: Section;
  /** Variant 1 untuk Pre-Chorus 1 (jam & permen), Variant 2 untuk Pre-Chorus 2 (peta rute imajiner berdua) */
  variant?: 1 | 2;
}

/**
 * Scene Pre-Chorus (Pre-Chorus 1: 0:47.32 - 1:02.90, Pre-Chorus 2: 2:07.64 - 2:23.18)
 * Terdiri dari 2 sub-scene bergantian sisi (kiri-kanan).
 */
export const PreChorusScene: React.FC<PreChorusSceneProps> = ({
  section,
  variant = 1,
}) => {
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

      {/* Label Bab di Pojok Kiri Atas (safe-area 96px) */}
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
        <WashiTape
          width={90}
          color={variant === 2 ? mvConfig.palette.mint : mvConfig.palette.highlighterYellow}
          rotate={variant === 2 ? -2 : 2}
          progress={1}
        />
        <span
          style={{
            fontFamily: `${gaeguFont}, cursive`,
            fontSize: 28,
            color: mvConfig.palette.graphite,
            opacity: 0.75,
            transform: "rotate(-1deg)",
          }}
        >
          {variant === 2 ? "bab 4.5: khayalan jalan berdua..." : "bab 2: tak tahu alasannya..."}
        </span>
      </div>

      {/* Render Sub-Scene secara Berurutan */}
      {groups.map((grp, gIdx) => {
        const isLastSub = gIdx === groups.length - 1;
        const from = Math.max(0, Math.round((grp.startSec - section.start) * fps));
        const durationInFrames =
          Math.max(1, Math.round((grp.endSec - grp.startSec) * fps)) +
          (isLastSub ? 12 : 0);
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

              {/* Blok Ilustrasi */}
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
                {variant === 1 && gIdx === 0 && <SubScene1ClockAndCandy />}
                {variant === 1 && gIdx === 1 && <SubScene2HeadFullOfSmiles />}
                {variant === 2 && gIdx === 0 && <Variant2Sub1Daydreaming />}
                {variant === 2 && gIdx === 1 && <Variant2Sub2ImaginaryMap />}
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

/* ============================================================================
 * VARIANT 2 - SUB-SCENE 1: Aku tersipu membayangkan berdua ("Lucu juga kalau dipikirkan")
 * ============================================================================ */
const Variant2Sub1Daydreaming: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cloudSpring = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 14, stiffness: 115, mass: 0.7 },
  });

  const floatY = Math.sin(frame * 0.1) * 5;

  return (
    <div style={{ position: "relative", width: 640, height: 520 }}>
      {/* Karakter Aku Tertawa Kecil & Malu */}
      <div style={{ position: "absolute", left: 85, bottom: 45 }}>
        <Aku pose="standing" expression="shy" scale={1.04} />
      </div>

      {/* Gelembung Pikiran Berisi Berdua Jalan di Peta Kecil */}
      <div
        style={{
          position: "absolute",
          right: 50,
          top: 40 + floatY,
          transform: `scale(${cloudSpring}) rotate(3deg)`,
        }}
      >
        <StickyNote
          size={245}
          color={mvConfig.palette.highlighterYellow}
          rotate={2}
          start={0}
          progress={1}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Aku pose="standing" expression="happy" scale={0.38} />
              <Heart size={32} start={24} />
              <NonaSilhouette variant="standing" scale={0.42} showSmile={true} />
            </div>
            <span
              style={{
                fontFamily: `${patrickHandFont}, cursive`,
                fontSize: 28,
                color: mvConfig.palette.penBlue,
              }}
            >
              lucu ya? hehe :)
            </span>
          </div>
        </StickyNote>
      </div>

      {/* Dekorasi Hati & Bintang */}
      <div style={{ position: "absolute", left: 195, top: 80 - floatY }}>
        <Heart size={42} start={20} />
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 70 }}>
        <Star size={48} start={35} variant="sparkle" />
      </div>
    </div>
  );
};

/* ============================================================================
 * VARIANT 2 - SUB-SCENE 2: Peta rute imajiner berdua garis putus-putus (kafe, bioskop, pantai)
 * ============================================================================ */
const Variant2Sub2ImaginaryMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapReveal = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 105, mass: 0.8 },
  });

  // Gerak maju ikon pasangan menyusuri garis putus-putus peta imajiner
  const walkProgress = interpolate(frame, [20, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashFlow = -(frame * 1.4);

  return (
    <div
      style={{
        position: "relative",
        width: 700,
        height: 580,
        transform: `scale(${0.92 + mapReveal * 0.08})`,
      }}
    >
      {/* Kartu Peta Khayalan Berdua dengan Washi Tape */}
      <div
        style={{
          position: "absolute",
          inset: "22px 18px",
          backgroundColor: "#FFFDF7",
          border: `3.5px solid ${mvConfig.palette.graphite}`,
          borderRadius: 18,
          boxShadow: "6px 10px 0px rgba(51,54,61,0.14)",
          padding: 20,
          boxSizing: "border-box",
          transform: "rotate(-1deg)",
        }}
      >
        {/* Selotip Pemasang Peta */}
        <div style={{ position: "absolute", left: 26, top: -18 }}>
          <WashiTape width={82} color={mvConfig.palette.highlighterPink} rotate={-12} progress={1} />
        </div>
        <div style={{ position: "absolute", right: 26, top: -18 }}>
          <WashiTape width={82} color={mvConfig.palette.mint} rotate={10} progress={1} />
        </div>

        {/* Judul Peta di Atas */}
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <span
            style={{
              fontFamily: `${patrickHandFont}, cursive`,
              fontSize: 34,
              color: mvConfig.palette.penBlue,
              backgroundColor: "rgba(255, 230, 109, 0.55)",
              padding: "2px 18px",
              borderRadius: 10,
            }}
          >
            peta khayalan berdua ✈
          </span>
        </div>

        {/* SVG Peta Rute Garis Putus-Putus Menuju 3 Destinasi */}
        <svg
          width="620"
          height="450"
          viewBox="0 0 620 450"
          style={{ overflow: "visible", filter: `url(#${HAND_FILTER_ID})` }}
        >
          {/* Garis Rute Putus-Putus Berkelok: Start -> Kafe -> Bioskop -> Pantai */}
          <path
            d="M 80 355 C 120 265, 95 170, 185 135 C 275 100, 315 280, 395 255 C 475 230, 480 120, 535 125"
            stroke={mvConfig.palette.highlighterPink}
            strokeWidth={5}
            strokeDasharray="12 12"
            strokeDashoffset={dashFlow}
            strokeLinecap="round"
            fill="none"
          />

          {/* Titik Pin Tujuan 1: KAFE (Kiri Atas) */}
          <g transform="translate(185, 135)">
            <circle cx="0" cy="0" r="14" fill={mvConfig.palette.highlighterYellow} stroke={mvConfig.palette.graphite} strokeWidth={3} />
            <text
              x="0"
              y="-58"
              textAnchor="middle"
              fontFamily={`${patrickHandFont}, cursive`}
              fontSize="28"
              fill={mvConfig.palette.penBlue}
            >
              1. Kafe ☕
            </text>
          </g>

          {/* Titik Pin Tujuan 2: BIOSKOP (Tengah Bawah) */}
          <g transform="translate(385, 260)">
            <circle cx="0" cy="0" r="14" fill={mvConfig.palette.mint} stroke={mvConfig.palette.graphite} strokeWidth={3} />
            {/* Ikon Tiket / Clapperboard Bioskop Mini */}
            <g transform="translate(-32, 22)">
              <rect x="0" y="0" width="64" height="44" rx="6" fill="#FFFFFF" stroke={mvConfig.palette.graphite} strokeWidth={2.5} />
              <path d="M 0 12 L 64 12 M 14 0 L 22 12 M 36 0 L 44 12" stroke={mvConfig.palette.graphite} strokeWidth={2.5} />
              <polygon points="26,20 26,36 42,28" fill={mvConfig.palette.highlighterPink} />
            </g>
            <text
              x="0"
              y="92"
              textAnchor="middle"
              fontFamily={`${patrickHandFont}, cursive`}
              fontSize="28"
              fill={mvConfig.palette.penBlue}
            >
              2. Bioskop 🎬
            </text>
          </g>

          {/* Titik Pin Tujuan 3: PANTAI (Kanan Atas) */}
          <g transform="translate(530, 125)">
            <circle cx="0" cy="0" r="14" fill={mvConfig.palette.highlighterPink} stroke={mvConfig.palette.graphite} strokeWidth={3} />
            {/* Ikon Matahari & Ombak Pantai */}
            <g transform="translate(-30, -82)">
              <circle cx="48" cy="18" r="14" fill={mvConfig.palette.highlighterYellow} stroke={mvConfig.palette.graphite} strokeWidth={2.5} />
              <path
                d="M 4 50 Q 16 40 28 50 T 52 50 T 72 50"
                stroke={mvConfig.palette.penBlue}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 10 62 Q 22 54 34 62 T 60 62"
                stroke={mvConfig.palette.mint}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
              />
            </g>
            <text
              x="4"
              y="42"
              textAnchor="middle"
              fontFamily={`${patrickHandFont}, cursive`}
              fontSize="28"
              fill={mvConfig.palette.penBlue}
            >
              3. Pantai 🏖
            </text>
          </g>

          {/* Start Flag ("Berdua!") di Pojok Kiri Bawah */}
          <g transform="translate(80, 355)">
            <DrawPath d="M 0 0 L 0 -38" start={8} duration={12} color={mvConfig.palette.graphite} strokeWidth={3.5} />
            <DrawPath
              d="M 0 -38 L 36 -28 L 0 -16 Z"
              start={14}
              duration={12}
              color={mvConfig.palette.graphite}
              fill={mvConfig.palette.highlighterYellow}
              strokeWidth={2.5}
            />
          </g>
        </svg>

        {/* Doodle Cangkir Kopi di Dekat Titik 1 Kafe */}
        <div style={{ position: "absolute", left: 162, top: 88 }}>
          <Cup size={58} start={16} />
        </div>

        {/* Pasangan Mini Aku + Nona Bergerak Mengikuti Rute + Hati */}
        <div
          style={{
            position: "absolute",
            left: interpolate(walkProgress, [0, 0.35, 0.7, 1], [62, 165, 340, 482]),
            top: interpolate(walkProgress, [0, 0.35, 0.7, 1], [375, 195, 295, 172]),
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "rgba(255,255,255,0.92)",
            padding: "4px 10px",
            borderRadius: 20,
            border: `2.5px solid ${mvConfig.palette.highlighterPink}`,
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          <Aku pose="standing" expression="happy" scale={0.28} />
          <Heart size={24} start={0} />
          <NonaSilhouette variant="standing" scale={0.3} showSmile={true} />
        </div>

        {/* Energi Panah & Not Musik Menuju Chorus */}
        <div style={{ position: "absolute", right: 26, bottom: 22 }}>
          <MusicNote size={48} start={40} variant="double" color={mvConfig.palette.highlighterPink} />
        </div>
      </div>
    </div>
  );
};


