# Flexible Remotion Asset Studio

Workspace Remotion untuk membuat aset motion graphics tanpa mengunci proyek ke
satu resolusi, durasi, frame rate, background, atau codec tertentu.

## Mulai

```bash
npm install
npm run dev
```

Registry composition saat ini sengaja kosong. Tambahkan aset baru ke
`src/compositions/`, lalu daftarkan hanya di `src/compositions/registry.tsx`.

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
```

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
