# 🚀 Guía de Instalación y Configuración

## Paso 1: Instalar Bun

Bun es el runtime necesario para ejecutar ElysiaJS.

### Windows (PowerShell como Administrador)
```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

### Verificar instalación
```bash
bun --version
```

## Paso 2: Instalar Dependencias

Desde la carpeta del proyecto:

```bash
bun install
```

## Paso 3: Configurar MongoDB

### Opción A: MongoDB Local

1. Descarga MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Instala MongoDB
3. Inicia el servicio:
   ```bash
   # Windows
   net start MongoDB
   ```

### Opción B: MongoDB Atlas (Cloud - Recomendado)

1. Crea una cuenta en https://www.mongodb.com/cloud/atlas
2. Crea un cluster gratuito
3. Configura acceso de red (permite tu IP o 0.0.0.0/0 para desarrollo)
4. Crea un usuario de base de datos
5. Obtén la cadena de conexión

## Paso 4: Configurar Variables de Entorno

Edita el archivo `.env`:

```env
# Para MongoDB Local:
MONGODB_URI=mongodb://localhost:27017/medical-records

# Para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/medical-records

PORT=3000
BASE_URL=http://localhost:3000
JWT_SECRET=cambiar_este_secret_por_algo_muy_seguro_en_produccion
TOKEN_EXPIRATION_HOURS=72
```

**IMPORTANTE**: Cambia `JWT_SECRET` por una cadena aleatoria segura en producción.

## Paso 5: Crear Usuario Administrador

```bash
bun run create-admin
```

Ingresa:
- Nombre de usuario (mínimo 3 caracteres)
- Contraseña (mínimo 6 caracteres)
- Email (opcional)

## Paso 6: Iniciar el Servidor

### Modo Desarrollo (con hot reload)
```bash
bun run dev
```

### Modo Producción
```bash
bun start
```

El servidor estará disponible en:
- **Panel Admin**: http://localhost:3000/admin.html
- **API Health**: http://localhost:3000/api/health

## 🎯 Flujo de Uso

### 1. Acceder al Panel Admin
1. Abre http://localhost:3000/admin.html
2. Inicia sesión con las credenciales creadas

### 2. Generar URL para Nueva Ficha
1. Click en "Generar URL Nueva Ficha"
2. Copia la URL generada
3. Comparte la URL con el usuario

### 3. Usuario Completa Formulario
1. El usuario abre la URL compartida
2. Completa el formulario médico
3. Envía el formulario
4. La URL se invalida automáticamente

### 4. Editar Ficha Existente
1. En el panel admin, busca la ficha
2. Click en "Generar URL Edición"
3. Comparte la nueva URL
4. El usuario modifica los datos
5. Al enviar, la URL se invalida

## 🔍 Verificación

### Test de Conexión
```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "timestamp": "2026-02-04T..."
}
```

### Test de Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tu_usuario","password":"tu_password"}'
```

## ⚠️ Solución de Problemas

### Error: "Cannot find module 'bun'"
- Asegúrate de tener Bun instalado: `bun --version`
- Reinicia la terminal después de instalar Bun

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté corriendo
- Revisa la cadena de conexión en `.env`
- Para MongoDB Atlas, verifica que tu IP esté en la whitelist

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env`: `PORT=3001`
- O detén el proceso que usa el puerto 3000

### Error: "JWT verification failed"
- Verifica que `JWT_SECRET` sea el mismo en `.env`
- Cierra sesión y vuelve a iniciar sesión

## 📊 Estructura de Archivos

```
proyecto-acta/
├── src/                    # Código fuente backend
│   ├── index.ts           # Servidor principal
│   ├── db/                # Conexión DB
│   ├── models/            # Modelos Mongoose
│   ├── routes/            # Rutas API
│   ├── middleware/        # Middleware
│   └── utils/             # Utilidades
├── public/                # Frontend
│   ├── form.html          # Formulario público
│   ├── form.js            # Lógica formulario
│   ├── admin.html         # Panel admin
│   ├── admin.js           # Lógica admin
│   └── styles.css         # Estilos
├── scripts/               # Scripts utilidad
│   └── createAdmin.ts     # Crear admin
├── .env                   # Variables entorno
├── package.json
└── README.md
```

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Tokens JWT con expiración de 24h
- ✅ URLs de formulario de un solo uso
- ✅ Expiración automática de tokens (72h)
- ✅ Validación de datos en backend
- ✅ CORS configurado

## 📝 Notas Importantes

1. **Producción**: Cambia `JWT_SECRET` y usa HTTPS
2. **MongoDB Atlas**: Configura IP whitelist correctamente
3. **Backup**: Haz respaldo regular de la base de datos
4. **Logs**: Revisa la consola para errores

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs en la consola
2. Verifica que MongoDB esté corriendo
3. Asegúrate de que todas las dependencias estén instaladas
4. Revisa la configuración en `.env`
