' INSTALADOR RÁPIDO - Analizador AIDA
' Haz doble clic para instalar como aplicación de escritorio

Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Detectar ubicación
strPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
strAppDir = objShell.ExpandEnvironmentStrings("%PROGRAMFILES%") & "\Analizador AIDA"
strDesktop = objShell.ExpandEnvironmentStrings("%USERPROFILE%") & "\Desktop"
strStartMenu = objShell.ExpandEnvironmentStrings("%APPDATA%") & "\Microsoft\Windows\Start Menu\Programs\Analizador AIDA"

' Crear directorio
If Not objFSO.FolderExists(strAppDir) Then
    objFSO.CreateFolder(strAppDir)
End If

' Copiar archivos
If objFSO.FolderExists(strPath) Then
    objShell.Run "xcopy """ & strPath & "\*.py"" """ & strAppDir & """ /Y /Q", 0, True
    objShell.Run "xcopy """ & strPath & "\*.bat"" """ & strAppDir & """ /Y /Q", 0, True
    objShell.Run "xcopy """ & strPath & "\*.html"" """ & strAppDir & """ /Y /Q", 0, True
End If

' Crear acceso directo Escritorio
Set objLink = objShell.CreateShortcut(strDesktop & "\Analizador AIDA.lnk")
objLink.TargetPath = "chrome.exe"
objLink.Arguments = """file:///" & strAppDir & "/app_pwa.html"""
objLink.WorkingDirectory = strAppDir
objLink.IconLocation = "C:\Windows\System32\shell32.dll,23"
objLink.Save

' Crear carpeta Menú Inicio
If Not objFSO.FolderExists(strStartMenu) Then
    objFSO.CreateFolder(strStartMenu)
End If

' Crear acceso directo Menú Inicio
Set objLink = objShell.CreateShortcut(strStartMenu & "\Analizador AIDA.lnk")
objLink.TargetPath = "chrome.exe"
objLink.Arguments = """file:///" & strAppDir & "/app_pwa.html"""
objLink.WorkingDirectory = strAppDir
objLink.IconLocation = "C:\Windows\System32\shell32.dll,23"
objLink.Save

' Mensaje de éxito
objShell.Popup "✅ Analizador AIDA instalado correctamente!" & vbCrLf & vbCrLf & _
"📍 Ubicación: " & strAppDir & vbCrLf & _
"🎯 Acceso: Escritorio o Menú Inicio", 0, "Instalación Completada", 64
