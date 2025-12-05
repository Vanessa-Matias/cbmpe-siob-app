/**
 * @file OcorrenciasPage.tsx
 * @description Componente que renderiza a página de listagem e gerenciamento de ocorrências.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OcorrenciasPage.css';
import { FaPlus, FaMagnifyingGlass, FaPen } from 'react-icons/fa6'; 
import { api } from '../../lib/api'; // Importação da API

/**
 * Representa a estrutura de dados de uma única ocorrência.
 */
interface Ocorrencia {
    id: string; 
    tipo: string;
    status: 'Pendente' | 'Em andamento' | 'Concluída' | 'Cancelada' | 'Trote' | 'Ocorrência Básica'; 
    regiao: string;
    data: string; 
    prioridade: 'Alta' | 'Média' | 'Baixa' | string; 
    pontoBase?: string;
    numAviso?: string; 
}

// Dados estáticos de fallback (caso a API falhe)
const DADOS_ESTATICOS: Ocorrencia[] = [
    { id: 'sim-001', tipo: 'Incêndio em Edificação', status: 'Pendente', prioridade: 'Alta', regiao: 'Boa Viagem', data: '2025-01-20T12:40:00Z', pontoBase: 'B-2025001234', numAviso: 'OC-2025-001' },
    { id: 'sim-002', tipo: 'APH Acidente Trânsito', status: 'Em andamento', prioridade: 'Média', regiao: 'Imbiribeira', data: '2025-01-20T11:55:00Z', pontoBase: 'B-2025001235', numAviso: 'OC-2025-002' },
];

// Função auxiliar para normalizar status
const normalizarStatusParaBadge = (status: string) => {
    if (!status) return "Pendente";
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('finalizada') || statusLower.includes('concluída')) return "Concluída";
    if (statusLower.includes('em-andamento') || statusLower.includes('andamento')) return "Em andamento";
    if (statusLower.includes('pendente')) return "Pendente";
    if (statusLower.includes('cancelada')) return "Cancelada";
    if (statusLower.includes('trote')) return "Trote";
    
    return status; 
};

// Função auxiliar para normalizar prioridade
const normalizarPrioridade = (p: string) => {
    if (!p) return 'Média';
    const pLower = p.toLowerCase();
    if (pLower === 'alta') return 'Alta';
    if (pLower === 'media' || pLower === 'média') return 'Média';
    if (pLower === 'baixa') return 'Baixa';
    return p; 
};

// Função auxiliar para interpretar a natureza
const interpretarNatureza = (formularios: any): string => {
    if (!formularios) return 'Ocorrência Básica';
    if (formularios.incendio) return 'Incêndio';
    if (formularios.salvamento) return 'Salvamento';
    if (formularios.atdPreHospitalar) return 'APH';
    if (formularios.prevencao) return 'Prevenção';
    if (formularios.atividadeComunitaria) return 'Atividade Comunitária';
    if (formularios.formularioGerenciamento) return 'Gerenciamento';
    if (formularios.produtoPerigoso) return 'Produto Perigoso';
    return 'Ocorrência Básica';
};

/**
 * Componente funcional OcorrenciasPage.
 */
const OcorrenciasPage = () => {
    const navigate = useNavigate();
    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
    
    // Estados de carregamento e erro
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- LÓGICA DE CARREGAMENTO DA API ---
    const carregarOcorrencias = async () => {
        try {
            setLoading(true);
            setError('');
            
            // 1. Busca dados na API Real
            const response = await api.get('/ocorrencias');
            const listaBruta = response.data.data || [];

            if (listaBruta.length > 0) {
                // 2. Mapeia os dados do Backend para o formato do Frontend
                const mappedData: Ocorrencia[] = listaBruta.map((o: any) => {
                    const tipoCalculado = o.formulariosPreenchidos 
                        ? interpretarNatureza(o.formulariosPreenchidos) 
                        : (o.tipo || 'Ocorrência Básica');

                    const currentYear = new Date().getFullYear(); 

                    return ({
                        id: o.id || 'sem-id',
                        tipo: tipoCalculado,
                        status: normalizarStatusParaBadge(o.situacao || o.status || 'Pendente') as Ocorrencia['status'],
                        regiao: o.bairro || o.municipio || 'Região não inf.',
                        data: o.dataHora || o.data || new Date().toISOString(),
                        prioridade: normalizarPrioridade(o.prioridade),
                        pontoBase: o.pontoBase || '---',
                        numAviso: o.numAviso || `OCR-${currentYear}-${String(o.id).slice(-4)}`
                    });
                });
                setOcorrencias(mappedData);
            } else {
                setOcorrencias([]); 
            }
        } catch (e) {
            console.error("Erro ao carregar ocorrências da API:", e);
            setError("Não foi possível conectar ao servidor. Exibindo dados de exemplo.");
            setOcorrencias(DADOS_ESTATICOS); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarOcorrencias();
        // Listener para atualizar se houver mudanças locais (opcional)
        window.addEventListener("ocorrencias:updated", carregarOcorrencias);
        return () => window.removeEventListener("ocorrencias:updated", carregarOcorrencias);
    }, []);

    // --- HANDLERS DE NAVEGAÇÃO ---
    const handleNovaOcorrencia = () => {
        navigate('/formulario'); 
    };

    const handleEditarOcorrencia = (id: string) => {
        navigate(`/ocorrencia/${id}/formulario`);
    };

    // --- LÓGICA DE ORDENAÇÃO INTELIGENTE (Pendente > Andamento > Concluída) ---
    const getPesoStatus = (status: string) => {
        if (!status) return 4;
        const s = status.toLowerCase();
        
        if (s.includes("pendente")) return 1;
        if (s.includes("andamento")) return 2;
        if (s.includes("concluída") || s.includes("finalizada")) return 3;
        
        return 4; // Cancelada, Trote, etc
    };

    const ocorrenciasOrdenadas = ocorrencias.slice().sort((a, b) => {
        const pesoA = getPesoStatus(a.status);
        const pesoB = getPesoStatus(b.status);

        // 1. Critério Principal: Status (Menor peso ganha)
        if (pesoA !== pesoB) {
            return pesoA - pesoB;
        }

        // 2. Critério de Desempate: Data (Mais recente primeiro)
        return new Date(b.data).getTime() - new Date(a.data).getTime();
    });

    const tiposDeOcorrencia = [ "Todos os Tipos", "Incêndio", "APH", "Salvamento", "Gerenciamento", "Atividade Comunitária", "Produto Perigoso", "Prevenção", "Ocorrência Básica" ];
    const statusDeOcorrencia = ["Todos os Status", "Pendente", "Em andamento", "Concluída", "Cancelada", "Trote", "Ocorrência Básica"];
    const prioridadesDeOcorrencia = ["Todas as Prioridades", "Alta", "Média", "Baixa"];

    const [tipoSelecionado, setTipoSelecionado] = useState(tiposDeOcorrencia[0]);
    const [statusSelecionado, setStatusSelecionado] = useState(statusDeOcorrencia[0]);
    const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(prioridadesDeOcorrencia[0]);
    const [termoBusca, setTermoBusca] = useState(''); 

    const ocorrenciasFiltradas = ocorrenciasOrdenadas.filter(o => {
        const statusMatch = statusSelecionado === "Todos os Status" || o.status === statusSelecionado;
        const prioridadeMatch = prioridadeSelecionada === "Todas as Prioridades" || o.prioridade === prioridadeSelecionada;
        
        // Ajuste no filtro de tipo para ser mais flexível
        const tipoMatch = tipoSelecionado === "Todos os Tipos" || o.tipo.toLowerCase().includes(tipoSelecionado.toLowerCase().replace(' ', '')); 

        const buscaTermo = termoBusca.toLowerCase().trim();
        const buscaMatch = buscaTermo === '' || 
                           String(o.id).toLowerCase().includes(buscaTermo) ||
                           o.tipo.toLowerCase().includes(buscaTermo) ||
                           o.regiao.toLowerCase().includes(buscaTermo) ||
                           (o.numAviso && o.numAviso.toLowerCase().includes(buscaTermo));

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

            {/* Mensagem de Erro Discreta */}
            {error && <div style={{ color: 'orange', marginBottom: '10px', fontSize: '0.9rem' }}>⚠️ {error}</div>}

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
                
                {loading ? (
                    <p style={{ padding: '20px', textAlign: 'center' }}>Carregando ocorrências...</p>
                ) : (
                    <>
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
                                        <td data-label="Aviso (ID)">{ocorrencia.numAviso}</td> 
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
                    </>
                )}
            </div>
        </div>
    );
};

export default OcorrenciasPage;