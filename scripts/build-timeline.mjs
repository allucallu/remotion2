import fs from "fs";

function detectSectionKind(header) {
  const h = header.toLowerCase();
  if (h.includes("intro")) return "intro";
  if (h.includes("final") && h.includes("chorus")) return "final";
  if (h.includes("pre-chorus") || h.includes("pre chorus") || h.includes("pre")) return "pre";
  if (h.includes("chorus")) return "chorus";
  if (h.includes("bridge")) return "bridge";
  if (h.includes("outro")) return "outro";
  if (h.includes("verse")) return "verse";
  return "verse";
}

function parseLyricsFile(content) {
  const rawLines = content.split(/\r?\n/).map((l) => l.trim());
  const sections = [];
  let currentSection = null;

  for (const line of rawLines) {
    if (!line) continue;
    if (line.startsWith("[") && line.endsWith("]")) {
      const headerName = line.slice(1, -1).trim();
      currentSection = {
        name: headerName,
        kind: detectSectionKind(headerName),
        lines: [],
      };
      sections.push(currentSection);
      continue;
    }
    if (line.startsWith("(") && line.endsWith(")")) continue;
    if (currentSection) {
      currentSection.lines.push(line);
    } else {
      currentSection = {
        name: "Verse 1",
        kind: "verse",
        lines: [line],
      };
      sections.push(currentSection);
    }
  }
  return sections;
}

function normalizeWord(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildTimeline(lyricsContent, timestampJson, audioDurationSeconds = 277.2, offsetSeconds = 0) {
  const rawSections = parseLyricsFile(lyricsContent);
  const rawSegments = timestampJson.segments || [];

  const allTimestampWords = [];
  for (const line of rawSegments) {
    if (line.start < 14 && line.text.toLowerCase().includes("menarik")) continue;
    if (line.words) {
      for (const w of line.words) {
        allTimestampWords.push({
          word: (w.word || w.text || "").trim(),
          start: Number(w.start || line.start || 0),
          end: Number(w.end || line.end || 0),
        });
      }
    }
  }

  let wordPtr = 0;
  const sectionsWithoutIntervals = [];

  for (const sec of rawSections) {
    const alignedLines = [];

    for (const lineText of sec.lines) {
      const targetWords = lineText.split(/\s+/).filter(Boolean);
      const alignedWords = [];

      for (const targetWord of targetWords) {
        const targetNorm = normalizeWord(targetWord);
        let matchIdx = -1;

        for (let k = 0; k < 7 && wordPtr + k < allTimestampWords.length; k++) {
          const candNorm = normalizeWord(allTimestampWords[wordPtr + k].word);
          if (candNorm === targetNorm || candNorm.includes(targetNorm) || targetNorm.includes(candNorm)) {
            matchIdx = wordPtr + k;
            break;
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
          console.warn(`[Timeline Alignment] Kata tidak cocok: "${targetWord}" di baris "${lineText}". Menggunakan estimasi.`);
          const prevEnd = alignedWords.length > 0
            ? alignedWords[alignedWords.length - 1].end
            : wordPtr < allTimestampWords.length
            ? Math.max(0, allTimestampWords[wordPtr].start + offsetSeconds)
            : 0;
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

  const finalSections = [];
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

  return finalSections;
}

const lirik = fs.readFileSync("calon/lirik.txt", "utf-8");
const whisper = JSON.parse(fs.readFileSync("calon/whisper-raw.json", "utf-8"));
const timeline = buildTimeline(lirik, whisper, 277.2, 0);

console.log(`Generated timeline with ${timeline.length} sections.`);
const outputCode = `// Auto-generated from calon/lirik.txt and calon/whisper-raw.json
import type { Section } from "./buildTimeline";

export const timeline: Section[] = ${JSON.stringify(timeline, null, 2)};
`;

fs.writeFileSync("src/data/timeline.ts", outputCode);
console.log("Written to src/data/timeline.ts successfully!");
