import { Elysia, t } from 'elysia';
import { Admin } from '../models/Admin';
import { FormToken } from '../models/FormToken';
import { MedicalRecord } from '../models/MedicalRecord';
import { generateToken, createFormURL } from '../utils/token';
import { authMiddleware } from '../middleware/auth';

import { jwt } from '@elysiajs/jwt';

export const adminRoutes = new Elysia({ prefix: '/api/admin' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET || 'secret'
    }))

    // Login de administrador
    .post('/login', async ({ body, jwt, set }) => {
        try {
            const { username, password } = body;

            const admin = await Admin.findOne({ username });

            if (!admin) {
                set.status = 401;
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }

            const isPasswordValid = await admin.comparePassword(password);

            if (!isPasswordValid) {
                set.status = 401;
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }

            // Generar JWT
            const token = await jwt.sign({
                adminId: admin._id.toString(),
                username: admin.username
            });

            return {
                success: true,
                token,
                admin: {
                    id: admin._id,
                    username: admin.username,
                    email: admin.email
                }
            };

        } catch (error) {
            console.error('Error en login:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    }, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })

    // Generar URL para nueva ficha
    .post('/generate-url', async ({ jwt, request, set }) => {
        const authResult = await authMiddleware({ jwt, request, set });
        if (authResult) return authResult;

        try {
            const authHeader = request.headers.get('authorization');
            const token = authHeader!.substring(7);
            const payload = await jwt.verify(token);

            const newToken = generateToken();
            const expirationHours = parseInt(process.env.TOKEN_EXPIRATION_HOURS || '72');
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + expirationHours);

            const formToken = new FormToken({
                token: newToken,
                status: 'pending',
                generatedBy: payload.adminId,
                expiresAt
            });

            await formToken.save();

            const url = createFormURL(newToken);

            return {
                success: true,
                token: newToken,
                url,
                expiresAt
            };

        } catch (error) {
            console.error('Error generando URL:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    })

    // Generar URL para editar ficha existente
    .post('/generate-edit-url/:id', async ({ params: { id }, jwt, request, set }) => {
        const authResult = await authMiddleware({ jwt, request, set });
        if (authResult) return authResult;

        try {
            const authHeader = request.headers.get('authorization');
            const token = authHeader!.substring(7);
            const payload = await jwt.verify(token);

            // Verificar que la ficha existe
            const record = await MedicalRecord.findById(id);

            if (!record) {
                set.status = 404;
                return {
                    success: false,
                    message: 'Ficha no encontrada'
                };
            }

            const newToken = generateToken();
            const expirationHours = parseInt(process.env.TOKEN_EXPIRATION_HOURS || '72');
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + expirationHours);

            const formToken = new FormToken({
                token: newToken,
                status: 'pending',
                recordId: id,
                generatedBy: payload.adminId,
                expiresAt
            });

            await formToken.save();

            const url = createFormURL(newToken);

            return {
                success: true,
                token: newToken,
                url,
                expiresAt,
                recordId: id
            };

        } catch (error) {
            console.error('Error generando URL de edición:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    })

    // Listar todas las fichas médicas
    .get('/records', async ({ jwt, request, set, query }) => {
        const authResult = await authMiddleware({ jwt, request, set });
        if (authResult) return authResult;

        try {
            const page = parseInt(query.page as string) || 1;
            const limit = parseInt(query.limit as string) || 20;
            const skip = (page - 1) * limit;

            const records = await MedicalRecord.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-__v');

            const total = await MedicalRecord.countDocuments();

            return {
                success: true,
                records,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };

        } catch (error) {
            console.error('Error listando fichas:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    })

    // Ver ficha específica
    .get('/records/:id', async ({ params: { id }, jwt, request, set }) => {
        const authResult = await authMiddleware({ jwt, request, set });
        if (authResult) return authResult;

        try {
            const record = await MedicalRecord.findById(id);

            if (!record) {
                set.status = 404;
                return {
                    success: false,
                    message: 'Ficha no encontrada'
                };
            }

            return {
                success: true,
                record
            };

        } catch (error) {
            console.error('Error obteniendo ficha:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    })

    // Eliminar ficha
    .delete('/records/:id', async ({ params: { id }, jwt, request, set }) => {
        const authResult = await authMiddleware({ jwt, request, set });
        if (authResult) return authResult;

        try {
            const record = await MedicalRecord.findByIdAndDelete(id);

            if (!record) {
                set.status = 404;
                return {
                    success: false,
                    message: 'Ficha no encontrada'
                };
            }

            // Eliminar tokens asociados
            await FormToken.deleteMany({ recordId: id });

            return {
                success: true,
                message: 'Ficha eliminada exitosamente'
            };

        } catch (error) {
            console.error('Error eliminando ficha:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    })

    // Listar tokens generados
    .get('/tokens', async ({ jwt, request, set, query }) => {
        const authResult = await authMiddleware({ jwt, request, set });
        if (authResult) return authResult;

        try {
            const status = query.status as string;
            const filter: any = {};

            if (status && ['pending', 'submitted', 'expired'].includes(status)) {
                filter.status = status;
            }

            const tokens = await FormToken.find(filter)
                .sort({ createdAt: -1 })
                .limit(50)
                .populate('recordId', 'nombre')
                .populate('generatedBy', 'username');

            return {
                success: true,
                tokens
            };

        } catch (error) {
            console.error('Error listando tokens:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    })

    // Estadísticas
    .get('/stats', async ({ jwt, request, set }) => {
        const authResult = await authMiddleware({ jwt, request, set });
        if (authResult) return authResult;

        try {
            const totalRecords = await MedicalRecord.countDocuments();
            const totalTokens = await FormToken.countDocuments();
            const pendingTokens = await FormToken.countDocuments({ status: 'pending' });
            const submittedTokens = await FormToken.countDocuments({ status: 'submitted' });
            const expiredTokens = await FormToken.countDocuments({ status: 'expired' });

            // Fichas creadas en los últimos 7 días
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentRecords = await MedicalRecord.countDocuments({
                createdAt: { $gte: sevenDaysAgo }
            });

            return {
                success: true,
                stats: {
                    totalRecords,
                    totalTokens,
                    pendingTokens,
                    submittedTokens,
                    expiredTokens,
                    recentRecords
                }
            };

        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    });
