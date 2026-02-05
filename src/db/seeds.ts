import { Admin } from '../models/Admin';

/**
 * Crea el administrador inicial para producción/despliegue.
 * Solo se ejecuta si AUTO_SEED_ADMIN=true y no hay administradores.
 */
export async function seedDefaultAdmin() {
    try {
        const autoSeed = process.env.AUTO_SEED_ADMIN === 'true';
        if (!autoSeed) return;

        const username = process.env.DEFAULT_ADMIN_USER;
        const password = process.env.DEFAULT_ADMIN_PASS;
        const email = process.env.DEFAULT_ADMIN_EMAIL;

        if (!username || !password) {
            console.log('⚠️ [Seed] Falta config DEFAULT_ADMIN_USER/PASS. Saltando.');
            return;
        }

        const adminExists = await Admin.countDocuments();
        if (adminExists > 0) return;

        const admin = new Admin({
            username: username.trim(),
            password,
            email: email?.trim() || undefined
        });

        await admin.save();
        console.log(`🚀 [Prod Seed] Administrador inicial creado: ${username}`);
    } catch (error) {
        console.error('❌ [Prod Seed] Error:', error);
    }
}
