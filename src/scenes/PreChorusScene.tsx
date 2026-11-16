import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BoilFilter, BOIL_FILTER_ID } from "../components/BoilFilter";
import { Heart, Sparkle } from "../components/Doodles";
import { Hatching } from "../components/Hatching";
import { LetterTiles } from "../components/LetterTiles";
import { LyricBlock } from "../components/LyricBlock";
import { ScribbleReveal } from "../components/ScribbleReveal";
import { SketchBackground } from "../components/SketchBackground";
import { Sprite } from "../components/Sprite";
import { mvConfig } from "../config";
import type { Section } from "../data/buildTimeline";

export interface PreChorusSceneProps {
  section: Section;
}

/**
 * Gelembung Pikiran "1000" yang Berubah Menjadi Deretan Hati Kecil
 */
const ThousandTimesBubble: React.FC<{
  subFrame: number;
  fps: number;
  isSecondPreChorus: boolean;
}> = ({ subFrame, fps, isSecondPreChorus }) => {
  const popSpring = spring({
    frame: subFrame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  // Fase 1 (frame 0..38): Angka "1000" tertulis jelas
  // Fase 2 (frame 32..80): "1000" dicoret halus dan bermorfosis menjadi pita deretan 5 hati kecil
  const morphProgress = interpolate(subFrame, [32, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const numberOpacity = interpolate(morphProgress, [0, 0.75], [1, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: 390,
        height: 155,
        transform: `scale(${interpolate(popSpring, [0, 1], [0.75, 1])})`,
        opacity: interpolate(popSpring, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        }),
        filter: `url(#${BOIL_FILTER_ID})`,
      }}
    >
      {/* Bentuk Gelembung Pikiran Sketsa Tangan */}
      <svg
        width={390}
        height={155}
        viewBox="0 0 390 155"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <rect
          x={12}
          y={10}
          width={366}
          height={112}
          rx={56}
          fill={mvConfig.colors.paper}
          stroke={mvConfig.colors.inkDark}
          strokeWidth={3}
        />
        {/* Lingkaran ekor gelembung pikiran */}
        <circle
          cx={110}
          cy={134}
          r={9}
          fill={mvConfig.colors.paper}
          stroke={mvConfig.colors.inkDark}
          strokeWidth={2.5}
        />
        <circle
          cx={92}
          cy={148}
          r={5.5}
          fill={mvConfig.colors.paper}
          stroke={mvConfig.colors.inkDark}
          strokeWidth={2}
        />
      </svg>

      {/* Isi Gelembung: Angka "1000×" */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 12,
          width: 366,
          height: 112,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: numberOpacity,
          transform: `scale(${1 - morphProgress * 0.12})`,
        }}
      >
        <span
          style={{
            fontFamily: mvConfig.fonts.primary,
            fontSize: 64,
            fontWeight: 700,
            color: mvConfig.colors.inkDark,
            letterSpacing: "0.06em",
          }}
        >
          1000×
        </span>

        {/* Coretan tipis di atas angka 1000 saat bertransformasi jadi hati */}
        {morphProgress > 0.05 && (
          <div style={{ position: "absolute" }}>
            <Hatching
              width={210}
              height={54}
              angle={25}
              spacing={16}
              progress={morphProgress}
              color={mvConfig.colors.pencilOrange}
              strokeWidth={2.2}
            />
          </div>
        )}
      </div>

      {/* Deretan Hati Kecil yang Muncul Menggantikan Angka 1000 */}
      {morphProgress > 0.15 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 12,
            width: 366,
            height: 112,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {[0, 1, 2, 3, 4].map((hIdx) => {
            const heartP = Math.max(
              0,
              Math.min(1, (morphProgress - hIdx * 0.12) / 0.45)
            );
            const floatY = Math.sin(subFrame * 0.15 + hIdx * 1.1) * 4;
            return (
              <div
                key={hIdx}
                style={{
                  transform: `translateY(${floatY}px) scale(${
                    0.8 + 0.25 * heartP
                  })`,
                  opacity: heartP,
                }}
              >
                <Heart
                  size={isSecondPreChorus ? 46 : 42}
                  progress={heartP}
                  color={
                    hIdx % 2 === 0
                      ? mvConfig.colors.pencilOrange
                      : mvConfig.colors.inkDark
                  }
                  strokeWidth={2.6}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const PreChorusScene: React.FC<PreChorusSceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSec = section.start + frame / fps;
  const isVariant2 = section.index >= 2;

  const line1 = section.lines[0];
  const line2 = section.lines[1];
  const line2StartSec =
    line2?.start ?? section.start + (section.end - section.start) * 0.5;

  const isSecondHalf = currentSec >= line2StartSec - 0.1;
  const subLocalFrame = isSecondHalf
    ? Math.max(0, Math.round((currentSec - line2StartSec) * fps))
    : frame;

  // Kamera zoom/pan pelan 3–6% per sub-scene
  const totalFrames = Math.max(60, Math.round((section.end - section.start) * fps));
  const camZoom = interpolate(
    frame,
    [0, totalFrames],
    isVariant2 ? [1.0, 1.055] : [1.045, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camPanX = interpolate(
    frame,
    [0, totalFrames],
    isVariant2 ? [-16, 16] : [16, -16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Waktu mulai kata "but it was a lie" pada baris pertama untuk memicu coretan Hatching
  const lieStartSec =
    line1?.words.find((w) =>
      ["but", "lie", "was"].includes(w.text.toLowerCase().replace(/[^a-z]/g, ""))
    )?.start ?? section.start + 2.2;

  const scratchFrames = Math.max(0, Math.round((currentSec - lieStartSec) * fps));
  const scratchProgress = interpolate(scratchFrames, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Posisi lirik & panggung ilustrasi
  const lyricAlign = isVariant2 ? "left" : "right";
  const stageLeft = lyricAlign === "right" ? 110 : 940;

  return (
    <SketchBackground mode="day" bgName="bg_room_day">
      <BoilFilter scale={2.8} />

      {/* Pada Pre-Chorus 2, tampilkan 8 Kotak Huruf di bagian atas layar (filled 2->3, mode 'struggle') */}
      {isVariant2 && (
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
            filled={isSecondHalf ? 3 : 2}
            mode="struggle"
            theme="day"
          />
        </div>
      )}

      {/* Kontainer Kamera dengan Zoom & Pan Halus 3–6% */}
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
            width: 820,
            height: 760,
          }}
        >
          <ScribbleReveal
            width={820}
            height={760}
            strokeWidth={70}
            start={0}
            duration={20}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {/* Gelembung "1000" -> Deretan Hati Kecil saat Baris ke-2 ("a thousand times") */}
              {isSecondHalf && (
                <div
                  style={{
                    position: "absolute",
                    left: 190,
                    top: 10,
                    zIndex: 15,
                  }}
                >
                  <ThousandTimesBubble
                    subFrame={subLocalFrame}
                    fps={fps}
                    isSecondPreChorus={isVariant2}
                  />
                </div>
              )}

              {/* PRE-CHORUS 1: Ray menulis lalu mencoret buku kecil, Sol menunggu dengan senyum */}
              {!isVariant2 ? (
                <>
                  {/* Ray menulis di buku kecil */}
                  <Sprite
                    name="ray_writing"
                    x={40}
                    y={190}
                    width={290}
                    height={390}
                    idle={true}
                    blink={true}
                    boil={true}
                  />

                  {/* Sol duduk menunggu dengan sabar */}
                  <Sprite
                    name="sol_wait"
                    x={470}
                    y={200}
                    width={280}
                    height={380}
                    flip={true}
                    idle={true}
                    blink={true}
                    boil={true}
                  />

                  {/* Buku Catatan Terbuka + Pensil + Coretan Hatching */}
                  <div
                    style={{
                      position: "absolute",
                      left: 275,
                      top: 390,
                      width: 220,
                      height: 170,
                    }}
                  >
                    <Sprite
                      name="prop_notebook"
                      x={0}
                      y={0}
                      width={210}
                      height={155}
                      idle={false}
                      boil={true}
                    />
                    <Sprite
                      name="prop_pencil"
                      x={135}
                      y={-25}
                      width={90}
                      height={90}
                      idle={true}
                      boil={true}
                    />

                    {/* Coretan Hatching di atas halaman buku saat "but it was a lie" */}
                    {scratchProgress > 0.02 && (
                      <div
                        style={{
                          position: "absolute",
                          left: 22,
                          top: 26,
                          width: 165,
                          height: 100,
                          pointerEvents: "none",
                        }}
                      >
                        <Hatching
                          width={165}
                          height={100}
                          angle={38}
                          spacing={11}
                          progress={scratchProgress}
                          color={mvConfig.colors.pencilOrange}
                          strokeWidth={2.6}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* PRE-CHORUS 2 (index 2): Ray tidak mencoret, tangan menggenggam erat */
                <>
                  {/* Ray & Sol bergandengan tangan / duduk berdampingan */}
                  <Sprite
                    name="duo_hold_hands"
                    x={110}
                    y={175}
                    width={360}
                    height={410}
                    idle={true}
                    blink={true}
                    boil={true}
                  />
                  <Sprite
                    name="duo_sitting"
                    x={450}
                    y={215}
                    width={310}
                    height={360}
                    idle={true}
                    blink={true}
                    boil={true}
                  />

                  {/* Buku kecil terbuka TANPA coretan, dihiasi hati hangat */}
                  <div
                    style={{
                      position: "absolute",
                      left: 295,
                      top: 445,
                      width: 220,
                      height: 165,
                    }}
                  >
                    <Sprite
                      name="prop_notebook"
                      x={0}
                      y={0}
                      width={210}
                      height={155}
                      idle={false}
                      boil={true}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 78,
                        top: 42,
                        pointerEvents: "none",
                      }}
                    >
                      <Heart
                        size={52}
                        progress={interpolate(frame, [10, 45], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })}
                        color={mvConfig.colors.pencilOrange}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        right: 12,
                        top: -18,
                        pointerEvents: "none",
                      }}
                    >
                      <Sparkle
                        size={42}
                        progress={interpolate(frame, [20, 55], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScribbleReveal>
        </div>
      </div>

      {/* Blok Lirik Sinkron */}
      <LyricBlock
        lines={section.lines}
        sectionStart={section.start}
        align={lyricAlign}
        theme="day"
        fontSize={68}
      />
    </SketchBackground>
  );
};
