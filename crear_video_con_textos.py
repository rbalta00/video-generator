#!/usr/bin/env python3
"""
Script para crear video con textos AIDA superpuestos usando ffmpeg
El Buen Cerdito - Video 2 CON TEXTOS
"""

import subprocess
import os
import json
from pathlib import Path

# Configuración del proyecto
PROJECT_DIR = r"C:\EDITOR_VIDEOS_BUEN_CERDITO"
OUTPUT_VIDEO = os.path.join(PROJECT_DIR, "video_final_con_textos.mp4")
INPUT_VIDEO = os.path.join(PROJECT_DIR, "video_final.mp4")

# Configuración AIDA
TEXTOS_AIDA = [
    {
        "texto": "🐷 ¡MIRA ESTO!",
        "inicio": 0,
        "fin": 5.2,
        "x": "w/2",
        "y": "h/2-100"
    },
    {
        "texto": "Cemitas hechas como en casa",
        "inicio": 5.2,
        "fin": 10.5,
        "x": "w/2",
        "y": "h/2-100"
    },
    {
        "texto": "Frescas, deliciosas, irresistibles",
        "inicio": 10.5,
        "fin": 15.8,
        "x": "w/2",
        "y": "h/2-100"
    },
    {
        "texto": "Pide: +52 222 278 1310",
        "inicio": 15.8,
        "fin": 21,
        "x": "w/2",
        "y": "h/2+50"
    }
]

def crear_filtro_texto():
    """Crea el filtro de texto para ffmpeg"""
    filtros = []

    for i, item in enumerate(TEXTOS_AIDA):
        texto = item["texto"]
        inicio = item["inicio"]
        fin = item["fin"]

        # Escapar comillas para ffmpeg
        texto_escapado = texto.replace("'", "\\'").replace('"', '\\"')

        # Crear filtro drawtext para este texto
        filtro = (
            f"drawtext="
            f"text='{texto_escapado}'"
            f":fontfile='C\\:/Windows/Fonts/arial.ttf'"
            f":fontsize=70"
            f":fontcolor=white"
            f":x=(w-text_w)/2"
            f":y=(h-text_h)/2-80"
            f":enable='between(t,{inicio},{fin})'"
            f":borderw=3"
            f":bordercolor=black"
        )
        filtros.append(filtro)

    # Combinar todos los filtros
    return ",".join(filtros)

def crear_video_con_textos():
    """Crea el video con textos AIDA usando ffmpeg"""

    print("=" * 60)
    print("🎬 CREANDO VIDEO CON TEXTOS AIDA")
    print("=" * 60)

    # Verificar que el video original existe
    if not os.path.exists(INPUT_VIDEO):
        print(f"❌ ERROR: No encontré {INPUT_VIDEO}")
        return False

    print(f"📹 Video de entrada: {INPUT_VIDEO}")
    print(f"📊 Tamaño: {os.path.getsize(INPUT_VIDEO) / 1024 / 1024:.2f} MB")

    # Crear filtro de texto
    filtro_texto = crear_filtro_texto()

    # Comando ffmpeg
    cmd = [
        "ffmpeg",
        "-i", INPUT_VIDEO,
        "-vf", filtro_texto,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        "-y",  # Sobrescribir sin preguntar
        OUTPUT_VIDEO
    ]

    print("\n⚙️  Ejecutando ffmpeg...")
    print(f"📝 Comando: {' '.join(cmd[:8])}...")

    try:
        resultado = subprocess.run(cmd, capture_output=True, text=True, timeout=300)

        if resultado.returncode != 0:
            print(f"\n❌ ERROR en ffmpeg:")
            print(resultado.stderr)
            return False

        # Verificar que se creó el archivo
        if os.path.exists(OUTPUT_VIDEO):
            tamaño = os.path.getsize(OUTPUT_VIDEO) / 1024 / 1024
            print(f"\n✅ VIDEO CREADO EXITOSAMENTE")
            print(f"📹 Archivo: {OUTPUT_VIDEO}")
            print(f"📊 Tamaño: {tamaño:.2f} MB")
            print(f"⏱️  Duración: 21 segundos")
            print(f"🎨 Textos AIDA: INCLUIDOS")
            return True
        else:
            print(f"\n❌ No se creó el archivo de salida")
            return False

    except subprocess.TimeoutExpired:
        print(f"\n❌ ERROR: El proceso tardó más de 5 minutos")
        return False
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    success = crear_video_con_textos()

    print("\n" + "=" * 60)
    if success:
        print("🎉 ¡ÉXITO! Tu video con textos está listo")
        print("=" * 60)
    else:
        print("❌ Error al crear el video")
        print("=" * 60)
