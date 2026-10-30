# Konsep Composition Remotion

Dokumen ini menjelaskan konsep visual, struktur, dan karakter gerak seluruh composition yang saat ini terdaftar di proyek. Sumber daftar resminya adalah `src/compositions/registry.tsx`.

## Ringkasan sistem

Semua composition menggunakan format produksi yang sama:

- Resolusi: **3840 × 2160 px (4K UHD)**.
- Frame rate: **30 fps**.
- Durasi: **360 frame / 12 detik**.
- Koordinat desain mengikuti canvas SVG `0 0 3840 2160`.
- Background memakai hitam solid agar bentuk utama memiliki kontras tinggi dan mudah dikomposit ke alur produksi lain.
- Gerak dihitung dari frame Remotion, sehingga hasil preview dan render deterministik.
- Bentuk dibuat secara programatis dengan SVG atau elemen React, bukan menggunakan gambar referensi sebagai bitmap.

Saat ini terdapat **20 composition**, yang terbagi menjadi:

| Keluarga | Jumlah | Fungsi utama |
| --- | ---: | --- |
| IT Background | 5 | Latar visual teknologi yang bergerak secara siklik |
| Broadcast News | 5 | Sistem lower third bertema siaran berita dengan label kategori tetap |
| Lower Third | 10 | Lower third geometris tanpa teks dan tanpa placeholder |

## Prinsip animasi umum

Composition lower third dan broadcast news pada umumnya memakai tiga fase:

1. **Masuk** — elemen dirakit melalui clipping mask, reveal terarah, atau translasi pendek. Bentuk asli tidak dipipihkan untuk memalsukan reveal.
2. **Tahan** — desain berada pada kondisi final dan diam agar dapat dipakai sebagai bidang informasi.
3. **Keluar** — struktur dibongkar dengan urutan yang berhubungan dengan cara masuknya, lalu kembali ke hitam penuh.

Teknik utamanya adalah `useCurrentFrame`, `useVideoConfig`, `interpolate` dengan extrapolation `clamp`, easing cubic-bezier, SVG `clipPath`, dan transform yang dipisahkan untuk tiap lapisan. Tidak ada CSS animation, waktu nyata, atau random yang berubah antar-render.

Composition IT berbeda: kelimanya dirancang sebagai **background siklik**. Pergerakan berasal dari fase frame dalam satu durasi 360 frame, sehingga menampilkan aktivitas sistem yang kontinu alih-alih urutan masuk–tahan–keluar.

---

# A. IT Background Compositions

## 1. `ITNetworkPacketFlow`

### Konsep

Visualisasi abstrak aliran paket di dalam jaringan terdistribusi. Beberapa kolom node dihubungkan oleh rute ortogonal, sementara paket kecil bergerak melintasi jalur tersebut. Composition ini memberi kesan jaringan yang aktif tanpa mengklaim sebagai representasi data monitoring nyata.

### Bahasa visual

- Background hitam menempatkan fokus pada topologi.
- Jalur jaringan memakai slate gelap `#26343E`.
- Node berbentuk modul persegi gelap dengan outline slate `#536773`.
- Isi node aktif menggunakan teal `#43867F`.
- Paket memakai kombinasi teal kebiruan `#648F99` dan warna terang `#B7CCC9`.
- Dua garis vertikal tambahan memperkuat kesan backbone jaringan.

### Gerak

Paket bergerak sepanjang polyline yang telah ditetapkan. Posisi paket dihitung dari fase frame, sehingga setiap paket berpindah dengan ritme stabil dan dapat mengulang. Node berdenyut melalui perubahan intensitas yang terikat pada frame, bukan animasi CSS atau random runtime.

### Kegunaan

Cocok sebagai latar dashboard jaringan, pembuka topik infrastruktur, transisi segmen teknologi, atau visual pendamping pembahasan data transit dan routing.

## 2. `ITLayeredDataBus`

### Konsep

Menggambarkan sistem data bus berlapis: beberapa jalur horizontal membawa unit data melewati modul penghubung dan buffer. Struktur paralel membuat composition terasa seperti arsitektur perangkat keras, middleware, atau pipeline pemrosesan.

### Bahasa visual

- Delapan jalur utama memakai slate `#263741`.
- Paket terang memakai `#AFC2C7`, sedangkan variasi teal memakai `#5C948E`.
- Modul penghubung berupa kotak gelap `#03080B` dengan outline `#4C6471`.
- Segmen status di dalam modul memakai `#7C929D` ketika aktif dan `#17252D` ketika pasif.
- Semua bentuk tetap datar dan teknis, tanpa cahaya neon atau efek 3D.

### Gerak

Paket berjalan pada lane yang berbeda dengan offset fase, sehingga aktivitas terlihat tersebar dan tidak bergerak serempak. Indikator di dalam modul berubah berdasarkan kemajuan fase global, memberi kesan buffer menerima dan meneruskan data.

### Kegunaan

Tepat untuk tema integrasi sistem, jalur data, komunikasi antarlayanan, arsitektur komputer, atau visual abstrak pipeline backend.

## 3. `ITServerActivityGrid`

### Konsep

Sebuah dinding monitoring yang terdiri dari grid kartu server. Setiap kartu memperlihatkan identitas abstrak, bar beban, dan histogram aktivitas. Informasi di dalamnya sengaja bersifat konseptual, bukan telemetri sungguhan.

### Bahasa visual

- Grid berisi modul gelap `#060A0D` dengan outline `#34444F`.
- Detail header menggunakan slate `#26323B`.
- Bar aktif umumnya memakai teal lembut `#7DA79E`.
- Beberapa kartu memakai amber `#B39B67` sebagai kondisi perhatian atau warning.
- Bar pasif menggunakan `#1A2830`; histogram memakai biru-slate `#7294A5`.

### Gerak

Nilai beban dan tinggi histogram dibentuk dari fungsi periodik berbasis frame. Setiap kartu mempunyai perbedaan fase, membuat grid terasa hidup namun tetap terkendali. Amber muncul sebagai aksen status, bukan alarm berkedip agresif.

### Kegunaan

Cocok untuk latar pusat operasi, observability, server farm, cloud infrastructure, system health, atau konteks keamanan siber.

## 4. `ITTerminalProcessStream`

### Konsep

Menyimulasikan aliran log terminal yang terus berjalan. Baris berisi timestamp, level, nama layanan, dan pesan singkat, sehingga tampil seperti keluaran proses backend atau konsol operasional.

### Bahasa visual

- Teks menggunakan gaya monospace di atas background hitam.
- Timestamp memakai `#52696B`.
- Level normal memakai `#B0C2BB`, sedangkan `WARN` memakai amber `#B19B6C`.
- Nama service memakai `#60757D` dan pesan memakai `#8EAAA0`.
- Mask hitam di bagian atas dan bawah menjaga area masuk-keluar baris tetap bersih.

### Gerak

Kelompok baris bergeser secara vertikal dalam siklus. Isi log sudah didefinisikan di source dan urutannya deterministik. Efeknya menyerupai stream terminal tanpa bergantung pada data eksternal atau proses jaringan.

### Kegunaan

Ideal untuk tema deployment, proses build, log aplikasi, debugging, DevOps, command line, dan aktivitas layanan terdistribusi.

## 5. `ITDistributedSystemMap`

### Konsep

Peta topologi sistem terdistribusi dengan lima hub utama, endpoint kecil, dan rute ortogonal di antaranya. Paket bergerak antarhub untuk menggambarkan pertukaran data dalam sistem yang tersebar.

### Bahasa visual

- Rute utama memakai `#283944`; rute alternatif memakai `#304B50`.
- Paket memakai teal `#548F8C` atau warna terang `#AAC5BF`.
- Hub memakai bidang sangat gelap dengan outline `#6C8793` dan detail `#344B58`.
- Node yang menerima data dapat terisi teal.
- Amber `#AB9565` dipakai sesekali sebagai status prioritas tinggi.

### Gerak

Paket bergerak di antara hub sesuai jalur yang sudah ditentukan. Node merespons kedatangan paket dengan perubahan isi atau status. Semua fase dihitung dari frame, sehingga pola tetap konsisten pada setiap render.

### Kegunaan

Sesuai untuk pembahasan microservices, distributed computing, cloud regions, arsitektur jaringan, message passing, atau hubungan antar-sistem.

---

# B. Broadcast News Compositions

Kelompok ini menggunakan label kategori tetap sebagai bagian dari identitas paket berita. Bidang headline dan subheadline tetap berfungsi sebagai area visual utama. Paletnya selalu datar, kontras, dan mudah dibaca pada latar hitam.

Semua composition dalam kelompok ini menggunakan easing masuk `cubic-bezier(0.22, 1, 0.36, 1)` dan easing keluar `cubic-bezier(0.64, 0, 0.78, 0)`. Setiap bagian mempunyai clip path sendiri, sehingga urutan perakitan dapat dikontrol tanpa menggeser seluruh lower third sebagai satu objek.

## 6. `BNNavyAngleReport`

### Konsep

Paket **special report** yang terasa formal dan otoritatif. Panel panjang dibangun dari lapisan navy dan ivory, lalu diberi aksen emas dan geometri bersudut untuk menandai konten prioritas tinggi.

### Struktur visual

- Navy utama: `#102B50`.
- Ivory: `#F2EFE6`.
- Aksen emas: `#C5A052`.
- Komponen terdiri dari lower band, headline, blok kanan, separator, anchor emas, tab emas, dan kategori.
- Label kategori yang tertanam adalah **SPECIAL REPORT**.

### Gerak dan karakter

Lapisan masuk secara bertahap dari arah yang sesuai dengan bentuknya. Bidang panjang membuka secara horizontal, sedangkan anchor dan separator memperjelas penguncian struktur. Saat keluar, elemen ditarik kembali dengan urutan terbalik agar tampil seperti paket grafis yang dibongkar.

## 7. `BNRedSegmentNews`

### Konsep

Paket berita mendesak dengan segmentasi merah yang kuat. Ivory menjadi area headline, sementara lapisan merah dan charcoal memberi penekanan serta ritme horizontal yang cepat.

### Struktur visual

- Charcoal: `#252A30`.
- Merah gelap: `#810B15`.
- Merah utama: `#B80F1C`.
- Ivory: `#F2EFE6`.
- Komponen terdiri dari ticker, sub-back, sub panel, headline, end-cap, slash, dan kategori.
- Label kategori adalah **BREAKING NEWS**.

### Gerak dan karakter

End-cap dan bentuk diagonal berfungsi sebagai tanda baca visual. Panel muncul dalam beberapa tahap pendek, membangun urgensi tanpa bounce atau efek berkedip. Geraknya cepat, tetapi tetap berbasis reveal geometris yang bersih.

## 8. `BNCobaltDoubleDeck`

### Konsep

Sistem berita bertingkat dengan dua deck visual. Cobalt dipakai sebagai warna dominan, ivory sebagai bidang kontras, dan charcoal sebagai fondasi. Bentuk ini terasa modern, teknis, dan cocok untuk pembaruan singkat.

### Struktur visual

- Charcoal: `#252A30`.
- Ivory: `#F2EFE6`.
- Cobalt: `#1455CD`.
- Komponen terdiri dari ticker, sub panel, headline, dua slash di kanan, dan kategori.
- Label kategori adalah **NEWS UPDATE**.

### Gerak dan karakter

Deck atas dan bawah membuka sebagai lapisan terpisah. Slash kanan muncul setelah struktur utama mulai terbentuk, memberi kesan arah maju. Layer tetap mempertahankan ukurannya dan hanya terlihat melalui clipping mask.

## 9. `BNBurgundyEditorialNews`

### Konsep

Lower third editorial dengan nuansa internasional. Burgundy memberi kesan serius dan premium, sementara ivory dan charcoal mempertahankan hierarki informasi yang jelas.

### Struktur visual

- Burgundy: `#821A3D`.
- Charcoal: `#252A30`.
- Ivory: `#F2EFE6`.
- Komponen terdiri dari rail, sub panel, headline, anchor, anchor-notch, dan kategori.
- Label kategori adalah **WORLD NEWS**.

### Gerak dan karakter

Rail dan anchor membangun kerangka terlebih dahulu, lalu bidang informasi membuka di atasnya. Notch kecil mempertegas hubungan antarbidang. Hasilnya lebih tenang daripada paket breaking news, tetapi tetap memiliki presisi broadcast.

## 10. `BNTealLiveDesk`

### Konsep

Paket laporan langsung yang bersih dan kontemporer. Teal menjadi identitas siaran langsung, sedangkan ivory dan charcoal menjaga keterbacaan serta keseimbangan visual.

### Struktur visual

- Charcoal: `#253036`.
- Ivory: `#F2EFE6`.
- Teal: `#269DA3`.
- Komponen terdiri dari lower band, headline, left clamp, right clamp, baseline, divider, dan kategori.
- Label kategori adalah **LIVE REPORT**.

### Gerak dan karakter

Clamp kiri dan kanan membuat panel terasa dipasang pada struktur. Baseline dan divider memperpanjang arah horizontal, lalu kategori muncul sebagai penanda terakhir. Geraknya tegas tetapi tidak agresif, sesuai karakter laporan langsung.

---

# C. Lower Third Compositions

Seluruh composition dalam kelompok ini sengaja **tidak memiliki teks, angka, logo, ikon, atau placeholder**. Bidang utama dan sekunder dibiarkan kosong. Konsepnya berfokus pada bentuk, warna, layer, dan hubungan gerak antarelemen.

## 11. `LT-TealSideRail`

### Konsep

Lower third minimal dengan rail teal berbentuk struktur seperti huruf L. Rail menjadi jangkar visual untuk panel utama ivory dan panel sekunder slate. Bentuk L bersifat konstruktif, bukan karakter tipografi.

### Struktur final

- Panel utama ivory `#F1EDE4`: `x=350`, `y=1570`, `2080 × 300`.
- Rail vertikal teal `#178E91`: `x=260`, `y=1570`, `90 × 320`.
- Garis horizontal teal: `x=260`, `y=1870`, `2380 × 20`.
- Panel sekunder slate `#354E60`: `x=350`, `y=1890`, `1500 × 130`.
- Urutan layer: panel sekunder, panel utama, lalu rail dan garis teal.

### Gerak

Rail terbentuk dari bawah ke atas. Garis horizontal kemudian memanjang dari kaki rail menuju kanan. Panel ivory membuka ke kanan dari sisi rail, disusul panel sekunder yang memiliki translasi pendek dari kiri di dalam mask. Pada akhir fase masuk, ujung garis menyelesaikan tambahan jarak terakhir sehingga struktur terasa terkunci. Keluar berlangsung dalam urutan panel sekunder, panel utama, garis, lalu rail.

## 12. `LT-TerracottaOffset`

### Konsep

Komposisi lembaran kaku yang bertumpuk dan bergeser. Terracotta terlihat sebagai backplate di sisi kanan dan bawah, sehingga menghasilkan kedalaman grafis tanpa shadow atau blur.

### Struktur final

- Panel utama ivory `#F1EDE4`: `x=280`, `y=1540`, `2200 × 310`.
- Backplate utama terracotta `#BB684E`: `x=340`, `y=1590`, `2200 × 310`.
- Panel sekunder abu terang `#CDD0D4`: `x=340`, `y=1870`, `1400 × 130`.
- Backplate sekunder terracotta: `x=400`, `y=1910`, `1400 × 130`.
- Aksen pendek terracotta: `x=280`, `y=1470`, `290 × 35`.

### Gerak

Aksen membuka lebih dahulu, lalu backplate utama, panel ivory, dan pasangan panel sekunder. Selama reveal, backplate bergerak dari posisi hampir sejajar menuju offset final: sekitar `+60,+50` untuk lapisan utama dan `+60,+40` untuk lapisan sekunder. Saat keluar, offset terlebih dahulu dirapatkan sebelum mask menutup bidang. Cara ini membuat lapisan terasa seperti lembaran fisik yang disusun tanpa simulasi kertas atau perspektif.

## 13. `LT-CobaltCornerCut`

### Konsep

Lower third tajam dengan sudut kanan terpotong diagonal. Sayap cobalt di belakang panel utama membangun arah maju, sementara panel charcoal di bawah menjaga keseimbangan visual.

### Struktur final

- Panel utama abu terang `#E4EAF0`: polygon `(280,1580) (2260,1580) (2540,1880) (280,1880)`.
- Backplate cobalt `#245BEA`: polygon `(450,1690) (2510,1690) (2745,1960) (640,1960)`.
- Panel sekunder charcoal `#29333F`: polygon `(280,1880) (1780,1880) (1910,2010) (390,2010)`.
- Aksen vertikal cobalt: `x=300`, `y=1600`, `35 × 260`.

### Gerak

Backplate dan panel utama membuka dari kiri ke kanan dengan batas clip polygon diagonal yang sejajar dengan ujung panel. Panel sekunder naik dari posisi tersembunyi di balik panel utama sambil direveal. Sayap cobalt menyelesaikan translasi diagonal pendek `(-70,-35)` menuju posisi final, memberi sensasi struktur mengunci. Saat keluar, panel sekunder kembali naik, panel utama menutup, lalu warna cobalt tertinggal sesaat sebelum hilang.

## 14. `LT-SageSplitPanel`

### Konsep

Komposisi dua panel terpisah dengan karakter lembut dan tenang. Panel utama dan sekunder memiliki sudut membulat, sedangkan dua tab miring di kiri menjadi aksen organik-geometris.

### Struktur final

- Panel utama ivory `#F1EDE4`: `x=500`, `y=1570`, `2100 × 300`, radius `22`.
- Panel sekunder sage `#98A990`: `x=760`, `y=1890`, `1840 × 145`, radius `20`.
- Kedua tepi kanan sejajar di `x=2600`, dengan celah vertikal `20 px`.
- Connector graphite `#34383A`: `x=430`, `y=1630`, `150 × 190`.
- Dua tab sage berada di kiri dan menggunakan bentuk parallelogram yang sedikit dilembutkan.

### Gerak

Tab atas dan bawah muncul bergantian dari bawah sambil bergeser pendek ke kanan. Connector membuka dari area tab, lalu panel utama membuka ke kanan. Panel sekunder bergerak berlawanan arah: membuka dari kanan ke kiri dengan tepi kanan tetap terkunci, sambil menerapkan translasi awal `+70 px` menuju nol di dalam mask. Arah yang berlawanan membuat kedua panel terasa saling melengkapi tanpa kehilangan ketenangan desain.

## 15. `LT-AmberBracket`

### Konsep

Lower third bersudut yang dikelilingi bingkai ivory terbuka. Bingkai tidak membentuk persegi penuh; celah besar di atas dan bawah sengaja dipertahankan agar desain terasa ringan dan seperti sedang dirakit.

### Struktur final

- Panel utama ivory `#F1EDE4`: polygon `(550,1580) (2640,1580) (2560,1870) (470,1870)`.
- Panel sekunder amber `#EAAF26`: polygon `(550,1890) (1950,1890) (1910,2020) (510,2020)`.
- Anchor kiri amber: polygon `(350,1580) (510,1580) (430,1870) (270,1870)`.
- Aksen kanan amber: polygon `(2670,1660) (2695,1660) (2640,1830) (2615,1830)`.
- Bingkai memakai stroke ivory setebal `10 px` dan terdiri dari path kiri serta path kanan yang terpisah.

### Gerak

Anchor kiri terbentuk secara vertikal. Bingkai kiri dan kanan digambar menggunakan `strokeDasharray` serta `strokeDashoffset`, sehingga ujung garis terlihat benar-benar menelusuri jalurnya. Panel utama dan sekunder membuka melalui mask bersudut, lalu aksen kanan muncul sebagai penyelesaian. Pada fase keluar, garis dihapus dalam urutan kebalikan sampai tidak ada stroke tersisa.

## 16. `LT-OliveStepped`

### Konsep

Panel utama memiliki undakan siku di sisi kanan. Bagian atas lebih panjang daripada bagian bawah, menciptakan siluet arsitektural yang khas. Olive di bagian bawah dan aksen kanan atas menegaskan struktur tersebut.

### Struktur final

- Panel ivory `#F1EDE4`: polygon `(380,1430) (3140,1430) (3140,1600) (2750,1600) (2750,1740) (380,1740)`.
- Panel sekunder olive `#687A32`: `x=380`, `y=1740`, `1990 × 170`.
- Blok kiri atas charcoal `#303233`: `x=195`, `y=1430`, `165 × 85`.
- Blok kiri bawah olive: `x=195`, `y=1535`, `165 × 85`.
- Aksen kanan atas olive: `x=2750`, `y=1355`, `390 × 55`.

### Gerak

Dua blok kiri membuka bergantian, lalu panel ivory direveal dari kiri ke kanan. Karena reveal dilakukan dengan mask, undakan tetap mempertahankan bentuknya: bagian bawah berhenti di `x=2750`, sedangkan bagian atas berlanjut sampai `x=3140`. Panel olive turun sebagai bidang kaku dari balik panel ivory dan dibatasi pada area final agar tidak terlihat menembus panel. Aksen kanan atas muncul paling akhir.

## 17. `LT-BurgundyInset`

### Konsep

Struktur burgundy berfungsi seperti rel dan landasan yang menyangga panel ivory. Panel sekunder menyatu secara visual dengan ledge di bagian kanan, sedangkan aksen vertikal terpisah menjaga keseimbangan di sisi kanan.

### Struktur final

- Panel ivory `#F1EDE4`: `x=390`, `y=1375`, `2600 × 375`.
- Rel kiri burgundy `#7F1738`: `x=250`, `y=1360`, `115 × 500`.
- Ledge kiri: mulai `x=250`, `y=1750`, tinggi `110` dan berakhir di area sebelum panel sekunder.
- Panel sekunder burgundy: sekitar `x=1819`, `y=1762`, `1171 × 168`, dengan overlap kecil untuk mencegah seam.
- Aksen vertikal kanan: `x=3040`, `y=1375`, `115 × 375`.
- Terdapat celah hitam yang sengaja dipertahankan antara rel kiri dan panel ivory, serta antara panel ivory dan aksen kanan.

### Gerak

Rel kiri dibentuk secara vertikal, lalu ledge memanjang ke kanan. Panel ivory membuka di atas landasan tersebut. Panel sekunder berkembang ke bawah melalui reveal mask, bukan scale, dan aksen kanan muncul terakhir dari arah bawah. Saat keluar, elemen kanan ditutup lebih dahulu, kemudian panel ivory, ledge, dan akhirnya rel kiri.

## 18. `LT-MidnightCapsule`

### Konsep

Lower third berbentuk kapsul yang halus dan tenang. Navy menjadi cap kiri dan lapisan dasar, sementara ivory menutup bagian panjang di kanan. Struktur dibentuk dari satu siluet kapsul agar batas navy–ivory rapat tanpa celah.

### Struktur final

- Kapsul utama: `x=215`, `y=1440`, `2680 × 330`, radius ujung `165`.
- Lapisan dasar navy `#294968` memenuhi kapsul utama.
- Ivory `#F1EDE4` mulai di `x=385` dan berakhir pada ujung bulat kanan `x=2895`.
- Kapsul sekunder navy: `x=385`, `y=1785`, `1450 × 175`, radius `87.5`.
- Dash ivory terpisah: `x=2955`, `y=1570`, `285 × 70`, radius `35`.

### Gerak

Cap navy membuka terlebih dahulu, disusul bagian panjang kapsul dengan satu mask horizontal. Bentuk kapsul tidak di-scale, sehingga radius ujung kanan selalu utuh. Kapsul sekunder membuka ke kanan dengan translasi awal `-45 px` di dalam mask. Dash kanan muncul terakhir. Saat keluar, dash dan kapsul sekunder menghilang lebih dulu, bagian ivory menutup, dan cap navy tetap terlihat sampai tahap terakhir.

## 19. `LT-CopperSplit`

### Konsep

Sistem panel terpisah dengan end-cap copper sebagai jangkar mekanis. Panel utama dan end-cap tidak bersentuhan; celah hitam yang konsisten membuat keduanya terasa sebagai komponen berbeda dalam satu sistem.

### Struktur final

- Panel utama ivory `#F1EDE4`: `x=225`, `y=1390`, `2430 × 360`.
- End-cap copper `#B96F47`: `x=2680`, `y=1390`, `310 × 360`.
- Celah hitam antara panel dan end-cap: `25 px`.
- Panel sekunder copper: `x=225`, `y=1770`, `2050 × 160`.
- Dua slot dekoratif ivory: `x=2740`, `190 × 35`, masing-masing pada `y=1510` dan `y=1580`.

### Gerak

End-cap terbentuk dari bawah ke atas dan menjadi jangkar tetap. Panel ivory kemudian membuka dari kanan ke kiri, dengan tepi kanan terkunci di `x=2655`; karena itu panel seolah keluar dari area dekat end-cap. Slot muncul setelah end-cap tersedia, lalu panel sekunder membuka ke kanan. Saat keluar, panel utama kembali menutup menuju end-cap, kedua slot menghilang, dan end-cap ditutup paling akhir.

## 20. `LT-SlateSuspended`

### Konsep

Panel utama terlihat tergantung pada dua garis horizontal melalui dua batang penyangga. Geometrinya tetap abstrak: tidak ada tali, rantai, sekrup, atau detail realistis. Panel sekunder hanya menempel pada bagian kanan bawah, sehingga sisi kiri bawah tetap terbuka dan hitam.

### Struktur final

- Panel utama ivory `#F1EDE4`: `x=260`, `y=1400`, `2610 × 375`.
- Panel sekunder slate `#547B93`: `x=1595`, `y=1775`, `1275 × 185`.
- Garis horizontal atas: `x=260`, `y=1260`, `2610 × 22`.
- Garis horizontal bawah: `x=260`, `y=1300`, `2610 × 22`.
- Penyangga kiri: `x=435`, `y=1300`, `28 × 100`.
- Penyangga kanan: `x=2665`, `y=1300`, `28 × 100`.

### Gerak

Garis horizontal digambar dari kiri ke kanan, kemudian dua penyangga terbentuk dari atas ke bawah. Panel utama membuka simetris dari titik tengah `x=1565` menuju kedua sisi. Panel sekunder turun sebagai bidang kaku dari balik panel utama dan hanya terlihat di area bawah melalui mask tetap. Pada fase keluar, panel sekunder naik kembali, panel utama menutup menuju titik tengah, lalu penyangga dan garis dibongkar. Tidak ada ayunan atau pantulan meskipun konsepnya suspended.

---

# Catatan arsitektur source

## Registrasi

Seluruh composition aktif didaftarkan di:

- `src/compositions/registry.tsx`

File registry menghubungkan ID composition dengan komponen React serta menetapkan parameter video 3840 × 2160, 30 fps, dan 360 frame.

## Pengelompokan helper

Proyek juga memiliki dua helper registrasi tematik:

- `src/compositions/ITBackgroundCompositions.tsx`
- `src/compositions/BroadcastNewsCompositions.tsx`

Keduanya mendokumentasikan pengelompokan composition berdasarkan fungsi, sedangkan `registry.tsx` tetap menjadi daftar aktif yang dipakai root aplikasi.

## Pola file

Setiap composition utama berada dalam file TSX tersendiri di `src/compositions`. Pemisahan ini menjaga geometri, palet, timing, serta ID clip path masing-masing composition tetap terisolasi dan mudah dirawat.

## Prinsip render

- Frame 0 dan frame akhir pada lower third diarahkan kembali ke hitam penuh.
- Kondisi hold dirancang stabil tanpa shimmer, pulse, sweep, atau gerak dekoratif tambahan.
- Bentuk kompleks mempertahankan geometri aslinya di dalam mask; mask yang berubah, bukan skala bentuk.
- Layer yang seharusnya menyatu dapat memakai overlap kecil untuk mencegah seam akibat rasterisasi SVG.
- ID `clipPath` dibuat unik pada tingkat composition/elemen agar tidak bertabrakan ketika preview memuat banyak composition.
- Tidak ada ketergantungan pada image bitmap referensi, network request, atau waktu sistem saat render.

## Arah pengembangan

Jika composition baru ditambahkan, pola dokumentasinya sebaiknya mencakup:

1. tujuan dan karakter visual;
2. palet warna;
3. bentuk serta hubungan antarlayer;
4. urutan animasi masuk, hold, dan keluar;
5. teknik implementasi penting seperti mask, stroke drawing, atau transform;
6. ID composition dan status registrasinya.

Dengan pola ini, dokumentasi tetap berguna sebagai panduan desain sekaligus referensi teknis untuk pengembangan dan validasi render berikutnya.
