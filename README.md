# 🎬 EDITOR DE VIDEOS - EL BUEN CERDITO

## 📋 Descripción
Sistema completo de edición de videos para la creación de contenido viral para redes sociales (Facebook Ads, Instagram Reels, TikTok, YouTube Shorts).

**Negocio:** El Buen Cerdito - Cemitas Artesanales (Puebla, México)  
**Objetivo:** Crear videos de 15-30 segundos optimizados para Facebook Ads usando la metodología AIDA

---

## 🎯 COMPONENTES DEL PROYECTO

### 1. **VIDEOS ORIGINALES**
- 📁 Carpeta: `videos_originales/`
- 📹 Archivos:
  - `VOD_20260920_154053.mp4` (143.62 MB - 101.4s)
  - `VOD_20260920_160925.mp4` (60.84 MB - 26.3s)
  - `VOD_20260920_163521.mp4` (141.37 MB - 103.4s)
- **Total:** 347 MB de video bruto

### 2. **VIDEO FINAL**
- 📁 Carpeta: `C:\EDITOR_VIDEOS_BUEN_CERDITO\`
- 📹 Archivo: `video_final.mp4` (13.94 MB - 21 segundos)
- **Estado:** ✅ LISTO PARA FACEBOOK ADS

### 3. **SCRIPTS PYTHON**
- `crear_video_completo.py` - Corta y concatena videos
- `make_video_simple.py` - Versión simplificada
- `add_texts.py` - Agrega textos AIDA
- `video_con_textos_aida.py` - Versión mejorada con PIL

---

## 📊 METODOLOGÍA AIDA

El video está estructurado en 4 secciones de 5.2 segundos cada una:

```
DURACIÓN: 21 segundos total (3 clips x 7 segundos)

0-5.2s   → 🐷 ¡MIRA ESTO!
           (ATENCIÓN - Captar interés)

5.2-10.5s → Cemitas hechas como en casa
           (INTERÉS - Mostrar producto)

10.5-15.8s → Frescas, deliciosas, irresistibles
            (DESEO - Crear emoción)

15.8-21s  → Pide: +52 222 278 1310
           (ACCIÓN - Llamada a la acción)
```

---

## 💻 PROGRAMAS NECESARIOS

### ✅ INSTALADOS (GRATIS)
- [x] **DaVinci Resolve** - Editor principal (www.blackmagicdesign.com)
- [x] **Audacity** - Edición de audio (www.audacityteam.org)
- [x] **HandBrake** - Compresión de video (www.handbrake.fr)
- [x] **OBS Studio** - Grabación de pantalla (www.obsproject.com)

### 🌐 SITIOS WEB (Bookmarkear)
- [YouTube Audio Library](https://www.youtube.com/creator_studio) - Música sin copyright
- [Pexels](https://www.pexels.com) - Videos/imágenes stock gratis
- [Pixabay](https://www.pixabay.com) - Recursos gratis
- [Canva Gratis](https://www.canva.com) - Diseño gráfico

### 💰 RECOMENDADOS FUTUROS (PAGO)
- Epidemic Sound (~$10/mes) - Música premium sin copyright
- Adobe After Effects (~$20/mes) - Animaciones profesionales

---

## 🚀 FLUJO DE TRABAJO

### **PASO 1: Capturar Video**
```
1. Graba video con OBS Studio o tu cámara
2. Guarda en: C:\EDITOR_VIDEOS_BUEN_CERDITO\videos_originales\
3. Nombre: VOD_YYYYMMDD_HHMMSS.mp4
```

### **PASO 2: Cortar y Concatenar**
```
1. Ejecuta: python crear_video_completo.py
2. El script:
   - Corta 7 segundos de cada video
   - Los concatena (21 segundos total)
   - Agrega textos AIDA
   - Agrega música de fondo
3. Resultado: video_final.mp4
```

### **PASO 3: Edición Avanzada (OPCIONAL)**
```
1. Abre DaVinci Resolve
2. Importa: video_final.mp4
3. Edita:
   - Ajusta colores
   - Agrega transiciones
   - Mejora audio (Audacity)
   - Agrega efectos (After Effects)
4. Exporta como: Facebook (1080p, 30fps)
```

### **PASO 4: Optimización**
```
1. Abre HandBrake
2. Importa: video_final.mp4
3. Predefinido: "Facebook"
4. Exporta: video_final_optimizado.mp4
5. Tamaño final: ~5-8 MB
```

### **PASO 5: Publicar**
```
1. Ve a: facebook.com/ads
2. Crea campaña de CONVERSIÓN
3. Sube: video_final.mp4
4. Configura:
   - Audiencia: Puebla (zona Los Héroes)
   - Edad: 18-65
   - Intereses: Comida, negocios locales
   - Presupuesto: $150-300 MXN/día
5. ¡PUBLICA!
```

---

## 📁 ESTRUCTURA DE CARPETAS

```
C:\EDITOR_VIDEOS_BUEN_CERDITO\
├── videos_originales/
│   ├── VOD_20260920_154053.mp4
│   ├── VOD_20260920_160925.mp4
│   └── VOD_20260920_163521.mp4
├── videos_cortados/ (generado)
│   ├── 1.mp4
│   ├── 2.mp4
│   └── 3.mp4
├── video_final.mp4 ✅ (LISTO)
├── musica_fondo.mp3 (opcional)
├── crear_video_completo.py
├── make_video_simple.py
├── add_texts.py
├── video_con_textos_aida.py
└── README.md
```

---

## 🔧 COMANDOS RÁPIDOS

### **Crear video (Python)**
```bash
cd C:\EDITOR_VIDEOS_BUEN_CERDITO
python crear_video_completo.py
```

### **Crear video (Batch)**
```bash
ejecutar_editor.bat
```

### **Verificar tamaño de archivo**
```powershell
Get-Item video_final.mp4 | Select-Object @{N="Size(MB)";E={[math]::Round($_.Length/1MB,2)}}
```

---

## 🎨 TÉCNICAS PARA VIDEOS VIRALES

### **AUDIO (CRÍTICO)**
- ✅ Música de impacto los primeros 1-2 segundos
- ✅ Volumen consistente
- ✅ Fade in/out suave
- ✅ Epidemic Sound recomendado

### **VISUAL**
- ✅ Textos grandes y legibles
- ✅ Colores con contraste
- ✅ Transiciones suaves
- ✅ Movimiento constante

### **TIMING**
- ✅ 15-30 segundos (Facebook óptimo)
- ✅ Cambio de escena cada 3-5 segundos
- ✅ Call-to-action en últimos 3 segundos
- ✅ Hook en primeros 1-2 segundos

### **CALL-TO-ACTION**
- ✅ "Pide: +52 222 278 1310"
- ✅ "Encarga ahora"
- ✅ "¡Síguenos!"
- ✅ Visible 3-5 segundos al final

---

## 🐛 TROUBLESHOOTING

### **El video no se crea**
```
✓ Verifica que videos_originales/ tenga los .mp4
✓ Ejecuta como Administrador
✓ Reinicia la computadora
✓ Reinstala moviepy: pip install moviepy --upgrade
```

### **Video sin sonido**
```
✓ Verifica que musica_fondo.mp3 esté en la carpeta
✓ O descomenta la línea de música en el script
✓ Abre con Audacity para verificar audio
```

### **Video lento al exportar**
```
✓ Normal - puede tomar 2-5 minutos
✓ No cierres la ventana
✓ Paciencia
```

### **Archivo corrupto (0 MB)**
```
✓ Elimina video_final.mp4
✓ Ejecuta el script de nuevo
✓ Si persiste, copia un video original como respaldo
```

---

## 📊 MÉTRICAS DE ÉXITO

**Objetivo:** Videos virales con alto CTR (Click-Through Rate)

```
META FACEBOOK ADS:
├── CTR objetivo: 2-5%
├── Costo por click: $0.30-0.50 MXN
├── Conversión: 5-10% de clicks
└── ROI objetivo: 3:1 (por cada $1 gasto, $3 ingreso)

DURACIÓN ÓPTIMA:
├── 15-30 segundos ✅ (Actual: 21s)
├── Videos > 60s: Skip rate alto
├── Videos < 10s: No impacto suficiente

ENGAGEMENT FACEBOOK:
├── Primer 1 segundo: Hook importante
├── Segundo 5-10s: Mostrar producto
├── Segundo 15-20s: Llamada a acción
└── Último 1s: Logo/contacto
```

---

## 📝 PRÓXIMAS MEJORAS

- [ ] Agregar múltiples variantes de video
- [ ] A/B testing con 3-4 videos diferentes
- [ ] Analytics dashboard
- [ ] Integración con Meta Business Suite
- [ ] Biblioteca de templates AIDA
- [ ] Automatización de uploads

---

## 👨‍💻 DESARROLLADO POR

**Claude AI** para **El Buen Cerdito**  
Editado de videos con IA | Optimizado para redes sociales

---

## 📞 CONTACTO

**El Buen Cerdito**
- 📱 WhatsApp: +52 222 278 1310
- 📍 Ubicación: Los Héroes, Puebla, México
- 🎯 Producto: Cemitas Artesanales

---

## 📜 HISTORIAL

```
2026-09-29: Versión inicial del editor
├── Video final: 13.94 MB, 21 segundos
├── Textos AIDA: Incluidos
├── Estado: ✅ LISTO PARA FACEBOOK ADS
└── Siguiente: Publicar en campaigns
```

---

**Última actualización:** 2026-09-29  
**Versión:** 1.0  
**Estado:** ✅ PRODUCCIÓN
