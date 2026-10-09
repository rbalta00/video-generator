#!/usr/bin/env python3
"""
Crear 3 variantes de video para El Buen Cerdito
Variante 1: Diferente corte
Variante 2: Con textos AIDA
Variante 3: Con música de fondo
"""

import os
import subprocess
from pathlib import Path
from moviepy.editor import (
    VideoFileClip, concatenate_videoclips,
    CompositeVideoClip, TextClip, ColorClip
)

PROJECT_DIR = r"C:\EDITOR_VIDEOS_BUEN_CERDITO"
VIDEOS_ORIGINALES = os.path.join(PROJECT_DIR, "videos_originales")

# Videos originales
VIDEO1 = os.path.join(VIDEOS_ORIGINALES, "VOD_20260920_154053.mp4")
VIDEO2 = os.path.join(VIDEOS_ORIGINALES, "VOD_20260920_160925.mp4")
VIDEO3 = os.path.join(VIDEOS_ORIGINALES, "VOD_20260920_163521.mp4")

print("=" * 70)
print("🎬 CREANDO 3 VARIANTES DE VIDEO - EL BUEN CERDITO")
print("=" * 70)

# ============================================================
# VARIANTE 1: Diferente corte (10-17 segundos en lugar de 5-12)
# ============================================================
print("\n📹 VARIANTE 1: Diferente corte (10-17s)...")

try:
    clips_v1 = []

    # Video 1: 10-17s
    clip1 = VideoFileClip(VIDEO1).subclipped(10, 17)
    clips_v1.append(clip1)

    # Video 2: 10-17s (ajustado por duración)
    if VideoFileClip(VIDEO2).duration >= 17:
        clip2 = VideoFileClip(VIDEO2).subclipped(10, 17)
    else:
        clip2 = VideoFileClip(VIDEO2).subclipped(10, 10 + 7)
    clips_v1.append(clip2)

    # Video 3: 10-17s
    clip3 = VideoFileClip(VIDEO3).subclipped(10, 17)
    clips_v1.append(clip3)

    # Concatenar
    video_v1 = concatenate_videoclips(clips_v1)
    output_v1 = os.path.join(PROJECT_DIR, "video_variante_1_corte_diferente.mp4")
    video_v1.write_videofile(output_v1, verbose=False, logger=None)

    tamaño_v1 = os.path.getsize(output_v1) / 1024 / 1024
    print(f"✅ Variante 1 creada: {tamaño_v1:.2f} MB")

except Exception as e:
    print(f"❌ Error en Variante 1: {e}")

# ============================================================
# VARIANTE 2: Con textos AIDA usando ffmpeg
# ============================================================
print("\n📝 VARIANTE 2: Con textos AIDA...")

try:
    input_video = os.path.join(PROJECT_DIR, "video_final.mp4")
    output_v2 = os.path.join(PROJECT_DIR, "video_variante_2_con_textos.mp4")

    # Crear filtro de texto para ffmpeg
    filtro_textos = (
        "drawtext="
        "text='🐷 ¡MIRA ESTO!'"
        ":fontfile='C\\:/Windows/Fonts/arial.ttf'"
        ":fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-80"
        ":enable='between(t,0,5.2)':borderw=2:bordercolor=black,"
        "drawtext="
        "text='Cemitas hechas como en casa'"
        ":fontfile='C\\:/Windows/Fonts/arial.ttf'"
        ":fontsize=50:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-60"
        ":enable='between(t,5.2,10.5)':borderw=2:bordercolor=black,"
        "drawtext="
        "text='Frescas, deliciosas, irresistibles'"
        ":fontfile='C\\:/Windows/Fonts/arial.ttf'"
        ":fontsize=50:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-60"
        ":enable='between(t,10.5,15.8)':borderw=2:bordercolor=black,"
        "drawtext="
        "text='Pide: +52 222 278 1310'"
        ":fontfile='C\\:/Windows/Fonts/arial.ttf'"
        ":fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2+80"
        ":enable='between(t,15.8,21)':borderw=2:bordercolor=black"
    )

    cmd_v2 = [
        "ffmpeg", "-i", input_video,
        "-vf", filtro_textos,
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-y", output_v2
    ]

    resultado = subprocess.run(cmd_v2, capture_output=True, text=True, timeout=300)

    if resultado.returncode == 0 and os.path.exists(output_v2):
        tamaño_v2 = os.path.getsize(output_v2) / 1024 / 1024
        print(f"✅ Variante 2 creada: {tamaño_v2:.2f} MB")
    else:
        print(f"⚠️  Variante 2: ffmpeg no disponible, saltando...")

except Exception as e:
    print(f"⚠️  Error en Variante 2: {e}")

# ============================================================
# VARIANTE 3: Con música de fondo (si disponible)
# ============================================================
print("\n🎵 VARIANTE 3: Con música de fondo...")

try:
    from moviepy.editor import AudioFileClip, CompositeAudioClip

    input_video = os.path.join(PROJECT_DIR, "video_final.mp4")
    output_v3 = os.path.join(PROJECT_DIR, "video_variante_3_con_musica.mp4")

    # Buscar archivo de música
    musica_posibles = [
        os.path.join(PROJECT_DIR, "musica_fondo.mp3"),
        os.path.join(PROJECT_DIR, "musica.mp3"),
    ]

    musica_encontrada = None
    for m in musica_posibles:
        if os.path.exists(m):
            musica_encontrada = m
            break

    if musica_encontrada:
        video = VideoFileClip(input_video)
        audio_musica = AudioFileClip(musica_encontrada)

        # Ajustar duración de música
        if audio_musica.duration < video.duration:
            # Loop si es más corta
            audio_musica = audio_musica.speedx(video.duration / audio_musica.duration)
        else:
            # Cortar si es más larga
            audio_musica = audio_musica.subclipped(0, video.duration)

        # Mezclar: video original + música (volumen reducido)
        audio_musica = audio_musica.volumex(0.5)
        audio_final = CompositeAudioClip([video.audio, audio_musica])

        video_final = video.set_audio(audio_final)
        video_final.write_videofile(output_v3, verbose=False, logger=None)

        tamaño_v3 = os.path.getsize(output_v3) / 1024 / 1024
        print(f"✅ Variante 3 creada: {tamaño_v3:.2f} MB")
    else:
        print("⚠️  No se encontró archivo de música, saltando...")

except Exception as e:
    print(f"⚠️  Error en Variante 3: {e}")

# ============================================================
# Resumen final
# ============================================================
print("\n" + "=" * 70)
print("🎉 VARIANTES CREADAS")
print("=" * 70)

archivos = [
    ("video_variante_1_corte_diferente.mp4", "Diferente corte (10-17s)"),
    ("video_variante_2_con_textos.mp4", "Con textos AIDA superpuestos"),
    ("video_variante_3_con_musica.mp4", "Con música de fondo"),
]

for archivo, desc in archivos:
    ruta = os.path.join(PROJECT_DIR, archivo)
    if os.path.exists(ruta):
        tamaño = os.path.getsize(ruta) / 1024 / 1024
        print(f"✅ {desc}: {tamaño:.2f} MB")
    else:
        print(f"⚠️  {desc}: No se creó")

print("\n📁 Todos los videos están en: " + PROJECT_DIR)
print("=" * 70)
