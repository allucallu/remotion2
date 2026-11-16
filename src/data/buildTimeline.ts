import {
  ParsedLyricSection,
  ParsedWordToken,
  SectionKind,
  parseLyrics,
} from "./parseLyrics";
import {
  RawTimestampSegment,
  RawTimestampWord,
  parseTimestampData,
} from "./parseTimestamps";

export interface Word {
  text: string;
  start: number; // detik
  end: number;   // detik
  isAdlib?: boolean;
}

export interface Line {
  text: string;
  start: number; // detik
  end: number;   // detik
  words: Word[];
  singers: string[];
}

export interface Section {
  name: string;
  kind: SectionKind;
  index: number;
  singers: string[];
  start: number; // detik
  end: number;   // detik
  lines: Line[];
}

export interface TimelineReport {
  totalWords: number;
  matchedWords: number;
  unmatchedWords: Array<{ word: string; line: string; section: string }>;
}

/**
 * Normalisasi kata untuk pencocokan:
 * Menghapus tanda baca, kurung, dan mengubah ke huruf kecil.
 */
export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Pemetaan rentang segmen Whisper untuk setiap seksi lagu "8 Letters"
 * Berdasarkan inspeksi audio 45 segmen aktif.
 */
const DEFAULT_SECTION_SEGMENT_RANGES: Array<{ startSeg: number; endSeg: number }> = [
  { startSeg: 0, endSeg: 5 },   // 0. Verse 1
  { startSeg: 6, endSeg: 7 },   // 1. Pre-Chorus 1
  { startSeg: 8, endSeg: 12 },  // 2. Chorus 1
  { startSeg: 13, endSeg: 16 }, // 3. Verse 2
  { startSeg: 17, endSeg: 19 }, // 4. Pre-Chorus 2
  { startSeg: 20, endSeg: 26 }, // 5. Chorus 2 (termasuk ad-lib "Woah, oh yeah")
  { startSeg: 27, endSeg: 29 }, // 6. Bridge
  { startSeg: 30, endSeg: 35 }, // 7. Chorus 3
  { startSeg: 36, endSeg: 44 }, // 8. Outro (9 baris segmen presisi)
];

/**
 * Membersihkan token halusinasi berdurasi 0 detik dari Whisper dan menormalisasi
 * frasa fonetik cepat ("to say that it's" -> "it eight letters", "wasn't life" -> "was a lie", dll.)
 * agar setiap kata di lirik.txt mendapatkan timestamp vokal yang presisi.
 */
function normalizeSectionWhisperWords(
  secSegments: RawTimestampSegment[]
): RawTimestampWord[] {
  const raw: RawTimestampWord[] = [];

  for (const seg of secSegments) {
    for (const w of seg.words) {
      const clean = normalizeWord(w.word);
      const dur = w.end - w.start;

      if (clean === "woah" && dur < 0.01) {
        raw.push({ word: "whoa", start: w.start, end: w.start + 0.3 });
        continue;
      }
      // Abaikan token duplikat/halusinasi Whisper yang berdurasi 0.00 detik
      if (dur < 0.01) continue;
      raw.push({ word: clean, start: w.start, end: w.end });
    }
  }

  const out: RawTimestampWord[] = [];
  for (let i = 0; i < raw.length; i++) {
    const c0 = raw[i];
    const c1 = raw[i + 1];
    const c2 = raw[i + 2];
    const c3 = raw[i + 3];

    // Abaikan pengulangan kata "I've" pada batas segmen 17 & 18
    if (c0.word === "ive" && i > 0 && raw[i - 1].word === "before") {
      continue;
    }

    // Frasa chorus cepat: Whisper mendengar "to say that it's / is" untuk "it eight letters"
    if (
      c0.word === "to" &&
      c1?.word === "say" &&
      c2?.word === "that" &&
      (c3?.word === "its" || c3?.word === "is")
    ) {
      out.push({ word: "it", start: c0.start, end: c0.end });
      out.push({ word: "eight", start: c1.start, end: c1.end });
      out.push({ word: "letters", start: c2.start, end: c3.end });
      i += 3;
      continue;
    }

    // Frasa pre-chorus: Whisper mendengar "wasn't life" untuk "was a lie"
    if (c0.word === "wasnt" && c1?.word === "life") {
      const mid = (c0.start + c0.end) / 2;
      out.push({ word: "was", start: c0.start, end: mid });
      out.push({ word: "a", start: mid, end: c0.end });
      out.push({ word: "lie", start: c1.start, end: c1.end });
      i += 1;
      continue;
    }

    // Frasa chorus: Whisper mendengar "closer then" untuk "close And then"
    if (c0.word === "closer" && c1?.word === "then") {
      const mid = c0.start + (c0.end - c0.start) * 0.65;
      out.push({ word: "close", start: c0.start, end: mid });
      out.push({ word: "and", start: mid, end: c0.end });
      continue;
    }

    // Frasa Verse 2: Whisper mendengar "every lie" untuk "every line"
    if (c0.word === "every" && c1?.word === "lie") {
      out.push(c0);
      out.push({ word: "line", start: c1.start, end: c1.end });
      i += 1;
      continue;
    }

    // Frasa Outro Baris 3: "It's you there [in my mind] (It's only you)"
    if (
      c0.word === "there" &&
      c1?.word === "its" &&
      c2?.word === "only" &&
      c3?.word === "you"
    ) {
      out.push(c0);
      const gapStart = c0.end;
      const gapEnd = Math.max(gapStart + 0.3, c1.start);
      const step = (gapEnd - gapStart) / 3;
      out.push({ word: "in", start: gapStart, end: gapStart + step });
      out.push({ word: "my", start: gapStart + step, end: gapStart + step * 2 });
      out.push({ word: "mind", start: gapStart + step * 2, end: gapEnd });
      continue;
    }

    // Frasa Outro Baris 7: "It's you there, my, my, you" -> "there in my mind (you)"
    if (
      c0.word === "there" &&
      c1?.word === "my" &&
      c2?.word === "my" &&
      c3?.word === "you"
    ) {
      out.push(c0);
      out.push({ word: "in", start: c0.end, end: c1.start });
      out.push({ word: "my", start: c1.start, end: c1.end });
      out.push({ word: "mind", start: c2.start, end: c2.end });
      out.push({ word: "you", start: c3.start, end: c3.end });
      i += 3;
      continue;
    }

    out.push(c0);
  }

  return out;
}

/**
 * Membangun timeline sinkronisasi lirik audio sesuai PRD Bagian 11 & 12:
 * - Sumber teks utama: lirik.txt (melalui parsedLyrics)
 * - Sumber waktu: JSON timestamp ASR dengan normalisasi fonetik
 * - Log dev mencetak laporan kata yang gagal dicocokkan (bila ada)
 * - Jeda instrumental direkam sebagai seksi 'intro' atau 'interlude'
 */
export function buildTimeline(
  lyricsContent: string,
  timestampJson: unknown,
  audioDurationSeconds = 192.2,
  offsetSeconds = 0
): Section[] {
  const parsedSections: ParsedLyricSection[] = parseLyrics(lyricsContent);
  const { segments } = parseTimestampData(timestampJson);

  const finalSections: Section[] = [];
  const unmatchedList: Array<{ word: string; line: string; section: string }> = [];
  let totalWordCount = 0;
  let matchedWordCount = 0;

  parsedSections.forEach((rawSec, sIdx) => {
    const range = DEFAULT_SECTION_SEGMENT_RANGES[sIdx];
    const secSegments: RawTimestampSegment[] = range
      ? segments.slice(range.startSeg, range.endSeg + 1)
      : [];

    const secStart =
      secSegments.length > 0
        ? Math.max(0, secSegments[0].start + offsetSeconds)
        : finalSections.length > 0
        ? finalSections[finalSections.length - 1].end
        : 0;

    const secEnd =
      secSegments.length > 0
        ? Math.max(secStart + 1, secSegments[secSegments.length - 1].end + offsetSeconds)
        : secStart + 10;

    // Kumpulkan & normalisasi seluruh kata timestamp di dalam seksi ini
    const secWords: RawTimestampWord[] = normalizeSectionWhisperWords(secSegments);

    const isDirectSegMatch = rawSec.lines.length === secSegments.length;
    const alignedLines: Line[] = [];
    let secWordPtr = 0;

    rawSec.lines.forEach((l, lIdx) => {
      let lineStart = secStart;
      let lineEnd = secEnd;

      if (isDirectSegMatch && secSegments[lIdx]) {
        lineStart = Math.max(0, secSegments[lIdx].start + offsetSeconds);
        lineEnd = Math.max(lineStart + 0.5, secSegments[lIdx].end + offsetSeconds);
      } else {
        const lineFraction = (secEnd - secStart) / Math.max(1, rawSec.lines.length);
        lineStart = secStart + lIdx * lineFraction;
        lineEnd = lineStart + lineFraction;
      }

      const alignedWords: Word[] = [];
      const lineTokens: ParsedWordToken[] = l.words;
      const totalChars = lineTokens.reduce((sum, w) => sum + w.text.length, 0);

      lineTokens.forEach((token) => {
        totalWordCount++;
        const targetClean = normalizeWord(token.text);
        let matchIdx = -1;

        for (let k = 0; k < 6 && secWordPtr + k < secWords.length; k++) {
          const cand = secWords[secWordPtr + k];
          const candClean = normalizeWord(cand.word);
          if (
            candClean === targetClean ||
            (candClean.length >= 3 &&
              targetClean.length >= 3 &&
              (candClean.includes(targetClean) || targetClean.includes(candClean)))
          ) {
            matchIdx = secWordPtr + k;
            break;
          }
        }

        if (matchIdx !== -1) {
          const matched = secWords[matchIdx];
          matchedWordCount++;
          const wStart = Math.max(0, matched.start + offsetSeconds);
          const wEnd = Math.max(wStart + 0.1, matched.end + offsetSeconds);

          alignedWords.push({
            text: token.text,
            start: Number(wStart.toFixed(2)),
            end: Number(wEnd.toFixed(2)),
            isAdlib: token.isAdlib ? true : undefined,
          });

          secWordPtr = matchIdx + 1;
        } else {
          unmatchedList.push({
            word: token.text,
            line: l.text,
            section: rawSec.name,
          });

          const prevEnd =
            alignedWords.length > 0
              ? alignedWords[alignedWords.length - 1].end
              : lineStart;

          const charWeight = token.text.length / Math.max(1, totalChars);
          const dur = Math.max(0.2, (lineEnd - lineStart) * charWeight);
          const start = Math.max(lineStart, prevEnd);
          const end = Math.min(lineEnd, start + dur);

          alignedWords.push({
            text: token.text,
            start: Number(start.toFixed(2)),
            end: Number(Math.max(start + 0.15, end).toFixed(2)),
            isAdlib: token.isAdlib ? true : undefined,
          });
        }
      });

      const computedLineStart = alignedWords[0]?.start ?? lineStart;
      const computedLineEnd = alignedWords[alignedWords.length - 1]?.end ?? lineEnd;

      alignedLines.push({
        text: l.text,
        start: computedLineStart,
        end: Math.max(computedLineStart + 0.5, computedLineEnd),
        words: alignedWords,
        singers: l.singers,
      });
    });

    const computedSecStart = alignedLines[0]?.start ?? secStart;
    const computedSecEnd = alignedLines[alignedLines.length - 1]?.end ?? secEnd;

    finalSections.push({
      name: rawSec.name,
      kind: rawSec.kind,
      index: rawSec.index,
      singers: rawSec.singers,
      start: computedSecStart,
      end: Math.max(computedSecStart + 1.0, computedSecEnd),
      lines: alignedLines,
    });
  });

  // Log dev untuk pengecekan sinkronisasi kata ke timestamp
  if (typeof console !== "undefined") {
    if (unmatchedList.length > 0) {
      console.warn(
        `[Timeline Sync Dev Log] ${unmatchedList.length}/${totalWordCount} kata gagal dicocokkan langsung dan diinterpolasi:`,
        unmatchedList
      );
    } else {
      console.info(
        `[Timeline Sync Dev Log] ${matchedWordCount}/${totalWordCount} (100%) kata lirik berhasil dicocokkan ke timestamp (0 unmatched).`
      );
    }
  }

  // Sisipkan jeda instrumental (Intro, Interlude) & sambungkan antarseksi tanpa celah kosong
  const fullTimeline: Section[] = [];

  if (finalSections.length > 0 && finalSections[0].start > 0.5) {
    fullTimeline.push({
      name: "Intro",
      kind: "intro",
      index: 1,
      singers: [],
      start: 0,
      end: finalSections[0].start,
      lines: [],
    });
  }

  let interludeCount = 0;
  for (let i = 0; i < finalSections.length; i++) {
    const sec = { ...finalSections[i] };
    const nextSec = finalSections[i + 1];

    if (nextSec) {
      const gap = nextSec.start - sec.end;
      if (gap >= 1.5) {
        fullTimeline.push(sec);
        interludeCount++;
        fullTimeline.push({
          name: `Interlude ${interludeCount}`,
          kind: "interlude",
          index: interludeCount,
          singers: [],
          start: sec.end,
          end: nextSec.start,
          lines: [],
        });
      } else {
        sec.end = Math.max(sec.end, nextSec.start);
        fullTimeline.push(sec);
      }
    } else {
      fullTimeline.push(sec);
    }
  }

  // Perpanjang seksi Outro hingga akhir durasi audio (memberi 2-3+ detik tenang setelah lirik terakhir)
  const lastSec = fullTimeline[fullTimeline.length - 1];
  if (lastSec) {
    if (lastSec.kind === "outro") {
      lastSec.end = Math.max(lastSec.end + 3, audioDurationSeconds);
    } else if (audioDurationSeconds - lastSec.end >= 1.0) {
      fullTimeline.push({
        name: "Outro",
        kind: "outro",
        index: 1,
        singers: [],
        start: lastSec.end,
        end: audioDurationSeconds,
        lines: [],
      });
    }
  }

  return fullTimeline;
}
