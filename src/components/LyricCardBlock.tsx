import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mvConfig } from "../config";
import { PreparedGroup } from "../layout";

interface LyricCardBlockProps {
  group: PreparedGroup;
  durationInFrames: number;
}

export const LyricCardBlock: React.FC<LyricCardBlockProps> = ({
  group,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi keluar grup
  const exitFrames = 12;
  const exitStart = Math.max(1, durationInFrames - exitFrames);
  const groupExitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pergeseran pelan ke atas
  const driftY = interpolate(frame, [0, durationInFrames], [0, -10], {
    extrapolateRight: "clamp",
  });

  const isLeft = group.layout === "left-block";
  const isRight = group.layout === "right-block";
  const isCenter = group.layout === "center";

  // Posisi kontainer lirik:
  // Jika left-block -> teks di kiri (left: 140px, max-width: 820px)
  // Jika right-block -> teks di kanan (right: 140px, max-width: 820px)
  // Jika center -> di tengah
  let containerStyle: React.CSSProperties = {
    position: "absolute",
    top: "42%",
    transform: `translateY(-50%) translateY(${driftY}px)`,
    maxWidth: 840,
    opacity: groupExitOpacity,
    display: "flex",
    flexDirection: "column",
    gap: 22,
  };

  if (isLeft) {
    containerStyle = { ...containerStyle, left: 140, textAlign: "left" };
  } else if (isRight) {
    containerStyle = { ...containerStyle, right: 140, textAlign: "right", alignItems: "flex-end" };
  } else {
    containerStyle = {
      ...containerStyle,
      left: "50%",
      transform: `translate(-50%, -50%) translateY(${driftY}px)`,
      textAlign: "center",
      alignItems: "center",
      maxWidth: 1080,
    };
  }

  return (
    <div style={containerStyle}>
      {group.lines.map((line, localIdx) => {
        const lineStartFrame = Math.round((line.start - group.start) * fps);
        const lineDurationFrames = Math.max(1, Math.round((line.end - line.start) * fps));

        // Jika belum saatnya baris ini masuk
        if (frame < lineStartFrame) {
          return null;
        }

        const lineCurrentFrame = frame - lineStartFrame;

        // Animasi masuk baris (smooth fade up)
        const lineSpring = spring({
          frame: lineCurrentFrame,
          fps,
          config: { damping: 18, stiffness: 90, mass: 0.8 },
        });

        const lineOpacity = interpolate(lineSpring, [0, 1], [0, 1]);
        const lineTranslateY = interpolate(lineSpring, [0, 1], [18, 0]);

        const words = line.text.split(" ");
        const isHighlightLine = group.isChorus && localIdx === 0;

        return (
          <div
            key={`grp-${group.groupId}-line-${line.lineIndex}`}
            style={{
              opacity: lineOpacity,
              transform: `translateY(${lineTranslateY}px)`,
              display: "flex",
              flexWrap: "wrap",
              columnGap: 14,
              rowGap: 8,
              justifyContent: isRight ? "flex-end" : isCenter ? "center" : "flex-start",
            }}
          >
            {words.map((word, wIdx) => {
              // Word-by-word reveal wipe
              const enterWindow = Math.max(1, lineDurationFrames * 0.7);
              const stagger = words.length > 1 ? enterWindow / (words.length - 1) : 0;
              const wordEnterFrame = wIdx * stagger;
              const wordSpring = spring({
                frame: Math.max(0, lineCurrentFrame - wordEnterFrame),
                fps,
                config: { damping: 15, stiffness: 120, mass: 0.6 },
              });

              const wordWipe = interpolate(wordSpring, [0, 1], [0, 1]);
              const wordPopY = interpolate(wordSpring, [0, 1], [10, 0]);

              return (
                <span
                  key={`w-${line.lineIndex}-${wIdx}`}
                  style={{
                    fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif",
                    fontSize: isHighlightLine ? mvConfig.fonts.lyricSize + 6 : mvConfig.fonts.lyricSize,
                    fontWeight: isHighlightLine ? 700 : localIdx === 0 ? 600 : 400,
                    color: isHighlightLine
                      ? mvConfig.theme.accentAmber
                      : localIdx === 0
                      ? mvConfig.theme.textPrimary
                      : mvConfig.theme.textSecondary,
                    letterSpacing: "-0.01em",
                    lineHeight: mvConfig.fonts.lyricLineHeight,
                    clipPath: `inset(0% ${(1 - wordWipe) * 100}% 0% 0%)`,
                    transform: `translateY(${wordPopY}px)`,
                    display: "inline-block",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.7)",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

