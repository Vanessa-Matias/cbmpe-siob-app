// ==========================================================================
// DashboardContent.tsx (Versão Atualizada e Interativa)
// ==========================================================================

import React, { useState, useEffect } from 'react';
// Conecta-se ao mesmo arquivo de estilo
import '../DashboardPage/DashboardPage.css'; 
// Importa os ícones do React
import { 
  FaTriangleExclamation, FaClock, FaCircleCheck, FaChartLine,
  FaFire, FaCarBurst, FaHeartPulse, FaLifeRing, FaDroplet, FaShapes, FaMapPin, FaBuildingColumns
} from 'react-icons/fa6';

// --- Interface para os dados da ocorrência (pode ser movida para um arquivo types.ts) ---
interface Ocorrencia {
    id: string;
    tipo: string;
    regiao: string;
    titulo: string;
    status: 'Pendente' | 'Em andamento' | 'Concluída' | 'Encerrado'; // Adicionado 'Encerrado'
    prioridade: 'Alta' | 'Média' | 'Baixa';
    data: string;
    hora: string;
    equipe: string;
}

// --- Componente do Dashboard ---
const DashboardContent = () => {

    // --- Estados para armazenar os dados dinâmicos ---
    // (Substitui os números estáticos)
    const [kpiHoje, setKpiHoje] = useState(0);
    const [kpiAndamento, setKpiAndamento] = useState(0);
    const [kpiConcluidas, setKpiConcluidas] = useState(0);
    const [statusPendentes, setStatusPendentes] = useState(0);
    const [statusAndamento, setStatusAndamento] = useState(0);
    const [statusConcluidas, setStatusConcluidas] = useState(0);
    const [porTipo, setPorTipo] = useState<Record<string, number>>({});
    const [porRegiao, setPorRegiao] = useState<Record<string, number>>({});
    const [recentes, setRecentes] = useState<Ocorrencia[]>([]);

    // --- Mapeamento de Ícones (para renderização dinâmica) ---
    const iconMap: Record<string, React.ReactElement> = {
        'Incêndio': <FaFire className="icon-type icon-fire" />,
        'Acidente': <FaCarBurst className="icon-type icon-accident" />,
        'Emergência Médica': <FaHeartPulse className="icon-type icon-medical" />,
        'Resgate': <FaLifeRing className="icon-type icon-rescue" />,
        'Vazamento': <FaDroplet className="icon-type icon-leak" />,
        'Outros': <FaShapes className="icon-type icon-others" />,
    };

    // --- useEffect: Executa 1 vez quando o componente é montado ---
    // (Recria a lógica do nosso dashboard.js e lista-ocorrencias.js)
    useEffect(() => {
        
        // --- 1. Função para criar dados fictícios (igual ao protótipo) ---
        function initializeMockData() {
            const hasData = sessionStorage.getItem('ocorrencias');
            if (!hasData) {
                const mockOcorrencias: Ocorrencia[] = [
                    { id: 'OCR-2025-004', tipo: 'Acidente', regiao: 'Recife', titulo: 'Colisão de veículos', status: 'Pendente', prioridade: 'Alta', data: '20/10/2025', hora: '14:00', equipe: 'Aguardando'},
                    { id: 'OCR-2025-003', tipo: 'Resgate', regiao: 'Olinda', titulo: 'Resgate em altura', status: 'Em andamento', prioridade: 'Média', data: '20/10/2025', hora: '11:15', equipe: 'Sgt. Oliveira'},
                    { id: 'OCR-2025-002', tipo: 'Acidente', regiao: 'Jaboatão', titulo: 'Acidente - BR-101', status: 'Em andamento', prioridade: 'Média', data: '20/10/2025', hora: '11:55', equipe: 'Sgt. Oliveira'},
                    { id: 'OCR-2025-001', tipo: 'Incêndio', regiao: 'Recife', titulo: 'Incêndio em Residência', status: 'Concluída', prioridade: 'Alta', data: '20/10/2025', hora: '12:40', equipe: 'Sgt. Oliveira'},
                ];
                sessionStorage.setItem('ocorrencias', JSON.stringify(mockOcorrencias));
            }
        }

        // --- 2. Função para carregar e processar os dados ---
        function loadDashboardData() {
            initializeMockData();
            const ocorrencias: Ocorrencia[] = JSON.parse(sessionStorage.getItem('ocorrencias') || '[]');

            // --- Processa KPIs ---
            setKpiHoje(ocorrencias.length);
            setKpiAndamento(ocorrencias.filter(o => o.status === 'Em andamento').length);
            setKpiConcluidas(ocorrencias.filter(o => o.status === 'Concluída' || o.status === 'Encerrado').length);

            // --- Processa Status Geral ---
            setStatusPendentes(ocorrencias.filter(o => o.status === 'Pendente').length);
            setStatusAndamento(ocorrencias.filter(o => o.status === 'Em andamento').length);
            setStatusConcluidas(ocorrencias.filter(o => o.status === 'Concluída' || o.status === 'Encerrado').length);
            
            // --- Processa Ocorrências por Tipo ---
            const tipoCounts: Record<string, number> = { 'Incêndio': 0, 'Acidente': 0, 'Emergência Médica': 0, 'Resgate': 0, 'Vazamento': 0, 'Outros': 0 };
            ocorrencias.forEach(o => {
                if (tipoCounts[o.tipo] !== undefined) {
                    tipoCounts[o.tipo]++;
                }
            });
            setPorTipo(tipoCounts);

            // --- Processa Ocorrências por Região ---
            const regiaoCounts: Record<string, number> = {};
            ocorrencias.forEach(o => {
                const regiaoLimpa = o.regiao.split(' - ')[0]; // Pega só "Recife" de "Recife - Centro"
                regiaoCounts[regiaoLimpa] = (regiaoCounts[regiaoLimpa] || 0) + 1;
            });
            setPorRegiao(regiaoCounts);

            // --- Processa Ocorrências Recentes ---
            setRecentes(ocorrencias.slice(0, 3)); // Pega as 3 mais recentes
        }

        // --- 3. Executa a função ---
        loadDashboardData();

    }, []); // O array vazio [] garante que isso rode apenas uma vez

    // --- Renderização do Componente ---
    return (
    <>
      <div className="dashboard-title">
        {/* Título (agora em negrito via CSS) */}
        <h2>Dashboard Operacional</h2>
        <p>Visão geral das ocorrências do Corpo de Bombeiros Militar de Pernambuco</p>
      </div>

      {/* Seção de KPIs (agora com dados dinâmicos) */}
      <section className="kpi-grid">
        <div className="kpi-card kpi-red"><div className="kpi-info"><span className="kpi-title">Ocorrências Hoje</span><span className="kpi-value">{kpiHoje}</span><span className="kpi-details">Registradas nas últimas 24h</span></div><FaTriangleExclamation className="kpi-icon" /></div>
        <div className="kpi-card kpi-yellow"><div className="kpi-info"><span className="kpi-title">Em andamento</span><span className="kpi-value">{kpiAndamento}</span><span className="kpi-details">Equipes mobilizadas</span></div><FaClock className="kpi-icon" /></div>
        <div className="kpi-card kpi-green"><div className="kpi-info"><span className="kpi-title">Concluídas</span><span className="kpi-value">{kpiConcluidas}</span><span className="kpi-details">Este mês</span></div><FaCircleCheck className="kpi-icon" /></div>
        <div className="kpi-card kpi-blue"><div className="kpi-info"><span className="kpi-title">Tempo Médio</span><span className="kpi-value">13.2min</span><span className="kpi-details">Respostas das equipes</span></div><FaChartLine className="kpi-icon" /></div>
      </section>

      {/* Seção de Informações (agora com dados dinâmicos) */}
      <section className="content-grid">
        {/* Card Ocorrência por Tipo */}
        <div className="info-card">
            <h3 className="font-bold">Ocorrência por tipo</h3>
            <p>Distribuição no mês atual</p>
            <ul className="info-list">
                {/* Mapeia os dados do estado 'porTipo' para criar a lista */}
                {Object.entries(porTipo).map(([tipo, contagem]) => (
                    <li key={tipo}>
                        {iconMap[tipo] || <FaShapes className="icon-type icon-others" />} {tipo} <span className="badge">{contagem}</span>
                    </li>
                ))}
            </ul>
        </div>
        
        {/* Card Por Região */}
        <div className="info-card">
            <h3 className="font-bold">Por Região</h3>
            <p>Atendimento por localidade</p>
            <ul className="info-list">
                {/* Mapeia os dados do estado 'porRegiao' para criar a lista */}
                {Object.entries(porRegiao).map(([regiao, contagem]) => (
                    <li key={regiao}>
                        <FaMapPin className="icon-type icon-region" /> {regiao} <span className="badge">{contagem}</span>
                    </li>
                ))}
            </ul>
        </div>
        
        {/* Card Recentes */}
        <div className="info-card">
            <h3 className="font-bold">Recentes</h3>
            <p>Últimas ocorrências registradas</p>
            <ul className="info-list-recent">
                {/* Mapeia os dados do estado 'recentes' para criar a lista */}
                {recentes.map((ocorrencia) => (
                    <li key={ocorrencia.id}>
                        {iconMap[ocorrencia.tipo] || <FaShapes className="icon-type icon-others" />}
                        <div className="recent-details">
                            <span className="recent-code">{ocorrencia.id}</span>
                            <span className="recent-title">{ocorrencia.titulo}</span>
                            <span className="recent-location"><FaMapPin /> {ocorrencia.regiao}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </section>
      
      {/* Seção Status Geral (agora com dados dinâmicos) */}
      <section className="info-card">
        <h3 className="font-bold">Status Geral das Operacoes</h3>
        <p>Panorama atual das atividades</p>
        <div className="status-grid">
            <div className="status-card status-pending"><span className="status-value">{statusPendentes}</span><span className="status-label">Pendentes</span></div>
            <div className="status-card status-ongoing"><span className="status-value">{statusAndamento}</span><span className="status-label">Em andamento</span></div>
            <div className="status-card status-completed"><span className="status-value">{statusConcluidas}</span><span className="status-label">Concluídas</span></div>
        </div>
      </section>
    </>
  );
};

export default DashboardContent;