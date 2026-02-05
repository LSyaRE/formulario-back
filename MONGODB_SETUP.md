# ⚠️ MongoDB Requerido

El servidor ElysiaJS está listo pero necesita MongoDB para funcionar.

## 🚀 Opción 1: MongoDB Atlas (Cloud - Recomendado)

### Ventajas
- ✅ Gratis (tier M0)
- ✅ Sin instalación
- ✅ Accesible desde cualquier lugar
- ✅ Configuración en 5 minutos

### Pasos

1. **Crear cuenta**
   - Ve a https://www.mongodb.com/cloud/atlas
   - Regístrate gratis

2. **Crear cluster**
   - Click "Build a Database"
   - Selecciona "M0 Free"
   - Elige región más cercana
   - Click "Create Cluster"

3. **Configurar acceso de red**
   - En "Network Access", click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

4. **Crear usuario de base de datos**
   - En "Database Access", click "Add New Database User"
   - Username: `admin`
   - Password: (genera uno seguro)
   - Database User Privileges: "Atlas admin"
   - Add User

5. **Obtener cadena de conexión**
   - En "Database", click "Connect"
   - Selecciona "Connect your application"
   - Copia la cadena de conexión
   - Reemplaza `<password>` con tu password

6. **Actualizar .env**
   ```env
   MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/medical-records?retryWrites=true&w=majority
   ```

## 💻 Opción 2: MongoDB Local

### Ventajas
- ✅ Más rápido
- ✅ Sin internet necesario
- ✅ Control total

### Pasos

1. **Descargar MongoDB**
   - https://www.mongodb.com/try/download/community
   - Versión: 7.0 o superior
   - Platform: Windows

2. **Instalar**
   - Ejecutar instalador
   - Seleccionar "Complete"
   - Marcar "Install MongoDB as a Service"
   - Finish

3. **Verificar instalación**
   ```bash
   mongod --version
   ```

4. **Iniciar servicio**
   ```bash
   net start MongoDB
   ```

5. **El .env ya está configurado**
   ```env
   MONGODB_URI=mongodb://localhost:27017/medical-records
   ```

## 🔄 Después de configurar MongoDB

1. **Reiniciar servidor**
   ```bash
   bun run dev
   ```

2. **Crear administrador**
   ```bash
   bun run create-admin
   ```

3. **Acceder al panel**
   - http://localhost:3000/admin.html

## ❓ ¿Problemas?

### MongoDB Atlas no conecta
- Verifica que la IP esté en whitelist (0.0.0.0/0)
- Verifica usuario y password en la cadena de conexión
- Asegúrate de reemplazar `<password>` con tu password real

### MongoDB Local no inicia
- Verifica que el servicio esté corriendo: `net start MongoDB`
- Revisa los logs en: `C:\Program Files\MongoDB\Server\7.0\log\`

## 📝 Siguiente paso

Elige una opción, configura MongoDB, y luego ejecuta:
```bash
bun run dev
```
