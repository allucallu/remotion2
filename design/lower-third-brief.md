# Product Design Brief — Five No-Text Lower Thirds

## A. Ringkasan konteks proyek

1. Proyek memakai Remotion `4.0.465`, React 19, TypeScript strict, dan Zod 4.
2. Composition didaftarkan melalui array `assetRegistry` di `src/compositions/registry.tsx`; `Root.tsx` hanya merender registry tersebut.
3. File aset baru mengikuti pola `src/compositions/NamaAsset.tsx` dan ID PascalCase; registry saat ini kosong.
4. Preset landscape HD/4K, portrait, dan square tersedia; ukuran custom juga dapat diberikan lewat props.
5. `resolveAssetMetadata()` sudah mendukung durasi, fps, format, width, dan height dinamis.
6. `assetSettingsSchema` sudah menyediakan kontrol Zod; rancangan ini memakai kanvas desain 1920×1080 dan output 3840×2160 melalui scale 2.

## 1. Strategi produk

1. Kelima produk adalah lower third siap pakai tanpa teks, bukan sekadar ornamen; setiap desain mempunyai alas teks yang utuh.
2. Semua memakai 30 fps dan durasi 10 detik (300 frame): cukup halus untuk corporate/broadcast, mudah dipotong, dan efisien di 4K.
3. Struktur global: kosong 0–3f, masuk 4–51f, tahan 52–257f, keluar 258–287f, kosong 288–299f.
4. Frame 150 (5,0 detik) selalu menampilkan bentuk lengkap, tenang, dan layak menjadi thumbnail katalog.
5. Zona teks minimum melampaui 760×160 px pada kanvas 1920×1080 dan aman untuk satu atau dua baris.
6. Tidak ada neon, magenta/cyan/lime elektrik, glow warna menyala, teks, logo, font, atau aset eksternal.
7. Kedalaman datang dari bidang bertingkat, tonal gradient halus, bayangan kecil, edge highlight, dan pola SVG beropacity rendah.
8. Tiga konsep dikirim di hitam untuk Screen/Add; dua konsep memakai hijau untuk mempertahankan bidang gelap saat chroma key.
9. Semua gerak dirancang frame-driven, deterministic, eased, staggered, dan murah dirender di 4K.
10. Props yang disarankan kelak: `backgroundColor`, `accentVariant`, `position`, `scale`, dan `mirror`, tanpa mengubah identitas desain.

## 2. Tabel pembeda konsep

| Konsep | Tata letak | Bahasa bentuk | Bahasa gerak | Keluarga palet | Segmen/suasana | Latar kirim | FPS | Durasi |
|---|---|---|---|---|---|---|---:|---:|
| LT-BrassLedger | Kiri-bawah, massa asimetris | Bilah arsitektural bertingkat | Rail draw-on mendorong panel + parallax slide | Teal tua, kuningan, gading | Corporate, finance, interview premium | Hitam; alternatif hijau via prop | 30 | 10 dtk / 300f |
| LT-WineFold | Tengah-bawah, kartu lebar | Lipatan kertas bersudut lembut | Unfold dari engsel + settling | Merah anggur, champagne, blush debu | Lifestyle, wedding, editorial | Hijau; alternatif hitam via prop | 30 | 10 dtk / 300f |
| LT-IceRail | Pita lebar sepanjang bawah | Rel modular, garis presisi | Stroke draw-on + wipe bertingkat | Slate, biru es, baja | News, technology, documentary | Hitam; alternatif hijau via prop | 30 | 10 dtk / 300f |
| LT-ClayOrbit | Tag kanan-bawah | Lengkung kapsul dan cincin terpotong | Arc sweep menarik kartu + orbit settle | Terakota, plum, mawar debu | Creator, podcast, culture | Hijau; alternatif hitam via prop | 30 | 10 dtk / 300f |
| LT-SandArchive | Kiri-bawah vertikal | Kartu arsip, notch, garis kontur | Stamp/drop teredam + reveal diagonal | Batu hangat, pasir, biru tinta | Documentary, history, education | Hitam; alternatif hijau via prop | 30 | 10 dtk / 300f |

---

## 3. Konsep 1 — LT-BrassLedger

### Posisi pasar dan keputusan delivery

- **Target pembeli:** editor corporate interview, laporan keuangan, profil eksekutif, webinar, dan dokumenter bisnis.
- **Karakter:** terukur, mapan, presisi, tidak terasa seperti dashboard UI.
- **Latar default:** hitam `#000000`, untuk workflow Screen/Add. Panel utama menggunakan teal menengah dan gading yang tetap terlihat setelah black removal; tidak ada outline hitam yang menjadi penentu bentuk.
- **Alternatif:** green screen melalui satu prop. Semua warna konsep dijauhkan dari hue hijau murni, tetapi teal harus diuji key spill; varian hijau sebaiknya mengganti teal ke biru-slate lewat `accentVariant`.

### Geometri pada kanvas desain 1920×1080

- Area aman umum: x `96–1824`, y `54–1026`.
- Bounding desain: x `118–1128`, y `748–986`.
- Panel utama: x `184`, y `782`, w `900`, h `184`; sudut 12 px dengan notch diagonal 34 px di kanan.
- Zona teks bersih: x `244`, y `796`, w `760`, h `160`; cukup untuk dua baris dan menyisakan 60 px inset kiri.
- Tulang vertikal: x `118`, y `748`, w `42`, h `218`.
- Bilah kuningan bawah: x `160`, y `958`, w `824`, h `8`.
- Jarak tepi kiri 118 px dan bawah 94 px; seluruh elemen penting melewati margin aman 5%.

### Lapisan belakang ke depan

1. **Latar delivery** — hitam/hijau dari prop; tidak ikut bergerak.
2. **Bayangan kontak** — siluet teal gelap offset 0/10 px, blur statis 8 px; memisahkan panel dari footage setelah keying alternatif.
3. **Tulang vertikal** — jangkar visual yang membuat struktur terasa seperti ledger/book spine.
4. **Panel belakang** — pelat teal gelap dengan tonal gradient 4% dari kiri ke kanan.
5. **Panel utama/zona teks** — teal tengah hampir solid, opacity 96%; badan utama untuk copy pembeli.
6. **Bilah kuningan bawah** — garis berat yang mengikat panjang panel dan memberi arah baca.
7. **Edge highlight** — garis gading 2 px hanya di sisi atas dan notch kanan.
8. **Tick ledger** — enam guratan pendek yang menempel pada tulang, bukan serpihan bebas.
9. **Sapuan satin** — strip transparan hangat selebar 110 px yang melintas sekali saat masuk, tanpa glow.

### Palet

| Peran | Hex | Pemakaian |
|---|---|---|
| Dasar gelap | `#173B3D` | Bayangan bentuk dan panel belakang |
| Dasar tengah | `#315B5A` | Badan panel utama |
| Tint terang | `#D8E1D8` | Edge highlight |
| Aksen | `#B58A45` | Bilah kuningan dan tick terpilih |
| Highlight | `#F0E6D2` | Kilau satin tipis |
| Bayangan | `#0B2022` | Contact shadow |
| Permukaan zona teks | `#496E6B` | Zona copy hampir solid |

Teks pembeli yang disarankan: **putih hangat** (`#F7F2E8`), karena kontrasnya stabil terhadap permukaan teal.

### Timeline dan koreografi

| Elemen | Masuk | Tahan/ambient | Keluar | Kurva |
|---|---|---|---|---|
| Tulang vertikal | 0,13–0,67 dtk / f4–20: scaleY 0→1 dari bawah, opacity 0→1 | f52–257 stabil; drift Y ±1 px selama 4 dtk | 8,60–9,03 / f258–271: terpotong diagonal ke bawah | Ease-out expo masuk; ease-in cubic keluar |
| Bilah kuningan | 0,27–0,93 / f8–28: stroke/scaleX 0→1 | shimmer luminance ±3%, periode 3 dtk | 8,70–9,13 / f261–274: menyusut menuju kanan, bukan reverse | Bezier `(0.16,1,0.3,1)`; exit `(0.55,0,1,0.45)` |
| Panel belakang | 0,43–1,23 / f13–37: slide X -150→0, scale 0,97→1 | parallax X ±2 px, periode 5 dtk | 8,77–9,30 / f263–279: turun 28 px sambil clip diagonal | Spring d20/s150/m0,8; exit ease-in quart |
| Panel utama | 0,60–1,53 / f18–46: didorong bilah, clip left→right, overshoot X 3% | benar-benar tenang f60–240; hanya gradient drift 1,5% | 8,67–9,40 / f260–282: notch kanan “memotong” panel menjadi dua bidang lalu keduanya turun 18 px | Spring d18/s135/m0,9; exit bezier `(0.7,0,0.84,0)` |
| Tick ledger | 0,77–1,60 / f23–48, stagger 4f: draw-on 0→1 | opacity bernafas 0,70–0,78, periode 4 dtk | 8,60–9,10 / f258–273, stagger balik 3f: retract ke tulang | Ease-out cubic; exit ease-in cubic |
| Sapuan satin | 1,10–1,73 / f33–52: melintas kiri→kanan | tidak aktif saat hold agar mudah dibekukan | tidak muncul saat keluar | Ease-in-out cubic, opacity puncak 0,14 |
| Latar kosong | 0–0,10 / f0–3 | — | 9,60–10,00 / f288–299 | Tidak ada elemen desain |

Hubungan gerak utama: bilah kuningan menggambar arah, lalu secara visual “mendorong” panel utama. Panel belakang bergerak 65% dari jarak panel utama untuk parallax. Overshoot maksimum panel 3%.

### Tampilan frame 150 / 5,0 detik

Sebuah pelat teal matang yang jelas terbaca sebagai lower third meski tanpa teks, ditambatkan spine vertikal dan bilah kuningan. Zona copy luas tampak tenang; detail ledger memberi karakter saat thumbnail 300 px tanpa berubah menjadi garis kecil yang hilang.

### Uji J, kelemahan, dan revisi

- **Uji thumbnail:** awalnya tick terlalu dominan dan panel tampak seperti widget. Revisi: tick dibatasi enam, rapat ke spine, dan panel diberi notch tunggal yang besar.
- **Uji footage:** teal awal terlalu gelap di footage malam. Revisi: permukaan zona teks dinaikkan ke `#496E6B`, opacity 96%, plus edge highlight gading.
- **Uji generik:** persegi panjang + garis mudah dibuat di PowerPoint. Revisi: konstruksi “ledger spine”, notch kanan, rel pendorong, dan urutan gerak kausal menjadi signature.
- **Uji pembeda:** berisiko mirip LT-IceRail karena sama-sama geometris. Revisi: massa dibuat pendek-asimetris, vertikal, dan arsitektural; IceRail tetap pita horizontal panjang.
- **Tiga kelemahan jujur:** (1) teal berpotensi terganggu green spill, (2) bentuk corporate bisa terasa konservatif, (3) detail tick hilang di 720p. Perbaikan: varian slate untuk green screen, notch lebih ekspresif, tick minimal 6 px pada 1080p.
- **Risiko teknis:** clipping notch dan urutan mask harus bebas seam. **Biaya render:** ringan; transform, clipPath, dan SVG sederhana, hanya satu blur statis 8 px.

### Metadata Adobe Stock

- **Title:** `Elegant Teal and Brass No Text Lower Third 4K`
- **Description:** `Premium corporate lower third with no text, a stable copy space for your own text, elegant teal and brass layers, clean entrance and exit, delivered in 4K.`
- **25 keywords:** lower third, no text, copy space, 4k, corporate, business, interview, finance, elegant, teal, brass, title plate, name banner, motion graphics, video overlay, stock footage, professional, clean, premium, presentation, documentary, broadcast, editor template, black background, h264

---

## 4. Konsep 2 — LT-WineFold

### Posisi pasar dan keputusan delivery

- **Target pembeli:** wedding filmmaker, lifestyle brand, hospitality, beauty editorial, chef profile, dan dokumenter human-interest.
- **Karakter:** hangat, taktil, editorial, seperti lembar kartu premium yang dilipat—tanpa meniru kertas realistis.
- **Latar default:** green screen `#00FF00`; konsep membutuhkan badan wine gelap yang akan rusak bila editor memakai Screen/Add di latar hitam.
- **Konsekuensi:** seluruh tepi memakai warna wine/champagne tanpa hijau, tanpa semi-transparent green-adjacent edge. Bayangan dibuat sempit agar hasil key bersih.

### Geometri pada kanvas desain 1920×1080

- Bounding desain: x `300–1620`, y `770–980`.
- Kartu belakang: x `300`, y `790`, w `1320`, h `180`, radius 18 px.
- Kartu depan: x `340`, y `770`, w `1240`, h `196`, dengan ujung kanan fold 72 px.
- Zona teks: x `430`, y `788`, w `1010`, h `160`.
- Tab kiri: x `300`, y `818`, w `104`, h `112`.
- Baseline bawah berada di y 980; margin bawah 100 px.

### Lapisan belakang ke depan

1. Green-screen delivery background.
2. Bayangan wine pekat 7 px di bawah kartu; hard-soft, blur 6 px maksimum.
3. Kartu belakang champagne redup yang terlihat 20 px di sisi atas/bawah.
4. Fold wing kiri yang menjadi engsel masuk.
5. Kartu wine utama/zona teks dengan gradient tonal vertikal 5%.
6. Lipatan kanan berbentuk trapezoid, sedikit lebih terang untuk memberi arah.
7. Garis jahit editorial 3 px di tepi bawah, berupa dash panjang agar terbaca saat downscale.
8. Highlight mawar debu di lipatan; tidak menyala.
9. Tekstur serat SVG statis opacity 0,035 di dalam mask kartu saja.

### Palet

| Peran | Hex | Pemakaian |
|---|---|---|
| Dasar gelap | `#3A1723` | Bayangan dan fold terdalam |
| Dasar tengah | `#6E2F43` | Panel utama |
| Tint terang | `#E8D6C7` | Kartu belakang |
| Aksen | `#C5A06A` | Garis jahit/champagne |
| Highlight | `#D9A7A8` | Tepi lipatan |
| Bayangan | `#241018` | Contact shadow |
| Permukaan zona teks | `#7B3B4E` | Copy surface |

Teks pembeli yang disarankan: **putih krem** (`#FFF5EA`).

### Timeline dan koreografi

| Elemen | Masuk | Tahan/ambient | Keluar | Kurva |
|---|---|---|---|---|
| Tab/engsel kiri | 0,13–0,73 / f4–22: rotate -14°→0°, scale 0,92→1 | rotasi ±0,35° sangat lambat | 8,63–9,03 / f259–271: menekuk 9° ke belakang | Spring d17/s125/m0,9; exit ease-in cubic |
| Kartu belakang | 0,30–1,07 / f9–32: unfold scaleX 0,08→1 dari engsel | drift X -2→2 px selama 6 dtk | 8,70–9,23 / f261–277: meluncur turun-kiri 34 px, opacity tetap sampai akhir | Bezier `(0.2,0.9,0.2,1)`; exit ease-in quart |
| Kartu utama | 0,47–1,43 / f14–43: clip horizontal + translateX -70→0 + scaleY 0,94→1 | f52–245 stabil; tekstur statis | 8,60–9,43 / f258–283: terlipat dari kanan ke kiri 65%, lalu drop 24 px | Spring d19/s145/m0,85; exit bezier `(0.65,0,0.9,0.25)` |
| Lipatan kanan | 0,67–1,57 / f20–47: rotateY semu via skewX 9°→0°, stagger 6f | highlight bergerak 2 px, periode 5 dtk | 8,60–9,17 / f258–275: flick ke atas 12 px lalu tersapu kanan | Spring d16/s155/m0,75; exit ease-in expo |
| Garis jahit | 0,83–1,67 / f25–50: stroke dash draw-on | stabil, tidak ada marching dash | 8,77–9,30 / f263–279: dash menghilang per segmen, stagger 3f | Ease-out expo; exit ease-in cubic |
| Serat | 1,03–1,73 / f31–52: opacity 0→0,035 | statis agar hold bisa dibekukan | 8,60–8,93 / f258–268: opacity 0 | Ease-out/ease-in sine |
| Latar kosong | 0–0,10 / f0–3 | — | 9,60–10,00 / f288–299 | Hanya hijau |

Hubungan gerak: tab kiri adalah engsel; kartu belakang membuka dulu dan menarik kartu utama, kemudian lipatan kanan menyelesaikan bentuk. Keluar bukan reverse: kartu “menutup”, kemudian jatuh lembut ke bawah.

### Tampilan frame 150 / 5,0 detik

Kartu wine lebar di tengah-bawah dengan lapisan champagne di belakang, tab kiri, dan lipatan kanan yang khas. Siluet terbaca kuat pada thumbnail; pusat panel tenang dan cukup panjang untuk nama maupun jabatan.

### Uji J, kelemahan, dan revisi

- **Uji thumbnail:** tekstur dan jahitan awal terlalu halus. Revisi: jahitan menjadi dash 18 px/12 px dan fold kanan diperbesar menjadi 72 px.
- **Uji footage:** green key menjaga panel wine di scene gelap; opacity panel dibuat 100% agar footage terang tidak mengganggu teks.
- **Uji generik:** rounded card awal terlalu mirip template gratis. Revisi: sistem engsel, kartu belakang offset, fold wing, dan keluarnya sebagai fold-drop.
- **Uji pembeda:** satu-satunya konsep center-bottom, paper-layered, dan sepenuhnya berbasis unfold.
- **Tiga kelemahan jujur:** (1) chroma spill berpotensi pada shadow, (2) lipatan bisa terlihat skeuomorphic murahan, (3) kartu lebar memakan ruang footage. Perbaikan: shadow wine bukan hitam transparan, tonal delta maksimal 8%, tinggi hanya 210 px dan tidak melewati y770.
- **Risiko teknis:** simulasi rotateY dengan transform 2D harus konsisten di Chromium. **Biaya render:** ringan–sedang; beberapa clipPath dan tekstur SVG statis.

### Metadata Adobe Stock

- **Title:** `Warm Wine Editorial No Text Lower Third Green Screen 4K`
- **Description:** `Warm folded editorial lower third with no text, clean copy space for your own text, chroma key green background, refined layered paper motion, delivered in 4K.`
- **25 keywords:** lower third, no text, copy space, 4k, green screen, chroma key, editorial, wedding, lifestyle, wine color, champagne, elegant, warm, folded paper, title card, name banner, motion graphics, video overlay, stock footage, hospitality, beauty, documentary, premium, h264, clean design

---

## 5. Konsep 3 — LT-IceRail

### Posisi pasar dan keputusan delivery

- **Target pembeli:** news package, explainer teknologi, cybersecurity, science documentary, sports analysis, dan broadcast YouTube.
- **Karakter:** presisi, cepat, informatif, tetapi bukan HUD neon.
- **Latar default:** hitam untuk Screen/Add. Rail memakai slate terang dan biru es; bentuk utama tidak mengandalkan area gelap.
- **Alternatif green screen:** aman karena palet biru-slate tidak mendekati key green.

### Geometri pada kanvas desain 1920×1080

- Bounding desain: x `104–1812`, y `790–990`.
- Rail dasar: x `104`, y `946`, w `1708`, h `16`.
- Panel utama: x `194`, y `792`, w `1320`, h `166`, dengan potongan miring 26 px di kiri.
- Zona teks: x `284`, y `795`, w `1120`, h `160`.
- Modul indeks kanan: x `1538`, y `824`, w `274`, h `118`; tanpa teks, berisi tiga bar statis besar.
- Margin bawah 90 px; semua detail minimum 5 px agar bertahan di 720p.

### Lapisan belakang ke depan

1. Latar delivery hitam.
2. Rail bayangan baja gelap, 18 px di bawah rail terang.
3. Rail utama ice-gray dengan tiga joint besar.
4. Panel belakang slate muda yang bergerak lebih lambat.
5. Panel zona teks biru baja hampir solid.
6. Bevel datar: highlight 2 px atas, shadow 4 px bawah; bukan gradient metal.
7. Modul kanan terikat rail, berisi tiga bar horizontal sebagai detail status tanpa angka/teks.
8. Garis scan tunggal berwarna es, sweep sekali saat masuk dan sekali sebelum keluar.
9. Pola micro-grid 48 px, opacity 0,025, hanya di panel.

### Palet

| Peran | Hex | Pemakaian |
|---|---|---|
| Dasar gelap | `#26313C` | Rail shadow |
| Dasar tengah | `#536579` | Panel utama |
| Tint terang | `#DCE5EA` | Rail dan top edge |
| Aksen | `#7898AE` | Modul/status bars |
| Highlight | `#F2F5F4` | Scan line lembut |
| Bayangan | `#151C24` | Contact depth |
| Permukaan zona teks | `#62768A` | Copy surface |

Teks pembeli yang disarankan: **putih netral** (`#FFFFFF`); black text tidak dipilih karena permukaan harus tetap aman di footage campuran.

### Timeline dan koreografi

| Elemen | Masuk | Tahan/ambient | Keluar | Kurva |
|---|---|---|---|---|
| Rail dasar | 0,13–0,77 / f4–23: draw-on kiri→kanan | joint pulse luminance ±2%, periode 4 dtk | 8,80–9,30 / f264–279: pecah pada joint dan tiap segmen meluncur turun 14 px | Ease-out expo; exit ease-in cubic stagger 3f |
| Panel belakang | 0,33–1,20 / f10–36: wipe kiri→kanan, translateX -90→0 | parallax X ±1,5 px | 8,67–9,23 / f260–277: clip diagonal ke kanan | Bezier `(0.16,1,0.3,1)`; exit ease-in quart |
| Panel utama | 0,50–1,47 / f15–44: rail mendorong panel, translateX -130→0, scaleY 0,96→1 | f52–247 stabil; grid statis | 8,60–9,40 / f258–282: panel teriris menjadi 3 strip horizontal yang bergeser kanan berurutan | Spring d22/s170/m0,8, overshoot 2%; exit bezier `(0.7,0,0.84,0)` |
| Modul kanan | 0,73–1,60 / f22–48: naik 26 px + scale 0,94→1 + opacity | tiga bar bernapas bergiliran ±3%, 40f per siklus | 8,70–9,17 / f261–275: collapse ke rail lalu rail pecah | Spring d18/s155/m0,7; exit ease-in expo |
| Status bars | 0,87–1,67 / f26–50, stagger 4f: scaleX | ambient sangat kecil, tidak seperti loading | 8,63–9,03 / f259–271, stagger 3f: retract | Ease-out cubic; exit ease-in cubic |
| Scan line | 1,07–1,73 / f32–52: sweep di dalam mask panel | tidak aktif pada hold utama | 8,37–8,70 / f251–261: sweep pendek menjadi cue exit | Ease-in-out cubic |
| Latar kosong | 0–0,10 / f0–3 | — | 9,60–10,00 / f288–299 | Hanya hitam |

Hubungan gerak: rail digambar lebih dahulu dan secara kausal membawa panel; modul kanan “mengunci” ke joint terakhir. Keluar memakai pemisahan strip dan joint-break, bukan gerak masuk terbalik.

### Tampilan frame 150 / 5,0 detik

Pita slate-biru lebar dengan rail es yang jelas dan modul kanan sederhana. Di ukuran 300 px, bentuk terbaca sebagai broadcast lower third modern; zona copy tetap menjadi massa terbesar dan paling tenang.

### Uji J, kelemahan, dan revisi

- **Uji thumbnail:** micro-grid hilang, tetapi itu diterima sebagai reward detail; rail dan modul diperbesar agar signature tetap terbaca.
- **Uji footage:** panel awal terlalu transparan untuk langit/salju. Revisi: copy surface opacity 97% dan shadow rail dibuat solid.
- **Uji generik:** versi awal terlalu mirip HUD. Revisi: hapus sudut bracket, angka palsu, dot acak, dan glow; fokus pada satu rail mekanis besar.
- **Uji pembeda:** berbeda dari BrassLedger lewat panjang hampir full-width, struktur horizontal, dan exit strip-slice.
- **Tiga kelemahan jujur:** (1) berpotensi terlalu teknis untuk lifestyle, (2) panel panjang menutup footage, (3) modul status dapat disalahartikan sebagai teks. Perbaikan: target niche dipersempit, tinggi panel hanya 166 px, bar dibuat tiga bentuk tanpa glyph/karakter.
- **Risiko teknis:** banyak mask strip saat exit harus menghindari hairline gap. **Biaya render:** sedang; beberapa SVG mask, tanpa blur besar.

### Metadata Adobe Stock

- **Title:** `Clean Slate Technology No Text Lower Third 4K`
- **Description:** `Modern technology lower third with no text, wide copy space for your own text, precise rail animation, clean black background workflow, delivered in 4K.`
- **25 keywords:** lower third, no text, copy space, 4k, technology, news, broadcast, slate blue, science, cybersecurity, title banner, name plate, motion graphics, video overlay, stock footage, modern, clean, precise, documentary, explainer, sports analysis, black background, screen blend, h264, editing asset

---

## 6. Konsep 4 — LT-ClayOrbit

### Posisi pasar dan keputusan delivery

- **Target pembeli:** podcaster, creator interview, culture channel, music documentary, food/travel presenter, dan social-video editor.
- **Karakter:** ramah, organik, kontemporer; lebih ekspresif daripada paket corporate.
- **Latar default:** green screen agar plum gelap, clay, dan bayangan kapsul tetap utuh.
- **Konsekuensi:** tidak ada teal/hijau, translucent fringe dibatasi, antialias diuji pada ujung arc dan kapsul.

### Geometri pada kanvas desain 1920×1080

- Bounding desain: x `778–1814`, y `734–978`.
- Kapsul utama: x `890`, y `786`, w `860`, h `180`, radius 90 px.
- Zona teks: x `958`, y `796`, w `760`, h `160`.
- Medallion/arc anchor: pusat `(872,876)`, radius luar 128 px; hanya 240° arc, bukan lingkaran/logo penuh.
- Fin clay penghubung: x `820`, y `832`, w `132`, h `88`.
- Margin kanan 106 px dan bawah 102 px.

### Lapisan belakang ke depan

1. Green-screen background.
2. Bayangan kapsul plum gelap, offset 8 px, blur statis 7 px.
3. Arc belakang 240° berwarna blush kusam; berfungsi sebagai jalur masuk.
4. Fin clay yang menghubungkan arc dan kartu sehingga tidak ada elemen melayang.
5. Kapsul plum utama/zona teks, opacity 98%.
6. Inner surface sedikit lebih terang, inset 8 px, hanya di 60% kanan panel.
7. Arc depan copper-clay 120° yang menutup sambungan.
8. Dua bead besar (diameter 14/10 px) yang berhenti pada terminal arc; bukan partikel acak.
9. Highlight krem 3 px sepanjang 35% tepi atas kapsul.

### Palet

| Peran | Hex | Pemakaian |
|---|---|---|
| Dasar gelap | `#342432` | Shadow dan arc belakang |
| Dasar tengah | `#644454` | Kapsul utama |
| Tint terang | `#E4CEC5` | Highlight lembut |
| Aksen | `#B96F55` | Fin dan arc depan |
| Highlight | `#F2E5D8` | Top edge |
| Bayangan | `#211820` | Contact shadow |
| Permukaan zona teks | `#735261` | Copy surface |

Teks pembeli yang disarankan: **putih krem** (`#FFF7EF`).

### Timeline dan koreografi

| Elemen | Masuk | Tahan/ambient | Keluar | Kurva |
|---|---|---|---|---|
| Arc belakang | 0,13–0,83 / f4–25: stroke draw-on 0→240° | rotasi semu ±1,2° selama 6 dtk | 8,63–9,10 / f259–273: arc membuka pada terminal atas dan tersapu ke bawah | Ease-out expo; exit ease-in cubic |
| Bead utama | 0,27–0,93 / f8–28: mengikuti ujung arc, scale 0,8→1 | bergerak hanya 4° bolak-balik, periode 5 dtk | 8,60–8,97 / f258–269: bead meluncur keluar dulu sebagai cue | Spring d16/s145/m0,65; exit ease-in expo |
| Fin penghubung | 0,50–1,20 / f15–36: tumbuh dari arc ke kanan | stabil | 8,73–9,17 / f262–275: mengecil menuju arc | Bezier `(0.16,1,0.3,1)`; exit ease-in quart |
| Kapsul utama | 0,63–1,53 / f19–46: arc menarik panel dari kanan, translateX 96→0, scale 0,96→1, opacity | breathe scale 1→1,006, periode 5 dtk; titik pivot kanan agar zona teks tidak tampak bergeser | 8,70–9,43 / f261–283: kapsul menekan jadi tinggi 70%, lalu meluncur kanan 130 px | Spring d20/s130/m0,95, overshoot 3%; exit bezier `(0.7,0,0.84,0)` |
| Arc depan | 0,80–1,63 / f24–49, stagger 5f: draw-on | offset stroke ±3 px, periode 6 dtk | 8,63–9,07 / f259–272: retract ke terminal bawah | Ease-out cubic; exit ease-in cubic |
| Edge highlight | 1,00–1,73 / f30–52: reveal sepanjang tepi | luminance ±2%; tanpa sweep berulang | 8,70–9,23 / f261–277: memudar sambil kapsul menekan | Ease-out sine; exit ease-in sine |
| Latar kosong | 0–0,10 / f0–3 | — | 9,60–10,00 / f288–299 | Hanya hijau |

Hubungan gerak: bead menggambar arc, arc menumbuhkan fin, fin menarik kapsul. Exit dimulai bead yang lepas, lalu kapsul terkompresi dan pergi ke kanan—bukan reverse draw-on.

### Tampilan frame 150 / 5,0 detik

Kapsul plum besar di kanan-bawah dengan anchor arc clay yang menonjol sebagai signature. Zona copy 760×160 tetap bersih; bentuk terasa social/editorial tanpa menyerupai chat bubble atau aplikasi UI.

### Uji J, kelemahan, dan revisi

- **Uji thumbnail:** arc tipis awal hilang. Revisi: stroke minimum 14 px, bead 14 px, fin penghubung diperbesar.
- **Uji footage:** panel plum stabil di scene terang/gelap karena chroma key dan opacity 98%.
- **Uji generik:** kapsul saja terlalu PowerPoint. Revisi: arc tidak penuh, bead terminal, fin struktural, dan koreografi arc-pulls-card.
- **Uji pembeda:** satu-satunya right-bottom, bentuk kurvilinear, dan entrance berbasis orbit.
- **Tiga kelemahan jujur:** (1) dapat terbaca sebagai label musik, (2) radius besar mengurangi area vertikal copy, (3) antialias arc rentan green fringe. Perbaikan: tidak ada icon/play symbol, zona tetap 760×160, arc memakai warna opak dan edge tanpa blur.
- **Risiko teknis:** posisi bead harus mengikuti path deterministik dan terminal presisi. **Biaya render:** ringan; SVG stroke dan transform dasar.

### Metadata Adobe Stock

- **Title:** `Clay and Plum Rounded No Text Lower Third Green Screen 4K`
- **Description:** `Creative rounded lower third with no text, generous copy space for your own text, clay orbit accent and clean green screen background, delivered in 4K.`
- **25 keywords:** lower third, no text, copy space, 4k, green screen, chroma key, podcast, creator, interview, culture, clay, plum, rounded banner, title card, name banner, motion graphics, video overlay, stock footage, modern, warm, organic, social media, documentary, h264, clean

---

## 7. Konsep 5 — LT-SandArchive

### Posisi pasar dan keputusan delivery

- **Target pembeli:** historical documentary, education, museum content, book review, investigative journalism, dan travel heritage.
- **Karakter:** arsip modern, kredibel, tenang; terasa seperti kartu katalog fisik yang disederhanakan.
- **Latar default:** hitam untuk Screen/Add. Panel pasir cukup terang dan solid; garis tinta tidak dipakai sebagai batas luar utama agar bentuk tidak hilang.
- **Alternatif green screen:** sangat aman karena tidak ada hijau; bayangan biru tinta dipertahankan sebagai bagian opak.

### Geometri pada kanvas desain 1920×1080

- Bounding desain: x `108–1072`, y `704–982`.
- Spine/tab vertikal: x `108`, y `704`, w `118`, h `278`, dengan sudut kiri-atas terpotong 24 px.
- Kartu utama: x `196`, y `758`, w `876`, h `208`.
- Zona teks: x `270`, y `782`, w `760`, h `160`.
- Strip indeks atas: x `226`, y `738`, w `618`, h `28`.
- Notch semicircle kanan: pusat `(1072,862)`, radius 34 px; notch hanya dekorasi struktural, tidak memakan zona copy.
- Margin kiri 108 px, bawah 98 px.

### Lapisan belakang ke depan

1. Latar hitam delivery.
2. Bayangan tinta padat offset 10 px ke kiri-bawah; tanpa blur pada versi Screen/Add.
3. Spine vertikal biru tinta sebagai jangkar dan pembeda siluet.
4. Kartu belakang batu abu hangat, offset -18 px Y.
5. Kartu utama pasir/zona teks, solid dengan tonal gradient diagonal 3%.
6. Notch kanan dan potongan kiri atas yang memberi rasa archive tab.
7. Strip indeks biru dalam, menempel di tepi atas kartu.
8. Tiga garis kontur tebal 5 px di bagian spine; tanpa angka atau glyph.
9. Highlight champagne 2 px pada sisi atas/kiri dan grain SVG statis 0,025 di panel.

### Palet

| Peran | Hex | Pemakaian |
|---|---|---|
| Dasar gelap | `#17283D` | Spine dan strip indeks |
| Dasar tengah | `#8E877A` | Kartu belakang |
| Tint terang | `#E7DDC8` | Highlight dan backing |
| Aksen | `#A96F4B` | Garis kontur terpilih |
| Highlight | `#F3E9D6` | Edge tipis |
| Bayangan | `#0D1825` | Contact shadow |
| Permukaan zona teks | `#C8BCA5` | Kartu utama |

Teks pembeli yang disarankan: **biru tinta/hitam lembut** (`#17283D`), memberi kontras tinggi di atas pasir.

### Timeline dan koreografi

| Elemen | Masuk | Tahan/ambient | Keluar | Kurva |
|---|---|---|---|---|
| Spine vertikal | 0,13–0,80 / f4–24: drop 70 px→0, rotate -3°→0°, scale 0,96→1 | float Y ±1 px, periode 6 dtk | 8,70–9,17 / f261–275: “stamp lift” naik 26 px dan rotate 2° | Spring d15/s120/m1,0, overshoot 4%; exit ease-in cubic |
| Kartu belakang | 0,37–1,13 / f11–34: slide dari kiri 110 px, opacity + scale | parallax X ±1 px | 8,63–9,23 / f259–277: turun 30 px di balik kartu utama | Spring d21/s145/m0,9; exit ease-in quart |
| Kartu utama | 0,53–1,47 / f16–44: diagonal mask reveal dari kiri-atas, translateY 34→0, scale 0,975→1 | f52–245 stabil; grain statis | 8,60–9,40 / f258–282: notch kanan membesar dan wipe menyedot kartu ke kanan-bawah | Bezier `(0.16,1,0.3,1)`; exit `(0.72,0,0.84,0)` |
| Strip indeks | 0,73–1,57 / f22–47: scaleX dari spine, stagger 6f | drift X 0→3→0 px, periode 5 dtk | 8,73–9,10 / f262–273: snap ke kiri dan hilang di spine | Ease-out expo; exit ease-in expo |
| Garis kontur spine | 0,87–1,63 / f26–49, stagger 4f: draw-on | opacity 0,72–0,78, periode 4 dtk | 8,63–9,07 / f259–272, stagger 3f | Ease-out cubic; exit ease-in cubic |
| Highlight/grain | 1,03–1,73 / f31–52: opacity bertahap | statis; tidak ada sparkle | 8,60–8,97 / f258–269: fade cepat | Ease-out/ease-in sine |
| Latar kosong | 0–0,10 / f0–3 | — | 9,60–10,00 / f288–299 | Hanya hitam |

Hubungan gerak: spine jatuh seperti stamp dan membuka ruang; kartu belakang menggeser dari arsip, kartu utama direveal diagonal, strip indeks memanjang dari spine. Exit memakai notch sebagai “handle” yang menarik kartu keluar.

### Tampilan frame 150 / 5,0 detik

Kartu pasir terang dengan spine biru tinta di kiri dan notch besar di kanan. Di thumbnail 300 px, siluet archive card langsung dikenali; zona copy luas dan tenang mendukung teks gelap satu atau dua baris.

### Uji J, kelemahan, dan revisi

- **Uji thumbnail:** grain dan highlight menghilang, tetapi spine, notch, dan kontras pasir–tinta tetap sangat terbaca.
- **Uji footage:** pada langit terang, panel pasir masih terpisah lewat spine dan shadow tinta; pada malam, bidang terang tetap dominan.
- **Uji generik:** kartu awal terlalu sederhana. Revisi: spine stamp, notch fungsional, backing offset, diagonal reveal, dan indexed strip.
- **Uji pembeda:** berbeda dari WineFold melalui posisi kiri, bidang datar arsip, teks gelap, dan bahasa gerak stamp/pull.
- **Tiga kelemahan jujur:** (1) bidang terang bisa terlalu dominan, (2) nuansa arsip membatasi niche, (3) black Screen dapat menghilangkan shadow. Perbaikan: tinggi hanya 208 px, metadata menarget documentary/education, shadow bukan satu-satunya pemisah—backing dan spine tetap terlihat.
- **Risiko teknis:** notch mask perlu anti-alias bersih saat bergerak. **Biaya render:** ringan; clipPath sederhana dan pola SVG statis.

### Metadata Adobe Stock

- **Title:** `Warm Archive Card No Text Lower Third 4K`
- **Description:** `Warm documentary archive lower third with no text, clear copy space for your own text, refined index card motion on black background, delivered in 4K.`
- **25 keywords:** lower third, no text, copy space, 4k, documentary, archive, history, education, museum, journalism, sand color, ink blue, index card, title plate, name banner, motion graphics, video overlay, stock footage, editorial, heritage, clean, professional, black background, h264, presentation

---

## 8. Standar teknis bersama untuk implementasi berikutnya

- Design space 1920×1080; render final MP4/H.264 3840×2160 memakai scale 2 agar koordinat tetap mudah dipelihara.
- FPS 30; durasi 10 detik/300 frame. Frame pertama f0 dan frame terakhir f299 hanya latar.
- Semua `interpolate` wajib clamp kiri/kanan dan memakai easing; tidak ada CSS animation/transition atau realtime clock.
- Spring hanya untuk transform; opacity dan clip dimapping terpisah agar tidak melebihi 1 saat overshoot.
- Tidak ada `Math.random`; bila tekstur membutuhkan variasi, gunakan `random(seed)` Remotion dan hasilnya stabil per elemen.
- Background menjadi prop `black | greenscreen`; varian default mengikuti keputusan tiap konsep.
- Tidak ada audio karena produk ditujukan sebagai overlay utilitas dan brief melarang aset eksternal; editor bebas menambah SFX sesuai edit.
- Tidak ada teks, glyph, pseudo-letter, angka, logo, atau font di dalam visual.
- Detail minimum pada design space: stroke 5 px, gap 8 px, aksen kecil 10 px; semuanya menjadi dua kali lebih besar saat output 4K.
- Efek mahal dihindari: blur maksimum 8 px dan statis, tanpa backdrop-filter, displacement map, atau tumpukan shadow besar.

## 9. Urutan implementasi yang disarankan

1. **LT-BrassLedger** — menguji sistem dasar: registry, props background, safe area, mask, theme per composition, dan timeline 300f dengan biaya terendah.
2. **LT-WineFold** — memvalidasi green-screen edge serta koreografi unfold bertingkat setelah sistem dasar stabil.
3. **LT-IceRail** — menambah mask strip, draw-on panjang, dan detail downscale; cocok menjadi stress test keterbacaan 720p.
4. **LT-ClayOrbit** — memerlukan path-following bead dan pemeriksaan antialias kurva di green screen.
5. **LT-SandArchive** — dikerjakan terakhir agar bahasa visualnya dapat dikalibrasi sebagai penutup koleksi yang paling editorial tanpa bertabrakan dengan empat desain sebelumnya.

Setiap implementasi harus melalui urutan: build satu composition → render frame f0, f45, f150, f270, f299 → inspeksi pada ukuran penuh dan thumbnail 300 px → tes di atas still terang dan gelap → koreksi → render MP4 4K final. Tidak ada konsep berikutnya yang dimulai sebelum konsep aktif lolos kelima pemeriksaan tersebut.
