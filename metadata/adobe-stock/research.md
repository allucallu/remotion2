# Riset metadata Adobe Stock

Tanggal pemeriksaan: 2 November 2026. Cakupan: 40 composition pada registry kerja
saat ini, dari tujuh keluarga yang diminta. Semua kategori **8 — Graphic Resources**.
Riset web dilakukan; hasil listing dipakai untuk kosakata, bukan menyalin judul
atau keyword dan bukan bukti volume pencarian, persaingan, tren, atau penjualan.

## Panduan resmi yang diperiksa

- [Titles and keywords](https://helpx.adobe.com/stock/contributor/content-policies-guidelines/metadata/tips-effective-titles-keywords.html)
  diperbarui 18 Agustus 2026: judul ringkas dan akurat, idealnya di bawah 70 karakter;
  sampai 49 keyword; urutan penting dengan bobot terbesar pada 10 pertama;
  satu bahasa sesuai pengaturan akun, tanpa merek atau keyword berulang.
- [CSV requirements](https://helpx.adobe.com/stock/contributor/manage-your-portfolio/csv-requirements-content.html)
  diperbarui 11 Juni 2026: filename termasuk ekstensi maksimal 30 karakter dan
  harus persis sama dengan upload; judul maksimal 70 karakter, tanpa koma atau
  karakter khusus; keyword dipisahkan koma dan diurutkan; kategori berupa angka;
  UTF-8, maksimal 5.000 baris dan 1 MB. Releases opsional.
- [Create CSV](https://helpx.adobe.com/stock/contributor/manage-your-portfolio/create-csv-file.html)
  dan [template CSV resmi](https://contributor.stock.adobe.com/static/csv/Sample_Adobe_Stock_CSV_upload.csv):
  header diambil langsung dari file resmi melalui HTTP:
  `Filename,Title,Keywords,Category,Releases`. Satu baris per file upload.
  Template masih menyebut judul 200 karakter, sementara halaman persyaratan baru
  membatasi 70; proyek menggunakan batas baru yang lebih ketat.
- [Submit videos](https://helpx.adobe.com/stock/contributor/submit-your-content/submit-videos/submit-videos.html)
  menyebut 5–50 keyword, sedangkan halaman metadata menyebut maksimal 49;
  batas proyek 5–49 memenuhi keduanya. Tidak perlu mengisi hingga batas maksimum.
- [Choose category](https://helpx.adobe.com/stock/contributor/content-policies-guidelines/metadata/choose-right-category-content.html)
  menggolongkan design elements, simbol, dan aset digital dalam Graphic Resources.
  [Daftar bernomor resmi Adobe versi sebelumnya](https://helpx-origin.aws116.adobeitc.com/uk/stock/contributor/help/categories.html)
  secara eksplisit memetakan Graphic Resources ke 8. Nomor kategori CSV ini bukan
  ID kategori katalog/API pencarian seperti 444.
- [Technical video requirements](https://helpx.adobe.com/stock/contributor/submit-your-content/submit-videos/technical-requirements-for-video-submissions.html)
  menerima MP4 dan H.264, frame rate 30 fps dan ukuran 3840×2160; rentang durasi
  5–60 detik. Seluruh default source berada di dalam rentang ini (10–42 detik).

## Riset istilah per keluarga

Tautan di bawah adalah contoh listing yang ditemukan melalui pencarian berbahasa
Inggris. Temuan merupakan pengamatan kosakata judul/deskripsi yang dapat diakses,
bukan verifikasi seluruh isi media kompetitor. Istilah teknis pada listing seperti
alpha atau loop tidak dipindahkan ke aset proyek tanpa bukti source sendiri.

| Keluarga | Query / contoh listing | Kosakata relevan dan keputusan |
| --- | --- | --- |
| Focus Corner Brackets | `focus corner brackets animation`; [listing focus frame](https://stock.adobe.com/video/animated-focus-frame-corner-brackets/2164422653) | focus brackets, corner frame, object framing, viewfinder. Variasi dibedakan menurut rounded, beveled, dotted, pixel, woven, triple arc, dll. Empat sudut adalah satu desain framing, bukan empat aset. |
| Blank Caption Strip | `blank lower third banner`; [listing blank banner](https://stock.adobe.com/pl/video/comic-style-blank-lower-third-banner-with-bold-outline-and-dynamic-shape-empty-space-for-text-titles-and-information/2106113502) | blank caption strip, lower third, text background, copy space. Posisi default y=810 mendukung lower third. Tidak ada teks bawaan; OpenFrame berupa outline dengan interior hitam dan memakai text space, bukan bidang isi. Gaya comic listing tidak diterapkan ke caption proyek. |
| Directional Arrow | `directional arrows animation`; [listing pointer](https://stock.adobe.com/video/directional-arrow-animation-with-dynamic-moving-pointers-and-particle-motion-graphic-overlay/2069617817) | directional arrows, pointer, direction, guide, curved arrow. Tidak menambahkan particles dari listing karena aset proyek tidak memilikinya. Pack kedua mencakup return hook dan converging lanes, bukan hanya panah ke kanan. |
| Impact Accents | `impact burst animation comic`; [listing burst and snap](https://stock.adobe.com/video/burst-and-snap-fx-effects-hand-drawn-cartoon-pop-impact-push-graphic-motion-elements-doodle-set-animation-magical-burst-rays-stars-lines-and-sparcles-transparent-background-with-alpha-channel/1871487275) | impact accents, radial burst, hit effect, shards, comic burst. Gerak serangan cepat dan decay sesuai source; tidak menyamakan dengan aksen penarik perhatian yang ditahan lama. |
| Brush Caption | `brush stroke banner animation`; [listing paint banner](https://stock.adobe.com/video/white-paint-brush-stroke-banner-animation-grunge-text-highlight-line-isolated-lower-third-video-overlay-element/2195565681) | brush caption, blank banner, paint stroke, text background, bristle edges. Source memakai reveal bentuk bristle atau filamen; paint reveal benar-benar terlihat. Tidak mengklaim tangan atau alat kuas hadir. Natural pack dibedakan dengan feathered edges, gouache, overpaint, pigment texture. |
| Circle Highlights | `circle highlight marker animation`; [listing circle highlight](https://stock.adobe.com/video/circle-highlight-animation-with-alpha-channel/1939757181), [listing scribble](https://stock.adobe.com/video/hand-drawn-scribble-highlight-animation-2d-circle-animation-graphic-animation-2d-effect/964456955) | circle highlight, oval marker, object emphasis, draw on, empty center. Dua pack dibedakan berdasarkan pencil/dry brush/segmented dan felt marker/hatched/spiral/ribbon. Alpha pada listing tidak berlaku untuk MP4 proyek. |
| Attention Marks | `emphasis lines animation`, `attention exclamation animation`; [listing emphasis lines](https://stock.adobe.com/fr/video/comic-emphasis-lines-animation-on-transparent-background/2115345865), [listing exclamation](https://stock.adobe.com/video/attention-icon-animation-warning-sign-exclamation-point-4k-resolution-video/723602962) | attention marks, emphasis, pencil strokes, fan strokes, arches. Exclamation marks hanya untuk pack kedua yang memang menampilkan simbol tersebut. Tidak menambahkan warning triangle atau teks attention yang tidak ada. |

## Bukti implementasi dan batas klaim

- Tidak ditemukan `composition_concept.md` atau dokumen konsep aktif lain pada
  working tree setelah pencarian file tersembunyi di luar node_modules dan .git.
  Komentar source dibaca sebagai catatan konsep; registry, konfigurasi, default
  parameter, geometri, serta alur animasi menjadi sumber kebenaran.
- Tidak ada generator metadata komersial aktif sebelumnya. `src/config/metadata.ts`
  mengatur ukuran/timing Remotion, bukan metadata Stock. CSV/research batch lama
  sudah berstatus dihapus sebelum tugas dimulai dan tidak disentuh oleh tugas ini.
- `assets.json` menyimpan pemetaan filename stabil, judul, keyword terurut, kategori,
  serta uraian visual dan animasi hasil pembacaan source. `inventory.json` dihasilkan
  dari registry/config/default/segment source dan fakta tersebut; hash source
  mendeteksi perubahan yang memerlukan peninjauan ulang.
- Semua output yang dideskripsikan: solid black, H.264 MP4 yuv420p tanpa alpha,
  3840×2160, 30 fps, default props kosong. Pilihan props green/transparent atau
  warna lain tidak berarti file upload menyertakan pilihan tersebut.
- 15 Focus + 15 Caption masing-masing satu desain; 10 pack masing-masing lima
  desain. Circle/Attention berdurasi 35s; Arrow/Impact 30s; Brush 37s dan 42s.
  Impact mengulang masing-masing desain tiga kali, total 15 hit per output.
- Focus mulai terlihat dan melakukan focus-lock; `drawOnEntry=false`. Tidak
  diklaim menggambar saat masuk. Circle menelusuri garis; sebagian Attention
  menggambar, sebagian merakit/memanjangkan bentuk. Arrow pertama mulai terlihat;
  desain berikutnya merakit atau menggambar. Caption dan Brush mulai kosong.
- Tidak ada klaim seamless loop: kecocokan frame hitam awal/akhir saja tidak
  membuktikan kontinuitas gerak. Tidak ada klaim editable template, vector file,
  MOGRT, source code, software, resolusi, atau codec dalam keyword.
- Warna pada inventory mencantumkan parameter source dan warna per segmen;
  uraian visual menjelaskan warna yang dipakai. `secondaryColor` pada
  FocusSoftSnap dan FocusInkTrace tidak dipakai sebagai warna geometri default;
  keyword tidak mengklaim aksen gray pada keduanya.
- Dua filename dipendekkan untuk batas CSV: DirectionalArrowSculptedPack →
  `DirectionalArrowForms.mp4`; CircleHighlightExpressivePack →
  `CircleHighlightExpressive.mp4`. ID/source tetap. Seluruh filename lain memakai
  `<ID>.mp4` dan lolos batas 30 karakter.

## Peninjauan dan keterbatasan

Validasi otomatis memeriksa kelengkapan registry, ID/config/source, variasi dan
kontinuitas segmen, default background, ukuran/fps/durasi, duplikat, batas field,
klaim terlarang, hasil generate yang usang, dan CSV round-trip. Workflow membuat
CSV khusus pilihan render dan memeriksa daftar filename hasil render sebelum ZIP.

Pemeriksaan still, hasil perintah validasi, dan batas pemeriksaan final dicatat
di `validation.md`. Tidak ada render video penuh, upload ke portal Adobe,
eksekusi Actions jarak jauh, commit, atau push dalam tugas ini. Bahasa metadata
English perlu sesuai pilihan bahasa akun Contributor saat upload. Validasi lokal
tidak menjamin penerimaan moderasi atau performa pencarian/penjualan.
