@echo off
chcp 65001 >nul
title 📹 Instalador - Analizador AIDA

echo.
echo ════════════════════════════════════════════════════════════
echo 📹 INSTALADOR - ANALIZADOR DE VIDEOS AIDA
echo ════════════════════════════════════════════════════════════
echo.

REM Verificar permisos de administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ ERROR: Se requieren permisos de Administrador
    echo.
    echo Haz clic derecho en este archivo y selecciona "Ejecutar como administrador"
    pause
    exit /b 1
)

echo ✅ Permisos de Administrador detectados
echo.

REM Variables
set "APP_DIR=%PROGRAMFILES%\Analizador AIDA"
set "DESKTOP=%USERPROFILE%\Desktop"
set "INICIO=%APPDATA%\Microsoft\Windows\Start Menu\Programs"
set "SOURCE_DIR=%~dp0"

echo 📋 Instalación comenzando...
echo.

REM Crear directorio de instalación
echo [1/5] 📁 Creando directorio de instalación...
if not exist "%APP_DIR%" mkdir "%APP_DIR%"
echo ✅ Directorio creado: %APP_DIR%

REM Copiar archivos
echo.
echo [2/5] 📂 Copiando archivos...
xcopy "%SOURCE_DIR%*.py" "%APP_DIR%" /Y /Q
xcopy "%SOURCE_DIR%*.bat" "%APP_DIR%" /Y /Q
xcopy "%SOURCE_DIR%material_primo" "%APP_DIR%material_primo\" /Y /Q /E
xcopy "%SOURCE_DIR%clips_aida" "%APP_DIR%clips_aida\" /Y /Q /E
echo ✅ Archivos copiados

REM Crear acceso directo en Escritorio
echo.
echo [3/5] 🔗 Creando acceso directo en Escritorio...

powershell -Command ^
"$ws = New-Object -ComObject WScript.Shell; ^
$s = $ws.CreateShortcut('%DESKTOP%\Analizador AIDA.lnk'); ^
$s.TargetPath = '%APP_DIR%\app_pwa.html'; ^
$s.WorkingDirectory = '%APP_DIR%'; ^
$s.IconLocation = 'C:\Windows\System32\shell32.dll,23'; ^
$s.Save()"

echo ✅ Acceso directo creado en Escritorio

REM Crear acceso directo en Menú Inicio
echo.
echo [4/5] 📌 Agregando a Menú Inicio...

if not exist "%INICIO%\Analizador AIDA" mkdir "%INICIO%\Analizador AIDA"

powershell -Command ^
"$ws = New-Object -ComObject WScript.Shell; ^
$s = $ws.CreateShortcut('%INICIO%\Analizador AIDA\Analizador AIDA.lnk'); ^
$s.TargetPath = '%APP_DIR%\app_pwa.html'; ^
$s.WorkingDirectory = '%APP_DIR%'; ^
$s.IconLocation = 'C:\Windows\System32\shell32.dll,23'; ^
$s.Save()"

echo ✅ Agregado a Menú Inicio

REM Crear script de desinstalación
echo.
echo [5/5] 🗑️ Creando programa de desinstalación...

(
echo @echo off
echo chcp 65001 ^>nul
echo title Desinstalador - Analizador AIDA
echo.
echo echo ¿Desinstalar Analizador AIDA?
echo pause
echo.
echo rmdir /s /q "%APP_DIR%"
echo del /q "%DESKTOP%\Analizador AIDA.lnk"
echo rmdir /s /q "%INICIO%\Analizador AIDA"
echo del /q "%%~f0"
echo.
echo echo ✅ Desinstalado correctamente
echo pause
) > "%APP_DIR%\DESINSTALAR_APP.bat"

echo ✅ Script de desinstalación creado

echo.
echo ════════════════════════════════════════════════════════════
echo ✅ INSTALACIÓN COMPLETADA
echo ════════════════════════════════════════════════════════════
echo.
echo 📍 Ubicación de instalación:
echo    %APP_DIR%
echo.
echo 🎯 Formas de acceder:
echo    1. Escritorio: "Analizador AIDA"
echo    2. Menú Inicio: Analizador AIDA
echo    3. Carpeta: %APP_DIR%
echo.
echo 📝 Próximos pasos:
echo    1. Abre: Analizador AIDA desde Escritorio o Menú Inicio
echo    2. Coloca tu video en: material_primo/
echo    3. Analiza y descarga clips
echo.
echo 🗑️ Para desinstalar:
echo    Ejecuta: DESINSTALAR_APP.bat en la carpeta de instalación
echo.
pause
