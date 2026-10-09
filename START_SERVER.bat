@echo off
cd /d "%~dp0"
echo.
echo 🎬 Starting Video Generator Server...
echo.
node api/index.js
pause
