# Flexible Remotion Asset Studio

Workspace Remotion untuk membuat aset motion graphics tanpa mengunci proyek ke
satu resolusi, durasi, frame rate, background, atau codec tertentu.

## Mulai

```bash
npm install
npm run dev
```

Registry berisi **40 composition produksi** dari `calon/`, dengan source di
`src/compositions/` dan daftar di `src/compositions/registry.tsx`. Setiap entri
memakai export `NamaCompositionConfig`; default props mengikuti komponen sumber.

Simpan gambar, footage, audio, dan font baru di `public/`, lalu akses melalui
`staticFile()`. Folder `out/` digunakan untuk hasil render lokal dan tidak disimpan di Git.

## Struktur

```text
src/
  compositions/registry.tsx  # satu-satunya daftar aset
  config/
    metadata.ts              # resolusi, fps, dan durasi dinamis
    schema.ts                # kontrol input Studio berbasis Zod
    theme.ts                 # warna, font, dan safe area global
    video-formats.ts         # preset landscape, portrait, square, HD, 4K
  utils/                     # background, easing, random, dan timing
  Root.tsx                   # merender registry; biasanya tidak perlu diedit
public/                      # aset sumber untuk composition baru
```

## Composition terdaftar

Semua 40 file dipindahkan dari `calon/<ID>.tsx` ke
`src/compositions/<ID>.tsx` dengan nama yang sama. Setiap paket lima aset tetap
satu composition. Durasi dan pergantian aset mengikuti konfigurasi serta segmen
source masing-masing: paket berdurasi 30, 35, 37, atau 42 detik.
Background hitam dan perilaku frame awal mengikuti default source asli.

| ID / nama file source tanpa .tsx | Resolusi  | FPS | Frame | Durasi   |
| -------------------------------- | --------- | --- | ----- | -------- |
| AttentionMarksFivePack           | 3840x2160 | 30  | 1050  | 35 detik |
| AttentionMarksSculptedPack       | 3840x2160 | 30  | 1050  | 35 detik |
| BrushCaptionFivePack             | 3840x2160 | 30  | 1110  | 37 detik |
| CaptionCapsuleTrack              | 3840x2160 | 30  | 300   | 10 detik |
| CaptionEnamelBuckle              | 3840x2160 | 30  | 300   | 10 detik |
| CaptionFoldedTicket              | 3840x2160 | 30  | 300   | 10 detik |
| CaptionFrostedPrism              | 3840x2160 | 30  | 300   | 10 detik |
| CaptionOffsetSleeve              | 3840x2160 | 30  | 300   | 10 detik |
| CaptionOpenFrame                 | 3840x2160 | 30  | 300   | 10 detik |
| CaptionOrigamiWing               | 3840x2160 | 30  | 300   | 10 detik |
| CaptionRibbonEnds                | 3840x2160 | 30  | 300   | 10 detik |
| CaptionSideClamps                | 3840x2160 | 30  | 300   | 10 detik |
| CaptionSpineDrawer               | 3840x2160 | 30  | 300   | 10 detik |
| CaptionSplitBridge               | 3840x2160 | 30  | 300   | 10 detik |
| CaptionStackedSlats              | 3840x2160 | 30  | 300   | 10 detik |
| CaptionSteppedEdge               | 3840x2160 | 30  | 300   | 10 detik |
| CaptionTornCollage               | 3840x2160 | 30  | 300   | 10 detik |
| CaptionWovenBorder               | 3840x2160 | 30  | 300   | 10 detik |
| CircleHighlightExpressivePack    | 3840x2160 | 30  | 1050  | 35 detik |
| CircleHighlightFivePack          | 3840x2160 | 30  | 1050  | 35 detik |
| DirectionalArrowFivePack         | 3840x2160 | 30  | 900   | 30 detik |
| DirectionalArrowSculptedPack     | 3840x2160 | 30  | 900   | 30 detik |
| FocusBoldBevel                   | 3840x2160 | 30  | 300   | 10 detik |
| FocusChevronSteps                | 3840x2160 | 30  | 300   | 10 detik |
| FocusCutCorner                   | 3840x2160 | 30  | 300   | 10 detik |
| FocusDottedTrace                 | 3840x2160 | 30  | 300   | 10 detik |
| FocusFoldedFan                   | 3840x2160 | 30  | 300   | 10 detik |
| FocusInkTrace                    | 3840x2160 | 30  | 300   | 10 detik |
| FocusInterlockTabs               | 3840x2160 | 30  | 300   | 10 detik |
| FocusOffsetLayers                | 3840x2160 | 30  | 300   | 10 detik |
| FocusPivotNodes                  | 3840x2160 | 30  | 300   | 10 detik |
| FocusPixelAssembly               | 3840x2160 | 30  | 300   | 10 detik |
| FocusPrecisionRail               | 3840x2160 | 30  | 300   | 10 detik |
| FocusRibbonCurl                  | 3840x2160 | 30  | 300   | 10 detik |
| FocusSoftSnap                    | 3840x2160 | 30  | 300   | 10 detik |
| FocusTripleArc                   | 3840x2160 | 30  | 300   | 10 detik |
| FocusWovenCorner                 | 3840x2160 | 30  | 300   | 10 detik |
| ImpactAccentFivePack             | 3840x2160 | 30  | 900   | 30 detik |
| ImpactAccentGraphicPack          | 3840x2160 | 30  | 900   | 30 detik |
| NaturalBrushCaptionPack          | 3840x2160 | 30  | 1260  | 42 detik |

## Menambahkan aset

1. Buat komponen di `src/compositions/NamaAsset.tsx`.
2. Gunakan `useCurrentFrame()` dan `useVideoConfig()` untuk semua animasi.
3. Tambahkan satu registration ke `assetRegistry`.

Contoh registration:

```tsx
import { Composition } from "remotion";
import { resolveAssetMetadata } from "../config/metadata";
import { assetSettingsSchema } from "../config/schema";
import { NamaAsset } from "./NamaAsset";

export interface AssetRegistration {
  id: string;
  render: () => React.ReactNode;
}

export const assetRegistry: readonly AssetRegistration[] = [
  {
    id: "NamaAsset",
    render: () => (
      <Composition
        id="NamaAsset"
        component={NamaAsset}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={180}
        schema={assetSettingsSchema}
        defaultProps={{
          format: "landscape-hd",
          durationInSeconds: 6,
          fps: 30,
          backgroundColor: "transparent",
        }}
        calculateMetadata={({ props }) => resolveAssetMetadata(props)}
      />
    ),
  },
];
```

`width` dan `height` pada props dapat menimpa preset sehingga ukuran custom tetap
didukung. `calculateMetadata` menyelaraskan ukuran, fps, dan durasi Composition
dengan kontrol Studio.

## Preset format

- `landscape-hd`: 1920x1080
- `landscape-4k`: 3840x2160
- `portrait-hd`: 1080x1920
- `portrait-4k`: 2160x3840
- `square`: 1080x1080
- `square-4k`: 2160x2160

## Perintah

```bash
npm run dev
npm run compositions
npm run lint
npm run typecheck
npm run build
npm run render -- NamaAsset out/NamaAsset.mp4 --codec=h264
```

Master transparan dapat dirender tanpa mengubah konfigurasi proyek:

```bash
npm run render -- NamaAsset out/NamaAsset.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le
```

Codec dan image format tidak ditetapkan secara global agar setiap aset bebas
memilih H.264, ProRes, output alpha, atau image sequence.

## Aturan implementasi

- Jangan memakai CSS transition atau CSS animation; animasi harus berasal dari frame Remotion.
- Hitung timing dari `fps`, bukan angka frame yang tersebar di komponen.
- Gunakan `staticFile()` untuk aset dari folder `public/`.
- Gunakan `OffthreadVideo` untuk footage video.
- Gunakan fungsi deterministik untuk random agar render konsisten.
- Untuk seamless loop, gunakan `phase()` dengan harmonik bilangan bulat.
- Render dan periksa beberapa frame penting sebelum aset dianggap selesai.

## Render melalui GitHub Actions

Workflow `.github/workflows/render.yml` mengambil composition dari registry.
Jika registry kosong, langkah bundle, render, verifikasi, dan pembuatan ZIP dilewati.
Setelah aset baru didaftarkan, push ke `main` atau `master` menjalankan workflow;
workflow juga dapat dijalankan manual untuk semua composition atau satu ID tertentu.

Output CI memakai `release/videos/<CompositionID>.mp4`, H.264 `yuv420p`,
3840x2160. Untuk aset Adobe Stock, nama file mengikuti pemetaan stabil di
`metadata/adobe-stock/assets.json`, maksimal 30 karakter termasuk `.mp4`.
Dua pengecualian dari `<CompositionID>.mp4`: `DirectionalArrowSculptedPack`
menjadi `DirectionalArrowForms.mp4` dan `CircleHighlightExpressivePack` menjadi
`CircleHighlightExpressive.mp4`. Ekspor default berlatar hitam dan tanpa alpha.

Video hasil render dikemas sebagai `remotion-4k-renders.zip` dan diunggah sebagai
artifact `remotion-4k-renders` dengan masa simpan 14 hari. CSV hasil generate di
`release/metadata/adobe_stock_metadata.csv` ikut berada dalam ZIP dan diunggah
terpisah sebagai artifact `adobe-stock-metadata`, juga 14 hari. CSV CI hanya
berisi aset dari pilihan render, sehingga render satu ID menghasilkan satu baris.

## Metadata Adobe Stock

`metadata/adobe-stock/assets.json` berisi metadata English untuk 40 composition
dari tujuh keluarga grafik: Focus Corner Brackets, Blank Caption Strip,
Directional Arrow, Impact Accents, Brush Caption, Circle Highlights, Attention
Marks. Semua memakai kategori `8` (Graphic Resources). Satu pack lima desain
tetap satu file upload dan satu baris CSV.

```bash
npm run metadata:generate
npm run metadata:check
npm run metadata:manifest
```

Generator memakai TypeScript AST untuk membaca registry, config, default props,
dan segmen source. `metadata:generate` memperbarui CSV impor
`metadata/adobe-stock/adobe_stock_metadata.csv` serta inventaris teknis dan visual
`metadata/adobe-stock/inventory.json`. Ubah metadata terstruktur lalu generate;
jangan edit CSV secara terpisah. Catatan sumber dan keputusan keyword ada di
`metadata/adobe-stock/research.md`.

`metadata:manifest` memvalidasi data lalu menghasilkan `render-list.tsv` dan CSV
release. Variabel lingkungan `SELECTED_COMPOSITION` opsional memilih satu ID;
kosong berarti discovery seluruh registry. Composition di luar tujuh keluarga
tetap masuk render dengan filename `<ID>.mp4` tanpa ditambahkan ke CSV batch ini.
Metadata lama di luar cakupan tidak ditulis ulang. ID baru dalam keluarga yang
sama wajib mempunyai metadata sebelum CI lolos. Setelah video tersedia,
`npm run metadata:verify-rendered` memeriksa kesamaan filename dengan manifest
dan CSV. Workflow tetap memeriksa ukuran video dan resolusi sebelum pengemasan.

CSV memakai header resmi `Filename,Title,Keywords,Category,Releases`, UTF-8,
judul maksimal 70 karakter, 5–49 keyword berurutan, dan Releases kosong.
Pengaturan bahasa Contributor harus English ketika mengimpor batch ini.
