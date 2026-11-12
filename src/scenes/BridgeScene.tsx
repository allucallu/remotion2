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
import { Cup, Heart, Lamp, MusicNote, Star, WashiTape } from "../components/Doodles";
import { SubSceneTransition } from "./SubSceneTransition";

const { fontFamily: gaeguFont } = loadGaegu();
const { fontFamily: patrickHandFont } = loadPatrickHand();

interface BridgeSceneProps {
  section: Section;
}

/**
 * Scene 7: Bridge – Soft Acoustic Fingerpicking (2:55.64 - 3:28.72)
 * Mode malam: PaperBackground mode='night', tinta kapur putih, lampu meja menyala di pojok.
 * Tempo visual lambat dan intim.
 */
export const BridgeScene: React.FC<BridgeSceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Kelompokkan menjadi 2 baris per sub-scene (total 4 kelompok), bergantian kiri/kanan
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

  // Kedipan bintang malam yang sangat pelan
  const nightTwinkle = (Math.sin(frame * 0.04) + 1) * 0.5;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
      }}
    >
      <HandFilter frame={frame} scale={2.2} />
      <PaperBackground mode="night" />

      {/* Lampu Meja Menyala Hangat di Pojok Kanan Atas (safe-area 96px) */}
      <div
        style={{
          position: "absolute",
          right: 96,
          top: 96,
          zIndex: 8,
          opacity: 0.92 + nightTwinkle * 0.08,
        }}
      >
        <Lamp size={120} start={0} mode="night" lit={true} rotate={-4} />
      </div>

      {/* Bintang-bintang Malam Tenang di Langit Kertas */}
      <div
        style={{
          position: "absolute",
          left: 165,
          bottom: 96,
          opacity: 0.45 + nightTwinkle * 0.35,
          zIndex: 3,
        }}
      >
        <Star size={34} start={0} mode="night" variant="sparkle" />
      </div>
      <div
        style={{
          position: "absolute",
          right: 265,
          top: 96,
          opacity: 0.35 + (1 - nightTwinkle) * 0.4,
          zIndex: 3,
        }}
      >
        <Star size={28} start={0} mode="night" variant="five-point" />
      </div>

      {/* Label Bab Buku Harian Malam (safe-area 96px) */}
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
          color="rgba(154, 219, 197, 0.55)"
          rotate={-2}
          progress={1}
        />
        <span
          style={{
            fontFamily: `${gaeguFont}, cursive`,
            fontSize: 28,
            color: mvConfig.palette.nightChalk,
            opacity: 0.78,
          }}
        >
          bab 6: petikan malam & andai suatu hari
        </span>
      </div>

      {/* Render 4 Sub-Scene Malam Lambat */}
      {groups.map((grp, gIdx) => {
        const isLastSub = gIdx === groups.length - 1;
        const from = Math.max(0, Math.round((grp.startSec - section.start) * fps));
        const durationInFrames =
          Math.max(1, Math.round((grp.endSec - grp.startSec) * fps)) +
          (isLastSub ? 12 : 0);
        const isLyricLeft = grp.lyricAlign === "left";

        return (
          <Sequence
            key={`bridge-sub-${gIdx}`}
            from={from}
            durationInFrames={durationInFrames}
            name={`Bridge-Sub-${gIdx + 1}`}
          >
            <SubSceneTransition
              durationInFrames={durationInFrames}
              direction={isLyricLeft ? "right" : "left"}
              disableExit={isLastSub}
            >
              {/* Blok Lirik Kapur Putih (safe-area 96px) */}
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
                  mode="night"
                  fontSize={68}
                />
              </div>

              {/* Blok Ilustrasi Malam */}
              <div
                style={{
                  position: "absolute",
                  top: "52%",
                  transform: "translateY(-50%)",
                  right: isLyricLeft ? 96 : undefined,
                  left: isLyricLeft ? undefined : 150,
                  width: 720,
                  height: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 4,
                }}
              >
                {gIdx === 0 && <BridgeSub1GuitarNight sleepy={false} />}
                {gIdx === 1 && <BridgeSub1GuitarNight sleepy={true} />}
                {gIdx === 2 && <BridgeSub3CupsAndBubble />}
                {gIdx === 3 && <BridgeSub4TwoSilhouettesAndStars />}
              </div>
            </SubSceneTransition>
          </Sequence>
        );
      })}
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 1 & 2: Aku duduk bergitar di malam hari (fingerpicking jari halus)
 * ============================================================================ */
const BridgeSub1GuitarNight: React.FC<{ sleepy: boolean }> = ({ sleepy }) => {
  const frame = useCurrentFrame();

  // Gerak fingerpicking lambat & halus di senar gitar
  const pluckOffset = Math.sin(frame * 0.22) * 3.5;
  const noteFloat = Math.sin(frame * 0.045) * 6;

  return (
    <div style={{ position: "relative", width: 640, height: 520 }}>
      {/* Meja Malam Tempat Gitar Dimainkan */}
      <svg
        width="540"
        height="80"
        viewBox="0 0 540 80"
        style={{
          position: "absolute",
          left: 50,
          bottom: 58,
          filter: `url(#${HAND_FILTER_ID})`,
        }}
      >
        <DrawPath
          d="M 40 30 L 500 32"
          start={0}
          duration={20}
          color={mvConfig.palette.nightChalk}
          strokeWidth={3.5}
        />
      </svg>

      {/* Karakter Aku Duduk Bergitar */}
      <div style={{ position: "absolute", left: 195, bottom: 82 }}>
        <Aku
          pose="holdingGuitar"
          expression={sleepy ? "smile" : "neutral"}
          mode="night"
          scale={1.08}
        />

        {/* Overlay Jari Memetik Senar (Fingerpicking Halus) */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          style={{
            position: "absolute",
            left: 100,
            top: 132,
            overflow: "visible",
            filter: `url(#${HAND_FILTER_ID})`,
          }}
        >
          {/* Gerakan halus dua jari petik di atas lubang suara */}
          <path
            d={`M 16 ${26 + pluckOffset} L 22 ${14 + pluckOffset}`}
            stroke={mvConfig.palette.highlighterYellow}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={`M 26 ${28 - pluckOffset * 0.8} L 31 ${16 - pluckOffset * 0.8}`}
            stroke={mvConfig.palette.highlighterYellow}
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Riak petikan senar lembut */}
          <circle
            cx="24"
            cy="22"
            r={12 + Math.abs(pluckOffset)}
            fill="none"
            stroke={mvConfig.palette.mint}
            strokeWidth={1.5}
            opacity={0.45}
          />
        </svg>
      </div>

      {/* Not Musik Melayang Pelan di Malam Hari */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 100 + noteFloat,
          opacity: 0.78,
        }}
      >
        <MusicNote
          size={44}
          start={10}
          mode="night"
          variant="single"
          color={mvConfig.palette.mint}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 115,
          top: 130 - noteFloat,
          opacity: 0.72,
        }}
      >
        <MusicNote
          size={48}
          start={26}
          mode="night"
          variant="double"
          color={mvConfig.palette.highlighterYellow}
        />
      </div>
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 3: "Jika suatu hari kita bicara..." -> Dua cangkir + gelembung kosong -> terisi
 * ============================================================================ */
const BridgeSub3CupsAndBubble: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubbleSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.8 },
  });

  // Awalnya gelembung percakapan kosong (frames 0..85), lalu terisi pelan (frames 85..140)
  const fillProgress = interpolate(frame, [78, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "relative", width: 660, height: 520 }}>
      {/* Meja Malam */}
      <svg
        width="520"
        height="40"
        viewBox="0 0 520 40"
        style={{
          position: "absolute",
          left: 70,
          bottom: 105,
          filter: `url(#${HAND_FILTER_ID})`,
        }}
      >
        <DrawPath
          d="M 20 20 L 500 22"
          start={0}
          duration={20}
          color={mvConfig.palette.nightChalk}
          strokeWidth={3.5}
        />
      </svg>

      {/* Dua Cangkir Hangat Berdampingan */}
      <div style={{ position: "absolute", left: 170, bottom: 118 }}>
        <Cup size={115} start={4} mode="night" />
      </div>
      <div style={{ position: "absolute", right: 170, bottom: 118 }}>
        <Cup size={115} start={16} mode="night" rotate={-3} />
      </div>

      {/* Gelembung Percakapan: Kosong di Awal, Lalu Terisi Pelan */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 90,
          transform: `translateX(-50%) scale(${bubbleSpring})`,
        }}
      >
        <div
          style={{
            minWidth: 280,
            minHeight: 88,
            border: `3px solid ${mvConfig.palette.nightChalk}`,
            borderRadius: "28px 28px 28px 8px",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {fillProgress < 0.2 ? (
            <span
              style={{
                fontFamily: `${gaeguFont}, cursive`,
                fontSize: 30,
                color: mvConfig.palette.nightChalk,
                opacity: 0.45,
              }}
            >
              ...
            </span>
          ) : (
            <div
              style={{
                opacity: fillProgress,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: `${patrickHandFont}, cursive`,
                  fontSize: 34,
                  color: mvConfig.palette.highlighterYellow,
                }}
              >
                “halo, bagaimana harimu?”
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", left: 110, top: 82 }}>
        <Star size={38} start={35} mode="night" variant="sparkle" />
      </div>
    </div>
  );
};

/* ============================================================================
 * SUB-SCENE 4: "tentang kita berdua" -> Dua siluet berdampingan muncul + bintang bertambah
 * ============================================================================ */
const BridgeSub4TwoSilhouettesAndStars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dua siluet muncul pelan saat menuju baris "dan siapa tahu, tentang kita berdua"
  const duoReveal = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 18, stiffness: 75, mass: 1 },
  });

  // Bintang kecil bertambah bertahap di sekeliling
  const extraStars = [
    { x: 95, y: 70, size: 32, start: 18 },
    { x: 245, y: 38, size: 42, start: 38 },
    { x: 465, y: 55, size: 36, start: 60 },
    { x: 540, y: 155, size: 34, start: 82 },
    { x: 75, y: 205, size: 28, start: 96 },
    { x: 350, y: 28, size: 30, start: 112 },
  ];

  return (
    <div style={{ position: "relative", width: 660, height: 520 }}>
      {/* Dua Cangkir Hangat Tetap Menemani di Bawah */}
      <div style={{ position: "absolute", left: 75, bottom: 48, opacity: 0.72 }}>
        <Cup size={78} start={0} mode="night" />
      </div>
      <div style={{ position: "absolute", right: 75, bottom: 48, opacity: 0.72 }}>
        <Cup size={78} start={0} mode="night" />
      </div>

      {/* Dua Siluet Berdampingan Pelan-Pelan Muncul */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 70,
          transform: `translateX(-50%) scale(${0.92 + duoReveal * 0.08})`,
          opacity: duoReveal,
          display: "flex",
          alignItems: "flex-end",
          gap: 30,
        }}
      >
        <Aku pose="standing" expression="smile" mode="night" scale={0.96} />
        <div style={{ marginBottom: 150 }}>
          <Heart size={44} start={65} color={mvConfig.palette.highlighterPink} />
        </div>
        <NonaSilhouette variant="standing" mode="night" scale={0.98} showSmile={true} />
      </div>

      {/* Bintang-Bintang Kecil Bertambah di Langit Malam */}
      {extraStars.map((st, idx) => (
        <div
          key={`night-star-${idx}`}
          style={{
            position: "absolute",
            left: st.x,
            top: st.y + Math.sin(frame * 0.05 + idx) * 4,
          }}
        >
          <Star
            size={st.size}
            start={st.start}
            mode="night"
            variant={idx % 2 === 0 ? "sparkle" : "five-point"}
          />
        </div>
      ))}
    </div>
  );
};

