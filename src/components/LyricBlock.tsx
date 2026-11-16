import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { getSingerColor, getSingerGradient, mvConfig } from "../config";
import type { Line, Word } from "../data/buildTimeline";

export type LyricAlign = "left" | "right" | "bottom";
export type LyricTheme = "day" | "night";

export interface LyricBlockProps {
  /** Daftar baris lirik (bisa 2-4 baris langsung, atau seluruh baris seksi untuk dikelompokkan otomatis) */
  lines: Line[];
  /** Posisi tata letak blok lirik di layar ('left' | 'right' | 'bottom' | 'auto', default: 'auto') */
  align?: LyricAlign | "auto";
  /** Sisi layar yang sedang ditempati ilustrasi karakter agar LyricBlock otomatis memilih sisi kosong */
  occupiedSide?: "left" | "right" | "top";
  /** Tema warna teks ('day' -> tinta navy #1B1A2E, 'night' -> kapur #F4EFE2) */
  theme?: LyricTheme;
  /** Waktu mulai seksi dalam detik jika komponen berada di dalam <Sequence from={...}> */
  sectionStart?: number;
  /** Override waktu audio aktif dalam detik (opsional) */
  currentTimeSec?: number;
  /** Ukuran font utama dalam px (default: 72 sesuai PRD) */
  fontSize?: number;
  /** Jika true, gunakan posisi relatif (bukan absolute penuh layar), berguna untuk showcase/panel */
  inline?: boolean;
  style?: React.CSSProperties;
}

/**
 * Membagi daftar baris menjadi kelompok berisi 2–4 baris yang seimbang.
 */
function groupLinesIntoChunks(lines: Line[]): Line[][] {
  const n = lines.length;
  if (n === 0) return [];
  if (n <= 4) return [lines];

  // Untuk 6 baris -> 2 kelompok @ 3 baris; 9 baris -> 3 kelompok @ 3 baris
  if (n % 3 === 0) {
    const chunks: Line[][] = [];
    for (let i = 0; i < n; i += 3) {
      chunks.push(lines.slice(i, i + 3));
    }
    return chunks;
  }

  // Untuk 8 baris -> 2 kelompok @ 4 baris; lainnya bagi per 4 atau 3 baris
  const chunks: Line[][] = [];
  let i = 0;
  while (i < n) {
    const remaining = n - i;
    if (remaining === 5) {
      chunks.push(lines.slice(i, i + 3));
      chunks.push(lines.slice(i + 3, i + 5));
      break;
    }
    const step = remaining >= 4 ? 4 : remaining;
    chunks.push(lines.slice(i, i + step));
    i += step;
  }
  return chunks;
}

function cleanToken(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Mengecek apakah kata pada indeks `wIdx` adalah bagian dari frasa "eight letters"
 */
function isPartOfEightLetters(words: Word[], wIdx: number): boolean {
  const curr = cleanToken(words[wIdx]?.text ?? "");
  const next = cleanToken(words[wIdx + 1]?.text ?? "");
  const prev = cleanToken(words[wIdx - 1]?.text ?? "");

  if (curr === "eight" && next === "letters") return true;
  if (curr === "letters" && prev === "eight") return true;
  return false;
}

export const LyricBlock: React.FC<LyricBlockProps> = ({
  lines,
  align = "auto",
  occupiedSide,
  theme = "day",
  sectionStart = 0,
  currentTimeSec,
  fontSize = 72,
  inline = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hitung waktu lagu saat ini dalam detik
  const currentSec =
    typeof currentTimeSec === "number"
      ? currentTimeSec
      : sectionStart + frame / fps;

  // Kelompokkan baris menjadi grup 2–4 baris dan pilih grup yang aktif beserta indeksnya
  const { activeGroup, activeChunkIndex } = useMemo(() => {
    const chunks = groupLinesIntoChunks(lines);
    if (chunks.length === 0) return { activeGroup: [] as Line[], activeChunkIndex: 0 };
    if (chunks.length === 1) return { activeGroup: chunks[0], activeChunkIndex: 0 };

    // Cari grup yang rentang waktunya menaungi currentSec
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const nextChunk = chunks[i + 1];
      const chunkEnd = nextChunk
        ? nextChunk[0].start - 0.15
        : chunk[chunk.length - 1].end + 2;

      if (currentSec <= chunkEnd) {
        return { activeGroup: chunk, activeChunkIndex: i };
      }
    }
    return {
      activeGroup: chunks[chunks.length - 1],
      activeChunkIndex: chunks.length - 1,
    };
  }, [lines, currentSec]);

  if (activeGroup.length === 0) {
    return null;
  }

  // Penentuan otomatis sisi kosong agar tidak pernah menutupi wajah karakter
  const resolvedAlign: LyricAlign =
    occupiedSide === "left"
      ? "right"
      : occupiedSide === "right"
      ? "left"
      : occupiedSide === "top"
      ? "bottom"
      : align === "auto"
      ? activeChunkIndex % 2 === 0
        ? "right"
        : "left"
      : align;

  const isNight = theme === "night";
  const baseTextColor = isNight
    ? mvConfig.colors.chalkNight
    : mvConfig.colors.inkDark;

  // Penataan posisi berdasarkan `resolvedAlign` dengan garansi Safe Area 96px
  const alignmentStyle: React.CSSProperties = inline
    ? {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems:
          resolvedAlign === "left"
            ? "flex-start"
            : resolvedAlign === "right"
            ? "flex-end"
            : "center",
        textAlign:
          resolvedAlign === "left"
            ? "left"
            : resolvedAlign === "right"
            ? "right"
            : "center",
      }
    : {
        position: "absolute",
        top: resolvedAlign === "bottom" ? "auto" : mvConfig.safeArea + 96,
        bottom: mvConfig.safeArea,
        left: resolvedAlign === "right" ? "auto" : mvConfig.safeArea,
        right: resolvedAlign === "left" ? "auto" : mvConfig.safeArea,
        maxWidth: resolvedAlign === "bottom" ? 1560 : 780,
        margin: resolvedAlign === "bottom" ? "0 auto" : undefined,
        display: "flex",
        flexDirection: "column",
        justifyContent: resolvedAlign === "bottom" ? "flex-end" : "center",
        alignItems:
          resolvedAlign === "left"
            ? "flex-start"
            : resolvedAlign === "right"
            ? "flex-end"
            : "center",
        textAlign:
          resolvedAlign === "left"
            ? "left"
            : resolvedAlign === "right"
            ? "right"
            : "center",
        pointerEvents: "none",
      };

  return (
    <div
      style={{
        ...alignmentStyle,
        gap: 18,
        fontFamily: mvConfig.fonts.primary,
        color: baseTextColor,
        zIndex: 10,
        ...style,
      }}
    >
      {activeGroup.map((line, lIdx) => {
        const isPastLine = currentSec > line.end + 0.15;
        const isFutureLine = currentSec < line.start - 0.05;

        // Baris lampau memudar halus ke opasitas 0.35 sesuai PRD Bagian 8
        const lineOpacity = isPastLine
          ? interpolate(
              currentSec,
              [line.end, line.end + 0.35],
              [1, 0.35],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          : 1;

        // Progres garis bawah penyanyi mengikuti durasi baris
        const underlineProgress = interpolate(
          currentSec,
          [line.start, line.end],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const singers = line.singers ?? [];
        const hasMultipleSingers = singers.length >= 2;
        const primarySingerColor =
          singers.length > 0
            ? getSingerColor(singers[0])
            : mvConfig.colors.pencilOrange;
        const secondarySingerColor =
          singers.length > 1
            ? getSingerColor(singers[1])
            : primarySingerColor;
        const singerGradient = getSingerGradient(singers);

        return (
          <div
            key={`${line.text}-${line.start}-${lIdx}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                resolvedAlign === "left"
                  ? "flex-start"
                  : resolvedAlign === "right"
                  ? "flex-end"
                  : "center",
              opacity: lineOpacity,
              position: "relative",
            }}
          >
            {/* Baris Kata-Kata */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent:
                  resolvedAlign === "left"
                    ? "flex-start"
                    : resolvedAlign === "right"
                    ? "flex-end"
                    : "center",
                alignItems: "baseline",
                gap: "6px 16px",
                lineHeight: 1.22,
              }}
            >
              {line.words.map((word, wIdx) => {
                const isAdlib = Boolean(word.isAdlib);
                const isEightLetters = isPartOfEightLetters(line.words, wIdx);

                // Hitung frame relatif sejak start kata
                const framesSinceStart = (currentSec - word.start) * fps;
                const hasWordStarted = framesSinceStart >= 0;

                // Spring kemunculan kata ("ditulis": wipe kiri->kanan + translateY 6px -> 0)
                const writeSpring = hasWordStarted
                  ? spring({
                      frame: framesSinceStart,
                      fps,
                      config: { damping: 14, stiffness: 160, mass: 0.55 },
                    })
                  : 0;

                const rightClipPercent = interpolate(
                  writeSpring,
                  [0, 1],
                  [100, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const translateY = interpolate(
                  writeSpring,
                  [0, 1],
                  [6, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                // Highlight Karaoke Stabilo Kuning (#F4B942) selama start -> end
                const isWordActive =
                  currentSec >= word.start && currentSec <= word.end + 0.05;
                const karaokeSweep = interpolate(
                  currentSec,
                  [word.start, Math.max(word.start + 0.08, word.end)],
                  [0, 100],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                // Ukuran & jenis font (Ad-lib: Reenie Beanie, 60% size, opasitas 0.8, rotasi -3°)
                const wordFontSize = isAdlib
                  ? Math.round(fontSize * 0.6)
                  : fontSize;
                const wordFontFamily = isAdlib
                  ? mvConfig.fonts.secondary
                  : mvConfig.fonts.primary;

                return (
                  <span
                    key={`${word.text}-${wIdx}`}
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      fontFamily: wordFontFamily,
                      fontSize: wordFontSize,
                      color: baseTextColor,
                      opacity: isAdlib ? 0.8 : 1,
                      transform: `translateY(${translateY}px) ${
                        isAdlib ? "rotate(-3deg)" : ""
                      }`,
                      clipPath: `inset(-20% ${rightClipPercent}% -25% -8%)`,
                      padding: "0 2px",
                      whiteSpace: "pre",
                    }}
                  >
                    {/* Sapuan Stabilo Kuning Karaoke */}
                    {isWordActive && (
                      <span
                        style={{
                          position: "absolute",
                          left: -6,
                          top: "14%",
                          bottom: "10%",
                          width: `${karaokeSweep}%`,
                          paddingRight: 10,
                          backgroundColor: mvConfig.colors.blushYellow,
                          opacity: isNight ? 0.45 : 0.65,
                          borderRadius: "6px 10px 8px 6px",
                          transform: "rotate(-1deg)",
                          zIndex: -1,
                          pointerEvents: "none",
                        }}
                      />
                    )}

                    {/* Render Khusus Frasa "eight letters": Tiap Huruf dalam Kotak Tipis + Garis Bawah Ganda */}
                    {isEightLetters ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          position: "relative",
                          paddingBottom: 4,
                        }}
                      >
                        {word.text.split("").map((ch, cIdx) => {
                          const isAlpha = /[a-zA-Z0-9]/.test(ch);
                          if (!isAlpha) {
                            return <span key={cIdx}>{ch}</span>;
                          }
                          return (
                            <span
                              key={cIdx}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: Math.round(wordFontSize * 0.62),
                                height: Math.round(wordFontSize * 0.88),
                                padding: "0 4px",
                                border: `2px solid ${
                                  isNight
                                    ? mvConfig.colors.glowNight
                                    : mvConfig.colors.pencilOrange
                                }`,
                                borderRadius: 6,
                                backgroundColor: isNight
                                  ? "rgba(255, 182, 92, 0.14)"
                                  : "rgba(255, 247, 227, 0.92)",
                                boxShadow: `1px 2px 0px ${
                                  isNight
                                    ? "rgba(255,182,92,0.3)"
                                    : "rgba(217,83,43,0.25)"
                                }`,
                                lineHeight: 1,
                              }}
                            >
                              {ch}
                            </span>
                          );
                        })}
                        {/* Garis bawah ganda khusus untuk frasa "eight letters" */}
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: -3,
                            height: 5,
                            borderTop: `2px solid ${mvConfig.colors.pencilOrange}`,
                            borderBottom: `2px solid ${mvConfig.colors.pencilOrange}`,
                          }}
                        />
                      </span>
                    ) : (
                      word.text
                    )}
                  </span>
                );
              })}
            </div>

            {/* Garis Bawah Beraksen Penyanyi (Muncul Mengikuti Progres Baris) */}
            {!isFutureLine && (
              <div
                style={{
                  marginTop: 4,
                  width: `${Math.max(8, underlineProgress * 100)}%`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  opacity: 0.9,
                }}
              >
                {/* Garis utama (gradien bila multi-penyanyi, solid bila 1 penyanyi) */}
                <div
                  style={{
                    height: 4,
                    width: "100%",
                    borderRadius: 3,
                    background: hasMultipleSingers
                      ? singerGradient
                      : primarySingerColor,
                  }}
                />
                {/* Garis kedua paralel jika terdapat >= 2 penyanyi pada baris tersebut */}
                {hasMultipleSingers && (
                  <div
                    style={{
                      height: 3,
                      width: "92%",
                      alignSelf:
                        resolvedAlign === "right"
                          ? "flex-end"
                          : resolvedAlign === "left"
                          ? "flex-start"
                          : "center",
                      borderRadius: 3,
                      backgroundColor: secondarySingerColor,
                      opacity: 0.85,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
