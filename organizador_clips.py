#!/usr/bin/env python3
"""
ORGANIZADOR DE CLIPS - Mueve automáticamente desde Descargas a AIDA
"""

import os
import shutil
from pathlib import Path

PROJECT_DIR = r"C:\EDITOR_VIDEOS_BUEN_CERDITO"
DESCARGAS = str(Path.home() / "Downloads")
CLIPS_DIR = os.path.join(PROJECT_DIR, "clips_aida")

CATEGORIAS = {
    "01_ATENCION": "ATENCION_Hook",
    "02_INTERES": "INTERES_Producto",
    "03_DESEO": "DESEO_Emocion",
    "04_ACCION": "ACCION_CTA"
}

print("=" * 70)
print("📁 ORGANIZADOR DE CLIPS - DESCARGAS → AIDA")
print("=" * 70)
print(f"\n📂 Monitoreando: {DESCARGAS}")
print(f"📂 Destino: {CLIPS_DIR}")

# Buscar clips en Descargas
archivos = os.listdir(DESCARGAS)
clips_encontrados = [f for f in archivos if f.endswith('.mp4') and ('ATENCION' in f or 'INTERES' in f or 'DESEO' in f or 'ACCION' in f)]

if not clips_encontrados:
    print("\n⚠️  No hay clips en Descargas/")
    print("   (Ejecuta primero: python analizador_inteligente.py)")
    exit()

print(f"\n✅ Encontrados {len(clips_encontrados)} clips")

# Mover cada clip
clips_movidos = 0
for clip in clips_encontrados:
    # Determinar categoría
    categoria_destino = None
    for prefijo, carpeta in CATEGORIAS.items():
        if clip.startswith(prefijo):
            categoria_destino = carpeta
            break

    if not categoria_destino:
        print(f"⚠️  {clip}: No se pudo determinar categoría")
        continue

    # Crear carpeta si no existe
    carpeta_destino = os.path.join(CLIPS_DIR, categoria_destino)
    os.makedirs(carpeta_destino, exist_ok=True)

    # Mover archivo
    origen = os.path.join(DESCARGAS, clip)
    destino = os.path.join(carpeta_destino, clip)

    try:
        shutil.move(origen, destino)
        size = os.path.getsize(destino) / (1024*1024)
        print(f"✅ {clip}")
        print(f"   → {categoria_destino}/ ({size:.2f}MB)")
        clips_movidos += 1
    except Exception as e:
        print(f"❌ Error moviendo {clip}: {e}")

print("\n" + "=" * 70)
print(f"✅ {clips_movidos}/{len(clips_encontrados)} clips organizados")
print("=" * 70)
