// ==========================================================================
// components/Configuracoes/configuracoes.js
// Controla a lógica da página de configurações (Versão completa PWA - SEM TEMA).
// ==========================================================================

console.log("Script configuracoes.js (Versão Completa, sem Tema) carregado.");

// --- Variáveis de Estado (Simulação do React) ---
let isEditing = false;
let isModalOpen = false;
let userProfileData = {
    nome: 'Tenente Amanda Ferreira', // Nome padrão corrigido
    email: 'amanda.ferreira@cbm.pe.gov.br', // E-mail padrão corrigido
    matricula: '20240001',
    telefone: '(81) 98765-4321',
    unidade: 'Grupamento de Bombeiros da Região Metropolitana do Recife',
    // O campo 'backup' será criado em initializeData
};

// --- Referências aos Elementos DOM ---
// Perfil
const userNameEl = document.getElementById("user-name");
const userEmailEl = document.getElementById("user-email");
const editBtn = document.getElementById("button-edit-profile");
const editFooter = document.getElementById("edit-footer");
const cancelEditBtn = document.getElementById("button-cancel-edit");
const saveEditBtn = document.getElementById("button-save-edit");
const inputNome = document.getElementById("input-nome");
const inputEmail = document.getElementById("input-email"); // Novo campo de E-mail
const inputMatricula = document.getElementById("input-matricula");
const inputTelefone = document.getElementById("input-telefone");
const inputUnidade = document.getElementById("input-unidade");

// Modal de Senha
const openModalBtn = document.getElementById("open-modal-password");
const modalOverlay = document.getElementById("modal-overlay");
const modalCloseBtn = document.getElementById("modal-close");
const cancelPasswordBtn = document.getElementById("button-cancel-password");
const savePasswordBtn = document.getElementById("button-save-password");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const togglePasswordBtns = document.querySelectorAll(".toggle-password");


// --- Funções Auxiliares ---

/** Função para carregar dados iniciais e salvar um backup. */
function initializeData() {
    // Tenta carregar dados da sessão, senão usa os defaults
    const storedData = JSON.parse(sessionStorage.getItem("userProfileData")) || userProfileData;
    userProfileData = storedData;

    // Preenche os campos de exibição e inputs
    userNameEl.textContent = userProfileData.nome;
    userEmailEl.textContent = userProfileData.email;
    
    inputNome.value = userProfileData.nome;
    // Adicionado o E-mail ao input
    if (inputEmail) inputEmail.value = userProfileData.email; 
    
    inputMatricula.value = userProfileData.matricula;
    inputTelefone.value = userProfileData.telefone;
    inputUnidade.value = userProfileData.unidade;

    // Guarda uma cópia de backup para o "Cancelar"
    userProfileData.backup = { ...userProfileData };
}

/** Função que atualiza o estado de edição da página. */
function setEditing(isEditingMode) {
    isEditing = isEditingMode;
    // Apenas Nome e Telefone são editáveis
    const inputs = [inputNome, inputTelefone]; 

    // Alterna o atributo 'disabled' e a visibilidade dos botões
    inputs.forEach(input => input.disabled = !isEditing);

    if (isEditing) {
        editBtn.style.display = 'none';
        editFooter.style.display = 'flex';
    } else {
        editBtn.style.display = 'flex';
        editFooter.style.display = 'none';
    }
}

/** Função para abrir/fechar o modal. */
function setModalOpen(isOpen) {
    isModalOpen = isOpen;
    if (isOpen) {
        modalOverlay.style.display = 'flex';
        // Limpar campos de senha ao abrir
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
    } else {
        modalOverlay.style.display = 'none';
    }
}

/** Função para alternar entre mostrar/ocultar senha. */
function togglePasswordVisibility(button) {
    const targetId = button.getAttribute('data-target');
    const targetInput = document.getElementById(targetId);
    const eyeIcon = button.querySelector('.eye-icon');

    // Alterna o tipo de input
    const isVisible = targetInput.type === 'text';
    targetInput.type = isVisible ? 'password' : 'text';

    // Alterna o ícone SVG (simulando a troca de Paths do componente React)
    const iconPath = isVisible 
        ? '<path d="M1 12C2.73 16.11 7.03 20 12 20s9.27-3.89 11-8c-1.73-4.11-6.03-8-11-8S2.73 7.89 1 12z" /><circle cx="12" cy="12" r="3" />' // Olho Aberto
        : '<path d="M1 1l22 22" stroke="currentColor" /><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7.03 20 2.73 16.11 1 12c.69-1.58 1.76-3.04 3.1-4.34m3.45-2.54A10.94 10.94 0 0 1 12 4c4.97 0 9.27 3.89 11 8-1.05 2.38-2.79 4.46-4.94 6.01" />'; // Olho Fechado (com barra)
    
    eyeIcon.innerHTML = iconPath;
}


// --- Lógica de Eventos ---

// 1. Lógica de Edição de Perfil
if (editBtn && cancelEditBtn && saveEditBtn) {
    editBtn.addEventListener('click', () => setEditing(true));

    cancelEditBtn.addEventListener('click', () => {
        // Volta aos valores de backup e desativa edição
        inputNome.value = userProfileData.backup.nome;
        inputTelefone.value = userProfileData.backup.telefone;
        setEditing(false);
    });

    saveEditBtn.addEventListener('click', () => {
        // 1. Coleta os novos dados
        const newNome = inputNome.value;
        const newTelefone = inputTelefone.value;

        // 2. Atualiza o estado
        userProfileData.nome = newNome;
        userProfileData.telefone = newTelefone;

        // 3. Atualiza a tela (Header)
        userNameEl.textContent = newNome;

        // 4. Atualiza o backup e Salva no sessionStorage (Simulação)
        userProfileData.backup = { ...userProfileData };
        sessionStorage.setItem("userProfileData", JSON.stringify(userProfileData));
        
        alert("Perfil atualizado com sucesso!");
        setEditing(false);
    });
}

// 2. Lógica do Modal de Senha
if (openModalBtn && modalCloseBtn && cancelPasswordBtn && savePasswordBtn) {
    openModalBtn.addEventListener('click', () => setModalOpen(true));
    modalCloseBtn.addEventListener('click', () => setModalOpen(false));
    cancelPasswordBtn.addEventListener('click', () => setModalOpen(false));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            setModalOpen(false); // Fecha ao clicar no overlay
        }
    });
    
    // Funcionalidade de Mostrar/Ocultar Senha
    togglePasswordBtns.forEach(button => {
        button.addEventListener('click', () => togglePasswordVisibility(button));
    });

    // Lógica de Salvar Senha (Simulação)
    savePasswordBtn.addEventListener('click', () => {
        const current = currentPasswordInput.value;
        const newPass = newPasswordInput.value;
        const confirmPass = confirmPasswordInput.value;
        
        // Simulação da validação da senha atual
        // Nota: A senha atual é salva no 'user' do app.js. Aqui, usaremos a senha padrão '1234' para a demo.
        const mockCurrentUser = JSON.parse(sessionStorage.getItem("loggedInUser")) || { senha: '1234' };
        const storedPassword = mockCurrentUser.senha || '1234';

        if (current !== storedPassword) {
            return alert("A senha atual digitada está incorreta.");
        }
        
        if (newPass.length < 4) {
            return alert("A nova senha deve ter pelo menos 4 caracteres.");
        }

        if (newPass !== confirmPass) {
            return alert("A nova senha e a confirmação não coincidem.");
        }
        
        // Se passar, simula a atualização da senha
        mockCurrentUser.senha = newPass;
        sessionStorage.setItem("loggedInUser", JSON.stringify(mockCurrentUser)); // Atualiza a senha na sessão
        
        alert("Senha alterada com sucesso (Simulação)!");
        setModalOpen(false);
    });
}

// --- Não há mais lógica de Alternar Tema aqui ---


// --- Inicialização ---
initializeData();
setEditing(false); // Garante que