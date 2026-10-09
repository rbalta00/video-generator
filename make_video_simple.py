#!/usr/bin/env python3
import os, sys, subprocess

subprocess.run([sys.executable, "-m", "pip", "install", "-q", "moviepy"], check=False)

from moviepy import VideoFileClip, concatenate_videoclips, AudioFileClip

os.chdir(r"C:\EDITOR_VIDEOS_BUEN_CERDITO")

input_dir = "videos_originales"
output_file = "video_final.mp4"

videos = sorted([f for f in os.listdir(input_dir) if f.endswith('.mp4')])
print(f"Encontrados {len(videos)} videos")

clips = []
for vf in videos:
    path = os.path.join(input_dir, vf)
    v = VideoFileClip(path)
    dur = v.duration
    start = min(5, max(0, dur - 7))
    end = min(start + 7, dur)
    print(f"  Cargando: {vf} ({dur:.1f}s total, usando {start:.1f}s-{end:.1f}s)")
    clip = v[start:end]
    clips.append(clip)

print(f"Concatenando {len(clips)} clips...")
final = concatenate_videoclips(clips)
print(f"Duracion total: {final.duration:.1f}s")

if os.path.exists("musica_fondo.mp3"):
    print("Agregando musica...")
    music = AudioFileClip("musica_fondo.mp3").with_volume(0.5)
    final_audio = final.with_audio(music)
else:
    final_audio = final
    print("Sin musica (archivo no encontrado)")

print(f"Exportando a {output_file}...")
final_audio.write_videofile(output_file, fps=24, codec='libx264', audio_codec='aac')

if os.path.exists(output_file):
    size_mb = os.path.getsize(output_file) / (1024*1024)
    print(f"✅ OK - {output_file} ({size_mb:.1f} MB)")
else:
    print(f"❌ Fallo al crear {output_file}")
    sys.exit(1)
