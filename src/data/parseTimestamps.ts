export interface RawTimestampWord {
  word: string;
  start: number; // detik
  end: number;   // detik
}

export interface RawTimestampLine {
  text: string;
  start: number; // detik
  end: number;   // detik
  words: RawTimestampWord[];
}

export function normalizeTimeToSeconds(val: number, isMilliseconds: boolean): number {
  return isMilliseconds ? val / 1000 : val;
}

export function detectIsMilliseconds(timestamps: number[]): boolean {
  if (timestamps.length === 0) return false;
  const maxVal = Math.max(...timestamps);
  // Lagu berdurasi umumnya di bawah 900 detik (15 menit). Jika nilai > 1500, pasti milidetik.
  return maxVal > 1500;
}

export function distributeWordsByLetterCount(
  text: string,
  lineStart: number,
  lineEnd: number
): RawTimestampWord[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  if (words.length === 1) {
    return [{ word: words[0], start: lineStart, end: lineEnd }];
  }

  const totalChars = words.reduce((acc, w) => acc + w.length, 0);
  const totalDuration = Math.max(0.1, lineEnd - lineStart);
  let currentStart = lineStart;

  return words.map((w, idx) => {
    const charWeight = w.length / totalChars;
    const wordDuration = idx === words.length - 1
      ? lineEnd - currentStart
      : totalDuration * charWeight;
    const start = currentStart;
    const end = Math.min(lineEnd, start + wordDuration);
    currentStart = end;
    return { word: w, start, end };
  });
}

export function parseTimestampData(jsonInput: unknown): RawTimestampLine[] {
  if (!jsonInput || typeof jsonInput !== "object") {
    throw new Error("Format JSON timestamp tidak valid: bukan objek/array");
  }

  const data = jsonInput as Record<string, unknown>;
  const sampleTimes: number[] = [];

  // Format 1: Format Whisper dengan properti `segments`
  if (Array.isArray(data.segments)) {
    const segments = data.segments as Array<Record<string, unknown>>;
    for (const seg of segments) {
      if (typeof seg.start === "number") sampleTimes.push(seg.start);
      if (typeof seg.end === "number") sampleTimes.push(seg.end);
    }
    const isMs = detectIsMilliseconds(sampleTimes);

    return segments.map((seg) => {
      const start = normalizeTimeToSeconds(Number(seg.start || 0), isMs);
      const end = normalizeTimeToSeconds(Number(seg.end || 0), isMs);
      const text = String(seg.text || "").trim();

      let words: RawTimestampWord[] = [];
      if (Array.isArray(seg.words) && seg.words.length > 0) {
        words = (seg.words as Array<Record<string, unknown>>).map((w) => {
          const wStart = normalizeTimeToSeconds(Number(w.start ?? start), isMs);
          const wEnd = normalizeTimeToSeconds(Number(w.end ?? end), isMs);
          const wordText = String(w.word ?? w.text ?? "").trim();
          return { word: wordText, start: wStart, end: wEnd };
        });
      } else {
        words = distributeWordsByLetterCount(text, start, end);
      }

      return { text, start, end, words };
    });
  }

  // Format 2: Array langsung (bisa array baris atau array kata)
  const list = (Array.isArray(jsonInput) ? jsonInput : []) as Array<Record<string, unknown>>;
  if (list.length === 0) {
    return [];
  }

  for (const item of list) {
    if (typeof item.start === "number") sampleTimes.push(item.start);
    if (typeof item.startS === "number") sampleTimes.push(item.startS);
    if (typeof item.end === "number") sampleTimes.push(item.end);
    if (typeof item.endS === "number") sampleTimes.push(item.endS);
  }
  const isMs = detectIsMilliseconds(sampleTimes);

  // Periksa apakah format per-kata Suno aligned lyrics: { word, startS, endS }
  const isDirectWordFormat = list.every((item) => item.word !== undefined || (item.text && String(item.text).split(/\s+/).length === 1));

  if (isDirectWordFormat) {
    // Kumpulkan per kata lalu kelompokkan atau return baris tunggal
    const words: RawTimestampWord[] = list.map((item) => {
      const rawStart = Number(item.start ?? item.startS ?? 0);
      const rawEnd = Number(item.end ?? item.endS ?? rawStart + 0.5);
      const word = String(item.word ?? item.text ?? "").trim();
      return {
        word,
        start: normalizeTimeToSeconds(rawStart, isMs),
        end: normalizeTimeToSeconds(rawEnd, isMs),
      };
    });

    const overallStart = words[0]?.start ?? 0;
    const overallEnd = words[words.length - 1]?.end ?? 0;
    return [{
      text: words.map((w) => w.word).join(" "),
      start: overallStart,
      end: overallEnd,
      words,
    }];
  }

  // Format per baris: { text, start, end, words?: [...] }
  return list.map((item) => {
    const rawStart = Number(item.start ?? item.startS ?? 0);
    const rawEnd = Number(item.end ?? item.endS ?? rawStart + 2);
    const start = normalizeTimeToSeconds(rawStart, isMs);
    const end = normalizeTimeToSeconds(rawEnd, isMs);
    const text = String(item.text ?? item.line ?? "").trim();

    let words: RawTimestampWord[] = [];
    if (Array.isArray(item.words) && item.words.length > 0) {
      words = (item.words as Array<Record<string, unknown>>).map((w) => ({
        word: String(w.word ?? w.text ?? "").trim(),
        start: normalizeTimeToSeconds(Number(w.start ?? start), isMs),
        end: normalizeTimeToSeconds(Number(w.end ?? end), isMs),
      }));
    } else {
      words = distributeWordsByLetterCount(text, start, end);
    }

    return { text, start, end, words };
  });
}
