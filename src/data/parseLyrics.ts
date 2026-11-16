export type SectionKind =
  | "intro"
  | "verse"
  | "pre"
  | "chorus"
  | "bridge"
  | "outro"
  | "interlude";

export interface ParsedWordToken {
  text: string;
  isAdlib: boolean;
}

export interface ParsedLyricLine {
  text: string;
  words: ParsedWordToken[];
  singers: string[];
}

export interface ParsedLyricSection {
  name: string;
  kind: SectionKind;
  index: number;
  singers: string[];
  lines: ParsedLyricLine[];
}

export function detectSectionKind(name: string): SectionKind {
  const n = name.toLowerCase();
  if (n.includes("intro")) return "intro";
  if (n.includes("pre-chorus") || n.includes("pre chorus") || n.includes("pre")) return "pre";
  if (n.includes("chorus")) return "chorus";
  if (n.includes("bridge")) return "bridge";
  if (n.includes("outro")) return "outro";
  if (n.includes("interlude")) return "interlude";
  return "verse";
}

/**
 * Parsing lirik teks sesuai PRD Bagian 11:
 * - Toleran kurung buka hilang di baris pertama (misal: "Verse 1: Jonah Marais]")
 * - Menandai kata ad-lib di dalam tanda kurung "(...)" dengan isAdlib: true
 * - Memberi nomor indeks (index) untuk seksi berulang (Chorus 1, 2, 3; Pre-Chorus 1, 2, dst.)
 */
export function parseLyrics(content: string): ParsedLyricSection[] {
  const rawLines = content.split(/\r?\n/);
  const sections: ParsedLyricSection[] = [];
  let currentSection: ParsedLyricSection | null = null;
  const kindCounts: Partial<Record<SectionKind, number>> = {};

  for (const rawLine of rawLines) {
    let line = rawLine.trim();
    if (!line) continue;

    // Toleransi baris pertama yang kehilangan kurung buka '[' (contoh: "Verse 1: Jonah Marais]")
    if (!line.startsWith("[") && line.endsWith("]") && line.includes(":")) {
      line = "[" + line;
    }

    // Deteksi header seksi: [Nama Seksi: Penyanyi1 & Penyanyi2]
    const headerMatch = line.match(/^\[([^:]+):\s*([^\]]+)\]$/);
    if (headerMatch) {
      const name = headerMatch[1].trim();
      const rawSingers = headerMatch[2].trim();
      const singers = rawSingers
        .split(/\s*&\s*/)
        .map((s) => s.trim())
        .filter(Boolean);

      const kind = detectSectionKind(name);
      const currentIndex = (kindCounts[kind] ?? 0) + 1;
      kindCounts[kind] = currentIndex;

      currentSection = {
        name,
        kind,
        index: currentIndex,
        singers,
        lines: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) continue;

    // Parsing kata dan deteksi ad-lib di dalam tanda kurung
    const tokens = line.split(/\s+/).filter(Boolean);
    const lineWords: ParsedWordToken[] = [];
    let insideAdlib = false;

    for (const token of tokens) {
      if (token.startsWith("(")) {
        insideAdlib = true;
      }

      lineWords.push({
        text: token,
        isAdlib: insideAdlib,
      });

      if (token.endsWith(")")) {
        insideAdlib = false;
      }
    }

    currentSection.lines.push({
      text: line,
      words: lineWords,
      singers: [...currentSection.singers],
    });
  }

  return sections;
}
