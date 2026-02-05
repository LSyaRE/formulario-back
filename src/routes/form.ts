import { Elysia, t } from 'elysia';
import { FormToken } from '../models/FormToken';
import { MedicalRecord } from '../models/MedicalRecord';
import { isValidTokenFormat } from '../utils/token';
import { validateMedicalRecord, sanitizeMedicalRecord } from '../utils/validation';

export const formRoutes = new Elysia({ prefix: '/api/form' })

    // Validar token y obtener datos si es edición
    .get('/validate/:token', async ({ params: { token }, set }) => {
        try {
            if (!isValidTokenFormat(token)) {
                set.status = 400;
                return {
                    success: false,
                    message: 'Formato de token inválido'
                };
            }

            const formToken = await FormToken.findOne({ token }).populate('recordId');

            if (!formToken) {
                set.status = 404;
                return {
                    success: false,
                    message: 'Token no encontrado'
                };
            }

            if (!formToken.isValid()) {
                set.status = 403;
                return {
                    success: false,
                    message: formToken.status === 'submitted'
                        ? 'Este enlace ya fue utilizado'
                        : 'Este enlace ha expirado'
                };
            }

            // Si tiene recordId, es una edición
            if (formToken.recordId) {
                const record = await MedicalRecord.findById(formToken.recordId);

                if (!record) {
                    set.status = 404;
                    return {
                        success: false,
                        message: 'Ficha no encontrada'
                    };
                }

                return {
                    success: true,
                    isEdit: true,
                    data: record
                };
            }

            // Es un formulario nuevo
            return {
                success: true,
                isEdit: false
            };

        } catch (error) {
            console.error('Error validando token:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    })

    // Enviar formulario
    .post('/:token', async ({ params: { token }, body, set }) => {
        try {
            if (!isValidTokenFormat(token)) {
                set.status = 400;
                return {
                    success: false,
                    message: 'Formato de token inválido'
                };
            }

            const formToken = await FormToken.findOne({ token });

            if (!formToken) {
                set.status = 404;
                return {
                    success: false,
                    message: 'Token no encontrado'
                };
            }

            if (!formToken.isValid()) {
                set.status = 403;
                return {
                    success: false,
                    message: formToken.status === 'submitted'
                        ? 'Este enlace ya fue utilizado'
                        : 'Este enlace ha expirado'
                };
            }

            // Validar datos
            const validation = validateMedicalRecord(body);
            if (!validation.valid) {
                set.status = 400;
                return {
                    success: false,
                    message: 'Datos inválidos',
                    errors: validation.errors
                };
            }

            // Sanitizar datos
            const sanitizedData = sanitizeMedicalRecord(body);

            let record;

            // Si es edición
            if (formToken.recordId) {
                record = await MedicalRecord.findByIdAndUpdate(
                    formToken.recordId,
                    {
                        ...sanitizedData,
                        lastTokenUsed: token,
                        $inc: { submissionCount: 1 }
                    },
                    { new: true }
                );

                if (!record) {
                    set.status = 404;
                    return {
                        success: false,
                        message: 'Ficha no encontrada'
                    };
                }
            } else {
                // Crear nueva ficha
                record = new MedicalRecord({
                    ...sanitizedData,
                    lastTokenUsed: token,
                    submissionCount: 1
                });
                await record.save();
            }

            // Marcar token como usado
            await formToken.markAsSubmitted();

            return {
                success: true,
                message: formToken.recordId ? 'Ficha actualizada exitosamente' : 'Ficha creada exitosamente',
                recordId: record._id
            };

        } catch (error) {
            console.error('Error enviando formulario:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Error del servidor'
            };
        }
    }, {
        body: t.Object({
            nombre: t.String(),
            fechaNacimiento: t.String(),
            sexo: t.String(),
            funcion: t.Optional(t.String()),
            estadoCivil: t.Optional(t.String()),
            planSalud: t.Optional(t.String()),
            nombrePlan: t.Optional(t.String()),
            tarjetaSalud: t.Optional(t.String()),
            organismoSalud: t.Optional(t.String()),
            tipoSangre: t.Optional(t.String()),
            enfermedades: t.Optional(t.Array(t.String())),
            transfusion: t.Optional(t.String()),
            cardiaco: t.Optional(t.String()),
            cardiacoMed: t.Optional(t.String()),
            diabetes: t.Optional(t.String()),
            diabetesMed: t.Optional(t.String()),
            renal: t.Optional(t.String()),
            renalMed: t.Optional(t.String()),
            psicologico: t.Optional(t.String()),
            psicologicoMed: t.Optional(t.String()),
            alergiaPiel: t.Optional(t.String()),
            alergiaAlimentos: t.Optional(t.String()),
            alergiaMedicamentos: t.Optional(t.String()),
            listaAlergias: t.Optional(t.String()),
            medicamentosAlergias: t.Optional(t.String()),
            problemasRecientes: t.Optional(t.String()),
            medicamentosRecientes: t.Optional(t.String()),
            lesionGrave: t.Optional(t.String()),
            fractura: t.Optional(t.String()),
            tiempoInmovilizado: t.Optional(t.String()),
            cirugias: t.Optional(t.String()),
            hospitalizacion: t.Optional(t.String()),
            discapacidades: t.Optional(t.Array(t.String())),
            observacionDiscapacidad: t.Optional(t.String())
        })
    });
