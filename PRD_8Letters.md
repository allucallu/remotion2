# PRD — MV Animasi Lirik "8 Letters" (Remotion)

## 1. Ringkasan
Video musik animasi 16:9 dengan karakter chibi bergaya gambar tangan (pen sketch + arsiran + pensil warna), teks lirik tulisan tangan yang sinkron dengan audio, dirender dari proyek Remotion lokal. Dikerjakan lewat Antigravity.

Prinsip: **cerita visual yang kuat + gaya gambar yang konsisten + animasi sederhana tapi terasa "hidup"** (garis bergetar, gerak idle, coretan yang menggambar dirinya).

> Lirik tidak disalin ke dokumen ini. Sumber lirik adalah `lirik.txt` (dibaca saat runtime).

## 2. Aset Input
| File | Catatan |
|---|---|
| `lagu.mp3` | Audio lagu (cek nama sebenarnya). |
| `lirik.txt` | Format tag: `[Section: Penyanyi & Penyanyi]`. **Perhatian:** baris pertama file memiliki typo (kurung buka `[` hilang pada tag Verse 1). Parser harus toleran: perbaiki otomatis tanpa mengubah file asli. Ada juga ad-lib dalam tanda kurung (mis. "(whoa oh, yeah)", "(It's only you)", "(you)") yang harus ditampilkan sebagai teks kecil/berbisik. |
| JSON timestamp | Skema belum diketahui. Agent wajib inspeksi dulu. Dukung per-kata dan per-baris, detik/milidetik. |
| `public/assets/` | Aset gambar karakter/latar hasil generate (lihat ASSET_PROMPTS.md). |

Folder lokasi file: verifikasi dulu (mungkin `public/calon/` atau folder lain).

## 3. Spesifikasi Teknis
- 1920×1080, 30 fps, H.264 + AAC. Durasi = durasi mp3 (`getAudioDurationInSeconds`).
- Semua animasi dengan `useCurrentFrame` / `interpolate` / `spring`. Dilarang CSS transition/animation dan `setTimeout`.
- Font lewat `@remotion/google-fonts`: **Gochi Hand** (lirik utama), **Reenie Beanie** (ad-lib/bisikan), opsional **Gaegu** (label kecil).
- Dependensi tambahan yang boleh: `@remotion/google-fonts`, `@remotion/media-utils`, `@remotion/paths`, `@remotion/noise`, `@remotion/transitions`.
- Semua paket `@remotion/*` versinya harus sama dengan `remotion`.

## 4. Konsep Cerita & Motif

### 4.1 Premis
Dua karakter orisinal, **Ray** dan **Sol** (nama boleh diganti), sudah sangat dekat dan saling tahu sisi terburuk masing-masing, tapi salah satunya (Ray) kesulitan mengucapkan tiga kata yang berjumlah **delapan huruf** (kemungkinan besar "I love you": I-L-O-V-E-Y-O-U = 8). Cerita berjalan dari keraguan → tarik-ulur → keberanian.

### 4.2 Motif pengikat: "8 Kotak Huruf"
Di sudut atas layar ada **8 kotak huruf kosong** (seperti buku catatan/Wordle) yang menjadi penanda progres emosi:
- Awal lagu: tidak terlihat.
- Chorus 1: 8 kotak muncul, kosong, bergetar/gemetar.
- Verse 2 / Pre-Chorus 2: kotak terisi sebagian demi sedikit (huruf tertulis pensil tipis, lalu dihapus ragu-ragu).
- Chorus 2: huruf terisi lalu terhapus (tarik-ulur).
- Bridge (mata terpejam): 8 kotak bersinar samar di kegelapan.
- Chorus 3: hampir semua terisi.
- Outro: tiap pengulangan frasa "delapan huruf" mengisi satu-dua kotak; di akhir lagu **semua 8 kotak terisi** dengan tulisan tangan Ray, lalu kamera menutup pada Ray dan Sol bergandengan.

Opsi akhir alternatif (lebih terbuka): kotak terakhir dibiarkan kosong. Default PRD: **akhir hangat (semua terisi)**.

### 4.3 Motif pendukung
- **Plafon**: Verse 1 dilihat dari sudut pandang berbaring menatap langit-langit (bintang tempel di plafon).
- **Garis telapak tangan**: Verse 2, dua telapak tangan bertemu dan garis-garisnya menyambung (digambar dengan animasi garis).
- **Tarik-ulur**: Chorus, karakter menarik pasangannya mendekat, lalu mundur memberi jarak, berulang sinkron dengan ritme.
- **Mata terpejam**: Bridge, semua latar menggelap, hanya sosok Sol dalam gelembung pikiran.

### 4.4 Penyanyi
Tag penyanyi dalam `lirik.txt` dipakai **hanya sebagai kode warna garis bawah/aksen tulisan** (5 aksen berbeda). Jangan menggambar anggota band; karakter hanya Ray dan Sol.

## 5. Style Guide (diekstrak dari gambar referensi)
Ciri gaya yang diambil: kertas krem polos; garis pen tipis, goyang, ketebalan tidak rata; **arsiran paralel rapat** hitam-navy untuk rambut dan pakaian; **aksen pensil oranye-merah** pada sebagian helai rambut/lipatan pakaian; **pipi diarsir kuning**; kulit dibiarkan putih (warna kertas); mata titik/oval kecil solid; kepala besar badan kecil (chibi); minim detail.

| Peran | Hex |
|---|---|
| Kertas krem | `#FFF7E3` |
| Tinta navy-hitam | `#1B1A2E` |
| Pensil oranye-merah | `#D9532B` |
| Arsiran kuning (blush/stabilo) | `#F4B942` |
| Kertas malam (Bridge/Verse 1) | `#1F2340` |
| Garis malam (kapur) | `#F4EFE2` |
| Glow hangat malam | `#FFB65C` |

Aksen penyanyi (garis bawah lirik): Jonah `#D9532B`, Zach `#4A7FB5`, Jack `#5E9E6E`, Corbyn `#8E5BA8`, Daniel `#E0A526`. Gabungan penyanyi → garis bawah bergradien dua warna.

**Larangan:** tidak meniru karakter dari franchise manapun (tanpa bekas luka petir, jubah penyihir, dasi asrama, tongkat, dll.). Ray dan Sol harus orisinal.

## 6. Karakter Orisinal
- **Ray**: rambut pendek acak-acakan (arsiran hitam, satu jambul diberi aksen oranye), hoodie navy diarsir, sneakers. Tanpa kacamata. Ekspresi mata titik, alis ekspresif.
- **Sol**: rambut sebahu bergelombang diarsir dengan beberapa helai oranye, jepit rambut kecil oranye, sweater oversize krem dengan garis arsir, pipi kuning.
Keduanya konsisten proporsi: kepala ≈ 55% tinggi total.

## 7. Pipeline Aset (Hybrid)
Karena gambar tangan sulit dihasilkan murni dari kode, pakai **aset hasil generate gambar** lalu dianimasikan di Remotion.

1. Generate gambar dengan model gambar (Gemini image/Nano Banana, atau lainnya) memakai ASSET_PROMPTS.md. Mulai dari **character sheet** Ray dan Sol, lalu semua pose merujuk ke sheet itu agar konsisten.
2. Hapus latar (transparan) untuk sprite karakter/properti, memakai `rembg` atau sejenisnya (agent Antigravity bisa menjalankan skrip Python). Latar scene tetap berupa gambar penuh.
3. Simpan di `public/assets/` sesuai penamaan di ASSET_PROMPTS.md (checklist ±45 file).
4. **Placeholder wajib:** komponen harus menampilkan kotak bertuliskan nama file jika aset belum ada, supaya pengembangan tidak terblokir.

### Teknik animasi pada gambar statis
| Teknik | Cara |
|---|---|
| **Boil (garis hidup)** | Tiap pose punya varian A/B (hasil generate dua kali, sedikit beda). Tukar tiap 3 frame (±10 fps). Jika B tidak ada, pakai filter SVG `feTurbulence + feDisplacementMap` dengan seed berganti tiap 3 frame. |
| **Idle** | Napas (scaleY 1→1.015), goyang kepala ±1.5°, pivot di dasar sprite. |
| **Kedip** | Ganti ke varian mata tertutup 4 frame, tiap ±3 detik acak (seed stabil). |
| **Scribble reveal** | Gambar muncul seperti diwarnai: mask SVG dengan stroke tebal zig-zag yang digambar via `stroke-dashoffset`. |
| **Hatching draw-on** | Garis arsiran SVG (path lurus paralel) digambar bertahap di atas objek/latar. |
| **Kamera** | Zoom/pan pelan 3–6% per scene; push-in pada chorus; shake kecil pada ketukan kuat. |
| **Tarik-ulur** | Sprite Ray/Sol translateX mendekat/menjauh dengan spring, sinkron timestamp baris. |
| **Partikel doodle** | Bintang, hati, tanda tanya, not kecil digambar berupa SVG sederhana, melayang. |

## 8. Layout & Lirik
- Gaya: ilustrasi besar mendominasi, lirik tulisan tangan 2–4 baris di area kosong (kiri/kanan/bawah), berganti posisi antar kelompok baris. Safe area 96 px.
- Kata muncul "ditulis" (clip-path wipe kiri→kanan + translateY kecil, spring). Highlight karaoke: sapuan stabilo kuning di belakang kata aktif sesuai `start→end`.
- Garis bawah warna sesuai penyanyi (lihat 5). Ad-lib dalam kurung → font Reenie Beanie, ukuran 60%, opasitas 0.8, posisi miring sedikit.
- Kata "eight letters" (frasa yang berulang) diberi gaya khusus: huruf-hurufnya diberi kotak tipis seperti tile, atau digarisbawahi ganda.
- Baris lampau memudar ke opasitas 0.35.
- Tag seksi tidak ditampilkan sebagai lirik.

## 9. Storyboard
(Parafrase, bukan kutipan. Cocokkan ke seksi berdasarkan tag di `lirik.txt`.)

| Seksi | Visual & Gerak |
|---|---|
| **Verse 1** (mode malam) | POV menatap plafon: bintang tempel menyala redup, Ray dan Sol berbaring bersebelahan. Sol menoleh, Ray tahu semua sisi buruknya dan tidak dihakimi. Rasa hangat sekaligus takut: dada Ray digambar hati yang membuka-menutup (pintu kecil). Bagian "luka lama, sulit percaya" → coretan retakan di hati, ia menatap plafon lagi. |
| **Pre-Chorus 1** | Ray menulis sesuatu di buku kecil lalu mencoretnya (pernah mengucapkannya tapi bohong). Sol duduk, menunggu dengan sabar, senyum kecil. Gelembung: kata itu pantas didengar berulang kali (angka 1000 dicoret-coret berubah jadi pita tanda hati). |
| **Chorus 1** | Mode siang kertas krem. 8 kotak huruf muncul di atas dan bergetar. **Tarik-ulur**: Ray menarik Sol mendekat lalu mundur melangkah sendiri, berulang dengan beat. Ray menghalangi dirinya sendiri: gambar bayangan Ray yang menahan tangan Ray. Push-in kamera pada pengulangan terakhir. |
| **Verse 2** | Close-up dua telapak tangan bertemu; garis-garis telapak tangan menyambung lewat animasi garis. Ray tampak utuh (hati kecil yang tadi retak merekat dengan plester/stiker). Sol tersenyum, Ray menyadari ini pertanda ia harus bicara. |
| **Pre-Chorus 2** | Ulang gaya Pre-Chorus 1 dengan variasi: kali ini Ray menggenggam tangan Sol, buku kecil terbuka berisi coretan, kali ini ia tidak mencoret. |
| **Chorus 2** | Seperti Chorus 1 tetapi lebih intens: warna pensil oranye lebih banyak, kotak huruf terisi lalu terhapus. Ad-lib "whoa oh, yeah" → not musik dan bintang meledak kecil. |
| **Bridge** (mode malam, pelan) | Ray memejamkan mata: layar menggelap, hanya garis kapur. Siluet Sol dalam gelembung pikiran di kepala Ray, 8 kotak bersinar samar. Gerak sangat pelan; hanya napas dan kedip cahaya. |
| **Chorus 3** | Kembali terang, lebih hangat. Tarik-ulur berhenti: Ray tidak mundur lagi, ia justru maju. 7 dari 8 kotak terisi. |
| **Outro** | Pengulangan frasa "delapan huruf" bergantian dengan "mata terpejam, kamu di pikiranku". Setiap pengulangan frasa mengisi kotak, ad-lib kecil bergulir. Akhir: kotak ke-8 terisi, Ray dan Sol bergandengan, kamera mundur pelan, fade ke krem. |

## 10. Arsitektur Proyek
```
src/
  Root.tsx, MV.tsx, config.ts
  data/ parseLyrics.ts  parseTimestamps.ts  buildTimeline.ts
  components/
    SketchBackground.tsx    // kertas krem + grain, mode day/night
    BoilFilter.tsx          // filter SVG line-boil
    Sprite.tsx              // gambar A/B boil, idle, blink, placeholder jika aset hilang
    ScribbleReveal.tsx      // mask coretan untuk memunculkan gambar
    Hatching.tsx            // garis arsiran animasi
    LyricBlock.tsx          // lirik + karaoke highlight + garis bawah penyanyi + ad-lib
    LetterTiles.tsx         // 8 kotak huruf, state 0-8, gemetar/terhapus/bersinar
    Doodles.tsx             // bintang, hati, tanda tanya, not, retakan
    PalmLines.tsx           // garis telapak tangan beranimasi
  scenes/ Verse1, PreChorus, Chorus, Verse2, Bridge, Outro
```

## 11. Kontrak Data
```ts
type Word = { text: string; start: number; end: number; isAdlib?: boolean };
type Line = { text: string; start: number; end: number; words: Word[]; singers: string[] };
type Section = { name: string; kind: 'verse'|'pre'|'chorus'|'bridge'|'outro';
                 index: number; singers: string[]; start: number; end: number; lines: Line[] };
```
- Parse tag `[Nama Seksi: A & B & C]`: nama seksi sebelum titik dua, daftar penyanyi sesudahnya dipisah `&`.
- `lirik.txt` = sumber teks; JSON = sumber waktu. Cocokkan dengan normalisasi (huruf kecil, hapus tanda baca/kurung). Ad-lib dalam kurung ditandai `isAdlib`.
- Seksi yang berulang (chorus 3x, pre-chorus 2x) diberi `index` (1, 2, 3) untuk variasi visual.
- `LYRIC_OFFSET_SEC` global untuk geser sinkronisasi.

## 12. Kriteria Penerimaan
1. Studio terbuka tanpa error; audio terputar; durasi = durasi lagu.
2. Setiap kata muncul/ter-highlight dalam ±150 ms dari timestamp.
3. Tag typo di baris pertama `lirik.txt` tertangani tanpa error.
4. Setiap seksi punya visual berbeda; Chorus 1/2/3 berbeda pada detail tetapi punya struktur sama.
5. Karakter terasa hidup (boil + idle + kedip) dan konsisten antar scene.
6. 8 kotak huruf berkembang sesuai 4.2 dan terisi penuh di akhir.
7. Tidak ada teks terpotong atau menutupi wajah karakter.
8. Render `npx remotion render MV out/mv.mp4` sukses, audio ikut.
9. Aset yang belum ada tampil sebagai placeholder berlabel, bukan crash.

## 13. Risiko & Mitigasi
| Risiko | Mitigasi |
|---|---|
| Karakter tidak konsisten antar gambar AI | Character sheet dulu; semua prompt melampirkan sheet; pakai seed/reference image |
| Latar transparan tidak bersih | Generate di latar putih polos/hijau, lalu `rembg`; rapikan tepi dengan sedikit feather |
| Banyak aset (±45) | Prioritaskan "aset inti" (lihat ASSET_PROMPTS.md); placeholder untuk sisanya |
| Skema JSON tak terduga | Inspeksi dulu, parser adaptif + log peringatan |
| Render lambat karena filter SVG | Pakai boil A/B swap sebagai default, filter hanya cadangan; `--concurrency` |
| Lirik tidak sinkron | `LYRIC_OFFSET_SEC` + log kata yang gagal dicocokkan |

## 14. Di Luar Lingkup v1
Lip-sync mulut sesuai suara, rig tulang penuh, versi vertikal 9:16.
