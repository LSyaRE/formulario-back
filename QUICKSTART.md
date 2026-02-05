# 🚀 Inicio Rápido - Sistema de Fichas Médicas

## ⚡ Comandos Esenciales

### Desarrollo
```bash
bun run dev          # Iniciar servidor con hot reload
bun run create-admin # Crear usuario administrador
```

### Producción
```bash
bun start            # Iniciar servidor en producción
```

## 📍 URLs Importantes

- **Panel Admin**: http://localhost:3000/admin.html
- **Health Check**: http://localhost:3000/api/health
- **Formulario**: http://localhost:3000/form.html?token=TOKEN

## 🔑 Primer Uso

1. **Instalar Bun** (si no lo tienes):
   ```bash
   powershell -c "irm bun.sh/install.ps1|iex"
   ```

2. **Instalar dependencias**:
   ```bash
   bun install
   ```

3. **Configurar MongoDB** en `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/medical-records
   # O usa MongoDB Atlas para cloud
   ```

4. **Crear administrador**:
   ```bash
   bun run create-admin
   ```

5. **Iniciar servidor**:
   ```bash
   bun run dev
   ```

6. **Acceder al panel**:
   - Abre http://localhost:3000/admin.html
   - Inicia sesión con tus credenciales

## 🎯 Flujo de Trabajo

### Generar URL para Nueva Ficha
1. Login en panel admin
2. Click "Generar URL Nueva Ficha"
3. Copiar URL
4. Compartir con usuario
5. Usuario completa formulario
6. URL se invalida automáticamente

### Editar Ficha Existente
1. En panel admin, buscar ficha
2. Click "Generar URL Edición"
3. Compartir nueva URL
4. Usuario modifica datos
5. URL se invalida al enviar

## 🔧 Variables de Entorno

```env
MONGODB_URI=mongodb://localhost:27017/medical-records
PORT=3000
BASE_URL=http://localhost:3000
JWT_SECRET=tu_secret_super_seguro
TOKEN_EXPIRATION_HOURS=72
```

## 📚 Documentación Completa

- [README.md](file:///e:/Git/GitHub/JavaScript/proyecto-acta/README.md) - Documentación general
- [SETUP.md](file:///e:/Git/GitHub/JavaScript/proyecto-acta/SETUP.md) - Guía de instalación detallada
- [walkthrough.md](file:///C:/Users/jonas/.gemini/antigravity/brain/fdec5f58-8315-4c81-9a64-155160b3770a/walkthrough.md) - Arquitectura y flujos

## ⚠️ Problemas Comunes

### MongoDB no conecta
```bash
# Windows - Iniciar servicio
net start MongoDB
```

### Puerto 3000 ocupado
Cambia en `.env`:
```env
PORT=3001
```

### Error de Bun
Verifica instalación:
```bash
bun --version
```

## 🎉 ¡Listo!

Tu sistema está funcionando cuando veas:

```
🚀 Servidor ElysiaJS iniciado
📍 URL: http://localhost:3000
🩺 Formulario público: http://localhost:3000/form.html
👨‍💼 Panel admin: http://localhost:3000/admin.html
📊 Health check: http://localhost:3000/api/health
```
