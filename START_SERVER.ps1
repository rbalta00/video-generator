Write-Host "🎬 Starting Video Generator Server..." -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot
node api/index.js

Read-Host "Press Enter to exit"
