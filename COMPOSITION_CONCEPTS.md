# Dokumentasi Konsep Composition

Dokumen ini merangkum semua composition yang terdaftar pada `src/compositions/registry.tsx`. Seluruh aset dibangun untuk kanvas landscape 3840 × 2160 dengan background hitam, menggunakan React/Remotion dan SVG vektor deterministik. Composition dibagi menjadi dua keluarga: badge/promosi mekanis berdurasi 300 frame (10 detik pada 30 fps) dan graphic accent loop berdurasi 180 frame (6 detik).

## Prinsip visual bersama

- **Vektor, bukan bitmap:** bentuk utama dibuat dari SVG—path, circle, rect, polyline, clipPath, dan group transform.
- **Gerak deterministik:** keadaan visual diturunkan dari `useCurrentFrame()`. Tidak ada random, waktu sistem, atau CSS animation.
- **Bahasa warna badge:** charcoal/hitam sebagai bidang industri; krem sebagai outline atau tipe utama; oranye/coral, kuning, magenta, ungu, dan biru sebagai aksen sesuai konsep.
- **Ritme animasi badge:** elemen mekanis masuk, mencapai pose utama yang statis, lalu mundur/keluar. Pose statis menjadi acuan utama saat melakukan revisi visual.
- **Ritme accent loop:** semua bentuk sudah lengkap di frame pertama dan bergerak terus dengan fungsi periodik. Frame virtual 180 harus menyambung dengan frame 0.

---

## Badge dan ilustrasi promosi

### `FanPetalBloom`

Ilustrasi bunga mekanis radial dengan kelopak kipas berwarna coral dan krem. Komposisi berpusat pada hub/poros tengah berwarna hangat, sementara kelopak disusun bergantian dalam beberapa arah untuk menghasilkan siluet bunga simetris. Konsep geraknya adalah pembukaan, penahanan pose, lalu penutupan kembali: kelopak bergerak dari pivot di pusat dan setiap elemen mempertahankan hubungan mekanisnya dengan poros.

### `ShoppingBagConveyorA`

Adegan conveyor retail: sebuah belt horizontal krem dengan roller, membawa antrean lima tas belanja. Tas coral besar di tengah menjadi fokus; tas lain bergantian krem dan charcoal untuk menjaga urutan visual. Gerak utamanya berupa perjalanan antrean dari kiri ke kanan, berhenti dengan tas pusat tepat di tengah, lalu berjalan lagi. Saat berhenti, tas coral mengembang sedikit, pegangan terangkat, dan isi krem bergerak naik dari mulut tas dengan mask agar tetap berada di belakang panel depan.

### `CartRushA`

Badge keranjang belanja berkecepatan tinggi. Keranjang utama berada di kanan bawah dengan outline krem, gagang coral, roda krem, dan paket-paket di dalam basket. Dua siluet keranjang lebih gelap di belakangnya berfungsi sebagai jejak grafis, bukan objek yang benar-benar bertabrakan. Keranjang masuk dari kiri, mengerem dengan respons kecil pada basket dan paket, lalu jejak mengejar dan memudar. Pada bagian akhir, keranjang bergerak keluar ke kanan bersama jejaknya.

### `CartRushB`

Versi keranjang belanja yang memusatkan aksi pada paket coral yang jatuh ke dalam basket. Keranjang outline coral membawa tiga paket krem; roda memiliki pusat gelap. Paket merah muncul di atas, mengikuti lintasan parabola pendek, masuk melalui area mulut basket, memantul sekali, lalu menjadi bagian dari muatan ketika keranjang pergi. Layer dibuat agar paket yang telah melewati bibir keranjang berada di belakang kisi depan tanpa kedipan perpindahan z-index.

### `StackingPurchasesB`

Komposisi tumpukan paket perspektif sederhana di sisi kanan. Paket fondasi, sleeve/slot penerima, paket coral, dan paket krem atas membangun struktur bertingkat. Elemen utama adalah paket krem memanjang yang masuk dari kiri ke bukaan sleeve. Paket tersebut bukan diskalakan untuk tampak masuk; ia ditranslasikan pada sumbu kedalaman slot dan dioklusi oleh bibir depan sleeve. Setelah terkunci, paket dapat ditarik kembali hingga pose setengah masuk.

### `ReceiptUnrollA`

Printer struk krem di atas tengah dengan aksen merah dan lubang keluaran charcoal. Satu lembar kertas krem keluar ke bawah dari slot; garis-garis charcoal adalah blok dekoratif, bukan teks. Kertas bergerak dengan translasi dan clipping, sehingga gerigi serta blok dekoratif tetap memiliki ukuran fisik yang sama selama panjang struk berubah. Ujung bawah bergerigi dan sudut kanan bawah memiliki curl/underside charcoal yang dikontrol sebagai bentuk terpisah.

### `ReceiptUnrollB`

Variasi struk berbentuk pita S dari dispenser merah di kanan bawah. Lembar krem memiliki lebar tetap dan mengikuti centerline lengkung; sisi belakang charcoal muncul pada bagian lipatan. Gerak memperlihatkan kertas tumbuh dari slot, membentuk lengkungan S secara progresif, melakukan ayunan kecil pada ujung, lalu ditarik kembali sambil melurus. Empat garis dekoratif tertempel pada koordinat material kertas agar ikut bergerak dengan permukaan.

### `FlashSaleAlarm`

Badge alarm clock dan panel petir magenta/kuning bertuliskan `FLASH SALE`. Jam berada di kiri dengan casing kuning-oranye, wajah krem, tanda jam ungu, jarum magenta-oranye, lonceng ungu, tombol atas, serta kaki. Panel keluar dari belakang jam menggunakan translasi dan masking; teks terbuka setelah panel cukup lebar. Lonceng bergoyang berlawanan fase dan jarum berputar singkat selama fase masuk, kemudian seluruh badge menahan pose secara diam sebelum panel dan jam kembali keluar.

### `LastChanceCalendar`

Badge kalender dengan panel bertingkat `LAST` dan `CHANCE`. Kalender oranye-krem berada di sisi kiri dengan tiga ring ungu tebal, halaman depan kosong, lembar belakang offset, dan satu lipatan kertas yang jelas. Panel kuning `LAST` muncul dari belakang kalender ke kanan; panel magenta `CHANCE` berada lebih rendah dan lebih panjang sehingga keduanya tidak saling menutup secara tidak sengaja. Petir dan tanda tambah adalah aksen kecil. Animasi mencakup masuk kalender, dua halaman flip sederhana dari garis pengikat, pembukaan panel, pose diam, lalu penutupan dan keluar.

### `LimitedStockStack`

Badge komik retail yang menampilkan tiga paket perspektif di kiri dan panel magenta bertuliskan `LIMITED STOCK` di kanan. Kotak depan kuning adalah objek utama, sementara kotak oranye dan magenta berada di belakangnya sebagai stok tambahan. Pita ungu mengikuti bidang masing-masing paket. Panel magenta memiliki lapisan kuning belakang, outline ungu gelap, keyline krem, teks italic tebal, serta aksen petir/tanda tambah. Setelah pose tampil, dua kotak belakang bergerak turun/masuk ke balik lapisan depan sehingga menyisakan satu stok utama.

### `BlackFridayImpact`

Badge komik berdampak tinggi untuk teks `BLACK FRIDAY`. Panel utama ungu besar sedikit miring, dikelilingi lapisan kuning dan magenta. Tipografi terdiri dari `BLACK` krem dan `FRIDAY` kuning, masing-masing dengan bayangan ungu sangat gelap yang pendek. Petir oranye besar di kiri atas dan burst krem di kanan bawah menjadi penanda impact. Animasi memperkenalkan lapisan belakang, panel, dua baris tipe, petir, dan burst secara bertahap; pose utama sengaja diam untuk menjaga keterbacaan.

### `ClosingHourglass`

Badge jam pasir dengan panel `ENDS SOON`. Jam pasir di kiri memakai tutup ungu, kaca ungu gelap, outline krem, dan pasir kuning-oranye. Selama pose utama panel dan tipografi tetap diam, sementara pasir atas berkurang, butiran melewati leher, dan gundukan bawah bertambah melalui bentuk/mask yang terkendali. Sesudah pesan ditutup, jam pasir berputar 180 derajat pada pusat geometrinya agar pasir terkumpul berpindah ke bagian atas sebelum keluar layar.

### `DidYouKnowBadge`

Badge edukasi dengan bohlam kuning besar di kiri dan panel biru/coral di kanan bertuliskan `DID YOU` dan `KNOW?`. Bohlam memiliki filamen krem, dudukan dua bidang biru dengan outline ungu, serta tiga garis ide di atasnya. Panel coral adalah bidang penuh di belakang panel biru, bukan hanya bingkai. Badge bergerak masuk dari bawah sebagai satu susunan; teks terbuka lewat mask, filamen tergambar memakai stroke-dashoffset, dan garis ide memanjang bergantian. Seluruh desain kemudian menahan pose bersih tanpa gerak ambient.

### `QuickTipBadge`

Badge edukasi cepat dengan pensil coral besar yang mengarah ke kanan atas dan panel kuning bertuliskan `QUICK TIP`. Pensil dibangun dari bidang-bidang memanjang, pemisah ungu, kayu krem, grafit ungu, band krem, dan penghapus coral. Panel adalah satu path utuh dengan sudut kanan atas terpotong. Setelah masuk, teks muncul berurutan dan pensil melakukan satu ayunan pendek pada pivot di band dekat penghapus. Dua garis aksen krem dekat ujung pensil menegaskan arah tanpa menambah coretan lain.

### `FactCheckBadge`

Badge validasi fakta dengan kaca pembesar besar di kiri dan panel krem/biru bertuliskan `FACT CHECK` di kanan. Kaca memiliki ring biru tebal, outline ungu, keyline krem, lensa hitam, centang krem, serta gagang coral mengarah kiri bawah. Panel depan krem dan panel belakang biru selalu solid. Aksinya adalah masuknya panel dari kanan, kaca dari kiri bawah, satu gerak pemeriksaan pendek, lalu centang digambar mengikuti jalurnya. Pada fase keluar, centang ditarik balik sebelum seluruh badge meninggalkan canvas.

### `MythBustedBadge`

Badge penyangkalan mitos dengan lingkaran ungu besar dan simbol X coral di kiri. Di kanan terdapat panel biru `MYTH` dan panel kuning `BUSTED`, dengan panel bawah lebih panjang. Dua batang diagonal X digambar berurutan menggunakan stroke round-cap sehingga persilangan tampak sebagai satu simbol menyatu. Panel tetap berupa bidang penuh dan bergeser sebagai susunan bertingkat yang rapat, bukan dua elemen terpisah terlalu jauh.

### `KeyTakeawayBadge`

Badge pelajaran utama: kunci kuning besar berada di kiri atas di atas panel coral bertuliskan `KEY TAKEAWAY`. Kepala kunci bundar memiliki lubang lingkaran yang dirancang sebagai bagian dari geometri; batang memanjang ke kanan atas dan memiliki tepat dua gigi. Outline ungu dan keyline krem menjaga bahasa visual yang sama dengan badge edukasi lainnya. Kunci masuk sebagai satu objek kaku, melakukan gerak putar penekanan dari pusat kepala, lalu berhenti tanpa menimpa teks. Dua garis aksen kuning muncul dekat kepala kunci.

---

## Badge dan signage industri Black Friday

### `LockedBlackFridaySign`

Papan industri dua pelat bertuliskan `BLACK FRIDAY`. Pelat charcoal kiri dan kanan bertemu pada sambungan vertikal pusat, dikelilingi outline krem, baut, dan aksen oranye samping. Teks dirancang sebagai satu layout utuh lalu dibagi secara visual oleh area klip pelat, sehingga saat kedua pelat bertemu tidak ada huruf yang melompat atau renggang. Bracket oranye turun ke dudukan, batang pengunci berjalan horizontal ke sisi kanan, lalu penahan kecil turun sebagai tanda mekanisme terkunci. Setelah fase statis, semua gerak dibalik secara mekanis.

### `BlackFridayRailSlider`

Signage carriage mesin: dua rel horizontal dengan end stop oranye dan satu panel charcoal bersudut kanan bawah diagonal. Panel membawa teks `BLACK FRIDAY` serta pegangan oranye vertikal di sisi kanan. Rel digambar dari kiri ke kanan melalui panjang stroke, lalu panel meluncur dari kiri pada sumbu X saja dan berhenti dengan koreksi translasi singkat. Saat keluar panel kembali meluncur ke kiri, end stop keluar, dan rel memendek dari kanan ke kiri.

### `LimitedStockRack`

Signage rak stok minimal: baseline oranye membentuk landasan, tiga blok persegi panjang bertumpuk di kiri, panel `LIMITED STOCK` di kanan, dan stopper oranye pada ujung baseline. Blok bawah adalah yang terlebar, blok tengah lebih sempit dan terpusat, blok atas paling kecil dengan fill oranye. Animasi membangun struktur dari bawah ke atas melalui mask baseline, lalu panel naik sebagai satu bidang bersama teks. Saat keluar, setiap blok ditarik kembali ke balik lapisan di depannya dan baseline menyusut terakhir.

### `LastChanceDeadlineDial`

Kombinasi dial deadline dan panel `LAST CHANCE`. Dial besar berada di kiri dengan bidang charcoal, outline krem, empat tanda utama, arc oranye seperempat, jarum oranye, dan penutup poros. Panel kanan menampung dua baris teks serta garis oranye bawah. Keduanya masuk dari sisi berlawanan dan dihubungkan bracket yang berada di belakang housing. Jarum awalnya mengarah pukul 12, bertambah panjang, lalu berputar ke arah kanan atas; arc terbentuk dari pukul 12 ke pukul 3. Seluruh sistem diam pada fase tampil lalu melakukan urutan balik saat keluar.

### `ShutterRevealFlashSale`

Frame industri horizontal dengan pesan `FLASH SALE` pada bidang oranye. Dua daun shutter charcoal bertemu di tengah dalam keadaan tertutup sehingga tidak ada kebocoran oranye. Masing-masing memiliki dua slot horizontal. Setelah bracket pengunci tengah bergeser, kedua daun bergerak simetris ke housing samping menggunakan clipping; bidang oranye dan tipografi sudah berada di belakang sejak awal dan baru terlihat saat bukaan terbentuk. Rel depan, baut sudut, bracket, dan handle samping membangun rasa mekanis tanpa menambahkan ikon lain.

---

## Graphic accent loop

### `TravelingDotGrid`

Accent grid 7 × 5 berisi 35 lingkaran putih hangat pada interval pusat 170 px. Tidak ada titik yang berpindah; setiap radius mengikuti fungsi `37 + 13 × cos(phase - offset)`, dengan offset diagonal berdasarkan kolom dan baris. Hasilnya adalah gelombang pembesaran yang mengalir diagonal melalui grid, dengan radius selalu berada antara 24 dan 50 px. Durasi tepat satu siklus adalah 180 frame, sehingga frame virtual 180 kembali ke frame 0.

### `StaggeredBarWave`

Accent lima batang vertikal biru muda dengan ujung membulat penuh. Batang berukuran tetap 100 × 480 px; masing-masing berada pada pusat X yang telah ditentukan dan hanya ditranslasikan secara vertikal. Posisi pusat mengikuti `1080 + 150 × sin(phase - index × 0.7)`, menciptakan gerak berantai dari kiri ke kanan tanpa mengubah tinggi atau ketebalan. Batas top/bottom fisik tetap aman pada y=690 hingga y=1470.

### `CounterRotatingArcs`

Accent tiga busur konsentris yang terdiri dari path SVG arc asli: busur luar krem, tengah terracotta, dan dalam krem. Ketiganya memiliki radius, panjang sudut, ketebalan 44 px, serta round cap yang tetap. Rotasi luar bergerak satu putaran searah jarum jam, tengah satu putaran berlawanan, dan dalam dua putaran searah jarum jam selama 180 frame. Tidak ada titik pusat, lingkaran penuh, atau indikator progres sehingga hasil tetap abstrak.

### `OffsetOutlineSquares`

Accent empat persegi outline krem berukuran identik 460 × 460 px. Posisi dasar membentuk tumpukan diagonal, lalu setiap persegi mengelilingi pusat lokalnya melalui lintasan elips kecil: X memakai cosinus dan Y memakai sinus, dengan offset fase seperempat putaran per indeks. Keempat rect memiliki fill `none`, stroke 12 px, dan join miter; karenanya garis yang bersilangan tetap terlihat serta urutan layer tidak perlu berubah.

### `AlternatingChevronDrift`

Accent tiga chevron kuning lembut yang semuanya menghadap kanan. Satu polyline lokal `(-90,-180) → (90,0) → (-90,180)` dipakai ulang pada tiga pusat horizontal. Stroke 54 px menggunakan square cap dan miter join agar bentuknya tegas. Setiap chevron menerima translasi horizontal `65 × sin(phase - index × 0.85)`: tidak ada rotasi, opacity, atau perpindahan sisi canvas, hanya dorongan maju–tarik kembali yang menghasilkan ritme berantai.

---

## Composition dasar

### `StarterComposition`

Composition awal proyek yang berfungsi sebagai contoh/placeholder struktural Remotion. Ia tetap terdaftar agar proyek memiliki baseline yang mudah diuji, tetapi bukan bagian dari set badge atau accent final. Gunakan composition ini untuk memeriksa setup dasar proyek, bukan sebagai acuan gaya visual dari aset-aset di atas.

## Catatan penggunaan

1. Render composition berdasarkan ID yang sama dengan judul section/registrasinya, misalnya `npx remotion still TravelingDotGrid out/grid.png --frame=0`.
2. Untuk badge 300 frame, frame pose tampil biasanya berada pada rentang pertengahan timeline; gunakan frame tersebut sebagai titik utama review visual.
3. Untuk accent loop 180 frame, render frame 0 dan beberapa fase di tengah; jangan menambahkan frame ke-180 pada output karena frame itu adalah frame virtual yang identik dengan frame 0.
4. Jika menambah asset baru, buat folder composition, daftar `index.tsx`, tambahkan registrasi ke `registry.tsx`, lalu tambah section baru pada dokumen ini.
