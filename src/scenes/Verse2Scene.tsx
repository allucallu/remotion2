import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BoilFilter, BOIL_FILTER_ID } from "../components/BoilFilter";
import { Heart, Sparkle, Star } from "../components/Doodles";
import { LetterTiles } from "../components/LetterTiles";
import { LyricBlock } from "../components/LyricBlock";
import { PalmLines } from "../components/PalmLines";
import { ScribbleReveal } from "../components/ScribbleReveal";
import { SketchBackground } from "../components/SketchBackground";
import { Sprite } from "../components/Sprite";
import { mvConfig } from "../config";
import type { Section } from "../data/buildTimeline";

export interface Verse2SceneProps {
  section: Section;
}

/**
 * Ilustrasi Hati Kecil Ray yang Retaknya Direkatkan oleh Plester (Band-Aid)
 * ("It's like I'm whole again, isn't that a sign")
 */
const PatchedHeartBadge: React.FC<{
  patchSpring: number;
}> = ({ patchSpring }) => {
  const patchScale = interpolate(patchSpring, [0, 0.7, 1], [1.45, 0.94, 1]);
  const patchOpacity = interpolate(patchSpring, [0, 0.3, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
  });

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
      <svg
        width={160}
        height={160}
        viewBox="0 0 120 120"
        style={{ overflow: "visible" }}
      >
        {/* Bentuk Hati Utuh Kembali */}
        <path
          d="M 60 36 C 52 16, 20 16, 16 42 C 12 64, 34 82, 60 104 C 86 82, 108 64, 104 42 C 100 16, 68 16, 60 36 Z"
          fill="rgba(217, 83, 43, 0.14)"
          stroke={mvConfig.colors.pencilOrange}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bekas garis retakan halus yang sudah tertutup */}
        <path
          d="M 58 28 L 53 48 L 63 62 L 55 82"
          fill="none"
          stroke={mvConfig.colors.inkDark}
          strokeWidth={1.6}
          strokeDasharray="3 3"
          opacity={0.45}
        />

        {/* Plester / Band-Aid yang Menempel dengan Spring */}
        <g
          transform={`translate(60, 58) rotate(-28) scale(${patchScale}) translate(-60, -58)`}
          opacity={patchOpacity}
        >
          <rect
            x={32}
            y={46}
            width={56}
            height={22}
            rx={9}
            fill={mvConfig.colors.blushYellow}
            stroke={mvConfig.colors.inkDark}
            strokeWidth={2.4}
          />
          <rect
            x={50}
            y={46}
            width={20}
            height={22}
            fill={mvConfig.colors.paper}
            stroke={mvConfig.colors.inkDark}
            strokeWidth={1.8}
          />
          {/* Titik-titik pori plester */}
          <circle cx={40} cy={53} r={1.4} fill={mvConfig.colors.inkDark} />
          <circle cx={40} cy={61} r={1.4} fill={mvConfig.colors.inkDark} />
          <circle cx={78} cy={53} r={1.4} fill={mvConfig.colors.inkDark} />
          <circle cx={78} cy={61} r={1.4} fill={mvConfig.colors.inkDark} />
        </g>
      </svg>
    </div>
  );
};

export const Verse2Scene: React.FC<Verse2SceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSec = section.start + frame / fps;
  const lines = section.lines;

  // Pembagian 4 baris Verse 2 menjadi 2 sub-scene (@ 2 baris):
  // Sub 0 (Baris 0-1): "Isn't it amazing how almost every line on our hands align / When your hands are mine"
  // Sub 1 (Baris 2-3): "It's like I'm whole again, isn't that a sign / I should speak my mind"
  const sub1StartSec =
    lines[2]?.start ?? section.start + (section.end - section.start) * 0.5;
  const line3StartSec =
    lines[3]?.start ?? sub1StartSec + (section.end - sub1StartSec) * 0.55;

  const subSceneIndex = currentSec < sub1StartSec ? 0 : 1;
  const activeSubLines =
    subSceneIndex === 0 ? lines.slice(0, 2) : lines.slice(2, 4);

  const lyricAlign = subSceneIndex === 0 ? "right" : "left";

  // Progres garis telapak tangan (PalmLines) menyambung selama Sub-scene 0
  const palmProgress = interpolate(
    currentSec,
    [section.start, sub1StartSec - 0.3],
    [0.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Frame lokal Sub-scene 1 untuk animasi plester hati & ray_determined
  const sub1Frames = Math.max(0, Math.round((currentSec - sub1StartSec) * fps));
  const patchSpring = spring({
    frame: Math.max(0, sub1Frames - 4),
    fps,
    config: { damping: 12, stiffness: 135 },
  });

  // Kemunculan ray_determined menguat di akhir bagian (Baris 3: "I should speak my mind")
  const isDeterminedPhase = currentSec >= line3StartSec - 0.15;
  const determinedFrames = Math.max(
    0,
    Math.round((currentSec - line3StartSec) * fps)
  );
  const determinedSpring = spring({
    frame: determinedFrames,
    fps,
    config: { damping: 13, stiffness: 125 },
  });

  // LetterTiles mulai muncul tipis di akhir Verse 2 (filled 1 -> 3, mode 'struggle')
  const showTiles = subSceneIndex === 1;
  const filledTiles = !showTiles
    ? 0
    : currentSec < line3StartSec
    ? 1
    : currentSec < section.end - 0.8
    ? 2
    : 3;

  // Kamera zoom/pan pelan 3–5% per sub-scene
  const subDurationSec =
    subSceneIndex === 0
      ? sub1StartSec - section.start
      : section.end - sub1StartSec;
  const subElapsedSec =
    subSceneIndex === 0
      ? currentSec - section.start
      : currentSec - sub1StartSec;

  const camZoom = interpolate(
    subElapsedSec,
    [0, Math.max(1, subDurationSec)],
    subSceneIndex === 0 ? [1.0, 1.05] : [1.045, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camPanX = interpolate(
    subElapsedSec,
    [0, Math.max(1, subDurationSec)],
    subSceneIndex === 0 ? [-14, 14] : [16, -12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const stageLeft = lyricAlign === "right" ? 90 : 920;

  return (
    <SketchBackground mode="day" bgName="bg_room_day">
      <BoilFilter scale={2.8} />

      {/* 1. LetterTiles Muncul Tipis di Akhir Verse 2 (filled 1-3, mode 'struggle') */}
      {showTiles && (
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
          <LetterTiles filled={filledTiles} mode="struggle" theme="day" />
        </div>
      )}

      {/* 2. Kontainer Kamera */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${camZoom}) translateX(${camPanX}px)`,
          transformOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: stageLeft,
            top: 150,
            width: 880,
            height: 720,
          }}
        >
          <ScribbleReveal
            key={`verse2-sub-${subSceneIndex}`}
            width={880}
            height={720}
            strokeWidth={70}
            start={0}
            duration={18}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {subSceneIndex === 0 ? (
                /* SUB-SCENE 0: Close-up Dua Telapak Tangan & Garis Telapak Menyambung */
                <>
                  {/* Sprite duo_palms sebagai dasar kedua telapak tangan */}
                  <Sprite
                    name="duo_palms"
                    x={180}
                    y={110}
                    width={520}
                    height={460}
                    idle={true}
                    blink={false}
                    boil={true}
                    style={{ opacity: 0.88 }}
                  />

                  {/* Animasi Garis Telapak Tangan Menyambung (PalmLines) */}
                  <div
                    style={{
                      position: "absolute",
                      left: 30,
                      top: 40,
                      width: 820,
                      height: 580,
                      pointerEvents: "none",
                    }}
                  >
                    <PalmLines
                      width={820}
                      height={580}
                      progress={palmProgress}
                      strokeWidth={3.2}
                    />
                  </div>

                  {/* Kilau & hati di titik temu telapak tangan saat garis menyambung */}
                  {palmProgress > 0.65 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 385,
                        top: 185,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <Sparkle
                        size={48}
                        progress={(palmProgress - 0.65) / 0.35}
                      />
                      <Heart
                        size={52}
                        progress={(palmProgress - 0.65) / 0.35}
                        color={mvConfig.colors.pencilOrange}
                      />
                      <Star
                        size={44}
                        progress={(palmProgress - 0.65) / 0.35}
                      />
                    </div>
                  )}
                </>
              ) : (
                /* SUB-SCENE 1: Hati Berplester (prop_heart_patch), Sol Tersenyum, Ray Determined */
                <>
                  {/* Hati kecil Ray yang direkatkan dengan plester */}
                  <div
                    style={{
                      position: "absolute",
                      left: 170,
                      top: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <PatchedHeartBadge patchSpring={patchSpring} />
                    <Sprite
                      name="prop_heart_patch"
                      x={175}
                      y={10}
                      width={150}
                      height={150}
                      idle={true}
                      boil={true}
                    />
                  </div>

                  {/* Sol menoleh dan tersenyum hangat */}
                  <Sprite
                    name="sol_smile"
                    x={490}
                    y={195}
                    width={280}
                    height={385}
                    flip={true}
                    idle={true}
                    blink={true}
                    boil={true}
                  />

                  {/* Ray: dari senyum hangat menguat menjadi ray_determined pada "I should speak my mind" */}
                  {!isDeterminedPhase ? (
                    <Sprite
                      name="ray_smile"
                      x={105}
                      y={195}
                      width={280}
                      height={385}
                      idle={true}
                      blink={true}
                      boil={true}
                    />
                  ) : (
                    <div
                      style={{
                        transform: `scale(${interpolate(
                          determinedSpring,
                          [0, 1],
                          [0.92, 1.04]
                        )})`,
                        transformOrigin: "245px 580px",
                      }}
                    >
                      <Sprite
                        name="ray_determined"
                        x={105}
                        y={190}
                        width={290}
                        height={395}
                        idle={true}
                        blink={true}
                        boil={true}
                      />
                      {/* Kilau tekad di sekitar kepala Ray */}
                      <div
                        style={{
                          position: "absolute",
                          left: 85,
                          top: 155,
                          display: "flex",
                          gap: 190,
                        }}
                      >
                        <Sparkle size={46} progress={determinedSpring} />
                        <Star
                          size={48}
                          progress={determinedSpring}
                          color={mvConfig.colors.pencilOrange}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScribbleReveal>
        </div>
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
