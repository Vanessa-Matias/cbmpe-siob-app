/**
 * @file DashboardContent.tsx
 * @description Painel principal - Cores corrigidas conforme padrão COBRADE.
 */
import React, { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line,
} from "recharts";
import {
    AlertTriangle, Clock, CheckCircle, BarChart3,
} from "lucide-react";
import "../DashboardPage/DashboardPage.css"; 
import OccurrenceMap from './OccurrenceMap'; 
import { api } from '../../lib/api'; 

// ======================================================================
// 1. Tipos e Interfaces
// ======================================================================
interface Ocorrencia {
    id: string;
    tipo: string;
    status: string;
    regiao: string;
    data: string;
    prioridade: string;
    endereco: {
        latitude: number;
        longitude: number;
        bairro: string;
    };
}

// ======================================================================
// 2. CORES E PALETAS (CORRIGIDO)
// ======================================================================

// Paleta oficial que você enviou
const COLORS_TIPO_PALETTE = [
    "#d81b60", // [0] - APH (Rosa/Magenta)
    "#AD131A", // [1] - Incêndio (Vermelho forte)
    "#cc5f0b", // [2] - Salvamento (Laranja)
    "#fbc02d", // [3] - Produtos Perigosos (Amarelo)
    "#43a047", // [4] - Prevenção (Verde)
    "#1976d2", // [5] - Comunitária (Azul)
    "#00897b", // [6] - Vazamento / Outros
    "#6d4c41", // [7] - Outros / sobras
];

// Função que garante a cor certa independente de maiúscula/minúscula
const getCorPorNatureza = (nomeNatureza: string) => {
    if (!nomeNatureza) return COLORS_TIPO_PALETTE[7]; // Marrom se vier vazio
    
    const nome = nomeNatureza.toUpperCase();

    // INCÊNDIO -> VERMELHO (#AD131A)
    if (nome.includes("INCENDIO") || nome.includes("INCÊNDIO")) return COLORS_TIPO_PALETTE[1];
    
    // SALVAMENTO/RESGATE -> LARANJA (#cc5f0b)
    if (nome.includes("SALVAMENTO") || nome.includes("RESGATE")) return COLORS_TIPO_PALETTE[2];
    
    // APH -> ROSA (#d81b60)
    if (nome.includes("APH") || nome.includes("HOSPITALAR")) return COLORS_TIPO_PALETTE[0];
    
    // PREVENÇÃO -> VERDE (#43a047)
    if (nome.includes("PREVENCAO") || nome.includes("PREVENÇÃO")) return COLORS_TIPO_PALETTE[4];
    
    // PRODUTOS PERIGOSOS -> AMARELO (#fbc02d)
    if (nome.includes("PERIGOSO") || nome.includes("QUIMICO")) return COLORS_TIPO_PALETTE[3];
    
    // COMUNITÁRIA -> AZUL (#1976d2)
    if (nome.includes("COMUNITARIA") || nome.includes("COMUNITÁRIA")) return COLORS_TIPO_PALETTE[5];

    // Padrão para outros
    return COLORS_TIPO_PALETTE[6];
};

const DADOS_MENSAIS_EVOLUCAO = [
    { name: "Jan", value: 10 }, { name: "Fev", value: 12 },
    { name: "Mar", value: 15 }, { name: "Abr", value: 20 },
    { name: "Mai", value: 25 }, { name: "Jun", value: 30 },
    { name: "Jul", value: 35 }, { name: "Ago", value: 42 },
    { name: "Set", value: 45 }, { name: "Out", value: 50 },
];

const abreviarRotulo = (nome: string): string => {
    if (nome.includes("Incêndio")) return "Incêndio";
    if (nome.includes("Acidente")) return "Aci. Trâns.";
    if (nome.includes("Salvamento")) return "Salvamento";
    if (nome.includes("Prevenção")) return "Prev.";
    if (nome.length > 12) return nome.substring(0, 10) + ".";
    return nome;
};

// ======================================================================
// 3. Funções Auxiliares de Normalização
// ======================================================================
const normalizarDadosAPI = (item: any): Ocorrencia => {
    return {
        id: item.id,
        // Garante que o tipo venha formatado bonito (Ex: INCENDIO -> Incêndio)
        tipo: formatarTipo(item.tipo),
        status: normalizarStatus(item.status || item.situacao),
        prioridade: item.prioridade || "Média",
        regiao: item.bairro || item.municipio || "Região n/d",
        data: item.dataHora || item.data_acionamento || new Date().toISOString(),
        endereco: {
            latitude: Number(item.latitude) || 0,
            longitude: Number(item.longitude) || 0,
            bairro: item.bairro || ""
        }
    };
};

// Deixa o texto bonito para o gráfico (Ex: APH, Incêndio)
const formatarTipo = (tipoBruto: string) => {
    if(!tipoBruto) return "Outros";
    const t = tipoBruto.toUpperCase();
    if (t.includes("INCENDIO")) return "Incêndio";
    if (t.includes("APH")) return "APH";
    if (t.includes("SALVAMENTO")) return "Salvamento";
    if (t.includes("PREVENCAO")) return "Prevenção";
    if (t.includes("PERIGOSO")) return "Prod. Perigoso";
    if (t.includes("COMUNITARIA")) return "Ativ. Comunitária";
    return t; // Retorna original se não conhecer
};

const normalizarStatus = (status: string) => {
    if (!status) return "Pendente";
    const s = status.toUpperCase();
    if (s.includes("CONCLU") || s.includes("FINAL")) return "Concluída";
    if (s.includes("ANDAMENTO")) return "Em andamento";
    if (s.includes("PENDENTE")) return "Pendente";
    if (s.includes("CANCEL")) return "Cancelada";
    return "Pendente";
};

// ======================================================================
// 4. Componente Principal
// ======================================================================
const DashboardContent: React.FC = () => {
    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
    const [loading, setLoading] = useState(true);

    // --- BUSCA DADOS NA API ---
    useEffect(() => {
        const carregarDados = async () => {
            try {
                setLoading(true);
                const response = await api.get('/ocorrencias');
                const listaBruta = response.data.data || [];
                const listaTratada = listaBruta.map(normalizarDadosAPI);
                setOcorrencias(listaTratada);
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
        const interval = setInterval(carregarDados, 15000);
        return () => clearInterval(interval);
    }, []);

    // --- CÁLCULOS LOCAIS ---

    // 1. Agregação por Tipo (Rosca)
    const dadosGraficoTipo = Object.entries(
        ocorrencias.reduce((acc: any, curr) => {
            const tipo = curr.tipo; // Já vem formatado (Incêndio, APH...)
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value: Number(value) }));

    // 2. Top 5 (Barras)
    const dadosGraficoTop5 = [...dadosGraficoTipo]
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // 3. KPIs
    const totalHoje = ocorrencias.filter(o => {
        const dataOcorrencia = new Date(o.data).toISOString().split('T')[0];
        const dataHoje = new Date().toISOString().split('T')[0];
        return dataOcorrencia === dataHoje;
    }).length;

    const emAndamento = ocorrencias.filter(o => o.status === "Em andamento").length;
    const pendentes = ocorrencias.filter(o => o.status === "Pendente").length;
    const concluidas = ocorrencias.filter(o => o.status === "Concluída").length;

    // 4. Dados Mapa
    const dadosParaMapa = ocorrencias.filter(o => 
        o.endereco.latitude !== 0 && o.endereco.longitude !== 0
    );

    if (loading && ocorrencias.length === 0) {
        return <div className="loading-container"><p>Carregando dados operacionais...</p></div>;
    }

    return (
         <div className="dashboard-main dashboard-operacional">
            <div className="dashboard-title">
                <h2>Dashboard Operacional</h2>
                <p>Monitoramento em Tempo Real</p>
            </div>

            {/* =================== KPI CARDS =================== */}
            <div className="kpi-grid">
                <div className="kpi-card kpi-azul">
                    <div className="kpi-info">
                        <span className="kpi-title">Ocorrências Hoje</span>
                        <span className="kpi-value">{totalHoje}</span>
                        <span className="kpi-details">Registradas nas últimas 24h</span>
                    </div>
                    <div className="kpi-icon"><AlertTriangle /></div>
                </div>

                <div className="kpi-card kpi-vermelho">
                    <div className="kpi-info">
                        <span className="kpi-title">Em Andamento</span>
                        <span className="kpi-value">{emAndamento}</span>
                        <span className="kpi-details">Equipes em atuação</span>
                    </div>
                    <div className="kpi-icon"><Clock /></div>
                </div>
                
                <div className="kpi-card kpi-amarelo">
                    <div className="kpi-info">
                        <span className="kpi-title">Pendentes</span>
                        <span className="kpi-value">{pendentes}</span>
                        <span className="kpi-details">Aguardando despacho</span>
                    </div>
                    <div className="kpi-icon"><BarChart3 /></div>
                </div>

                <div className="kpi-card kpi-verde">
                    <div className="kpi-info">
                        <span className="kpi-title">Concluídas</span>
                        <span className="kpi-value">{concluidas}</span>
                        <span className="kpi-details">Total acumulado</span>
                    </div>
                    <div className="kpi-icon"><CheckCircle /></div>
                </div>
            </div> 

            {/* =================== GRÁFICOS E MAPA =================== */}
            <div className="chart-grid-6">
                
                {/* Slot 1 - Ocorrências por Tipo (Rosca) */}
                <div className="info-card chart-card">
                    <h3>Distribuição por Natureza</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dadosGraficoTipo} 
                                cx="50%" cy="50%"
                                innerRadius={60} outerRadius={120}
                                label={({ name, percent }: any) => `${abreviarRotulo(name)} (${(percent * 100).toFixed(0)}%)`}
                                dataKey="value"
                            >
                                {dadosGraficoTipo.map((entry, index) => {
                                    // AQUI ESTÁ A CORREÇÃO: Usa a função para pegar a cor EXATA
                                    const cor = getCorPorNatureza(entry.name);
                                    return <Cell key={`cell-${index}`} fill={cor} />;
                                })}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Slot 2 - Evolução Mensal */}
                <div className="info-card chart-card">
                    <h3>Evolução Mensal (2025)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={DADOS_MENSAIS_EVOLUCAO}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#AD131A" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Slot 3 - MAPA OPERACIONAL */}
                <div className="info-card chart-card">
                    <h3>Mapa de Calor Operacional</h3>
                    <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                        {dadosParaMapa.length > 0 ? (
                            <OccurrenceMap occurrences={dadosParaMapa.map(o => ({
                                id: o.id,
                                tipo: o.tipo,
                                status: o.status,
                                regiao: o.regiao,
                                latitude: Number(o.endereco.latitude),
                                longitude: Number(o.endereco.longitude)
                            }))} />
                        ) : (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
                                <p style={{ color: '#666' }}>Aguardando dados de GPS...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Slot 4 - Top 5 Tipos */}
                <div className="info-card chart-card">
                    <h3>Top 5 Naturezas Mais Frequentes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosGraficoTop5} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tickFormatter={abreviarRotulo} interval={0} angle={-15} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#fbc02d" radius={[4, 4, 0, 0]} >
                                {/* CORREÇÃO: Aplica as cores certas também nas barras */}
                                {dadosGraficoTop5.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getCorPorNatureza(entry.name)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;