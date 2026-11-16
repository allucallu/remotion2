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
import { SketchBackground } from "../components/SketchBackground";
import { Sprite } from "../components/Sprite";
import { mvConfig } from "../config";
import type { Section } from "../data/buildTimeline";

export interface BridgeSceneProps {
  section: Section;
}

const NIGHT_STARS = [
  { x: 180, y: 170, size: 34, delay: 8 },
  { x: 350, y: 290, size: 28, delay: 28 },
  { x: 1480, y: 165, size: 38, delay: 45 },
  { x: 1640, y: 310, size: 30, delay: 68 },
  { x: 260, y: 520, size: 26, delay: 95 },
  { x: 1560, y: 510, size: 32, delay: 120 },
  { x: 1320, y: 220, size: 26, delay: 150 },
];

export const BridgeScene: React.FC<BridgeSceneProps> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSec = section.start + frame / fps;
  const totalFrames = Math.max(90, Math.round((section.end - section.start) * fps));

  // Baris ke-2 ("It's you there in my mind") memicu senyum hangat Sol di dalam gelembung pikiran
  const line2StartSec =
    section.lines[1]?.start ?? section.start + (section.end - section.start) * 0.35;
  const isMindLineActive = currentSec >= line2StartSec - 0.2;

  // Gerak kamera sangat pelan (zoom 1.0 -> 1.03 sepanjang Bridge)
  const slowZoom = interpolate(frame, [0, totalFrames], [1.0, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gerak napas dan kedip cahaya sangat pelan
  const slowBreath = 1 + 0.012 * Math.sin((frame * 2 * Math.PI) / 110);
  const glowPulse = 0.55 + 0.45 * Math.sin((frame * 2 * Math.PI) / 95);

  // Kemunculan gelembung pikiran dengan spring lembut
  const bubbleSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 20, stiffness: 60, mass: 1.2 },
  });

  return (
    <SketchBackground mode="night" bgName="bg_dark_plain">
      <BoilFilter scale={2.2} frameInterval={4} />

      {/* 1. LetterTiles Mode 'glow' (8 Kotak Bersinar Samar di Kegelapan) */}
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
        <LetterTiles filled={5} mode="glow" theme="night" />
      </div>

      {/* 2. Panggung Malam yang Tenang & Pelan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${slowZoom})`,
          transformOrigin: "50% 50%",
        }}
      >
        {/* Bintang-bintang kapur yang muncul perlahan satu demi satu */}
        {NIGHT_STARS.map((st, idx) => {
          const starLocal = Math.max(0, frame - st.delay);
          const starAppear = interpolate(starLocal, [0, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const twinkle =
            0.45 + 0.55 * Math.sin((frame * 2 * Math.PI) / 90 + idx * 1.6);

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: st.x,
                top: st.y,
                opacity: starAppear * twinkle,
                filter: `drop-shadow(0 0 8px ${mvConfig.colors.glowNight})`,
                pointerEvents: "none",
              }}
            >
              {idx % 2 === 0 ? (
                <Star
                  size={st.size}
                  progress={starAppear}
                  color={mvConfig.colors.chalkNight}
                />
              ) : (
                <Sparkle
                  size={st.size}
                  progress={starAppear}
                  color={mvConfig.colors.glowNight}
                />
              )}
            </div>
          );
        })}

        {/* Ray Memejamkan Mata (ray_eyesclosed) di Kiri-Tengah */}
        <div
          style={{
            position: "absolute",
            left: 470,
            top: 320,
            transform: `scaleY(${slowBreath})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Sprite
            name="ray_eyesclosed"
            x={0}
            y={0}
            width={290}
            height={395}
            idle={false}
            blink={false}
            boil={true}
          />
        </div>

        {/* Gelembung Pikiran Kapur di Atas Kepala Ray Berisi Sol (sol_eyesclosed -> sol_smile) */}
        <div
          style={{
            position: "absolute",
            left: 820,
            top: 155,
            width: 480,
            height: 440,
            opacity: interpolate(bubbleSpring, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `scale(${interpolate(bubbleSpring, [0, 1], [0.88, 1])})`,
            filter: `url(#${BOIL_FILTER_ID})`,
          }}
        >
          {/* Pendaran cahaya hangat malam di belakang gelembung pikiran */}
          <div
            style={{
              position: "absolute",
              inset: 20,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255, 182, 92, ${
                0.22 * glowPulse
              }) 0%, rgba(255, 182, 92, 0) 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* Garis Kapur Gelembung Pikiran */}
          <svg
            width={480}
            height={440}
            viewBox="0 0 480 440"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            {/* Awan gelembung pikiran besar */}
            <path
              d="M 110 210 C 75 180, 85 115, 140 100 C 165 55, 245 45, 285 80 C 340 60, 405 100, 395 160 C 430 195, 415 265, 365 285 C 345 330, 265 340, 225 315 C 170 335, 105 300, 110 245 Z"
              fill="rgba(31, 35, 64, 0.82)"
              stroke={mvConfig.colors.chalkNight}
              strokeWidth={2.8}
              strokeDasharray="10 6"
            />
            {/* Tiga lingkaran penghubung ke kepala Ray di kiri bawah */}
            <circle
              cx={82}
              cy={315}
              r={16}
              fill="rgba(31, 35, 64, 0.82)"
              stroke={mvConfig.colors.chalkNight}
              strokeWidth={2.5}
            />
            <circle
              cx={44}
              cy={348}
              r={11}
              fill="rgba(31, 35, 64, 0.82)"
              stroke={mvConfig.colors.chalkNight}
              strokeWidth={2.2}
            />
            <circle
              cx={14}
              cy={375}
              r={6.5}
              fill="rgba(31, 35, 64, 0.82)"
              stroke={mvConfig.colors.chalkNight}
              strokeWidth={2}
            />
          </svg>

          {/* Sosok Sol di Dalam Gelembung Pikiran */}
          <div
            style={{
              position: "absolute",
              left: 135,
              top: 75,
              width: 230,
              height: 245,
              overflow: "hidden",
              borderRadius: 90,
            }}
          >
            <Sprite
              name={isMindLineActive ? "sol_smile" : "sol_eyesclosed"}
              x={10}
              y={5}
              width={210}
              height={275}
              flip={true}
              idle={true}
              blink={!isMindLineActive}
              boil={true}
            />
          </div>

          {/* Hati & kilau lembut di tepi gelembung pikiran saat "It's you there in my mind" */}
          {isMindLineActive && (
            <div
              style={{
                position: "absolute",
                right: 65,
                top: 65,
                opacity: glowPulse,
              }}
            >
              <Heart
                size={46}
                progress={1}
                color={mvConfig.colors.glowNight}
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Lirik Pendek, Besar, di Bawah, dengan Tema Kapur Malam */}
      <LyricBlock
        lines={section.lines}
        sectionStart={section.start}
        align="bottom"
        theme="night"
        fontSize={78}
      />
    </SketchBackground>
  );
};
