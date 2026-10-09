#!/usr/bin/env python3
import os, sys, subprocess

subprocess.run([sys.executable, "-m", "pip", "install", "-q", "moviepy"], check=False)

from moviepy import VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip, concatenate_videoclips

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
    start = min(5, dur - 7)
    end = min(start + 7, dur)
    clip = v[start:end]
    clips.append(clip)
    print(f"OK: {vf}")

final = concatenate_videoclips(clips)
w, h = final.size
sec = final.duration / 4

txts_data = [
    ("ATENCION", "Mira esto!", 0),
    ("INTERES", "Cemitas hechas como en casa", sec),
    ("DESEO", "Frescas, deliciosas, irresistibles", sec*2),
    ("ACCION", "Pide: +52 222 278 1310", sec*3)
]

txt_clips = []
for name, text, start_time in txts_data:
    t = TextClip(text, fontsize=70, color='white')
    t = t.with_duration(sec).with_start(start_time)
    txt_clips.append(t)

final_txt = CompositeVideoClip([final] + txt_clips)

if os.path.exists("musica_fondo.mp3"):
    music = AudioFileClip("musica_fondo.mp3").with_volume(0.5)
    final_audio = final_txt.with_audio(music)
else:
    final_audio = final_txt

print(f"Exportando a {output_file}...")
final_audio.write_videofile(output_file, fps=24, codec='libx264', audio_codec='aac', verbose=False, logger=None)

size_mb = os.path.getsize(output_file) / (1024*1024)
print(f"OK - Archivo creado: {output_file} ({size_mb:.1f} MB)")
