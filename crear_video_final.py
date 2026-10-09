#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import subprocess
import sys
import os

# Asegurar moviepy
print("Verificando dependencias...")
subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "moviepy"])

print("\n" + "="*70)
print("🎬 EDITOR DE VIDEOS - EL BUEN CERDITO")
print("="*70 + "\n")

from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip, concatenate_videoclips

INPUT_FOLDER = "videos_originales"
OUTPUT = "video_final.mp4"
CLIP_DUR = 7
CLIP_START = 5

TEXTS = {
    "a": "🐷 ¡MIRA ESTO!",
    "b": "Cemitas hechas como en casa",
    "c": "Frescas, deliciosas, irresistibles",
    "d": "Pide: +52 222 278 1310"
}

# Cargar videos
print("Cargando videos...\n")
videos = sorted([f for f in os.listdir(INPUT_FOLDER) if f.endswith('.mp4')])
print(f"✅ {len(videos)} videos encontrados\n")

clips = []
for i, vf in enumerate(videos, 1):
    path = os.path.join(INPUT_FOLDER, vf)
    print(f"🎬 Video {i}: {vf}")

    v = VideoFileClip(path)
    dur = v.duration
    start = min(CLIP_START, dur - CLIP_DUR)
    end = min(start + CLIP_DUR, dur)

    clip = v.subclip(start, end)
    clips.append(clip)
    print(f"   ✂️  {start:.0f}s-{end:.0f}s → OK\n")

# Concatenar
print("Concatenando...")
final = concatenate_videoclips(clips)
print(f"✅ {final.duration:.1f}s total\n")

# Textos AIDA
print("Agregando textos AIDA...")
w, h = final.size
sec = final.duration / 4

txts = []
for i, (k, txt) in enumerate(TEXTS.items()):
    t = TextClip(txt, fontsize=70, color='white', font='Arial-Bold', method='caption', size=(w, h))
    t = t.set_duration(sec).set_start(i * sec)
    txts.append(t)
    print(f"✅ {txt}")

final_txt = CompositeVideoClip([final] + txts)
print()

# Música
if os.path.exists("musica_fondo.mp3"):
    print("Agregando música...")
    music = AudioFileClip("musica_fondo.mp3").volumex(0.5)
    final_audio = final_txt.set_audio(music)
else:
    final_audio = final_txt

# Exportar
print(f"Exportando a {OUTPUT}...\n")
final_audio.write_videofile(OUTPUT, fps=24, codec='libx264', audio_codec='aac', verbose=False, logger=None)

size_mb = os.path.getsize(OUTPUT) / (1024*1024)
print("\n" + "="*70)
print(f"✅ ¡VIDEO CREADO!")
print(f"📁 {OUTPUT} ({size_mb:.1f} MB)")
print(f"⏱️  {final.duration:.1f}s")
print("="*70 + "\n")
