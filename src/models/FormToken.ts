import mongoose, { Schema, Document, Types } from 'mongoose';

export type TokenStatus = 'pending' | 'submitted' | 'expired';

export interface IFormToken extends Document {
    token: string;
    status: TokenStatus;
    recordId?: Types.ObjectId;
    generatedBy: Types.ObjectId;
    expiresAt?: Date;
    submittedAt?: Date;
    isValid(): boolean;
    markAsSubmitted(): Promise<void>;
}

const formTokenSchema = new Schema<IFormToken>({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'expired'],
        default: 'pending',
        required: true
    },
    recordId: {
        type: Schema.Types.ObjectId,
        ref: 'MedicalRecord',
        default: null
    },
    generatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    expiresAt: {
        type: Date
    },
    submittedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Índice TTL para expiración automática (opcional)
formTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Método para verificar si el token es válido
formTokenSchema.methods.isValid = function (): boolean {
    if (this.status !== 'pending') {
        return false;
    }

    if (this.expiresAt && this.expiresAt < new Date()) {
        this.status = 'expired';
        this.save();
        return false;
    }

    return true;
};

// Método para marcar como enviado
formTokenSchema.methods.markAsSubmitted = async function (): Promise<void> {
    this.status = 'submitted';
    this.submittedAt = new Date();
    await this.save();
};

export const FormToken = mongoose.model<IFormToken>('FormToken', formTokenSchema);
