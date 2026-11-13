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
import {
  Heart,
  Phone,
  QuestionMark,
  StickyNote,
  StoryRing,
  WashiTape,
} from "../components/Doodles";
import { SubSceneTransition } from "./SubSceneTransition";

const { fontFamily: gaeguFont } = loadGaegu();
const { fontFamily: patrickHandFont } = loadPatrickHand();

interface Verse2SceneProps {
  section: Section;
}

/**
 * Scene 5: Verse 2 (1:35.72 - 2:07.64)
 * Terdiri dari 4 sub-scene (2 baris per sub-scene, kiri-kanan bergantian):
 * 1. Aku menunggu, cincin story muncul ("Setiap ada lingkaran ceritamu...").
 * 2. Story terbuka berisi kotak penuh coretan teks kutipan panjang ("Ternyata kutipan tentang hidupmu").
 * 3. Aku membaca berulang: confused, tanda tanya, kepala miring, garuk kepala.
 * 4. Aku menunduk sopan, tersenyum canggung shy ("Maaf, Nona... ingin melihat senyummu hari ini").
 */
export const Verse2Scene: React.FC<Verse2SceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

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
      <HandFilter frame={frame} scale={2.6} />
      <PaperBackground mode="day" />

      {/* Label Bab Buku Harian (safe-area 96px) */}
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
          width={92}
          color={mvConfig.palette.highlighterPink}
          rotate={-2}
          progress={1}
        />
        <span
          style={{
            fontFamily: `${gaeguFont}, cursive`,
            fontSize: 28,
            color: mvConfig.palette.graphite,
            opacity: 0.78,
          }}
        >
          bab 4: lingkaran cerita & kutipan panjang
        </span>
      </div>

      {/* Render 4 Sub-Scene Bergantian */}
      {groups.map((grp, gIdx) => {
        const isLastSub = gIdx === groups.length - 1;
        const from = Math.max(0, Math.round((grp.startSec - section.start) * fps));
        const durationInFrames =
          Math.max(1, Math.round((grp.endSec - grp.startSec) * fps)) +
          (isLastSub ? 12 : 0);
        const isLyricLeft = grp.lyricAlign === "left";

        return (
          <Sequence
            key={`v2-sub-${gIdx}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`Verse2-Sub-${gIdx + 1}`}
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
                  fontSize={68}
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
                {gIdx === 0 && <Verse2Sub1WaitingStory />}
                {gIdx === 1 && <Verse2Sub2LongQuoteBox />}
                {gIdx === 2 && <Verse2Sub3ScratchHead />}
                {gIdx === 3 && <Verse2Sub4PoliteBow />}
              </div>
            </SubSceneTransition>
          </Sequence>
        );
      })}
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 1: Aku menunggu, lalu cincin story muncul menyala ("yang pertama tahu")
 * ============================================================================ */
const Verse2Sub1WaitingStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringAppearFrame = 28;
  const ringSpring = spring({
    frame: Math.max(0, frame - ringAppearFrame),
    fps,
    config: { damping: 11, stiffness: 125, mass: 0.7 },
  });

  const pulseScale = 1 + Math.sin(frame * 0.2) * 0.04;
  const dotCycle = Math.floor(frame / 12) % 4;

  return (
    <div style={{ position: "relative", width: 660, height: 540 }}>
      {/* Karakter Aku memegang HP, menunggu antusias */}
      <div style={{ position: "absolute", left: 70, bottom: 55, zIndex: 4 }}>
        <Aku
          pose="holdingPhone"
          expression={frame > ringAppearFrame ? "happy" : "neutral"}
          scale={1.04}
        />
      </div>

      {/* Gelembung Menunggu "..." sebelum cincin muncul */}
      {frame < ringAppearFrame + 24 && (
        <div
          style={{
            position: "absolute",
            left: 195,
            top: 90,
            backgroundColor: "#FFFFFF",
            border: `2.5px solid ${mvConfig.palette.graphite}`,
            borderRadius: 20,
            padding: "8px 18px",
            opacity: interpolate(frame, [ringAppearFrame, ringAppearFrame + 20], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span
            style={{
              fontFamily: `${gaeguFont}, cursive`,
              fontSize: 30,
              color: mvConfig.palette.penBlue,
            }}
          >
            menunggu{".".repeat(dotCycle)}
          </span>
        </div>
      )}

      {/* Layar HP Besar + Cincin Story Muncul */}
      <div
        style={{
          position: "absolute",
          right: 75,
          top: 65,
          transform: `rotate(4deg) scale(${pulseScale})`,
          zIndex: 3,
        }}
      >
        <Phone size={205} start={0}>
          {frame >= ringAppearFrame ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                transform: `scale(${ringSpring})`,
              }}
            >
              <StoryRing size={135} start={ringAppearFrame}>
                <NonaSilhouette variant="in-ring" scale={0.9} showSmile={true} />
              </StoryRing>
              <span
                style={{
                  fontFamily: `${gaeguFont}, cursive`,
                  fontSize: 22,
                  color: mvConfig.palette.highlighterPink,
                  fontWeight: 700,
                }}
              >
                nona • #1st!
              </span>
            </div>
          ) : (
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                border: `3px dashed ${mvConfig.palette.bookLine}`,
              }}
            />
          )}
        </Phone>
      </div>

      {/* Hati Kecil Muncul Saat Cincin Nyala */}
      {frame >= ringAppearFrame && (
        <div style={{ position: "absolute", right: 50, top: 45 }}>
          <Heart size={46} start={ringAppearFrame + 8} />
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 2: Story terbuka isinya kotak penuh coretan teks panjang (kutipan)
 * ============================================================================ */
const Verse2Sub2LongQuoteBox: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modalSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });

  // Garis-garis teks kutipan panjang di dalam story
  const scribbleLines = [
    "M 18 42 Q 65 38 118 43",
    "M 18 58 Q 70 55 122 59",
    "M 18 74 Q 58 70 112 75",
    "M 18 90 Q 75 86 120 91",
    "M 18 106 Q 60 103 115 107",
    "M 18 122 Q 48 119 92 123",
  ];

  return (
    <div style={{ position: "relative", width: 680, height: 540 }}>
      {/* Story Terbuka Besar di Layar HP Kiri */}
      <div
        style={{
          position: "absolute",
          left: 85,
          top: 50,
          transform: `scale(${modalSpring}) rotate(-2deg)`,
        }}
      >
        <Phone size={220} start={0}>
          <div
            style={{
              width: 150,
              height: 210,
              backgroundColor: mvConfig.palette.paperCream,
              border: `2.5px solid ${mvConfig.palette.graphite}`,
              borderRadius: 12,
              padding: "12px 10px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Header Tanda Kutip */}
            <span
              style={{
                fontFamily: `${patrickHandFont}, cursive`,
                fontSize: 32,
                lineHeight: 0.9,
                color: mvConfig.palette.highlighterPink,
              }}
            >
              “kutipan”
            </span>

            {/* Kotak Penuh Coretan Teks Panjang */}
            <svg
              width="136"
              height="145"
              viewBox="0 0 136 145"
              style={{ overflow: "visible", filter: `url(#${HAND_FILTER_ID})` }}
            >
              <rect
                x="6"
                y="12"
                width="124"
                height="126"
                rx="8"
                fill="rgba(255, 230, 109, 0.25)"
                stroke={mvConfig.palette.penBlue}
                strokeWidth={2}
              />
              {scribbleLines.map((pathD, idx) => (
                <DrawPath
                  key={`qline-${idx}`}
                  d={pathD}
                  start={24 + idx * 9}
                  duration={12}
                  color={mvConfig.palette.graphite}
                  strokeWidth={3}
                />
              ))}
            </svg>
          </div>
        </Phone>
      </div>

      {/* Aku Melirik dengan Wajah Kebingungan */}
      <div style={{ position: "absolute", right: 75, bottom: 50 }}>
        <Aku pose="standing" expression="confused" scale={1.02} flipX={true} />
      </div>

      {/* Tanda Tanya Kecil Muncul */}
      <div style={{ position: "absolute", right: 65, top: 85 }}>
        <QuestionMark size={52} start={48} color={mvConfig.palette.penBlue} rotate={12} />
      </div>
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 3: Membaca berulang — confused, tanda tanya, kepala miring, garuk kepala
 * ============================================================================ */
const Verse2Sub3ScratchHead: React.FC = () => {
  const frame = useCurrentFrame();

  // Kepala / tubuh sedikit miring bolak-balik seakan bingung membaca ulang
  const headTilt = Math.sin(frame * 0.08) * 6 - 4;

  const qMarks = [
    { x: 60, y: 70, size: 58, rot: -15, start: 6 },
    { x: 255, y: 38, size: 64, rot: 14, start: 18 },
    { x: 385, y: 125, size: 50, rot: 22, start: 32 },
    { x: 95, y: 215, size: 44, rot: -20, start: 46 },
  ];

  return (
    <div style={{ position: "relative", width: 660, height: 540 }}>
      {/* Sticky Note Kotak Kutipan yang Dibaca Ulang */}
      <div style={{ position: "absolute", right: 48, top: 95 }}>
        <StickyNote
          size={195}
          color={mvConfig.palette.mint}
          rotate={5}
          start={0}
          progress={1}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
            <span
              style={{
                fontFamily: `${gaeguFont}, cursive`,
                fontSize: 22,
                fontWeight: 700,
                color: mvConfig.palette.penBlue,
              }}
            >
              “hidup bagai...”
            </span>
            <svg width="145" height="70" viewBox="0 0 145 70">
              <path d="M 4 12 L 138 10" stroke={mvConfig.palette.graphite} strokeWidth={3} strokeLinecap="round" />
              <path d="M 4 28 L 132 29" stroke={mvConfig.palette.graphite} strokeWidth={3} strokeLinecap="round" />
              <path d="M 4 44 L 126 42" stroke={mvConfig.palette.graphite} strokeWidth={3} strokeLinecap="round" />
              <path d="M 4 60 L 96 58" stroke={mvConfig.palette.graphite} strokeWidth={3} strokeLinecap="round" />
            </svg>
          </div>
        </StickyNote>
      </div>

      {/* Karakter Aku: Kepala Miring + Pose Garuk Kepala Terintegrasi */}
      <div
        style={{
          position: "absolute",
          left: 145,
          bottom: 45,
          transformOrigin: "bottom center",
          transform: `rotate(${headTilt}deg)`,
        }}
      >
        <Aku pose="scratchingHead" expression="confused" scale={1.08} />
      </div>

      {/* Tanda Tanya Bertebaran di Sekitar Kepala */}
      {qMarks.map((q, idx) => (
        <div
          key={`v2-q-${idx}`}
          style={{
            position: "absolute",
            left: q.x,
            top: q.y + Math.sin(frame * 0.12 + idx) * 6,
          }}
        >
          <QuestionMark
            size={q.size}
            start={q.start}
            rotate={q.rot}
            color={idx % 2 === 0 ? mvConfig.palette.penBlue : mvConfig.palette.highlighterPink}
          />
        </div>
      ))}
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 4: "Maaf, Nona..." -> Aku menunduk sopan, tersenyum canggung (shy)
 * ============================================================================ */
const Verse2Sub4PoliteBow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bowSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.9 },
  });

  // Menunduk sopan (~11 derajat ke arah senyum Nona)
  const bowTilt = interpolate(bowSpring, [0, 1], [0, 11]);
  const bubbleScale = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.7 },
  });

  return (
    <div style={{ position: "relative", width: 660, height: 540 }}>
      {/* Karakter Aku Menunduk Sopan & Tersenyum Canggung (shy) */}
      <div
        style={{
          position: "absolute",
          left: 115,
          bottom: 45,
          transformOrigin: "bottom center",
          transform: `rotate(${bowTilt}deg)`,
        }}
      >
        <Aku pose="standing" expression="shy" scale={1.08} />
      </div>

      {/* Gelembung Permintaan Maaf */}
      <div
        style={{
          position: "absolute",
          left: 65,
          top: 90,
          transform: `scale(${bubbleScale}) rotate(-3deg)`,
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: `3px solid ${mvConfig.palette.graphite}`,
            borderRadius: "24px 24px 24px 6px",
            padding: "10px 22px",
            boxShadow: "3px 5px 0px rgba(51,54,61,0.12)",
          }}
        >
          <span
            style={{
              fontFamily: `${patrickHandFont}, cursive`,
              fontSize: 34,
              color: mvConfig.palette.penBlue,
            }}
          >
            maaf ya, Nona :)
          </span>
        </div>
      </div>

      {/* Coretan Senyum Nona yang Ingin Dilihat di Kanan Atas */}
      <div
        style={{
          position: "absolute",
          right: 75,
          top: 125 + Math.sin(frame * 0.1) * 5,
        }}
      >
        <StoryRing size={180} start={16}>
          <NonaSilhouette variant="in-ring" scale={1.12} showSmile={true} />
        </StoryRing>
      </div>

      <div style={{ position: "absolute", right: 55, top: 88 }}>
        <Heart size={50} start={35} />
      </div>
    </div>
  );
};

