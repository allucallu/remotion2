import { ParsedRawSection, parseLyricsFile, SectionKind } from "./parseLyrics";
import { parseTimestampData, RawTimestampLine, RawTimestampWord } from "./parseTimestamps";

export interface Word {
  text: string;
  start: number; // detik
  end: number;   // detik
}

export interface Line {
  text: string;
  start: number; // detik
  end: number;   // detik
  words: Word[];
}

export interface Section {
  name: string;
  kind: SectionKind;
  start: number; // detik
  end: number;   // detik
  lines: Line[];
}

export function normalizeWord(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function buildTimeline(
  lyricsContent: string,
  timestampJson: unknown,
  audioDurationSeconds = 277.2,
  offsetSeconds = 0
): Section[] {
  // 1. Parsing dokumen lirik resmi
  const rawSections: ParsedRawSection[] = parseLyricsFile(lyricsContent);

  // 2. Parsing timestamp JSON
  const rawLines: RawTimestampLine[] = parseTimestampData(timestampJson);

  // 3. Ekstraksi semua kata dari timestamp JSON
  // Abaikan halusinasi Whisper di bagian intro sebelum 14 detik jika teksnya bukan bagian lirik
  const allTimestampWords: RawTimestampWord[] = [];
  for (const line of rawLines) {
    if (line.start < 14 && line.text.toLowerCase().includes("menarik")) {
      continue;
    }
    allTimestampWords.push(...line.words);
  }

  // 4. Penyelarasan kata berurutan (Sequential Alignment)
  let wordPtr = 0;
  const sectionsWithoutIntervals: Array<{
    name: string;
    kind: SectionKind;
    lines: Line[];
  }> = [];

  for (const sec of rawSections) {
    const alignedLines: Line[] = [];

    for (const lineText of sec.lines) {
      const targetWords = lineText.split(/\s+/).filter(Boolean);
      const alignedWords: Word[] = [];

      for (const targetWord of targetWords) {
        const targetNorm = normalizeWord(targetWord);
        let matchIdx = -1;

        // Pencarian dengan lookahead hingga 7 kata untuk fleksibilitas fonetik
        for (
          let k = 0;
          k < 7 && wordPtr + k < allTimestampWords.length;
          k++
        ) {
          const candNorm = normalizeWord(allTimestampWords[wordPtr + k].word);
          if (
            candNorm === targetNorm ||
            candNorm.includes(targetNorm) ||
            targetNorm.includes(candNorm)
          ) {
            matchIdx = wordPtr + k;
            break;
          }
        }

        if (matchIdx !== -1) {
          const matched = allTimestampWords[matchIdx];
          alignedWords.push({
            text: targetWord,
            start: Math.max(0, matched.start + offsetSeconds),
            end: Math.max(0, matched.end + offsetSeconds),
          });
          wordPtr = matchIdx + 1;
        } else {
          console.warn(
            `[Timeline Alignment] Kata tidak cocok sempurna: "${targetWord}" di baris "${lineText}". Menggunakan estimasi waktu.`
          );
          const prevEnd =
            alignedWords.length > 0
              ? alignedWords[alignedWords.length - 1].end
              : wordPtr < allTimestampWords.length
              ? Math.max(0, allTimestampWords[wordPtr].start + offsetSeconds)
              : 0;
          alignedWords.push({
            text: targetWord,
            start: prevEnd,
            end: prevEnd + 0.35,
          });
        }
      }

      const lineStart = alignedWords[0]?.start ?? 0;
      const lineEnd = alignedWords[alignedWords.length - 1]?.end ?? lineStart + 2;
      alignedLines.push({
        text: lineText,
        start: lineStart,
        end: lineEnd,
        words: alignedWords,
      });
    }

    sectionsWithoutIntervals.push({
      name: sec.name,
      kind: sec.kind,
      lines: alignedLines,
    });
  }

  // 5. Menghitung rentang waktu seksi (termasuk seksi instrumental Intro & Outro)
  const finalSections: Section[] = [];

  for (let i = 0; i < sectionsWithoutIntervals.length; i++) {
    const sec = sectionsWithoutIntervals[i];
    let start = 0;
    let end = 0;

    if (sec.kind === "intro") {
      start = 0;
      const nextSec = sectionsWithoutIntervals[i + 1];
      end = nextSec && nextSec.lines.length > 0 ? nextSec.lines[0].start : 16.34;
    } else if (sec.kind === "outro") {
      const prevSec = finalSections[i - 1];
      start = prevSec ? prevSec.end : (sec.lines[0]?.start ?? 240);
      end = Math.max(start + 5, audioDurationSeconds);
    } else {
      if (sec.lines.length > 0) {
        start = sec.lines[0].start;
        const nextSec = sectionsWithoutIntervals[i + 1];
        if (nextSec && nextSec.lines.length > 0) {
          end = nextSec.lines[0].start;
        } else {
          end = sec.lines[sec.lines.length - 1].end + 0.5;
        }
      } else {
        const prevSec = finalSections[i - 1];
        start = prevSec ? prevSec.end : 0;
        end = start + 5;
      }
    }

    finalSections.push({
      name: sec.name,
      kind: sec.kind,
      start,
      end,
      lines: sec.lines,
    });
  }

  return finalSections;
}
