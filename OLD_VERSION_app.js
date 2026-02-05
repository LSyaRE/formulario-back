// ==================== ESTADO DE LA APLICACIÓN ====================
let currentUser = null;
let currentRecordId = null;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkSession();
});

function initializeApp() {
    // Verificar si hay una sesión activa
    const session = localStorage.getItem('session');
    if (session) {
        const sessionData = JSON.parse(session);
        currentUser = sessionData.username;
        showScreen('main-screen');
        updateUserInfo();
        loadRecords();
    } else {
        showScreen('auth-screen');
    }
}

function setupEventListeners() {
    // Autenticación
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthForms('register');
    });
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthForms('login');
    });
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Navegación
    document.getElementById('new-record-btn').addEventListener('click', () => showNewRecordForm());
    document.getElementById('back-to-list').addEventListener('click', () => {
        showScreen('main-screen');
        loadRecords();
    });
    document.getElementById('cancel-form').addEventListener('click', () => {
        showScreen('main-screen');
        loadRecords();
    });

    // Formulario médico
    document.getElementById('medical-form').addEventListener('submit', handleFormSubmit);

    // Modal
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
}

// ==================== AUTENTICACIÓN ====================

function toggleAuthForms(form) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (form === 'register') {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    } else {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
        showNotification('Usuario no encontrado', 'error');
        return;
    }
    
    const hashedPassword = CryptoJS.SHA256(password).toString();
    
    if (user.password !== hashedPassword) {
        showNotification('Contraseña incorrecta', 'error');
        return;
    }
    
    // Crear sesión
    currentUser = username;
    localStorage.setItem('session', JSON.stringify({ username, timestamp: Date.now() }));
    
    showNotification('¡Bienvenido!', 'success');
    showScreen('main-screen');
    updateUserInfo();
    loadRecords();
    
    // Limpiar formulario
    document.getElementById('loginForm').reset();
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;
    
    if (!username || !password || !confirmPassword) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (username.length < 3) {
        showNotification('El usuario debe tener al menos 3 caracteres', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    const users = getUsers();
    
    if (users.find(u => u.username === username)) {
        showNotification('El usuario ya existe', 'error');
        return;
    }
    
    // Crear nuevo usuario
    const hashedPassword = CryptoJS.SHA256(password).toString();
    users.push({ username, password: hashedPassword });
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('¡Cuenta creada exitosamente!', 'success');
    toggleAuthForms('login');
    
    // Limpiar formulario
    document.getElementById('registerForm').reset();
}

function handleLogout() {
    localStorage.removeItem('session');
    currentUser = null;
    showScreen('auth-screen');
    showNotification('Sesión cerrada', 'info');
}

function checkSession() {
    const session = localStorage.getItem('session');
    if (session) {
        const sessionData = JSON.parse(session);
        // Verificar si la sesión tiene más de 24 horas
        const dayInMs = 24 * 60 * 60 * 1000;
        if (Date.now() - sessionData.timestamp > dayInMs) {
            handleLogout();
        }
    }
}

function updateUserInfo() {
    document.getElementById('user-info').textContent = `Usuario: ${currentUser}`;
}

// ==================== GESTIÓN DE USUARIOS ====================

function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// ==================== ENCRIPTACIÓN ====================

function encryptData(data, password) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
}

function decryptData(encryptedData, password) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, password);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Error al desencriptar datos:', error);
        return null;
    }
}

// ==================== GESTIÓN DE FICHAS ====================

function getRecords() {
    const key = `records_${currentUser}`;
    const encryptedRecords = localStorage.getItem(key);
    
    if (!encryptedRecords) {
        return [];
    }
    
    // Usar el nombre de usuario como clave de encriptación
    const decrypted = decryptData(encryptedRecords, currentUser);
    return decrypted || [];
}

function saveRecords(records) {
    const key = `records_${currentUser}`;
    const encrypted = encryptData(records, currentUser);
    localStorage.setItem(key, encrypted);
}

function loadRecords() {
    const records = getRecords();
    const recordsList = document.getElementById('records-list');
    const emptyState = document.getElementById('empty-state');
    
    if (records.length === 0) {
        recordsList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    recordsList.innerHTML = records.map(record => createRecordCard(record)).join('');
    
    // Agregar event listeners a las tarjetas
    records.forEach(record => {
        const card = document.querySelector(`[data-record-id="${record.id}"]`);
        if (card) {
            card.querySelector('.record-card-content').addEventListener('click', () => editRecord(record.id));
            card.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                confirmDelete(record.id);
            });
        }
    });
}

function createRecordCard(record) {
    const date = new Date(record.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <div class="record-card" data-record-id="${record.id}">
            <div class="record-card-content">
                <div class="record-header">
                    <div class="record-info">
                        <h3>${record.data.nombre || 'Sin nombre'}</h3>
                        <div class="record-meta">Creado: ${date}</div>
                    </div>
                    <div class="record-actions">
                        <button class="icon-btn delete-btn" title="Eliminar">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 8v8M10 8v8M14 8v8M3 5h14M8 5V3h4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="record-details">
                    ${record.data.fechaNacimiento ? `<div class="detail-item">📅 <strong>Nacimiento:</strong> ${new Date(record.data.fechaNacimiento).toLocaleDateString('es-ES')}</div>` : ''}
                    ${record.data.sexo ? `<div class="detail-item">👤 <strong>Sexo:</strong> ${record.data.sexo}</div>` : ''}
                    ${record.data.tipoSangre ? `<div class="detail-item">🩸 <strong>Tipo de sangre:</strong> ${record.data.tipoSangre}</div>` : ''}
                </div>
            </div>
        </div>
    `;
}

function showNewRecordForm() {
    currentRecordId = null;
    document.getElementById('form-title').textContent = 'Nueva Ficha Médica';
    document.getElementById('medical-form').reset();
    document.getElementById('record-id').value = '';
    showScreen('form-screen');
}

function editRecord(recordId) {
    const records = getRecords();
    const record = records.find(r => r.id === recordId);
    
    if (!record) {
        showNotification('Ficha no encontrada', 'error');
        return;
    }
    
    currentRecordId = recordId;
    document.getElementById('form-title').textContent = 'Editar Ficha Médica';
    document.getElementById('record-id').value = recordId;
    
    // Llenar el formulario con los datos
    fillFormWithData(record.data);
    
    showScreen('form-screen');
}

function fillFormWithData(data) {
    // Información general
    document.getElementById('nombre').value = data.nombre || '';
    document.getElementById('fecha-nacimiento').value = data.fechaNacimiento || '';
    if (data.sexo) {
        document.querySelector(`input[name="sexo"][value="${data.sexo}"]`).checked = true;
    }
    document.getElementById('funcion').value = data.funcion || '';
    document.getElementById('estado-civil').value = data.estadoCivil || '';
    
    // Plan de salud
    document.getElementById('plan-salud').value = data.planSalud || '';
    document.getElementById('nombre-plan').value = data.nombrePlan || '';
    document.getElementById('tarjeta-salud').value = data.tarjetaSalud || '';
    document.getElementById('organismo-salud').value = data.organismoSalud || '';
    document.getElementById('tipo-sangre').value = data.tipoSangre || '';
    
    // Historial de enfermedades
    if (data.enfermedades && Array.isArray(data.enfermedades)) {
        data.enfermedades.forEach(enfermedad => {
            const checkbox = document.querySelector(`input[name="enfermedad"][value="${enfermedad}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // Condiciones médicas
    if (data.transfusion) {
        document.querySelector(`input[name="transfusion"][value="${data.transfusion}"]`).checked = true;
    }
    
    if (data.cardiaco) {
        document.querySelector(`input[name="cardiaco"][value="${data.cardiaco}"]`).checked = true;
        toggleMedicationField('cardiaco-med', data.cardiaco === 'Sí');
    }
    document.getElementById('cardiaco-med').value = data.cardiacoMed || '';
    
    if (data.diabetes) {
        document.querySelector(`input[name="diabetes"][value="${data.diabetes}"]`).checked = true;
        toggleMedicationField('diabetes-med', data.diabetes === 'Sí');
    }
    document.getElementById('diabetes-med').value = data.diabetesMed || '';
    
    if (data.renal) {
        document.querySelector(`input[name="renal"][value="${data.renal}"]`).checked = true;
        toggleMedicationField('renal-med', data.renal === 'Sí');
    }
    document.getElementById('renal-med').value = data.renalMed || '';
    
    if (data.psicologico) {
        document.querySelector(`input[name="psicologico"][value="${data.psicologico}"]`).checked = true;
        toggleMedicationField('psicologico-med', data.psicologico === 'Sí');
    }
    document.getElementById('psicologico-med').value = data.psicologicoMed || '';
    
    // Alergias
    if (data.alergiaPiel) {
        document.querySelector(`input[name="alergia-piel"][value="${data.alergiaPiel}"]`).checked = true;
    }
    if (data.alergiaAlimentos) {
        document.querySelector(`input[name="alergia-alimentos"][value="${data.alergiaAlimentos}"]`).checked = true;
    }
    if (data.alergiaMedicamentos) {
        document.querySelector(`input[name="alergia-medicamentos"][value="${data.alergiaMedicamentos}"]`).checked = true;
    }
    document.getElementById('lista-alergias').value = data.listaAlergias || '';
    document.getElementById('medicamentos-alergias').value = data.medicamentosAlergias || '';
    
    // Eventos recientes
    if (data.problemasRecientes) {
        document.querySelector(`input[name="problemas-recientes"][value="${data.problemasRecientes}"]`).checked = true;
    }
    document.getElementById('medicamentos-recientes').value = data.medicamentosRecientes || '';
    if (data.lesionGrave) {
        document.querySelector(`input[name="lesion-grave"][value="${data.lesionGrave}"]`).checked = true;
    }
    if (data.fractura) {
        document.querySelector(`input[name="fractura"][value="${data.fractura}"]`).checked = true;
    }
    document.getElementById('tiempo-inmovilizado').value = data.tiempoInmovilizado || '';
    document.getElementById('cirugias').value = data.cirugias || '';
    document.getElementById('hospitalizacion').value = data.hospitalizacion || '';
    
    // Discapacidad
    if (data.discapacidades && Array.isArray(data.discapacidades)) {
        data.discapacidades.forEach(discapacidad => {
            const checkbox = document.querySelector(`input[name="discapacidad"][value="${discapacidad}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    document.getElementById('observacion-discapacidad').value = data.observacionDiscapacidad || '';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = collectFormData();
    const records = getRecords();
    
    if (currentRecordId) {
        // Actualizar ficha existente
        const index = records.findIndex(r => r.id === currentRecordId);
        if (index !== -1) {
            records[index].data = formData;
            records[index].updatedAt = new Date().toISOString();
        }
        showNotification('Ficha actualizada exitosamente', 'success');
    } else {
        // Crear nueva ficha
        const newRecord = {
            id: generateId(),
            data: formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        records.push(newRecord);
        showNotification('Ficha creada exitosamente', 'success');
    }
    
    saveRecords(records);
    showScreen('main-screen');
    loadRecords();
}

function collectFormData() {
    return {
        // Información general
        nombre: document.getElementById('nombre').value,
        fechaNacimiento: document.getElementById('fecha-nacimiento').value,
        sexo: document.querySelector('input[name="sexo"]:checked')?.value || '',
        funcion: document.getElementById('funcion').value,
        estadoCivil: document.getElementById('estado-civil').value,
        
        // Plan de salud
        planSalud: document.getElementById('plan-salud').value,
        nombrePlan: document.getElementById('nombre-plan').value,
        tarjetaSalud: document.getElementById('tarjeta-salud').value,
        organismoSalud: document.getElementById('organismo-salud').value,
        tipoSangre: document.getElementById('tipo-sangre').value,
        
        // Historial de enfermedades
        enfermedades: Array.from(document.querySelectorAll('input[name="enfermedad"]:checked'))
            .map(cb => cb.value),
        
        // Condiciones médicas
        transfusion: document.querySelector('input[name="transfusion"]:checked')?.value || '',
        cardiaco: document.querySelector('input[name="cardiaco"]:checked')?.value || '',
        cardiacoMed: document.getElementById('cardiaco-med').value,
        diabetes: document.querySelector('input[name="diabetes"]:checked')?.value || '',
        diabetesMed: document.getElementById('diabetes-med').value,
        renal: document.querySelector('input[name="renal"]:checked')?.value || '',
        renalMed: document.getElementById('renal-med').value,
        psicologico: document.querySelector('input[name="psicologico"]:checked')?.value || '',
        psicologicoMed: document.getElementById('psicologico-med').value,
        
        // Alergias
        alergiaPiel: document.querySelector('input[name="alergia-piel"]:checked')?.value || '',
        alergiaAlimentos: document.querySelector('input[name="alergia-alimentos"]:checked')?.value || '',
        alergiaMedicamentos: document.querySelector('input[name="alergia-medicamentos"]:checked')?.value || '',
        listaAlergias: document.getElementById('lista-alergias').value,
        medicamentosAlergias: document.getElementById('medicamentos-alergias').value,
        
        // Eventos recientes
        problemasRecientes: document.querySelector('input[name="problemas-recientes"]:checked')?.value || '',
        medicamentosRecientes: document.getElementById('medicamentos-recientes').value,
        lesionGrave: document.querySelector('input[name="lesion-grave"]:checked')?.value || '',
        fractura: document.querySelector('input[name="fractura"]:checked')?.value || '',
        tiempoInmovilizado: document.getElementById('tiempo-inmovilizado').value,
        cirugias: document.getElementById('cirugias').value,
        hospitalizacion: document.getElementById('hospitalizacion').value,
        
        // Discapacidad
        discapacidades: Array.from(document.querySelectorAll('input[name="discapacidad"]:checked'))
            .map(cb => cb.value),
        observacionDiscapacidad: document.getElementById('observacion-discapacidad').value
    };
}

function confirmDelete(recordId) {
    const records = getRecords();
    const record = records.find(r => r.id === recordId);
    
    if (!record) return;
    
    showModal(
        'Eliminar Ficha',
        `¿Estás seguro de que deseas eliminar la ficha de "${record.data.nombre || 'Sin nombre'}"? Esta acción no se puede deshacer.`,
        () => deleteRecord(recordId)
    );
}

function deleteRecord(recordId) {
    const records = getRecords();
    const filteredRecords = records.filter(r => r.id !== recordId);
    saveRecords(filteredRecords);
    loadRecords();
    showNotification('Ficha eliminada', 'info');
}

// ==================== UTILIDADES ====================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
    });
    
    // Color según el tipo
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showModal(title, message, onConfirm) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    
    modal.classList.add('active');
    
    const confirmBtn = document.getElementById('modal-confirm');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        closeModal();
    });
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Agregar estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
