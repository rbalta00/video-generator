@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title El Buen Cerdito - Crear Video
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║       🎬 CREAR VIDEO - EL BUEN CERDITO 🎬                   ║
echo ║          Paso 1: Instalar moviepy si es necesario              ║
echo ║          Paso 2: Crear video con AIDA                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d "C:\EDITOR_VIDEOS_BUEN_CERDITO"

REM Paso 1: Verificar Python
echo ⏳ Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python no está instalado
    echo.
    echo Descarga Python desde: python.org
    echo IMPORTANTE: Marca "Add Python to PATH" durante la instalación
    pause
    exit /b 1
)
echo ✅ Python encontrado
echo.

REM Paso 2: Instalar moviepy de forma robusta
echo ⏳ Verificando moviepy...
python -c "import moviepy" >nul 2>&1
if errorlevel 1 (
    echo ⏳ Instalando moviepy... (esto puede tomar 1-2 minutos)
    echo.
    python -m pip install moviepy --quiet --disable-pip-version-check
    if errorlevel 1 (
        echo ❌ Error al instalar moviepy
        pause
        exit /b 1
    )
    echo ✅ moviepy instalado
) else (
    echo ✅ moviepy ya está instalado
)
echo.

REM Paso 3: Crear el script Python inline
echo ⏳ Preparando script de edición...
echo.

python << 'PYEOF'
# -*- coding: utf-8 -*-
import os, sys
from pathlib import Path

os.chdir(r"C:\EDITOR_VIDEOS_BUEN_CERDITO")

print("="*70)
print("Cargando moviepy...")
print("="*70)
print()

from moviepy.editor import (
    VideoFileClip, TextClip, CompositeVideoClip,
    AudioFileClip, concatenate_videoclips
)

INPUT = "videos_originales"
OUTPUT = "video_final.mp4"

# Cargar videos
print(f"Buscando videos en: {INPUT}\n")
videos = sorted([f for f in os.listdir(INPUT) if f.endswith('.mp4')])

if not videos:
    print(f"❌ NO HAY VIDEOS EN {INPUT}/")
    sys.exit(1)

print(f"✅ {len(videos)} videos encontrados:\n")
for v in videos:
    size = os.path.getsize(os.path.join(INPUT, v)) / (1024*1024)
    print(f"   • {v} ({size:.1f} MB)")

# Cortar videos
print("\n" + "="*70)
print("CORTANDO VIDEOS")
print("="*70 + "\n")

clips = []
for i, vf in enumerate(videos, 1):
    path = os.path.join(INPUT, vf)
    print(f"🎬 Video {i}: {vf}")

    try:
        video = VideoFileClip(path)
        total = video.duration
        start = min(5, total - 7)
        end = min(start + 7, total)

        clip = video.subclip(start, end)
        clips.append(clip)

        print(f"   ✂️  Cortado: {start:.0f}s-{end:.0f}s ({end-start:.1f}s)")
        print(f"   ✅ OK\n")
    except Exception as e:
        print(f"   ❌ ERROR: {e}\n")
        sys.exit(1)

# Concatenar
print("="*70)
print("CONCATENANDO")
print("="*70 + "\n")

try:
    final = concatenate_videoclips(clips)
    total_dur = final.duration
    print(f"✅ Video concatenado: {total_dur:.1f}s\n")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)

# Agregar textos AIDA
print("="*70)
print("AGREGANDO TEXTOS AIDA")
print("="*70 + "\n")

w, h = final.size
section = total_dur / 4

texts = [
    ("Atención", "🐷 ¡MIRA ESTO!", 0),
    ("Interés", "Cemitas hechas como en casa", section),
    ("Deseo", "Frescas, deliciosas, irresistibles", section*2),
    ("Acción", "Pide: +52 222 278 1310", section*3)
]

txt_clips = []
for name, text, start_time in texts:
    t = TextClip(text, fontsize=70, color='white', font='Arial-Bold', method='caption', size=(w, h))
    t = t.set_duration(section).set_start(start_time)
    txt_clips.append(t)
    print(f"✅ {name}: {text}")

final_txt = CompositeVideoClip([final] + txt_clips)
print()

# Música
if os.path.exists("musica_fondo.mp3"):
    print("="*70)
    print("AGREGANDO MÚSICA")
    print("="*70 + "\n")
    try:
        music = AudioFileClip("musica_fondo.mp3")
        music = music.volumex(0.5)
        final_audio = final_txt.set_audio(music)
        print("✅ Música agregada\n")
    except:
        final_audio = final_txt
        print("⚠️  Sin música\n")
else:
    final_audio = final_txt
    print("⚠️  Archivo musica_fondo.mp3 no encontrado\n")

# Exportar
print("="*70)
print("EXPORTANDO")
print("="*70 + "\n")

print(f"Archivo: {OUTPUT}")
print(f"Resolución: {w}x{h}")
print(f"Duración: {total_dur:.1f}s")
print(f"Procesando... (puede tomar algunos minutos)\n")

try:
    final_audio.write_videofile(
        OUTPUT,
        fps=24,
        codec='libx264',
        audio_codec='aac',
        verbose=False,
        logger=None
    )

    size_mb = os.path.getsize(OUTPUT) / (1024*1024)

    print("\n" + "="*70)
    print("✅ ¡VIDEO CREADO EXITOSAMENTE!")
    print("="*70)
    print(f"Archivo: {OUTPUT}")
    print(f"Tamaño: {size_mb:.1f} MB")
    print(f"Duración: {total_dur:.1f}s")
    print("="*70 + "\n")

except Exception as e:
    print(f"\n❌ Error al exportar: {e}")
    sys.exit(1)

PYEOF

if errorlevel 1 (
    echo.
    echo ❌ Error durante la creación del video
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ ¡LISTO!                                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📁 El video está en:
echo    C:\EDITOR_VIDEOS_BUEN_CERDITO\video_final.mp4
echo.
pause
