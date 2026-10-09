#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CREAR VIDEO FINAL - VERSIÓN SIMPLIFICADA
Función: Cortar, juntar y editar videos con AIDA
"""

import os
import sys
from pathlib import Path

print("\n" + "="*70)
print("🎬 EDITOR DE VIDEOS - EL BUEN CERDITO")
print("="*70 + "\n")

try:
    from moviepy.editor import (
        VideoFileClip, TextClip, CompositeVideoClip,
        AudioFileClip, concatenate_videoclips, ColorClip
    )
    print("✅ MoviePy cargado correctamente\n")
except ImportError as e:
    print(f"❌ Error: MoviePy no instalado\n{e}")
    print("\nIntentando instalar...")
    os.system("pip install moviepy -q")
    from moviepy.editor import (
        VideoFileClip, TextClip, CompositeVideoClip,
        AudioFileClip, concatenate_videoclips, ColorClip
    )
    print("✅ MoviePy instalado y cargado\n")

# ═══════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════

INPUT_FOLDER = "videos_originales"
OUTPUT_FILE = "video_final.mp4"
MUSIC_FILE = "musica_fondo.mp3"

CLIP_DURATION = 7  # segundos
CLIP_START = 5     # comenzar desde segundo 5

TEXTS_AIDA = {
    "attention": "🐷 ¡MIRA ESTO!",
    "interest": "Cemitas hechas como en casa",
    "desire": "Frescas, deliciosas, irresistibles",
    "action": "Pide: +52 222 278 1310"
}

FONT_SIZE = 70
FONT_COLOR = "white"

# ═══════════════════════════════════════════════════════════════
# PASO 1: VERIFICAR VIDEOS
# ═══════════════════════════════════════════════════════════════

print("PASO 1: Verificando videos...\n")

if not os.path.exists(INPUT_FOLDER):
    print(f"❌ Carpeta no encontrada: {INPUT_FOLDER}")
    sys.exit(1)

video_files = sorted([f for f in os.listdir(INPUT_FOLDER) if f.endswith('.mp4')])

if not video_files:
    print(f"❌ No hay videos MP4 en {INPUT_FOLDER}/")
    sys.exit(1)

print(f"✅ {len(video_files)} videos encontrados:\n")
for vf in video_files:
    path = os.path.join(INPUT_FOLDER, vf)
    size_mb = os.path.getsize(path) / (1024*1024)
    print(f"   • {vf} ({size_mb:.1f} MB)")

# ═══════════════════════════════════════════════════════════════
# PASO 2: CARGAR Y CORTAR VIDEOS
# ═══════════════════════════════════════════════════════════════

print("\n" + "="*70)
print("PASO 2: Cortando videos...\n")

clips = []

for i, video_file in enumerate(video_files, 1):
    video_path = os.path.join(INPUT_FOLDER, video_file)

    print(f"🎬 Video {i}: {video_file}")

    try:
        video = VideoFileClip(video_path)
        total_duration = video.duration

        # Calcular segmento
        start = min(CLIP_START, total_duration - CLIP_DURATION)
        end = min(start + CLIP_DURATION, total_duration)

        print(f"   ⏱️  Duración: {total_duration:.1f}s")
        print(f"   ✂️  Cortando: {start:.1f}s - {end:.1f}s")

        # Cortar
        clip = video.subclip(start, end)
        clips.append(clip)

        print(f"   ✅ OK ({end-start:.1f}s)\n")

    except Exception as e:
        print(f"   ❌ Error: {e}\n")
        sys.exit(1)

if not clips:
    print("❌ No se pudieron cargar clips")
    sys.exit(1)

# ═══════════════════════════════════════════════════════════════
# PASO 3: CONCATENAR
# ═══════════════════════════════════════════════════════════════

print("="*70)
print("PASO 3: Concatenando videos...\n")

print("⏳ Juntando clips...")

try:
    final_video = concatenate_videoclips(clips)
    total_duration = final_video.duration
    print(f"✅ Concatenado: {total_duration:.1f}s\n")
except Exception as e:
    print(f"❌ Error al concatenar: {e}")
    sys.exit(1)

# ═══════════════════════════════════════════════════════════════
# PASO 4: AGREGAR TEXTOS AIDA
# ═══════════════════════════════════════════════════════════════

print("="*70)
print("PASO 4: Agregando textos AIDA...\n")

w, h = final_video.size
section_duration = total_duration / 4

try:
    text_clips = []

    # ATENCIÓN
    txt1 = TextClip(
        TEXTS_AIDA["attention"],
        fontsize=FONT_SIZE,
        color=FONT_COLOR,
        font="Arial-Bold",
        method="caption",
        size=(w, h)
    ).set_duration(section_duration).set_start(0)
    text_clips.append(txt1)
    print(f"✅ Atención: {TEXTS_AIDA['attention']}")

    # INTERÉS
    txt2 = TextClip(
        TEXTS_AIDA["interest"],
        fontsize=FONT_SIZE,
        color=FONT_COLOR,
        font="Arial-Bold",
        method="caption",
        size=(w, h)
    ).set_duration(section_duration).set_start(section_duration)
    text_clips.append(txt2)
    print(f"✅ Interés: {TEXTS_AIDA['interest']}")

    # DESEO
    txt3 = TextClip(
        TEXTS_AIDA["desire"],
        fontsize=FONT_SIZE,
        color=FONT_COLOR,
        font="Arial-Bold",
        method="caption",
        size=(w, h)
    ).set_duration(section_duration).set_start(section_duration * 2)
    text_clips.append(txt3)
    print(f"✅ Deseo: {TEXTS_AIDA['desire']}")

    # ACCIÓN
    txt4 = TextClip(
        TEXTS_AIDA["action"],
        fontsize=FONT_SIZE,
        color=FONT_COLOR,
        font="Arial-Bold",
        method="caption",
        size=(w, h)
    ).set_duration(section_duration).set_start(section_duration * 3)
    text_clips.append(txt4)
    print(f"✅ Acción: {TEXTS_AIDA['action']}\n")

    # Componer con textos
    print("⏳ Componiendo video con textos...")
    final_with_text = CompositeVideoClip([final_video] + text_clips)
    print("✅ Textos agregados\n")

except Exception as e:
    print(f"❌ Error al agregar textos: {e}")
    sys.exit(1)

# ═══════════════════════════════════════════════════════════════
# PASO 5: AGREGAR MÚSICA
# ═══════════════════════════════════════════════════════════════

print("="*70)
print("PASO 5: Agregando música...\n")

if os.path.exists(MUSIC_FILE):
    print(f"✅ Música encontrada: {MUSIC_FILE}")
    try:
        music = AudioFileClip(MUSIC_FILE)
        music = music.volumex(0.5)
        final_with_audio = final_with_text.set_audio(music)
        print("✅ Música agregada\n")
    except Exception as e:
        print(f"⚠️  Error con música: {e}")
        print("Continuando sin música...\n")
        final_with_audio = final_with_text
else:
    print(f"⚠️  Música no encontrada: {MUSIC_FILE}")
    print("Continuando sin música...\n")
    final_with_audio = final_with_text

# ═══════════════════════════════════════════════════════════════
# PASO 6: EXPORTAR
# ═══════════════════════════════════════════════════════════════

print("="*70)
print("PASO 6: Exportando video final...\n")

print(f"📁 Archivo: {OUTPUT_FILE}")
print(f"📐 Resolución: {w}x{h}")
print(f"⏱️  Duración: {total_duration:.1f}s")
print(f"🎬 Procesando... (esto puede tomar unos minutos)\n")

try:
    final_with_audio.write_videofile(
        OUTPUT_FILE,
        fps=24,
        codec='libx264',
        audio_codec='aac',
        verbose=False,
        logger=None
    )

    file_size_mb = os.path.getsize(OUTPUT_FILE) / (1024*1024)

    print("\n" + "="*70)
    print("✅ ¡VIDEO CREADO EXITOSAMENTE!")
    print("="*70)
    print(f"📁 Archivo: {OUTPUT_FILE}")
    print(f"📊 Tamaño: {file_size_mb:.1f} MB")
    print(f"⏱️  Duración: {total_duration:.1f}s")
    print(f"📐 Resolución: {w}x{h}")
    print("\n🚀 Listo para Facebook Ads")
    print("="*70 + "\n")

except Exception as e:
    print(f"\n❌ Error al exportar: {e}")
    sys.exit(1)
