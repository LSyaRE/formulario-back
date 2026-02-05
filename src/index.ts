import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { staticPlugin } from '@elysiajs/static';
import { connectDB } from './db/mongoose';
import { seedDefaultAdmin } from './db/seeds';
import { formRoutes } from './routes/form';
import { adminRoutes } from './routes/admin';

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_in_production';

// Conectar a MongoDB e inicializar datos
await connectDB();
await seedDefaultAdmin();

const app = new Elysia()
    // CORS
    .use(cors({
        origin: true,
        credentials: true
    }))

    // JWT
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
        exp: '24h'
    }))

    // Rutas de la API
    .use(formRoutes)
    .use(adminRoutes)

    // Health check
    .get('/api/health', () => ({
        success: true,
        message: 'Servidor API funcionando correctamente',
        timestamp: new Date().toISOString()
    }))

    // Manejo de errores global
    .onError(({ code, error, set }) => {
        console.error('Error:', code, error);

        if (code === 'VALIDATION') {
            set.status = 400;
            return {
                success: false,
                message: 'Datos de entrada inválidos',
                error: error.message
            };
        }

        if (code === 'NOT_FOUND') {
            set.status = 404;
            return {
                success: false,
                message: 'Ruta no encontrada'
            };
        }

        set.status = 500;
        return {
            success: false,
            message: 'Error interno del servidor'
        };
    })

    .listen(PORT);

console.log(`
✨ API de Sistema Médico Iniciada
🚀 Puerto: ${PORT}
📍 URL Base: http://localhost:${PORT}

🛠️ Rutas Disponibles:
✅ Health:  GET  /api/health
📝 Form:    GET  /api/form/validate/:token
📝 Form:    POST /api/form/:token
🔐 Admin:   POST /api/admin/login
🔐 Admin:   GET  /api/admin/stats
🔐 Admin:   GET  /api/admin/records
🔐 Admin:   POST /api/admin/generate-token
`);
