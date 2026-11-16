"""
Skrip Otomasi Penghapusan Latar Belakang Sprite (RemBG)
Sesuai Bagian H di ASSET_PROMPTS.md.

PANDUAN PENGGUNAAN:
1. Pastikan dependensi Python terpasang:
   pip install rembg onnxruntime pillow

2. Letakkan gambar mentah hasil generate AI di dalam folder 'raw_assets/'
   (contoh: raw_assets/ray_smile.png, raw_assets/prop_notebook.png).
   PERHATIAN: Hanya untuk karakter dan properti, bukan untuk latar 'bg_*'.

3. Jalankan skrip ini secara manual:
   python scripts/remove-bg.py

Hasil gambar transparan akan otomatis disimpan ke dalam folder 'public/assets/'.
"""

import os
import glob
import sys

def main():
    input_dir = "raw_assets"
    output_dir = os.path.join("public", "assets")

    # Pastikan direktori input dan output ada
    os.makedirs(input_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)

    try:
        from rembg import remove
        from PIL import Image
    except ImportError:
        print("[ERROR] Pustaka 'rembg' atau 'pillow' belum terpasang.")
        print("Silakan pasang dengan menjalankan:")
        print("  pip install rembg onnxruntime pillow")
        sys.exit(1)

    # Cari semua gambar di raw_assets
    extensions = ("*.png", "*.jpg", "*.jpeg", "*.webp")
    files = []
    for ext in extensions:
        files.extend(glob.glob(os.path.join(input_dir, ext)))

    if not files:
        print(f"[INFO] Tidak ada berkas gambar ditemukan di folder '{input_dir}'.")
        print(f"Letakkan gambar mentah di '{input_dir}' lalu jalankan ulang skrip ini.")
        return

    print(f"[START] Memproses penghapusan latar untuk {len(files)} berkas gambar...")

    processed_count = 0
    for file_path in files:
        file_name = os.path.splitext(os.path.basename(file_path))[0] + ".png"
        out_path = os.path.join(output_dir, file_name)

        print(f"  -> Memproses: {file_path} => {out_path}")
        try:
            with Image.open(file_path) as img:
                out = remove(img)
                out.save(out_path, format="PNG")
            processed_count += 1
        except Exception as e:
            print(f"  [GAGAL] Error saat memproses {file_path}: {e}")

    print(f"\n[SELESAI] Sukses memproses {processed_count}/{len(files)} gambar ke '{output_dir}'.")

if __name__ == "__main__":
    main()
