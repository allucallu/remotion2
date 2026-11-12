export type SectionKind =
  | "intro"
  | "verse"
  | "pre"
  | "chorus"
  | "bridge"
  | "final"
  | "outro";

export interface ParsedRawSection {
  name: string;
  kind: SectionKind;
  lines: string[];
}

export function detectSectionKind(header: string): SectionKind {
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

export function parseLyricsFile(content: string): ParsedRawSection[] {
  const rawLines = content.split(/\r?\n/).map((l) => l.trim());
  const sections: ParsedRawSection[] = [];
  let currentSection: ParsedRawSection | null = null;

  for (const line of rawLines) {
    if (!line) continue;

    // Deteksi Tag Seksi, misal [Verse 1] atau [Intro – Acoustic Guitar Only]
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

    // Abaikan catatan panggung/arah instrumental misal: (Instrumental guitar ending)
    if (line.startsWith("(") && line.endsWith(")")) {
      continue;
    }

    // Baris lirik
    if (currentSection) {
      currentSection.lines.push(line);
    } else {
      // Jika lirik muncul sebelum tag seksi apa pun
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

