# 🎨 Guía de Diseño - Video Generator

## Colores

### Paleta Principal
```css
/* Gradiente de Fondo */
--color-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Primario - Botones principales */
--color-primary: #667eea
--color-primary-dark: #5568d3
--color-primary-light: #8b9ef0

/* Secundario - Botones secundarios */
--color-secondary: #764ba2
--color-secondary-dark: #633382
--color-secondary-light: #9266be

/* Neutros */
--color-white: #ffffff
--color-light-gray: #f5f5f5
--color-gray: #888888
--color-dark-gray: #333333
--color-black: #000000
```

### Estados
```css
/* Éxito */
--color-success: #4caf50
--color-success-light: #c8e6c9
--color-success-bg: #f1f8e9

/* Error */
--color-error: #f44336
--color-error-light: #ffcdd2
--color-error-bg: #ffebee

/* Advertencia */
--color-warning: #ff9800
--color-warning-light: #ffe0b2
--color-warning-bg: #fff3e0

/* Info */
--color-info: #2196f3
--color-info-light: #bbdefb
--color-info-bg: #e3f2fd
```

## Tipografía

### Familia de Fuentes
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
```

### Tamaños

| Elemento | Tamaño | Peso |
|----------|--------|------|
| Título Principal | 48px | 700 |
| Subtítulo | 24px | 400 |
| Encabezados (h3) | 20px | 600 |
| Texto Base | 16px | 400 |
| Pequeño | 14px | 400 |
| Muy Pequeño | 12px | 400 |

### Estilos de Texto

**Títulos:**
- Color: Blanco (#ffffff)
- Peso: 700 (bold)
- Espaciado: 1.2 líneas

**Descripción:**
- Color: Gris medio (#888888)
- Peso: 400 (normal)
- Espaciado: 1.5 líneas

**Formulario:**
- Color: Gris oscuro (#333333)
- Peso: 400
- Placeholder: Gris claro (#cccccc)

## Componentes

### Botones

#### Primario (Generar/Descargar)
```
Fondo: Gradiente morado
Color texto: Blanco
Padding: 15px 30px
Border-radius: 8px
Hover: Opacidad 0.9
```

#### Secundario (Limpiar)
```
Fondo: Gris claro
Color texto: Gris oscuro
Padding: 15px 30px
Border-radius: 8px
Hover: Gris más oscuro
```

#### Estados
- **Normal**: Opacidad 1.0
- **Hover**: Opacidad 0.9, sombra suave
- **Activo**: Opacidad 0.8, sombra más pronunciada
- **Deshabilitado**: Opacidad 0.5, cursor no-permitido

### Campos de Entrada

```css
/* Input Text */
Input {
  border: 1px solid #e0e0e0
  border-radius: 6px
  padding: 12px 16px
  font-size: 16px
  background: white
  transition: border-color 0.3s
}

Input:focus {
  border-color: #667eea
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1)
  outline: none
}
```

### Áreas de Drag & Drop

```css
/* Zona de carga */
Border: 2px dashed #667eea
Background: rgba(102, 126, 234, 0.05)
Border-radius: 8px
Padding: 40px 20px
Transition: all 0.3s ease

Hover {
  Border-color: #764ba2
  Background: rgba(118, 75, 162, 0.1)
}

Drag-over {
  Border-color: #764ba2
  Background: rgba(118, 75, 162, 0.15)
}
```

### Tarjetas de Información

```css
/* Card */
Background: white
Border-radius: 12px
Box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
Padding: 20px
Margin-bottom: 20px
Transition: transform 0.3s, box-shadow 0.3s

Hover {
  Transform: translateY(-2px)
  Box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15)
}
```

### Mensajes de Estado

**Éxito (Verde)**
```
Background: #f1f8e9
Border: 1px solid #aed581
Color: #2e7d32
Border-left: 4px solid #4caf50
Ícono: ✅
```

**Error (Rojo)**
```
Background: #ffebee
Border: 1px solid #f48fb1
Color: #c62828
Border-left: 4px solid #f44336
Ícono: ❌
```

**Info (Azul)**
```
Background: #e3f2fd
Border: 1px solid #90caf9
Color: #1565c0
Border-left: 4px solid #2196f3
Ícono: ℹ️
```

**Procesando (Naranja)**
```
Background: #fff3e0
Border: 1px solid #ffe0b2
Color: #e65100
Border-left: 4px solid #ff9800
Ícono: ⏳
```

## Layout

### Estructura General

```
┌─────────────────────────────────────┐
│         Header + Gradient           │
│    🎬 Video Generator Title         │
│                                     │
│  ┌──────────────────────────────┐   │
│  │                              │   │
│  │     Formulario Principal     │   │
│  │     - Título                 │   │
│  │     - Descripción            │   │
│  │     - Estilo                 │   │
│  │     - Drag & Drop            │   │
│  │                              │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Información de Limites       │   │
│  │ - Tiempo | Tamaño | Formatos │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │       Resultados             │   │
│  │   Estado: Completado         │   │
│  │   [Descargar Video]          │   │
│  └──────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Responsive

**Desktop (1200px+)**
- Contenedor: 1000px max-width, centrado
- Columnas: Single column, ancho completo
- Padding: 40px lateral

**Tablet (768px - 1199px)**
- Contenedor: 100%, con padding
- Columnas: Single column
- Padding: 20px lateral

**Mobile (< 768px)**
- Contenedor: 100%
- Padding: 16px lateral
- Fuentes: -2px en tamaño
- Espaciado: Reducido 20%

## Dashboard

### Tarjetas Principales

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ ✅ 15    │  │ ⏳ 2     │  │ ⚠️ 1     │
│ Completados│  │ En Proceso│  │ Errores  │
│ 100% éxito│  │ En cola  │  │ 0% error │
└──────────┘  └──────────┘  └──────────┘

Altura: 200px
Ancho: 33% en desktop, 100% en mobile
```

### Gráficos

- **Tipo**: Chart.js
- **Color línea**: #667eea
- **Color relleno**: rgba(102, 126, 234, 0.1)
- **Fuente**: Same as body
- **Grid**: rgba(0, 0, 0, 0.1)

## Animaciones

### Transiciones

```css
/* Estándar */
transition: all 0.3s ease

/* Rápida */
transition: all 0.15s ease

/* Lenta */
transition: all 0.5s ease
```

### Efectos

**Hover en botones:**
- Opacidad: +0.1
- Sombra: +2px vertical
- Duración: 200ms

**Fade in:**
- Keyframes: opacity 0 → 1
- Duración: 300ms
- Timing: ease-in

**Slide up:**
- Keyframes: transform translateY(20px) → 0
- Duración: 300ms
- Timing: ease-out

## Iconografía

### Set de Íconos Sugeridos

| Acción | Ícono | Código |
|--------|-------|--------|
| Generar | 🚀 | `\1F680` |
| Descargar | 📥 | `\1F4E5` |
| Eliminar | 🗑️ | `\1F5D1` |
| Procesando | ⏳ | `\23F3` |
| Éxito | ✅ | `\2705` |
| Error | ❌ | `\274C` |
| Info | ℹ️ | `\2139` |
| Video | 🎬 | `\1F3AC` |
| Documento | 📄 | `\1F4C4` |
| Carpeta | 📁 | `\1F4C1` |

## Mejoras Futuras

1. **Dark Mode**: Invertir colores, ajustar gradiente
2. **Animaciones**: Loading spinner mejorado
3. **Micro-interacciones**: Feedback visual inmediato
4. **Accesibilidad**: Contraste > 4.5:1, focus visible
5. **Consistencia**: Espaciado grid de 8px
6. **Performance**: Lazy load de imágenes
7. **Scroll**: Sticky header en desktop
8. **Temas**: Opción de tema claro/oscuro
