/**
 * @file DashboardContent.tsx
 * @description Painel principal com lógica de agregação e GRÁFICO DE MAPA.
 
 */
import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
} from "recharts";
import {
    AlertTriangle,
    Clock,
    CheckCircle,
    BarChart3,
} from "lucide-react";
import "../DashboardPage/DashboardPage.css"; 
import OccurrenceMap from './OccurrenceMap'; // IMPORTAÇÃO DO MAPA

// ======================================================================
// 1- Estrutura de Tipos de Dados
// ======================================================================
interface Ocorrencia {
    tipo: string;
    status: string;
    regiao: string;
    data: string;
    id: string; 
    endereco: { 
        latitude: string | number;
        longitude: string | number;
        bairro: string;
    }
}

// Tipo corrigido para compatibilidade com o Recharts
interface DadosGrafico {
    name: string;
    value: number;
    [key: string]: any; 
}

// ======================================================================
// 2️- Cores e Mapeamento
// ======================================================================

// Paleta principal de cores alinhada com as Naturezas de Ocorrência (COBRADE)
const COLORS_TIPO_PALETTE = [
    "#d81b60", // [0] - APH (Rosa/Magenta - Emergência Médica)
    "#AD131A", // [1] - Incêndio (Vermelho forte, crítico)
    "#cc5f0b", // [2] - Salvamento / Resgate (Laranja Queimado)
    "#fbc02d", // [3] - Produtos Perigosos (Amarelo)
    "#43a047", // [4] - Prevenção (Verde)
    "#1976d2", // [5] - Comunitária / Ações sociais (Azul)
    "#00897b", // [6] - Vazamento / Outros (Verde-azulado)
    "#6d4c41", // [7] - Outros / sobras (Marrom/Neutro)
];

// Mapeamento de Natureza para Cor, garantindo coerência visual no gráfico de Rosca
const NATUREZA_COLOR_MAP: Record<string, string> = {
  'APH': COLORS_TIPO_PALETTE[0], 
  'Incêndio': COLORS_TIPO_PALETTE[1],
  'Resgate': COLORS_TIPO_PALETTE[2], 
  'Salvamento': COLORS_TIPO_PALETTE[2],
  'Produtos Perigosos': COLORS_TIPO_PALETTE[3], 
  'Prevenção': COLORS_TIPO_PALETTE[4],
  'Comunitária': COLORS_TIPO_PALETTE[5],
};
// Cores dos Status (para KPIs e Badges da Tabela)
const COLORS_STATUS = ["#c62828", "#fdd835", "#43a047"]; // Em Andamento, Pendente, Concluída

const DADOS_MENSAIS_EVOLUCAO: DadosGrafico[] = [
    { name: "Jan", value: 10 },
    { name: "Fev", value: 12 },
    { name: "Mar", value: 15 },
    { name: "Abr", value: 20 },
    { name: "Mai", value: 25 },
    { name: "Jun", value: 30 },
    { name: "Jul", value: 35 },
    { name: "Ago", value: 42 },
    { name: "Set", value: 45 },
    { name: "Out", value: 50 },
];

// Dados Fictícios com coordenadas de Recife/PE para teste do mapa
const DADOS_INICIAIS_FICTICIOS: Ocorrencia[] = [
    { id: '1a', tipo: "APH Acidente Trânsito", status: "Em andamento", regiao: "Boa Viagem", data: "2025-10-25T14:00:00Z", endereco: { latitude: -8.1345, longitude: -34.9087, bairro: 'Boa Viagem' } },
    { id: '2b', tipo: "Incêndio Estrutural", status: "Em andamento", regiao: "Imbiribeira", data: "2025-10-25T15:00:00Z", endereco: { latitude: -8.1001, longitude: -34.9010, bairro: 'Imbiribeira' } },
    { id: '3c', tipo: "Resgate em Altura", status: "Pendente", regiao: "Várzea", data: "2025-10-25T14:15:00Z", endereco: { latitude: -8.0490, longitude: -34.9540, bairro: 'Várzea' } },
    { id: '4d', tipo: "Salvamento Aquático", status: "Concluída", regiao: "Madalena", data: "2025-10-24T10:00:00Z", endereco: { latitude: -8.0535, longitude: -34.9000, bairro: 'Madalena' } },
    { id: '5e', tipo: "Prevenção Aquática", status: "Pendente", regiao: "Pina", data: "2025-10-25T14:30:00Z", endereco: { latitude: -8.0850, longitude: -34.8870, bairro: 'Pina' } },
];


// ======================================================================
// FUNÇÃO AUXILIAR: Normalizar Status (Para KPIs)
// ======================================================================
const normalizarStatus = (ocorrencia: Ocorrencia) => {
    // Normaliza status que podem vir do FormularioBasico como 'finalizada', 'pendente', etc.
    const statusLower = ocorrencia.status.toLowerCase();
    
    let statusNormalizado: string;
    if (statusLower.includes('finalizada') || statusLower.includes('concluída')) {
        statusNormalizado = "Concluída";
    } else if (statusLower.includes('em-andamento') || statusLower.includes('andamento')) {
        statusNormalizado = "Em andamento";
    } else if (statusLower.includes('pendente')) {
        statusNormalizado = "Pendente";
    } else {
        statusNormalizado = ocorrencia.status;
    }

    return { ...ocorrencia, status: statusNormalizado };
};


// ======================================================================
// FUNÇÃO AUXILIAR: Abreviar rótulos longos no eixo X
// ======================================================================
const abreviarRotulo = (nome: string): string => {
    // ABREVIAÇÕES DE RASCUNHO/INCÊNDIO
    if (nome.includes("em Edificação")) return "Inc. Edif."; 
    if (nome.includes("Rascunho de Atendimento")) return "Rasc. Detal."; 
    if (nome.includes("Ocorrência Básica")) return "Ocorr. Básica";
    if (nome.includes("Incêndio Estrutural")) return "Inc. Estrut.";
    if (nome.includes("Incêndio em Veículo")) return "Inc. Veíc."; 
    
    // ABREVIAÇÕES DE APH/SALVAMENTO E PREVENÇÃO
    if (nome.includes("Acidente Trânsito")) return "Aci. Trâns.";
    if (nome.includes("Resgate em Altura")) return "Resg. Altura";
    if (nome.includes("Salvamento Aquático")) return "Salv. Aquát.";
    if (nome.includes("Atividade Comunitária")) return "Ativ. Com.";
    // CORREÇÃO: Adicionando regra para Prevenção Aquática
    if (nome.includes("Prevenção Aquática")) return "Prev. Aquát."; 
    
    return nome;
};

// ======================================================================
// 3️- Componente Principal do Dashboard
// ======================================================================
const DashboardContent: React.FC = () => {
    
    // Lógica de inicialização de estado
    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(() => {
        const data = localStorage.getItem("ocorrencias");
        if (data) {
          try {
            const parsedData = JSON.parse(data);
            const finalData = (parsedData.length > 0 ? parsedData : DADOS_INICIAIS_FICTICIOS) as Ocorrencia[];
            // CORREÇÃO: Normaliza os dados carregados na inicialização
            return finalData.map(normalizarStatus); 
          } catch (e) {
            return DADOS_INICIAIS_FICTICIOS as Ocorrencia[];
          }
        }
        return DADOS_INICIAIS_FICTICIOS as Ocorrencia[];
    });

    // Lógica de carregamento e atualização (PWA)
    const carregarDados = () => {
        const data = localStorage.getItem("ocorrencias");
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                // CORREÇÃO: Normaliza os dados na atualização PWA
                setOcorrencias(parsedData.map(normalizarStatus)); 
            } catch (e) {
                setOcorrencias([]);
            }
        } else {
            setOcorrencias([]);
        }
    };

    useEffect(() => {
        const atualizar = () => carregarDados();
        window.addEventListener("ocorrencias:updated", atualizar);

        return () => window.removeEventListener("ocorrencias:updated", atualizar);
    }, []);

    // Função helper para agregação (CORRIGIDA)
    const aggregateData = (key: keyof Ocorrencia): DadosGrafico[] => {
        return Object.entries(
            ocorrencias.reduce((acc, o) => {
                let itemKey = o[key] as string;
                
                // CORREÇÃO: Limpa nomes genéricos de status/fluxo nos gráficos
                if (key === 'tipo' && itemKey.includes("Rascunho de Atendimento")) {
                    // Substitui pelo nome de fluxo mais limpo
                    itemKey = "Ocorrência Básica"; 
                }
                
                acc[itemKey] = (acc[itemKey] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        ).map(([name, value]) => ({ name, value }));
    };

    // ==================================================================
    // 5- Cálculos dos dados para os gráficos
    // ==================================================================

    const totalHoje = ocorrencias.length;

    // KPIs (Lendo status já normalizados)
    const emAndamento = ocorrencias.filter(o => o.status === "Em andamento").length;
    const pendentes = ocorrencias.filter(o => o.status === "Pendente").length;
    const concluidas = ocorrencias.filter(o => o.status === "Concluída").length;

    // Gráfico 1 - Ocorrências por Tipo (Rosca)
    const dadosGraficoTipo = aggregateData("tipo");
    
    // Gráfico 2 - Evolução Mensal (Linha)
    const dadosEvolucaoMensal = DADOS_MENSAIS_EVOLUCAO; 

    // Gráfico 4 - Top 5 Tipos (Barras)
    const dadosGraficoTop5: DadosGrafico[] = dadosGraficoTipo
        .sort((a, b) => b.value - a.value) 
        .slice(0, 5); 

    // Filtragem de dados para o MAPA (Slot 3)
    const ocorrenciasComGeo = ocorrencias.filter(o => o.endereco?.latitude && o.endereco?.longitude);
    
    // ==================================================================
    // 6- Renderização da Interface
    // ==================================================================
    return (
        <div className="dashboard-main">
            <div className="dashboard-title">
                <h2>Dashboard Operacional</h2>
                <p>Resumo dinâmico das Ocorrências</p>
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
                        <span className="kpi-details">Equipes mobilizadas</span>
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
                        <span className="kpi-details">Ocorrências encerradas</span>
                    </div>
                    <div className="kpi-icon"><CheckCircle /></div>
                </div>
            </div> 

            {/* =================== GRÁFICOS (4 otimizados) =================== */}
            <div className="chart-grid-6">
                
                {/* Slot 1 — Ocorrências por Tipo (Rosca) - Mapeamento por Natureza */}
                <div className="info-card chart-card">
                    <h3>Ocorrências por Tipo (Distribuição)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dadosGraficoTipo as any} 
                                cx="50%"
                                cy="50%"
                                innerRadius={60} 
                                outerRadius={120}
                                label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                dataKey="value"
                            >
                                {dadosGraficoTipo.map((d, i) => {
                                    const naturezaChave = Object.keys(NATUREZA_COLOR_MAP).find(key => 
                                        d.name.includes(key)
                                    );
                                    const corFatia = naturezaChave 
                                        ? NATUREZA_COLOR_MAP[naturezaChave]
                                        : COLORS_TIPO_PALETTE[i % COLORS_TIPO_PALETTE.length]; 

                                    return <Cell key={i} fill={corFatia} />;
                                })}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Slot 2 — Evolução Mensal (Linha) */}
                <div className="info-card chart-card">
                    <h3>Evolução Mensal 2025</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dadosEvolucaoMensal}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#AD131A" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Slot 3 — MAPA OPERACIONAL DE OCORRÊNCIAS */}
                <div className="info-card chart-card">
                    <h3>Mapa Operacional de Ocorrências</h3>
                    <OccurrenceMap occurrences={ocorrenciasComGeo.map(o => ({
                        id: o.id,
                        regiao: o.endereco.bairro || o.regiao,
                        latitude: o.endereco.latitude,
                        longitude: o.endereco.longitude,
                        status: o.status,
                        tipo: o.tipo
                    }))} />
                </div>

                {/* Slot 4 — Top 5 Tipos (Barras) - RÓTULOS ABREVIADOS */}
                <div className="info-card chart-card">
                    <h3>Top 5 Tipos de Ocorrência Mais Frequêntes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                            data={dadosGraficoTop5}
                            // Adicionar margem é crucial para o texto girado não ser cortado pelo contêiner do cartão
                            margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                interval={0} 			/* Garante que NENHUM rótulo seja omitido */
                                angle={-35} 			/* Rotação na diagonal */
                                textAnchor="end" 		/* Âncora no final do texto */
                                height={80} 			/* Altura extra para acomodar o texto inclinado */
                                tickFormatter={abreviarRotulo} /* <--- ABREVIAÇÃO APLICADA AQUI */
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#fbc02d" /> 
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Slots 5 e 6 Físicos (Escondidos) */}
                <div className="info-card chart-card" style={{display: 'none'}}></div> 
                <div className="info-card chart-card" style={{display: 'none'}}></div>
            </div>
        </div>
    );
};

export default DashboardContent;