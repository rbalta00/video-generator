@echo off
chcp 65001 >nul
title Diagnóstico - Editor de Videos
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              🔍 DIAGNÓSTICO DEL SISTEMA 🔍                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 1. Verificando Python...
python --version
if errorlevel 1 (
    echo ❌ PROBLEMA: Python no está instalado o no en PATH
    echo SOLUCIÓN: Descarga python.org e instala con "Add to PATH"
) else (
    echo ✅ Python OK
)
echo.

echo 2. Verificando ubicación actual...
cd /d "C:\EDITOR_VIDEOS_BUEN_CERDITO"
echo ✅ Carpeta actual: %CD%
echo.

echo 3. Verificando videos...
if exist "videos_originales\VOD_20260920_154053.mp4" (
    echo ✅ Video 1 encontrado
) else (
    echo ❌ Video 1 NO encontrado
)

if exist "videos_originales\VOD_20260920_160925.mp4" (
    echo ✅ Video 2 encontrado
) else (
    echo ❌ Video 2 NO encontrado
)

if exist "videos_originales\VOD_20260920_163521.mp4" (
    echo ✅ Video 3 encontrado
) else (
    echo ❌ Video 3 NO encontrado
)
echo.

echo 4. Verificando moviepy...
python -c "import moviepy; print('✅ moviepy instalado')" 2>nul
if errorlevel 1 (
    echo ❌ moviepy NO instalado
    echo SOLUCIÓN: Ejecutando: pip install moviepy
    pip install moviepy
) else (
    echo ✅ moviepy OK
)
echo.

echo 5. Intentando crear video de prueba...
python -c "
from moviepy.editor import VideoFileClip
try:
    video = VideoFileClip('videos_originales/VOD_20260920_154053.mp4')
    print(f'✅ Video cargado correctamente: {video.duration:.1f}s')
    video.close()
except Exception as e:
    print(f'❌ Error al cargar video: {e}')
"
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    DIAGNÓSTICO COMPLETADO                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Si todo dice ✅ - el problema está en el script
echo Si hay ❌ - sigue las soluciones indicadas
echo.
pause
