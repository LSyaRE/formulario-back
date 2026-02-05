import { connectDB } from '../src/db/mongoose';
import { Admin } from '../src/models/Admin';

async function createAdmin() {
    try {
        await connectDB();

        console.log('\n🔐 Configuración de Administrador');

        // Leer de .env
        const defaultUser = process.env.DEFAULT_ADMIN_USER;
        const defaultPass = process.env.DEFAULT_ADMIN_PASS;
        const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;

        let username, password, email;

        if (defaultUser && defaultPass) {
            console.log(`\n📝 Usando credenciales detectadas en .env:`);
            console.log(`👤 Usuario: ${defaultUser}`);
            console.log(`📧 Email: ${defaultEmail || 'No proporcionado'}`);

            const confirm = prompt('\n¿Deseas crear el usuario con estos datos? (S/n): ') || 'S';
            if (confirm.toUpperCase() !== 'S') {
                console.log('Operación cancelada.');
                process.exit(0);
            }

            username = defaultUser;
            password = defaultPass;
            email = defaultEmail;
        } else {
            console.log('\n⚠️ No se detectaron credenciales en .env. Por favor, ingrésalas manualmente:');

            username = prompt('Nombre de usuario: ');
            if (!username || username.trim().length < 3) {
                console.error('❌ El nombre de usuario debe tener al menos 3 caracteres');
                process.exit(1);
            }

            password = prompt('Contraseña: ');
            if (!password || password.length < 6) {
                console.error('❌ La contraseña debe tener al menos 6 caracteres');
                process.exit(1);
            }

            email = prompt('Email (opcional): ');
        }

        // Verificar si el usuario ya existe
        const existingAdmin = await Admin.findOne({ username: username.trim() });
        if (existingAdmin) {
            console.log('\nℹ️ El usuario administrador ya existe en la base de datos.');
            const updateConfirm = prompt('¿Deseas actualizar su contraseña? (s/N): ') || 'N';

            if (updateConfirm.toLowerCase() === 's') {
                existingAdmin.password = password;
                if (email) existingAdmin.email = email.trim();
                await existingAdmin.save();
                console.log('✅ Contraseña actualizada correctamente.');
            }
            process.exit(0);
        }

        // Crear administrador
        const admin = new Admin({
            username: username.trim(),
            password,
            email: email?.trim() || undefined
        });

        await admin.save();

        console.log('\n✅ Administrador creado exitosamente!');
        console.log(`👤 Usuario: ${admin.username}`);
        console.log(`📧 Email: ${admin.email || 'No proporcionado'}`);
        console.log('\n🔑 Puedes iniciar sesión en: http://localhost:3000/admin.html\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error creando administrador:', error);
        process.exit(1);
    }
}

createAdmin();
