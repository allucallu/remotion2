/**
 * Konfigurasi Tata Letak Lirik (src/layout.ts)
 * Memetakan setiap baris lirik (berdasar index 1-64) ke layout visual, grouping, dan emphasis.
 */

export type LayoutPreset = "left-block" | "right-block" | "split" | "center";
export type TextSize = "regular" | "large" | "compact";

export interface LineLayoutConfig {
  /** Nomor baris (1 sampai 64 sesuai lyrics.ts) */
  lineIndex: number;
  /** Nomor grup baris yang tampil bersamaan dalam satu layar */
  group: number;
  /** Preset tata letak */
  layout: LayoutPreset;
  /** Variasi ukuran teks */
  size?: TextSize;
  /** Kata kunci besar di bagian bawah layar (opsional, ~1 dari 6 baris) */
  emphasis?: string;
  /** Catatan penyesuaian */
  note?: string;
}

export const lyricLayoutMap: Record<number, LineLayoutConfig> = {
  // --- INTRO ---
  1: { lineIndex: 1, group: 1, layout: "center", size: "compact" }, // (Oh-oh-oh...) diturunkan ke bawah agar serasi dengan judul di atas
  2: { lineIndex: 2, group: 2, layout: "left-block", size: "regular" }, // Hidup makin sulit... // UBAH: layout
  3: { lineIndex: 3, group: 2, layout: "left-block", size: "large", emphasis: "MEMIKIRKANMU" }, // Tapi entah mengapa... // UBAH: emphasis

  // --- VERSE 1 ---
  4: { lineIndex: 4, group: 3, layout: "right-block", size: "regular" }, // Pagi datang membawa tagihan // UBAH: layout
  5: { lineIndex: 5, group: 3, layout: "right-block", size: "regular" }, // Berita buruk jadi sarapan
  6: { lineIndex: 6, group: 4, layout: "left-block", size: "regular" }, // Harga naik...
  7: { lineIndex: 7, group: 4, layout: "left-block", size: "large", emphasis: "KRISIS" }, // Belum juga sembuh... // UBAH: emphasis

  // --- VERSE 2 ---
  8: { lineIndex: 8, group: 5, layout: "split", size: "regular" }, // Katanya hidup harus diperjuangkan // UBAH: layout
  9: { lineIndex: 9, group: 5, layout: "split", size: "regular" }, // Maka kupakai sisa tenaga yang ada
  10: { lineIndex: 10, group: 6, layout: "right-block", size: "regular" }, // Kantung mata mulai jadi kawan
  11: { lineIndex: 11, group: 6, layout: "right-block", size: "regular" }, // Punggung berderit seperti pintu tua

  // --- PRE-CHORUS 1 ---
  12: { lineIndex: 12, group: 7, layout: "left-block", size: "regular" }, // Di tengah dunia yang tak ramah // UBAH: layout
  13: { lineIndex: 13, group: 7, layout: "left-block", size: "regular" }, // Ada satu hal yang ingin kuminta
  14: { lineIndex: 14, group: 8, layout: "right-block", size: "regular" }, // Bukan uang, bukan jabatan
  15: { lineIndex: 15, group: 8, layout: "right-block", size: "large", emphasis: "SENYUMMU" }, // Cuma senyummu... // UBAH: emphasis

  // --- CHORUS 1 ---
  16: { lineIndex: 16, group: 9, layout: "left-block", size: "large" }, // Hei, Nona, bolehkah aku minta? // UBAH: layout
  17: { lineIndex: 17, group: 9, layout: "left-block", size: "regular" }, // Satu foto senyum untuk hari yang nestapa
  18: { lineIndex: 18, group: 10, layout: "right-block", size: "regular" }, // Tak perlu kirim lewat pesan pribadi
  19: { lineIndex: 19, group: 10, layout: "right-block", size: "large", emphasis: "STORY" }, // Cukup di story... // UBAH: emphasis

  // --- POST-CHORUS 1 ---
  20: { lineIndex: 20, group: 11, layout: "left-block", size: "regular" }, // Sebab dunia sudah cukup menyiksa
  21: { lineIndex: 21, group: 11, layout: "left-block", size: "regular" }, // Ekonomi runtuh, negara penuh drama
  22: { lineIndex: 22, group: 12, layout: "split", size: "regular" }, // Jangan biarkan aku tambah merana // UBAH: layout
  23: { lineIndex: 23, group: 12, layout: "split", size: "large", emphasis: "BIJAKSANA" }, // Karena story-mu... // UBAH: emphasis

  // --- VERSE 3 ---
  24: { lineIndex: 24, group: 13, layout: "right-block", size: "regular" }, // Kita bahkan jarang berbicara // UBAH: layout
  25: { lineIndex: 25, group: 13, layout: "right-block", size: "regular" }, // Sapa saja belum pernah terlaksana
  26: { lineIndex: 26, group: 14, layout: "left-block", size: "regular" }, // Tapi anehnya aku bisa merindu
  27: { lineIndex: 27, group: 14, layout: "left-block", size: "large", emphasis: "RINDU" }, // Seolah kita punya masa lalu // UBAH: emphasis

  // --- VERSE 4 ---
  28: { lineIndex: 28, group: 15, layout: "split", size: "regular" }, // Kau sibuk membagikan makna kehidupan // UBAH: layout
  29: { lineIndex: 29, group: 15, layout: "split", size: "regular" }, // Aku sibuk mencari makna unggahan
  30: { lineIndex: 30, group: 16, layout: "right-block", size: "regular" }, // Kubaca quotemu sampai tiga kali
  31: { lineIndex: 31, group: 16, layout: "right-block", size: "regular" }, // Tetap tak paham, tapi tetap kunikmati

  // --- PRE-CHORUS 2 ---
  32: { lineIndex: 32, group: 17, layout: "left-block", size: "regular" }, // Mungkin aku memang kurang kerjaan // UBAH: layout
  33: { lineIndex: 33, group: 17, layout: "left-block", size: "regular" }, // Atau terlalu banyak waktu kesendirian
  34: { lineIndex: 34, group: 18, layout: "right-block", size: "regular" }, // Belum jadi siapa-siapa bagimu
  35: { lineIndex: 35, group: 18, layout: "right-block", size: "large", emphasis: "PENGGEMAR" }, // Tapi sudah jadi penggemar... // UBAH: emphasis

  // --- CHORUS 2 ---
  36: { lineIndex: 36, group: 19, layout: "left-block", size: "large" }, // Hei, Nona, bolehkah aku minta? // UBAH: layout
  37: { lineIndex: 37, group: 19, layout: "left-block", size: "regular" }, // Satu foto senyum untuk hari yang nestapa
  38: { lineIndex: 38, group: 20, layout: "right-block", size: "regular" }, // Tak perlu kirim lewat pesan pribadi
  39: { lineIndex: 39, group: 20, layout: "right-block", size: "large", emphasis: "STORY" }, // Cukup di story... // UBAH: emphasis

  // --- POST-CHORUS 2 ---
  40: { lineIndex: 40, group: 21, layout: "left-block", size: "regular" }, // Sebab dunia sudah cukup menyiksa
  41: { lineIndex: 41, group: 21, layout: "left-block", size: "regular" }, // Ekonomi runtuh, negara penuh drama
  42: { lineIndex: 42, group: 22, layout: "split", size: "regular" }, // Jangan biarkan aku tambah merana // UBAH: layout
  43: { lineIndex: 43, group: 22, layout: "split", size: "large", emphasis: "BIJAKSANA" }, // Karena story-mu... // UBAH: emphasis

  // --- BRIDGE 1 ---
  44: { lineIndex: 44, group: 23, layout: "right-block", size: "regular" }, // Aku tak meminta kau membalas rasa // UBAH: layout
  45: { lineIndex: 45, group: 23, layout: "right-block", size: "regular" }, // Apalagi mengubah jalan cerita
  46: { lineIndex: 46, group: 24, layout: "left-block", size: "regular" }, // Aku hanya ingin melihat senyummu
  47: { lineIndex: 47, group: 24, layout: "left-block", size: "large", emphasis: "SENYUMMU" }, // Meski mungkin kau tak tahu... // UBAH: emphasis

  // --- BRIDGE 2 ---
  48: { lineIndex: 48, group: 25, layout: "split", size: "regular" }, // Lucunya hidup memang begini // UBAH: layout
  49: { lineIndex: 49, group: 25, layout: "split", size: "regular" }, // Mencari bahagia di tengah inflasi
  50: { lineIndex: 50, group: 26, layout: "left-block", size: "regular" }, // Orang lain sibuk mencari kepastian
  51: { lineIndex: 51, group: 26, layout: "left-block", size: "large", emphasis: "KEPASTIAN" }, // Aku menunggu story... // UBAH: emphasis

  // --- FINAL CHORUS ---
  52: { lineIndex: 52, group: 27, layout: "right-block", size: "large" }, // Hei, Nona, sekali lagi kuminta! // UBAH: layout
  53: { lineIndex: 53, group: 27, layout: "right-block", size: "regular" }, // Satu foto senyum untuk hari yang nestapa
  54: { lineIndex: 54, group: 28, layout: "left-block", size: "regular" }, // Tak perlu kirim lewat pesan pribadi
  55: { lineIndex: 55, group: 28, layout: "left-block", size: "large", emphasis: "TAHU DIRI" }, // Aku tahu diri... // UBAH: emphasis

  // --- OUTRO PART 1 ---
  56: { lineIndex: 56, group: 29, layout: "split", size: "regular" }, // Biar dunia terus mempermainkan kita // UBAH: layout
  57: { lineIndex: 57, group: 29, layout: "split", size: "regular" }, // Biar dompet tipis dan punggung merana
  58: { lineIndex: 58, group: 30, layout: "right-block", size: "regular" }, // Setidaknya ada satu yang kutunggu
  59: { lineIndex: 59, group: 30, layout: "right-block", size: "large", emphasis: "NOTIFIKASI" }, // Notifikasi story... // UBAH: emphasis

  // --- OUTRO PART 2 ---
  60: { lineIndex: 60, group: 31, layout: "center", size: "compact" }, // Oh-oh-oh...
  61: { lineIndex: 61, group: 32, layout: "center", size: "large", emphasis: "RINDU" }, // Belum pernah dekat... // UBAH: emphasis
  62: { lineIndex: 62, group: 33, layout: "center", size: "compact" }, // Oh-oh-oh...
  63: { lineIndex: 63, group: 34, layout: "center", size: "regular" }, // Nona, pap dong...
  64: { lineIndex: 64, group: 34, layout: "center", size: "large", emphasis: "DEWASA" }, // Aku sudah lelah... // UBAH: emphasis
};

export function getLineLayout(lineIndex: number): LineLayoutConfig {
  return (
    lyricLayoutMap[lineIndex] ?? {
      lineIndex,
      group: lineIndex,
      layout: "center",
      size: "regular",
    }
  );
}

export interface PreparedGroup {
  groupId: number;
  start: number;
  end: number;
  layout: LayoutPreset;
  emphasis?: string;
  lines: Array<{
    lineIndex: number;
    text: string;
    start: number;
    end: number;
    size?: TextSize;
    note?: string;
  }>;
}

/**
 * Mengelompokkan 64 baris lirik menjadi daftar grup adegan
 */
export function getLyricGroups(
  lyricsList: Array<{ start: number; end: number; text: string }>
): PreparedGroup[] {
  const groupsMap = new Map<number, PreparedGroup>();

  lyricsList.forEach((line, idx) => {
    const lineIndex = idx + 1; // 1-based
    const config = getLineLayout(lineIndex);
    const groupId = config.group;

    if (!groupsMap.has(groupId)) {
      groupsMap.set(groupId, {
        groupId,
        start: line.start,
        end: line.end,
        layout: config.layout,
        emphasis: config.emphasis,
        lines: [],
      });
    }

    const group = groupsMap.get(groupId)!;
    group.start = Math.min(group.start, line.start);
    group.end = Math.max(group.end, line.end);
    if (!group.emphasis && config.emphasis) {
      group.emphasis = config.emphasis;
    }

    group.lines.push({
      lineIndex,
      text: line.text,
      start: line.start,
      end: line.end,
      size: config.size,
      note: config.note,
    });
  });

  return Array.from(groupsMap.values()).sort((a, b) => a.start - b.start);
}

