/**
 * Valida los datos del formulario médico
 */
export function validateMedicalRecord(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Campos requeridos
    if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
        errors.push('El nombre es requerido');
    }

    if (!data.fechaNacimiento) {
        errors.push('La fecha de nacimiento es requerida');
    } else {
        const fecha = new Date(data.fechaNacimiento);
        if (isNaN(fecha.getTime())) {
            errors.push('La fecha de nacimiento no es válida');
        }
    }

    if (!data.sexo || !['Masculino', 'Femenino', 'Otro'].includes(data.sexo)) {
        errors.push('El sexo es requerido y debe ser Masculino, Femenino u Otro');
    }

    // Validar tipo de sangre si se proporciona
    if (data.tipoSangre && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''].includes(data.tipoSangre)) {
        errors.push('Tipo de sangre no válido');
    }

    // Validar arrays
    if (data.enfermedades && !Array.isArray(data.enfermedades)) {
        errors.push('Enfermedades debe ser un array');
    }

    if (data.discapacidades && !Array.isArray(data.discapacidades)) {
        errors.push('Discapacidades debe ser un array');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Sanitiza los datos del formulario
 */
export function sanitizeMedicalRecord(data: any): any {
    return {
        // Información General
        nombre: data.nombre?.trim() || '',
        fechaNacimiento: data.fechaNacimiento,
        sexo: data.sexo || '',
        funcion: data.funcion?.trim() || '',
        estadoCivil: data.estadoCivil || '',

        // Plan de Salud
        planSalud: data.planSalud?.trim() || '',
        nombrePlan: data.nombrePlan?.trim() || '',
        tarjetaSalud: data.tarjetaSalud?.trim() || '',
        organismoSalud: data.organismoSalud?.trim() || '',
        tipoSangre: data.tipoSangre || '',

        // Historial de Enfermedades
        enfermedades: Array.isArray(data.enfermedades) ? data.enfermedades : [],

        // Condiciones Médicas
        transfusion: data.transfusion || '',
        cardiaco: data.cardiaco || '',
        cardiacoMed: data.cardiacoMed || '',
        diabetes: data.diabetes || '',
        diabetesMed: data.diabetesMed || '',
        renal: data.renal || '',
        renalMed: data.renalMed || '',
        psicologico: data.psicologico || '',
        psicologicoMed: data.psicologicoMed || '',

        // Alergias
        alergiaPiel: data.alergiaPiel || '',
        alergiaAlimentos: data.alergiaAlimentos || '',
        alergiaMedicamentos: data.alergiaMedicamentos || '',
        listaAlergias: data.listaAlergias || '',
        medicamentosAlergias: data.medicamentosAlergias?.trim() || '',

        // Eventos Recientes
        problemasRecientes: data.problemasRecientes || '',
        medicamentosRecientes: data.medicamentosRecientes || '',
        lesionGrave: data.lesionGrave || '',
        fractura: data.fractura || '',
        tiempoInmovilizado: data.tiempoInmovilizado?.trim() || '',
        cirugias: data.cirugias || '',
        hospitalizacion: data.hospitalizacion || '',

        // Discapacidad
        discapacidades: Array.isArray(data.discapacidades) ? data.discapacidades : [],
        observacionDiscapacidad: data.observacionDiscapacidad || ''
    };
}
