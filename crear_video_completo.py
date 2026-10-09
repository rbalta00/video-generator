"""
CREAR VIDEO COMPLETO - EL BUEN CERDITO
=====================================
1. Corta videos a clips de 7 segundos
2. Agrega textos AIDA
3. Agrega música
4. Genera video final para Facebook
"""

from moviepy.editor import (
    VideoFileClip, TextClip, CompositeVideoClip,
    AudioFileClip, concatenate_videoclips
)
import os
import shutil

print("""
╔════════════════════════════════════════════════════════════════╗
║       🎬 CREAR VIDEO COMPLETO - EL BUEN CERDITO 🎬          ║
║    Paso 1: Cortar | Paso 2: Editar | Paso 3: Finalizar       ║
╚════════════════════════════════════════════════════════════════╝
""")

# ═══════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════

INPUT_FOLDER = "videos_originales"
TEMP_FOLDER = "videos_cortados"
OUTPUT = "video_final.mp4"

DURACION_POR_CLIP = 7  # segundos
INICIO_CLIP = 5  # empezar desde segundo 5

# Textos AIDA
TEXTOS_AIDA = {
    "atencion": "🐷 ¡MIRA ESTO!",
    "interes": "Cemitas hechas como en casa",
    "deseo": "Frescas, deliciosas, irresistibles",
    "accion": "Pide: +52 222 278 1310"
}

FONT_SIZE = 70
FONT_COLOR = 'white'

MUSICA_ARCHIVO = "musica_fondo.mp3"

# ═══════════════════════════════════════════════════════════════
# PASO 1: CORTAR VIDEOS
# ═══════════════════════════════════════════════════════════════

print("\n" + "="*60)
print("PASO 1: CORTANDO VIDEOS")
print("="*60 + "\n")

os.makedirs(TEMP_FOLDER, exist_ok=True)

# Limpiar carpeta anterior
for f in os.listdir(TEMP_FOLDER):
    os.remove(os.path.join(TEMP_FOLDER, f))

videos = sorted([f for f in os.listdir(INPUT_FOLDER) if f.endswith('.mp4')])

if not videos:
    print(f"❌ No hay videos en {INPUT_FOLDER}/")
    exit()

print(f"📁 {len(videos)} videos encontrados\n")

clip_numero = 1

for video_file in videos:
    video_path = os.path.join(INPUT_FOLDER, video_file)

    print(f"🎬 {video_file}")

    try:
        video = VideoFileClip(video_path)
        duracion_total = video.duration

        # Calcular punto de inicio
        inicio = min(INICIO_CLIP, duracion_total - DURACION_POR_CLIP)
        fin = inicio + DURACION_POR_CLIP

        if fin > duracion_total:
            fin = duracion_total
            inicio = max(0, fin - DURACION_POR_CLIP)

        # Cortar
        clip_cortado = video.subclip(inicio, fin)

        # Guardar
        output_file = os.path.join(TEMP_FOLDER, f"{clip_numero}.mp4")

        print(f"   ✂️  Cortando: {inicio:.1f}s - {fin:.1f}s")
        print(f"   💾 Guardando...")

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

# ═══════════════════════════════════════════════════════════════
# PASO 2: EDITAR CON AIDA
# ═══════════════════════════════════════════════════════════════

print("\n" + "="*60)
print("PASO 2: EDITANDO CON MÉTODO AIDA")
print("="*60 + "\n")

# Cargar clips cortados
clips_cortados = sorted([f for f in os.listdir(TEMP_FOLDER) if f.endswith('.mp4')])

if not clips_cortados:
    print("❌ No hay clips cortados")
    exit()

print(f"📁 {len(clips_cortados)} clips encontrados\n")

clips = []
for clip_file in clips_cortados:
    path = os.path.join(TEMP_FOLDER, clip_file)
    try:
        clip = VideoFileClip(path)
        clips.append(clip)
        print(f"✅ {clip_file} ({clip.duration:.1f}s)")
    except Exception as e:
        print(f"❌ Error en {clip_file}: {e}")

if not clips:
    print("❌ No se pudieron cargar los clips")
    exit()

# Redimensionar todos
w, h = clips[0].size
print(f"\n📐 Resolución: {w}x{h}")

clips_resized = []
for clip in clips:
    if clip.size != (w, h):
        clip_resized = clip.resize(width=w, height=h)
    else:
        clip_resized = clip
    clips_resized.append(clip_resized)

# Juntar videos
print("\n⏳ Juntando videos...")
video_final = concatenate_videoclips(clips_resized)
print(f"✅ Video concatenado: {video_final.duration:.1f}s")

# Agregar textos AIDA
print("\n⏳ Agregando textos AIDA...")

duracion_total = video_final.duration
duracion_por_seccion = duracion_total / 4

textos_clips = []

# ATENCIÓN
txt1 = (TextClip(TEXTOS_AIDA["atencion"],
                 fontsize=FONT_SIZE,
                 color=FONT_COLOR,
                 font='Arial-Bold',
                 method='caption',
                 size=(w, h))
        .set_duration(duracion_por_seccion)
        .set_start(0))
textos_clips.append(txt1)
print(f"✅ Atención: {TEXTOS_AIDA['atencion']}")

# INTERÉS
txt2 = (TextClip(TEXTOS_AIDA["interes"],
                 fontsize=FONT_SIZE,
                 color=FONT_COLOR,
                 font='Arial-Bold',
                 method='caption',
                 size=(w, h))
        .set_duration(duracion_por_seccion)
        .set_start(duracion_por_seccion))
textos_clips.append(txt2)
print(f"✅ Interés: {TEXTOS_AIDA['interes']}")

# DESEO
txt3 = (TextClip(TEXTOS_AIDA["deseo"],
                 fontsize=FONT_SIZE,
                 color=FONT_COLOR,
                 font='Arial-Bold',
                 method='caption',
                 size=(w, h))
        .set_duration(duracion_por_seccion)
        .set_start(duracion_por_seccion * 2))
textos_clips.append(txt3)
print(f"✅ Deseo: {TEXTOS_AIDA['deseo']}")

# ACCIÓN
txt4 = (TextClip(TEXTOS_AIDA["accion"],
                 fontsize=FONT_SIZE,
                 color=FONT_COLOR,
                 font='Arial-Bold',
                 method='caption',
                 size=(w, h))
        .set_duration(duracion_por_seccion)
        .set_start(duracion_por_seccion * 3))
textos_clips.append(txt4)
print(f"✅ Acción: {TEXTOS_AIDA['accion']}")

# Componer con textos
print("\n⏳ Componiendo video con textos...")
video_con_textos = CompositeVideoClip([video_final] + textos_clips)

# Agregar música
if os.path.exists(MUSICA_ARCHIVO):
    print("\n⏳ Agregando música...")
    try:
        musica = AudioFileClip(MUSICA_ARCHIVO)
        musica = musica.volumex(0.5)
        video_final_con_audio = video_con_textos.set_audio(musica)
        print(f"✅ Música agregada")
    except Exception as e:
        print(f"⚠️  Error con música: {e}")
        video_final_con_audio = video_con_textos
else:
    print("\n⚠️  Música no encontrada, continuando sin ella")
    video_final_con_audio = video_con_textos

# ═══════════════════════════════════════════════════════════════
# PASO 3: EXPORTAR
# ═══════════════════════════════════════════════════════════════

print("\n" + "="*60)
print("PASO 3: EXPORTANDO VIDEO FINAL")
print("="*60 + "\n")

print(f"📁 Archivo: {OUTPUT}")
print(f"⏱️  Duración: {video_final_con_audio.duration:.1f}s")
print(f"📐 Resolución: {w}x{h}")
print(f"⏳ Procesando... (puede tomar unos minutos)\n")

try:
    video_final_con_audio.write_videofile(
        OUTPUT,
        fps=24,
        codec='libx264',
        audio_codec='aac',
        verbose=False,
        logger=None
    )

    print("\n" + "="*60)
    print("✅ ¡VIDEO LISTO!")
    print("="*60)
    print(f"📁 Guardado en: {OUTPUT}")
    print(f"📊 Tamaño: {os.path.getsize(OUTPUT) / (1024*1024):.1f} MB")
    print(f"⏱️  Duración: {video_final_con_audio.duration:.1f}s")
    print("\n🚀 ¡LISTO PARA FACEBOOK ADS!")
    print("\nÓptimo para:")
    print("  ✅ Facebook Ads")
    print("  ✅ Instagram Reels")
    print("  ✅ TikTok")
    print("  ✅ YouTube Shorts")

except Exception as e:
    print(f"\n❌ Error al exportar: {e}")
    exit(1)

# Limpiar
print("\n🧹 Limpiando recursos...")
video_final.close()

print("\n" + "="*60)
print("¡PROCESO COMPLETADO EXITOSAMENTE!")
print("="*60)
