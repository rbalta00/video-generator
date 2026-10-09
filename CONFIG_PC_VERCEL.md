# 🖥️ CONFIGURACIÓN VERCEL PARA ESTA PC

**PC:** Isaac - Windows 11  
**Fecha:** 2026-10-09  
**Status:** ✅ DEPLOYADO Y FUNCIONANDO

---

## 🌍 URLs en Vivo

### Production
```
https://video-generator-two-phi.vercel.app ← USA ESTA
```

### Deployment
```
https://video-generator-e7m5sskha-isaacrbs-projects.vercel.app
```

### GitHub Repo
```
https://github.com/rbalta00/video-generator
```

---

## 🔐 Credenciales Vercel

**Usuario:** rbalta00-8908  
**Autenticación:** GitHub CLI  
**Token:** Guardado en keyring de Windows

**Para reautenticarse:**
```bash
vercel logout
vercel login --web
```

---

## 📦 Proyecto Deployado

**Nombre:** video-generator  
**Tipo:** Express.js (Node.js)  
**Team:** isaacrbs-projects (personal)  
**Región:** East (iad1)  
**Framework:** Express  

---

## 🔧 Configuración de Vercel

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm install",
  "framework": "express",
  "functions": {
    "api/index.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "public": true
}
```

### .vercelignore
```
# Excluye archivos grandes
node_modules/
*.mp4
ffmpeg/
proyectos/
videos_originales/
clips_aida/
material_primo/
.git/
```

### package.json
```json
{
  "name": "video-generator-web",
  "version": "1.0.0",
  "main": "api/index.js",
  "scripts": {
    "dev": "node api/index.js",
    "start": "node api/index.js"
  },
  "engines": {
    "node": "24.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "form-data": "^4.0.0"
  }
}
```

---

## 📊 Build Stats

| Métrica | Valor |
|---------|-------|
| **Build Time** | 9 segundos |
| **Deployment Size** | 237 bytes (código) |
| **Dependencies** | 104 packages |
| **Node.js** | 24.x (latest) |
| **Memory Limit** | 1024 MB (Hobby) |
| **Max Duration** | 30 segundos |

---

## 🚀 Cómo Deployar Cambios

### Desde esta PC

```bash
# 1. Navegar al proyecto
cd C:\EDITOR_VIDEOS_BUEN_CERDITO

# 2. Hacer cambios y commit
git add .
git commit -m "tu cambio aquí"

# 3. Push a GitHub
git push

# 4. Deploy a Vercel (auto) O manual:
vercel deploy --prod
```

### Auto-deployment

Vercel detecta cambios en GitHub automáticamente y redeploya.

---

## 🔗 Endpoints API

```bash
# Health check
GET https://video-generator-two-phi.vercel.app/api/health

# Info
GET https://video-generator-two-phi.vercel.app/api/info

# Generar video
POST https://video-generator-two-phi.vercel.app/api/generate

# Status de job
GET https://video-generator-two-phi.vercel.app/api/status/:jobId

# Web UI
GET https://video-generator-two-phi.vercel.app/
```

---

## 📝 Commits en Vercel

```
✓ 9a8bf57 - fix: Remove environment variable from vercel.json
✓ eb2c04e - add: Create .vercelignore to exclude large files
✓ 2f5f546 - fix: Exclude large files from deployment
✓ d0e5d77 - fix: Adjust Vercel configuration for Hobby plan limits
✓ 2c116e5 - docs: Add project status document for future reference
✓ 903ac67 - feat: Add Vercel deployment with Node.js/Express frontend
✓ 3668ab6 - Initial commit: Video Generator Project - El Buen Cerdito
```

---

## 🎯 Variables de Entorno (si necesitas)

En Vercel Dashboard (Settings → Environment Variables):

```env
# Requeridas
NODE_ENV=production

# Opcional - Para backend Python en Railway
BACKEND_URL=https://video-generator-backend.railway.app
```

### Para configurar:
1. Ve a https://vercel.com/isaacrbs-projects/video-generator
2. Settings → Environment Variables
3. Agrega las variables
4. Redeploy automáticamente

---

## 🐛 Troubleshooting Vercel

### "Deployment failed"
```bash
# Ver logs
vercel logs --prod --follow
```

### "Build failed"
```bash
# Redeploy
vercel deploy --prod --force
```

### "Environment variable missing"
```bash
# En Vercel Dashboard
Settings → Environment Variables → Add variable
```

---

## 📱 Testar en Vivo

1. Abre: https://video-generator-two-phi.vercel.app
2. Llena el formulario
3. Haz upload de video (drag-and-drop)
4. Click "Generar Video"
5. Debe mostrar status

**Nota:** Actualmente está en demo mode (sin backend Python).

---

## 🔄 Próximas Mejoras

- [ ] Agregar backend Python en Railway (opcional)
- [ ] Configurar BACKEND_URL en Vercel
- [ ] Mejorar error handling
- [ ] Agregar logging
- [ ] Monitorear performance

---

## 📞 Comandos Rápidos

```bash
# Verificar que está deployado
vercel whoami

# Ver URL en vivo
vercel list

# Inspeccionar deployment
vercel inspect video-generator-e7m5sskha-isaacrbs-projects.vercel.app

# Ver logs en vivo
vercel logs --prod --follow

# Logout
vercel logout
```

---

## 💾 Archivos Clave (esta PC)

```
C:\EDITOR_VIDEOS_BUEN_CERDITO\
├── api/index.js              ← API Express
├── public/index.html          ← Web UI
├── package.json               ← Dependencies
├── vercel.json                ← Config Vercel
├── .vercelignore              ← Archivos a excluir
├── .gitignore                 ← Archivos git a excluir
├── DEPLOYMENT.md              ← Guía deployment
├── ESTADO_PROYECTO.md         ← Estado actual
└── CONFIG_PC_VERCEL.md        ← Este archivo
```

---

## ✨ Estado del Proyecto Actual

| Componente | Status | URL |
|-----------|--------|-----|
| **Frontend** | ✅ Deployado | https://video-generator-two-phi.vercel.app |
| **GitHub Repo** | ✅ Activo | https://github.com/rbalta00/video-generator |
| **Vercel Auth** | ✅ Configurado | rbalta00-8908 |
| **Backend Python** | 🟡 Opcional | No deployado |
| **API Health** | ✅ OK | /api/health |

---

## 🎓 Próximas Acciones

**Ahora mismo:**
- ✅ App deployada en Vercel
- ✅ GitHub configurado
- ✅ Vercel autenticado

**Cuando quieras:**
1. Agregar backend Python en Railway
2. Configurar BACKEND_URL
3. Mejorar UI/UX
4. Agregar más features

---

**¡App en vivo! 🚀**

*Guardado en: C:\EDITOR_VIDEOS_BUEN_CERDITO\CONFIG_PC_VERCEL.md*
