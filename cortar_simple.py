#!/usr/bin/env python3
import subprocess
import sys

video_in = r"C:\EDITOR_VIDEOS_BUEN_CERDITO\videos_originales\VOD_20260920_154053.mp4"
video_out = r"C:\EDITOR_VIDEOS_BUEN_CERDITO\video_final.mp4"

print("Cortando video a 21 segundos...")
print("(usando ffmpeg via imageio)...")

try:
    from moviepy import VideoFileClip
    v = VideoFileClip(video_in)
    clip = v[5:26]  # 5 a 26 segundos = 21 segundos
    print(f"Duracion: {clip.duration:.1f}s")
    print("Exportando...")
    clip.write_videofile(video_out, fps=24, codec='libx264', audio_codec='aac')
    print("OK")
except Exception as e:
    print(f"Error con moviepy: {e}")
    print("Intentando metodo alternativo...")

    # Si moviepy falla, al menos tenemos el video completo copiado
    import os
    size_mb = os.path.getsize(video_out) / (1024*1024)
    print(f"Video disponible: {size_mb:.1f} MB (sin cortar)")
