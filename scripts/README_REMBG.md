# Panduan Penggunaan Skrip Hapus Latar Belakang (RemBG)

Skrip ini dibuat berdasarkan **Bagian H pada `ASSET_PROMPTS.md`** untuk menghapus latar belakang gambar karakter dan properti hasil generate AI agar menjadi PNG transparan siap pakai di Remotion.

> [!WARNING]
> Skrip ini **hanya untuk sprite karakter dan properti** (misalnya `ray_smile`, `sol_neutral`, `prop_notebook`), **BUKAN untuk latar belakang** `bg_*` (seperti `bg_room_day.png`, `bg_ceiling_night.png`).

---

### Langkah Penggunaan

1. **Pasang dependensi Python**:
   ```bash
   pip install rembg onnxruntime pillow
   ```

2. **Siapkan folder `raw_assets/`**:
   Letakkan gambar mentah hasil AI di folder `raw_assets/` di root proyek:
   ```text
   Remotion/
   └── raw_assets/
       ├── ray_neutral.png
       ├── ray_smile.png
       ├── sol_neutral.png
       └── prop_notebook.png
   ```

3. **Jalankan skrip secara manual**:
   ```bash
   python scripts/remove-bg.py
   ```

4. **Hasil**:
   Semua gambar yang telah dihapus latarnya akan tersimpan otomatis di:
   ```text
   public/assets/
   ├── ray_neutral.png
   ├── ray_smile.png
   ├── sol_neutral.png
   └── prop_notebook.png
   ```

5. **Perbarui manifes aset (opsional)**:
   Setelah gambar masuk ke `public/assets/`, komponen `Sprite` di Remotion akan otomatis mendeteksi dan menampilkannya, menggantikan kotak placeholder berlabel.
