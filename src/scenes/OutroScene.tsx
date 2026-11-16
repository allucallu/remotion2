import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BoilFilter } from "../components/BoilFilter";
import { Heart, MusicNote, Sparkle, Star } from "../components/Doodles";
import { Hatching } from "../components/Hatching";
import { LetterTiles, LetterTilesMode } from "../components/LetterTiles";
import { LyricBlock } from "../components/LyricBlock";
import { ScribbleReveal } from "../components/ScribbleReveal";
import { SketchBackground } from "../components/SketchBackground";
import { Sprite } from "../components/Sprite";
import { mvConfig } from "../config";
import type { Section } from "../data/buildTimeline";

export interface OutroSceneProps {
  section: Section;
}

/**
 * Teks Kecil Bergulir untuk Bisikan Ad-lib ("It's only you", "you")
 */
const RollingWhisperAdlib: React.FC<{
  text: string;
  elapsedSec: number;
  y: number;
  direction?: 1 | -1;
}> = ({ text, elapsedSec, y, direction = 1 }) => {
  if (elapsedSec < -0.1 || elapsedSec > 3.8) return null;

  const opacity = interpolate(
    elapsedSec,
    [0, 0.45, 2.8, 3.8],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const translateX = interpolate(
    elapsedSec,
    [0, 3.8],
    direction === 1 ? [-90, 90] : [90, -90],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const waveY = Math.sin(elapsedSec * 4) * 6;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
        transform: `translate(${translateX}px, ${waveY}px) rotate(${
          direction * -3
        }deg)`,
        zIndex: 18,
      }}
    >
      <span
        style={{
          fontFamily: mvConfig.fonts.secondary,
          fontSize: 54,
          color: mvConfig.colors.pencilOrange,
          letterSpacing: "0.06em",
          backgroundColor: "rgba(255, 247, 227, 0.78)",
          padding: "4px 22px",
          borderRadius: 999,
          border: `1.5px dashed ${mvConfig.colors.pencilOrange}`,
        }}
      >
        ~ {text} ~
      </span>
    </div>
  );
};

export const OutroScene: React.FC<OutroSceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSec = section.start + frame / fps;
  const lines = section.lines;

  // Identifikasi baris pengulangan "eight letters" di Outro (Baris 0, Baris 4, Baris 8)
  const rep2StartSec = lines[4]?.start ?? section.start + 10.5;
  const rep3StartSec = lines[8]?.start ?? section.start + 21.0;
  const lastLyricEndSec =
    lines[lines.length - 1]?.end ?? Math.max(section.start + 23.8, section.end - 5);

  // Progres pengisian 8 Kotak Huruf (LetterTiles):
  // - Pengulangan 1 (Baris 0..3): filled naik 6 -> 7, mode 'shaking'
  // - Pengulangan 2 (Baris 4..7): filled = 7, mode 'shaking'
  // - Pengulangan 3 / Terakhir (Baris 8 hingga akhir): filled = 8, mode 'final' (tinta navy + tetesan)
  const isFinalRepetition = currentSec >= rep3StartSec - 0.1;
  const filledCount =
    currentSec < section.start + 2.2
      ? 6
      : currentSec < rep3StartSec - 0.1
      ? 7
      : 8;
  const tileMode: LetterTilesMode = isFinalRepetition ? "final" : "shaking";

  // Waktu bisikan ad-lib: "(It's only you)" pada Baris 2, dan "(you)" pada Baris 6
  const adlib1StartSec =
    lines[2]?.words.find((w) => w.isAdlib)?.start ?? section.start + 5.8;
  const adlib2StartSec =
    lines[6]?.words.find((w) => w.isAdlib)?.start ?? section.start + 16.5;

  // Fase ketenangan setelah lirik terakhir selesai (2-3+ detik tenang sebelum fade ke krem)
  const isPostLyricQuiet = currentSec > lastLyricEndSec + 0.35;
  const lyricFadeOpacity = interpolate(
    currentSec,
    [lastLyricEndSec + 0.1, lastLyricEndSec + 0.9],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Kamera mundur pelan (pull-back scale 1.04 -> 0.92) dari pengulangan terakhir hingga audio habis
  const cameraScale = interpolate(
    currentSec,
    [section.start, rep3StartSec, section.end],
    [1.0, 1.04, 0.92],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade halus ke kertas krem (#FFF7E3) pada 2.2 detik terakhir menjelang audio selesai
  const creamFadeOpacity = interpolate(
    currentSec,
    [section.end - 2.4, section.end - 0.3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Spring untuk pose akhir bergandengan tangan
  const finalHoldSpring = spring({
    frame: Math.max(0, Math.round((currentSec - rep2StartSec) * fps)),
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  return (
    <SketchBackground mode="golden" bgName="bg_golden">
      <BoilFilter scale={2.6} />

      {/* 1. Motif 8 Kotak Huruf di Atas Layar (Terisi Penuh 8/8 di Akhir) */}
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
        <LetterTiles filled={filledCount} mode={tileMode} theme="day" />
      </div>

      {/* 2. Teks Kecil Bergulir untuk Ad-lib Berbisik */}
      <RollingWhisperAdlib
        text="It's only you..."
        elapsedSec={currentSec - adlib1StartSec}
        y={205}
        direction={1}
      />
      <RollingWhisperAdlib
        text="...only you"
        elapsedSec={currentSec - adlib2StartSec}
        y={215}
        direction={-1}
      />

      {/* 3. Kontainer Kamera (Mundur Pelan di Akhir Lagu) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: "50% 46%",
        }}
      >
        {/* Arsiran hangat di sudut kertas */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 130,
            opacity: 0.25,
            pointerEvents: "none",
          }}
        >
          <Hatching
            width={240}
            height={160}
            angle={40}
            spacing={15}
            progress={1}
            color={mvConfig.colors.pencilOrange}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 130,
            opacity: 0.25,
            pointerEvents: "none",
          }}
        >
          <Hatching
            width={240}
            height={160}
            angle={-40}
            spacing={15}
            progress={1}
            color={mvConfig.colors.pencilOrange}
          />
        </div>

        {/* Panggung Tengah: Ray & Sol Bergandengan Tangan (duo_hold_hands) */}
        <div
          style={{
            position: "absolute",
            left: 530,
            top: 185,
            width: 860,
            height: 560,
          }}
        >
          <ScribbleReveal
            width={860}
            height={560}
            strokeWidth={75}
            start={0}
            duration={22}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {currentSec < rep2StartSec ? (
                /* Awal Outro: Ray memejamkan mata lalu tersenyum menatap Sol */
                <>
                  <Sprite
                    name="ray_smile"
                    x={120}
                    y={95}
                    width={280}
                    height={385}
                    idle={true}
                    blink={true}
                    boil={true}
                  />
                  <Sprite
                    name="sol_smile"
                    x={455}
                    y={95}
                    width={280}
                    height={385}
                    flip={true}
                    idle={true}
                    blink={true}
                    boil={true}
                  />
                  <div style={{ position: "absolute", left: 395, top: 45 }}>
                    <Heart
                      size={58}
                      progress={1}
                      color={mvConfig.colors.pencilOrange}
                    />
                  </div>
                </>
              ) : (
                /* Pertengahan hingga Akhir Outro: Ray & Sol Bergandengan Tangan (duo_hold_hands) */
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transform: `scale(${interpolate(
                      finalHoldSpring,
                      [0, 1],
                      [0.94, 1]
                    )})`,
                  }}
                >
                  <Sprite
                    name="duo_hold_hands"
                    x={210}
                    y={75}
                    width={440}
                    height={420}
                    idle={true}
                    blink={true}
                    boil={true}
                  />

                  {/* Hati, Bintang, dan Not Musik Mengambang Hangat di Sekeliling Ray & Sol */}
                  {[
                    { x: 135, y: 95, type: "heart", size: 54 },
                    { x: 675, y: 105, type: "heart", size: 50 },
                    { x: 185, y: 245, type: "sparkle", size: 44 },
                    { x: 645, y: 255, type: "star", size: 48 },
                    { x: 405, y: 15, type: "heart", size: 64 },
                    { x: 310, y: 40, type: "note", size: 42 },
                    { x: 520, y: 40, type: "sparkle", size: 44 },
                  ].map((d, idx) => {
                    const floatY = Math.sin(frame * 0.08 + idx * 1.4) * 7;
                    return (
                      <div
                        key={idx}
                        style={{
                          position: "absolute",
                          left: d.x,
                          top: d.y + floatY,
                          pointerEvents: "none",
                        }}
                      >
                        {d.type === "heart" && (
                          <Heart
                            size={d.size}
                            progress={1}
                            color={mvConfig.colors.pencilOrange}
                          />
                        )}
                        {d.type === "star" && (
                          <Star
                            size={d.size}
                            progress={1}
                            color={mvConfig.colors.pencilOrange}
                          />
                        )}
                        {d.type === "sparkle" && (
                          <Sparkle size={d.size} progress={1} />
                        )}
                        {d.type === "note" && (
                          <MusicNote
                            size={d.size}
                            progress={1}
                            color={mvConfig.colors.inkDark}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScribbleReveal>
        </div>
      </div>

      {/* 4. Blok Lirik Outro (Memudar Setelah Lirik Terakhir Selesai untuk Memberi 2-3 Detik Tenang) */}
      {!isPostLyricQuiet && lyricFadeOpacity > 0.01 && (
        <div style={{ opacity: lyricFadeOpacity }}>
          <LyricBlock
            lines={section.lines}
            sectionStart={section.start}
            align="bottom"
            theme="day"
            fontSize={64}
          />
        </div>
      )}

      {/* 5. Overlay Fade Halus ke Kertas Krem (#FFF7E3) di Akhir Video */}
      {creamFadeOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: mvConfig.colors.paper,
            opacity: creamFadeOpacity,
            zIndex: 50,
            pointerEvents: "none",
          }}
        />
      )}
    </SketchBackground>
  );
};
