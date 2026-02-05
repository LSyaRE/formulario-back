import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-records';

export async function connectDB() {
    console.log('MONGODB_URI');
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  Desconectado de MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('❌ Error en MongoDB:', error);
});
