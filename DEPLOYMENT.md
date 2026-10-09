# 🚀 Guía de Despliegue - Video Generator

## Arquitectura

```
Vercel (Frontend + API)  ←→  Railway (Backend Python)
   ↓                              ↓
express + Node.js           generador_videos_definitivo.py
   ↓                              ↓
Web UI + API REST           Video Processing + FFmpeg
```

---

## PASO 1: Preparar GitHub

### 1.1 Crear repositorio en GitHub

```bash
# Si aún no tienes el repo
cd C:\EDITOR_VIDEOS_BUEN_CERDITO
git remote add origin https://github.com/TU_USUARIO/video-generator.git
git branch -M main
git push -u origin main
```

### 1.2 Archivos requeridos para Vercel

✅ Ya están creados:
- `package.json` - Dependencias Node.js
- `api/index.js` - API Express
- `vercel.json` - Configuración Vercel
- `public/index.html` - Interfaz web
- `.env.example` - Variables de entorno

---

## PASO 2: Desplegar en Vercel

### 2.1 Login en Vercel

```bash
npm install -g vercel
vercel login
```

### 2.2 Desplegar el proyecto

```bash
cd C:\EDITOR_VIDEOS_BUEN_CERDITO
vercel deploy --prod
```

**O más fácil:**
1. Ve a https://vercel.com
2. "New Project"
3. Conecta tu repo de GitHub
4. Click "Deploy"

### 2.3 Configurar variables de entorno

En Vercel Dashboard:
1. Settings → Environment Variables
2. Agregar `BACKEND_URL` (lo dejaremos vacío por ahora)

---

## PASO 3: Desplegar Backend en Railway (Optional)

### 3.1 Crear cuenta en Railway

```bash
npm install -g @railway/cli
railway login
```

### 3.2 Configurar proyecto Python

```bash
cd C:\EDITOR_VIDEOS_BUEN_CERDITO

# Crear requirements.txt
pip freeze > requirements.txt

# Crear Procfile para Railway
echo "web: python generador_videos_definitivo.py" > Procfile
```

### 3.3 Desplegar

```bash
railway init
railway deploy
```

---

## PASO 4: Conectar Frontend + Backend

### 4.1 Obtener URL del backend

Después de desplegar en Railway, copiar la URL (ej: `https://video-generator-prod.railway.app`)

### 4.2 Configurar en Vercel

En Vercel Dashboard:
1. Settings → Environment Variables
2. Agregar:
   - Name: `BACKEND_URL`
   - Value: `https://tu-backend.railway.app`
3. Redeploy

### 4.3 Verificar conexión

```bash
curl https://tu-vercel-url.com/api/health
```

---

## ⚡ Alternativa: Deploy simple (Solo Vercel)

Si no quieres Python backend, puedes:

### Opción A: Eliminar Python completamente

```bash
rm -r generador_videos_definitivo.py
rm -r editor_videos_aida.py
rm -r crear_*.py
```

### Opción B: Usar fluent-ffmpeg (Node.js)

```bash
npm install fluent-ffmpeg
```

Luego actualizar `api/index.js` para usar FFmpeg desde Node.js

---

## 📊 Estado del Despliegue

Después de completar todo:

| Componente | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ | https://video-gen.vercel.app |
| API | ✅ | https://video-gen.vercel.app/api |
| Backend (Opcional) | ⏳ | https://video-gen.railway.app |
| Health Check | ✅ | /api/health |

---

## 🐛 Troubleshooting

### "Backend URL not configured"

Solución:
```bash
# En Vercel Dashboard
Settings → Environment Variables
Agregar BACKEND_URL=tu_url_aqui
```

### "502 Bad Gateway"

Posibles causas:
- Backend no está corriendo
- URL del backend es incorrecta
- Timeout (>60s en Vercel)

Solución:
- Verificar backend está activo
- Comprobar variable BACKEND_URL
- Optimizar tiempo de procesamiento

### "Memory exceeded"

En Vercel:
```json
// vercel.json
"functions": {
  "api/index.js": {
    "memory": 3008  // Aumentar a 3GB
  }
}
```

---

## 🎯 Próximos pasos

1. ✅ Desplegar en Vercel (10 min)
2. ✅ Desplegar backend en Railway (15 min)
3. ✅ Conectar BACKEND_URL (2 min)
4. ✅ Probar en producción
5. ✅ Usar desde: https://tu-vercel-url.com

---

## 📞 Comandos útiles

```bash
# Ver logs de Vercel
vercel logs --prod

# Ver estado de Railway
railway status

# Redeploy en Vercel
vercel deploy --prod --force

# Test local
npm run dev  # Puerto 3000
```

---

## 💡 Tips

- Vercel = 10 segundos máximo de ejecución
- Railway = Ilimitado (dentro del plan)
- Siempre testear localmente primero: `npm run dev`
- Monitor logs en producción: `vercel logs --follow`

---

¡Listo para desplegar! 🚀
