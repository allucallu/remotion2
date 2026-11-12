import React from "react";
import { Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";
import { mvConfig } from "../config";
import type { Line, Section } from "../data/buildTimeline";
import { HandFilter, HAND_FILTER_ID } from "../components/HandFilter";
import { PaperBackground } from "../components/PaperBackground";
import { LyricBlock } from "../components/LyricBlock";
import { Aku, NonaSilhouette } from "../components/Characters";
import { Heart, MusicNote, Phone, Star, StoryRing, WashiTape } from "../components/Doodles";
import { SubSceneTransition } from "./SubSceneTransition";

const { fontFamily: gaeguFont } = loadGaegu();
const { fontFamily: patrickHandFont } = loadPatrickHand();

interface FinalChorusSceneProps {
  section: Section;
}

/**
 * Scene 8: Final Chorus – Emotional Acoustic Strumming (3:28.72 - 4:00.32)
 * Kembali ke siang hangat (mode='golden'). Gerak lebih emosional dan lembut dibanding Chorus 1,
 * kupu-kupu dan hati melayang, senyum Nona di layar HP diperbesar, dan Aku menepuk kepala sambil tertawa.
 */
export const FinalChorusScene: React.FC<FinalChorusSceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Gerak emosional lebih lambat (0.5x laju Chorus 1)
  const warmBreath = (Math.sin(frame * 0.05) + 1) * 0.5;

  // Bagi 8 baris menjadi 2 sub-scene (masing-masing 4 baris)
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
      lyricAlign: "left",
    });

    if (secondChunk.length > 0) {
      groups.push({
        lines: secondChunk,
        startSec: secondChunk[0].start,
        endSec: section.end,
        lyricAlign: "right",
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
      <HandFilter frame={frame} scale={2.5} />
      <PaperBackground mode="golden" />

      {/* Kupu-kupu & Hati Hangat Melayang Lambat di Latar */}
      <FloatingButterfly x={185} y={135} delay={0} color={mvConfig.palette.highlighterPink} scale={0.95} />
      <FloatingButterfly x={1650} y={155} delay={24} color={mvConfig.palette.highlighterYellow} scale={1.05} />
      <FloatingButterfly x={1690} y={840} delay={42} color={mvConfig.palette.mint} scale={0.9} />

      <div
        style={{
          position: "absolute",
          left: 165,
          bottom: 96 + warmBreath * 8,
          opacity: 0.72,
          zIndex: 3,
        }}
      >
        <Heart size={42} start={0} color={mvConfig.palette.highlighterPink} />
      </div>

      {/* Label Bab Golden Hour (safe-area 96px) */}
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
          width={98}
          color={mvConfig.palette.highlighterYellow}
          rotate={-2}
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
          bab 7: tetaplah tersenyum, nona
        </span>
      </div>

      {groups.map((grp, gIdx) => {
        const isLastSub = gIdx === groups.length - 1;
        const from = Math.max(0, Math.round((grp.startSec - section.start) * fps));
        const durationInFrames =
          Math.max(1, Math.round((grp.endSec - grp.startSec) * fps)) +
          (isLastSub ? 12 : 0);
        const isLyricLeft = grp.lyricAlign === "left";

        return (
          <Sequence
            key={`final-sub-${gIdx}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`FinalChorus-Part-${gIdx + 1}`}
          >
            <SubSceneTransition
              durationInFrames={durationInFrames}
              direction={isLyricLeft ? "right" : "left"}
              disableExit={isLastSub}
            >
              {/* Blok Lirik Karaoke Hangat (safe-area 96px) */}
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
                  mode="golden"
                  fontSize={62}
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
                  height: 640,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 4,
                }}
              >
                {gIdx === 0 && <FinalPart1WarmPhoneSmile />}
                {gIdx === 1 && <FinalPart2PatHeadAndLaugh partStartSec={grp.startSec} />}
              </div>
            </SubSceneTransition>
          </Sequence>
        );
      })}
    </div>
  );
};

/* ============================================================================
 * BAGIAN 1: Senyum Nona di layar HP diperbesar, Aku tersenyum tulus, hati & kupu-kupu
 * ============================================================================ */
const FinalPart1WarmPhoneSmile: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomPhone = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.9 },
  });

  const slowFloat = Math.sin(frame * 0.05) * 6;

  return (
    <div style={{ position: "relative", width: 700, height: 600 }}>
      {/* Layar HP Diperbesar Menampilkan Senyum Nona yang Hangat */}
      <div
        style={{
          position: "absolute",
          right: 75,
          top: 60 + slowFloat * 0.5,
          transform: `scale(${0.95 + zoomPhone * 0.14}) rotate(2deg)`,
          zIndex: 3,
        }}
      >
        <Phone size={240} start={0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              transform: "scale(1.12)",
            }}
          >
            <StoryRing size={146} start={8}>
              <NonaSilhouette variant="in-ring" scale={1.06} showSmile={true} />
            </StoryRing>
            <span
              style={{
                fontFamily: `${patrickHandFont}, cursive`,
                fontSize: 26,
                color: mvConfig.palette.highlighterPink,
              }}
            >
              senyummu ♥
            </span>
          </div>
        </Phone>
      </div>

      {/* Aku Tersenyum Tulus di Sebelah Kiri Bawah */}
      <div style={{ position: "absolute", left: 65, bottom: 38, zIndex: 5 }}>
        <Aku pose="standing" expression="happy" scale={1.08} />
      </div>

      {/* Kupu-kupu & Hati Kecil Melayang di Tengah Scene */}
      <FloatingButterfly x={290} y={95} delay={10} color={mvConfig.palette.highlighterPink} scale={1.15} />
      <div style={{ position: "absolute", left: 235, top: 230 - slowFloat }}>
        <Heart size={52} start={18} />
      </div>
      <div style={{ position: "absolute", right: 58, bottom: 75 + slowFloat }}>
        <Star size={46} start={26} variant="sparkle" />
      </div>
    </div>
  );
};

/* ============================================================================
 * BAGIAN 2: "Dasar aku, ada-ada saja tingkahku" -> Aku menepuk kepala sambil tertawa
 * ============================================================================ */
const FinalPart2PatHeadAndLaugh: React.FC<{ partStartSec: number }> = ({
  partStartSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Dasar aku, ada-ada saja tingkahku" dimulai di 236.48s
  const patStartFrame = Math.max(120, Math.round((236.48 - partStartSec) * fps));
  const isPatting = frame >= patStartFrame;

  const patSpring = spring({
    frame: Math.max(0, frame - patStartFrame),
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.7 },
  });

  // Gerakan menepuk puncak kepala pelan 2-3 kali sambil tertawa
  const patBounce = isPatting ? Math.abs(Math.sin((frame - patStartFrame) * 0.28)) * 10 : 0;
  const laughHeadBounce = isPatting ? Math.sin((frame - patStartFrame) * 0.35) * 4 : 0;

  return (
    <div style={{ position: "relative", width: 700, height: 600 }}>
      {/* Bingkai Senyum Nona Kecil di Latar Atas */}
      <div
        style={{
          position: "absolute",
          right: 75,
          top: 68 + Math.sin(frame * 0.05) * 5,
          opacity: 0.9,
        }}
      >
        <StoryRing size={156} start={0}>
          <NonaSilhouette variant="in-ring" scale={0.98} showSmile={true} />
        </StoryRing>
      </div>

      {/* Karakter Aku: Tersenyum Bahagia, Lalu Menepuk Kepala Sendiri Sambil Tertawa */}
      <div
        style={{
          position: "absolute",
          left: 165,
          bottom: 45,
          transform: `translateY(${laughHeadBounce * 0.4}px)`,
        }}
      >
        <Aku pose="standing" expression="happy" scale={1.12} />

        {/* Tangan Menepuk Kepala Sendiri Saat Lirik "Dasar aku, ada-ada saja tingkahku" */}
        {isPatting && (
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{
              position: "absolute",
              left: 72,
              top: -34 + patBounce,
              opacity: patSpring,
              overflow: "visible",
              filter: `url(#${HAND_FILTER_ID})`,
            }}
          >
            {/* Lengan terangkat ke atas kepala */}
            <path
              d="M 88 122 Q 112 72 68 38"
              stroke={mvConfig.palette.graphite}
              strokeWidth={4.5}
              strokeLinecap="round"
              fill="none"
            />
            {/* Telapak tangan menepuk puncak kepala */}
            <ellipse
              cx="60"
              cy="38"
              rx="14"
              ry="8"
              transform="rotate(-12 60 38)"
              fill="#FFFFFF"
              stroke={mvConfig.palette.graphite}
              strokeWidth={3.5}
            />
            {/* Efek tepuk kecil ("pok!") */}
            <path
              d="M 38 24 L 44 30 M 60 16 L 60 24 M 80 24 L 74 30"
              stroke={mvConfig.palette.highlighterPink}
              strokeWidth={3}
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* Balon Tawa Hangat saat "Dasar aku..." */}
      {isPatting && (
        <div
          style={{
            position: "absolute",
            left: 55,
            top: 98,
            transform: `scale(${patSpring}) rotate(-4deg)`,
          }}
        >
          <div
            style={{
              backgroundColor: mvConfig.palette.highlighterYellow,
              border: `3px solid ${mvConfig.palette.graphite}`,
              borderRadius: "24px 24px 6px 24px",
              padding: "10px 22px",
              boxShadow: "3px 5px 0px rgba(51,54,61,0.14)",
            }}
          >
            <span
              style={{
                fontFamily: `${patrickHandFont}, cursive`,
                fontSize: 36,
                color: mvConfig.palette.penBlue,
              }}
            >
              haha, dasar aku :D
            </span>
          </div>
        </div>
      )}

      {/* Kupu-Kupu & Not Hangat */}
      <FloatingButterfly x={460} y={295} delay={16} color={mvConfig.palette.highlighterYellow} scale={1} />
      <div style={{ position: "absolute", left: 60, bottom: 95 }}>
        <Heart size={46} start={10} />
      </div>
      <div style={{ position: "absolute", right: 115, bottom: 75 }}>
        <MusicNote
          size={48}
          start={25}
          variant="double"
          color={mvConfig.palette.highlighterPink}
        />
      </div>
    </div>
  );
};

/* ============================================================================
 * DOODLE KUPU-KUPU MELAYANG HALUS
 * ============================================================================ */
const FloatingButterfly: React.FC<{
  x: number;
  y: number;
  delay: number;
  color: string;
  scale?: number;
}> = ({ x, y, delay, color, scale = 1 }) => {
  const frame = useCurrentFrame();

  // Kepak sayap lembut (skala horizontal sayap) & gerak melayang pelan
  const t = frame * 0.06 + delay;
  const wingFlap = 0.55 + Math.abs(Math.sin(frame * 0.22 + delay)) * 0.45;
  const driftX = Math.sin(t * 0.7) * 14;
  const driftY = Math.cos(t) * 10;

  return (
    <div
      style={{
        position: "absolute",
        left: x + driftX,
        top: y + driftY,
        transform: `scale(${scale}) rotate(${Math.sin(t) * 8}deg)`,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <svg
        width="64"
        height="52"
        viewBox="0 0 64 52"
        style={{ overflow: "visible", filter: `url(#${HAND_FILTER_ID})` }}
      >
        <g transform={`translate(32, 26) scale(${wingFlap}, 1) translate(-32, -26)`}>
          {/* Sayap Kiri */}
          <path
            d="M 32 24 C 18 6, 4 12, 8 26 C 12 36, 24 32, 32 28 Z"
            fill={color}
            opacity={0.78}
            stroke={mvConfig.palette.graphite}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <path
            d="M 32 28 C 20 32, 12 42, 20 46 C 28 48, 32 36, 32 28 Z"
            fill={color}
            opacity={0.62}
            stroke={mvConfig.palette.graphite}
            strokeWidth={2.3}
            strokeLinejoin="round"
          />
          {/* Sayap Kanan */}
          <path
            d="M 32 24 C 46 6, 60 12, 56 26 C 52 36, 40 32, 32 28 Z"
            fill={color}
            opacity={0.78}
            stroke={mvConfig.palette.graphite}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <path
            d="M 32 28 C 44 32, 52 42, 44 46 C 36 48, 32 36, 32 28 Z"
            fill={color}
            opacity={0.62}
            stroke={mvConfig.palette.graphite}
            strokeWidth={2.3}
            strokeLinejoin="round"
          />
        </g>
        {/* Tubuh & Antena Kupu-Kupu */}
        <path
          d="M 32 16 L 32 38 M 32 16 Q 27 8 24 10 M 32 16 Q 37 8 40 10"
          stroke={mvConfig.palette.graphite}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

