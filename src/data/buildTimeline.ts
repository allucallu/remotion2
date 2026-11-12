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

const PHONETIC_ALIASES: Record<string, string> = {
  hey: "hei",
  hai: "hei",
  pakarmu: "kabarmu",
  kemanis: "manis",
  kata: "kita",
  how: "hal",
};

export function normalizeWord(s: string): string {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return PHONETIC_ALIASES[cleaned] ?? cleaned;
}

function shareStrongSimilarity(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;
  // Toleransi typo fonetik Whisper untuk kata panjang mirip
  const minLen = Math.min(a.length, b.length);
  if (minLen >= 3 && Math.abs(a.length - b.length) <= 2) {
    let matches = 0;
    for (let i = 0; i < minLen; i++) {
      if (a[i] === b[i]) matches++;
    }
    if (matches / Math.max(a.length, b.length) >= 0.6) return true;
  }
  return false;
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

  // 4. Penyelarasan kata berurutan (Sequential Alignment) + laporan dev kata tak cocok
  let wordPtr = 0;
  const unmatchedReport: Array<{
    word: string;
    line: string;
    estimatedStart: number;
  }> = [];
  const sectionsWithoutIntervals: Array<{
    name: string;
    kind: SectionKind;
    lines: Line[];
  }> = [];

  for (const sec of rawSections) {
    const alignedLines: Line[] = [];

    for (let lineIdx = 0; lineIdx < sec.lines.length; lineIdx++) {
      const lineText = sec.lines[lineIdx];
      const targetWords = lineText.split(/\s+/).filter(Boolean);
      const alignedWords: Word[] = [];

      for (let wIdx = 0; wIdx < targetWords.length; wIdx++) {
        const targetWord = targetWords[wIdx];
        const targetNorm = normalizeWord(targetWord);
        let matchIdx = -1;

        // Pencarian dengan lookahead hingga 7 kata untuk fleksibilitas fonetik
        for (
          let k = 0;
          k < 7 && wordPtr + k < allTimestampWords.length;
          k++
        ) {
          const candNorm = normalizeWord(allTimestampWords[wordPtr + k].word);
          if (shareStrongSimilarity(candNorm, targetNorm)) {
            matchIdx = wordPtr + k;
            break;
          }
        }

        // Fallback posisi terjepit: jika kata sesudahnya cocok tepat di wordPtr + 1
        if (matchIdx === -1 && wordPtr + 1 < allTimestampWords.length) {
          const nextTarget =
            targetWords[wIdx + 1] ?? sec.lines[lineIdx + 1]?.split(/\s+/)[0];
          if (nextTarget) {
            const nextNorm = normalizeWord(nextTarget);
            const nextCandNorm = normalizeWord(allTimestampWords[wordPtr + 1].word);
            if (shareStrongSimilarity(nextCandNorm, nextNorm)) {
              matchIdx = wordPtr;
            }
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
          const prevEnd =
            alignedWords.length > 0
              ? alignedWords[alignedWords.length - 1].end
              : wordPtr < allTimestampWords.length
              ? Math.max(0, allTimestampWords[wordPtr].start + offsetSeconds)
              : 0;
          unmatchedReport.push({
            word: targetWord,
            line: lineText,
            estimatedStart: Number(prevEnd.toFixed(2)),
          });
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

  if (typeof console !== "undefined") {
    if (unmatchedReport.length > 0) {
      console.warn(
        `[Timeline Sync Dev Log] ${unmatchedReport.length} kata tidak cocok dengan JSON timestamp:`,
        unmatchedReport
      );
    } else {
      console.info(
        "[Timeline Sync Dev Log] 100% kata lirik berhasil dicocokkan ke timestamp (0 unmatched)."
      );
    }
  }

  return finalSections;
}

