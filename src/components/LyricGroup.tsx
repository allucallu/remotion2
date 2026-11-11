import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { mvConfig } from "../config";
import { PreparedGroup } from "../layout";
import { getLineBoilTransform } from "./LineBoilFilter";

const gaegu = loadGaegu("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

interface LyricGroupProps {
  group: PreparedGroup;
  durationInFrames: number;
}

export const LyricGroup: React.FC<LyricGroupProps> = ({
  group,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animasi keluar seluruh grup (fade out di 10 frame terakhir)
  const exitFrames = Math.min(10, Math.floor(durationInFrames * 0.15));
  const exitStart = Math.max(1, durationInFrames - exitFrames);
  const groupExitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Pergeseran pelan ke atas sepanjang grup tampil
  const groupDriftY = interpolate(frame, [0, durationInFrames], [0, -10], {
    extrapolateRight: "clamp",
  });

  // Render kata demi kata dengan efek tulis tangan (wipe + pop)
  const renderLineWords = (
    line: PreparedGroup["lines"][number],
    lineLocalIdx: number
  ) => {
    const lineStartFrame = Math.round((line.start - group.start) * fps);
    const lineDurationFrames = Math.max(
      1,
      Math.round((line.end - line.start) * fps)
    );

    // Jika belum saatnya baris ini masuk, jangan render
    if (frame < lineStartFrame) {
      return null;
    }

    const currentLineFrame = frame - lineStartFrame;
    const words = line.text.split(" ");
    const totalWords = words.length;
    const enterWindow = Math.max(1, lineDurationFrames * 0.65);
    const stagger = totalWords > 1 ? enterWindow / (totalWords - 1) : 0;

    // Tentukan ukuran font berdasarkan preset
    let fontSize: number = mvConfig.lyricFontSize;
    if (line.size === "large") fontSize = 66;
    if (line.size === "compact") fontSize = 44;

    return (
      <div
        key={`group-${group.groupId}-line-${line.lineIndex}`}
        style={{
          display: "flex",
          flexWrap: "wrap",
          columnGap: 18,
          rowGap: 10,
          margin: "14px 0",
          justifyContent:
            group.layout === "right-block"
              ? "flex-end"
              : group.layout === "center"
              ? "center"
              : "flex-start",
        }}
      >
        {words.map((word, wIdx) => {
          const wordStartFrame = wIdx * stagger;
          const wordFrame = Math.max(0, currentLineFrame - wordStartFrame);

          // Animasi tulis: wipe kiri ke kanan + spring pop
          const writeSpring = spring({
            frame: wordFrame,
            fps,
            config: {
              damping: 18,
              stiffness: 140,
              mass: 0.6,
            },
          });

          const wipeProgress = interpolate(writeSpring, [0, 1], [0, 1]);
          const translateY = interpolate(writeSpring, [0, 1], [14, 0]);

          // Efek goyang line-boil deterministik per kata
          const boil = getLineBoilTransform(
            frame,
            `g${group.groupId}-l${lineLocalIdx}-w${wIdx}`
          );

          return (
            <span
              key={wIdx}
              style={{
                fontFamily: gaegu.fontFamily,
                fontSize,
                fontWeight: line.size === "large" ? 700 : 400,
                color: mvConfig.ink.primary,
                letterSpacing: mvConfig.lyricLetterSpacing,
                lineHeight: mvConfig.lyricLineHeight,
                clipPath: `inset(0% ${(1 - wipeProgress) * 100}% 0% 0%)`,
                transform: `${boil.transform} translateY(${translateY}px)`,
                display: "inline-block",
                textShadow: "0 1px 2px rgba(255, 255, 255, 0.45)",
                filter: "url(#line-boil-filter)",
                willChange: "transform, clip-path",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  // Posisi tata letak berdasarkan layout preset
  const renderLayoutContainer = () => {
    if (group.layout === "split" && group.lines.length >= 2) {
      // Split: Baris 1 di kiri-atas, Baris 2 di kanan-bawah
      return (
        <>
          <div
            style={{
              position: "absolute",
              left: 140,
              top: "28%",
              maxWidth: 720,
              textAlign: "left",
              transform: `translateY(${groupDriftY}px)`,
            }}
          >
            {renderLineWords(group.lines[0], 0)}
          </div>
          <div
            style={{
              position: "absolute",
              right: 140,
              top: "54%",
              maxWidth: 720,
              textAlign: "right",
              transform: `translateY(${groupDriftY}px)`,
            }}
          >
            {renderLineWords(group.lines[1], 1)}
          </div>
        </>
      );
    }

    if (group.layout === "left-block") {
      return (
        <div
          style={{
            position: "absolute",
            left: 150,
            top: "42%",
            transform: `translateY(-50%) translateY(${groupDriftY}px)`,
            maxWidth: 820,
            textAlign: "left",
          }}
        >
          {group.lines.map((l, idx) => renderLineWords(l, idx))}
        </div>
      );
    }

    if (group.layout === "right-block") {
      return (
        <div
          style={{
            position: "absolute",
            right: 150,
            top: "42%",
            transform: `translateY(-50%) translateY(${groupDriftY}px)`,
            maxWidth: 820,
            textAlign: "right",
          }}
        >
          {group.lines.map((l, idx) => renderLineWords(l, idx))}
        </div>
      );
    }

    // Default: Center
    // Khusus grup 1 (Oh-oh-oh di intro), posisikan di area bawah tengah agar tidak bertabrakan dengan Judul & Artis di atas
    const isIntroVocal = group.groupId === 1;

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: isIntroVocal ? "flex-end" : "center",
          paddingBottom: isIntroVocal ? 220 : 0,
          padding: isIntroVocal ? "0 100px 220px 100px" : "0 100px",
          textAlign: "center",
          transform: `translateY(${groupDriftY}px)`,
        }}
      >
        <div style={{ maxWidth: 1200 }}>
          {group.lines.map((l, idx) => renderLineWords(l, idx))}
        </div>
      </div>
    );
  };

  // Render Kata Kunci Emphasis Besar di Bagian Bawah Layar
  const renderEmphasis = () => {
    if (!group.emphasis) return null;

    const boil = getLineBoilTransform(frame, `g${group.groupId}-emphasis`);

    return (
      <div
        style={{
          position: "absolute",
          bottom: -35,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent:
            group.layout === "left-block"
              ? "flex-start"
              : group.layout === "right-block"
              ? "flex-end"
              : "center",
          padding: "0 80px",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: gaegu.fontFamily,
            fontSize: 165,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: mvConfig.ink.highlight,
            opacity: 0.26,
            transform: boil.transform,
            filter: "url(#line-boil-filter)",
            display: "inline-block",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {group.emphasis}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: groupExitOpacity,
        pointerEvents: "none",
      }}
    >
      {/* 1. Kata Kunci Emphasis di Latar Bawah */}
      {renderEmphasis()}

      {/* 2. Kontainer Lirik Utama Sesuai Layout */}
      {renderLayoutContainer()}
    </div>
  );
};

