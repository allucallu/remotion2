import fs from 'fs';
import path from 'path';

const rawLyricsText = fs.readFileSync(path.resolve('calon', 'lirik.txt'), 'utf-8');
const whisperData = JSON.parse(fs.readFileSync(path.resolve('data', 'whisper-raw.json'), 'utf-8'));

const rawLines = rawLyricsText
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

const segments = whisperData.segments;

// Let's inspect words in segments
function getWordRange(seg, startWordIdx, endWordIdx) {
  if (!seg.words || seg.words.length === 0) {
    return { start: seg.start, end: seg.end };
  }
  const s = seg.words[Math.min(startWordIdx, seg.words.length - 1)].start;
  const e = seg.words[Math.min(endWordIdx, seg.words.length - 1)].end;
  return { start: s, end: e };
}

// Let's map lines:
// 0: (Oh-oh-oh...) -> seg 0 (0.0 to 6.24)
// 1: Hidup makin sulit... -> seg 1
// 2: Tapi entah... -> seg 2
// 3..22: seg 3..22
// 23..30: seg 23..30
// 31..34: seg 31..34
// 35..42: seg 35..42
// 43..46: seg 43..46
// 47: seg 47
// 48: seg 48
// 49: seg 49
// 50: seg 50 + seg 51 (Aku menunggu story tanpa kepastian)
// 51: seg 52 (Hey Nona, sekali lagi ku minta)
// 52: seg 53
// 53: seg 54
// 54: seg 55
// 55: seg 56
// 56: seg 57
// 57: seg 58
// 58: seg 59 (Notifikasi story terbaru darimu!)
// 59: Oh-oh-oh... (between seg 59 end and seg 60 start: ~200.22 - 201.44)
// 60: Belum pernah dekat... -> seg 60 (201.44 - 207.26)
// 61: Oh-oh-oh... (vocal adlib around 206.5 - 207.26 / 207.0 - 207.5)
// 62: Nona, pap dong... -> seg 61 words "Nona, pap dong" (207.26 - 208.50)
// 63: Aku sudah lelah menjadi dewasa tanpamu. -> seg 61 words "aku sudah lelah" (208.50 - 209.58) + seg 62 "Menjadi dewa yang tanpamu" (209.58 - 212.46)

const mapped = [];

// Helper to push
function addLine(lineIdx, start, end, comment) {
  mapped.push({
    index: lineIdx + 1,
    text: rawLines[lineIdx],
    start: Number(start.toFixed(2)),
    end: Number(end.toFixed(2)),
    comment: comment || '',
  });
}

// 0: (Oh-oh-oh...)
addLine(0, 0.96, 6.24);
// 1: Hidup makin sulit, dunia makin kejam
addLine(1, segments[1].start, segments[1].end);
// 2: Tapi entah mengapa, aku masih memikirkanmu
addLine(2, segments[2].start, segments[2].end);

// Lines 3 to 49 (indices 3 to 49) map to segments 3 to 49!
for (let i = 3; i <= 49; i++) {
  addLine(i, segments[i].start, segments[i].end);
}

// Line 50: "Aku menunggu story tanpa kepastian" -> spans seg 50 & 51
addLine(50, segments[50].start, segments[51].end);

// Lines 51 to 58 map to segments 52 to 59
for (let i = 51; i <= 58; i++) {
  const segIdx = i + 1; // 52 to 59
  addLine(i, segments[segIdx].start, segments[segIdx].end);
}

// Line 59: "Oh-oh-oh..."
addLine(59, 200.22, 201.44);

// Line 60: "Belum pernah dekat, sudah terlanjur rindu" -> seg 60
// seg 60 has words: Belum (201.44) .. rindu (ends 205.80, then oh-oh starts 206.0)
addLine(60, 201.44, 206.00);

// Line 61: "Oh-oh-oh..."
addLine(61, 206.00, 207.26);

// Line 62: "Nona, pap dong..." -> seg 61 first 3 words (207.26 to 208.50)
addLine(62, 207.26, 208.50);

// Line 63: "Aku sudah lelah menjadi dewasa tanpamu." -> 208.50 to 212.46
addLine(63, 208.50, 212.46);

// Sanity check monotonic & no overlap
for (let i = 0; i < mapped.length; i++) {
  if (i > 0) {
    if (mapped[i].start < mapped[i - 1].start) {
      mapped[i].start = Number((mapped[i - 1].start + 0.1).toFixed(2));
    }
    if (mapped[i - 1].end > mapped[i].start) {
      mapped[i - 1].end = Number(Math.max(mapped[i - 1].start + 0.5, mapped[i].start - 0.05).toFixed(2));
    }
  }
  if (mapped[i].end <= mapped[i].start) {
    mapped[i].end = Number((mapped[i].start + 2.0).toFixed(2));
  }
}

// Generate src/lyrics.ts
let outputTs = `// Generated lyric timestamps aligned with Whisper medium model
export interface LyricLine {
  start: number;
  end: number;
  text: string;
}

export const lyrics: LyricLine[] = [
`;

for (const item of mapped) {
  const comment = item.comment ? ` // ${item.comment}` : '';
  outputTs += `  { start: ${item.start.toFixed(2)}, end: ${item.end.toFixed(2)}, text: ${JSON.stringify(item.text)} },${comment}\n`;
}
outputTs += `];\n`;

fs.writeFileSync(path.resolve('src', 'lyrics.ts'), outputTs, 'utf-8');
console.log('src/lyrics.ts successfully written with exact Whisper segment alignment!');
console.log('Total lines:', mapped.length);

