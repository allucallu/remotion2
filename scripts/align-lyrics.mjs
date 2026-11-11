import fs from 'fs';
import path from 'path';

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordSimilarity(w1, w2) {
  if (w1 === w2) return 1.0;
  if (!w1 || !w2) return 0.0;
  if (w1.includes(w2) || w2.includes(w1)) {
    return Math.min(w1.length, w2.length) / Math.max(w1.length, w2.length);
  }
  // Levenshtein
  const track = Array(w2.length + 1)
    .fill(null)
    .map(() => Array(w1.length + 1).fill(null));
  for (let i = 0; i <= w1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= w2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= w2.length; j += 1) {
    for (let i = 1; i <= w1.length; i += 1) {
      const indicator = w1[i - 1] === w2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  const dist = track[w2.length][w1.length];
  return 1 - dist / Math.max(w1.length, w2.length);
}

function scoreSequence(lyricWords, tokenWords) {
  if (lyricWords.length === 0 || tokenWords.length === 0) return 0;
  let totalScore = 0;
  const count = Math.min(lyricWords.length, tokenWords.length);
  for (let i = 0; i < count; i++) {
    totalScore += wordSimilarity(lyricWords[i], tokenWords[i]);
  }
  return totalScore / Math.max(lyricWords.length, tokenWords.length);
}

export function alignLyrics(rawLyricsText, whisperData) {
  const lines = rawLyricsText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Flatten whisper tokens or transcription segments (supports whisper.cpp and standard OpenAI Whisper/faster-whisper)
  const allTokens = [];
  if (whisperData.transcription) {
    // whisper.cpp format
    for (const seg of whisperData.transcription) {
      if (seg.tokens && seg.tokens.length > 0) {
        for (const tok of seg.tokens) {
          const norm = normalize(tok.text);
          if (norm.length > 0) {
            allTokens.push({
              text: tok.text,
              norm,
              start: (tok.offsets?.from ?? tok.start * 1000) / 1000,
              end: (tok.offsets?.to ?? tok.end * 1000) / 1000,
            });
          }
        }
      } else {
        const norm = normalize(seg.text);
        if (norm.length > 0) {
          allTokens.push({
            text: seg.text,
            norm,
            start: (seg.offsets?.from ?? seg.start * 1000) / 1000,
            end: (seg.offsets?.to ?? seg.end * 1000) / 1000,
          });
        }
      }
    }
  } else if (whisperData.segments || Array.isArray(whisperData)) {
    // OpenAI Whisper / faster-whisper Python format
    const segments = whisperData.segments || whisperData;
    for (const seg of segments) {
      if (seg.words && seg.words.length > 0) {
        for (const w of seg.words) {
          const text = w.word || w.text || '';
          const norm = normalize(text);
          if (norm.length > 0) {
            allTokens.push({
              text,
              norm,
              start: Number(w.start),
              end: Number(w.end),
            });
          }
        }
      } else {
        const norm = normalize(seg.text);
        if (norm.length > 0) {
          allTokens.push({
            text: seg.text,
            norm,
            start: Number(seg.start),
            end: Number(seg.end),
          });
        }
      }
    }
  }

  const results = [];
  let currentTokenIdx = 0;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const rawLine = lines[lineIdx];
    const lineNorm = normalize(rawLine);
    const lineWords = lineNorm.split(' ').filter(Boolean);

    if (lineWords.length === 0) {
      continue;
    }

    let bestScore = -1;
    let bestStart = -1;
    let bestEnd = -1;
    let bestNextTokenIdx = currentTokenIdx;

    // Search forward within a reasonable token window (e.g. up to 100 tokens ahead)
    const windowMax = Math.min(currentTokenIdx + 120, allTokens.length);
    for (let i = currentTokenIdx; i < windowMax; i++) {
      // Look at chunk of tokens of length ~ lineWords.length
      for (let len = Math.max(1, lineWords.length - 2); len <= lineWords.length + 3; len++) {
        if (i + len > allTokens.length) break;
        const candidateSlice = allTokens.slice(i, i + len);
        const candidateWords = candidateSlice.map((t) => t.norm);
        const score = scoreSequence(lineWords, candidateWords);
        if (score > bestScore) {
          bestScore = score;
          bestStart = candidateSlice[0].start;
          bestEnd = candidateSlice[candidateSlice.length - 1].end;
          bestNextTokenIdx = i + len;
        }
      }
    }

    const isMatchGood = bestScore >= 0.55;
    results.push({
      index: lineIdx + 1,
      text: rawLine,
      start: isMatchGood ? bestStart : null,
      end: isMatchGood ? bestEnd : null,
      score: bestScore,
      flag: !isMatchGood ? '// CEK:' : undefined,
    });

    if (isMatchGood) {
      currentTokenIdx = bestNextTokenIdx;
    }
  }

  // Pass 2: Interpolate missing / weak lines
  for (let i = 0; i < results.length; i++) {
    if (results[i].start === null) {
      // Find prev known
      let prevEnd = 0;
      for (let p = i - 1; p >= 0; p--) {
        if (results[p].end !== null) {
          prevEnd = results[p].end;
          break;
        }
      }
      // Find next known
      let nextStart = prevEnd + 10;
      for (let n = i + 1; n < results.length; n++) {
        if (results[n].start !== null) {
          nextStart = results[n].start;
          break;
        }
      }
      // Count consecutive nulls
      let blockCount = 0;
      let startIdx = i;
      while (startIdx + blockCount < results.length && results[startIdx + blockCount].start === null) {
        blockCount++;
      }
      const gap = Math.max(0.5, nextStart - prevEnd);
      const step = gap / (blockCount + 1);
      for (let b = 0; b < blockCount; b++) {
        results[startIdx + b].start = Number((prevEnd + step * (b + 0.5)).toFixed(2));
        results[startIdx + b].end = Number((prevEnd + step * (b + 1.2)).toFixed(2));
        results[startIdx + b].flag = '// CEK: interpolated';
      }
      i = startIdx + blockCount - 1;
    }
  }

  // Pass 3: Enforce no overlap & monotonic start
  for (let i = 0; i < results.length; i++) {
    results[i].start = Number(results[i].start.toFixed(2));
    results[i].end = Number(results[i].end.toFixed(2));

    if (i > 0) {
      if (results[i].start < results[i - 1].start) {
        results[i].start = Number((results[i - 1].start + 0.5).toFixed(2));
      }
      if (results[i - 1].end > results[i].start) {
        // Adjust previous line's end to avoid overlap
        results[i - 1].end = Number(Math.max(results[i - 1].start + 0.3, results[i].start - 0.1).toFixed(2));
      }
    }
    if (results[i].end <= results[i].start) {
      results[i].end = Number((results[i].start + 2.0).toFixed(2));
    }
  }

  return results;
}

// If run directly
if (process.argv[1] && process.argv[1].endsWith('align-lyrics.mjs')) {
  const rawLyrics = fs.readFileSync(path.resolve('calon', 'lirik.txt'), 'utf-8');
  const whisperRaw = JSON.parse(fs.readFileSync(path.resolve('data', 'whisper-raw.json'), 'utf-8'));
  const aligned = alignLyrics(rawLyrics, whisperRaw);

  let outputTs = `// Generated lyric timestamps aligned with Whisper\nexport interface LyricLine {\n  start: number;\n  end: number;\n  text: string;\n}\n\nexport const lyrics: LyricLine[] = [\n`;

  for (const item of aligned) {
    const flagComment = item.flag ? ` ${item.flag}` : '';
    outputTs += `  { start: ${item.start.toFixed(2)}, end: ${item.end.toFixed(2)}, text: ${JSON.stringify(item.text)} },${flagComment}\n`;
  }
  outputTs += `];\n`;

  fs.writeFileSync(path.resolve('src', 'lyrics.ts'), outputTs, 'utf-8');
  console.log('src/lyrics.ts successfully generated!');
}

