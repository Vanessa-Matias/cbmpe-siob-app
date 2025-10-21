// ==========================================================================
// components/ListaOcorrencias/lista-ocorrencias.js
// ATUALIZADO: Corrige a perda dos dados mock e garante a fusão dos dados locais.
// ==========================================================================

console.log("Script lista-ocorrencias.js carregado.");

// --- Referências aos Elementos do DOM ---
const container = document.getElementById('lista-de-ocorrencias-container');
const loadingMessage = document.getElementById('loading-message');
const btnNovaOcorrencia = document.getElementById('btn-nova-ocorrencia');
const filtroStatus = document.getElementById('filtro-status');
const filtroTipo = document.getElementById('filtro-tipo');
const filtroPrioridade = document.getElementById('filtro-prioridade');
const filtroBuscaTexto = document.getElementById('filtro-busca-texto');

// --- Dados Mock Iniciais ---
function initializeMockOcorrencias() {
    console.log("Verificando sessionStorage para 'ocorrencias'...");
    
    // CORREÇÃO: A lista mock só é criada se não existir (evita apagar a cada navegação)
    if (!sessionStorage.getItem('ocorrencias')) {
        const mockOcorrencias = [
            { id: 'OCR-2025-001', tipo: 'Incêndio', regiao: 'Recife - Centro', titulo: 'Incêndio em Residência', status: 'Pendente', prioridade: 'Alta', data: '20/10/2025', hora: '12:40', equipe: 'Aguardando' },
            { id: 'OCR-2025-002', tipo: 'Emergência Médica', regiao: 'Jaboatão', titulo: 'Acidente - BR-101', status: 'Em andamento', prioridade: 'Média', data: '20/10/2025', hora: '11:55', equipe: 'Sgt. Oliveira' },
            { id: 'OCR-2025-003', tipo: 'Acidente', regiao: 'Olinda', titulo: 'Mal Súbito', status: 'Concluída', prioridade: 'Baixa', data: '20/10/2025', hora: '11:15', equipe: 'Sgt. Oliveira' },
            { id: 'OCR-2025-004', tipo: 'Resgate', regiao: 'Recife', titulo: 'Resgate em altura', status: 'Concluída', prioridade: 'Baixa', data: '20/10/2025', hora: '11:15', equipe: 'Sgt. Oliveira' },
        ];
        sessionStorage.setItem('ocorrencias', JSON.stringify(mockOcorrencias));
        console.log("Dados mock criados:", mockOcorrencias);
    }
}

// --- Função para Gerar uma Linha da Tabela (mantida) ---
function criarLinhaOcorrencia(ocorrencia) {
    const statusMap = {
        'Pendente': 'status-pendente',
        'Em andamento': 'status-em-andamento',
        'Encerrado': 'status-encerrado',
        'Concluída': 'status-encerrado',
        'Salvo Localmente': 'status-local', 
        'pronto': 'status-completo', // Novo status do Formulário Incêndio
    };

    const status = ocorrencia.status || 'N/D';
    const statusClass = statusMap[status] || 'status-encerrado';
    
    const tipo = ocorrencia.natureza || ocorrencia.tipo || 'N/D';
    const titulo = ocorrencia.titulo || ocorrencia.local || 'Sem Título';
    const regiao = ocorrencia.regiao || 'Local (Offline)'; 
    const equipe = ocorrencia.equipe || 'Usuário Local'; 
    const prioridade = ocorrencia.prioridade || 'Média'; 
    
    const data = ocorrencia.data || 'N/D';
    const hora = ocorrencia.hora || '';
    const dataHora = (data !== 'N/D')
        ? `${data}${hora ? `<br><small>${hora}</small>` : ''}`
        : 'N/D';

    const rowClass = (status === 'Salvo Localmente' || status === 'pronto') ? 'local-row-highlight' : '';

    return `
        <tr class="${rowClass}">
            <td data-label="ID" class="font-bold">${ocorrencia.aviso || ocorrencia.id || 'N/D'}</td>
            <td data-label="Tipo">${tipo}</td>
            <td data-label="Título" class="titulo-coluna font-bold">${titulo}</td>
            <td data-label="Status"><span class="status-badge ${statusClass}">${status}</span></td>
            <td data-label="Prioridade">${prioridade}</td>
            <td data-label="Região">${regiao}</td>
            <td data-label="Data/Hora">${dataHora}</td>
            <td data-label="Equipe">${equipe}</td>
            <td data-label="Ações" class="acoes-coluna">
                <div class="acoes-botoes">
                    <button class="btn-acao btn-editar" data-id="${ocorrencia.id || ocorrencia.aviso}">
                        <i class="fa-solid fa-pencil fa-xs mr-1"></i>Editar
                    </button>
                    <button class="btn-acao btn-excluir" data-id="${ocorrencia.id || ocorrencia.aviso}">
                        <i class="fa-solid fa-trash fa-xs mr-1"></i>Excluir
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// --- Renderização da Lista (mantida) ---
function renderListaOcorrencias() {
    if (!container) {
        console.error("ERRO: container da lista não encontrado!");
        return;
    }
    if (loadingMessage) loadingMessage.remove();

    let todasOcorrencias = JSON.parse(sessionStorage.getItem('ocorrencias')) || [];

    // Puxa os registros salvos localmente pelo Formulário Básico
    const ocorrenciasLocais = JSON.parse(localStorage.getItem('ocorrenciasPendentes')) || [];
    
    // Adiciona os registros locais no início da lista
    todasOcorrencias = ocorrenciasLocais.reverse().concat(todasOcorrencias);

    const statusSelecionado = filtroStatus?.value || 'Todos';
    const tipoSelecionado = filtroTipo?.value || 'Todos';
    const prioridadeSelecionada = filtroPrioridade?.value || 'Todas';
    const textoBusca = filtroBuscaTexto?.value.toLowerCase() || '';

    const ocorrenciasFiltradas = todasOcorrencias.filter(ocorrencia => {
        const status = ocorrencia.status || 'N/D';
        const tipo = ocorrencia.natureza || ocorrencia.tipo || 'N/D'; 
        const prioridade = ocorrencia.prioridade || 'N/D';
        const id = ocorrencia.aviso || ocorrencia.id || '';
        const titulo = ocorrencia.titulo || ocorrencia.local || '';
        const regiao = ocorrencia.regiao || 'Local (Offline)';
        const equipe = ocorrencia.equipe || 'Usuário Local';

        const matchStatus = statusSelecionado === 'Todos' || status === statusSelecionado;
        const matchTipo = tipoSelecionado === 'Todos' || tipo.toUpperCase().includes(tipoSelecionado.toUpperCase());
        const matchPrioridade = prioridadeSelecionada === 'Todas' || prioridade === prioridadeSelecionada;
        const matchTexto =
            !textoBusca ||
            id.toLowerCase().includes(textoBusca) ||
            titulo.toLowerCase().includes(textoBusca) ||
            regiao.toLowerCase().includes(textoBusca) ||
            equipe.toLowerCase().includes(textoBusca);

        return matchStatus && matchTipo && matchPrioridade && matchTexto;
    });

    if (ocorrenciasFiltradas.length === 0) {
        container.innerHTML = `
            <p style="color: var(--color-muted); text-align: center; padding: 20px;">
                Nenhuma ocorrência encontrada com os filtros selecionados.
            </p>
        `;
        return;
    }

    container.innerHTML = `
        <table class="ocorrencias-table">
            <thead>
                <tr>
                    <th>ID</th><th>Tipo</th><th>Título</th><th>Status</th>
                    <th>Prioridade</th><th>Região</th><th>Data/Hora</th><th>Equipe</th><th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${ocorrenciasFiltradas.map(criarLinhaOcorrencia).join('')}
            </tbody>
        </table>
        <footer class="table-footer">
            <span class="pagination-info">
                Exibindo ${ocorrenciasFiltradas.length} de ${todasOcorrencias.length} ocorrências
            </span>
            <div class="pagination-controls">
                <button disabled>&lt;</button>
                <span>1-${ocorrenciasFiltradas.length}</span>
                <button disabled>&gt;</button>
            </div>
        </footer>
    `;
}

// --- Botão "Nova Ocorrência" (INTEGRAÇÃO COM app.js) ---
if (btnNovaOcorrencia) {
    btnNovaOcorrencia.addEventListener('click', () => {
        console.log("Botão 'Nova Ocorrência' clicado.");
        
        if (typeof loadContent === 'function') {
            loadContent(
                './components/Formularios/FormularioBasico/formulario-basico.html', 
                './components/Formularios/FormularioBasico/formulario-basico.js'
            );
        } else {
            console.error("Função de navegação (loadContent) não encontrada. Verifique o app.js.");
        }
    });
}

// --- Eventos de Edição e Exclusão (mantidos) ---
if (container) {
    container.addEventListener('click', (event) => {
        const btnEditar = event.target.closest('.btn-editar');
        const btnExcluir = event.target.closest('.btn-excluir');
        const ocorrenciaId = btnEditar?.dataset.id || btnExcluir?.dataset.id;
        
        if (!ocorrenciaId) return;

        const removeOcorrencia = (storage, key, id) => {
             let itens = JSON.parse(storage.getItem(key)) || [];
             const itensAtualizados = itens.filter(o => o.id != id && o.aviso != id);
             storage.setItem(key, JSON.stringify(itensAtualizados));
             return itens.length !== itensAtualizados.length; 
        };
        
        if (btnEditar) {
            alert(`Funcionalidade "Editar" para ${ocorrenciaId} ainda não implementada. (Status: OK para PI)`);
        }

        if (btnExcluir) {
            if (confirm(`Tem certeza que deseja excluir a ocorrência ${ocorrenciaId}?`)) {
                
                let removed = removeOcorrencia(localStorage, 'ocorrenciasPendentes', ocorrenciaId);
                
                if (!removed) {
                    removeOcorrencia(sessionStorage, 'ocorrencias', ocorrenciaId);
                }
                
                renderListaOcorrencias(); 
            }
        }
    });
}

// --- Eventos de Filtro (mantidos) ---
if (filtroStatus) filtroStatus.addEventListener('change', renderListaOcorrencias);
if (filtroTipo) filtroTipo.addEventListener('change', renderListaOcorrencias);
if (filtroPrioridade) filtroPrioridade.addEventListener('change', renderListaOcorrencias);
if (filtroBuscaTexto) filtroBuscaTexto.addEventListener('input', renderListaOcorrencias);

// --- Execução Inicial ---
initializeMockOcorrencias();
renderListaOcorrencias();

window.renderListaOcorrencias = renderListaOcorrencias;