import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { mvConfig } from "../config";

interface LyricLineProps {
  text: string;
  durationInFrames: number;
}

export const LyricLine: React.FC<LyricLineProps> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  // Stagger waktu masuk tiap kata agar terdistribusi merata sepanjang kalimat
  // Menyisakan waktu bagi penonton untuk membaca kalimat lengkap sebelum fade out
  const enterWindow = Math.max(1, durationInFrames * 0.6);
  const stagger = totalWords > 1 ? enterWindow / (totalWords - 1) : 0;

  // Baris bergerak pelan ke atas sepanjang durasi (continuous slow upward drift)
  const lineDriftY = interpolate(frame, [0, durationInFrames], [0, -18], {
    extrapolateRight: "clamp",
  });

  // Fade out halus di akhir baris (10 frame terakhir)
  const fadeOutFrames = Math.min(10, Math.floor(durationInFrames * 0.2));
  const fadeOutStart = Math.max(1, durationInFrames - fadeOutFrames);
  const lineExitOpacity = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          maxWidth: mvConfig.lyricMaxWidth,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: "14px",
          rowGap: "12px",
          textAlign: "center",
          transform: `translateY(${lineDriftY}px)`,
          opacity: lineExitOpacity,
        }}
      >
        {words.map((word, idx) => {
          const wordStartFrame = idx * stagger;
          const wordFrame = Math.max(0, frame - wordStartFrame);

          // Spring animation untuk kata: naik sedikit, fade in, blur ke tajam
          const wordSpring = spring({
            frame: wordFrame,
            fps,
            config: {
              damping: 18,
              stiffness: 140,
              mass: 0.7,
            },
          });

          const opacity = interpolate(wordSpring, [0, 1], [0, 1]);
          const translateY = interpolate(wordSpring, [0, 1], [16, 0]);
          const blur = interpolate(wordSpring, [0, 1], [8, 0]);

          return (
            <span
              key={`${idx}-${word}`}
              style={{
                fontFamily: mvConfig.fontFamily,
                fontSize: mvConfig.lyricFontSize,
                fontWeight: 600,
                color: mvConfig.colors.textPrimary,
                letterSpacing: mvConfig.lyricLetterSpacing,
                lineHeight: mvConfig.lyricLineHeight,
                opacity,
                transform: `translateY(${translateY}px)`,
                filter: `blur(${blur}px)`,
                textShadow:
                  "0 2px 20px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 0, 0, 0.6)",
                display: "inline-block",
                willChange: "transform, opacity, filter",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

