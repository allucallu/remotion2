import fs from "fs";

const rawLines = fs.readFileSync("calon/lirik.txt", "utf8")
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(Boolean);

console.log("Jumlah baris lirik.txt:", rawLines.length);

const whisper = JSON.parse(fs.readFileSync("calon/whisper-raw.json", "utf8"));
const segments = whisper.segments;

// Mapping presisi 48 baris ke segmen & word timestamps
const result = [];

// Baris 1: Hari ini panjang sekali (seg 1 kata 0..3)
result.push({
  start: 16.92,
  end: 21.26,
  text: rawLines[0] // Hari ini panjang sekali
});

// Baris 2: Dompet menipis, kepala berisi (seg 1 kata 4..5 + seg 2 kata 0..1)
result.push({
  start: 21.26,
  end: 25.38,
  text: rawLines[1] // Dompet menipis, kepala berisi
});

// Baris 3: Berita buruk datang silih berganti (seg 2 kata 2..4 + seg 3 kata 0..1)
result.push({
  start: 25.38,
  end: 29.78,
  text: rawLines[2] // Berita buruk datang silih berganti
});

// Baris 4: Punggung berderit sebelum pagi (seg 3 kata 2..5)
result.push({
  start: 30.20,
  end: 34.28,
  text: rawLines[3] // Punggung berderit sebelum pagi
});

// Baris 5 s/d 27: 1-to-1 mapping dengan segmen 4 s/d 26
// rawLines[4] (idx 4) -> segments[4]
for (let i = 4; i <= 26; i++) {
  const seg = segments[i];
  result.push({
    start: Number(seg.start.toFixed(2)),
    end: Number(seg.end.toFixed(2)),
    text: rawLines[i]
  });
}

// Baris 28 (idx 27): "Tapi angan-angan sudah ke mana-mana berkunjung" (seg 27 + kata 'Berkunjung' di seg 28)
// Kata 'Berkunjung' berakhir di 139.22
result.push({
  start: 134.84,
  end: 139.22,
  text: rawLines[27] // Tapi angan-angan sudah ke mana-mana berkunjung
});

// Baris 29 (idx 28): "Aku tak tahu apa yang kau pikirkan" (sisa seg 28: 139.22 -> 143.34)
result.push({
  start: 139.22,
  end: 143.34,
  text: rawLines[28] // Aku tak tahu apa yang kau pikirkan
});

// Baris 30 s/d 48 (idx 29 s/d 47): 1-to-1 mapping dengan segments[29] s/d segments[47]
for (let i = 29; i <= 47; i++) {
  const seg = segments[i];
  result.push({
    start: Number(seg.start.toFixed(2)),
    end: Number(seg.end.toFixed(2)),
    text: rawLines[i]
  });
}

console.log("Total baris terpetakan:", result.length);

// Verifikasi integritas: semua teks harus 100% sama dengan rawLines
for (let i = 0; i < rawLines.length; i++) {
  if (result[i].text !== rawLines[i]) {
    console.error(`Mismatch di baris ${i+1}:`);
    console.error(`  Expected: ${rawLines[i]}`);
    console.error(`  Got:      ${result[i].text}`);
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

export const lyrics: LyricLine[] = ${JSON.stringify(result, null, 2)};
`;

fs.writeFileSync("src/lyrics.ts", tsContent, "utf8");
console.log("src/lyrics.ts berhasil diperbarui!");

