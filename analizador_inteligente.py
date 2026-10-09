#!/usr/bin/env python3
"""
ANALIZADOR INTELIGENTE DE VIDEOS
Divide dinámicamente según duración y asigna a AIDA
"""

import os
import sys
import subprocess
from pathlib import Path

subprocess.run([sys.executable, "-m", "pip", "install", "-q", "moviepy"], check=False)

try:
    from moviepy import VideoFileClip
except ImportError:
    print("❌ moviepy no disponible")
    sys.exit(1)

PROJECT_DIR = r"C:\EDITOR_VIDEOS_BUEN_CERDITO"
MATERIAL_PRIMO_DIR = os.path.join(PROJECT_DIR, "material_primo")
CLIPS_DIR = os.path.join(PROJECT_DIR, "clips_aida")

os.chdir(PROJECT_DIR)

print("=" * 70)
print("🎬 ANALIZADOR INTELIGENTE - MÉTODO AIDA DINÁMICO")
print("=" * 70)

# ============================================================
# FUNCIÓN: Analizar y dividir dinámicamente
# ============================================================
def analizar_video_inteligente(video_path):
    """Divide video inteligentemente según duración"""

    nombre_video = os.path.basename(video_path)
    print(f"\n📹 Analizando: {nombre_video}")

    try:
        video = VideoFileClip(video_path)
        duracion_total = video.duration

        print(f"   ⏱️  Duración total: {duracion_total:.1f} segundos")
        print(f"   📐 Resolución: {video.w}x{video.h}")

        # ============================================================
        # ESTRATEGIA DE DIVISIÓN INTELIGENTE
        # ============================================================

        duracion_clip = 7  # Duración ideal de cada clip (segundos)
        num_clips_total = int(duracion_total / duracion_clip)

        # Mínimo 4 clips (para AIDA completo)
        if num_clips_total < 4:
            num_clips_total = 4
            duracion_clip = duracion_total / 4

        print(f"\n   📊 Estrategia:")
        print(f"      • Duración por clip: {duracion_clip:.1f}s")
        print(f"      • Total de clips: {num_clips_total}")

        # ============================================================
        # ASIGNACIÓN DINÁMICA A CATEGORÍAS AIDA
        # ============================================================

        # Dividir en 4 secciones para AIDA
        clips_por_categoria = num_clips_total // 4
        if clips_por_categoria < 1:
            clips_por_categoria = 1

        print(f"      • Por categoría AIDA: ~{clips_por_categoria} clips")

        categorias = [
            {
                "nombre": "ATENCION_Hook",
                "icon": "🎯",
                "desc": "Captura atención",
                "num_clips": clips_por_categoria
            },
            {
                "nombre": "INTERES_Producto",
                "icon": "📦",
                "desc": "Muestra producto",
                "num_clips": clips_por_categoria
            },
            {
                "nombre": "DESEO_Emocion",
                "icon": "❤️",
                "desc": "Crea emoción",
                "num_clips": clips_por_categoria
            },
            {
                "nombre": "ACCION_CTA",
                "icon": "📞",
                "desc": "Call-to-action",
                "num_clips": max(1, num_clips_total - (clips_por_categoria * 3))
            }
        ]

        # ============================================================
        # CREAR LOS CLIPS
        # ============================================================

        clips_creados = []
        clip_contador = 0

        for cat_idx, categoria in enumerate(categorias):
            print(f"\n   {categoria['icon']} {categoria['nombre']}")
            print(f"      {categoria['desc']} ({categoria['num_clips']} clips)")

            # Calcular rango de tiempo para esta categoría
            inicio_cat = (cat_idx * duracion_total) / 4
            fin_cat = ((cat_idx + 1) * duracion_total) / 4

            # Crear clips dentro de esta sección
            for clip_idx in range(categoria['num_clips']):
                clip_contador += 1

                # Calcular tiempo de inicio y fin del clip
                inicio = inicio_cat + (clip_idx * (fin_cat - inicio_cat) / categoria['num_clips'])
                fin = min(inicio + duracion_clip, fin_cat)
                duracion_clip_real = fin - inicio

                try:
                    # Extraer clip
                    clip = video[inicio:fin]

                    # Nombre del clip
                    nombre_clip = (
                        f"{clip_contador:02d}_{categoria['nombre']}_"
                        f"{int(duracion_clip_real)}seg.mp4"
                    )

                    # Ruta de guardado
                    carpeta_cat = os.path.join(CLIPS_DIR, categoria['nombre'])
                    ruta_clip = os.path.join(carpeta_cat, nombre_clip)

                    # Asegurar que existe la carpeta
                    os.makedirs(carpeta_cat, exist_ok=True)

                    print(f"      ✅ [{clip_contador}/{num_clips_total}] {nombre_clip}")

                    # Exportar clip
                    clip.write_videofile(
                        ruta_clip,
                        fps=24,
                        codec='libx264',
                        audio_codec='aac',
                        verbose=False,
                        logger=None
                    )

                    clips_creados.append({
                        'nombre': nombre_clip,
                        'categoria': categoria['nombre'],
                        'duracion': duracion_clip_real,
                        'tamaño': os.path.getsize(ruta_clip) / (1024*1024)
                    })

                except Exception as e:
                    print(f"      ❌ Error: {str(e)[:60]}")

        return clips_creados, num_clips_total, duracion_total

    except Exception as e:
        print(f"   ❌ Error al analizar: {str(e)}")
        return [], 0, 0

# ============================================================
# MAIN
# ============================================================

print(f"\n📁 Buscando videos en: {MATERIAL_PRIMO_DIR}")

# Buscar videos
videos = [f for f in os.listdir(MATERIAL_PRIMO_DIR) if f.endswith(('.mp4', '.mov'))]

if not videos:
    print("⚠️  No hay videos en material_primo/")
    print(f"   Coloca tu video aquí: {MATERIAL_PRIMO_DIR}")
    sys.exit(0)

print(f"✅ Encontrados {len(videos)} video(s)")

# Procesar cada video
total_clips_creados = 0
for video_file in videos:
    video_path = os.path.join(MATERIAL_PRIMO_DIR, video_file)
    clips, num_clips, duracion = analizar_video_inteligente(video_path)
    total_clips_creados += len(clips)

# ============================================================
# RESUMEN FINAL
# ============================================================

print("\n" + "=" * 70)
print("✅ ANÁLISIS COMPLETADO - SISTEMA INTELIGENTE")
print("=" * 70)

# Listar clips por categoría
categorias_nombres = [
    "ATENCION_Hook",
    "INTERES_Producto",
    "DESEO_Emocion",
    "ACCION_CTA"
]

for cat_nombre in categorias_nombres:
    carpeta = os.path.join(CLIPS_DIR, cat_nombre)
    if os.path.exists(carpeta):
        clips = [f for f in os.listdir(carpeta) if f.endswith('.mp4')]
        if clips:
            icono = "🎯" if "ATENCION" in cat_nombre else \
                   "📦" if "INTERES" in cat_nombre else \
                   "❤️" if "DESEO" in cat_nombre else "📞"

            print(f"\n{icono} {cat_nombre}")
            for clip in sorted(clips):
                ruta = os.path.join(carpeta, clip)
                size = os.path.getsize(ruta) / (1024*1024)
                print(f"   ✅ {clip} ({size:.2f}MB)")

print(f"\n📊 TOTAL: {total_clips_creados} clips creados")
print("=" * 70)

print("\n🎯 PRÓXIMO PASO:")
print("   1. Abre la interfaz visual")
print("   2. Selecciona tus mejores clips")
print("   3. Genera tu video personalizado")
print("=" * 70)
