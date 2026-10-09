#!/usr/bin/env python3
import os, sys, subprocess, shutil

subprocess.run([sys.executable, "-m", "pip", "install", "-q", "moviepy"], check=False)

from moviepy import VideoFileClip, TextClip, CompositeVideoClip

os.chdir(r"C:\EDITOR_VIDEOS_BUEN_CERDITO")

print("Cargando video_final.mp4...")
video = VideoFileClip("video_final.mp4")
duration = video.duration
w, h = video.size

print(f"Video: {duration:.1f}s, {w}x{h}")

textos = [
    ("🐷 ¡MIRA ESTO!", 0, duration/4),
    ("Cemitas hechas como en casa", duration/4, duration/2),
    ("Frescas, deliciosas, irresistibles", duration/2, 3*duration/4),
    ("Pide: +52 222 278 1310", 3*duration/4, duration)
]

print("\nCreando textos...")
txt_clips = []

for texto, start_t, end_t in textos:
    print(f"  • {texto} ({start_t:.1f}s - {end_t:.1f}s)")
    try:
        t = TextClip(text=texto, font_size=60, color="white")
        t = t.with_duration(end_t - start_t).with_start(start_t)
        txt_clips.append(t)
    except Exception as e:
        print(f"    Error: {e}")

if txt_clips:
    print(f"\nComponiendo video con {len(txt_clips)} textos...")
    final = CompositeVideoClip([video] + txt_clips)

    print("Exportando a archivo temporal...")
    final.write_videofile("video_final_temp.mp4", fps=24, codec='libx264', audio_codec='aac')

    print("Reemplazando archivo original...")
    shutil.move("video_final_temp.mp4", "video_final.mp4")

    size_mb = os.path.getsize("video_final.mp4") / (1024*1024)
    print(f"\nOK - Video con textos: {size_mb:.1f} MB")
else:
    print("ERROR - No se pudieron crear los textos")
    sys.exit(1)
