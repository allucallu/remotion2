import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";
import { mvConfig } from "../config";
import type { Line } from "../data/buildTimeline";
import { Highlighter } from "./Highlighter";
import type { PaperMode } from "./PaperBackground";

const { fontFamily: patrickHandFont } = loadPatrickHand();

interface LyricBlockProps {
  /** Kelompok 2-4 baris lirik yang ditampilkan bersamaan */
  lines: Line[];
  /** Posisi perataan blok di layar */
  align?: "left" | "right";
  /** Waktu mulai seksi/sequence dalam detik (agar sinkron dengan line.start/end absolut) */
  sectionStart?: number;
  /** Mode kertas (day/night/golden) untuk menyesuaikan kontras tinta */
  mode?: PaperMode;
  /** Ukuran font dasar (default: 72px sesuai PRD) */
  fontSize?: number;
}

/**
 * Merender satu bait kecil (2-4 baris lirik) bergaya tulisan tangan Patrick Hand,
 * dilengkapi animasi muncul per kata, stabilo kata aktif, pemudaran baris lampau,
 * dan gaya khusus kata kunci (Nona, senyum, rindu).
 */
export const LyricBlock: React.FC<LyricBlockProps> = ({
  lines,
  align = "left",
  sectionStart = 0,
  mode = "day",
  fontSize = 72,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSec = sectionStart + frame / fps;
  const isNight = mode === "night";
  const inkColor = isNight
    ? mvConfig.palette.nightChalk
    : mvConfig.palette.penBlue;

  const isRight = align === "right";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        alignItems: isRight ? "flex-end" : "flex-start",
        textAlign: isRight ? "right" : "left",
        fontFamily: `${patrickHandFont}, 'Segoe UI', cursive`,
        maxWidth: 860,
      }}
    >
      {lines.map((line, lIdx) => {
        // Baris yang belum waktunya tampil disembunyikan sementara
        if (currentSec < line.start - 0.1) {
          return null;
        }

        // Baris yang sudah lewat memudar ke opasitas 0.35 secara halus
        const passedOpacity = interpolate(
          currentSec,
          [line.end, line.end + 0.35],
          [1, 0.35],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={`lyric-line-${lIdx}`}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              justifyContent: isRight ? "flex-end" : "flex-start",
              columnGap: 16,
              rowGap: 10,
              opacity: passedOpacity,
              lineHeight: 1.25,
            }}
          >
            {line.words.map((word, wIdx) => {
              const wordElapsedSec = currentSec - word.start;
              const wordFrame = wordElapsedSec * fps;

              // Sebelum start kata: tetap tersembunyi (atau belum ditulis)
              const hasStarted = wordFrame >= 0;

              const writeSpring = hasStarted
                ? spring({
                    frame: wordFrame,
                    fps,
                    config: { damping: 16, stiffness: 125, mass: 0.6 },
                  })
                : 0;

              const clipRightPct = (1 - writeSpring) * 100;
              const translateY = interpolate(writeSpring, [0, 1], [6, 0]);

              // Progres sapuan stabilo kuning kata aktif
              const highlightProgress = interpolate(
                currentSec,
                [word.start, Math.max(word.start + 0.08, word.end)],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              // Opasitas stabilo meredup lembut setelah kata selesai dinyanyikan
              const highlightOpacity = interpolate(
                currentSec,
                [word.end, word.end + 0.3],
                [0.72, 0.22],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              // Deteksi kata kunci khusus sesuai PRD Bagian 5
              const cleanText = word.text.toLowerCase();
              const isNona = cleanText.includes("nona");
              const isSenyum = cleanText.includes("senyum");
              const isRindu = cleanText.includes("rindu");

              const wordFontSize = isNona ? fontSize * 1.12 : fontSize;
              const wordColor = isNona
                ? mvConfig.palette.highlighterPink
                : inkColor;

              return (
                <span
                  key={`w-${lIdx}-${wIdx}`}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    fontSize: wordFontSize,
                    fontWeight: isNona ? 700 : 400,
                    color: wordColor,
                    opacity: hasStarted ? 1 : 0,
                    clipPath: `inset(-15% ${clipRightPct}% -25% 0%)`,
                    transform: `translateY(${translateY}px)`,
                    zIndex: 1,
                  }}
                >
                  {/* Sapuan Stabilo Kuning (atau Mint lembut saat malam) di belakang kata */}
                  {hasStarted && (
                    <Highlighter
                      progress={highlightProgress}
                      opacity={highlightOpacity}
                      color={
                        isNight
                          ? "rgba(154, 219, 197, 0.45)"
                          : isNona
                          ? "rgba(255, 143, 168, 0.35)"
                          : mvConfig.palette.highlighterYellow
                      }
                    />
                  )}

                  {word.text}

                  {/* Garis Bawah Gelombang untuk kata "senyum" / "senyummu" */}
                  {isSenyum && hasStarted && (
                    <svg
                      viewBox="0 0 100 14"
                      preserveAspectRatio="none"
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: -6,
                        width: "100%",
                        height: 12,
                        overflow: "visible",
                        pointerEvents: "none",
                      }}
                    >
                      <path
                        d="M 0 7 Q 12.5 1, 25 7 T 50 7 T 75 7 T 100 7"
                        fill="none"
                        stroke={mvConfig.palette.highlighterPink}
                        strokeWidth={3.5}
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1"
                        strokeDashoffset={1 - writeSpring}
                      />
                    </svg>
                  )}

                  {/* Hati kecil melayang untuk kata "rindu" / "merindukan" */}
                  {isRindu && hasStarted && (
                    <svg
                      viewBox="0 0 24 24"
                      style={{
                        position: "absolute",
                        top: -12,
                        right: -18,
                        width: 24,
                        height: 24,
                        transform: `scale(${writeSpring}) rotate(12deg)`,
                        pointerEvents: "none",
                      }}
                    >
                      <path
                        d="M 12 20 C 12 20 4 14 4 8.5 C 4 5.5 6.5 3.5 9 3.5 C 10.7 3.5 12 4.8 12 4.8 C 12 4.8 13.3 3.5 15 3.5 C 17.5 3.5 20 5.5 20 8.5 C 20 14 12 20 12 20 Z"
                        fill={mvConfig.palette.highlighterPink}
                        stroke={mvConfig.palette.graphite}
                        strokeWidth={1.6}
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

