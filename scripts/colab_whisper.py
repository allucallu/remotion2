"""
Pipeline Transkripsi Whisper untuk Google Colab (GPU T4 Gratis)
Jalankan di Google Colab: https://colab.research.google.com
"""

# Cell 1: Install openai-whisper
# !pip install -q openai-whisper

import json
import whisper

# Pastikan file audio (lagu-16k.wav atau Krisis Hati dan Ekonomi.mp3) sudah diupload ke Colab
audio_file = "lagu-16k.wav"  # atau "Krisis Hati dan Ekonomi.mp3"

print("1. Memuat model Whisper medium...")
model = whisper.load_model("medium")

print("2. Mentranskripsi audio (bahasa: id, word timestamps: True)...")
result = model.transcribe(
    audio_file,
    language="id",
    word_timestamps=True,
    verbose=False
)

output_filename = "whisper-raw.json"
with open(output_filename, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"\n[SUKSES] Transkripsi selesai!")
print(f"Silakan unduh '{output_filename}' dari panel Files di Colab, lalu letakkan di folder proyek Remotion:")
print("  Remotion/data/whisper-raw.json")

