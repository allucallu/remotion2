# PRD — MV Lirik Animasi "Hei, Nona" (Remotion)

## 1. Ringkasan
Membuat video musik (MV) lirik beranimasi dengan bercerita lewat gambar doodle ala buku harian, dari lagu buatan Suno AI. Output berupa video MP4 16:9 yang dirender dari proyek Remotion yang sudah ada.

Referensi gaya: video storytelling bergambar sketsa dengan teks tulisan tangan yang muncul di samping ilustrasi. Kita **mengambil konsepnya saja** (bercerita dengan gambar + teks tulisan tangan), tapi **visual, latar, palet, dan karakter dibuat berbeda** dan disesuaikan dengan vibe lagu.

## 2. Aset Input
Lokasi: folder `calon/` (asumsi: `public/calon/`; agent wajib memverifikasi lokasi sebenarnya dan menyesuaikan path `staticFile`).

| File | Fungsi |
|---|---|
| `lagu.mp3` | Audio utama (dari Suno) |
| `lirik.txt` | Lirik lengkap beserta tag seksi `[Intro]`, `[Verse 1]`, dst. |
| `*.json` (timestamp) | Waktu tiap kata/baris lirik. **Skema belum diketahui**: agent harus membaca dulu, lalu membuat parser. Kemungkinan bentuk: array kata `{word, startS, endS}` (format Suno aligned lyrics) atau array baris `{text, start, end}`. Parser harus mendukung keduanya. |

Spesifikasi lagu: Indonesian acoustic pop, gitar akustik solo, vokal pria hangat, ±90 BPM, mood manis-jenaka, bittersweet.

## 3. Spesifikasi Teknis
- Resolusi 1920×1080, 30 fps, codec H.264, audio AAC.
- Durasi mengikuti `lagu.mp3` (hitung dengan `getAudioDurationInSeconds` dari `@remotion/media-utils`, atau dari timestamp terakhir + 3 detik buffer).
- Bahasa lirik: Indonesia. Pastikan huruf/tanda baca tampil benar.
- Semua visual dibuat **di dalam kode** (SVG + CSS + Remotion). Tidak bergantung pada gambar eksternal/AI image generation.
- Font via `@remotion/google-fonts`.
- Dependensi yang boleh ditambah: `@remotion/google-fonts`, `@remotion/paths`, `@remotion/media-utils`, `@remotion/shapes`, `@remotion/noise`. Hindari dependensi berat lain.

## 4. Konsep Visual: "Buku Harian si Pengagum Diam-diam"
Seluruh video terasa seperti **halaman buku catatan/jurnal** yang dicoret-coret si "Aku" sambil bermain gitar. Beda dengan referensi (sepia + sketsa pensil), kita pakai **kertas bergaris + tinta bolpoin biru + stabilo warna-warni + stiker/washi tape + elemen layar HP/Instagram story**.

### 4.1 Karakter
- **Aku (si pengagum)**: doodle sederhana, kepala bulat, rambut acak-acakan, hoodie, selalu membawa gitar akustik. Ekspresi dibuat dengan garis minimal (mata titik, alis, mulut lengkung) supaya mudah dianimasikan lewat SVG.
- **Nona**: **tidak pernah digambar wajahnya**. Ia berupa siluet rambut sebahu/panjang, atau lingkaran story Instagram (cincin gradien pink-oranye) berisi siluet, dan hanya **senyumnya** yang digambar (lengkung kecil + pipi blush). Ini sesuai lirik: ia tidak tahu siapa si Aku, dan si Aku cuma ingin melihat senyumnya.
- Elemen penghubung: gitar, not musik, hati kecil, tanda tanya, emoji-doodle, ikon HP.

### 4.2 Palet
| Peran | Hex |
|---|---|
| Kertas krem | `#F7F2E7` |
| Garis buku | `#BCD3E8` |
| Garis margin merah | `#F0A6A6` |
| Tinta bolpoin biru (utama) | `#2B4A8B` |
| Pink stabilo (aksen Nona) | `#FF8FA8` |
| Kuning stabilo (highlight kata aktif) | `#FFE66D` |
| Mint (aksen tenang) | `#9ADBC5` |
| Grafit (outline karakter) | `#33363D` |
| Mode malam: kertas navy | `#1C2442` |
| Mode malam: tinta kapur | `#F4F1EA` |
| Gradien cincin story | `#F9CE34 → #EE2A7B → #6228D7` |

Mode malam dipakai di Bridge (suasana sepi, lampu meja, gitar fingerpicking).

### 4.3 Tipografi
- Lirik utama: **Patrick Hand** atau **Caveat** (pilih satu, konsisten). Ukuran 64–84 px, ditulis seperti tulisan tangan.
- Label seksi/judul kecil: **Gaegu** atau **Indie Flower**, 28–36 px, miring sedikit (rotate −2° s/d 2°).
- SFX/doodle text (mis. "tuk", "hmm?", "???"): ukuran bervariasi, boleh dalam kotak bicara gambar tangan.

### 4.4 Tekstur & "Hand-drawn feel"
- Latar kertas bergaris dengan garis margin merah di kiri; tambahan noise paper grain halus.
- Filter SVG `feTurbulence + feDisplacementMap` untuk membuat garis sedikit bergetar. **Efek "line boil"**: ganti seed turbulence tiap 4 frame agar garis terlihat hidup (gaya animasi tangan).
- Garis digambar dengan animasi `stroke-dashoffset` (`pathLength=1`) sehingga terlihat seperti sedang dicoret.
- Dekorasi: washi tape di sudut, sticky note, bekas isolasi, coretan bintang, panah dengan kepala bergaya tangan.

## 5. Sistem Layout & Lirik
- Gaya seperti referensi: **ilustrasi di satu sisi, blok lirik di sisi lain**, bergantian kiri/kanan antar kelompok baris supaya dinamis.
- Tampilkan 2–4 baris lirik sekaligus (satu bait kecil). Baris yang sudah lewat memudar ke opasitas 0.35, baris berikutnya ditunda.
- **Karaoke highlight**: kata yang sedang dinyanyikan mendapat sapuan stabilo kuning di belakangnya (animasi lebar 0→100% mengikuti `start→end` kata). Kata lain sudah/belum dinyanyikan beda opasitas.
- Kata muncul dengan efek "ditulis": clip-path wipe kiri→kanan + translateY kecil (4–8 px) dengan spring lembut.
- Kata kunci tertentu mendapat gaya khusus: "Nona" (pink, sedikit lebih besar), "senyum/senyummu" (digarisbawahi gelombang), "rindu/merindukan" (ada hati kecil).
- Tag seksi di `lirik.txt` ([Verse 1], dll.) **tidak ditampilkan sebagai lirik**, hanya dipakai untuk menentukan scene. Tampilkan label seksi kecil sebagai "judul bab" di sudut (mis. "bab 1: awalnya hanya saling melihat") hanya bila rapi, opsional.

## 6. Storyboard per Seksi
Gunakan nama seksi dari `lirik.txt` untuk memetakan ke scene. Setiap seksi dibagi menjadi beberapa sub-scene sesuai baris.

| Seksi | Mood & Visual |
|---|---|
| **Intro** (gitar saja) | Kertas kosong, tangan menggambar judul "Hei, Nona" dengan tinta biru. Gitar akustik dicoret sedikit demi sedikit, not musik melayang naik mengikuti pola picking. Tidak ada lirik. |
| **Verse 1** | Doodle koridor/jalan kecil. Aku dan siluet Nona berpapasan, ada senyum kecil (lengkung) tanpa kata. Lalu ia duduk di meja, ponsel, cek HP berkali-kali. Gelembung pikir berisi senyum Nona. Baris "Kita bahkan belum saling mengenal / mengapa aku merindukanmu?" → tanda tanya bertebaran, hati kecil muncul. |
| **Pre-Chorus 1** | Jam dinding berputar cepat (banyak waktu luang), permen/gula untuk "semanis itu senyummu", kepala Aku penuh coretan wajah Nona (tanpa wajah, hanya senyum). Ritme visual makin cepat menuju chorus. |
| **Chorus** | Pecah warna. Cincin story Instagram besar berisi siluet Nona muncul di tengah, Aku melambai kecil dari sisi layar HP. Teks "Hei, Nona" berukuran besar. Bagian kedua chorus: HP menampilkan ikon kamera/foto, Aku memegang gelembung "unggah, dong :)", lalu hanya senyum Nona yang muncul di story. Not & bintang berkilau. |
| **Verse 2** | Aku menunggu lingkaran story. Story terbuka → ternyata isinya teks kutipan panjang (gambarkan kotak penuh coretan garis teks). Aku membaca berulang: ekspresi bingung, tanda tanya, kepala miring, garuk kepala. "Maaf, Nona, bukan tak menghargai" → Aku menunduk sopan sambil tersenyum canggung. |
| **Pre-Chorus 2** | Gaya lucu: peta rute jalan-jalan imajiner berdua dengan garis putus-putus ke mana-mana (kafe, bioskop, pantai) yang digambar cepat. |
| **Chorus 2** | Ulang gaya Chorus 1 dengan variasi: warna sedikit lebih hangat, elemen baru (stiker), kamera sedikit berbeda. |
| **Bridge** (fingerpicking lembut) | **Mode malam**: kertas navy, tinta kapur, lampu meja menyala. Tempo visual melambat. Aku duduk bergitar, gelembung pikir masa depan: dua cangkir (tentang harimu, kesukaanmu), lalu dua siluet berdampingan ("tentang kita berdua"). Bintang kecil pelan-pelan muncul. |
| **Final Chorus** (emosional) | Kembali ke mode siang tapi hangat (golden hour: tambahkan overlay oranye lembut). Senyum Nona di layar ponsel diperbesar, Aku tersenyum tulus meski hanya melihat lewat layar. Elemen: kupu-kupu/hati melayang. "Dasar aku, ada-ada saja tingkahku" → Aku menepuk kepala sendiri sambil tertawa. |
| **Outro** (gitar saja) | Empat baris terakhir ditulis pelan, satu per satu. Gelembung percakapan kosong yang menunggu. Di akhir, halaman jurnal ditutup perlahan dengan gitar bersandar di sampingnya. Fade ke krem. |

## 7. Arsitektur Proyek (acuan)
```
src/
  Root.tsx              // daftarkan Composition "MV"
  MV.tsx                // komposisi utama: <Audio/> + <Sequence> per scene
  config.ts             // fps, size, warna, font, path aset
  data/
    parseLyrics.ts      // baca lirik.txt -> seksi + baris
    parseTimestamps.ts  // baca json -> baris & kata bertimestamp
    buildTimeline.ts    // gabungkan jadi struktur scene
  components/
    PaperBackground.tsx // kertas bergaris, noise, mode siang/malam
    HandFilter.tsx      // filter SVG line-boil
    DrawPath.tsx        // animasi menggambar stroke
    LyricBlock.tsx      // render baris lirik + karaoke highlight
    Highlighter.tsx     // sapuan stabilo
    Doodles/            // Guitar, Notes, Heart, Clock, Phone, StoryRing, Cup, Stars, Lamp
    Characters/         // Aku.tsx (beberapa ekspresi/pose), NonaSilhouette.tsx
  scenes/
    IntroScene.tsx, Verse1Scene.tsx, PreChorusScene.tsx, ChorusScene.tsx,
    Verse2Scene.tsx, BridgeScene.tsx, FinalChorusScene.tsx, OutroScene.tsx
```

### Kontrak data
```ts
type Word = { text: string; start: number; end: number };      // detik
type Line = { text: string; start: number; end: number; words: Word[] };
type Section = { name: string; kind: 'intro'|'verse'|'pre'|'chorus'|'bridge'|'final'|'outro';
                 start: number; end: number; lines: Line[] };
```
Jika JSON hanya berisi baris tanpa kata, kata dibagi rata di dalam durasi baris (interpolasi berbobot jumlah huruf).

Pencocokan lirik: JSON dari Suno sering memuat tag seksi dan kata-kata dengan tanda baca berbeda. Gunakan `lirik.txt` sebagai sumber teks yang benar, dan JSON hanya sebagai sumber waktu (cocokkan dengan normalisasi huruf kecil + hapus tanda baca; fallback pencocokan berurutan/greedy).

## 8. Aturan Animasi
- Semua animasi pakai `useCurrentFrame`, `interpolate`, `spring`. **Dilarang** CSS transition/animation dan `setTimeout`.
- Waktu dihitung dalam detik lalu dikonversi `frame = Math.round(sec * fps)`.
- Setiap scene punya transisi masuk/keluar singkat (±12 frame): halaman "disobek"/digeser, atau cross-fade dengan coretan.
- Gerak pendukung (idle): gitar bergoyang halus mengikuti ±90 BPM (`frame / (fps*60/90)`), not melayang, kedipan karakter tiap ±3 detik.
- Intensitas visual mengikuti seksi: Intro/Bridge/Outro tenang, Pre-Chorus naik, Chorus paling ramai.

## 9. Kriteria Penerimaan
1. `npx remotion studio` terbuka tanpa error dan komposisi "MV" tampil.
2. Audio terputar dan durasi komposisi = durasi lagu.
3. Setiap kata lirik muncul/ter-highlight dalam ±150 ms dari timestamp.
4. Tidak ada lirik yang terpotong di tepi layar atau bertumpuk dengan ilustrasi penting.
5. Tiap seksi memiliki visual berbeda sesuai storyboard (tidak satu layout diulang terus).
6. Bridge tampil mode malam; Chorus terlihat paling hidup.
7. Render `npx remotion render MV out/mv.mp4` berhasil, audio ikut, tanpa frame hitam.
8. Tidak ada elemen yang menyalin gambar/latar referensi (bukan sepia, bukan sketsa pensil anime).

## 10. Risiko & Mitigasi
| Risiko | Mitigasi |
|---|---|
| Skema JSON tidak sesuai dugaan | Agent membaca dan mencetak struktur JSON dulu; parser dibuat adaptif + log peringatan |
| Karakter SVG buatan kode tampak kaku | Gunakan bentuk sederhana, line-boil, dan gerak idle; jangan membuat detail anatomi rumit |
| Render lambat karena filter SVG | Batasi area filter, pakai `useMemo`, bisa render dengan `--concurrency` |
| Font tidak termuat saat render | Gunakan `loadFont()` dari `@remotion/google-fonts` dan `delayRender` bila perlu |
| Lirik tidak sinkron | Fungsi `offset` global di `config.ts` untuk geser waktu semua lirik |

## 11. Di Luar Lingkup (versi 1)
- Generasi gambar AI, lip-sync wajah, video vertikal 9:16 (bisa jadi versi 2 dengan `config` berbeda).
