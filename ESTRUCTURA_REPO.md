# 📁 ESTRUCTURA VIDEO-GENERADOR

## Organización del Repositorio

```
VIDEO-GENERADOR/
│
├── 📄 README.md
│   └── Documentación general del repo
│
├── 📁 proyectos/
│   │
│   ├── 🐷 buen-cerdito/ ✅ (PRIMER PROYECTO)
│   │   ├── README.md (Info del proyecto)
│   │   ├── config.json (Configuración AIDA)
│   │   ├── videos_originales/ (VOD capturados)
│   │   ├── output/ (Videos generados)
│   │   ├── scripts/ (Scripts personalizados)
│   │   ├── assets/ (Recursos: música, logos)
│   │   └── docs/ (Documentación del proyecto)
│   │
│   ├── [PROYECTO-2]/ (Futuro)
│   │   └── (Estructura idéntica)
│   │
│   └── [PROYECTO-3]/ (Futuro)
│       └── (Estructura idéntica)
│
├── 📁 templates/
│   ├── proyecto_template/ (Plantilla para nuevos proyectos)
│   │   ├── README_TEMPLATE.md
│   │   ├── config_TEMPLATE.json
│   │   └── estructura_carpetas.txt
│   │
│   └── scripts_base/
│       ├── crear_video_base.py
│       ├── config_aida_base.py
│       └── utils.py
│
├── 📁 docs/
│   ├── GUIA_RAPIDA.md (Para iniciar rápido)
│   ├── INSTALACION.md (Instalación de programas)
│   ├── FAQ.md (Preguntas frecuentes)
│   └── FLUJO_TRABAJO.md (Paso a paso)
│
└── 📄 .gitignore
    └── Archivos a ignorar en Git

```

---

## 🚀 Cómo Crear un Nuevo Proyecto

### Paso 1: Copiar plantilla
```bash
cp -r templates/proyecto_template proyectos/[NOMBRE-PROYECTO]
```

### Paso 2: Personalizar config.json
```json
{
  "proyecto": {
    "nombre": "[TU PROYECTO]",
    "tipo": "[TIPO DE NEGOCIO]",
    "ubicacion": "[UBICACIÓN]",
    "contacto": "[TELÉFONO/EMAIL]"
  }
}
```

### Paso 3: Agregar videos
```
proyectos/[NOMBRE-PROYECTO]/videos_originales/
├── video1.mp4
├── video2.mp4
└── video3.mp4
```

### Paso 4: Ejecutar generador
```bash
cd proyectos/[NOMBRE-PROYECTO]
python ../../scripts_base/crear_video_base.py
```

---

## 📊 Estado de Proyectos

| Proyecto | Estado | Fecha | Videos |
|----------|--------|-------|--------|
| 🐷 Buen Cerdito | ✅ Activo | 2026-09-29 | 1 |
| [Proyecto 2] | ⏳ Pendiente | - | 0 |
| [Proyecto 3] | ⏳ Pendiente | - | 0 |

---

## 🔄 Flujo de Trabajo Típico

```
1. Crear carpeta del proyecto
   └─→ Copiar template
   
2. Configurar config.json
   └─→ Personalizar AIDA, audio, etc.
   
3. Agregar videos originales
   └─→ Guardar en videos_originales/
   
4. Ejecutar generador
   └─→ python crear_video.py
   
5. Verificar output
   └─→ Ver video_final.mp4
   
6. Publicar en redes
   └─→ Facebook Ads, Instagram, etc.
```

---

## 📝 Plantilla de Proyecto

Cada proyecto tiene esta estructura:

```
[PROYECTO]/
├── README.md
│   • Información básica
│   • Objetivos
│   • Equipo
│
├── config.json
│   • Configuración AIDA
│   • Videos a procesar
│   • Parámetros Facebook Ads
│
├── videos_originales/
│   • Archivos VOD capturados
│
├── output/
│   • video_final.mp4 (generado)
│
├── scripts/
│   • crear_video.py (personalizado)
│   • config_aida.py (AIDA config)
│
├── assets/
│   • musica_fondo.mp3
│   • logo.png
│   • colores.json
│
└── docs/
    • estrategia.md (estrategia marketing)
    • metricas.md (KPIs esperados)
```

---

## 🎯 Cuando Digas "VIDEO GENERADOR"

**Yo voy a:**

1. ✅ Buscar en `proyectos/`
2. ✅ Leer el `config.json` del proyecto
3. ✅ Usar los scripts personalizados
4. ✅ Generar videos optimizados
5. ✅ Actualizar documentación

---

## 📞 Proyectos Actuales

### 🐷 EL BUEN CERDITO (Proyecto 1)
- **Ubicación:** `proyectos/buen-cerdito/`
- **Estado:** ✅ ACTIVO
- **Videos:** 1 generado
- **Contacto:** +52 222 278 1310

---

## 🔜 Próximos Proyectos

Cuando agregues más clientes/negocios:

```
Proyecto 2: [Nombre]
Proyecto 3: [Nombre]
Proyecto 4: [Nombre]
...
```

Cada uno tendrá su propia carpeta con configuración personalizada.

---

**Estructura creada:** 2026-09-29  
**Versión:** 1.0  
**Mantenedor:** VIDEO-GENERADOR Team
