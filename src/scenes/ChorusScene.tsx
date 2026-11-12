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
  MusicNote,
  Phone,
  Star,
  StickyNote,
  StoryRing,
  WashiTape,
} from "../components/Doodles";
import { SubSceneTransition } from "./SubSceneTransition";

const { fontFamily: gaeguFont } = loadGaegu();
const { fontFamily: patrickHandFont } = loadPatrickHand();

interface ChorusSceneProps {
  section: Section;
  /** Variasi 1 untuk Chorus pertama, Variasi 2 untuk Chorus kedua (lebih hangat + stiker baru + posisi kamera berbeda) */
  variant?: 1 | 2;
}

/**
 * Scene Chorus (Chorus 1: 1:02.90 - 1:35.72, Chorus 2: 2:23.18 - 2:55.64)
 * Energi tertinggi di video dengan palet penuh (pink, kuning, mint).
 * Terdiri dari 2 bagian utama (masing-masing 4 baris lirik).
 */
export const ChorusScene: React.FC<ChorusSceneProps> = ({
  section,
  variant = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVariant2 = variant === 2;

  // Denyut tempo lagu ±90 BPM (1 ketuk = 20 frame di 30fps)
  const beatPeriodFrames = (fps * 60) / 90;
  const beatWave = Math.sin((frame / beatPeriodFrames) * Math.PI * 2);
  const beatPulse = (beatWave + 1) * 0.5;

  // Posisi & gerak kamera berbeda antara variant 1 dan variant 2 agar terasa segar
  const cameraZoom = isVariant2
    ? interpolate(frame, [0, 950], [1.02, 1.06], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
    : interpolate(frame, [0, 950], [1, 1.03], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const cameraPanX = isVariant2 ? Math.sin(frame * 0.018) * 10 : Math.cos(frame * 0.015) * 6;
  const cameraRotate = isVariant2 ? -0.45 : 0.3;

  // Bagi 8 baris Chorus menjadi 2 sub-scene (Bagian 1: 4 baris awal, Bagian 2: 4 baris akhir)
  const midIdx = Math.min(4, section.lines.length);
  const groups: Array<{
    lines: Line[];
    startSec: number;
    endSec: number;
    lyricAlign: "left" | "right";
  }> = [];

  if (midIdx > 0) {
    const firstChunk = section.lines.slice(0, midIdx);
    const secondChunk = section.lines.slice(midIdx);

    groups.push({
      lines: firstChunk,
      startSec: section.start,
      endSec: secondChunk.length > 0 ? secondChunk[0].start : section.end,
      lyricAlign: isVariant2 ? "right" : "left",
    });

    if (secondChunk.length > 0) {
      groups.push({
        lines: secondChunk,
        startSec: secondChunk[0].start,
        endSec: section.end,
        lyricAlign: isVariant2 ? "left" : "right",
      });
    }
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
      <HandFilter frame={frame} scale={3.1} />
      <PaperBackground mode={isVariant2 ? "golden" : "day"} />

      {/* Aksen Warna Penuh: Pendaran lembut Pink, Kuning, Mint di belakang halaman */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isVariant2
            ? "radial-gradient(circle at 22% 28%, rgba(255, 143, 168, 0.22) 0%, transparent 45%), radial-gradient(circle at 78% 72%, rgba(255, 230, 109, 0.24) 0%, transparent 48%), radial-gradient(circle at 60% 18%, rgba(154, 219, 197, 0.18) 0%, transparent 40%)"
            : "radial-gradient(circle at 78% 30%, rgba(255, 143, 168, 0.18) 0%, transparent 46%), radial-gradient(circle at 25% 75%, rgba(154, 219, 197, 0.2) 0%, transparent 45%), radial-gradient(circle at 55% 50%, rgba(255, 230, 109, 0.18) 0%, transparent 50%)",
          opacity: 0.8 + beatPulse * 0.2,
          pointerEvents: "none",
        }}
      />

      {/* Ornamen Bintang & Not Berkilau Berdenyut ±90 BPM di Sudut Layar */}
      <AmbientBeatSparkles beatPulse={beatPulse} variant={variant} />

      {/* Stiker Baru Khusus Variant 2 */}
      {isVariant2 && <Variant2ExtraStickers beatPulse={beatPulse} />}

      {/* Label Bab di Pojok Kiri Atas (safe-area 96px) */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 150,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 12,
        }}
      >
        <WashiTape
          width={96}
          color={isVariant2 ? mvConfig.palette.highlighterPink : mvConfig.palette.mint}
          rotate={isVariant2 ? 3 : -2}
          progress={1}
        />
        <span
          style={{
            fontFamily: `${gaeguFont}, cursive`,
            fontSize: 28,
            color: mvConfig.palette.graphite,
            opacity: 0.82,
          }}
        >
          {isVariant2 ? "bab 5: hei, nona! (lagi)" : "bab 3: hei, nona!"}
        </span>
      </div>

      {/* Kontainer Kamera dengan Gerak Halus */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${cameraPanX}px) scale(${cameraZoom}) rotate(${cameraRotate}deg)`,
          transformOrigin: "center center",
        }}
      >
        {groups.map((grp, gIdx) => {
          const isLastSub = gIdx === groups.length - 1;
          const from = Math.max(0, Math.round((grp.startSec - section.start) * fps));
          const durationInFrames =
            Math.max(1, Math.round((grp.endSec - grp.startSec) * fps)) +
            (isLastSub ? 12 : 0);
          const isLyricLeft = grp.lyricAlign === "left";

          return (
            <Sequence
              key={`chorus-v${variant}-sub-${gIdx}`}
              from={from}
              durationInFrames={durationInFrames}
              name={`ChorusV${variant}-Part-${gIdx + 1}`}
            >
              <SubSceneTransition
                durationInFrames={durationInFrames}
                direction={isLyricLeft ? "right" : "left"}
                disableExit={isLastSub}
              >
                {/* Blok Lirik 4 Baris (safe-area 96px) */}
                <div
                  style={{
                    position: "absolute",
                    top: "52%",
                    transform: "translateY(-50%)",
                    left: isLyricLeft ? 150 : undefined,
                    right: isLyricLeft ? undefined : 96,
                    width: 780,
                    zIndex: 6,
                  }}
                >
                  <LyricBlock
                    lines={grp.lines}
                    align={grp.lyricAlign}
                    sectionStart={grp.startSec}
                    mode={isVariant2 ? "golden" : "day"}
                    fontSize={62}
                  />
                </div>

                {/* Blok Ilustrasi Berenergi Tinggi (safe-area 96px) */}
                <div
                  style={{
                    position: "absolute",
                    top: "52%",
                    transform: "translateY(-50%)",
                    right: isLyricLeft ? 96 : undefined,
                    left: isLyricLeft ? undefined : 150,
                    width: 740,
                    height: 640,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 4,
                  }}
                >
                  {gIdx === 0 && (
                    <ChorusPart1Visual variant={variant} beatPulse={beatPulse} />
                  )}
                  {gIdx === 1 && (
                    <ChorusPart2Visual variant={variant} beatPulse={beatPulse} />
                  )}
                </div>
              </SubSceneTransition>
            </Sequence>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
 * BAGIAN 1: StoryRing besar + NonaSilhouette + Aku melambai + "Hei, Nona" besar
 * ============================================================================ */
const ChorusPart1Visual: React.FC<{ variant: 1 | 2; beatPulse: number }> = ({
  variant,
  beatPulse,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.7 },
  });

  // Lambaian tangan ceria Aku dari tepi HP (±90 BPM)
  const waveAngle = Math.sin(frame * 0.35) * 18;
  const ringScale = interpolate(beatPulse, [0, 1], [0.97, 1.04]);

  return (
    <div style={{ position: "relative", width: 720, height: 620 }}>
      {/* Tulisan Besar "Hei, Nona" dengan stabilo kuning-pink di atas */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: `translateX(-50%) scale(${popSpring}) rotate(${variant === 2 ? 2 : -2}deg)`,
          zIndex: 6,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            padding: "4px 28px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 10,
              height: 28,
              backgroundColor:
                variant === 2
                  ? mvConfig.palette.highlighterPink
                  : mvConfig.palette.highlighterYellow,
              opacity: 0.6,
              borderRadius: 10,
              transform: "rotate(-1deg)",
            }}
          />
          <span
            style={{
              position: "relative",
              fontFamily: `${patrickHandFont}, cursive`,
              fontSize: 78,
              fontWeight: 700,
              color: mvConfig.palette.highlighterPink,
              textShadow: `3px 3px 0px ${mvConfig.palette.graphite}`,
              letterSpacing: 1.5,
            }}
          >
            Hei, Nona!
          </span>
        </div>
      </div>

      {/* Bingkai HP Besar di Tengah Kanan dengan StoryRing + Nona */}
      <div
        style={{
          position: "absolute",
          left: "52%",
          top: 128,
          transform: `translateX(-50%) scale(${popSpring})`,
          zIndex: 3,
        }}
      >
        <Phone size={230} start={0} rotate={variant === 2 ? -3 : 3}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              transform: `scale(${ringScale})`,
            }}
          >
            <StoryRing size={142} start={6}>
              <NonaSilhouette variant="in-ring" scale={0.98} showSmile={true} />
            </StoryRing>
            <span
              style={{
                fontFamily: `${gaeguFont}, cursive`,
                fontSize: 22,
                color: mvConfig.palette.penBlue,
                backgroundColor: mvConfig.palette.mint,
                padding: "2px 12px",
                borderRadius: 12,
              }}
            >
              cerita.nona ✨
            </span>
          </div>
        </Phone>
      </div>

      {/* Aku Melambai Ceria dari Tepi HP */}
      <div
        style={{
          position: "absolute",
          left: 48,
          bottom: 40,
          zIndex: 5,
        }}
      >
        <Aku pose="standing" expression="happy" scale={1.06} />
        {/* Lengan melambai doodle di bahu Aku */}
        <svg
          width="90"
          height="90"
          viewBox="0 0 90 90"
          style={{
            position: "absolute",
            left: 132,
            top: 86,
            overflow: "visible",
            transformOrigin: "10px 60px",
            transform: `rotate(${waveAngle}deg)`,
            filter: `url(#${HAND_FILTER_ID})`,
          }}
        >
          <path
            d="M 8 62 Q 36 30 48 16"
            stroke={mvConfig.palette.graphite}
            strokeWidth={4.5}
            strokeLinecap="round"
            fill="none"
          />
          <circle
            cx="50"
            cy="14"
            r="8"
            fill="#FFFFFF"
            stroke={mvConfig.palette.graphite}
            strokeWidth={3.5}
          />
          {/* Garis gerak lambai */}
          <path
            d="M 64 12 Q 72 20 68 28 M 74 16 Q 82 24 76 34"
            stroke={mvConfig.palette.highlighterPink}
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Hati & Not Musik Berkilau Berdenyut Mengikuti ±90 BPM */}
      <div
        style={{
          position: "absolute",
          right: 75,
          top: 165,
          transform: `scale(${0.92 + beatPulse * 0.22}) rotate(10deg)`,
        }}
      >
        <MusicNote
          size={64}
          start={10}
          variant="double"
          color={mvConfig.palette.highlighterPink}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 65,
          bottom: 70,
          transform: `scale(${0.95 + beatPulse * 0.2})`,
        }}
      >
        <Heart size={58} start={18} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 85,
          top: 135,
          transform: `scale(${0.9 + beatPulse * 0.24}) rotate(${beatPulse * 12}deg)`,
        }}
      >
        <Star size={54} start={8} variant="sparkle" />
      </div>
    </div>
  );
};

/* ============================================================================
 * BAGIAN 2: Layar HP + ikon kamera + gelembung "unggah, dong :)" + senyum Nona
 * ============================================================================ */
const ChorusPart2Visual: React.FC<{ variant: 1 | 2; beatPulse: number }> = ({
  variant,
  beatPulse,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sekitar frame 120 (4 detik masuk ke Bagian 2 -> "Unggah fotomu..."), senyum Nona muncul di Story!
  const storySmileSpring = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: { damping: 12, stiffness: 110, mass: 0.7 },
  });

  const bubbleSpring = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.6 },
  });

  const hasUploadedSmile = frame > 95;

  return (
    <div style={{ position: "relative", width: 720, height: 620 }}>
      {/* Gelembung Ucapan "unggah, dong :)" di Kiri Atas */}
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 34 + Math.sin(frame * 0.12) * 5,
          transform: `scale(${bubbleSpring}) rotate(${variant === 2 ? -3 : 2}deg)`,
          zIndex: 6,
        }}
      >
        <div
          style={{
            position: "relative",
            backgroundColor: mvConfig.palette.highlighterYellow,
            border: `3.5px solid ${mvConfig.palette.graphite}`,
            borderRadius: "28px 28px 28px 6px",
            padding: "16px 28px",
            boxShadow: "4px 6px 0px rgba(51,54,61,0.18)",
          }}
        >
          <span
            style={{
              fontFamily: `${patrickHandFont}, cursive`,
              fontSize: 42,
              color: mvConfig.palette.penBlue,
            }}
          >
            unggah, dong :)
          </span>
        </div>
      </div>

      {/* Layar HP dengan Ikon Kamera -> Senyum Nona Muncul di Story */}
      <div
        style={{
          position: "absolute",
          left: "54%",
          top: 115,
          transform: `translateX(-50%) rotate(${variant === 2 ? 3 : -2}deg)`,
          zIndex: 4,
        }}
      >
        <Phone size={245} start={0}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {!hasUploadedSmile ? (
              /* Ikon Kamera Doodle sebelum foto diunggah */
              <svg
                width="115"
                height="96"
                viewBox="0 0 115 96"
                style={{
                  overflow: "visible",
                  transform: `scale(${0.96 + beatPulse * 0.08})`,
                  filter: `url(#${HAND_FILTER_ID})`,
                }}
              >
                <DrawPath
                  d="M 12 24 L 34 24 L 42 10 L 73 10 L 81 24 L 103 24 Q 110 24 110 32 L 110 82 Q 110 90 103 90 L 12 90 Q 5 90 5 82 L 5 32 Q 5 24 12 24 Z"
                  start={8}
                  duration={20}
                  color={mvConfig.palette.graphite}
                  fill={mvConfig.palette.mint}
                  strokeWidth={3.5}
                />
                <circle
                  cx="57.5"
                  cy="57"
                  r="21"
                  fill="#FFFFFF"
                  stroke={mvConfig.palette.graphite}
                  strokeWidth={3.5}
                />
                <circle
                  cx="57.5"
                  cy="57"
                  r="11"
                  fill={mvConfig.palette.highlighterPink}
                  opacity={0.7}
                />
                <circle cx="92" cy="37" r="4" fill={mvConfig.palette.highlighterYellow} />
              </svg>
            ) : (
              /* Setelah momen unggah: Senyum Nona muncul di bingkai Story! */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  transform: `scale(${storySmileSpring})`,
                }}
              >
                <div
                  style={{
                    width: 145,
                    height: 175,
                    borderRadius: 14,
                    backgroundColor: "rgba(255, 143, 168, 0.18)",
                    border: `3px solid ${mvConfig.palette.highlighterPink}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 6,
                  }}
                >
                  <NonaSilhouette variant="in-ring" scale={1} showSmile={true} />
                </div>
                <span
                  style={{
                    fontFamily: `${gaeguFont}, cursive`,
                    fontSize: 22,
                    color: mvConfig.palette.highlighterPink,
                    fontWeight: 700,
                  }}
                >
                  baru saja 1m ♥
                </span>
              </div>
            )}
          </div>
        </Phone>
      </div>

      {/* Aku Bersorak Bahagia di Bawah Kiri */}
      <div style={{ position: "absolute", left: 45, bottom: 25, zIndex: 5 }}>
        <Aku
          pose={hasUploadedSmile ? "standing" : "holdingPhone"}
          expression={hasUploadedSmile ? "happy" : "smile"}
          scale={1}
        />
      </div>

      {/* Bintang, Hati, & Not Berkilau Berdenyut ±90 BPM */}
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 90,
          transform: `scale(${0.92 + beatPulse * 0.25})`,
        }}
      >
        <Star size={56} start={12} variant="sparkle" />
      </div>
      <div
        style={{
          position: "absolute",
          right: 65,
          bottom: 95,
          transform: `scale(${0.95 + beatPulse * 0.18})`,
        }}
      >
        <Heart size={52} start={25} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 235,
          bottom: 50,
          transform: `scale(${0.94 + beatPulse * 0.16}) rotate(-8deg)`,
        }}
      >
        <MusicNote
          size={50}
          start={30}
          variant="single"
          color={mvConfig.palette.mint}
        />
      </div>
    </div>
  );
};

/* ============================================================================
 * ORNAMEN SUDUT BERDENYUT ±90 BPM
 * ============================================================================ */
const AmbientBeatSparkles: React.FC<{ beatPulse: number; variant: 1 | 2 }> = ({
  beatPulse,
  variant,
}) => {
  const pulseScale = 0.9 + beatPulse * 0.22;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}>
      <div
        style={{
          position: "absolute",
          top: 96,
          right: 96,
          transform: `scale(${pulseScale}) rotate(${variant === 2 ? -10 : 8}deg)`,
        }}
      >
        <MusicNote
          size={48}
          start={0}
          variant="double"
          color={mvConfig.palette.highlighterPink}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 96,
          left: 160,
          transform: `scale(${pulseScale})`,
        }}
      >
        <Star size={44} start={0} variant="sparkle" color={mvConfig.palette.mint} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 96,
          right: 120,
          transform: `scale(${pulseScale}) rotate(-12deg)`,
        }}
      >
        <Star
          size={42}
          start={0}
          variant="five-point"
          color={mvConfig.palette.highlighterYellow}
        />
      </div>
    </div>
  );
};

/* ============================================================================
 * STIKER TAMBAHAN KHUSUS VARIANT 2 (Chorus 2)
 * ============================================================================ */
const Variant2ExtraStickers: React.FC<{ beatPulse: number }> = ({ beatPulse }) => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 8 }}>
      {/* Sticky Note penyemangat kecil di pojok kanan atas (safe-area 96px) */}
      <div style={{ position: "absolute", right: 200, top: 96 }}>
        <StickyNote
          size={132}
          color={mvConfig.palette.mint}
          rotate={7}
          start={0}
          progress={1}
        >
          <span
            style={{
              fontFamily: `${gaeguFont}, cursive`,
              fontSize: 23,
              fontWeight: 700,
              color: mvConfig.palette.graphite,
            }}
          >
            cukup kulihat senyummu ♥
          </span>
        </StickyNote>
      </div>

      {/* Stiker Selotip Washi Pink di Sudut Bawah Kiri */}
      <div style={{ position: "absolute", left: 140, bottom: 112 }}>
        <WashiTape
          width={86}
          color={mvConfig.palette.highlighterPink}
          rotate={-18}
          progress={1}
        />
      </div>

      {/* Stiker Hati Kembar Kuning-Pink */}
      <div
        style={{
          position: "absolute",
          right: 96,
          top: "44%",
          transform: `scale(${0.92 + beatPulse * 0.16}) rotate(14deg)`,
        }}
      >
        <Heart size={44} start={0} color={mvConfig.palette.highlighterPink} />
      </div>
    </div>
  );
};
