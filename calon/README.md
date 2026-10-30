# IT Backgrounds — Remotion

5 composition mandiri: Network Packet Flow, Server Activity Grid, Terminal Process Stream, Layered Data Bus, Distributed System Map.

Salin semua TSX ke satu folder src di proyek Remotion. Import ITBackgroundCompositions di Root, lalu tambahkan <ITBackgroundCompositions /> di samping Composition lain. Tidak perlu registerRoot kedua.

Semua composition: 3840x2160, 30fps, 360 frame (12 detik). Background hitam solid, tanpa glow, tanpa intro/outro. Selain terminal, tidak ada teks. Semua perhitungan mengikuti fase siklik; render frame 0–359, jangan menambahkan frame 360 duplikat.

File mandiri hanya membutuhkan React dan Remotion. Font terminal menggunakan font monospace lokal; gunakan font sama pada runner dan komputer untuk hasil konsisten. Pasang DejaVu Sans Mono atau Liberation Mono bila belum tersedia.

Visualisasi ini konseptual, bukan monitoring data nyata. Beberapa penyederhanaan: Network node activation menggunakan pulsa periodik; Data Bus buffer menggunakan fase periodik dan belum mensimulasikan antrean paket; Distributed Map memakai jalur bersiku yang dapat bersilangan tanpa junction.

Validasi yang dilakukan: pemeriksaan matematika periodisitas, endpoint scroll terminal, dan sumber kode. Typecheck serta render Remotion belum dijalankan.
