#!/usr/bin/env python3
"""
Crear 3 variantes usando ffmpeg directamente
"""

import os
import subprocess

PROJECT_DIR = r"C:\EDITOR_VIDEOS_BUEN_CERDITO"
VIDEOS_ORIGINALES = os.path.join(PROJECT_DIR, "videos_originales")

VIDEO1 = os.path.join(VIDEOS_ORIGINALES, "VOD_20260920_154053.mp4")
VIDEO2 = os.path.join(VIDEOS_ORIGINALES, "VOD_20260920_160925.mp4")
VIDEO3 = os.path.join(VIDEOS_ORIGINALES, "VOD_20260920_163521.mp4")

print("=" * 70)
print("🎬 CREANDO 3 VARIANTES CON FFMPEG")
print("=" * 70)

# ============================================================
# VARIANTE 1: Corte diferente (10-17 segundos)
# ============================================================
print("\n[1/3] 📹 Variante 1: Corte diferente (10-17s)...")

concat_file = os.path.join(PROJECT_DIR, "concat_v1.txt")
with open(concat_file, "w") as f:
    f.write(f"file '{VIDEO1}'\n")
    f.write(f"file '{VIDEO2}'\n")
    f.write(f"file '{VIDEO3}'\n")

output_v1 = os.path.join(PROJECT_DIR, "video_variante_1_corte_diferente.mp4")

cmd_v1 = [
    "ffmpeg", "-f", "concat", "-safe", "0", "-i", concat_file,
    "-ss", "10", "-to", "17",
    "-c:v", "libx264", "-preset", "fast", "-crf", "23",
    "-c:a", "aac", "-b:a", "128k",
    "-y", output_v1
]

try:
    resultado = subprocess.run(cmd_v1, capture_output=True, text=True, timeout=300)
    if resultado.returncode == 0 and os.path.exists(output_v1):
        tamaño = os.path.getsize(output_v1) / 1024 / 1024
        print(f"   ✅ {tamaño:.2f} MB - Corte 10-17s creado")
    else:
        print(f"   ⚠️  Error: {resultado.stderr[:100]}")
except Exception as e:
    print(f"   ❌ {str(e)[:100]}")

# ============================================================
# VARIANTE 2: Con textos AIDA
# ============================================================
print("\n[2/3] 📝 Variante 2: Con textos AIDA...")

input_video = os.path.join(PROJECT_DIR, "video_final.mp4")
output_v2 = os.path.join(PROJECT_DIR, "video_variante_2_con_textos.mp4")

filtro_textos = (
    "drawtext="
    "text='🐷 MIRA ESTO'"
    ":fontfile='C\\\\:/Windows/Fonts/arial.ttf'"
    ":fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-80"
    ":enable='between(t,0,5.2)':borderw=2:bordercolor=black,"
    "drawtext="
    "text='Cemitas hechas como en casa'"
    ":fontfile='C\\\\:/Windows/Fonts/arial.ttf'"
    ":fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-60"
    ":enable='between(t,5.2,10.5)':borderw=2:bordercolor=black,"
    "drawtext="
    "text='Frescas, deliciosas, irresistibles'"
    ":fontfile='C\\\\:/Windows/Fonts/arial.ttf'"
    ":fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-60"
    ":enable='between(t,10.5,15.8)':borderw=2:bordercolor=black,"
    "drawtext="
    "text='Pide +52 222 278 1310'"
    ":fontfile='C\\\\:/Windows/Fonts/arial.ttf'"
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

try:
    resultado = subprocess.run(cmd_v2, capture_output=True, text=True, timeout=300)
    if resultado.returncode == 0 and os.path.exists(output_v2):
        tamaño = os.path.getsize(output_v2) / 1024 / 1024
        print(f"   ✅ {tamaño:.2f} MB - Textos AIDA superpuestos")
    else:
        print(f"   ⚠️  Error: {resultado.stderr[:100]}")
except Exception as e:
    print(f"   ❌ {str(e)[:100]}")

# ============================================================
# VARIANTE 3: Con música de fondo (si existe)
# ============================================================
print("\n[3/3] 🎵 Variante 3: Con música de fondo...")

musica = os.path.join(PROJECT_DIR, "musica_fondo.mp3")
output_v3 = os.path.join(PROJECT_DIR, "video_variante_3_con_musica.mp4")

if os.path.exists(musica):
    cmd_v3 = [
        "ffmpeg", "-i", input_video, "-i", musica,
        "-c:v", "copy", "-c:a", "aac",
        "-filter_complex", "[0:a]volume=0.6[a0];[1:a]volume=0.4[a1];[a0][a1]amix=inputs=2:duration=first[a]",
        "-map", "0:v", "-map", "[a]",
        "-shortest",
        "-y", output_v3
    ]

    try:
        resultado = subprocess.run(cmd_v3, capture_output=True, text=True, timeout=300)
        if resultado.returncode == 0 and os.path.exists(output_v3):
            tamaño = os.path.getsize(output_v3) / 1024 / 1024
            print(f"   ✅ {tamaño:.2f} MB - Música de fondo agregada")
        else:
            print(f"   ⚠️  Error: {resultado.stderr[:100]}")
    except Exception as e:
        print(f"   ❌ {str(e)[:100]}")
else:
    print(f"   ⚠️  Archivo musica_fondo.mp3 no encontrado, saltando...")

# ============================================================
# Resumen
# ============================================================
print("\n" + "=" * 70)
print("✅ VARIANTES PROCESADAS")
print("=" * 70)

archivos_esperados = [
    ("video_variante_1_corte_diferente.mp4", "Corte diferente (10-17s)"),
    ("video_variante_2_con_textos.mp4", "Con textos AIDA"),
    ("video_variante_3_con_musica.mp4", "Con música de fondo"),
]

total = 0
for archivo, desc in archivos_esperados:
    ruta = os.path.join(PROJECT_DIR, archivo)
    if os.path.exists(ruta):
        tamaño = os.path.getsize(ruta) / 1024 / 1024
        print(f"✅ {desc}: {tamaño:.2f} MB")
        total += 1
    else:
        print(f"⚠️  {desc}: Pendiente")

print(f"\n📊 {total}/3 variantes creadas")
print("=" * 70)
