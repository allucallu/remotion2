import fs from 'fs';
import path from 'path';

const rawText = fs.readFileSync(path.resolve('calon', 'lirik.txt'), 'utf-8');
const rawLines = rawText
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

const tsContent = fs.readFileSync(path.resolve('src', 'lyrics.ts'), 'utf-8');

// Parse text fields from tsContent
const regex = /text:\s*"([^"]+)"/g;
let match;
const tsLines = [];
while ((match = regex.exec(tsContent)) !== null) {
  tsLines.push(match[1]);
}

console.log(`Jumlah baris lirik.txt : ${rawLines.length}`);
console.log(`Jumlah baris lyrics.ts : ${tsLines.length}`);

let anyDiff = false;
for (let i = 0; i < Math.max(rawLines.length, tsLines.length); i++) {
  const r = rawLines[i] ?? '<KOSONG>';
  const t = tsLines[i] ?? '<KOSONG>';
  if (r !== t) {
    console.log(`[BEDA di Baris ${i + 1}]`);
    console.log(`   TXT: "${r}"`);
    console.log(`    TS: "${t}"`);
    anyDiff = true;
  }
}

if (!anyDiff) {
  console.log('\nHASIL VERIFIKASI: 100% IDENTIK PERSIS, TIDAK ADA TYPO ATAU PERBEDAAN KARAKTER SAMA SEKALI!');
}

