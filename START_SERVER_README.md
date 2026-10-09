# 🎬 Video Generator - Servidor Local

## Cómo iniciar el servidor

### **Opción 1: Batch (Simple)**
1. **Doble-click** en `START_SERVER.bat`
2. El servidor inicia automáticamente en `http://localhost:3000`
3. Verás los logs en la ventana

### **Opción 2: PowerShell (Recomendado)**
1. Abre PowerShell
2. Ejecuta: `.\START_SERVER.ps1`
3. O doble-click si tienes los scripts habilitados

## Características

✅ **API Endpoints**
- `/api/health` - Status del servidor
- `/api/info` - Información de la app
- `/api/validation-info` - Requisitos de validación
- `/api/generate` - Subir y procesar videos

✅ **Dashboard**
- `/dashboard` - Panel de estadísticas en tiempo real

✅ **Interfaz Web**
- `/` - Aplicación completa

## URL Local

```
http://localhost:3000
```

## Requisitos

- Node.js 24.x instalado
- Puerto 3000 disponible (no debe estar en uso)

## Troubleshooting

### Puerto 3000 ya está en uso
```bash
# Encontrar qué proceso usa el puerto
netstat -ano | findstr :3000

# Terminar el proceso (reemplaza PID)
taskkill /PID <PID> /F
```

### Script no inicia
- Verifica que estés en el directorio correcto
- Ejecuta `npm install` primero
- Revisa que Node.js esté instalado: `node --version`

## Detener el servidor

- **Batch**: Cierra la ventana o presiona Ctrl+C
- **PowerShell**: Presiona Ctrl+C o cierra la ventana
