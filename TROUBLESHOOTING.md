# 🔧 Solución de Problemas - Video Generator

## Error más común: "Error al generar video"

### ❌ Causa Principal
El servidor Node.js se quedó colgado o el puerto 3000 ya está en uso.

### ✅ Solución Rápida

**En PowerShell:**
```powershell
# Matar todos los procesos node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Iniciar servidor limpio
cd C:\EDITOR_VIDEOS_BUEN_CERDITO
node api/index.js
```

**En CMD/Terminal:**
```bash
taskkill /F /IM node.exe
cd C:\EDITOR_VIDEOS_BUEN_CERDITO
node api/index.js
```

---

## Puerto 3000 en Uso

### Error
```
Error: listen EADDRINUSE: address already in use :::3000
```

### Solución

**1. Encontrar qué está usando el puerto:**
```powershell
netstat -ano | findstr :3000
```

**2. Matar el proceso:**
```powershell
# Reemplaza [PID] con el número del proceso
taskkill /PID [PID] /F

# O matar todos los node
taskkill /F /IM node.exe
```

**3. Reiniciar servidor:**
```bash
node api/index.js
```

---

## Checklist Rápido

Antes de subir un video, verifica:

- ✅ Servidor corriendo: `curl http://localhost:3000/api/health`
- ✅ No hay errores en la terminal
- ✅ La página carga correctamente
- ✅ Formulario muestra campos claros

Si alguno falla, reinicia el servidor:
```bash
taskkill /F /IM node.exe
node api/index.js
```

---

## Archivos Importantes

- `api/index.js` - Servidor principal
- `api/database.js` - Base de datos JSON
- `api/aida-analyzer.js` - Analizador AIDA
- `public/index.html` - Frontend
- `video-jobs.json` - Registro de trabajos

---

## Logs y Depuración

### Ver logs del servidor
```
Los logs aparecen en la terminal donde ejecutaste: node api/index.js
```

### Ver trabajos procesados
```bash
# Ver última línea del archivo de jobs
tail -1 video-jobs.json
```

### Probar un análisis AIDA
```bash
curl http://localhost:3000/api/analyze/1791592933192
```

---

## Errores Específicos

### "Video file not found"
**Problema:** El archivo de video no se guardó correctamente
**Solución:**
1. Verifica que exista la carpeta `uploads`
2. Reinicia el servidor
3. Sube el video nuevamente

### "FFmpeg not found"
**Problema:** Intentaste habilitar transiciones sin instalar FFmpeg
**Solución:**
- Ver `VIDEO_TRANSITIONS_SETUP.md`
- O deshabilita transiciones en el código

### "Timeout: El video tardó demasiado"
**Problema:** El procesamiento tomó más de 5 minutos
**Solución:**
1. Usa videos más pequeños (<100MB)
2. Aumenta el timeout en el código (línea ~497 en index.js)
3. Reinicia el servidor

---

## Reinicio Completo (Nuclear Option)

Si nada funciona:

```powershell
# 1. Matar todos los procesos
taskkill /F /IM node.exe

# 2. Eliminar archivos temporales
Remove-Item C:\EDITOR_VIDEOS_BUEN_CERDITO\uploads -Recurse -ErrorAction SilentlyContinue
Remove-Item C:\EDITOR_VIDEOS_BUEN_CERDITO\video-jobs.json -ErrorAction SilentlyContinue

# 3. Crear carpeta uploads de nuevo
mkdir C:\EDITOR_VIDEOS_BUEN_CERDITO\uploads -ErrorAction SilentlyContinue

# 4. Iniciar servidor limpio
cd C:\EDITOR_VIDEOS_BUEN_CERDITO
node api/index.js
```

---

## Verificar Salud del Sistema

```bash
# 1. ¿El servidor está corriendo?
curl http://localhost:3000/api/health

# 2. ¿Se puede validar archivos?
curl http://localhost:3000/api/validation-info

# 3. ¿Se puede acceder a la página?
curl http://localhost:3000

# 4. ¿Hay trabajos procesados?
ls -la C:\EDITOR_VIDEOS_BUEN_CERDITO\uploads
cat C:\EDITOR_VIDEOS_BUEN_CERDITO\video-jobs.json
```

Si todos responden con éxito (200 OK), el sistema está funcionando.

---

## Preguntas Frecuentes

**P: ¿Por qué se congela después de subir video?**
A: Probablemente el servidor se quedó sin memoria. Reinicia con `taskkill /F /IM node.exe`

**P: ¿Los videos se guardan dónde?**
A: En `C:\EDITOR_VIDEOS_BUEN_CERDITO\uploads\{jobId}.mp4`

**P: ¿Cómo borro todos los trabajos?**
A: Elimina `video-jobs.json` y reinicia el servidor (se recreará vacío)

**P: ¿Cómo veo el análisis AIDA?**
A: `curl http://localhost:3000/api/analyze/{jobId}` o mira en `GET /api/analyze/{jobId}`

---

## Soporte Rápido

1. **Primer intento:** Reinicia servidor
2. **Segundo intento:** Reinicio completo (ver arriba)
3. **Tercer intento:** Mira los logs en la terminal
4. **Cuarto intento:** Borra `video-jobs.json` y reinicia

Si nada funciona después de esto, hay un problema más profundo. Chequea:
- Node.js versión: `node --version` (debe ser ≥16)
- Espacio en disco: `dir C:` (debe tener >1GB libre)
- Permisos: asegúrate de tener permisos en C:\EDITOR_VIDEOS_BUEN_CERDITO

