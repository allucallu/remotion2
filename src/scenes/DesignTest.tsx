import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BoilFilter } from "../components/BoilFilter";
import {
  CrackLines,
  Heart,
  MusicNote,
  QuestionMark,
  Sparkle,
  Star,
} from "../components/Doodles";
import { Hatching } from "../components/Hatching";
import { LetterTiles, LetterTilesMode } from "../components/LetterTiles";
import { LyricBlock } from "../components/LyricBlock";
import { PalmLines } from "../components/PalmLines";
import { ScribbleReveal } from "../components/ScribbleReveal";
import { BackgroundMode, SketchBackground } from "../components/SketchBackground";
import { Sprite } from "../components/Sprite";
import { mvConfig } from "../config";
import { timeline } from "../data/timeline";

export const DesignTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Rotasi mode latar belakang setiap 100 frame (Day -> Night -> Golden)
  const modeCycle = Math.floor(frame / 100) % 3;
  const modes: BackgroundMode[] = ["day", "night", "golden"];
  const currentMode = modes[modeCycle];

  // Rotasi mode LetterTiles setiap 75 frame (shaking -> struggle -> glow -> final)
  const tileModes: Array<{ mode: LetterTilesMode; filled: number }> = [
    { mode: "shaking", filled: 2 },
    { mode: "struggle", filled: 5 },
    { mode: "glow", filled: 6 },
    { mode: "final", filled: 8 },
  ];
  const activeTileConfig = tileModes[Math.floor(frame / 75) % tileModes.length];

  // Ambil sampel baris nyata dari timeline (Chorus 2 baris terakhir yang punya "eight letters" + ad-lib "(whoa oh, yeah)")
  const chorus2 =
    timeline.find((s) => s.kind === "chorus" && s.index === 2) ??
    timeline.find((s) => s.lines.length > 0);
  const sampleLines = chorus2 ? chorus2.lines.slice(-2) : [];
  const sampleStart = sampleLines[0]?.start ?? 0;
  const sampleEnd = sampleLines[sampleLines.length - 1]?.end ?? sampleStart + 5;

  // Petakan siklus 150 frame (5 detik) ke rentang waktu sampel baris nyata
  const simulatedSec = interpolate(
    frame % 150,
    [0, 135],
    [sampleStart - 0.15, sampleEnd + 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Progres doodle berulang setiap 60 frame (2 detik)
  const doodleCycleFrame = frame % 60;
  const doodleProgress = interpolate(
    spring({ frame: doodleCycleFrame, fps, config: { damping: 14 } }),
    [0, 1],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Progres palm lines berulang setiap 90 frame (3 detik)
  const palmCycleFrame = frame % 90;
  const palmProgress = interpolate(
    spring({ frame: palmCycleFrame, fps, config: { damping: 16 } }),
    [0, 1],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const isNight = currentMode === "night";
  const headerTextColor = isNight ? mvConfig.colors.chalkNight : mvConfig.colors.inkDark;
  const cardBg = isNight ? "rgba(31, 35, 64, 0.78)" : "rgba(255, 247, 227, 0.88)";
  const cardBorder = isNight ? "rgba(244, 239, 226, 0.22)" : "rgba(27, 26, 46, 0.16)";

  return (
    <SketchBackground mode={currentMode}>
      <BoilFilter scale={3} />

      <div
        style={{
          width,
          height,
          padding: `${mvConfig.safeArea * 0.6}px ${mvConfig.safeArea}px`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: headerTextColor,
          fontFamily: mvConfig.fonts.primary,
        }}
      >
        {/* Header Dashboard + LetterTiles Showcase */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `2px dashed ${cardBorder}`,
            paddingBottom: 14,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700 }}>
              Design System Showcase — "8 Letters"
            </h1>
            <p style={{ margin: "2px 0 0 0", fontSize: 18, opacity: 0.8 }}>
              Bg:{" "}
              <strong style={{ color: mvConfig.colors.pencilOrange }}>
                {currentMode.toUpperCase()}
              </strong>{" "}
              | Tiles:{" "}
              <strong style={{ color: mvConfig.colors.pencilOrange }}>
                {activeTileConfig.mode.toUpperCase()} ({activeTileConfig.filled}/8)
              </strong>
            </p>
          </div>

          {/* Komponen Inti: LetterTiles */}
          <LetterTiles
            filled={activeTileConfig.filled}
            mode={activeTileConfig.mode}
            theme={isNight ? "night" : "day"}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              fontFamily: "monospace",
              fontSize: 16,
            }}
          >
            <span>Frame: {frame}</span>
            <span>|</span>
            <span>t={simulatedSec.toFixed(1)}s</span>
          </div>
        </div>

        {/* Baris Tengah: 3 Kolom Komponen Visual */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            margin: "16px 0",
          }}
        >
          {/* Kolom 1: Sprite Karakter & Properti */}
          <div
            style={{
              backgroundColor: cardBg,
              border: `1.5px solid ${cardBorder}`,
              borderRadius: 16,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              height: 350,
            }}
          >
            <h2 style={{ fontSize: 22, margin: "0 0 8px 0" }}>
              1. Sprite & Idle Boil
            </h2>
            <div style={{ position: "relative", flex: 1 }}>
              <Sprite
                name="ray_smile"
                x={20}
                y={10}
                width={155}
                height={220}
                idle={true}
                blink={true}
                boil={true}
              />
              <Sprite
                name="sol_neutral"
                x={200}
                y={10}
                width={155}
                height={220}
                flip={true}
                idle={true}
                blink={true}
                boil={true}
              />
              <Sprite
                name="prop_notebook"
                x={390}
                y={25}
                width={110}
                height={95}
                idle={false}
              />
              <Sprite
                name="prop_heart_cracked"
                x={390}
                y={135}
                width={110}
                height={95}
                idle={false}
              />
            </div>
          </div>

          {/* Kolom 2: ScribbleReveal & Hatching */}
          <div
            style={{
              backgroundColor: cardBg,
              border: `1.5px solid ${cardBorder}`,
              borderRadius: 16,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 350,
            }}
          >
            <h2 style={{ fontSize: 22, margin: "0 0 8px 0" }}>
              2. Scribble Reveal & Hatching
            </h2>

            <ScribbleReveal
              width={480}
              height={115}
              strokeWidth={50}
              progress={doodleProgress}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: mvConfig.colors.pencilOrange,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                Scribble Mask Reveal
              </div>
            </ScribbleReveal>

            <div
              style={{
                border: `1.5px dashed ${mvConfig.colors.pencilOrange}`,
                borderRadius: 10,
                overflow: "hidden",
                width: 480,
                height: 135,
              }}
            >
              <Hatching
                width={480}
                height={135}
                angle={45}
                spacing={15}
                progress={doodleProgress}
                color={
                  isNight ? mvConfig.colors.glowNight : mvConfig.colors.inkDark
                }
              />
            </div>
          </div>

          {/* Kolom 3: Doodles & Palm Lines */}
          <div
            style={{
              backgroundColor: cardBg,
              border: `1.5px solid ${cardBorder}`,
              borderRadius: 16,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 350,
            }}
          >
            <h2 style={{ fontSize: 22, margin: "0 0 8px 0" }}>
              3. Doodles & Palm Lines
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 6,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <Star size={44} progress={doodleProgress} />
              <Heart size={44} progress={doodleProgress} />
              <QuestionMark
                size={44}
                progress={doodleProgress}
                color={
                  isNight ? mvConfig.colors.chalkNight : mvConfig.colors.inkDark
                }
              />
              <MusicNote
                size={44}
                progress={doodleProgress}
                color={
                  isNight ? mvConfig.colors.chalkNight : mvConfig.colors.inkDark
                }
              />
              <CrackLines
                size={44}
                progress={doodleProgress}
                color={mvConfig.colors.pencilOrange}
              />
              <Sparkle size={44} progress={doodleProgress} />
            </div>

            <div
              style={{
                border: `1.5px dashed ${cardBorder}`,
                borderRadius: 10,
                height: 175,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <PalmLines
                width={460}
                height={175}
                progress={palmProgress}
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* Panel Bawah: Showcase Komponen Inti LyricBlock dengan Data Timeline Nyata */}
        <div
          style={{
            backgroundColor: cardBg,
            border: `2px solid ${cardBorder}`,
            borderRadius: 18,
            padding: "18px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 240,
          }}
        >
          <div
            style={{
              fontSize: 16,
              opacity: 0.75,
              marginBottom: 8,
              fontFamily: "monospace",
            }}
          >
            4. LyricBlock Live Data ({chorus2?.name} — Penyanyi:{" "}
            {chorus2?.singers.join(" & ")})
          </div>

          <LyricBlock
            lines={sampleLines}
            currentTimeSec={simulatedSec}
            align="bottom"
            theme={isNight ? "night" : "day"}
            fontSize={64}
            inline={true}
          />
        </div>
      </div>
    </SketchBackground>
  );
};
