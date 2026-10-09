#!/usr/bin/env python3
import subprocess
import sys
subprocess.run([sys.executable, "-m", "pip", "install", "-q", "moviepy", "pillow"], check=False)

from moviepy import VideoFileClip, concatenate_videoclips, CompositeVideoClip, ColorClip, ImageClip
from PIL import Image, ImageDraw, ImageFont
import os
import tempfile

os.chdir(r"C:\EDITOR_VIDEOS_BUEN_CERDITO")

input_dir = "videos_originales"
output_file = "video_final.mp4"

# Cargar y cortar videos
videos = sorted([f for f in os.listdir(input_dir) if f.endswith('.mp4')])
print(f"Encontrados {len(videos)} videos")

clips = []
for vf in videos:
    path = os.path.join(input_dir, vf)
    v = VideoFileClip(path)
    dur = v.duration
    start = min(5, max(0, dur - 7))
    end = min(start + 7, dur)
    print(f"  {vf}: {start:.0f}s-{end:.0f}s")
    clip = v[start:end]
    clips.append(clip)

print("Concatenando videos...")
video = concatenate_videoclips(clips)
total_dur = video.duration
w, h = video.size
print(f"Duracion: {total_dur:.1f}s ({w}x{h})")

# Crear textos como imagenes
print("Creando textos AIDA...")
textos_aida = [
    ("🐷 ¡MIRA ESTO!", 0, total_dur/4),
    ("Cemitas hechas como en casa", total_dur/4, total_dur/2),
    ("Frescas, deliciosas, irresistibles", total_dur/2, 3*total_dur/4),
    ("Pide: +52 222 278 1310", 3*total_dur/4, total_dur)
]

txt_clips = []
for texto, start_t, end_t in textos_aida:
    print(f"  • {texto}")

    # Crear imagen con el texto
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Intentar cargar una fuente grande
    try:
        font = ImageFont.truetype("arial.ttf", 80)
    except:
        font = ImageFont.load_default()

    # Dibujar texto en el centro
    bbox = draw.textbbox((0, 0), texto, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (w - text_w) // 2
    y = (h - text_h) // 2

    draw.text((x, y), texto, font=font, fill=(255, 255, 255, 255))

    # Guardar imagen temporal
    import tempfile
    tmpdir = tempfile.gettempdir()
    temp_img = os.path.join(tmpdir, f"txt_{hash(texto)}.png")
    img.save(temp_img)

    # Crear clip de imagen
    txt_clip = ImageClip(temp_img).with_duration(end_t - start_t).with_start(start_t)
    txt_clips.append(txt_clip)

# Componer video con textos
print("Componiendo video con textos...")
final = CompositeVideoClip([video] + txt_clips)

# Exportar
print(f"Exportando {output_file}...")
final.write_videofile(output_file, fps=24, codec='libx264', audio_codec='aac')

if os.path.exists(output_file):
    size_mb = os.path.getsize(output_file) / (1024*1024)
    print(f"\n✅ VIDEO CON TEXTOS CREADO: {size_mb:.1f} MB")
else:
    print(f"\n❌ Error: {output_file} no se creo")
    sys.exit(1)
