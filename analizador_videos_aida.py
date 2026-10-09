#!/usr/bin/env python3
"""
ANALIZADOR DE VIDEOS - MATERIAL PRIMO A CLIPS AIDA
Divide videos en clips y los organiza por categoría AIDA
"""

import os
import sys
import subprocess
from pathlib import Path

# Instalar moviepy
subprocess.run([sys.executable, "-m", "pip", "install", "-q", "moviepy"], check=False)

try:
    from moviepy import VideoFileClip
except ImportError:
    print("❌ Error: moviepy no disponible")
    sys.exit(1)

# ============================================================
# CONFIGURACIÓN
# ============================================================
PROJECT_DIR = r"C:\EDITOR_VIDEOS_BUEN_CERDITO"
MATERIAL_PRIMO_DIR = os.path.join(PROJECT_DIR, "material_primo")
CLIPS_DIR = os.path.join(PROJECT_DIR, "clips_aida")

CATEGORIAS = {
    "ATENCION_Hook": "Captura atención (0-3 segundos del video)",
    "INTERES_Producto": "Muestra producto",
    "DESEO_Emocion": "Crea emoción/deseo",
    "ACCION_CTA": "Call-to-action (últimos 3-5 segundos)"
}

os.chdir(PROJECT_DIR)

print("=" * 70)
print("🎬 ANALIZADOR DE VIDEOS - MÉTODO AIDA")
print("=" * 70)

# ============================================================
# FUNCIÓN: Analizar y dividir video
# ============================================================
def analizar_video(video_path):
    """Analiza un video y lo divide en clips AIDA"""

    print(f"\n📹 Analizando: {os.path.basename(video_path)}")

    try:
        video = VideoFileClip(video_path)
        duracion = video.duration

        print(f"   Duración total: {duracion:.1f} segundos")
        print(f"   Resolución: {video.w}x{video.h}")

        # Calcular segmentos AIDA (aproximado)
        seg_1 = duracion * 0.15  # 15% = ATENCIÓN (primeros segundos)
        seg_2 = duracion * 0.35  # 35% = INTERÉS
        seg_3 = duracion * 0.35  # 35% = DESEO
        seg_4 = duracion * 0.15  # 15% = ACCIÓN (últimos segundos)

        clips_creados = []

        # ============================================================
        # CLIP 1: ATENCIÓN (Hook)
        # ============================================================
        print("\n   [1/4] 🎯 ATENCIÓN (Hook)...")
        try:
            clip_inicio = video[0:min(seg_1, video.duration)]
            nombre_clip = f"01_ATENCION_Hook_{int(seg_1)}seg.mp4"
            ruta_clip = os.path.join(CLIPS_DIR, "ATENCION_Hook", nombre_clip)

            clip_inicio.write_videofile(
                ruta_clip, fps=24, codec='libx264', audio_codec='aac',
                verbose=False, logger=None
            )
            print(f"      ✅ {nombre_clip}")
            clips_creados.append(("ATENCION", nombre_clip))
        except Exception as e:
            print(f"      ❌ Error: {str(e)[:60]}")

        # ============================================================
        # CLIP 2: INTERÉS (Producto)
        # ============================================================
        print("\n   [2/4] 📦 INTERÉS (Producto)...")
        try:
            start = seg_1
            end = min(seg_1 + seg_2, video.duration)
            clip_interes = video[start:end]
            nombre_clip = f"02_INTERES_Producto_{int(seg_2)}seg.mp4"
            ruta_clip = os.path.join(CLIPS_DIR, "INTERES_Producto", nombre_clip)

            clip_interes.write_videofile(
                ruta_clip, fps=24, codec='libx264', audio_codec='aac',
                verbose=False, logger=None
            )
            print(f"      ✅ {nombre_clip}")
            clips_creados.append(("INTERES", nombre_clip))
        except Exception as e:
            print(f"      ❌ Error: {str(e)[:60]}")

        # ============================================================
        # CLIP 3: DESEO (Emoción)
        # ============================================================
        print("\n   [3/4] ❤️  DESEO (Emoción)...")
        try:
            start = seg_1 + seg_2
            end = min(seg_1 + seg_2 + seg_3, video.duration)
            clip_deseo = video[start:end]
            nombre_clip = f"03_DESEO_Emocion_{int(seg_3)}seg.mp4"
            ruta_clip = os.path.join(CLIPS_DIR, "DESEO_Emocion", nombre_clip)

            clip_deseo.write_videofile(
                ruta_clip, fps=24, codec='libx264', audio_codec='aac',
                verbose=False, logger=None
            )
            print(f"      ✅ {nombre_clip}")
            clips_creados.append(("DESEO", nombre_clip))
        except Exception as e:
            print(f"      ❌ Error: {str(e)[:60]}")

        # ============================================================
        # CLIP 4: ACCIÓN (Call-to-action)
        # ============================================================
        print("\n   [4/4] 📞 ACCIÓN (Call-to-action)...")
        try:
            start = max(0, video.duration - seg_4)
            clip_accion = video[start:video.duration]
            nombre_clip = f"04_ACCION_CTA_{int(seg_4)}seg.mp4"
            ruta_clip = os.path.join(CLIPS_DIR, "ACCION_CTA", nombre_clip)

            clip_accion.write_videofile(
                ruta_clip, fps=24, codec='libx264', audio_codec='aac',
                verbose=False, logger=None
            )
            print(f"      ✅ {nombre_clip}")
            clips_creados.append(("ACCION", nombre_clip))
        except Exception as e:
            print(f"      ❌ Error: {str(e)[:60]}")

        return clips_creados

    except Exception as e:
        print(f"   ❌ Error al analizar: {str(e)}")
        return []

# ============================================================
# MAIN
# ============================================================
print(f"\n📁 Buscando videos en: {MATERIAL_PRIMO_DIR}")

# Buscar videos en material_primo
videos = [f for f in os.listdir(MATERIAL_PRIMO_DIR) if f.endswith('.mp4')]

if not videos:
    print("⚠️  No hay videos en material_primo/")
    print(f"\n📝 Instrucciones:")
    print(f"   1. Sube videos a: {MATERIAL_PRIMO_DIR}")
    print(f"   2. Ejecuta este script nuevamente")
    sys.exit(0)

print(f"✅ Encontrados {len(videos)} video(s)")

# Procesar cada video
total_clips = 0
for video_file in videos:
    video_path = os.path.join(MATERIAL_PRIMO_DIR, video_file)
    clips = analizar_video(video_path)
    total_clips += len(clips)

# ============================================================
# RESUMEN
# ============================================================
print("\n" + "=" * 70)
print("✅ ANÁLISIS COMPLETADO")
print("=" * 70)

print("\n📁 Clips organizados por AIDA:")
for categoria, desc in CATEGORIAS.items():
    carpeta = os.path.join(CLIPS_DIR, categoria)
    if os.path.exists(carpeta):
        clips = [f for f in os.listdir(carpeta) if f.endswith('.mp4')]
        if clips:
            print(f"\n🎬 {categoria}")
            print(f"   {desc}")
            for clip in clips:
                print(f"   ✅ {clip}")

print(f"\n📊 Total de clips creados: {total_clips}")
print("=" * 70)

print("\n🎯 PRÓXIMO PASO:")
print("   1. Revisa los clips en las carpetas AIDA")
print("   2. Elige los mejores clips para tu video")
print("   3. Usa el selector de clips para armar tu video final")
print("=" * 70)
