"""
CORTAR VIDEOS PARA FACEBOOK ADS
Extrae los mejores 5-7 segundos de cada video
"""

from moviepy.editor import VideoFileClip
import os

print("""
╔════════════════════════════════════════════════════════════════╗
║         🎬 CORTADOR DE VIDEOS - FACEBOOK ADS 🎬              ║
║         Extrayendo clips óptimos (5-7 seg cada uno)            ║
╚════════════════════════════════════════════════════════════════╝
""")

# Carpetas
INPUT_FOLDER = "videos_originales"
OUTPUT_FOLDER = "videos_cortados"

# Crear carpeta de salida
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Videos a procesar
videos = sorted([f for f in os.listdir(INPUT_FOLDER) if f.endswith('.mp4')])

if not videos:
    print("❌ No hay videos en videos_originales/")
    exit()

print(f"📁 {len(videos)} videos encontrados\n")

# Parámetros de corte
DURACION_POR_CLIP = 7  # segundos
INICIO_CLIP = 5  # empezar desde segundo 5 (para saltar intro)

clip_numero = 1

for video_file in videos:
    video_path = os.path.join(INPUT_FOLDER, video_file)

    print(f"🎬 Procesando: {video_file}")

    try:
        # Cargar video
        video = VideoFileClip(video_path)
        duracion_total = video.duration

        print(f"   ⏱️  Duración total: {duracion_total:.1f}s")

        # Calcular punto de inicio
        inicio = min(INICIO_CLIP, duracion_total - DURACION_POR_CLIP)
        fin = inicio + DURACION_POR_CLIP

        # Asegurar que no se pase del final
        if fin > duracion_total:
            fin = duracion_total
            inicio = max(0, fin - DURACION_POR_CLIP)

        # Cortar
        clip_cortado = video.subclip(inicio, fin)

        # Guardar
        output_file = os.path.join(OUTPUT_FOLDER, f"{clip_numero}.mp4")

        print(f"   ✂️  Cortando: {inicio:.1f}s - {fin:.1f}s ({fin-inicio:.1f}s)")
        print(f"   💾 Guardando: {output_file}")

        clip_cortado.write_videofile(
            output_file,
            verbose=False,
            logger=None,
            fps=24,
            codec='libx264',
            audio_codec='aac'
        )

        video.close()
        clip_cortado.close()

        print(f"   ✅ Completado\n")
        clip_numero += 1

    except Exception as e:
        print(f"   ❌ Error: {e}\n")

print("="*60)
print(f"✅ ¡CORTES COMPLETOS!")
print(f"📁 Videos cortados en: {OUTPUT_FOLDER}/")
print(f"📊 Total clips: {clip_numero - 1}")
print(f"⏱️  Duración total: {(clip_numero - 1) * DURACION_POR_CLIP}s")
print("="*60)
print("\n🚀 Ahora ejecuta:")
print("   python editor_videos_aida.py")
print("\n(El script usará automáticamente los videos de videos_cortados/)")
