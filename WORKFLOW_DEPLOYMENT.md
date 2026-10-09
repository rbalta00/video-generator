# 📋 WORKFLOW DE DEPLOYMENT - Video Generator

**Propósito:** Guía rápida para guardar cambios en PC → GitHub → Vercel  
**Tiempo:** 5 minutos  
**Última actualización:** 2026-10-09

---

## 🎯 Resumen Rápido

```bash
# 1. Guardar en PC (Git)
git add .
git commit -m "tu descripción"

# 2. Guardar en GitHub
git push

# 3. Subir a Vercel (automático o manual)
vercel deploy --prod
```

---

## 📋 CHECKLIST PASO A PASO

### PASO 1: Cambios en PC ✏️

**Edita los archivos que necesites:**
```
C:\EDITOR_VIDEOS_BUEN_CERDITO\
├── api/index.js                ← Cambios API
├── public/index.html           ← Cambios UI
├── package.json                ← Nuevas dependencias
└── ... otros archivos
```

### PASO 2: Revisar Cambios 👀

**En PowerShell:**
```bash
cd C:\EDITOR_VIDEOS_BUEN_CERDITO
git status
```

**Output esperado:**
```
On branch master
Changes not staged for commit:
  modified:   api/index.js
  modified:   public/index.html
```

### PASO 3: Stage de Cambios 📦

**Opción A: Agregar específicos**
```bash
git add api/index.js
git add public/index.html
```

**Opción B: Agregar todos**
```bash
git add .
```

**Verificar:**
```bash
git status
# Deberían mostrar "Changes to be committed"
```

### PASO 4: Commit Local 💾

**Formato de mensaje:**
```bash
git commit -m "tipo: Descripción breve (presente)

- Bullet point detallado si es necesario
- Otro punto si hay múltiples cambios"
```

**Ejemplos válidos:**
```bash
git commit -m "fix: Corregir bug en API health endpoint"

git commit -m "feat: Agregar soporte para múltiples formatos de video

- Soporta MP4, MOV, AVI
- Valida tamaño máximo
- Retorna error si formato no permitido"

git commit -m "docs: Actualizar documentación de deployment"

git commit -m "refactor: Simplificar lógica de upload de archivos"
```

**Tipos válidos:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `refactor:` - Reorganización de código
- `perf:` - Mejora de performance
- `style:` - Cambios de formato
- `test:` - Agregar/actualizar tests

### PASO 5: Push a GitHub 🚀

**Subir cambios:**
```bash
git push
```

**Output esperado:**
```
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Delta compression using up to 8 threads
To https://github.com/rbalta00/video-generator.git
   abc1234..def5678  master -> master
```

**Verificar en GitHub:**
```
https://github.com/rbalta00/video-generator/commits/master
```

### PASO 6: Deploy a Vercel 🌍

#### Opción A: Auto-deployment (Automático)
```
GitHub webhook → Vercel detecta push → Auto-redeploy
Tiempo: ~30-60 segundos
```

**Verificar en Vercel:**
```
https://vercel.com/isaacrbs-projects/video-generator
```

#### Opción B: Deploy Manual
```bash
vercel deploy --prod
```

**Output esperado:**
```
Vercel CLI 63.1.2 (Node.js 26.7.0)
Deploying video-generator
✓ Uploaded 237 bytes
Building…
Build Completed in 9s
Deploying outputs…
▲ Aliased https://video-generator-two-phi.vercel.app
```

### PASO 7: Verificar en Vivo ✅

**Abrir la app:**
```
https://video-generator-two-phi.vercel.app
```

**Probar endpoints:**
```bash
# Health check
curl https://video-generator-two-phi.vercel.app/api/health

# Info
curl https://video-generator-two-phi.vercel.app/api/info
```

**Esperar logs:**
```bash
vercel logs --prod --follow
```

---

## 🔍 TROUBLESHOOTING RÁPIDO

### ❌ Error: "fatal: pathspec 'X' did not match"
```bash
# Significa el archivo no existe o está ignorado en .gitignore
# Solución: Verificar que el archivo exista
ls archivo.js  # Si no existe, crear primero
```

### ❌ Error: "Permission denied"
```bash
# Significa no tienes permisos en GitHub
# Solución: Re-autenticar
gh auth login --web
```

### ❌ Error: "File size limit exceeded (100 MB)"
```bash
# Archivos demasiado grandes
# Solución: Revisar .vercelignore y .gitignore
# Asegurar que:
# - node_modules/ está excluido
# - *.mp4 está excluido
# - ffmpeg/ está excluido
```

### ❌ Error: "Build failed"
```bash
# Ver logs de build
vercel logs --prod

# O redeploy completo
vercel deploy --prod --force
```

### ✅ Deploy lento (>30 segundos)
```bash
# Normal si es la primera vez
# Próximas serán más rápidas (~9 segundos)
# Si persiste, revisar:
npm run dev  # Probar localmente
```

---

## ⚡ COMANDOS ÚTILES

### Ver estado
```bash
git status
git log --oneline -5
vercel whoami
```

### Deshacer cambios
```bash
# Deshacer cambios no staged
git restore api/index.js

# Deshacer staged
git restore --staged api/index.js

# Deshacer último commit (SIN perder cambios)
git reset --soft HEAD~1
```

### Ver cambios detallados
```bash
git diff api/index.js  # Sin stage
git diff --staged      # Cambios a commitear
git log -p api/index.js # Historial de cambios
```

### Limpiar
```bash
# Ver qué se eliminaría
git clean -n

# Eliminar archivos no trackeados
git clean -f

# Eliminar directorios también
git clean -fd
```

---

## 📊 FLUJO COMPLETO VISUAL

```
┌─────────────────────────┐
│   Editar archivos       │
│   en C:\...\            │
│   EDITOR_VIDEOS...      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  git add .              │
│  git commit -m "..."    │
│  (Guardar en PC)        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  git push               │
│  (Subir a GitHub)       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Auto-redeploy en       │
│  Vercel (30-60 seg)     │
│  O: vercel deploy --prod│
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  ✅ APP EN VIVO         │
│  video-generator-      │
│  two-phi.vercel.app    │
└─────────────────────────┘
```

---

## 🎯 EJEMPLOS REALES

### Ejemplo 1: Agregar endpoint nuevo

```bash
# 1. Editar api/index.js
# (Agregar nueva ruta POST /api/test)

# 2. Revisar cambios
git status
git diff api/index.js

# 3. Commit
git add api/index.js
git commit -m "feat: Add /api/test endpoint for testing"

# 4. Push
git push

# 5. Esperar 30-60 segundos → Auto-redeploy en Vercel
# O manual: vercel deploy --prod

# 6. Probar
curl https://video-generator-two-phi.vercel.app/api/test
```

### Ejemplo 2: Actualizar UI

```bash
# 1. Editar public/index.html
# (Cambiar color, agregar botón, etc)

# 2. Commit
git add public/index.html
git commit -m "style: Update button color to match brand"

# 3. Push
git push

# 4. Auto-deploy
# (Vercel redeploya automáticamente)

# 5. Verificar
# Abrir: https://video-generator-two-phi.vercel.app
```

### Ejemplo 3: Agregar dependencia

```bash
# 1. Agregar a package.json
npm install axios

# 2. Commit
git add package.json
git add package-lock.json
git commit -m "chore: Add axios for HTTP requests"

# 3. Push
git push

# 4. Deploy
# Vercel automáticamente corre npm install

# 5. Esperar build (~15 segundos)
```

---

## 🔐 NOTAS DE SEGURIDAD

### ⚠️ NUNCA commitear:
```
.env (credenciales)
secrets/
api_keys.txt
node_modules/ (está en .gitignore)
*.mp4 (archivos grandes)
ffmpeg/ (binarios)
```

### ✅ Antes de push, verificar:
```bash
# Ver qué se sube
git diff --staged

# Certificar que NO incluye:
grep -r "password\|secret\|token" .git/index
```

---

## 📞 RESUMEN ULTRA-RÁPIDO

```bash
# ¡Trabajaste en algo! Ahora:

cd C:\EDITOR_VIDEOS_BUEN_CERDITO

# 1. Guardar en PC
git add .
git commit -m "breve descripción del cambio"

# 2. Guardar en GitHub
git push

# 3. Verificar en Vercel (automático o manual)
vercel deploy --prod

# ✅ ¡Listo! App actualizada en:
# https://video-generator-two-phi.vercel.app
```

---

## 🎓 PRÓXIMAS VECES

Cuando vuelvas a trabajar en este proyecto:

1. Lee este archivo (2 minutos)
2. Sigue los pasos 1-7
3. Listo en 5 minutos

**Guarda este workflow en favoritos porque lo usarás muchas veces.**

---

## 📊 Checklist Final

Antes de dar por terminada una sesión:

- [ ] ¿Hiciste cambios?
- [ ] ¿Agregaste los archivos? (`git add .`)
- [ ] ¿Escribiste mensaje descriptivo? (`git commit -m "..."`)
- [ ] ¿Hiciste push a GitHub? (`git push`)
- [ ] ¿Verificaste en Vercel? (espera 1 min, recarga)
- [ ] ¿Probaste la app en vivo?
- [ ] ¿Guardaste este archivo?

---

## 🚀 Notas Finales

- **Auto-deploy:** GitHub → Vercel automático (~1 min)
- **Manual deploy:** `vercel deploy --prod` (~15 seg)
- **Build time:** 9 segundos típicamente
- **URL:** https://video-generator-two-phi.vercel.app

---

**Este archivo es tu guía. Guárdalo y úsalo cada vez que trabajes.**

*Creado: 2026-10-09*  
*Última actualización: 2026-10-09*  
*Versión: 1.0*
