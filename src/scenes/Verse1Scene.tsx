import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BoilFilter, BOIL_FILTER_ID } from "../components/BoilFilter";
import { CrackLines, Heart, Sparkle, Star } from "../components/Doodles";
import { LyricBlock } from "../components/LyricBlock";
import { ScribbleReveal } from "../components/ScribbleReveal";
import { SketchBackground } from "../components/SketchBackground";
import { Sprite } from "../components/Sprite";
import { mvConfig } from "../config";
import type { Section } from "../data/buildTimeline";

export interface Verse1SceneProps {
  section: Section;
}

const CEILING_STARS = [
  { x: 220, y: 120, size: 42, delay: 4 },
  { x: 420, y: 85, size: 32, delay: 14 },
  { x: 670, y: 150, size: 48, delay: 24 },
  { x: 920, y: 95, size: 36, delay: 36 },
  { x: 1180, y: 135, size: 44, delay: 48 },
  { x: 1440, y: 90, size: 38, delay: 60 },
  { x: 1660, y: 145, size: 46, delay: 75 },
  { x: 540, y: 215, size: 28, delay: 90 },
  { x: 1310, y: 210, size: 30, delay: 105 },
];

/**
 * Ilustrasi Hati Kecil di Dada Ray yang Membuka-Menutup seperti Pintu Kecil
 * serta Retak saat Bagian "I've been hurt so I don't trust"
 */
const ChestHeartDoor: React.FC<{
  frame: number;
  fps: number;
  isDoorActive: boolean;
  isCracked: boolean;
  crackProgress: number;
}> = ({ frame, isDoorActive, isCracked, crackProgress }) => {
  // Osilasi pintu hati membuka-menutup (-1 -> tertutup, 1 -> terbuka lebar)
  const doorSwing = isDoorActive ? Math.sin((frame * 2 * Math.PI) / 48) : -0.8;
  const doorScaleX = interpolate(doorSwing, [-1, 1], [0.95, 0.25]);
  const innerGlow = interpolate(doorSwing, [-1, 1], [0.15, 0.85]);

  return (
    <div
      style={{
        position: "relative",
        width: 170,
        height: 170,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: `url(#${BOIL_FILTER_ID})`,
      }}
    >
      {/* Pendaran hangat dari dalam pintu hati saat terbuka */}
      <div
        style={{
          position: "absolute",
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,182,92,${innerGlow}) 0%, rgba(255,182,92,0) 72%)`,
        }}
      />

      <svg
        width={160}
        height={160}
        viewBox="0 0 120 120"
        style={{ overflow: "visible" }}
      >
        {/* Bentuk Hati Utama */}
        <path
          d="M 60 36 C 52 16, 20 16, 16 42 C 12 64, 34 82, 60 104 C 86 82, 108 64, 104 42 C 100 16, 68 16, 60 36 Z"
          fill="rgba(31, 35, 64, 0.85)"
          stroke={
            isCracked ? mvConfig.colors.pencilOrange : mvConfig.colors.chalkNight
          }
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Kusen Pintu Kecil di Tengah Hati */}
        <rect
          x={44}
          y={46}
          width={32}
          height={40}
          rx={4}
          fill={`rgba(255, 182, 92, ${innerGlow * 0.65})`}
          stroke={mvConfig.colors.chalkNight}
          strokeWidth={2}
        />

        {/* Daun Pintu yang Membuka-Menutup (engsel di kiri x=44) */}
        <g
          transform={`translate(44, 46) scale(${doorScaleX}, 1)`}
          style={{ transformOrigin: "44px 66px" }}
        >
          <rect
            x={0}
            y={0}
            width={32}
            height={40}
            rx={3}
            fill={mvConfig.colors.pencilOrange}
            stroke={mvConfig.colors.chalkNight}
            strokeWidth={2}
          />
          {/* Gagang pintu kecil */}
          <circle cx={25} cy={20} r={2.5} fill={mvConfig.colors.blushYellow} />
        </g>
      </svg>

      {/* Coretan Retakan Hati pada Sub-scene 3 */}
      {isCracked && (
        <div
          style={{
            position: "absolute",
            inset: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CrackLines
            size={130}
            progress={crackProgress}
            color={mvConfig.colors.pencilOrange}
            strokeWidth={3.2}
          />
        </div>
      )}
    </div>
  );
};

export const Verse1Scene: React.FC<Verse1SceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const currentSec = section.start + frame / fps;
  const lines = section.lines;

  // Pembagian 6 baris menjadi 3 sub-scene (masing-masing 2 baris)
  const subScene1Lines = lines.slice(0, 2);
  const subScene2Lines = lines.slice(2, 4);
  const subScene3Lines = lines.slice(4, 6);

  const sub2StartSec = subScene2Lines[0]?.start ?? section.start + 6;
  const sub3StartSec = subScene3Lines[0]?.start ?? section.start + 13;

  const subSceneIndex =
    currentSec < sub2StartSec ? 0 : currentSec < sub3StartSec ? 1 : 2;

  const activeSubLines =
    subSceneIndex === 0
      ? subScene1Lines
      : subSceneIndex === 1
      ? subScene2Lines
      : subScene3Lines;

  // Berganti sisi lirik tiap kelompok 2 baris (kanan -> kiri -> kanan)
  const lyricAlign =
    subSceneIndex === 0 ? "right" : subSceneIndex === 1 ? "left" : "right";

  // Frame awal sub-scene aktif untuk memicu transisi ScribbleReveal & kamera
  const subStartSec =
    subSceneIndex === 0
      ? section.start
      : subSceneIndex === 1
      ? sub2StartSec
      : sub3StartSec;
  const subEndSec =
    subSceneIndex === 0
      ? sub2StartSec
      : subSceneIndex === 1
      ? sub3StartSec
      : section.end;

  const subLocalFrame = Math.max(0, Math.round((currentSec - subStartSec) * fps));
  const subDurationFrames = Math.max(
    30,
    Math.round((subEndSec - subStartSec) * fps)
  );

  // Kamera zoom/pan pelan 3–6% per sub-scene
  const camZoom = interpolate(
    subLocalFrame,
    [0, subDurationFrames],
    subSceneIndex === 2 ? [1.05, 1.0] : [1.0, 1.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camPanX = interpolate(
    subLocalFrame,
    [0, subDurationFrames],
    subSceneIndex === 1 ? [18, -18] : [-15, 15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camPanY = interpolate(
    subLocalFrame,
    [0, subDurationFrames],
    subSceneIndex === 2 ? [16, -22] : [0, -12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Progres transisi ScribbleReveal (±14 frame di awal sub-scene)
  const revealSpring = spring({
    frame: subLocalFrame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const revealProgress = interpolate(revealSpring, [0, 1], [0.15, 1], {
    extrapolateRight: "clamp",
  });

  // Progres retakan hati pada Sub-scene 3 ("I've been hurt so I don't trust")
  const crackProgress =
    subSceneIndex === 2
      ? interpolate(subLocalFrame, [4, 35], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Posisi horizontal panggung karakter menyesuaikan sisi lirik
  const stageCenterX = lyricAlign === "right" ? 480 : 1280;

  return (
    <SketchBackground mode="night" bgName="bg_ceiling_night">
      <BoilFilter scale={2.8} />

      {/* Kontainer Kamera dengan Zoom & Pan Halus 3-6% */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${camZoom}) translate(${camPanX}px, ${camPanY}px)`,
          transformOrigin: "50% 50%",
        }}
      >
        {/* 1. Langit-langit Kamar Malam: Bintang Tempel Menyala Bertahap */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height: 360,
            pointerEvents: "none",
          }}
        >
          {/* Aset bintang plafon jika tersedia */}
          <Sprite
            name="prop_stars_set"
            x={stageCenterX - 160}
            y={40}
            width={320}
            height={140}
            idle={false}
            blink={false}
            style={{ opacity: 0.35 }}
          />

          {CEILING_STARS.map((st, idx) => {
            const starLocal = Math.max(0, frame - st.delay);
            const starProgress = interpolate(starLocal, [0, 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const twinkle =
              0.7 + 0.3 * Math.sin((frame * 2 * Math.PI) / 55 + idx * 1.3);

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: st.x,
                  top: st.y,
                  opacity: starProgress * twinkle,
                  filter: `drop-shadow(0 0 10px ${mvConfig.colors.glowNight})`,
                }}
              >
                {idx % 3 === 0 ? (
                  <Sparkle
                    size={st.size * 0.85}
                    progress={starProgress}
                    color={mvConfig.colors.glowNight}
                  />
                ) : (
                  <Star
                    size={st.size}
                    progress={starProgress}
                    color={mvConfig.colors.glowNight}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 2. Panggung Ilustrasi Utama dengan Transisi ScribbleReveal tiap 2 Baris */}
        <div
          style={{
            position: "absolute",
            left: stageCenterX - 310,
            top: 230,
            width: 620,
            height: 680,
          }}
        >
          <ScribbleReveal
            key={`verse1-sub-${subSceneIndex}`}
            width={620}
            height={680}
            strokeWidth={65}
            progress={revealProgress}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              {/* Duo Ray & Sol Berbaring Menatap Plafon */}
              <Sprite
                name="duo_lying_up"
                x={90}
                y={220}
                width={440}
                height={380}
                idle={true}
                blink={true}
                boil={true}
              />

              {/* Sub-scene 1: Sol menoleh hangat & hati kecil tenang */}
              {subSceneIndex === 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 250,
                    top: 100,
                    display: "flex",
                    gap: 18,
                    alignItems: "center",
                  }}
                >
                  <Heart
                    size={54}
                    progress={interpolate(subLocalFrame, [5, 35], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })}
                    color={mvConfig.colors.glowNight}
                  />
                  <Sparkle
                    size={40}
                    progress={interpolate(subLocalFrame, [15, 45], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })}
                  />
                </div>
              )}

              {/* Sub-scene 2 & 3: Hati di Dada Ray dengan Pintu Membuka-Menutup */}
              {subSceneIndex >= 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 145,
                    top: 30,
                  }}
                >
                  <ChestHeartDoor
                    frame={frame}
                    fps={fps}
                    isDoorActive={subSceneIndex === 1}
                    isCracked={subSceneIndex === 2}
                    crackProgress={crackProgress}
                  />
                </div>
              )}

              {/* Sub-scene 3: Sprite prop_heart_cracked muncul saat lirik luka & sulit percaya */}
              {subSceneIndex === 2 && (
                <Sprite
                  name="prop_heart_cracked"
                  x={340}
                  y={45}
                  width={165}
                  height={165}
                  start={Math.round((sub3StartSec - section.start) * fps)}
                  idle={true}
                  boil={true}
                />
              )}
            </div>
          </ScribbleReveal>
        </div>
      </div>

      {/* 3. Blok Lirik Sinkron (2 Baris per Sub-scene, Berganti Sisi) */}
      <LyricBlock
        lines={activeSubLines}
        sectionStart={section.start}
        align={lyricAlign}
        theme="night"
        fontSize={68}
      />
    </SketchBackground>
  );
};
