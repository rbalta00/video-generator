@echo off
chcp 65001 >nul
title Crear Video - El Buen Cerdito
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║       🎬 CREADOR DE VIDEO - EL BUEN CERDITO 🎬              ║
echo ║         Cortando, editando y exportando...                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d "C:\EDITOR_VIDEOS_BUEN_CERDITO"

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python no está instalado
    pause
    exit /b 1
)

REM Ejecutar script
python hacer_video_ahora.py

REM Verificar si se creó el video
if exist "video_final.mp4" (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║               ✅ ¡PROCESO COMPLETADO!                          ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo 📁 El video está en:
    echo    C:\EDITOR_VIDEOS_BUEN_CERDITO\video_final.mp4
    echo.
) else (
    echo.
    echo ❌ El video NO se creó
    echo.
)

pause
