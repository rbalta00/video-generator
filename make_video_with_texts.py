#!/usr/bin/env python3
import os, sys, subprocess

subprocess.run([sys.executable, "-m", "pip", "install", "-q", "moviepy"], check=False)

from moviepy import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, AudioFileClip

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
    print(f"  {vf}: usando {start:.1f}s-{end:.1f}s")
    clip = v[start:end]
    clips.append(clip)

print(f"Concatenando {len(clips)} clips...")
final = concatenate_videoclips(clips)
total_dur = final.duration
w, h = final.size
print(f"Duracion total: {total_dur:.1f}s")

print("Agregando textos AIDA...")
textos = [
    ("🐷 ¡MIRA ESTO!", 0, total_dur/4),
    ("Cemitas hechas como en casa", total_dur/4, total_dur/2),
    ("Frescas, deliciosas, irresistibles", total_dur/2, 3*total_dur/4),
    ("Pide: +52 222 278 1310", 3*total_dur/4, total_dur)
]

txt_clips = []
for text, start_t, end_t in textos:
    t = TextClip(text=text, font_size=60, color="white")
    t = t.with_duration(end_t - start_t).with_start(start_t)
    txt_clips.append(t)
    print(f"  OK: {text}")

final_txt = CompositeVideoClip([final] + txt_clips)

if os.path.exists("musica_fondo.mp3"):
    print("Agregando musica...")
    music = AudioFileClip("musica_fondo.mp3").with_volume(0.5)
    final_audio = final_txt.with_audio(music)
else:
    final_audio = final_txt
    print("Sin musica")

print(f"Exportando {output_file}...")
final_audio.write_videofile(output_file, fps=24, codec='libx264', audio_codec='aac')

if os.path.exists(output_file):
    size_mb = os.path.getsize(output_file) / (1024*1024)
    print(f"OK - Video creado: {size_mb:.1f} MB")
else:
    print(f"ERROR - {output_file} no se creo")
    sys.exit(1)
