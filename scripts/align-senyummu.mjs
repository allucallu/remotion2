import fs from "fs";

// Baca teks asli lirik
const rawLines = fs.readFileSync("calon/lirik.txt", "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean);

console.log(`Jumlah baris di lirik.txt: ${rawLines.length}`);

// Baca raw whisper timestamps
const whisper = JSON.parse(fs.readFileSync("calon/whisper-raw.json", "utf8"));

// Kumpulkan semua kata dengan timestamp
const allWords = [];
whisper.segments.forEach((seg) => {
  if (seg.words && seg.words.length > 0) {
    seg.words.forEach((w) => {
      allWords.push({
        word: w.word.trim().toLowerCase().replace(/[^\w]/g, ""),
        rawWord: w.word.trim(),
        start: w.start,
        end: w.end,
      });
    });
  }
});

console.log(`Total kata terdeteksi: ${allWords.length}`);

// Normalisasi untuk pencocokan
function cleanText(txt) {
  return txt.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
}

let currentWordIdx = 0;
const lyricLines = [];

for (let i = 0; i < rawLines.length; i++) {
  const lineText = rawLines[i];
  const targetTokens = cleanText(lineText);
  
  if (targetTokens.length === 0) continue;

  const firstToken = targetTokens[0];
  const lastToken = targetTokens[targetTokens.length - 1];

  // Cari token pertama di allWords
  let matchStartIdx = -1;
  for (let j = currentWordIdx; j < Math.min(allWords.length, currentWordIdx + 20); j++) {
    if (allWords[j].word.startsWith(firstToken.slice(0, 3)) || firstToken.startsWith(allWords[j].word.slice(0, 3))) {
      matchStartIdx = j;
      break;
    }
  }

  if (matchStartIdx === -1) {
    matchStartIdx = currentWordIdx;
  }

  // Estimasi durasi baris berdasarkan jumlah token
  let matchEndIdx = Math.min(allWords.length - 1, matchStartIdx + targetTokens.length - 1);
  
  // Periksa apakah token terakhir cocok di sekitar sana
  for (let k = matchStartIdx; k < Math.min(allWords.length, matchStartIdx + targetTokens.length + 4); k++) {
    if (allWords[k].word.startsWith(lastToken.slice(0, 3)) || lastToken.startsWith(allWords[k].word.slice(0, 3))) {
      matchEndIdx = k;
      break;
    }
  }

  const startTime = allWords[matchStartIdx] ? allWords[matchStartIdx].start : (lyricLines[i-1] ? lyricLines[i-1].end + 0.2 : 0);
  const endTime = allWords[matchEndIdx] ? allWords[matchEndIdx].end : startTime + 2.5;

  lyricLines.push({
    lineIndex: i + 1,
    start: Number(startTime.toFixed(2)),
    end: Number(endTime.toFixed(2)),
    text: lineText,
  });

  currentWordIdx = matchEndIdx + 1;
}

// Pastikan urutan waktu monotonically non-decreasing
for (let i = 1; i < lyricLines.length; i++) {
  if (lyricLines[i].start < lyricLines[i-1].start) {
    lyricLines[i].start = Number((lyricLines[i-1].end + 0.1).toFixed(2));
  }
  if (lyricLines[i].end <= lyricLines[i].start) {
    lyricLines[i].end = Number((lyricLines[i].start + 2.0).toFixed(2));
  }
}

// Tulis ke src/lyrics.ts
const tsContent = `// Generated lyric timestamps for "Tolong Unggah Senyummu"
// Sesuai persis dengan calon/lirik.txt tanpa mengubah atau membuang kata
export interface LyricLine {
  start: number;
  end: number;
  text: string;
}

export const lyrics: LyricLine[] = ${JSON.stringify(
  lyricLines.map(l => ({ start: l.start, end: l.end, text: l.text })),
  null,
  2
)};
`;

fs.writeFileSync("src/lyrics.ts", tsContent, "utf8");
console.log(`Berhasil menulis ${lyricLines.length} baris lirik ke src/lyrics.ts`);

