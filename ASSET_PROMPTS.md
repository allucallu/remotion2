# Paket Prompt Aset Gambar — MV "8 Letters"

Gunakan di model gambar apa pun (Gemini image/Nano Banana, dll.). Prompt dalam bahasa Inggris karena umumnya hasilnya lebih stabil.

## Cara kerja
1. Lampirkan **gambar referensi gaya** milikmu pada **setiap** generate, dengan catatan: "match this drawing style only; do not copy the character".
2. Generate **character sheet** Ray dan Sol dulu. Pilih yang paling bagus, lalu **lampirkan sheet itu di semua prompt pose** supaya wajah/rambut konsisten.
3. Untuk sprite karakter: minta latar **putih polos** (atau hijau polos), lalu hapus latar dengan `rembg` (bisa diminta ke agent Antigravity).
4. Tiap pose sprite generate **2 kali** (varian A dan B) untuk efek garis bergetar. Beri akhiran `_A.png` / `_B.png`.
5. Simpan di `public/assets/` dengan nama persis seperti di checklist.

## Blok gaya (tempel di AWAL setiap prompt)
```
STYLE: loose hand-drawn pen sketch illustration on cream paper (#FFF7E3). Thin wobbly ink outlines
with uneven line weight, dense parallel diagonal hatching in dark navy-black ink (#1B1A2E) for hair
and clothing, a few strands/folds accented in orange-red colored pencil (#D9532B), cheeks lightly
hatched in yellow (#F4B942), skin left unpainted (paper color shows through). Chibi proportions
(large head, small body), tiny solid oval dot eyes, minimal facial detail, expressive eyebrows.
Charming, slightly messy, sketchbook doodle feel. No text, no watermark, no copyrighted characters.
```

## Blok larangan (tempel di AKHIR setiap prompt)
```
AVOID: any existing franchise character, wizard theme, lightning-bolt scar, round glasses, school
house uniform, wand, realistic rendering, 3D, glossy shading, heavy digital gradients, photo
background, logos, captions, speech text.
```

## A. Character sheet (generate dulu)
**A1 — Ray (character sheet)**
```
[STYLE] Character design sheet of an ORIGINAL chibi boy named Ray: short messy dark hair with
one orange-accented cowlick, navy hoodie with hatching, sneakers, no glasses, gentle slightly
shy personality. Show front view, 3/4 view, and side view, plus 6 head expressions (neutral,
smile, shy blush, sad, eyes closed peaceful, determined). White plain background. [AVOID]
```
**A2 — Sol (character sheet)**
```
[STYLE] Character design sheet of an ORIGINAL chibi girl named Sol: shoulder-length wavy dark
hair with a few orange-pencil strands, small orange hair clip, oversized cream sweater with
hatched folds, rosy yellow-hatched cheeks, warm patient personality. Front view, 3/4 view, side
view, plus 6 head expressions (neutral, warm smile, curious tilt, worried, eyes closed
peaceful, happy laugh). White plain background. [AVOID]
```

## B. Sprite karakter (latar putih, 2 varian A/B, lampirkan character sheet)
Template:
```
[STYLE] Using the attached character sheet for exact design consistency, draw ORIGINAL chibi
{CHARACTER} {POSE DESCRIPTION}. Full body (or as specified), plain white background, centered,
generous margin around the figure. [AVOID]
```
Daftar pose dan nama file (isi `{POSE DESCRIPTION}`):

| File | Pose |
|---|---|
| `ray_neutral_A/B.png` | berdiri santai, tangan di saku hoodie |
| `ray_smile_A/B.png` | berdiri tersenyum kecil malu |
| `ray_shy_A/B.png` | menggaruk belakang kepala, pipi merona |
| `ray_sad_A/B.png` | menunduk, bahu turun, tatapan ke bawah |
| `ray_eyesclosed_A/B.png` | memejam damai, wajah menengadah sedikit |
| `ray_reachout_A/B.png` | satu tangan terulur ke depan, ragu-ragu |
| `ray_stepback_A/B.png` | melangkah mundur, tangan terangkat defensif |
| `ray_determined_A/B.png` | berdiri tegak, tangan mengepal, mata mantap |
| `ray_writing_A/B.png` | duduk memegang buku kecil dan pensil, menulis |
| `sol_neutral_A/B.png` | berdiri santai, tangan di depan |
| `sol_smile_A/B.png` | tersenyum hangat |
| `sol_wait_A/B.png` | duduk memeluk lutut, menunggu sabar |
| `sol_curious_A/B.png` | kepala miring penasaran |
| `sol_eyesclosed_A/B.png` | memejam damai |
| `sol_reachout_A/B.png` | tangan terulur menyambut |
| `sol_laugh_A/B.png` | tertawa kecil bahagia |

## C. Pose berdua (latar putih, 2 varian A/B)
| File | Deskripsi |
|---|---|
| `duo_lying_up_A/B.png` | Ray dan Sol berbaring bersebelahan, terlihat dari atas/samping, saling berdekatan, menatap ke atas |
| `duo_pull_close_A/B.png` | Ray menarik tangan Sol mendekat, Sol sedikit terkejut tersenyum |
| `duo_push_away_A/B.png` | Ray mengangkat tangan memberi jarak, Sol terlihat bingung tapi sabar |
| `duo_palms_A/B.png` | close-up dua telapak tangan saling menempel (tangan besar sederhana, tanpa garis telapak karena akan digambar lewat kode) |
| `duo_hold_hands_A/B.png` | berdiri berdampingan bergandengan tangan, tersenyum, terlihat dari belakang/samping |
| `duo_sitting_A/B.png` | duduk bersebelahan di tepi tempat tidur, bahu bersentuhan |

## D. Latar belakang (gambar penuh, JANGAN transparan, 16:9)
Template:
```
[STYLE] 16:9 empty background scene drawn in the same sketchbook style, no characters, light
hatching, lots of empty space in the composition. {SCENE}. [AVOID]
```
| File | Scene |
|---|---|
| `bg_ceiling_night.png` | pandangan ke atas pada plafon kamar malam dengan bintang tempel kecil, **kertas navy #1F2340**, garis putih kapur, glow oranye hangat di tepi |
| `bg_room_day.png` | kamar sederhana siang hari: tempat tidur, jendela, rak buku, lampu meja; kertas krem, ruang kosong luas di tengah |
| `bg_room_night.png` | kamar yang sama tetapi malam hari, lampu meja menyala hangat, kertas navy |
| `bg_street_day.png` | jalan kecil kota dengan pepohonan dan tiang lampu, krem |
| `bg_golden.png` | ruangan kamar sama dengan cahaya jendela oranye sore |
| `bg_paper_plain.png` | kertas krem polos bertekstur halus dengan sedikit noda pensil di tepi |
| `bg_dark_plain.png` | kertas navy polos dengan sedikit goresan kapur samar |

## E. Properti (latar putih, lalu dihapus)
| File | Deskripsi |
|---|---|
| `prop_notebook.png` | buku kecil terbuka dengan halaman bergaris, ada coretan tinta |
| `prop_pencil.png` | pensil oranye |
| `prop_phone.png` | ponsel sederhana |
| `prop_lamp.png` | lampu meja dengan cahaya |
| `prop_cup_x2.png` | dua cangkir minuman berdampingan |
| `prop_heart_cracked.png` | hati dengan retakan (ukuran besar, garis tebal) |
| `prop_heart_patch.png` | hati dengan plester/tambalan |
| `prop_tile_empty.png` | kotak huruf kosong gaya tile (bingkai pensil goyang, isi putih krem) |
| `prop_stars_set.png` | 8 bintang kecil berbeda bentuk, tersebar |

> Huruf pada kotak (I, L, O, V, E, Y, O, U) **ditulis lewat font di Remotion**, bukan di gambar.

## F. Aset inti (kerjakan lebih dulu jika waktu terbatas)
`ray_neutral`, `ray_smile`, `ray_sad`, `ray_eyesclosed`, `ray_reachout`, `ray_stepback`, `sol_neutral`, `sol_smile`, `sol_eyesclosed`, `duo_lying_up`, `duo_pull_close`, `duo_push_away`, `duo_palms`, `duo_hold_hands`, `bg_ceiling_night`, `bg_room_day`, `bg_dark_plain`, `bg_paper_plain`, `bg_golden`, `prop_notebook`, `prop_heart_cracked`, `prop_heart_patch`.
Sisanya dikerjakan bertahap; tanpa aset, Remotion memakai placeholder.

## G. Tips konsistensi
- Jika wajah berubah antar gambar, ulang dengan kalimat: "same exact character design as the attached sheet, do not redesign".
- Jika gaya mulai jadi digital mulus, tambahkan: "scanned pencil and ink sketch, visible paper grain, imperfect lines".
- Jika hasil terlalu ramai, tambahkan: "much simpler, fewer lines, more empty space".
- Simpan semua prompt yang berhasil agar varian A/B tetap sejalan.

## H. Skrip hapus latar (minta agent menjalankan)
```
pip install rembg onnxruntime pillow
python -c "
import glob
from rembg import remove
from PIL import Image
for f in glob.glob('raw_assets/*.png'):
    out = remove(Image.open(f))
    out.save(f.replace('raw_assets','public/assets'))
"
```
(Hanya untuk sprite karakter dan properti, bukan latar `bg_*`.)
