import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BoilFilter, BOIL_FILTER_ID } from "../components/BoilFilter";
import {
  Heart,
  MusicNote,
  QuestionMark,
  Sparkle,
  Star,
} from "../components/Doodles";
import { Hatching } from "../components/Hatching";
import { LetterTiles, LetterTilesMode } from "../components/LetterTiles";
import { LyricBlock } from "../components/LyricBlock";
import { ScribbleReveal } from "../components/ScribbleReveal";
import { BackgroundMode, SketchBackground } from "../components/SketchBackground";
import { Sprite } from "../components/Sprite";
import { mvConfig } from "../config";
import type { Section } from "../data/buildTimeline";

export interface ChorusSceneProps {
  section: Section;
  variant?: 1 | 2 | 3;
}

/**
 * Siluet Bayangan Gelap Ray yang Menahan Tangan Ray Sendiri
 * ("Why am I in my own way?")
 */
const ShadowRayRestraint: React.FC<{
  progress: number;
  frame: number;
}> = ({ progress, frame }) => {
  const pullShake = Math.sin(frame * 0.55) * 2.5;
  const opacity = interpolate(progress, [0, 1], [0, 0.52], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const offsetX = interpolate(progress, [0, 1], [-45, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={380}
      height={420}
      viewBox="0 0 380 420"
      style={{
        position: "absolute",
        left: 25 + offsetX + pullShake,
        top: 120,
        opacity,
        filter: `url(#${BOIL_FILTER_ID})`,
        pointerEvents: "none",
      }}
    >
      {/* Siluet Kepala & Jambul Chibi Bayangan Ray */}
      <path
        d="M 95 55 C 60 55, 42 85, 45 125 C 48 160, 75 182, 110 182 C 145 182, 170 158, 172 122 C 174 82, 145 55, 95 55 Z"
        fill={mvConfig.colors.inkDark}
      />
      {/* Jambul bayangan */}
      <path
        d="M 105 56 C 118 30, 142 32, 132 58"
        fill="none"
        stroke={mvConfig.colors.inkDark}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Siluet Tubuh Hoodie Bayangan */}
      <path
        d="M 65 182 C 52 225, 50 295, 58 355 L 152 355 C 158 295, 155 225, 140 182 Z"
        fill={mvConfig.colors.inkDark}
      />
      {/* Lengan Bayangan Memanjang Menahan Pergelangan Tangan Ray di Depannya */}
      <path
        d="M 142 215 C 195 210, 245 222, 292 238"
        fill="none"
        stroke={mvConfig.colors.inkDark}
        strokeWidth={18}
        strokeLinecap="round"
      />
      {/* Cengkeraman Tangan Bayangan */}
      <circle cx={296} cy={239} r={14} fill={mvConfig.colors.pencilOrange} />
      {/* Garis tegangan tarik-menarik */}
      <path
        d="M 275 215 L 288 202 M 305 218 L 320 206 M 292 262 L 302 276"
        stroke={mvConfig.colors.pencilOrange}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Ledakan Partikel Bintang & Not Musik saat Ad-lib ("whoa oh, yeah")
 */
const AdlibBurst: React.FC<{
  burstFrame: number;
  fps: number;
}> = ({ burstFrame, fps }) => {
  const burstSpring = spring({
    frame: burstFrame,
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  const items = [
    { angle: -145, dist: 190, type: "star", size: 54 },
    { angle: -105, dist: 220, type: "note", size: 52 },
    { angle: -65, dist: 210, type: "sparkle", size: 48 },
    { angle: -25, dist: 195, type: "note", size: 50 },
    { angle: 20, dist: 185, type: "star", size: 46 },
    { angle: 155, dist: 175, type: "sparkle", size: 44 },
  ] as const;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "42%",
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      {items.map((item, idx) => {
        const rad = (item.angle * Math.PI) / 180;
        const r = interpolate(burstSpring, [0, 1], [20, item.dist]);
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;
        const opacity = interpolate(
          burstFrame,
          [0, 10, 40, 65],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              transform: `translate(${x}px, ${y}px) rotate(${
                burstFrame * (idx % 2 === 0 ? 2 : -2)
              }deg)`,
              opacity,
            }}
          >
            {item.type === "star" && (
              <Star
                size={item.size}
                progress={burstSpring}
                color={mvConfig.colors.pencilOrange}
              />
            )}
            {item.type === "note" && (
              <MusicNote
                size={item.size}
                progress={burstSpring}
                color={mvConfig.colors.inkDark}
              />
            )}
            {item.type === "sparkle" && (
              <Sparkle size={item.size} progress={burstSpring} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ChorusScene: React.FC<ChorusSceneProps> = ({
  section,
  variant: propVariant,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const variant: 1 | 2 | 3 =
    propVariant ??
    (section.index === 3 ? 3 : section.index === 2 ? 2 : 1);

  const currentSec = section.start + frame / fps;
  const lines = section.lines;

  // Pembagian 8 baris Chorus menjadi 4 sub-scene (masing-masing 2 baris):
  // Sub 0 (Baris 0-1): "If all it is it eight letters / Why is it so hard to say?"
  // Sub 1 (Baris 2-3): "If all it is it eight letters / Why am I in my own way?" (Bayangan menahan tangan Ray)
  // Sub 2 (Baris 4-5): "Why do I pull you close / And then ask you for space" (Tarik-ulur)
  // Sub 3 (Baris 6-7): "If all it is it eight letters / Why is it so hard to say?" (Push-in kamera + Ad-lib)
  const sub1Start = lines[2]?.start ?? section.start + 5;
  const sub2Start = lines[4]?.start ?? section.start + 10.5;
  const sub3Start = lines[6]?.start ?? section.start + 15.5;

  const subSceneIndex =
    currentSec < sub1Start
      ? 0
      : currentSec < sub2Start
      ? 1
      : currentSec < sub3Start
      ? 2
      : 3;

  const activeSubLines = lines.slice(subSceneIndex * 2, subSceneIndex * 2 + 2);

  // Berganti posisi lirik antar sub-scene agar seimbang dengan ilustrasi
  const lyricAlign =
    subSceneIndex === 0
      ? "right"
      : subSceneIndex === 1
      ? "left"
      : subSceneIndex === 2
      ? "bottom"
      : "right";

  // Konfigurasi LetterTiles sesuai variant:
  // Variant 1 = 'shaking' filled 0
  // Variant 2 = 'struggle' filled 5
  // Variant 3 = 'shaking' filled 7
  const tileConfig: { mode: LetterTilesMode; filled: number } =
    variant === 1
      ? { mode: "shaking", filled: 0 }
      : variant === 2
      ? { mode: "struggle", filled: 5 }
      : { mode: "shaking", filled: 7 };

  // Mode latar belakang: Variant 3 memakai 'golden' (overlay hangat)
  const bgMode: BackgroundMode = variant === 3 ? "golden" : "day";
  const bgName = variant === 3 ? "bg_golden" : "bg_room_day";

  // Deteksi waktu baris "pull you close" (Baris 4) dan "ask you for space" (Baris 5)
  const pullLine = lines[4];
  const spaceLine = lines[5];
  const spaceStartSec =
    spaceLine?.start ?? (pullLine ? pullLine.end : sub2Start + 2.5);

  const isSpacePhase =
    subSceneIndex === 2 && currentSec >= spaceStartSec - 0.05;

  const pullFrames = Math.max(0, Math.round((currentSec - sub2Start) * fps));
  const spaceFrames = Math.max(
    0,
    Math.round((currentSec - spaceStartSec) * fps)
  );

  const pullSpring = spring({
    frame: pullFrames,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const spaceSpring = spring({
    frame: spaceFrames,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  // Deteksi Ad-lib (misal "(whoa oh, yeah)" di Chorus 2) untuk ledakan bintang/not & camera shake
  const firstAdlibWord = lines
    .flatMap((l) => l.words)
    .find((w) => w.isAdlib);
  const adlibStartSec = firstAdlibWord?.start ?? null;
  const isAdlibActive =
    adlibStartSec !== null &&
    currentSec >= adlibStartSec - 0.05 &&
    currentSec <= adlibStartSec + 2.2;
  const adlibFrames =
    adlibStartSec !== null
      ? Math.max(0, Math.round((currentSec - adlibStartSec) * fps))
      : 0;

  // Kamera: Zoom/pan pelan 3–5% di Sub 0..2, dan Push-In 1 -> 1.06 pada pengulangan terakhir (Sub 3)
  const subStartSec =
    subSceneIndex === 0
      ? section.start
      : subSceneIndex === 1
      ? sub1Start
      : subSceneIndex === 2
      ? sub2Start
      : sub3Start;
  const subEndSec =
    subSceneIndex === 0
      ? sub1Start
      : subSceneIndex === 1
      ? sub2Start
      : subSceneIndex === 2
      ? sub3Start
      : section.end;

  const subLocalFrame = Math.max(0, Math.round((currentSec - subStartSec) * fps));
  const subDurationFrames = Math.max(
    30,
    Math.round((subEndSec - subStartSec) * fps)
  );

  const baseZoom =
    subSceneIndex === 3
      ? interpolate(subLocalFrame, [0, subDurationFrames], [1.0, 1.06], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(subLocalFrame, [0, subDurationFrames], [1.0, 1.038], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  // Camera shake halus saat ad-lib aktif
  const shakeX = isAdlibActive ? Math.sin(frame * 1.7) * 4 : 0;
  const shakeY = isAdlibActive ? Math.cos(frame * 2.1) * 3.5 : 0;

  const stageLeft =
    lyricAlign === "right" ? 110 : lyricAlign === "left" ? 940 : 480;

  return (
    <SketchBackground mode={bgMode} bgName={bgName}>
      <BoilFilter scale={3} />

      {/* 1. Motif 8 Kotak Huruf di Atas Layar */}
      <div
        style={{
          position: "absolute",
          top: mvConfig.safeArea * 0.55,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 25,
        }}
      >
        <LetterTiles
          filled={tileConfig.filled}
          mode={tileConfig.mode}
          theme="day"
        />
      </div>

      {/* 2. Kontainer Kamera Utama (Push-in + Shake) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${baseZoom}) translate(${shakeX}px, ${shakeY}px)`,
          transformOrigin: "50% 45%",
        }}
      >
        {/* Variasi Visual Variant 2: Aksen Arsiran Pensil Oranye Lebih Banyak */}
        {variant === 2 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 60,
                top: 110,
                opacity: 0.32,
                pointerEvents: "none",
              }}
            >
              <Hatching
                width={260}
                height={180}
                angle={42}
                spacing={14}
                progress={1}
                color={mvConfig.colors.pencilOrange}
                strokeWidth={2}
              />
            </div>
            <div
              style={{
                position: "absolute",
                right: 70,
                bottom: 120,
                opacity: 0.32,
                pointerEvents: "none",
              }}
            >
              <Hatching
                width={280}
                height={190}
                angle={-42}
                spacing={14}
                progress={1}
                color={mvConfig.colors.pencilOrange}
                strokeWidth={2}
              />
            </div>
          </>
        )}

        {/* Panggung Ilustrasi Per Sub-scene */}
        <div
          style={{
            position: "absolute",
            left: stageLeft,
            top: 165,
            width: 860,
            height: 620,
          }}
        >
          <ScribbleReveal
            key={`chorus-${variant}-sub-${subSceneIndex}`}
            width={860}
            height={620}
            strokeWidth={70}
            start={0}
            duration={16}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {/* SUB-SCENE 0 (Baris 0-1): Keraguan Mengucapkan 8 Huruf */}
              {subSceneIndex === 0 && (
                <>
                  <Sprite
                    name={variant === 3 ? "ray_smile" : "ray_shy"}
                    x={90}
                    y={150}
                    width={280}
                    height={380}
                  />
                  <Sprite
                    name="sol_curious"
                    x={460}
                    y={155}
                    width={275}
                    height={375}
                    flip={true}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: 245,
                      top: 65,
                      display: "flex",
                      gap: 16,
                    }}
                  >
                    <QuestionMark
                      size={62}
                      progress={interpolate(subLocalFrame, [4, 28], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}
                      color={mvConfig.colors.pencilOrange}
                    />
                    <QuestionMark
                      size={50}
                      progress={interpolate(subLocalFrame, [12, 36], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}
                      color={mvConfig.colors.inkDark}
                    />
                  </div>
                </>
              )}

              {/* SUB-SCENE 1 (Baris 2-3): "Why am I in my own way?" -> Bayangan Ray Menahan Tangan Ray */}
              {subSceneIndex === 1 && (
                <>
                  {/* Bayangan gelap Ray di belakang yang menahan tangan Ray */}
                  <ShadowRayRestraint
                    progress={interpolate(subLocalFrame, [4, 30], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })}
                    frame={frame}
                  />

                  {/* Ray mencoba mengulurkan tangan ke arah Sol */}
                  <Sprite
                    name="ray_reachout"
                    x={190}
                    y={145}
                    width={285}
                    height={385}
                  />

                  {/* Sol berdiri menunggu */}
                  <Sprite
                    name="sol_neutral"
                    x={525}
                    y={150}
                    width={275}
                    height={375}
                    flip={true}
                  />
                </>
              )}

              {/* SUB-SCENE 2 (Baris 4-5): Tarik-Ulur ("Why do I pull you close / And then ask you for space") */}
              {subSceneIndex === 2 && (
                <>
                  {!isSpacePhase ? (
                    /* Fase 1: Tarik Mendekat (duo_pull_close dengan spring mendekat) */
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        transform: `translateX(${interpolate(
                          pullSpring,
                          [0, 1],
                          [-45, 0]
                        )}px)`,
                      }}
                    >
                      <Sprite
                        name="duo_pull_close"
                        x={210}
                        y={85}
                        width={430}
                        height={410}
                      />
                      <div style={{ position: "absolute", left: 395, top: 30 }}>
                        <Heart
                          size={58}
                          progress={pullSpring}
                          color={mvConfig.colors.pencilOrange}
                        />
                      </div>
                    </div>
                  ) : variant < 3 ? (
                    /* Fase 2 (Variant 1 & 2): Minta Ruang -> Ray mundur (duo_push_away + ray_stepback) */
                    <div style={{ position: "absolute", inset: 0 }}>
                      <div
                        style={{
                          transform: `translateX(${interpolate(
                            spaceSpring,
                            [0, 1],
                            [0, -85]
                          )}px)`,
                        }}
                      >
                        <Sprite
                          name="ray_stepback"
                          x={110}
                          y={95}
                          width={275}
                          height={375}
                        />
                      </div>
                      <div
                        style={{
                          transform: `translateX(${interpolate(
                            spaceSpring,
                            [0, 1],
                            [0, 65]
                          )}px)`,
                        }}
                      >
                        <Sprite
                          name="duo_push_away"
                          x={445}
                          y={95}
                          width={310}
                          height={380}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Fase 2 (Variant 3): Ray TIDAK mundur lagi, ia justru MAJU (ray_determined + sol_reachout) */
                    <div style={{ position: "absolute", inset: 0 }}>
                      <div
                        style={{
                          transform: `translateX(${interpolate(
                            spaceSpring,
                            [0, 1],
                            [-40, 55]
                          )}px)`,
                        }}
                      >
                        <Sprite
                          name="ray_determined"
                          x={150}
                          y={90}
                          width={285}
                          height={385}
                        />
                      </div>
                      <div
                        style={{
                          transform: `translateX(${interpolate(
                            spaceSpring,
                            [0, 1],
                            [30, -35]
                          )}px)`,
                        }}
                      >
                        <Sprite
                          name="sol_reachout"
                          x={450}
                          y={95}
                          width={280}
                          height={380}
                          flip={true}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          left: 385,
                          top: 25,
                          display: "flex",
                          gap: 12,
                        }}
                      >
                        <Heart
                          size={60}
                          progress={spaceSpring}
                          color={mvConfig.colors.pencilOrange}
                        />
                        <Sparkle size={48} progress={spaceSpring} />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* SUB-SCENE 3 (Baris 6-7): Pengulangan Terakhir Chorus + Push-in Kamera */}
              {subSceneIndex === 3 && (
                <>
                  <Sprite
                    name={variant === 3 ? "duo_hold_hands" : "ray_reachout"}
                    x={variant === 3 ? 210 : 110}
                    y={135}
                    width={variant === 3 ? 420 : 285}
                    height={395}
                  />
                  {variant < 3 && (
                    <Sprite
                      name="sol_smile"
                      x={465}
                      y={145}
                      width={275}
                      height={380}
                      flip={true}
                    />
                  )}
                </>
              )}
            </div>
          </ScribbleReveal>
        </div>

        {/* Ledakan Bintang & Not Musik saat Ad-lib ("whoa oh, yeah") */}
        {isAdlibActive && (
          <AdlibBurst burstFrame={adlibFrames} fps={fps} />
        )}
      </div>

      {/* 3. Blok Lirik Sinkron */}
      <LyricBlock
        lines={activeSubLines}
        sectionStart={section.start}
        align={lyricAlign}
        theme="day"
        fontSize={68}
      />
    </SketchBackground>
  );
};
