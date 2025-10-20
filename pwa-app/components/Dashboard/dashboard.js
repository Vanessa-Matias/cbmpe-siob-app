/**
 * @file dashboard.js
 * @description Preenche o dashboard com dados de exemplo (mock) e ícones SVG,
 * replicando exatamente o visual da versão web em React.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- ÍCONES SVG ---
    // Estes são os SVGs exatos dos ícones que você usa na sua versão React.
    const icons = {
        kpiOcorrencias: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M256 32L0 480H512L256 32zm0 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-32-128V160h64v128h-64z"/></svg>`,
        kpiAndamento: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>`,
        kpiConcluidas: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM371.8 195.8l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L224 280.1l119-119c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`,
        kpiTempo: `<svg viewBox="0 0 512 512" fill="currentColor"><path d="M160 32C71.6 32 0 103.6 0 192v160c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V320h48c35.3 0 64-28.7 64-64V192c0-88.4-71.6-160-160-160H160zm0 64h192c53 0 96 43 96 96s-43 96-96 96H288v32H64V192c0-53 43-96 96-96z"/></svg>`,
        fire: `<svg class="icon-type icon-fire" viewBox="0 0 24 24"><path d="M17.5 2C15.17 2 13.33 3.83 13.33 6.17c0 1.54.83 2.89 2.08 3.59C14.13 10.9 12 13.25 12 16c0 1.46.54 2.8 1.44 3.82-2 .8-4.44.25-5.59-1.32C6.7 16.9 6 14.56 6 12c0-3.33 2.67-6 6-6 .55 0 1.08.08 1.59.22C13.21 4.7 14.2 3.5 15.5 2.5 16.17 2.17 16.83 2 17.5 2z"/></svg>`,
        accident: `<svg class="icon-type icon-accident" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
        medical: `<svg class="icon-type icon-medical" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
        rescue: `<svg class="icon-type icon-rescue" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`
    };

    // --- DADOS DE EXEMPLO (MOCK DATA) ---
    const mockData = {
        kpis: [
              { selector: '.kpi-red', value: 8, details: 'Registradas nas últimas 24h', comparison: '↓12% vs. mês anterior', icon: icons.kpiOcorrencias },
              { selector: '.kpi-yellow', value: 8, details: 'Equipes mobilizadas', comparison: '↓5% vs. mês anterior', icon: icons.kpiAndamento },
              { selector: '.kpi-green', value: 231, details: 'Este mês', comparison: '↑18% vs. mês anterior', icon: icons.kpiConcluidas },
              { selector: '.kpi-blue', value: '12.5min', details: 'Respostas das equipes', comparison: '↓3% vs. mês anterior', icon: icons.kpiTempo }
        ],
        ocorrenciasPorTipo: [
            { tipo: 'Incêndio', quantidade: 1, icon: icons.fire },
            { tipo: 'Acidente', quantidade: 1, icon: icons.accident },
            { tipo: 'Emergência Médica', quantidade: 1, icon: icons.medical }
        ],
        recentes: [
            { codigo: 'OCR-2025-001', titulo: 'Incêndio em Residência', local: 'Recife - Centro', tipoIcon: icons.fire },
            { codigo: 'OCR-2025-002', titulo: 'Acidente de trânsito - BR-101', local: 'Jaboatão dos Guararapes', tipoIcon: icons.accident },
            { codigo: 'OCR-2025-003', titulo: 'Resgate em altura', local: 'Olinda', tipoIcon: icons.rescue }
        ]
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    function renderKPIs() {
        mockData.kpis.forEach(kpi => {
            const card = document.querySelector(kpi.id);
            if (card) {
                // Limpa o conteúdo do kpi-info antes de adicionar os novos
                const infoContainer = card.querySelector('.kpi-info');
                const existingTitle = infoContainer.querySelector('.kpi-title')?.textContent || '';
                infoContainer.innerHTML = `
                    <span class="kpi-title">${existingTitle}</span>
                    <span class="kpi-value">${kpi.value}</span>
                    <p class="kpi-sub">${kpi.details}</p>
                    <p class="kpi-compare">${kpi.comparison}</p>
                `;
                // Inserir o ícone decorativo dentro da div .kpi-deco, se existir
                let deco = card.querySelector('.kpi-deco');
                if (!deco) {
                    deco = document.createElement('div');
                    deco.className = 'kpi-deco';
                    card.appendChild(deco);
                }
                deco.innerHTML = kpi.icon;
            }
        });
    }

    function renderTipos() {
        const container = document.getElementById('byTypeContainer');
        if (!container) return;

        let html = '';
        mockData.ocorrenciasPorTipo.forEach(item => {
            html += `
                <div class="type-item">
                    <div class="type-icon">${item.icon}</div>
                    <div class="type-text">
                      <div class="type-label">${item.tipo}</div>
                      <div class="type-sub">Distribuição no mês atual</div>
                    </div>
                    <div style="margin-left:auto;font-weight:700">${item.quantidade}</div>
                </div>`;
        });
        container.innerHTML = html;
    }

    function renderRecentes() {
        const list = document.getElementById('recentList');
        if (!list) return;

        let html = '';
        mockData.recentes.forEach(item => {
            html += `
                <li>
                    ${item.tipoIcon}
                    <div class="recent-details">
                        <span class="recent-code">${item.codigo}</span>
                        <span class="recent-title">${item.titulo}</span>
                        <span class="recent-location">${item.local}</span>
                    </div>
                </li>`;
        });
        list.innerHTML = html;
    }

    // --- EXECUÇÃO ---
    renderKPIs();
    renderTipos();
    renderRecentes();
    // Se o lucide estiver disponível (script incluído), recriar ícones inline (caso use data-lucide)
    try {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    } catch (err) {
        console.warn('lucide.createIcons() falhou:', err);
    }

        // --- SIDEBAR: abrir / fechar e preencher usuário ---
        const sidebarContainer = document.getElementById('sidebarContainer');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const logoutSidebarBtn = document.getElementById('logoutSidebarBtn');
        const sidebarUserName = document.getElementById('sidebarUserName');

        function openSidebar() { sidebarContainer.classList.add('open'); }
        function closeSidebar() { sidebarContainer.classList.remove('open'); }

        if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
        if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
        if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

        // preencher nome do usuário a partir do localStorage
        try {
            const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
            if (user && user.nome && sidebarUserName) sidebarUserName.textContent = user.nome;
        } catch (e) { /* ignore */ }

        if (logoutSidebarBtn) {
            logoutSidebarBtn.addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                window.location.href = '../../index.html';
            });
        }
});

