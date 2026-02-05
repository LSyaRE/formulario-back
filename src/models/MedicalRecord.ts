import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalRecord extends Document {
    // Información General
    nombre: string;
    fechaNacimiento: Date;
    sexo: string;
    funcion?: string;
    estadoCivil?: string;

    // Plan de Salud
    planSalud?: string;
    nombrePlan?: string;
    tarjetaSalud?: string;
    organismoSalud?: string;
    tipoSangre?: string;

    // Historial de Enfermedades
    enfermedades: string[];

    // Condiciones Médicas
    transfusion?: string;
    cardiaco?: string;
    cardiacoMed?: string;
    diabetes?: string;
    diabetesMed?: string;
    renal?: string;
    renalMed?: string;
    psicologico?: string;
    psicologicoMed?: string;

    // Alergias
    alergiaPiel?: string;
    alergiaAlimentos?: string;
    alergiaMedicamentos?: string;
    listaAlergias?: string;
    medicamentosAlergias?: string;

    // Eventos Recientes
    problemasRecientes?: string;
    medicamentosRecientes?: string;
    lesionGrave?: string;
    fractura?: string;
    tiempoInmovilizado?: string;
    cirugias?: string;
    hospitalizacion?: string;

    // Discapacidad
    discapacidades: string[];
    observacionDiscapacidad?: string;

    // Metadata
    lastTokenUsed?: string;
    submissionCount: number;
}

const medicalRecordSchema = new Schema<IMedicalRecord>({
    // Información General
    nombre: { type: String, required: true, trim: true },
    fechaNacimiento: { type: Date, required: true },
    sexo: {
        type: String,
        enum: ['Masculino', 'Femenino', 'Otro'],
        required: true
    },
    funcion: { type: String, trim: true },
    estadoCivil: {
        type: String,
        enum: ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', '']
    },

    // Plan de Salud
    planSalud: { type: String, trim: true },
    nombrePlan: { type: String, trim: true },
    tarjetaSalud: { type: String, trim: true },
    organismoSalud: { type: String, trim: true },
    tipoSangre: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
    },

    // Historial de Enfermedades
    enfermedades: [{ type: String }],

    // Condiciones Médicas
    transfusion: { type: String, enum: ['Sí', 'No', ''] },
    cardiaco: { type: String, enum: ['Sí', 'No', ''] },
    cardiacoMed: { type: String },
    diabetes: { type: String, enum: ['Sí', 'No', ''] },
    diabetesMed: { type: String },
    renal: { type: String, enum: ['Sí', 'No', ''] },
    renalMed: { type: String },
    psicologico: { type: String, enum: ['Sí', 'No', ''] },
    psicologicoMed: { type: String },

    // Alergias
    alergiaPiel: { type: String, enum: ['Sí', 'No', ''] },
    alergiaAlimentos: { type: String, enum: ['Sí', 'No', ''] },
    alergiaMedicamentos: { type: String, enum: ['Sí', 'No', ''] },
    listaAlergias: { type: String },
    medicamentosAlergias: { type: String, trim: true },

    // Eventos Recientes
    problemasRecientes: { type: String, enum: ['Sí', 'No', ''] },
    medicamentosRecientes: { type: String },
    lesionGrave: { type: String, enum: ['Sí', 'No', ''] },
    fractura: { type: String, enum: ['Sí', 'No', ''] },
    tiempoInmovilizado: { type: String, trim: true },
    cirugias: { type: String },
    hospitalizacion: { type: String },

    // Discapacidad
    discapacidades: [{ type: String }],
    observacionDiscapacidad: { type: String },

    // Metadata
    lastTokenUsed: { type: String },
    submissionCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Índices para búsqueda
medicalRecordSchema.index({ nombre: 'text' });
medicalRecordSchema.index({ createdAt: -1 });

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);
