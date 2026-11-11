import fs from 'fs';
import path from 'path';

const rawText = fs.readFileSync(path.resolve('calon', 'lirik.txt'), 'utf-8');
const rawLines = rawText
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

const whisper = JSON.parse(fs.readFileSync(path.resolve('data', 'whisper-raw.json'), 'utf-8'));

console.log('Perbandingan kata per baris antara lirik.txt vs lafal Whisper:');
for (let i = 0; i < rawLines.length; i++) {
  // Find corresponding segment
  // Lines 0..49 map to segments 0..49
  // Line 50 maps to seg 50+51
  // Lines 51..58 map to seg 52..59
  // Line 59 (Oh-oh-oh)
  // Line 60 (seg 60)
  // Line 61 (Oh-oh-oh)
  // Line 62, 63 (seg 61, 62)
  let whisperText = '';
  if (i <= 49) {
    whisperText = whisper.segments[i]?.text?.trim() || '';
  } else if (i === 50) {
    whisperText = (whisper.segments[50]?.text?.trim() || '') + ' ' + (whisper.segments[51]?.text?.trim() || '');
  } else if (i >= 51 && i <= 58) {
    whisperText = whisper.segments[i + 1]?.text?.trim() || '';
  } else if (i === 59) {
    whisperText = '(vocal harmony / adlib)';
  } else if (i === 60) {
    whisperText = whisper.segments[60]?.text?.trim() || '';
  } else if (i === 61) {
    whisperText = '(vocal harmony / adlib)';
  } else if (i === 62) {
    whisperText = 'Nona, pap dong';
  } else if (i === 63) {
    whisperText = 'aku sudah lelah Menjadi dewa yang tanpamu';
  }

  // Check if there is interesting deviation
  console.log(`[Baris ${i + 1}]`);
  console.log(`  TXT asli : ${rawLines[i]}`);
  console.log(`  Di audio : ${whisperText}`);
}

