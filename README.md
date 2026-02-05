# 🩺 Sistema de Fichas Médicas

Sistema completo de gestión de fichas médicas con backend ElysiaJS, MongoDB y sistema de URLs únicas.

## 🚀 Características

- ✅ **Backend ElysiaJS** - Ultra-rápido con Bun runtime
- ✅ **MongoDB** - Base de datos NoSQL
- ✅ **URLs Únicas** - Sistema de tokens de un solo uso
- ✅ **Panel Administrativo** - Gestión completa de fichas
- ✅ **Formulario Público** - Sin necesidad de login
- ✅ **Seguridad JWT** - Autenticación para administradores

## 📋 Requisitos

- **Bun** v1.0 o superior ([Instalar Bun](https://bun.sh))
- **MongoDB** v5.0 o superior (local o MongoDB Atlas)

## 🛠️ Instalación

### 1. Instalar Bun

```bash
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1|iex"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

### 2. Instalar Dependencias

```bash
bun install
```

### 3. Configurar Variables de Entorno

Edita el archivo `.env` con tus credenciales:

```env
MONGODB_URI=mongodb://localhost:27017/medical-records
PORT=3000
BASE_URL=http://localhost:3000
JWT_SECRET=tu_secret_super_seguro
TOKEN_EXPIRATION_HOURS=72
```

### 4. Iniciar MongoDB

```bash
# Si tienes MongoDB instalado localmente
mongod

# O usa MongoDB Atlas (cloud)
```

### 5. Crear Administrador

```bash
bun run create-admin
```

Sigue las instrucciones para crear tu primer usuario administrador.

### 6. Iniciar Servidor

```bash
# Modo desarrollo (con hot reload)
bun run dev

# Modo producción
bun start
```

## 📖 Uso

### Panel Administrativo

1. Accede a `http://localhost:3000/admin.html`
2. Inicia sesión con tus credenciales
3. Genera URLs únicas para formularios

### Generar URL para Nueva Ficha

1. En el panel admin, click en **"Generar URL"**
2. Copia la URL generada
3. Comparte la URL con el usuario
4. El usuario completa el formulario
5. Después de enviar, la URL se invalida automáticamente

### Editar Ficha Existente

1. En el panel admin, busca la ficha
2. Click en **"Generar URL de Edición"**
3. Comparte la nueva URL
4. El usuario modifica los datos
5. Al enviar, la URL se invalida

## 🔐 Seguridad

- **Tokens únicos**: Generados con nanoid (21 caracteres)
- **Un solo uso**: URLs se invalidan después de enviar
- **Expiración**: Tokens expiran después de 72 horas (configurable)
- **JWT**: Autenticación segura para administradores
- **Bcrypt**: Contraseñas hasheadas con 10 rounds

## 📁 Estructura del Proyecto

```
proyecto-acta/
├── src/
│   ├── index.ts              # Servidor principal
│   ├── db/
│   │   └── mongoose.ts       # Conexión MongoDB
│   ├── models/
│   │   ├── Admin.ts          # Modelo de administradores
│   │   ├── FormToken.ts      # Modelo de tokens
│   │   └── MedicalRecord.ts  # Modelo de fichas
│   ├── routes/
│   │   ├── form.ts           # Rutas públicas
│   │   └── admin.ts          # Rutas administrativas
│   ├── middleware/
│   │   └── auth.ts           # Middleware JWT
│   └── utils/
│       ├── token.ts          # Utilidades de tokens
│       └── validation.ts     # Validaciones
├── public/
│   ├── form.html             # Formulario público
│   ├── admin.html            # Panel administrativo
│   ├── styles.css            # Estilos
│   ├── form.js               # JS del formulario
│   └── admin.js              # JS del panel admin
├── scripts/
│   └── createAdmin.ts        # Script crear admin
├── .env                      # Variables de entorno
├── package.json
└── tsconfig.json
```

## 🌐 API Endpoints

### Públicos

- `GET /api/form/validate/:token` - Validar token
- `POST /api/form/:token` - Enviar formulario

### Administrativos (Requieren JWT)

- `POST /api/admin/login` - Login
- `GET /api/admin/records` - Listar fichas
- `GET /api/admin/records/:id` - Ver ficha
- `DELETE /api/admin/records/:id` - Eliminar ficha
- `POST /api/admin/generate-url` - Generar URL nueva
- `POST /api/admin/generate-edit-url/:id` - Generar URL edición
- `GET /api/admin/tokens` - Listar tokens
- `GET /api/admin/stats` - Estadísticas

## 🧪 Pruebas

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Login Admin

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"tu_password"}'
```

### Generar URL

```bash
curl -X POST http://localhost:3000/api/admin/generate-url \
  -H "Authorization: Bearer TU_JWT_TOKEN"
```

## 🐛 Solución de Problemas

### Error: Cannot find module 'bun'

Asegúrate de tener Bun instalado correctamente:

```bash
bun --version
```

### Error: MongoDB connection failed

Verifica que MongoDB esté corriendo:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Error: Port 3000 already in use

Cambia el puerto en `.env`:

```env
PORT=3001
```

## 📝 Notas

- Los datos se almacenan en MongoDB, no en localStorage
- Cada token solo puede usarse una vez
- Para modificar una ficha, se debe generar una nueva URL
- Las contraseñas de admin están hasheadas y no se pueden recuperar

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

MIT

## 👨‍💻 Autor

Creado para gestión segura de fichas médicas

---

**¿Necesitas ayuda?** Abre un issue en GitHub
