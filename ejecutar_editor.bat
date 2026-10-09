@echo off
chcp 65001 >nul
title Editor de Videos - El Buen Cerdito
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║       🎬 EDITOR DE VIDEOS - EL BUEN CERDITO 🎬              ║
echo ║    Paso 1: Cortar | Paso 2: Editar | Paso 3: Finalizar       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python no está instalado o no está en PATH
    echo.
    echo Soluciones:
    echo 1. Descarga Python desde python.org
    echo 2. AL INSTALAR: Marca "Add Python to PATH"
    echo 3. Reinicia tu PC
    echo 4. Vuelve a ejecutar este archivo
    echo.
    pause
    exit /b 1
)

echo ✅ Python detectado
echo.

REM Verificar si moviepy está instalado
python -c "import moviepy" >nul 2>&1
if errorlevel 1 (
    echo ⏳ Instalando librería moviepy...
    pip install moviepy
    if errorlevel 1 (
        echo ❌ Error al instalar moviepy
        pause
        exit /b 1
    )
)

echo ✅ Librería moviepy disponible
echo.

REM Ejecutar el script
echo ⏳ Ejecutando script de edición...
echo.

python crear_video_completo.py

if errorlevel 1 (
    echo.
    echo ❌ Error durante la edición
    pause
    exit /b 1
)

echo.
echo ✅ ¡PROCESO COMPLETADO!
echo.
echo 📁 Archivo generado:
echo    C:\EDITOR_VIDEOS_BUEN_CERDITO\video_final.mp4
echo.
pause
