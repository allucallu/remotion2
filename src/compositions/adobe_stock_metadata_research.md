# Riset metadata Adobe Stock

Tanggal akses sumber: **1 November 2026**, Asia/Makassar. Metadata judul dan keyword dalam bahasa Inggris.

**Status CSV: VALIDASI LOKAL BERHASIL; BELUM DIIMPOR KE ADOBE.** Metadata mencakup 13 aset. Tiga filename panjang sudah diperpendek pada CSV dan pemetaan output workflow; seluruh filename unik dan maksimal 30 karakter termasuk ekstensi. ID composition, visual, judul, keyword, kategori, dan release dipertahankan. Status ini menyatakan kesiapan struktur dan kecocokan pemetaan secara lokal, bukan keberhasilan impor atau persetujuan Adobe. Tidak ada render video penuh pada pekerjaan metadata maupun perbaikan filename ini.

## Sumber resmi dan ketentuan yang digunakan

Semua URL berikut diakses pada 1 November 2026. Dokumentasi Contributor dibedakan dari pengamatan listing pada bagian berikutnya.

| Sumber | Temuan dan penerapan |
| --- | --- |
| [S1 — CSV requirements](https://helpx.adobe.com/stock/contributor/manage-your-portfolio/csv-requirements-content.html), diperbarui 11 Juni 2026 | CSV, UTF-8, maksimal 5.000 baris dan 1 MB. Kolom wajib Filename, Title, Keywords; Category dan Releases opsional. Filename termasuk ekstensi maksimal 30 karakter; Title maksimal 70 karakter tanpa koma atau karakter khusus. Keywords maksimal 50, dipisahkan koma dan diurutkan menurut relevansi. Category harus angka. |
| [S2 — Create a CSV file](https://helpx.adobe.com/stock/contributor/manage-your-portfolio/create-csv-file.html), diperbarui 11 Juni 2026 | Satu baris per aset; nama header tidak diterjemahkan atau diganti. Nama CSV tanpa spasi. [Template unduhan resmi](https://contributor.stock.adobe.com/static/csv/Sample_Adobe_Stock_CSV_upload.csv) ditautkan dari halaman ini. Browser riset menolak tipe respons text/csv; pengambilan langsung melalui shell tetap timeout setelah percobaan dengan izin jaringan. Byte template tidak berhasil diperiksa. Nama kolom diverifikasi dari tabel resmi S1; tidak mengklaim telah membaca file contoh. |
| [S3 — Effective titles and keywords](https://helpx.adobe.com/stock/contributor/content-policies-guidelines/metadata/tips-effective-titles-keywords.html), diperbarui 18 Agustus 2026 | Judul ringkas dan spesifik; keyword terpenting pada 10 urutan awal. Halaman ini menyebut maksimal 49 keyword, berbeda dari 50 pada S1. Dipakai batas konservatif 49. Satu bahasa harus sesuai bahasa metadata akun; tanpa keyword duplikat, merek, atau istilah tidak relevan. |
| [S4 — Choose the right category](https://helpx.adobe.com/stock/contributor/content-policies-guidelines/metadata/choose-right-category-content.html) | Kategori dipilih berdasarkan isi utama. Graphic Resources mencakup latar dan simbol; Plants and Flowers mencakup botani; Industry mencakup manufaktur. |
| [S5 — Kategori bernomor pada dokumentasi resmi bahasa Polandia](https://helpx.adobe.com/pl/stock/contributor/help/categories.html), diperbarui 20 Mei 2021 | Rujukan resmi lama untuk pemetaan angka: 8 = Graphic Resources, 10 = Industry, 14 = Plants and Flowers. Deskripsi kategori dicocokkan dengan S4 yang lebih baru. Halaman Inggris terbaru yang terbaca tidak mencantumkan nomor secara eksplisit; asal versi pemetaan ini dicatat, bukan dianggap pembaruan 2026. |
| [S6 — Technical requirements for video](https://helpx.adobe.com/stock/contributor/submit-your-content/submit-videos/technical-requirements-for-video-submissions.html), diperbarui 11 Juni 2026 | MP4 termasuk format yang diterima dan H.264 termasuk codec yang direkomendasikan. Durasi 5–60 detik; 30 fps dan 3840×2160 termasuk spesifikasi yang didukung. Ini ketentuan unggahan, bukan bukti bahwa file lokal sudah dirender sesuai spesifikasi. |
| [S7 — Submit videos](https://helpx.adobe.com/stock/contributor/submit-your-content/submit-videos/submit-videos.html), diperbarui 11 Juni 2026 | Metadata video mencakup judul, keyword, dan kategori. Halaman ini menyebut 5–50 keyword; seluruh baris memakai 20–24 sehingga juga memenuhi S3. Review hasil impor dan video tetap dilakukan di Contributor Portal sebelum submit. |

Ketentuan khusus penerimaan/distribusi **video alpha** belum dapat dipastikan dari halaman Contributor terbaru yang berhasil dibaca. Pencarian dokumentasi alpha juga menampilkan forum komunitas; forum dan klaim listing tidak diperlakukan sebagai kebijakan resmi. Untuk batch ini, workflow menggunakan H.264 `yuv420p`, sehingga metadata tidak memakai transparent background atau alpha channel. Dukungan prop transparansi dan contoh ProRes dalam README bukan bukti adanya ekspor alpha produksi.

Struktur CSV yang dipakai:

```csv
Filename,Title,Keywords,Category,Releases
```

CSV dibuat memakai library standar Python `csv.writer`, UTF-8 tanpa BOM, delimiter koma dan akhir baris CRLF. Field Keywords yang memuat koma otomatis dikutip sebagai satu sel. Releases dikosongkan: tidak ada nama release yang diverifikasi dan nilai kosong bukan pernyataan legal bahwa release tidak diperlukan.

## Audit cakupan project dan ekspor

Sumber lokal yang dibaca: [aturan workspace](../../.agents/AGENTS.md), [registry](registry.tsx), [Root](../Root.tsx), seluruh 13 TSX aset, helper [watchful-eye/animation.ts](watchful-eye/animation.ts), [workflow produksi](../../.github/workflows/render.yml), [konfigurasi Remotion](../../remotion.config.ts), [package.json](../../package.json), konfigurasi metadata/format, [README](../../README.md), serta [brief caption](../../Blank_Caption_5_Konsep_dan_Prompt.md).

- Tidak ditemukan `AGENTS.md` pada rantai direktori induk langsung; aturan project tersedia di `.agents/AGENTS.md` dan sudah dibaca. Tidak ditemukan `composition_concept.md` aktif. `COMPOSITION_CONCEPTS.md` muncul sebagai file terhapus pada status Git, sehingga bukan sumber konsep produksi saat ini.
- Root merender `assetRegistry`; terdapat tepat 13 ID aktif. Tidak ada registrasi demo/testing/thumbnail/preview. Contoh registration `NamaAsset` dalam README bukan aset.
- Brief caption memuat lima ide. Hanya CaptionRailSlide dan CaptionCenterUnfold yang ada dalam kode dan registry. CaptionOffsetStack, CaptionFoldedEdge, dan CaptionCornerLock dikecualikan.
- Brief lama menggambarkan tahan–tutup–buka–tahan. Kedua TSX caption aktual memakai **masuk–tahan–keluar**, tanpa pembukaan ulang. Tidak ada teks di panel. Metadata tidak menyebut animasi teks, typography, MOGRT, template editable, atau seamless loop untuk caption.
- `quality: preview` pada dua pertumbuhan botani hanya mengurangi detail Studio. Registrasi memakai production dan kode memaksa detail produksi saat render. Tidak dibuat baris preview terpisah.
- Workflow membuat manifest dari seluruh ID registry. Output default tetap **`release/videos/<CompositionID>.mp4`**; tiga pengecualian filename pendek ditetapkan pada blok `case` di langkah render. Tabel pemetaan berikut dan kolom Filename CSV mengikuti output workflow tersebut. ID composition yang diberikan ke Remotion tidak berubah.
- Ekspor workflow menetapkan H.264, `yuv420p`, 3840×2160, tanpa override props transparansi. Semua registrasi 30 fps; kedua caption 300 frame/10 detik, lainnya 360 frame/12 detik. Preset generik 6 detik/HD dalam config tidak dipakai registrasi ini.
- Nama langkah workflow menyebut solid black, tetapi tidak menimpa warna background TSX. Mesh, contour, dan satin tetap berlatar warna/gradien. Aset lainnya berlatar hitam opak.
- README menyebut hanya WatchfulEye aktif; registry yang lebih lengkap digunakan sebagai acuan cakupan. README juga menunjuk `out/LivingEngravingWatchfulEye-4K.mp4` dan versi preview. Master lokal tersebut merupakan jalur ekspor lama dari aset yang sama, bukan varian produksi tambahan pada batch workflow ini. Preview dikecualikan. Helper mata lama tidak diimpor oleh implementasi mata aktif yang kini self-contained.
- Folder `release/videos` belum ada secara lokal. Nama tabel berikut adalah **keluaran yang ditentukan workflow**, bukan klaim bahwa semua file sudah dirender. Tiga nama pendek sudah diterapkan pada konfigurasi output, bukan sekadar rencana rename.

## Pengamatan pencarian Adobe Stock

Penelusuran memakai mesin pencarian dengan pembatasan domain `stock.adobe.com` dan hasil halaman Adobe Stock. Ini observasi kosakata listing yang terindeks, bukan audit ranking pencarian Adobe langsung atau pengukuran permintaan pembeli. Beberapa permintaan web timeout; judul listing tidak selalu cocok persis dengan karya ini. Tidak menyalin judul maupun urutan keyword kontributor.

| Jenis aset dan query yang ditelusuri | Bukti listing/pencarian dan keputusan editorial |
| --- | --- |
| Dua caption: `lower third blank`, `blank lower third banner` | [Listing panel caption kosong](https://stock.adobe.com/pl/video/comic-style-blank-lower-third-banner-with-bold-outline-and-dynamic-shape-empty-space-for-text-titles-and-information/2106113502) memperlihatkan kosakata lower third, blank, banner, dan ruang untuk teks. Dua aset dibedakan dengan left rail/sliding dan center/unfolding. Kata template dari [hasil lain](https://stock.adobe.com/video/lower-third-title-white-blue-animated-template-on-blank-background/580152057) tidak diadopsi. |
| Dua contour: `teal contour lines waves`, `terracotta concentric topographic contour`, lalu `topographic contour` | [Contour sebagai latar](https://stock.adobe.com/video/contour-topographic-background-animation/1300347701) dan [kontur konsentris](https://stock.adobe.com/video/concentric-topographic-contour-lines-zoom-in-with-organic-motion/2155100250) mendukung kosakata contour, topographic, concentric. Teal memakai wave/flowing; terracotta memakai ring/oval/rippling. Warna dan mekanisme spesifik diambil dari kode. |
| Satin: `purple satin ribbons flowing` | [Listing pita kain mengalir](https://stock.adobe.com/video/create-flowing-motion-design-using-waving-silk-ribbons-purple-hues-soft-fabric-lines-moving-elegant-abstract-animation-background/1438587607) memperlihatkan fungsi latar abstrak dan kosakata ribbon, fabric, flowing. Satin serta palet beige/mauve/purple berasal dari implementasi. |
| Mesh: `triangular mesh video` | [Listing permukaan triangular mesh](https://stock.adobe.com/video/abstract-green-low-poly-landscape-animation-features-moving-geometric-triangular-mesh-surface-with-glowing-horizon-creating-dynamic-digital-motion-background/2159201729) mendukung mesh, geometric, surface, background. Tidak memindahkan glowing horizon atau tema teknologi ke metadata karya ini. |
| Dua pertumbuhan botani: `botanical growth video`, `growing branches leaves black` | Hasil memuat [pertumbuhan tanaman](https://stock.adobe.com/video/time-lapse-of-plant-growth-from-seed-to-full-sprout-seed-germination-timelapse-growing-plants-over-time-botanical-growth-nature-time-lapse-sprouting-seed-plant-life-cycle-video/977819423). Tidak menemukan pembanding dekat yang terverifikasi untuk kedua gaya cabang ini. Growing, plant, botanical cukup relevan; tidak menyebut timelapse fotografis, perkecambahan, atau spesies pasti. Bentuk batang dan dedaunan dibedakan dari kode. |
| Lily: `lily bloom opening pink white black`, `botanical growth video` | [Listing lily mekar](https://stock.adobe.com/video/yellow-lily-flower-blooming-in-time-lapse-against-dark-background-showcasing-botanical-growth-and-nature/2149009897) mendukung lily, flower, blooming, bud. Warna ivory/pink, bercak, dan petal recurving ditentukan kode; yellow dan timelapse tidak diadopsi. |
| Bunga berlapis: `magnolia pink bloom black animation`, `flower petals blooming pink` | [Listing bunga yang membuka pada hitam](https://stock.adobe.com/video/pink-rose-plant-blooming-flower-in-time-lapse-on-a-black-background-single-red-flower-opens-bud-and-moving-petals-in-timelapse/2149009884) mendukung blooming, petals, bud. Tidak menyebut karya ini rose; judul memilih flower dan layered petals karena bentuknya stilisasi. |
| Mata: `engraved eye`, `eye engraving`, `engraved eye blinking` | Pencarian dilakukan, tetapi tidak menghasilkan pembanding Adobe Stock dekat yang dapat diverifikasi pada respons yang diterima. Engraving, blinking, gaze, iris, pupil dipilih dari geometri dan timing kode; tidak mengklaim kata-kata tersebut berasal dari data permintaan pasar. |
| Matahari: `sun face video`, `sun engraving animation` | [Halaman pencarian sun face](https://stock.adobe.com/search?k=%22sun+face%22) memperlihatkan istilah sun face dengan filter video. Tidak ada pembanding animasi engraving dekat yang terverifikasi. Blinking, pulsing rays, dan hatching berasal dari kode. Jumlah hasil halaman tidak dipakai sebagai volume pencarian. |
| Conveyor: `conveyor sphere`, `conveyor animation` | [Listing sistem conveyor animasi](https://stock.adobe.com/de/video/automated-cross-docking-conveyor-system-visualization-industrial-logistics-process-animation-supply-chain-management-motion/2072275895) memperlihatkan conveyor, system, process. Untuk karya ini, sphere/cube, press/cut/reassembly berasal dari kode; tidak menambahkan parcel, delivery, supply chain, atau logistik yang tidak digambarkan. |

Kategori yang dipasang kontributor lain tidak dianggap aturan. Tidak ada klaim volume keyword tinggi, persaingan rendah, atau jaminan penjualan. Listing yang menyebut alpha juga tidak digunakan sebagai bukti bahwa file memiliki alpha atau sebagai bukti kebijakan penerimaan Adobe.

## Pemetaan dan alasan metadata per aset

Seluruh filename di bawah berada di `release/videos/` menurut workflow. Judul lengkap dan susunan keyword ada dalam CSV; tabel ini menjelaskan pilihan, bukan menambah kolom internal ke CSV. Semua file produksi dalam cakupan adalah MP4 opak.

| Composition | Filename ekspor persis | Durasi | Visual aktual dan alasan judul/keyword utama | Category |
| --- | --- | --- | --- | --- |
| CaptionCenterUnfold | `CaptionCenterUnfold.mp4` | 10 s | Panel kosong abu muda membulat di bagian bawah; tumbuh dari anchor pusat, melebar simetris, menahan posisi, lalu menutup. Aksen garis bawah terpisah. Utamakan lower third, blank panel, caption, unfold, center. | 8 — Graphic Resources: elemen grafis untuk alas caption. |
| CaptionRailSlide | `CaptionRailSlide.mp4` | 10 s | Panel off-white dengan lapisan abu gelap dan rail vertikal kiri; meluncur melalui clipping, menahan posisi, lalu masuk kembali ke rail. Utamakan lower third, blank panel, sliding, left rail. | 8 — Graphic Resources: panel caption kosong. |
| LilyNocturneBloom | `LilyNocturneBloom.mp4` | 12 s | Batang hijau tumbuh, daun membuka, enam tepal ivory/pink berbercak membuka dan melengkung ke belakang, lalu benang sari tampil. Utamakan lily, blooming, opening, pink, ivory, recurved petals. Tidak ada latar malam fotografis. | 14 — Plants and Flowers: bunga lily sebagai objek utama. |
| SculpturalFlowerBloom | `SculpturalFlowerBloom.mp4` | 12 s | Bunga pink berlapis dengan petal cekung, tiga daun hijau dan bagian tengah keemasan; pertumbuhan batang diikuti pembukaan petal bertahap. Utamakan flower, blooming, pink, layered petals, growth. Tidak mengunci spesies berdasarkan nama helper. | 14 — Plants and Flowers: objek bunga, bukan pola abstrak. |
| SculpturalBotanicalGrowth | `SculpturalBotanicalGrowth.mp4` | 12 s | Pohon stilisasi dengan batang/cabang cokelat tebal, highlight kayu dan kanopi daun sage hijau yang tumbuh bertahap. Utamakan tree, growing, branch, green leaf, brown, sculptural. | 14 — Plants and Flowers: struktur tanaman berkayu. |
| RecursiveBotanicalGrowth | `RecursiveBotanicalGrowth.mp4` | 12 s | Bentuk tanaman bercabang halus menyerupai frond, batang tan keemasan dan daun sage dengan guratan/urat kecil. Utamakan botanical, growing, branch, sage green, fine lines. Fernlike menjelaskan siluet, bukan identifikasi spesies fern. | 14 — Plants and Flowers: pertumbuhan dedaunan botani. |
| AdaptiveMesh | `AdaptiveMesh.mp4` | 12 s | Kisi segitiga rapat pada gradien navy–petroleum–teal, sedikit bidang berwarna dan deformasi permukaan bergelombang; area kontraksi bergerak mengitari bidang. Utamakan mesh, triangular, teal, deformation, flowing; tanpa AI/data/cybersecurity. | 8 — Graphic Resources: latar geometris, tanpa objek teknologi spesifik. |
| SatinLineCurrents | `SatinLineCurrents.mp4` | 12 s | Tiga pita berserat halus, beige/mauve/lavender pada gradien plum–purple; gerak gelombang dan perubahan pencahayaan permukaan berulang. Utamakan satin, ribbon, flowing, beige, mauve, purple background. | 8 — Graphic Resources: latar kain abstrak. |
| SculptedContourTerracottaBasin | `TerracottaContourBasin.mp4` | 12 s | 56 kontur oval bersarang dengan pusat bergeser lembut ke kanan bawah; ekspansi/kontraksi dan gelombang pada palet cream–beige–terracotta. Utamakan contour, ring, terracotta, rippling, concentric. Bukan baskom keramik nyata atau peta lokasi. | 8 — Graphic Resources: pola kontur abstrak. |
| SculptedContourWaves | `SculptedContourWaves.mp4` | 12 s | 72 garis kontur melengkung mengikuti relief bersama dan gelombang berjalan diagonal; gradien gelap navy/petroleum/teal. Utamakan contour, wave, teal, flowing, dark blue. Bukan rekaman laut atau peta geografis. | 8 — Graphic Resources: latar garis topografis abstrak. |
| ImpossibleConveyorSphereToCube | `ConveyorSphereToCube.mp4` | 12 s | Mesin abu dengan benda oranye: press membentuk sphere menjadi cube, dua pisau memisahkan tiga bagian, mold menyatukan kembali sebagai sphere; belt dan lift mengembalikan carrier. Utamakan conveyor, machine, sphere, cube, transformation, pressing, cutting, reassembly. | 10 — Industry: mesin dan proses manufaktur stilisasi. |
| LivingEngravingBreathingSun | `EngravedBreathingSun.mp4` | 12 s | Wajah matahari bergurat krem di hitam, 24 sinar lurus/melengkung berubah panjang, kedipan, tatapan, alis dan senyum halus. Utamakan sun, face, engraving, blinking, pulsing, ray. Tidak menambahkan zodiak/agama. | 8 — Graphic Resources: motif simbol matahari ornamental. |
| LivingEngravingWatchfulEye | `LivingEngravingWatchfulEye.mp4` | 12 s | Satu mata bergurat krem dengan iris berpola, pupil mengubah ukuran, tatapan bergeser kanan/kiri, kedip dan squint. Utamakan eye, blinking, engraving, looking, side to side, iris, pupil. Tanpa klaim medis atau surveillance. | 8 — Graphic Resources: ilustrasi mata ornamental. |

Fungsi editorial yang disebut adalah kegunaan panel, latar, atau elemen ilustrasi. Ini bukan penetapan kategori lisensi Illustrative Editorial.

## Validasi yang dijalankan

- Dibuat dengan `csv.writer`, lalu dibuka kembali dengan `csv.reader(strict=True)`: **13 baris aset + 1 header**, setiap baris tepat **5 kolom**, filename unik tanpa membedakan kapital, seluruh Keywords tetap satu sel.
- Urutan dan himpunan 13 filename dicocokkan dengan ID registry dan pola output workflow. Tidak ada konsep belum dibuat, preview, still, helper, atau aset yang sudah dihapus ikut masuk.
- Judul **55–64 karakter**, hanya huruf ASCII dan spasi; tidak ada koma, tanda kutip, baris baru, atau karakter kontrol. Keyword **20–24 per aset**, tanpa duplikasi case-insensitive atau sel kosong; kategori hanya 8, 10, 14. Release seluruhnya kosong. Ukuran CSV jauh di bawah 1 MB.
- Pencarian istilah pada judul dan keyword memastikan tidak ada Remotion, React, TypeScript, merek aplikasi, MOGRT, editable/template, text animation, transparent/alpha, atau klaim 4K. Resolusi 3840×2160 ditetapkan workflow tetapi tidak dijadikan keyword teknis.
- Dievaluasi geometri melalui transpile TSX dan React server markup pada frame 0, 180, serta endpoint. Tidak ada NaN/Infinity; semua aset berubah dari awal ke frame tengah. Evaluasi dilakukan di memori, tanpa browser, rasterisasi, video render, atau artefak uji di disk.
- Untuk tujuh aset periodik — empat background abstrak, conveyor, sun, eye — markup frame virtual 360 sama persis dengan frame 0. Kode menggunakan fase/modulo 12 detik dan kembali ke state awal. Hanya tujuh aset ini mendapat keyword seamless loop. Caption dan empat aset growth/bloom tidak mendapat keyword loop.
- Hook Remotion diberi konteks pengujian 30 fps/3840×2160; easing caption memakai stub linear khusus pemeriksaan geometri finite. Hasil ini tidak mengklaim pengujian easing produksi, pemeriksaan semua frame, atau review visual video hasil encode. Klaim periodik ditopang fungsi asli aset periodik yang tidak memakai stub easing tersebut. Sambungan file hasil encode masih perlu diperiksa setelah render produksi.
- **Validasi ulang filename lulus untuk seluruh 13 aset** setelah perbaikan berikut. Uraian evaluasi geometri di atas berasal dari riset awal; perbaikan penamaan tidak merender ulang atau mengubah kode visual.

## Perbaikan filename dan validasi ulang lokal

Tiga nama di bawah sudah diterapkan pada kolom Filename CSV dan blok `case` workflow produksi. ID composition tetap sama dengan nama lama tanpa ekstensi.

| Nama ekspor lama | Panjang lama | Nama ekspor baru | Panjang baru termasuk `.mp4` |
| --- | --- | --- | --- |
| `SculptedContourTerracottaBasin.mp4` | 34 | `TerracottaContourBasin.mp4` | 26 |
| `ImpossibleConveyorSphereToCube.mp4` | 34 | `ConveyorSphereToCube.mp4` | 24 |
| `LivingEngravingBreathingSun.mp4` | 31 | `EngravedBreathingSun.mp4` | 24 |

Pemeriksaan rekursif project menemukan hanya `out/LivingEngravingWatchfulEye-4K.mp4` dan `out/LivingEngravingWatchfulEye-preview.mp4`. Ketiga video target belum tersedia dengan nama lama maupun baru. Karena itu tidak ada video lokal yang di-rename dan tidak ada file yang ditimpa. Render berikutnya melalui workflow akan langsung memakai nama pendek di `release/videos/`.

Validasi ulang:

- CSV dibaca kembali memakai parser CSV strict: 13 baris aset, lima kolom sesuai header resmi, UTF-8 dan Keywords tetap satu sel.
- Seluruh filename unik tanpa membedakan kapital, memakai ekstensi `.mp4`, dan panjang 16?30 karakter termasuk ekstensi. Tidak ada lagi konflik panjang filename.
- Blok shell render yang sebenarnya dijalankan dalam dry run dengan `npx` dan `mkdir` diganti fungsi penguji di memori. Ketiga cabang pengecualian dan sepuluh nama default menghasilkan 13 pasangan ID composition ? filename yang sama persis dengan CSV. Tidak menjalankan Remotion, membuat output render, atau mengirim unggahan.
- Seluruh Title, Keywords, Category, dan Releases dibandingkan dengan snapshot sebelum perbaikan dan identik; batas judul, jumlah serta duplikasi keyword dan kategori diperiksa ulang. Himpunan serta urutan 13 ID registry dipertahankan. Hash file TSX, TS, dan CSS dibandingkan sebelum/sesudah untuk memastikan kode visual tidak berubah.
- Perubahan workflow hanya menambahkan pemetaan tiga nama dan menggunakan variabel filename pada argumen output. Opsi render, ID input, manifest composition, dan tahapan lain dipertahankan.

**Validasi lokal berhasil. Belum ada percobaan impor CSV ke Adobe Stock dan belum ada konfirmasi impor berhasil dari Adobe.** File produksi tetap perlu tersedia dengan nama yang cocok sebelum penerapan metadata; bahasa metadata akun harus English. Pemeriksaan tampilan akhir serta sambungan loop hasil encode tetap dilakukan setelah render produksi, di luar tugas ini. Tidak ada render penuh pada perbaikan filename.

Kedua dokumen tetap di `src/compositions/`. Workflow ZIP saat ini hanya mengambil CSV dari root project; mekanisme packaging itu tidak diubah dalam perbaikan filename. Jika membutuhkan CSV ini dalam paket CI, salin versi terbaru ke root sebagai `adobe_stock_metadata.csv` atau sesuaikan lokasi pencarian pada workflow. Belum dibuat salinan root.
