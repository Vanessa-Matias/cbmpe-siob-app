// ==========================================================================
// app.js - Script Principal da Aplicação SIOB
// CORREÇÃO FINAL: Garante que a biblioteca SignaturePad seja carregada globalmente.
// ==========================================================================

// --- Adiciona a biblioteca SignaturePad ao HEAD ANTES de tudo ---
(function() {
    const signatureScript = document.createElement('script');
    signatureScript.src = 'https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js';
    signatureScript.id = 'signature-pad-cdn';
    // Coloca a tag no head do documento para carregar o mais rápido possível
    document.head.appendChild(signatureScript);
})();


document.addEventListener('DOMContentLoaded', () => {

    // --- Módulo de Autenticação ---
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }

    // --- Módulo de Gerenciamento do DOM ---
    const mainContent = document.getElementById('main-content');
    const sidebarContainer = document.getElementById('sidebar-container');
    const menuToggle = document.getElementById('menu-toggle');

    // --- Módulo de Tema ---
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIconSidebar = document.getElementById('theme-toggle-btn-sidebar')?.querySelector('i');
        if (themeIconSidebar) {
            themeIconSidebar.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        sessionStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    // --- Módulo de Roteamento ---
    window.loadContent = async (page, script) => {
        try {
            const response = await fetch(page);
            if (!response.ok) throw new Error(`Página não encontrada: ${page}`);
            const pageHTML = await response.text();
            
            mainContent.innerHTML = pageHTML;

            // Lógica do CSS:
            const cssPath = page.replace('.html', '.css');

            document.querySelectorAll('link[rel="stylesheet"][data-dynamic]').forEach(link => {
                link.remove();
            });

            const styleTag = document.createElement('link');
            styleTag.rel = 'stylesheet';
            styleTag.href = cssPath;
            styleTag.setAttribute('data-dynamic', 'true');
            document.head.appendChild(styleTag);


            // Lógica do Script: Carrega o JS associado
            if (script) {
                // Remove qualquer script antigo para evitar conflitos
                mainContent.querySelectorAll('script').forEach(s => s.remove());
                
                // Remove o script anterior (se for o caso)
                const oldScript = document.querySelector(`script[src="${script}"]`);
                if (oldScript) oldScript.remove(); 

                const scriptTag = document.createElement('script');
                scriptTag.src = script;
                scriptTag.defer = true;
                mainContent.appendChild(scriptTag);
            }
        } catch (error) {
            console.error('Erro ao carregar a página:', error);
            mainContent.innerHTML = `<p>Erro ao carregar o conteúdo. Tente novamente.</p>`;
        }
    };

    // --- Módulo do Sidebar ---
    const loadSidebar = async () => {
        try {
            const response = await fetch('./components/Sidebar/sidebar.html');
            sidebarContainer.innerHTML = await response.text();
            sidebarContainer.classList.add('sidebar-container');
            addSidebarEventListeners();
            populateUserInfo();
            applyTheme(sessionStorage.getItem('theme') || 'light');
        } catch (error) {
            console.error('Erro ao carregar o sidebar:', error);
        }
    };

    const toggleSidebar = (isOpen) => {
        sidebarContainer.classList.toggle('open', isOpen);
    };

    const addSidebarEventListeners = () => {
        document.getElementById('sidebar-close-btn')?.addEventListener('click', () => toggleSidebar(false));
        sidebarContainer.querySelector('.sidebar-overlay')?.addEventListener('click', () => toggleSidebar(false));
        document.getElementById('logout-btn-sidebar')?.addEventListener('click', logout);
        document.getElementById('theme-toggle-btn-sidebar')?.addEventListener('click', toggleTheme);

        // Adiciona eventos de clique para a navegação da SPA.
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                
                if (target === '#dashboard') {
                    window.loadContent('./components/Dashboard/dashboard.html', './components/Dashboard/dashboard.js');
                } else if (target === '#ocorrencias') {
                    window.loadContent('./components/ListaOcorrencias/lista-ocorrencias.html', './components/ListaOcorrencias/lista-ocorrencias.js');
                } else if (target === '#configuracoes') {
                    window.loadContent('./components/Configuracao/configuracao.html', './components/Configuracao/configuracao.js');
                }

                toggleSidebar(false);
            });
        });
    };

    // --- Módulo de Usuário ---
    const populateUserInfo = () => {
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');

        const NOME_CORRETO = "Tenente Amanda";
        const CARGO_CORRETO = "Chefe de Guarnição";

        if (userName && userRole && userAvatar) {
            userName.textContent = NOME_CORRETO;
            userRole.textContent = CARGO_CORRETO;
            userAvatar.textContent = NOME_CORRETO.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
    };

    const logout = () => {
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('theme');
        window.location.href = 'index.html';
    };

    // --- Ponto de Entrada da Aplicação ---
    const initialize = () => {
        const savedTheme = sessionStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);

        menuToggle.addEventListener('click', () => toggleSidebar(true));

        loadSidebar();
        window.loadContent('./components/Dashboard/dashboard.html', './components/Dashboard/dashboard.js');
    };

    initialize();
});