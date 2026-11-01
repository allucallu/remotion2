# Blank Caption Plates — 5 Konsep Video dan Prompt Remotion

Lima aset video berupa bidang kosong untuk caption, keterangan singkat, kutipan, dan informasi pendukung. Editor menambahkan teks sendiri di aplikasi editing. Semua konsep memakai bentuk netral agar bisa dipakai untuk tutorial, wawancara, promosi, dokumenter, presentasi, dan media sosial.

Dokumen ini adalah brief produksi dan kumpulan prompt implementasi, bukan kode composition. Ide diprioritaskan berdasarkan kegunaan editorial; tidak ada klaim atau jaminan tingkat penjualan.

## Ringkasan variasi

| No. | Nama composition | Karakter visual | Mekanisme utama | Bidang teks kosong |
| --- | --- | --- | --- | --- |
| 1 | CaptionRailSlide | Tegas, bersih, asimetris | Panel keluar dari rail kiri | Satu panel panjang |
| 2 | CaptionCenterUnfold | Lembut, simetris | Dua bagian membuka dari tengah | Satu kapsul lebar |
| 3 | CaptionOffsetStack | Berlapis, sedikit dimensional | Tiga lapisan menyusun posisi | Panel depan dominan |
| 4 | CaptionFoldedEdge | Editorial, seperti kartu kertas | Bibir bawah membuka dan menutup | Kartu lebar dengan lipatan kecil |
| 5 | CaptionCornerLock | Presisi, modular | Sudut mengunci sebelum bidang terbuka | Panel lebar dengan siku luar |

## Spesifikasi bersama

- Target produksi: 3840 × 2160, 30 fps, 10 detik atau 300 frame.
- Tidak ada teks, angka, huruf, logo, watermark, ikon tematik, maupun placeholder, termasuk tulisan contoh.
- Satu desain per video, bukan montage lima desain.
- Background versi hitam: #000000 solid, tanpa gradien, lantai, vignette, atau bayangan di luar objek.
- Siapkan dukungan versi alpha melalui prop `transparentBackground`. Pada versi alpha, bidang panel tetap opak dan hanya area luar panel yang transparan. Ekspor alpha memerlukan format dan codec yang mendukung transparansi; MP4 H.264 biasa bukan hasil alpha.
- Untuk panel berwarna, versi alpha lebih menjaga warna saat dikomposit. Versi hitam tidak dianggap pengganti alpha yang setara; Screen dapat mengubah tampilan panel.
- Tidak ada neon, glow, lens flare, partikel, kamera bergerak, atau rotasi seluruh caption.
- Bidang teks kosong harus datar, cukup luas, dan diam selama fase tahan. Detail dekorasi hanya di tepi.
- Gunakan ketebalan garis minimal sekitar 6 px pada 4K untuk detail penting, supaya tetap terbaca saat diperkecil ke 1080p.
- Semua koordinat di bawah dihitung pada kanvas 4K, dengan titik asal di kiri atas. Bentuk boleh diparameterkan menggunakan skala relatif terhadap ukuran composition.

### Struktur waktu: frame pertama sudah menampilkan desain lengkap

Untuk thumbnail yang langsung terbaca, kelima video dimulai dengan caption dalam kondisi terbuka penuh. Video memakai satu siklus **tahan → tutup → buka → tahan**:

| Frame | Waktu perkiraan | Keadaan |
| --- | --- | --- |
| 0–221 | 0–7,4 detik | Desain lengkap, diam, siap diberi teks |
| 222–251 | 7,4–8,4 detik | Panel menutup sesuai mekanisme desain |
| 252–287 | 8,4–9,6 detik | Panel membuka kembali |
| 288–299 | 9,6–10 detik | Desain lengkap dan identik dengan frame 0 |

Tidak ada penghilangan seluruh aset dengan fade global. Bentuk menutup dan membuka melalui konstruksinya. Anchor kecil boleh tetap terlihat ketika panel tertutup. Posisi dan warna frame 299 harus identik dengan frame 0 sehingga sambungan loop tidak meloncat.

Editor dapat memakai bagian tahan saja. Untuk urutan masuk–tahan–keluar, editor bisa mulai dari frame 252, melanjutkan klip yang diduplikasi melewati sambungan loop, kemudian mengakhiri setelah frame 251 pada salinan berikutnya. Teks ditambahkan dan diberi timing secara terpisah oleh editor.

### Ketentuan implementasi untuk setiap prompt

Setiap prompt di bawah siap disalin sendiri dan sudah memuat kebutuhan inti:

- Satu file TSX untuk visual, helper, tipe props, dan fungsi timing. Tidak membuat `animation.ts` terpisah.
- Baca pola project sebelum menambahkan composition; perubahan registrasi minimal bila diperlukan.
- Animasi deterministik berbasis frame Remotion, tanpa CSS keyframes, timer, atau random yang berubah tiap render.
- Tidak perlu aset eksternal, font, gambar unduhan, atau paket baru untuk bentuk sederhana ini.
- Jangan render video penuh. Cukup lint/typecheck yang tersedia serta beberapa still preview beresolusi rendah bila lingkungan mendukung. Render final dilakukan melalui GitHub.

---

## 1. Rail Slide — Panel keluar dari rail

### Konsep

Caption persegi panjang dengan anchor vertikal di kiri. Sebuah lapisan belakang tipis memberi kedalaman, sementara panel utama keluar dari dalam rail seperti kartu yang ditarik dari slot. Cocok sebagai alas caption satu atau dua baris tanpa kesan berita atau tema teknologi tertentu.

### Desain visual

- Panel utama: x=760, y=1590, lebar=2320, tinggi=260, radius sudut=18 px; warna putih hangat #F2EFE8.
- Rail kiri: x=716, y=1576, lebar=28, tinggi=288; warna abu muda #ADB8BC.
- Lapisan belakang: x=778, y=1606, lebar=2320, tinggi=260; warna abu gelap #525D64. Bagian yang terlihat hanya offset kanan dan bawah.
- Ruang teks aman: x=880 sampai 2960, y=1642 sampai 1798.
- Panel utama tidak memakai garis dekoratif di tengah atau tekstur. Rail dan bidang utama memiliki celah 16 px.

### Gerak

Saat menutup, panel utama masuk ke slot kiri melalui mask yang terikat ke rail. Lapisan belakang menyusul sedikit lebih lambat. Rail memendek terakhir menjadi anchor kecil. Saat membuka, rail kembali memanjang, lapisan belakang keluar lebih dulu, kemudian panel utama meluncur dan berhenti tepat. Tidak ada bounce atau overshoot pada bidang teks.

### Prompt implementasi

```text
Buat composition Remotion bernama CaptionRailSlide, 3840x2160, 30 fps, 300 frame, untuk aset blank caption yang universal. Gunakan satu file CaptionRailSlide.tsx untuk visual dan timing; jangan membuat animation.ts terpisah. Ikuti pola project dan registrasikan composition dengan perubahan minimal bila diperlukan.

Jangan tampilkan teks apa pun, termasuk huruf, angka, nama, label, logo, atau placeholder. Background default #000000 solid. Tambahkan prop transparentBackground untuk menghilangkan background saja; panel tetap opak. Tanpa neon, glow, partikel, atau kamera bergerak.

Buat panel utama putih hangat #F2EFE8 pada x760 y1590, ukuran 2320x260, radius18. Buat rail vertikal #ADB8BC pada x716 y1576, ukuran28x288. Tambahkan satu panel belakang #525D64 pada x778 y1606, ukuran2320x260. Lapisan belakang berada di bawah panel utama. Area x880–2960 dan y1642–1798 harus sepenuhnya kosong serta tidak terganggu dekorasi.

Frame0–221: bentuk lengkap dan diam. Frame222–244: panel utama ditarik ke kiri menuju rail menggunakan translation yang dikombinasikan dengan clipping, sehingga panel benar-benar masuk slot, bukan bergerak keluar kanvas. Frame228–248: lapisan belakang menyusul masuk. Frame244–251: rail memendek dari tinggi288 menjadi64 dengan pusat vertikal tetap. Semua bagian panel harus hilang saat tertutup; anchor rail kecil tetap terlihat.

Frame252–259: rail memanjang menjadi288. Frame256–278: lapisan belakang keluar dari rail. Frame261–287: panel utama keluar dan mengunci tepat pada koordinat awal. Frame288–299: tahan diam, sama persis dengan frame0. Gunakan easing terkontrol tanpa overshoot dan tanpa fade global. Clip harus mencakup offset lapisan belakang saat terbuka, tetapi menyembunyikannya sepenuhnya saat tertutup. Hitung geometri mask agar tidak ada potongan panel tersisa di kanan.

Semua gerak berbasis useCurrentFrame, interpolate atau helper deterministik. Jangan pakai CSS animation atau paket baru. Jangan render video penuh. Jalankan lint/typecheck yang tersedia; jika bisa, buat still preview pada frame0,236,251,270,299 dengan resolusi960x540. Periksa panel awal lengkap, clipping bersih, fase tahan stabil, serta frame299 identik dengan frame0. Laporkan file dan perubahan registrasi.
```

---

## 2. Center Unfold — Kapsul membuka dari tengah

### Konsep

Caption berbentuk persegi panjang membulat yang tumbuh dari pusat ke dua sisi. Dua tutup ujung bergerak menjauh sambil membuka bidang penghubung di antaranya. Hasil akhir harus terlihat sebagai satu bidang bersih, tanpa garis sambungan tengah.

### Desain visual

- Bidang utama: x=790, y=1580, lebar=2260, tinggi=280, radius=70 px; warna #E7ECEF.
- Tutup kiri dan kanan: masing-masing lebar=70 px, tinggi=280 px, warna sama dengan bidang utama.
- Aksen bawah: x=1020, y=1878, lebar=1800, tinggi=8 px; warna #7E949E. Terpisah 18 px dari panel.
- Ruang teks aman: x=950 sampai 2890, y=1640 sampai 1800.
- Tanpa bevel atau highlight mengilap; kesan lembut berasal dari proporsi dan sudut membulat.

### Gerak

Kedua ujung bergerak menuju pusat saat menutup; bidang di tengah menyempit melalui geometri, bukan dengan mengecilkan seluruh objek. Aksen bawah menyusut menuju pusat lebih dulu. Saat membuka, kedua ujung berpisah dan bidang penghubung mengikuti. Tinggi panel tetap agar caption tidak terlihat tertekan.

### Prompt implementasi

```text
Buat satu file CaptionCenterUnfold.tsx berisi composition Remotion CaptionCenterUnfold, 3840x2160,30fps,300frame, beserta seluruh helper timing. Ikuti struktur project. Jangan buat animation.ts terpisah. Tidak ada teks, angka, huruf, logo, ikon, atau placeholder.

Background default hitam solid #000000; dukung transparentBackground untuk versi alpha tanpa mengurangi opacity panel. Buat satu caption membulat warna #E7ECEF pada x790 y1580, ukuran2260x280,radius70. Pusat horizontal x1920 dan pusat vertikal y1720. Tambahkan aksen bawah #7E949E pada x1020 y1878 ukuran1800x8. Area x950–2890,y1640–1800 harus kosong dan rata.

Bangun bentuk sebagai bidang penghubung dan dua tutup ujung yang masing-masing lebarnya70. Pada keadaan penuh bentuk harus terbaca sebagai satu panel tanpa celah, seam, atau garis tengah. Gunakan overlap kecil bila perlu. Jangan scale seluruh panel karena radius dan tinggi harus tetap.

Frame0–221: bentuk lengkap dan stabil. Frame222–235: aksen bawah memendek simetris ke pusat hingga habis. Frame228–251: kedua ujung panel bergerak menuju pusat, sementara lebar bidang penghubung mengikuti. Kondisi tertutup adalah kapsul vertikal selebar140 dan tinggi280 di pusat x1920; bukan garis yang tiba-tiba menghilang. Pastikan radius selalu valid terhadap lebar bentuk saat menyempit.

Frame252–281: kedua ujung bergerak ke posisi terbuka dan bidang penghubung melebar simetris. Frame270–287: aksen bawah memanjang dari pusat sampai lebar1800. Frame288–299: bentuk identik dengan frame0. Tidak ada bounce, rotasi, neon, glow, gradient bergerak, atau fade global. Panel hanya berubah lebar pada fase buka/tutup; tinggi tetap280.

Gunakan animasi frame deterministik, SVG atau bentuk DOM sederhana. Jangan gunakan CSS keyframes atau dependensi tambahan. Jangan render video penuh; render final dilakukan di GitHub. Jalankan lint/typecheck yang tersedia dan, jika lingkungan mendukung, still960x540 pada frame0,239,251,269,299. Periksa seam tengah, simetri ujung, radius, ruang teks, dan kesamaan frame awal/akhir.
```

---

## 3. Offset Stack — Tiga kartu menyusun posisi

### Konsep

Tiga panel dengan ukuran sama bertumpuk dalam offset kecil. Dua panel belakang membentuk tepian warna yang terkontrol, bukan bayangan kabur. Saat bergerak, lapisan meluncur melalui jendela yang sama dan tersusun berurutan, seperti tiga kartu yang diselaraskan.

### Desain visual

- Panel depan: x=770, y=1580, ukuran=2300×270, radius=14; warna #F0EDE5.
- Panel tengah: x=788, y=1598, ukuran sama; warna #9CAFB2.
- Panel belakang: x=806, y=1616, ukuran sama; warna #596A75.
- Tampilan akhir: bagian kanan dan bawah dua panel belakang tampak sebagai dua tepian setebal 18 px.
- Ruang teks aman: x=900 sampai 2940, y=1638 sampai 1792.
- Tidak memakai drop shadow; kedalaman berasal dari offset dan kontras warna.

### Gerak

Panel depan menutup ke kiri, panel tengah ke kanan, kemudian panel belakang ke kiri. Semua bergerak di dalam mask lokal sehingga tidak melintas liar di layar. Saat membuka, panel belakang muncul dahulu, diikuti panel tengah dan panel depan. Offset akhir kecil; bidang utama tetap dominan.

### Prompt implementasi

```text
Implementasikan composition CaptionOffsetStack dalam satu file CaptionOffsetStack.tsx. Ukuran3840x2160,30fps,durasi300frame. Seluruh helper dan timing tetap di file ini; jangan buat animation.ts. Baca pola project dan lakukan registrasi seperlunya.

Buat blank caption tanpa teks, huruf, angka, logo, placeholder, atau ikon. Background default #000000 solid, opsional transparentBackground untuk alpha; panel-panel tetap opak. Tidak ada glow, partikel, kamera, drop shadow, atau tekstur bergerak.

Susun tiga rounded rectangle2300x270,radius14. Backmost #596A75 pada x806 y1616. Middle #9CAFB2 pada x788 y1598. Front #F0EDE5 pada x770 y1580. Urutan z harus benar: depan menutup tengah, tengah menutup belakang. Area x900–2940,y1638–1792 sepenuhnya kosong. Dua tepian belakang hanya terlihat sebagai offset18px per lapisan pada kanan/bawah.

Gunakan satu clip lokal yang mencakup seluruh bentuk final dari x770 sampai3106 dan y1580 sampai1886; tidak boleh memotong radius atau tepian akhir. Frame0–221: susunan lengkap dan diam. Frame222–239: panel depan bergeser ke kiri sampai seluruhnya keluar area clip. Frame228–245: panel tengah bergeser ke kanan sampai seluruhnya keluar area clip. Frame234–251: panel belakang bergeser ke kiri sampai keluar clip. Hitung jarak translation dari batas aktual clip, jangan hanya memakai lebar panel. Saat frame251 tidak ada sisa tepi atau serpihan.

Frame252–271: panel belakang masuk dari kiri menuju posisi akhir. Frame260–279: panel tengah masuk dari kanan. Frame268–287: panel depan masuk dari kiri dan menutup lapisan di bawahnya. Frame288–299: tahan identik dengan frame0. Gerak tiap lapisan terasa seperti kartu yang bergeser pada bidang datar, tanpa putaran atau lemparan. Gunakan easing tanpa overshoot; tidak ada fade global.

Pakai useCurrentFrame dan fungsi deterministik; bentuk sederhana tanpa paket baru. Jangan render full video. Jalankan lint/typecheck yang tersedia dan jika memungkinkan still960x540 pada frame0,234,251,271,299. Periksa z-order, arah gerak, clipping tiap lapisan, tepi18px, dan hold yang benar-benar statis. Laporkan hasil pemeriksaan.
```

---

## 4. Folded Edge — Kartu dengan bibir lipatan

### Konsep

Sebuah bidang caption seperti kartu kertas tebal dengan bibir lipatan kecil di bawah. Detail lipatan memberi karakter editorial tanpa sobekan, noda, atau tekstur vintage yang membatasi tema. Animasi berpusat pada engsel bawah, kemudian badan kartu masuk ke celah di belakangnya.

### Desain visual

- Badan kartu: x=800, y=1560, ukuran=2240×290; warna #EEE7DA; sudut hampir siku, radius=8 px.
- Bibir bawah: x=800, y=1818, ukuran=2240×32; warna #C6BDAE. Bibir menutupi 32 px terbawah badan kartu.
- Garis engsel: y=1818, warna #AA9D8A, tebal=6 px, hanya di batas lipatan.
- Ruang teks aman: x=930 sampai 2910, y=1620 sampai 1768.
- Tidak ada garis buku, tulisan, staples, selotip, atau ilustrasi. Kesan material hanya dari dua bidang warna dan engsel.

### Gerak

Bibir bawah melipat ke atas menghadap badan kartu, lalu kartu turun masuk ke slot bawah. Saat membuka, badan kartu naik dari slot dan bibir berputar kembali ke posisi akhir. Gunakan proyeksi 2D sederhana sehingga tetap ringan, tetapi gerakan terasa berengsel, bukan bar yang sekadar dipipihkan.

### Prompt implementasi

```text
Buat CaptionFoldedEdge.tsx, satu file Remotion dengan composition CaptionFoldedEdge 3840x2160,30fps,300frame. Sertakan helper dan timing di file yang sama; tidak ada animation.ts terpisah. Ikuti pola registrasi project.

Aset adalah blank caption: tanpa teks, angka, huruf, placeholder, logo, atau ilustrasi. Background default #000000 solid dan dukung transparentBackground; kartu tetap opak. Tanpa glow, partikel, kamera bergerak, bayangan eksternal, atau foto tekstur.

Badan kartu #EEE7DA pada x800 y1560, ukuran2240x290,radius8. Bibir lipatan #C6BDAE menempati x800 y1818,2240x32 dan berada di depan badan. Engsel horizontal y1818 dengan garis6px warna#AA9D8A. Area x930–2910,y1620–1768 harus kosong, datar, serta bebas detail. Buat tampilan editorial bersih, tidak distressed.

Frame0–221: seluruh kartu terbuka dan statis. Frame222–233: bibir melipat180derajat mengitari engsel y1818, dari bawah engsel menuju atas engsel. Gunakan proyeksi geometris 2D dari sudut lipatan: tinggi tampak mengikuti cosine sudut, sisi yang tampak berganti setelah melewati90derajat, dengan perubahan warna yang halus dan konsisten. Hindari scaleY negatif yang membalik lapisan tanpa kontrol. Tidak perlu Three.js. Frame234–251: badan kartu turun ke bawah dan hilang melalui clip lokal pada batas slot y1850; bibir yang sudah terlipat ikut turun bersama badan. Sisakan hanya garis slot tipis sepanjang2240 pada y1850.

Frame252–273: badan kartu beserta bibir dalam kondisi terlipat naik dari slot ke koordinat semula. Frame274–287: bibir membuka kembali dari180 ke0derajat menuju posisi x800 y1818 ukuran2240x32. Frame288–299: keadaan identik dengan frame0. Garis slot yang tersisa saat tertutup harus tertutup penuh oleh bentuk final atau dilebur secara geometris ke tepi bawah; jangan biarkan garis dekoratif tambahan muncul pada frame akhir. Tinggi dan posisi area caption tidak berubah ketika hold.

Pastikan engsel mengikuti badan selama translation; tidak melayang terpisah. Gunakan frame Remotion deterministik dan easing tanpa bounce. Jangan render full video. Jalankan lint/typecheck yang tersedia; bila bisa buat still960x540 frame0,228,251,272,281,299 untuk melihat lipatan, clipping, dan pose akhir. Render final dilakukan di GitHub.
```

---

## 5. Corner Lock — Panel dikunci empat sudut

### Konsep

Panel persegi panjang dengan empat siku terpisah di luar sudutnya. Siku bergerak menuju posisi akhir lalu bidang caption terbuka dari kiri ke kanan. Gaya presisi berasal dari hubungan antarbagian, tanpa reticle, HUD, angka, atau elemen teknologi yang terlalu spesifik.

### Desain visual

- Panel utama: x=790, y=1590, ukuran=2260×260, radius=10; warna #DEE5E5.
- Empat siku luar: panjang masing-masing lengan=50 px, tebal=8 px; warna #8DA5AA.
- Jarak siku terhadap tepi panel=18 px. Posisi pertemuan garis siku: kiri atas (772,1572), kanan atas (3068,1572), kiri bawah (772,1868), kanan bawah (3068,1868).
- Ruang teks aman: x=920 sampai 2920, y=1642 sampai 1798.
- Tidak ada garis silang, titik target, skala, scanline, atau garis yang bergerak melewati ruang teks.

### Gerak

Saat menutup, bidang caption ditarik ke kiri melalui mask. Setelah itu, siku bergerak mendekati pusat dan menyatu menjadi bracket kecil. Saat membuka, keempat siku menyebar ke posisi luar, lalu bidang terisi dari kiri ke kanan. Siku berhenti sebelum panel selesai terbuka agar terasa mengunci struktur.

### Prompt implementasi

```text
Buat composition CaptionCornerLock dalam satu file CaptionCornerLock.tsx. Ukuran3840x2160,30fps,300frame. Semua helper, props, dan timing di file yang sama tanpa animation.ts. Ikuti struktur project yang sudah ada.

Tanpa teks, huruf, angka, logo, watermark, placeholder, maupun ikon. Background default #000000 solid, dukung transparentBackground untuk alpha. Panel tetap opak. Gaya netral, bukan HUD: tidak ada crosshair, reticle, koordinat, scanline, glow, neon, atau partikel.

Panel utama #DEE5E5 pada x790 y1590 ukuran2260x260,radius10. Empat corner bracket warna#8DA5AA, tebal8px, panjang lengan50px, dengan jarak18px dari panel. Titik siku final: TL772,1572; TR3068,1572; BL772,1868; BR3068,1868. Lengan tiap bracket mengarah sepanjang tepi persegi panjang yang dibingkainya, bukan menjauhi panel. Area x920–2920,y1642–1798 harus kosong dan rata.

Frame0–221: desain lengkap dan statis. Frame222–240: panel tertutup dari kanan ke kiri memakai mask; jangan scale panel sehingga radius terdistorsi. Frame241–251: bracket berpindah ke susunan tertutup dengan empat titik siku TL1880,1680; TR1960,1680; BL1880,1760; BR1960,1760. Saat fase ini, pendekkan panjang lengan dari50 menjadi20px agar bracket tidak saling berpotongan. Semua bracket mempertahankan orientasi dan ketebalan garis. Pada frame251 hanya empat siku kecil yang tersisa.

Frame252–268: bracket menyebar kembali ke koordinat final sambil panjang lengannya pulih menjadi50px. Frame263–287: panel terbuka dari kiri ke kanan dengan mask lokal, sehingga bidang baru menyusul struktur yang sedang mengunci. Frame288–299: bentuk identik dengan frame0. Siku tidak bounce, berkedip, berputar, atau terus berdenyut selama hold. Jangan pakai fade global.

Gunakan SVG atau DOM dan animasi berbasis useCurrentFrame yang deterministik. Tanpa dependensi baru. Jangan render video penuh. Jalankan lint/typecheck yang tersedia serta still960x540 frame0,235,251,264,299 jika lingkungan mendukung. Periksa arah siku, jarak18px, tidak ada overlap pada keadaan tertutup, mask bersih, dan pose awal/akhir sama. Laporkan hasil pemeriksaan dan file yang berubah.
```

---

## Pemeriksaan sebelum render final

1. Tidak ada tulisan atau simbol yang menyerupai placeholder di bidang caption.
2. Frame 0 sudah menunjukkan seluruh desain dengan proporsi akhir.
3. Fase tahan benar-benar diam; editor tidak perlu mengikuti bidang teks yang bergerak.
4. Tidak ada lapisan yang bocor keluar mask atau serpihan saat tertutup.
5. Anchor, engsel, dan garis mengikuti panel yang benar.
6. Frame 299 dan frame 0 memiliki geometri serta warna yang sama.
7. Versi alpha mempertahankan opacity panel; background luarnya benar-benar transparan.
8. Desain tetap terbaca saat diperkecil ke 1080p, tanpa garis tipis bergetar.
9. Preview boleh memakai teks sementara hanya untuk pemeriksaan internal; hapus seluruh teks dari composition final.
10. Render full tidak dilakukan dalam tahap implementasi prompt ini.

## Urutan percobaan yang disarankan

Mulai dari **Rail Slide** untuk menguji proporsi caption dan kualitas clipping. Lanjutkan **Center Unfold** untuk versi lembut dan **Offset Stack** untuk versi lebih berkarakter. **Folded Edge** memerlukan perhatian terbesar pada engsel; **Corner Lock** memerlukan ketelitian pada hubungan panel dan posisi siku.


## Status Implementasi

| Composition | File TSX | Status | Validasi yang sudah dilakukan | Masalah terbuka |
| --- | --- | --- | --- | --- |
| CaptionRailSlide | [src/compositions/CaptionRailSlide.tsx](src/compositions/CaptionRailSlide.tsx) | Selesai | 300 state finite; hold statis; determinisme; 5 still 960x540 diperiksa; PNG 0/299 identik; alpha dan panel opak lulus. | Tidak ada. Lint/typecheck menyeluruh dijadwalkan setelah aset kelima. |
| CaptionCenterUnfold | [src/compositions/CaptionCenterUnfold.tsx](src/compositions/CaptionCenterUnfold.tsx) | Selesai | 300 state finite; hold statis; determinisme; 5 still 960x540 diperiksa; PNG 0/299 identik; seam dan alpha lulus. | Tidak ada. Lint/typecheck menyeluruh dijadwalkan setelah aset kelima. |
| CaptionOffsetStack | [src/compositions/CaptionOffsetStack.tsx](src/compositions/CaptionOffsetStack.tsx) | Belum dikerjakan | Belum dijalankan. | — |
| CaptionFoldedEdge | [src/compositions/CaptionFoldedEdge.tsx](src/compositions/CaptionFoldedEdge.tsx) | Belum dikerjakan | Belum dijalankan. | — |
| CaptionCornerLock | [src/compositions/CaptionCornerLock.tsx](src/compositions/CaptionCornerLock.tsx) | Belum dikerjakan | Belum dijalankan. | — |
