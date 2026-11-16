import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BoilFilter, BOIL_FILTER_ID } from "../components/BoilFilter";
import { Heart, MusicNote, Sparkle, Star } from "../components/Doodles";
import { Hatching } from "../components/Hatching";
import { LetterTiles } from "../components/LetterTiles";
import { ScribbleReveal } from "../components/ScribbleReveal";
import { BackgroundMode, SketchBackground } from "../components/SketchBackground";
import { Sprite } from "../components/Sprite";
import { mvConfig } from "../config";
import type { Section } from "../data/buildTimeline";

export interface InstrumentalSceneProps {
  section: Section;
}

export const InstrumentalScene: React.FC<InstrumentalSceneProps> = ({
  section,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = Math.max(60, Math.round((section.end - section.start) * fps));
  const isIntro = section.kind === "intro";
  const isNightInterlude = section.kind === "interlude" && section.index === 2;

  const bgMode: BackgroundMode = isNightInterlude ? "night" : "day";
  const bgName = isNightInterlude ? "bg_room_night" : "bg_paper_plain";

  // Kamera zoom pelan 4%
  const camZoom = interpolate(frame, [0, totalFrames], [1.0, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const textColor = isNightInterlude
    ? mvConfig.colors.chalkNight
    : mvConfig.colors.inkDark;

  return (
    <SketchBackground mode={bgMode} bgName={bgName}>
      <BoilFilter scale={2.6} />

      {/* Pada Interlude 1 & 2, pertahankan LetterTiles di bagian atas layar */}
      {!isIntro && (
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
            filled={isNightInterlude ? 5 : 1}
            mode={isNightInterlude ? "glow" : "struggle"}
            theme={isNightInterlude ? "night" : "day"}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${camZoom})`,
          transformOrigin: "50% 50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isIntro ? (
          /* INTRO (0.00s - 11.48s): Kartu Judul Sketsa "8 Letters" + Ray & Sol */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              filter: `url(#${BOIL_FILTER_ID})`,
            }}
          >
            {/* Barisan 8 Kotak Pembuka Judul */}
            <div
              style={{
                opacity: interpolate(titleSpring, [0, 1], [0, 1], {
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${interpolate(
                  titleSpring,
                  [0, 1],
                  [20, 0]
                )}px)`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: mvConfig.fonts.primary,
                  fontSize: 112,
                  fontWeight: 700,
                  color: mvConfig.colors.inkDark,
                  letterSpacing: "0.06em",
                  lineHeight: 1.05,
                }}
              >
                8 Letters
              </div>
              <div
                style={{
                  fontFamily: mvConfig.fonts.secondary,
                  fontSize: 48,
                  color: mvConfig.colors.pencilOrange,
                  marginTop: 4,
                }}
              >
                Why Don&apos;t We — Sketchbook Story
              </div>
              <div style={{ margin: "12px auto 0", width: 360 }}>
                <Hatching
                  width={360}
                  height={24}
                  angle={35}
                  spacing={12}
                  start={12}
                  duration={35}
                  color={mvConfig.colors.pencilOrange}
                />
              </div>
            </div>

            {/* Ilustrasi Pembuka Ray & Sol */}
            <ScribbleReveal
              width={720}
              height={420}
              strokeWidth={70}
              start={15}
              duration={28}
            >
              <div style={{ position: "relative", width: 720, height: 420 }}>
                <Sprite
                  name="ray_neutral"
                  x={90}
                  y={30}
                  width={250}
                  height={350}
                />
                <Sprite
                  name="sol_neutral"
                  x={380}
                  y={30}
                  width={250}
                  height={350}
                  flip={true}
                />
                <div style={{ position: "absolute", left: 335, top: 70 }}>
                  <MusicNote
                    size={52}
                    progress={interpolate(frame, [25, 65], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })}
                    color={mvConfig.colors.pencilOrange}
                  />
                </div>
              </div>
            </ScribbleReveal>
          </div>
        ) : (
          /* INTERLUDE 1 & 2: Jeda Musik Instrumental dengan Not Musik & Karakter */
          <ScribbleReveal
            width={780}
            height={520}
            strokeWidth={70}
            start={0}
            duration={20}
          >
            <div style={{ position: "relative", width: 780, height: 520 }}>
              <Sprite
                name={isNightInterlude ? "ray_eyesclosed" : "duo_sitting"}
                x={isNightInterlude ? 245 : 190}
                y={90}
                width={isNightInterlude ? 280 : 400}
                height={380}
              />

              {/* Not musik & bintang melayang mengikuti irama interlude */}
              {[
                { x: 130, y: 120, type: "note" },
                { x: 610, y: 110, type: "star" },
                { x: 170, y: 280, type: "sparkle" },
                { x: 580, y: 270, type: "heart" },
              ].map((d, idx) => {
                const floatY = Math.sin(frame * 0.1 + idx * 1.5) * 10;
                return (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: d.x,
                      top: d.y + floatY,
                    }}
                  >
                    {d.type === "note" && (
                      <MusicNote size={52} progress={1} color={textColor} />
                    )}
                    {d.type === "star" && (
                      <Star
                        size={50}
                        progress={1}
                        color={mvConfig.colors.pencilOrange}
                      />
                    )}
                    {d.type === "sparkle" && (
                      <Sparkle size={46} progress={1} />
                    )}
                    {d.type === "heart" && (
                      <Heart
                        size={48}
                        progress={1}
                        color={mvConfig.colors.pencilOrange}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </ScribbleReveal>
        )}
      </div>
    </SketchBackground>
  );
};
