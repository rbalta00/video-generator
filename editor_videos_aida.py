"""
EDITOR DE VIDEOS - EL BUEN CERDITO
===================================
Script para crear videos AIDA para Facebook Ads
Junta videos + agrega texto + música
"""

from moviepy.editor import (
    VideoFileClip, TextClip, CompositeVideoClip,
    AudioFileClip, concatenate_videoclips, ColorClip
)
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
import os
import sys

print("""
╔════════════════════════════════════════════════════════════════╗
║       🎬 EDITOR DE VIDEOS - EL BUEN CERDITO 🎬              ║
║    Método AIDA: Atención, Interés, Deseo, Acción              ║
╚════════════════════════════════════════════════════════════════╝
""")

# ═══════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════

# Ruta de videos (cambiar según tu carpeta)
VIDEOS_FOLDER = "videos_originales"
MUSICA_ARCHIVO = "musica_fondo.mp3"  # Tu archivo de música
OUTPUT = "video_final.mp4"

# Textos AIDA (puedes cambiarlos)
TEXTOS_AIDA = {
    "atencion": "🐷 ¡MIRA ESTO!",
    "interes": "Cemitas hechas como en casa",
    "deseo": "Frescas, deliciosas, irresistibles",
    "accion": "Pide por WhatsApp: +52 222 278 1310"
}

# Configuración de texto
FONT_SIZE = 70
FONT_COLOR = 'white'
FONT_NAME = 'Arial-Bold'
TEXT_DURATION = 2  # segundos por texto

# ═══════════════════════════════════════════════════════════════
# PASO 1: Verificar archivos
# ═══════════════════════════════════════════════════════════════

print("📁 Verificando archivos...\n")

if not os.path.exists(VIDEOS_FOLDER):
    print(f"❌ Carpeta '{VIDEOS_FOLDER}' no encontrada")
    print(f"📝 Crea una carpeta con tus videos en: {VIDEOS_FOLDER}")
    sys.exit(1)

videos = [f for f in os.listdir(VIDEOS_FOLDER) if f.endswith(('.mp4', '.avi', '.mov'))]

if not videos:
    print(f"❌ No hay videos en: {VIDEOS_FOLDER}")
    print("📝 Agrega videos en formatos: MP4, AVI, MOV")
    sys.exit(1)

print(f"✅ {len(videos)} videos encontrados:")
for i, v in enumerate(videos, 1):
    print(f"   {i}. {v}")

if os.path.exists(MUSICA_ARCHIVO):
    print(f"\n✅ Música encontrada: {MUSICA_ARCHIVO}")
    tiene_musica = True
else:
    print(f"\n⚠️  Música NO encontrada: {MUSICA_ARCHIVO}")
    print("   El video se creará SIN música")
    tiene_musica = False

# ═══════════════════════════════════════════════════════════════
# PASO 2: Cargar videos
# ═══════════════════════════════════════════════════════════════

print("\n⏳ Cargando videos...")

clips = []
for video in sorted(videos):
    path = os.path.join(VIDEOS_FOLDER, video)
    try:
        clip = VideoFileClip(path)
        clips.append(clip)
        print(f"   ✅ {video} ({clip.duration:.1f}s)")
    except Exception as e:
        print(f"   ❌ Error en {video}: {e}")

if not clips:
    print("❌ No se pudieron cargar los videos")
    sys.exit(1)

# ═══════════════════════════════════════════════════════════════
# PASO 3: Redimensionar todos a la misma resolución
# ═══════════════════════════════════════════════════════════════

print("\n⏳ Normalizando resolución...")

# Usar resolución del primer video
w, h = clips[0].size
print(f"   Resolución: {w}x{h}")

# Redimensionar todos al mismo tamaño
clips_resized = []
for clip in clips:
    if clip.size != (w, h):
        clip_resized = clip.resize(width=w, height=h)
    else:
        clip_resized = clip
    clips_resized.append(clip_resized)

# ═══════════════════════════════════════════════════════════════
# PASO 4: Juntar videos
# ═══════════════════════════════════════════════════════════════

print("\n⏳ Juntando videos...")

video_final = concatenate_videoclips(clips_resized)
print(f"   ✅ Video concatenado: {video_final.duration:.1f}s")

# ═══════════════════════════════════════════════════════════════
# PASO 5: Agregar textos AIDA
# ═══════════════════════════════════════════════════════════════

print("\n⏳ Agregando textos AIDA...")

# Calcular duración de cada sección
duracion_total = video_final.duration
duracion_por_seccion = duracion_total / 4

textos_clips = []

# ATENCIÓN (0-25%)
txt1 = (TextClip(TEXTOS_AIDA["atencion"],
                 fontsize=FONT_SIZE,
                 color=FONT_COLOR,
                 font=FONT_NAME,
                 method='caption',
                 size=(w, h))
        .set_duration(duracion_por_seccion)
        .set_start(0))
textos_clips.append(txt1)
print(f"   ✅ Atención: '{TEXTOS_AIDA['atencion']}'")

# INTERÉS (25-50%)
txt2 = (TextClip(TEXTOS_AIDA["interes"],
                 fontsize=FONT_SIZE,
                 color=FONT_COLOR,
                 font=FONT_NAME,
                 method='caption',
                 size=(w, h))
        .set_duration(duracion_por_seccion)
        .set_start(duracion_por_seccion))
textos_clips.append(txt2)
print(f"   ✅ Interés: '{TEXTOS_AIDA['interes']}'")

# DESEO (50-75%)
txt3 = (TextClip(TEXTOS_AIDA["deseo"],
                 fontsize=FONT_SIZE,
                 color=FONT_COLOR,
                 font=FONT_NAME,
                 method='caption',
                 size=(w, h))
        .set_duration(duracion_por_seccion)
        .set_start(duracion_por_seccion * 2))
textos_clips.append(txt3)
print(f"   ✅ Deseo: '{TEXTOS_AIDA['deseo']}'")

# ACCIÓN (75-100%)
txt4 = (TextClip(TEXTOS_AIDA["accion"],
                 fontsize=FONT_SIZE,
                 color=FONT_COLOR,
                 font=FONT_NAME,
                 method='caption',
                 size=(w, h))
        .set_duration(duracion_por_seccion)
        .set_start(duracion_por_seccion * 3))
textos_clips.append(txt4)
print(f"   ✅ Acción: '{TEXTOS_AIDA['accion']}'")

# ═══════════════════════════════════════════════════════════════
# PASO 6: Componer video + textos
# ═══════════════════════════════════════════════════════════════

print("\n⏳ Componiendo video con textos...")

video_con_textos = CompositeVideoClip([video_final] + textos_clips)

# ═══════════════════════════════════════════════════════════════
# PASO 7: Agregar música (si existe)
# ═══════════════════════════════════════════════════════════════

if tiene_musica:
    print("\n⏳ Agregando música...")

    try:
        musica = AudioFileClip(MUSICA_ARCHIVO)

        # Si la música es más corta que el video, repetirla
        if musica.duration < video_con_textos.duration:
            print(f"   ⚠️  Música ({musica.duration:.1f}s) más corta que video ({video_con_textos.duration:.1f}s)")
            print(f"   ℹ️  Se repetirá la música")

        # Ajustar volumen de la música (0.5 = 50% volumen)
        musica = musica.volumex(0.5)

        # Asignar audio
        video_final_con_audio = video_con_textos.set_audio(musica)
        print(f"   ✅ Música agregada")
    except Exception as e:
        print(f"   ❌ Error al agregar música: {e}")
        video_final_con_audio = video_con_textos
else:
    video_final_con_audio = video_con_textos

# ═══════════════════════════════════════════════════════════════
# PASO 8: Exportar video
# ═══════════════════════════════════════════════════════════════

print(f"\n⏳ Exportando video final...")
print(f"   📁 Archivo: {OUTPUT}")
print(f"   ⏱️  Duración: {video_final_con_audio.duration:.1f}s")
print(f"   📐 Resolución: {w}x{h}")
print(f"   ℹ️  Esto puede tomar algunos minutos...")

try:
    video_final_con_audio.write_videofile(
        OUTPUT,
        fps=24,
        codec='libx264',
        audio_codec='aac',
        verbose=False,
        logger=None
    )

    print(f"\n✅ ¡VIDEO LISTO!")
    print(f"   📁 Guardado en: {OUTPUT}")
    print(f"   📊 Tamaño: {os.path.getsize(OUTPUT) / (1024*1024):.1f} MB")
    print(f"\n🚀 Listo para publicar en Facebook Ads")

except Exception as e:
    print(f"\n❌ Error al exportar: {e}")
    sys.exit(1)

# ═══════════════════════════════════════════════════════════════
# Limpiar recursos
# ═══════════════════════════════════════════════════════════════

print("\n🧹 Limpiando recursos...")
video_final.close()
if tiene_musica:
    musica.close()

print("\n" + "="*60)
print("¡PROCESO COMPLETADO EXITOSAMENTE!")
print("="*60)
