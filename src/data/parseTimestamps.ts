export interface RawTimestampWord {
  word: string;
  start: number; // detik
  end: number;   // detik
  probability?: number;
}

export interface RawTimestampSegment {
  text: string;
  start: number; // detik
  end: number;   // detik
  words: RawTimestampWord[];
}

export function detectIsMilliseconds(timestamps: number[]): boolean {
  if (timestamps.length === 0) return false;
  const maxVal = Math.max(...timestamps);
  // Lagu berdurasi umumnya di bawah 900 detik (15 menit). Jika nilai > 1500, pasti milidetik.
  return maxVal > 1500;
}

export function normalizeTimeToSeconds(val: number, isMilliseconds: boolean): number {
  return isMilliseconds ? val / 1000 : val;
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
    const charWeight = w.length / Math.max(1, totalChars);
    const wordDuration =
      idx === words.length - 1
        ? lineEnd - currentStart
        : totalDuration * charWeight;
    const start = currentStart;
    const end = Math.min(lineEnd, start + wordDuration);
    currentStart = end;
    return { word: w, start, end };
  });
}

/**
 * Parsing data timestamp JSON dari Whisper atau sistem ASR lainnya:
 * - Deteksi otomatis detik vs milidetik
 * - Ekstraksi segmen per-baris dan kata per-kata
 */
export function parseTimestampData(jsonInput: unknown): {
  segments: RawTimestampSegment[];
  words: RawTimestampWord[];
} {
  if (!jsonInput || typeof jsonInput !== "object") {
    throw new Error("Format JSON timestamp tidak valid: bukan objek/array");
  }

  const data = jsonInput as Record<string, unknown>;
  const sampleTimes: number[] = [];

  // Kasus 1: Output Whisper standar (memiliki properti `segments`)
  if (Array.isArray(data.segments)) {
    const rawSegments = data.segments as Array<Record<string, unknown>>;
    for (const seg of rawSegments) {
      if (typeof seg.start === "number") sampleTimes.push(seg.start);
      if (typeof seg.end === "number") sampleTimes.push(seg.end);
    }
    const isMs = detectIsMilliseconds(sampleTimes);

    const segments: RawTimestampSegment[] = rawSegments
      .map((seg) => {
        const start = normalizeTimeToSeconds(Number(seg.start ?? 0), isMs);
        const end = normalizeTimeToSeconds(Number(seg.end ?? 0), isMs);
        const text = String(seg.text ?? "").trim();

        let words: RawTimestampWord[] = [];
        if (Array.isArray(seg.words) && seg.words.length > 0) {
          words = (seg.words as Array<Record<string, unknown>>).map((w) => {
            const wStart = normalizeTimeToSeconds(Number(w.start ?? start), isMs);
            const wEnd = normalizeTimeToSeconds(Number(w.end ?? end), isMs);
            const rawWord = String(w.word ?? w.text ?? "").trim();
            const prob = typeof w.probability === "number" ? w.probability : undefined;
            return { word: rawWord, start: wStart, end: wEnd, probability: prob };
          });
        } else if (text.length > 0) {
          words = distributeWordsByLetterCount(text, start, end);
        }

        return { text, start, end, words };
      })
      .filter((s) => s.text.length > 0 || s.words.length > 0);

    const words = segments.flatMap((s) => s.words);
    return { segments, words };
  }

  // Kasus 2: Array langsung (bisa daftar kata atau segmen)
  const list = (Array.isArray(jsonInput) ? jsonInput : []) as Array<Record<string, unknown>>;
  for (const item of list) {
    if (typeof item.start === "number") sampleTimes.push(item.start);
    if (typeof item.end === "number") sampleTimes.push(item.end);
  }
  const isMs = detectIsMilliseconds(sampleTimes);

  // Jika item berupa per-kata langsung
  const isWordList = list.every((item) => !Array.isArray(item.words) && (item.word || item.text));
  if (isWordList) {
    const words: RawTimestampWord[] = list.map((item) => ({
      word: String(item.word ?? item.text ?? "").trim(),
      start: normalizeTimeToSeconds(Number(item.start ?? 0), isMs),
      end: normalizeTimeToSeconds(Number(item.end ?? 0), isMs),
      probability: typeof item.probability === "number" ? item.probability : undefined,
    }));

    return {
      segments: [
        {
          text: words.map((w) => w.word).join(" "),
          start: words[0]?.start ?? 0,
          end: words[words.length - 1]?.end ?? 0,
          words,
        },
      ],
      words,
    };
  }

  // Segmen biasa
  const segments: RawTimestampSegment[] = list.map((item) => {
    const start = normalizeTimeToSeconds(Number(item.start ?? 0), isMs);
    const end = normalizeTimeToSeconds(Number(item.end ?? 0), isMs);
    const text = String(item.text ?? item.line ?? "").trim();
    const rawWords = Array.isArray(item.words) ? (item.words as Array<Record<string, unknown>>) : [];
    const words =
      rawWords.length > 0
        ? rawWords.map((w) => ({
            word: String(w.word ?? w.text ?? "").trim(),
            start: normalizeTimeToSeconds(Number(w.start ?? start), isMs),
            end: normalizeTimeToSeconds(Number(w.end ?? end), isMs),
            probability: typeof w.probability === "number" ? w.probability : undefined,
          }))
        : distributeWordsByLetterCount(text, start, end);

    return { text, start, end, words };
  });

  return { segments, words: segments.flatMap((s) => s.words) };
}
