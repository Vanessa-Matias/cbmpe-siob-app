// ==========================================================================
// DashboardContent.tsx (VERSÃO FINAL, LIMPA E OTIMIZADA)
// ==========================================================================

import React, { useState, useEffect } from 'react';
import '../DashboardPage/DashboardPage.css';
// --- Ícones Otimizados (Apenas os estritamente necessários são importados) ---
import { 
  FaMapPin, FaShapes, FaFire, FaCarBurst, FaHeartPulse, FaLifeRing, FaDroplet
} from 'react-icons/fa6';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

// --- Cores Refinadas (Pendentes, Em andamento, Concluídas) ---
// Cores: [VERMELHO VIVO, AMARELO LARANJA, VERDE MUSGO]
const COLORS = ['#8f7979ff', '#AD131A', '#e77070ff'];


// --- Interface para os dados da ocorrência ---
interface Ocorrencia {
    id: string;
    tipo: string;
    regiao: string;
    titulo: string;
    status: 'Pendente' | 'Em andamento' | 'Concluída' | 'Encerrado';
    prioridade: 'Alta' | 'Média' | 'Baixa';
    data: string;
    hora: string;
    equipe: string;
}

// --- Interface para os dados do gráfico (Com flexibilidade para Recharts) ---
interface GraficoData {
    name: string;
    value: number;
    [key: string]: any; // Assinatura de índice para compatibilidade com Recharts (Solução TS2322)
}


// --- Componente do Dashboard ---
const DashboardContent = () => {

    // --- Estados Otimizados (Removidos statusAndamento/Concluidas redundantes) ---
    const [kpiHoje, setKpiHoje] = useState(0);
    const [kpiAndamento, setKpiAndamento] = useState(0); 
    const [kpiConcluidas, setKpiConcluidas] = useState(0); 
    const [statusPendentes, setStatusPendentes] = useState(0);
    
    // Estados para Cards e Gráficos
    const [porTipo, setPorTipo] = useState<Record<string, number>>({});
    const [porRegiao, setPorRegiao] = useState<Record<string, number>>({});
    const [recentes, setRecentes] = useState<Ocorrencia[]>([]);
    
    const [dadosGraficoStatus, setDadosGraficoStatus] = useState<GraficoData[]>([]);
    const [dadosGraficoTipo, setDadosGraficoTipo] = useState<GraficoData[]>([]);

    // --- Mapeamento de Ícones ---
    const iconMap: Record<string, React.ReactElement> = {
        'Incêndio': <FaFire className="icon-type icon-fire" />,
        'Acidente': <FaCarBurst className="icon-type icon-accident" />,
        'Emergência Médica': <FaHeartPulse className="icon-type icon-medical" />,
        'Resgate': <FaLifeRing className="icon-type icon-rescue" />,
        'Vazamento': <FaDroplet className="icon-type icon-leak" />,
        'Outros': <FaShapes className="icon-type icon-others" />,
    };

    // --- Lógica de Carregamento ---
    useEffect(() => {
        
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

        function loadDashboardData() {
            initializeMockData();
            const ocorrencias: Ocorrencia[] = JSON.parse(sessionStorage.getItem('ocorrencias') || '[]');

            // --- Processamento de Status e KPIs ---
            const p = ocorrencias.filter(o => o.status === 'Pendente').length;
            const a = ocorrencias.filter(o => o.status === 'Em andamento').length;
            const c = ocorrencias.filter(o => o.status === 'Concluída' || o.status === 'Encerrado').length;

            setKpiHoje(ocorrencias.length);
            setKpiAndamento(a);
            setKpiConcluidas(c);
            setStatusPendentes(p);
            
            // --- 1. Dados para o Gráfico de Status (Pizza) ---
            const statusData: GraficoData[] = [
                { name: 'Pendentes', value: p },
                { name: 'Em andamento', value: a },
                { name: 'Concluídas', value: c },
            ];
            setDadosGraficoStatus(statusData);

            // --- 2. Dados para o Gráfico por Tipo (Barra) ---
            const tipoCounts: Record<string, number> = { 'Incêndio': 0, 'Acidente': 0, 'Emergência Médica': 0, 'Resgate': 0, 'Vazamento': 0, 'Outros': 0 };
            ocorrencias.forEach(o => {
                if (tipoCounts[o.tipo] !== undefined) {
                    tipoCounts[o.tipo]++;
                } else {
                    tipoCounts['Outros']++; 
                }
            });
            const tipoData = Object.entries(tipoCounts).map(([nome, total]) => ({
                name: nome,
                value: total
            }));
            setDadosGraficoTipo(tipoData);
            
            // --- Processamento para Cards ---
            setPorTipo(tipoCounts);
            
            const regiaoCounts: Record<string, number> = {};
            ocorrencias.forEach(o => {
                const regiaoLimpa = o.regiao.split(' - ')[0];
                regiaoCounts[regiaoLimpa] = (regiaoCounts[regiaoLimpa] || 0) + 1;
            });
            setPorRegiao(regiaoCounts);

            setRecentes(ocorrencias.slice(0, 3));
        }

        loadDashboardData();

    }, []);

    // --- Renderização do Componente ---
    return (
    <>
      <div className="dashboard-title">
        <h2 className="font-bold">Dashboard Operacional</h2>
      </div>

      {/* Seção de Gráficos (Lado a Lado no Topo) */}
      <section className="chart-grid"> 
        
        {/* Gráfico 1: Distribuição de Status (Pizza) - CORES AJUSTADAS */}
        <div className="info-card chart-card">
            <h3 className="font-bold">Distribuição de Status</h3>
            <p>Panorama de Operações Atuais ({kpiHoje} Total)</p>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={dadosGraficoStatus}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        labelLine={false}
                        label={({ name, value, percent }: any) => {
                             // Usamos 'any' e garantimos a formatação correta
                            const percentValue = (percent * 100).toFixed(0); 
                            return `${name}: ${percentValue}%`;
                        }}
                    >
                        {dadosGraficoStatus.map((entry, index) => (
                            // Mapeia as cores do array COLORS
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => ([value, name])}/>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Ocorrências por Tipo (Barra) - COR AJUSTADA */}
        <div className="info-card chart-card"> 
            <h3 className="font-bold">Ocorrências por Tipo</h3>
            <p>Distribuição no Mês Atual</p>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dadosGraficoTipo} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                        dataKey="name" 
                        fontSize={10} 
                        stroke="var(--color-muted)" 
                        interval={0} 
                        angle={-45} 
                        textAnchor="end" 
                        height={50} 
                    /> 
                    <YAxis fontSize={12} stroke="var(--color-muted)" />
                    <Tooltip formatter={(value, name) => ([value, name])}/>
                    {/* COR AJUSTADA para o vermelho da identidade */}
                    <Bar dataKey="value" fill="#AD131A" name="Total" /> 
                </BarChart>
            </ResponsiveContainer>
        </div>
      </section>

      {/* Seção de Cards Informativos (AGORA APENAS 2 COLUNAS ABAIXO) */}
      <section className="content-grid-cards">
        
        {/* Card 1: Por Região */}
        <div className="info-card">
            <h3 className="font-bold">Por Região</h3>
            <p>Atendimento por localidade</p>
            <ul className="info-list">
                {Object.entries(porRegiao).map(([regiao, contagem]) => (
                    <li key={regiao}>
                        <FaMapPin className="icon-type icon-region" /> {regiao} <span className="badge">{contagem}</span>
                    </li>
                ))}
            </ul>
        </div>
        
        {/* Card 2: Recentes */}
        <div className="info-card">
            <h3 className="font-bold">Recentes</h3>
            <p>Últimas ocorrências registradas</p>
            <ul className="info-list-recent">
                {recentes.map((ocorrencia) => (
                    <li key={ocorrencia.id}>
                        {iconMap[ocorrencia.tipo] || iconMap['Outros']}
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
    </>
  );
};

export default DashboardContent;