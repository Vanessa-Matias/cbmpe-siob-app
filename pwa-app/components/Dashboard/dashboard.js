// ==========================================================================
// components/Dashboard/dashboard.js
// Controla a lógica e a renderização dos dados do Dashboard (Versão Final).
// ==========================================================================

function initializeMockData() {
    const hasData = sessionStorage.getItem('ocorrencias');
    if (!hasData) {
        // AJUSTE: Adicionada uma ocorrência com status 'Pendente'.
        const mockOcorrencias = [
            { id: 'OCR-2025-004', tipo: 'Acidente', regiao: 'Recife', titulo: 'Colisão de veículos', status: 'Pendente' },
            { id: 'OCR-2025-003', tipo: 'Resgate', regiao: 'Olinda', titulo: 'Resgate em altura - Prédio Residencial', status: 'Em andamento' },
            { id: 'OCR-2025-002', tipo: 'Acidente', regiao: 'Jaboatão', titulo: 'Acidente de trânsito - BR-101', status: 'Em andamento' },
            { id: 'OCR-2025-001', tipo: 'Incêndio', regiao: 'Recife', titulo: 'Incêndio em Residência - Rua das Flores', status: 'Concluída' }
        ];
        sessionStorage.setItem('ocorrencias', JSON.stringify(mockOcorrencias));
    }
}

function renderDashboard() {
    initializeMockData();
    const ocorrencias = JSON.parse(sessionStorage.getItem('ocorrencias')) || [];

    // --- 1. ATUALIZA KPIs ---
    document.getElementById('kpi-hoje').textContent = ocorrencias.length;
    document.getElementById('kpi-andamento').textContent = ocorrencias.filter(o => o.status === 'Em andamento').length;
    document.getElementById('kpi-concluidas').textContent = ocorrencias.filter(o => o.status === 'Concluída').length;
    document.getElementById('kpi-tempo').textContent = "13.2min";

    // --- 2. ATUALIZA OCORRÊNCIAS POR TIPO ---
    const porTipo = { 'Incêndio': 0, 'Acidente': 0, 'Emergência Médica': 0, 'Resgate': 0, 'Vazamento': 0, 'Outros': 0 };
    ocorrencias.forEach(o => { if (porTipo[o.tipo] !== undefined) porTipo[o.tipo]++; });
    const listaTipoEl = document.getElementById('lista-por-tipo');
    listaTipoEl.innerHTML = Object.keys(porTipo).map(tipo => {
        const iconMap = { 'Incêndio': 'fa-fire', 'Acidente': 'fa-car-burst', 'Emergência Médica': 'fa-heart-pulse', 'Resgate': 'fa-life-ring', 'Vazamento': 'fa-droplet', 'Outros': 'fa-shapes' };
        const colorMap = { 'Incêndio': 'icon-fire', 'Acidente': 'icon-accident', 'Emergência Médica': 'icon-medical', 'Resgate': 'icon-rescue', 'Vazamento': 'icon-leak', 'Outros': 'icon-others' };
        return `<li><i class="fa-solid ${iconMap[tipo] || 'fa-shapes'} icon-type ${colorMap[tipo]}"></i> ${tipo} <span class="badge">${porTipo[tipo]}</span></li>`;
    }).join('');

    // --- 3. ATUALIZA OCORRÊNCIAS POR REGIÃO ---
    const porRegiao = { 'Recife': 0, 'Olinda': 0, 'Jaboatão': 0, 'Paulista': 0 };
    ocorrencias.forEach(o => { if (porRegiao[o.regiao] !== undefined) porRegiao[o.regiao]++; });
    const listaRegiaoEl = document.getElementById('lista-por-regiao');
    listaRegiaoEl.innerHTML = Object.keys(porRegiao).map(regiao => `
        <li><i class="fa-solid fa-map-pin icon-type icon-region"></i> ${regiao} <span class="badge">${porRegiao[regiao]}</span></li>
    `).join('');

    // --- 4. ATUALIZA OCORRÊNCIAS RECENTES ---
    const listaRecentesEl = document.getElementById('lista-recentes');
    listaRecentesEl.innerHTML = ocorrencias.slice(0, 3).map(o => {
        const iconMap = { 'Incêndio': 'fa-fire', 'Acidente': 'fa-car-burst', 'Emergência Médica': 'fa-heart-pulse', 'Resgate': 'fa-life-ring', 'Vazamento': 'fa-droplet', 'Outros': 'fa-shapes' };
        const colorMap = { 'Incêndio': 'icon-fire', 'Acidente': 'icon-accident', 'Emergência Médica': 'icon-medical', 'Resgate': 'icon-rescue', 'Vazamento': 'icon-leak', 'Outros': 'icon-others' };
        return `
            <li>
                <i class="fa-solid ${iconMap[o.tipo] || 'fa-shapes'} icon-type ${colorMap[o.tipo]}"></i>
                <div class="recent-details">
                    <span class="recent-code">${o.id}</span>
                    <span class="recent-title">${o.titulo}</span>
                    <span class="recent-location"><i class="fa-solid fa-map-pin"></i> ${o.regiao}</span>
                </div>
            </li>`;
    }).join('');

    // AJUSTE: Nova seção para calcular e renderizar os dados do Status Geral.
    // --- 5. ATUALIZA STATUS GERAL ---
    document.getElementById('status-pendentes').textContent = ocorrencias.filter(o => o.status === 'Pendente').length;
    document.getElementById('status-andamento').textContent = ocorrencias.filter(o => o.status === 'Em andamento').length;
    document.getElementById('status-concluidas').textContent = ocorrencias.filter(o => o.status === 'Concluída').length;
}

// Executa a renderização assim que o script for carregado.
renderDashboard();