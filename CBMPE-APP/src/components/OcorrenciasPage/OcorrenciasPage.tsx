/**
 * @file OcorrenciasPage.tsx
 * @description Componente que renderiza a página de listagem e gerenciamento de ocorrências.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OcorrenciasPage.css';
import { FaPlus, FaMagnifyingGlass, FaPen } from 'react-icons/fa6'; // FaUpload removido

/**
 * Representa a estrutura de dados de uma única ocorrência (adaptada do Dashboard).
 */
interface Ocorrencia {
    id: string; // ID interno, essencial para o Modo Edição
    tipo: string;
    // CORREÇÃO: Adicionando 'Ocorrência Básica' e usando o texto completo dos status
    status: 'Pendente' | 'Em andamento' | 'Concluída' | 'Cancelada' | 'Trote' | 'Ocorrência Básica'; 
    regiao: string;
    data: string; // ISO string do registro
    prioridade: 'Alta' | 'Média' | 'Baixa' | string; // Adicionado Prioridade
    // Campos adicionais do formulário para exibir na lista:
    pontoBase?: string;
    numAviso?: string; // Campo que conterá o ID formatado (OC-YYYY-NNN)
}

// Dados estáticos iniciais (Serão substituídos pelos dados do localStorage)
const DADOS_ESTATICOS: Ocorrencia[] = [
    { id: 'sim-001', tipo: 'Incêndio em Edificação', status: 'Pendente', prioridade: 'Alta', regiao: 'Boa Viagem', data: '2025-01-20T12:40:00Z', pontoBase: 'B-2025001234', numAviso: 'OC-2025-001' },
    { id: 'sim-002', tipo: 'APH Acidente Trânsito', status: 'Em andamento', prioridade: 'Média', regiao: 'Imbiribeira', data: '2025-01-20T11:55:00Z', pontoBase: 'B-2025001235', numAviso: 'OC-2025-002' },
    { id: 'sim-003', tipo: 'Salvamento Aquático', status: 'Concluída', prioridade: 'Baixa', regiao: 'Madalena', data: '2025-01-20T11:15:00Z', pontoBase: 'B-2025001236', numAviso: 'OC-2025-003' },
];

// FUNÇÃO DE NORMALIZAÇÃO DE STATUS PARA EXIBIÇÃO (CRUCIAL PARA A EDIÇÃO)
const normalizarStatusParaBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    // CORREÇÃO: Mapeia para o nome completo esperado pela Interface e CSS
    if (statusLower.includes('finalizada') || statusLower.includes('concluída')) {
        return "Concluída";
    } else if (statusLower.includes('em-andamento') || statusLower.includes('andamento')) {
        return "Em andamento";
    } else if (statusLower.includes('pendente')) {
        return "Pendente";
    } else if (statusLower.includes('cancelada')) {
        return "Cancelada";
    } else if (statusLower.includes('trote')) {
        return "Trote";
    }
    return status;
};


/**
 * Componente funcional OcorrenciasPage.
 */
const OcorrenciasPage = () => {
    const navigate = useNavigate();
    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
    
    // NOVA FUNÇÃO (Adicionar em OcorrenciasPage.tsx)
// Esta função "lê" o objeto 'formulariosPreenchidos' e retorna o nome da natureza
const interpretarNatureza = (formularios: any): string => {
    if (!formularios) return 'Ocorrência Básica';

    if (formularios.incendio) return 'Incêndio';
    if (formularios.salvamento) return 'Salvamento';
    if (formularios.atdPreHospitalar) return 'APH';
    if (formularios.prevencao) return 'Prevenção';
    if (formularios.atividadeComunitaria) return 'Atividade Comunitária';
    if (formularios.formularioGerenciamento) return 'Gerenciamento';
    if (formularios.produtoPerigoso) return 'Produto Perigoso';
    
    return 'Ocorrência Básica'; // Caso nenhum esteja marcado
};

    // --- LÓGICA DE CARREGAMENTO E SINCRONIZAÇÃO PWA ---

    const carregarOcorrencias = () => {
        const data = localStorage.getItem("ocorrencias");
        const currentYear = new Date().getFullYear(); 
        
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                
                const finalData = parsedData.length > 0 ? parsedData : DADOS_ESTATICOS;
                
                // CORRIGIDO: O .map() agora lê os campos corretos salvos pelo formulário
                        const mappedData: Ocorrencia[] = finalData.map((o: any) => {

                            // 1. Interpreta a natureza (Bug da Natureza)
                            const tipoCalculado = interpretarNatureza(o.formulariosPreenchidos);

                            // 2. Lê o status (Bug do Status)
                            // Tenta ler 'o.situacao' (do form) ou 'o.status' (dos dados estáticos)
                            const statusLido = o.situacao || o.status || 'Pendente';

                            return ({
                                id: o.id || 'sim-' + Math.random().toString(36).substring(2, 9),

                                // CORRIGIDO:
                                tipo: tipoCalculado,

                                // CORRIGIDO:
                                status: normalizarStatusParaBadge(statusLido) as Ocorrencia['status'],

                                regiao: o.regiao || 'Recife',
                                data: o.data || new Date().toISOString(),

                                // Prioridade (já estava correta)
                                prioridade: o.prioridade || 'Média',

                                numAviso: o.numAviso || `OCR-${currentYear}-${o.id?.slice(-4).toUpperCase() || 'XXX'}`
                            });
                        });

                setOcorrencias(mappedData);
            } catch (e) {
                console.error("Erro ao carregar ocorrências do localStorage:", e);
                setOcorrencias(DADOS_ESTATICOS as Ocorrencia[]); 
            }
        } else {
            setOcorrencias(DADOS_ESTATICOS as Ocorrencia[]);
        }
    };

    useEffect(() => {
        carregarOcorrencias(); 

        const atualizar = () => carregarOcorrencias();
        window.addEventListener("ocorrencias:updated", atualizar);

        return () => window.removeEventListener("ocorrencias:updated", atualizar);
    }, []);

    // --- HANDLERS DE NAVEGAÇÃO E LÓGICA DE FILTROS (INALTERADOS) ---
    const handleNovaOcorrencia = () => {
        navigate('/formulario'); 
    };

    const handleEditarOcorrencia = (id: string) => {
        navigate(`/ocorrencia/${id}/formulario`);
    };


    // --- LÓGICA DE ORDENAÇÃO E FILTROS ---
    const ocorrenciasOrdenadas = ocorrencias.slice().sort((a, b) => {
        return new Date(b.data).getTime() - new Date(a.data).getTime();
    });

    const tiposDeOcorrencia = [ "Todos os Tipos",
    "Incêndio",
    "APH",
    "Salvamento",
    "Gerenciamento",
    "Atividade Comunitária",
    "Produto Perigoso",
    "Prevenção",
    "Ocorrência Básica"
    ];
    const statusDeOcorrencia = ["Todos os Status", "Pendente", "Em andamento", "Concluída", "Cancelada", "Trote", "Ocorrência Básica"];
    const prioridadesDeOcorrencia = ["Todas as Prioridades", "Alta", "Média", "Baixa"];

    const [tipoSelecionado, setTipoSelecionado] = useState(tiposDeOcorrencia[0]);
    const [statusSelecionado, setStatusSelecionado] = useState(statusDeOcorrencia[0]);
    const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(prioridadesDeOcorrencia[0]);
    const [termoBusca, setTermoBusca] = useState(''); 

    const ocorrenciasFiltradas = ocorrenciasOrdenadas.filter(o => {
        const statusMatch = statusSelecionado === "Todos os Status" || o.status === statusSelecionado;
        const prioridadeMatch = prioridadeSelecionada === "Todas as Prioridades" || o.prioridade === prioridadeSelecionada;
        
        const tipoMatch = tipoSelecionado === "Todos os Tipos" || o.tipo.includes(tipoSelecionado.replace(' ', '')); 

        const buscaTermo = termoBusca.toLowerCase().trim();
        const buscaMatch = buscaTermo === '' || 
                           o.id.toLowerCase().includes(buscaTermo) ||
                           o.tipo.toLowerCase().includes(buscaTermo) ||
                           o.regiao.toLowerCase().includes(buscaTermo) ||
                           o.numAviso?.toLowerCase().includes(buscaTermo);

        return statusMatch && prioridadeMatch && tipoMatch && buscaMatch; 
    });


    // --- RENDERIZAÇÃO ---
    return (
        <div className="page-container">
            <header className="page-header">
                <div className="page-title">
                    <h2>Ocorrências</h2>
                    <p>Gerencie todas as ocorrências registradas no sistema</p>
                </div>
                <div className="page-actions">
                    <button className="button-primary" onClick={handleNovaOcorrencia}>
                        <FaPlus /> Nova Ocorrência
                    </button>
                </div>
            </header>

            {/* Card de Filtro e Busca */}
            <div className="filter-card">
                <h3>Filtro e Busca</h3>
                <p>Use o filtro para encontrar ocorrências específicas</p>
                <div className="filter-inputs">
                    <div className="search-input-wrapper">
                        <FaMagnifyingGlass className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Buscar por Aviso (ID), tipo ou região..."
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                    </div>
                    <select value={tipoSelecionado} onChange={(e) => setTipoSelecionado(e.target.value)}>
                        {tiposDeOcorrencia.map((tipo) => (<option key={tipo} value={tipo}>{tipo}</option>))}
                    </select>
                    <select value={statusSelecionado} onChange={(e) => setStatusSelecionado(e.target.value)}>
                        {statusDeOcorrencia.map((status) => (<option key={status} value={status}>{status}</option>))}
                    </select>
                    <select value={prioridadeSelecionada} onChange={(e) => setPrioridadeSelecionada(e.target.value)}>
                        {prioridadesDeOcorrencia.map((prioridade) => (<option key={prioridade} value={prioridade}>{prioridade}</option>))}
                    </select>
                </div>
            </div>

            {/* Card da Lista de Ocorrências */}
            <div className="list-card">
                <h3>Lista de Ocorrências ({ocorrenciasFiltradas.length} {ocorrenciasFiltradas.length === 1 ? 'total' : 'totais'})</h3>
                <table className="ocorrencias-table">
                    <thead>
                        <tr>
                            <th>Aviso (ID)</th>
                            <th>Tipo</th>
                            <th>Região</th>
                            <th>Status</th>
                            <th>Prioridade</th>
                            <th>Data/Hora</th>
                            <th>Ações</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {ocorrenciasFiltradas.map((ocorrencia) => (
                            <tr key={ocorrencia.id}>
                                <td data-label="Aviso (ID)">{ocorrencia.numAviso || `ID Interno: ${ocorrencia.id.slice(-4)}`}</td> 
                                <td data-label="Tipo">{ocorrencia.tipo}</td>
                                <td data-label="Região">{ocorrencia.regiao}</td>
                                <td data-label="Status">
                                    <span className={`status-badge status-${ocorrencia.status.toLowerCase().replace(/[\s\/]/g, '-')}`}>{ocorrencia.status}</span>
                                </td>
                                <td data-label="Prioridade">
                                    <span className={`prioridade-badge prioridade-${ocorrencia.prioridade.toLowerCase()}`}>{ocorrencia.prioridade}</span>
                                </td>
                                <td data-label="Data/Hora">
                                    <div className="data-hora-container">
                                        <span>{new Date(ocorrencia.data).toLocaleDateString('pt-BR')}</span>
                                        <small>{new Date(ocorrencia.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>
                                    </div>
                                </td>
                                <td data-label="Ações">
                                    <button 
                                        className="button-action"
                                        onClick={() => handleEditarOcorrencia(ocorrencia.id)}
                                    >
                                        <FaPen size={14} /> Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {ocorrenciasFiltradas.length === 0 && (
                            <tr>
                                <td colSpan={7} className="no-results">
                                    Nenhuma ocorrência encontrada com os filtros e busca aplicados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                <footer className="table-footer">
                    <span className="pagination-info">Exibindo {ocorrenciasFiltradas.length} ocorrência(s)</span>
                </footer>
            </div>
        </div>
    );
};

export default OcorrenciasPage;