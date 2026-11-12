/**
 * Sistem Tata Letak Lirik (src/layout.ts) untuk "Tolong Unggah Senyummu"
 * Memetakan 48 baris lirik menjadi 24 grup bait seimbang, lengkap dengan pose karakter 1-6
 */

export type LayoutPreset = "left-block" | "right-block" | "split" | "center";
export type CharacterPoseId = 1 | 2 | 3 | 4 | 5 | 6;

export interface LineLayoutConfig {
  lineIndex: number;
  group: number;
  layout: LayoutPreset;
  emphasis?: string;
  poseId?: CharacterPoseId; // 1 s/d 6
  isChorus?: boolean;
}

export const lyricLayoutMap: Record<number, LineLayoutConfig> = {
  // === VERSE 1 ===
  1: { lineIndex: 1, group: 1, layout: "left-block" }, // Hari ini panjang sekali
  2: { lineIndex: 2, group: 1, layout: "left-block", emphasis: "DOMPET MENIPIS" }, // Dompet menipis, kepala berisi
  3: { lineIndex: 3, group: 2, layout: "right-block" }, // Berita buruk datang silih berganti
  4: { lineIndex: 4, group: 2, layout: "right-block", emphasis: "PUNGGUNG BERDERIT" }, // Punggung berderit sebelum pagi

  // === VERSE 2 ===
  5: { lineIndex: 5, group: 3, layout: "left-block" }, // Katanya hidup memang perjuangan
  6: { lineIndex: 6, group: 3, layout: "left-block" }, // Tapi mengapa tak ada liburnya, Tuhan?
  7: { lineIndex: 7, group: 4, layout: "right-block" }, // Aku masih muda, setidaknya menurut KTP
  8: { lineIndex: 8, group: 4, layout: "right-block", emphasis: "PENSIUN DINI" }, // Tapi badanku sudah minta pensiun dini

  // === VERSE 3 (Instagram Story) ===
  9: { lineIndex: 9, group: 5, layout: "left-block" }, // Lalu kubuka Instagram seperti biasa
  10: { lineIndex: 10, group: 5, layout: "left-block" }, // Mencari sedikit hiburan di antara berita
  11: { lineIndex: 11, group: 6, layout: "right-block", poseId: 2 }, // Kulihat namamu di lingkaran cerita (Pose 2: HP Story)
  12: { lineIndex: 12, group: 6, layout: "right-block", emphasis: "KECEWA", poseId: 2 }, // Kubuka dengan harap, kututup kecewa

  // === VERSE 4 (Kata Bijaksana) ===
  13: { lineIndex: 13, group: 7, layout: "left-block", poseId: 5 }, // Isinya lagi-lagi kata bijaksana (Pose 5: Buku Renungan)
  14: { lineIndex: 14, group: 7, layout: "left-block", poseId: 5 }, // Tentang semesta dan menerima keadaan
  15: { lineIndex: 15, group: 8, layout: "right-block", poseId: 5 }, // Nona, maafkan aku yang kurang wawasan
  16: { lineIndex: 16, group: 8, layout: "right-block", emphasis: "SENYUM", poseId: 5 }, // Aku cuma mencari senyum, bukan bahan renungan

  // === CHORUS 1 ===
  17: { lineIndex: 17, group: 9, layout: "left-block", isChorus: true, poseId: 1 }, // Tolong unggah senyummu, Nona (Pose 1: Senyum Manis Ceria)
  18: { lineIndex: 18, group: 9, layout: "left-block", isChorus: true, poseId: 1 }, // Hari ini dunia terlalu banyak bicara
  19: { lineIndex: 19, group: 10, layout: "right-block", isChorus: true, poseId: 2 }, // Tak perlu kau kirim ke ruang pribadi (Pose 2: HP Story)
  20: { lineIndex: 20, group: 10, layout: "right-block", isChorus: true, emphasis: "DI STORY", poseId: 2 }, // Cukup di story, biar kulihat sendiri

  // === CHORUS 1 PART 2 ===
  21: { lineIndex: 21, group: 11, layout: "left-block", isChorus: true, poseId: 1 }, // Tolong unggah senyummu, Nona (Pose 1)
  22: { lineIndex: 22, group: 11, layout: "left-block", isChorus: true, poseId: 1 }, // Barangkali sedikit reda segala nestapa
  23: { lineIndex: 23, group: 12, layout: "right-block", isChorus: true }, // Sebab uang tak ada, masalah berlimpah
  24: { lineIndex: 24, group: 12, layout: "right-block", isChorus: true, emphasis: "SENYUMMU", poseId: 1 }, // Setidaknya senyummu jangan ikut menghilang

  // === VERSE 5 (Pengagum Rahasia) ===
  25: { lineIndex: 25, group: 13, layout: "left-block", poseId: 6 }, // Lucu memang nasib seorang pengagum (Pose 6: Melamun Santai)
  26: { lineIndex: 26, group: 13, layout: "left-block", poseId: 6 }, // Bicara saja belum, rindunya sudah menumpuk
  27: { lineIndex: 27, group: 14, layout: "right-block", poseId: 6 }, // Jumlah percakapan masih bisa dihitung
  28: { lineIndex: 28, group: 14, layout: "right-block", emphasis: "ANGAN-ANGAN", poseId: 6 }, // Tapi angan-angan sudah ke mana-mana berkunjung

  // === VERSE 6 (Memasak / Tebakan) ===
  29: { lineIndex: 29, group: 15, layout: "left-block" }, // Aku tak tahu apa yang kau pikirkan
  30: { lineIndex: 30, group: 15, layout: "left-block" }, // Tak tahu pula siapa yang kau rindukan
  31: { lineIndex: 31, group: 16, layout: "right-block", poseId: 4 }, // Sementara aku di sini sibuk menebak (Pose 4: Memasak di Dapur)
  32: { lineIndex: 32, group: 16, layout: "right-block", emphasis: "MEMASAK", poseId: 4 }, // Apakah kau tersenyum atau sedang memasak

  // === BRIDGE ===
  33: { lineIndex: 33, group: 17, layout: "left-block", poseId: 3 }, // Mungkin ini hanya lelah yang mencari pelarian (Pose 3: Menoleh Kalem)
  34: { lineIndex: 34, group: 17, layout: "left-block", poseId: 3 }, // Atau hati yang terlalu lama kesepian
  35: { lineIndex: 35, group: 18, layout: "right-block", poseId: 3 }, // Tak perlu kau tahu, tak perlu kau balas
  36: { lineIndex: 36, group: 18, layout: "right-block", emphasis: "LEBIH WARAS", poseId: 3 }, // Aku hanya ingin hari ini sedikit lebih waras

  // === CHORUS 2 ===
  37: { lineIndex: 37, group: 19, layout: "left-block", isChorus: true, poseId: 1 }, // Tolong unggah senyummu, Nona (Pose 1: Senyum Manis)
  38: { lineIndex: 38, group: 19, layout: "left-block", isChorus: true, poseId: 1 }, // Biar kupinjam sebentar untuk bahagia
  39: { lineIndex: 39, group: 20, layout: "right-block", isChorus: true, poseId: 3 }, // Tak perlu janji, tak perlu bicara (Pose 3: Menoleh Kalem)
  40: { lineIndex: 40, group: 20, layout: "right-block", isChorus: true, emphasis: "BUKAN SIAPA-SIAPA", poseId: 3 }, // Aku tahu kita bukan siapa-siapa

  // === FINAL CHORUS ===
  41: { lineIndex: 41, group: 21, layout: "left-block", isChorus: true, poseId: 1 }, // Tolong unggah senyummu, Nona (Pose 1)
  42: { lineIndex: 42, group: 21, layout: "left-block", isChorus: true, poseId: 1 }, // Sebelum kantung mataku semakin berkuasa
  43: { lineIndex: 43, group: 22, layout: "right-block", isChorus: true }, // Jika esok dunia masih sama saja
  44: { lineIndex: 44, group: 22, layout: "right-block", isChorus: true, emphasis: "TERTAWA", poseId: 1 }, // Setidaknya malam ini aku sempat tertawa

  // === OUTRO ===
  45: { lineIndex: 45, group: 23, layout: "left-block" }, // Dompet kosong, pikiran berisik
  46: { lineIndex: 46, group: 23, layout: "left-block" }, // Punggung sakit, hati pun terusik
  47: { lineIndex: 47, group: 24, layout: "center" }, // Belum jadi kekasih, sudah begini
  48: { lineIndex: 48, group: 24, layout: "center", emphasis: "KASIHAN SEKALI", poseId: 1 }, // Nona, kasihan sekali pengagummu ini.
};

export interface PreparedGroup {
  groupId: number;
  start: number;
  end: number;
  layout: LayoutPreset;
  emphasis?: string;
  isChorus?: boolean;
  poseId?: CharacterPoseId;
  accentType?: "wallet-coins" | "ktp-alarm" | "story-ring" | "coffee-steam";
  lines: Array<{
    lineIndex: number;
    text: string;
    start: number;
    end: number;
  }>;
}

export function getLyricGroups(
  lyricsList: Array<{ start: number; end: number; text: string }>
): PreparedGroup[] {
  const groupsMap = new Map<number, PreparedGroup>();

  lyricsList.forEach((line, idx) => {
    const lineIndex = idx + 1;
    const config = lyricLayoutMap[lineIndex] ?? {
      lineIndex,
      group: lineIndex,
      layout: "left-block",
    };
    const groupId = config.group;

    if (!groupsMap.has(groupId)) {
      // Tentukan ikon aksen tipis untuk grup yang tidak memiliki kartu karakter
      let accentType: PreparedGroup["accentType"] = undefined;
      if (!config.poseId) {
        if (groupId === 1 || groupId === 23) accentType = "wallet-coins"; // Dompet menipis
        else if (groupId === 3 || groupId === 4) accentType = "ktp-alarm"; // KTP & pensiun dini
        else if (groupId === 5) accentType = "story-ring"; // Lingkaran story IG
        else if (groupId === 2 || groupId === 15) accentType = "coffee-steam"; // Kopi hangat
      }

      groupsMap.set(groupId, {
        groupId,
        start: line.start,
        end: line.end,
        layout: config.layout,
        emphasis: config.emphasis,
        isChorus: config.isChorus,
        poseId: config.poseId,
        accentType,
        lines: [],
      });
    }

    const group = groupsMap.get(groupId)!;
    group.start = Math.min(group.start, line.start);
    group.end = Math.max(group.end, line.end);
    if (!group.emphasis && config.emphasis) {
      group.emphasis = config.emphasis;
    }
    if (!group.poseId && config.poseId) {
      group.poseId = config.poseId;
    }
    if (!group.isChorus && config.isChorus) {
      group.isChorus = config.isChorus;
    }

    group.lines.push({
      lineIndex,
      text: line.text,
      start: line.start,
      end: line.end,
    });
  });

  return Array.from(groupsMap.values()).sort((a, b) => a.start - b.start);
}
