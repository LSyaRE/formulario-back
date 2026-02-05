import { Context } from 'elysia';

export interface AuthContext extends Context {
    adminId?: string;
}

/**
 * Middleware para verificar JWT en rutas administrativas
 * Se usa con el plugin @elysiajs/jwt
 */
export async function authMiddleware(context: any) {
    const authHeader = context.request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        context.set.status = 401;
        return {
            success: false,
            message: 'No autorizado - Token no proporcionado'
        };
    }

    const token = authHeader.substring(7);

    try {
        const payload = await context.jwt.verify(token);

        if (!payload) {
            context.set.status = 401;
            return {
                success: false,
                message: 'No autorizado - Token inválido'
            };
        }

        // Agregar adminId al contexto
        context.adminId = payload.adminId;

    } catch (error) {
        context.set.status = 401;
        return {
            success: false,
            message: 'No autorizado - Token inválido o expirado'
        };
    }
}
