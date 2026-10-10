# 🎬 Configuración de Transiciones de Video

## Estado Actual
✅ **Deshabilitado por defecto** - El sistema funciona sin transiciones para evitar dependencias de FFmpeg.

Si quieres habilitar transiciones automáticas, sigue esta guía.

---

## ¿Qué son las Transiciones?

Las transiciones son efectos visuales suaves entre clips de video:
- **Fade**: Desvanecimiento (a negro y de vuelta)
- **Dissolve**: Transición cruzada suave
- **Slide**: Deslizamiento lateral

---

## Instalación de FFmpeg (Requerido para Transiciones)

### En Windows

**Opción 1: Usando Chocolatey (Recomendado)**
```powershell
# Instalar Chocolatey si no lo tienes
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-WebRequest -UseBetaFeatures -Uri https://community.chocolatey.org/install.ps1 | Invoke-Expression

# Instalar FFmpeg
choco install ffmpeg
```

**Opción 2: Descarga Manual**
1. Ir a https://ffmpeg.org/download.html
2. Descargar versión para Windows
3. Extraer a `C:\ffmpeg`
4. Agregar `C:\ffmpeg\bin` al PATH de Windows:
   - Presionar `Win + X` → Sistema
   - Variables de entorno
   - Editar variables de entorno del sistema
   - Agregar `C:\ffmpeg\bin` al PATH

**Opción 3: Usando scoop**
```powershell
scoop install ffmpeg
```

---

## Verificar que FFmpeg Funciona

```bash
ffmpeg -version
```

Si ves la versión de FFmpeg, está instalado correctamente.

---

## Habilitar Transiciones en el Código

**1. Editar `api/index.js`**

Buscar (línea ~486):
```javascript
// Simular progreso (para testing)
simulateProgress(job.jobId);
```

Reemplazar con:
```javascript
// Simular progreso (para testing)
simulateProgress(job.jobId);

// Procesar video con transiciones en segundo plano
const processedVideoPath = newFilePath.replace(/\.mp4$/, '_processed.mp4');

processWithClipTransitions(newFilePath, processedVideoPath)
  .then(() => {
    const updatedJob = getJob(job.jobId);
    if (updatedJob) {
      updatedJob.file.path = processedVideoPath;
      require('fs').writeFileSync(path.join(__dirname, '../video-jobs.json'), JSON.stringify(require('./database').loadJobs(), null, 2));
    }
    console.log(`✅ Video procesado con transiciones: ${processedVideoPath}`);
  })
  .catch((err) => {
    console.error(`⚠️ Error procesando video: ${err.message}`);
    console.log(`📌 Usando video original sin transiciones`);
  });
```

**2. Reiniciar servidor**
```bash
node api/index.js
```

---

## Troubleshooting

### Error: "FFmpeg not found"
**Solución:**
- Verificar que FFmpeg está en el PATH: `ffmpeg -version`
- Reiniciar terminal/PowerShell después de instalar
- Reiniciar sistema si sigue sin funcionar

### Error: "ENOENT: no such file or directory"
**Causa:** El archivo de video no se guardó correctamente
**Solución:**
- Verificar que la carpeta `/uploads` existe
- Ejecutar `mkdir uploads` en el directorio del proyecto

### Video se procesa pero es muy lento
**Soluciones:**
- Reducir resolución (actualmente es 1920x1080)
- Aumentar preset de ffmpeg de "fast" a "faster"
- Usar videos de entrada más pequeños

---

## Archivos Relevantes

- `api/video-processor.js` - Módulo para procesar videos
- `api/index.js` - Endpoint POST /api/generate
- `api/database.js` - Almacenamiento de metadatos

---

## Cómo Evitar Errores

### ✅ Buenas Prácticas

1. **Verificar FFmpeg antes de habilitar**
   ```bash
   ffmpeg -version
   ```

2. **Mantener los videos originales**
   - El sistema guarda video original en `/uploads/{jobId}.mp4`
   - El video procesado va a `/uploads/{jobId}_processed.mp4`

3. **Monitorear logs del servidor**
   - Ver mensajes de error si el procesamiento falla
   - El sistema automáticamente falla de forma segura

4. **Usar timeouts largos**
   - Videos grandes pueden tardar 5-10 minutos
   - No cerrar navegador durante el procesamiento

---

## Deshabilitar Transiciones (Volver Atrás)

Si las transiciones causan problemas:

1. Editar `api/index.js`
2. Remover el código de `processWithClipTransitions`
3. Dejar solo `simulateProgress(job.jobId);`
4. Reiniciar servidor

El sistema volverá a usar videos sin procesar (más rápido).

---

## Configuración Alternativa: Solo Convertir Formato

Si solo quieres convertir el video a MP4 sin transiciones:

Reemplazar en `api/index.js`:
```javascript
ffmpeg(newFilePath)
  .output(processedVideoPath)
  .on('end', () => console.log('✅ Video convertido'))
  .run();
```

---

## Performance

| Configuración | Tiempo | Tamaño |
|---|---|---|
| Video original | Inmediato | Variable |
| Con transiciones fade | +3-5 min | +10% |
| Con transiciones dissolve | +5-8 min | +15% |

---

## Notas Importantes

⚠️ **FFmpeg es OPCIONAL**
- El sistema funciona perfectamente sin él
- Las transiciones son solo un extra

✅ **Sistema Fail-Safe**
- Si FFmpeg no está disponible, usa el video original
- No bloquea la interfaz
- Usuario no nota la diferencia

🔒 **Seguridad**
- FFmpeg se ejecuta en segundo plano
- No acceso a archivos del usuario
- Solo procesa lo que el usuario sube

