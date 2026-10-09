# 🎬 Video Generator - Deployment Ready

**Version:** 1.0.0 | **Status:** 🚀 Ready for Vercel

---

## ¿Qué es esto?

Un generador inteligente de videos para **El Buen Cerdito** con:

- ✅ **Frontend web** en Vercel (Node.js + Express)
- ✅ **Interfaz moderna** con drag-and-drop
- ✅ **Backend Python** opcional (Railway)
- ✅ **API REST** para procesamiento
- ✅ **Escalable** y **sin límites de ejecución**

---

## 🚀 Quick Start

### Opción 1: Desplegar en Vercel (2 minutos)

```bash
# 1. Ir a https://vercel.com
# 2. "New Project" → Conectar este repo
# 3. Deploy 🚀

# O desde terminal:
npm install -g vercel
vercel deploy --prod
```

**Resultado:** Tu app en `https://video-gen.vercel.app`

### Opción 2: Ejecutar localmente

```bash
npm install
npm run dev
# Abre http://localhost:3000
```

---

## 📁 Estructura

```
.
├── api/
│   └── index.js              # API Express
├── public/
│   └── index.html            # Web UI
├── package.json              # Dependencies Node.js
├── vercel.json               # Config Vercel
├── DEPLOYMENT.md             # Guía detallada
├── VERCEL_DEPLOYMENT_STRATEGY.md  # Análisis técnico
└── generador_videos_definitivo.py  # Python backend (opcional)
```

---

## ⚙️ Configuración

### Variables de entorno (.env)

```env
# Requeridas para Vercel
NODE_ENV=production
PORT=3000

# Opcional: Backend Python
BACKEND_URL=https://video-generator-backend.railway.app
```

### En Vercel Dashboard

Settings → Environment Variables:
- `BACKEND_URL` = tu-url-del-backend (opcional)

---

## 🎯 Características

### Frontend (Vercel)

- 📱 Responsive design (mobile + desktop)
- 🎨 Beautiful gradient UI
- 📤 Drag-and-drop file upload
- ⏳ Real-time progress tracking
- 🎬 Multiple video styles
- ✅ Health check endpoint

### API

```bash
# Check salud
GET /api/health

# Info
GET /api/info

# Generar video
POST /api/generate
  - Parámetros: title, description, style, video (file)
  
# Estado del job
GET /api/status/:jobId
```

---

## 🛠️ Deployment Guide

### Vercel

```bash
vercel deploy --prod
```

**Features Vercel:**
- Auto-deploy en cada push
- Free tier gratis
- HTTPS automático
- CDN global

### Railway (Backend - Opcional)

```bash
railway init
railway deploy
```

**Features Railway:**
- Python support completo
- FFmpeg pre-instalado
- 300 horas/mes gratis
- Ilimitado en ejecución

---

## 📊 Python vs Vercel

### El Problema 🚨

| Feature | Límite | Impacto |
|---------|--------|---------|
| **Tiempo ejecución** | 10-60 seg | Procesamiento lento |
| **Espacio disco** | 512MB | No caben videos |
| **FFmpeg** | No incluido | Error al procesar |

### La Solución ✅

**Usar Vercel + Railway:**
- Vercel = Frontend + API Router (10s máximo)
- Railway = Backend Python + FFmpeg (ilimitado)
- Comunicación vía HTTP REST

---

## 🎬 Cómo usar

1. **Abre la web:** https://tu-vercel-url.com
2. **Ingresa título y descripción**
3. **Sube un video (opcional)**
4. **Elige estilo de video**
5. **Click "Generar Video"**
6. **Espera a que se procese**
7. **Descarga el resultado** 🎉

---

## 🐛 Troubleshooting

### "Backend not configured"
Significa que no tienes BACKEND_URL configurado. Es normal. La UI funcionará en demo mode.

Para conectar backend:
1. Desplegar en Railway
2. Copiar URL
3. Ir a Vercel Dashboard → Environment Variables
4. Agregar `BACKEND_URL`
5. Redeploy

### "502 Bad Gateway"
Backend no responde. Verifica:
- Railway está corriendo
- URL es correcta
- Timeout (>60s)

### Memory exceeded
Aumentar en vercel.json:
```json
"memory": 3008
```

---

## 📈 Próximos pasos

- [ ] Deploy a Vercel
- [ ] Probar web UI
- [ ] Deploy backend a Railway (opcional)
- [ ] Conectar BACKEND_URL
- [ ] Compartir con el equipo

---

## 📞 Comandos útiles

```bash
# Local dev
npm run dev

# Logs Vercel
vercel logs --prod --follow

# Redeploy Vercel
vercel deploy --prod --force

# Status Railway
railway status
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────┐
│    Vercel (Frontend)        │
│  - Express server           │
│  - Web UI (HTML/CSS/JS)     │
│  - API Router               │
└──────────┬──────────────────┘
           │ HTTP
           ▼
┌─────────────────────────────┐
│   Railway (Backend)         │
│  - Python scripts           │
│  - FFmpeg processing        │
│  - Video generation         │
└─────────────────────────────┘
```

---

## 📄 Documentación

- **DEPLOYMENT.md** - Guía paso a paso (LEER PRIMERO)
- **VERCEL_DEPLOYMENT_STRATEGY.md** - Análisis técnico
- **GUIA_EDITOR_VIDEOS.txt** - Uso de scripts Python
- **ESTRUCTURA_REPO.md** - Organización del código

---

## 💡 Tips

✅ Vercel es perfecto para APIs y frontends
✅ Railway es perfecto para backends pesados
✅ El combo Vercel + Railway = Ilimitado y gratis
✅ Testea localmente con `npm run dev` antes de deployar
✅ Monitorea logs en producción

---

## 🚀 Ready to Deploy?

### Ruta rápida (5 minutos):
1. Push a GitHub
2. Ir a https://vercel.com
3. Conectar repo
4. Deploy

### Ruta completa (30 minutos):
1. Seguir DEPLOYMENT.md
2. Deploy en Vercel
3. Deploy en Railway
4. Conectar BACKEND_URL
5. Probar end-to-end

---

**¡A vender videos! 🎬🚀**

---

*Last updated: 2026-10-09*
