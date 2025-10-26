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

// ======================================================================
// 1- Estrutura de Tipos de Dados
// ======================================================================
interface Ocorrencia {
  tipo: string;
  status: string;
  regiao: string;
  data: string;
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

// Paleta principal de cores alinhada com as Naturezas de Ocorrência
const COLORS_TIPO_PALETTE = [
    "#d81b60", // [0] - APH (Rosa/Magenta - Emergência Médica)
    "#AD131A", // [1] - Incêndio (Vermelho)
    "#cc5f0b", // [2] - Salvamento / Resgate (Laranja Queimado)
    "#fbc02d", // [3] - Produtos Perigosos (Amarelo)
    "#43a047", // [4] - Prevenção (Verde)
    "#1976d2", // [5] - Comunitária / Ações sociais (Azul)
    "#00897b", // [6] - Vazamento / Outros (Verde-azulado)
    "#6d4c41", // [7] - Outros / sobras (Marrom)
    
];



// Mapeamento de Natureza para Cor, garantindo coerência visual
const NATUREZA_COLOR_MAP: Record<string, string> = {
  'APH': COLORS_TIPO_PALETTE[0], 
  'Incêndio': COLORS_TIPO_PALETTE[1],
  'Resgate': COLORS_TIPO_PALETTE[2], // Mapeia Resgate para Salvamento/Laranja
  'Salvamento': COLORS_TIPO_PALETTE[2], 
  'Produtos Perigosos': COLORS_TIPO_PALETTE[3], 
  'Prevenção': COLORS_TIPO_PALETTE[4],
  'Comunitária': COLORS_TIPO_PALETTE[5],
  // Adicione outras naturezas que precisam de cor fixa aqui.
};

// Cores dos Status (KPIs)
const COLORS_STATUS = ["#c62828", "#fdd835", "#4b6f44"]; 

// Dados de Exemplo Mensal (Tendência)
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

const DADOS_INICIAIS_FICTICIOS: Ocorrencia[] = [
  // Total de 12 Ocorrências: 5 Em Andamento, 2 Pendentes, 5 Concluídas
  { tipo: "APH Acidente Trânsito", status: "Em andamento", regiao: "Boa Viagem", data: "2025-10-25T14:00:00Z" },
  { tipo: "APH Acidente Trânsito", status: "Em andamento", regiao: "Imbiribeira", data: "2025-10-25T15:00:00Z" },
  { tipo: "APH Acidente Trânsito", status: "Concluída", regiao: "Boa Viagem", data: "2025-10-25T16:00:00Z" },
  { tipo: "APH Acidente Trânsito", status: "Concluída", regiao: "Boa Viagem", data: "2025-10-25T12:00:00Z" },
  { tipo: "Incêndio Estrutural", status: "Em andamento", regiao: "Boa Viagem", data: "2025-10-25T14:00:00Z" },
  { tipo: "Incêndio em Veículo", status: "Pendente", regiao: "Recife Antigo", data: "2025-10-24T09:30:00Z" },
  { tipo: "Resgate em Altura", status: "Em andamento", regiao: "Várzea", data: "2025-10-25T14:15:00Z" },
  { tipo: "Salvamento Aquático", status: "Concluída", regiao: "Madalena", data: "2025-10-23T11:00:00Z" },
  { tipo: "Resgate em Altura", status: "Em andamento", regiao: "Várzea", data: "2025-10-25T17:00:00Z" },
  { tipo: "Prevenção Aquática", status: "Pendente", regiao: "Pina", data: "2025-10-25T14:30:00Z" },
  { tipo: "Produtos Perigosos", status: "Concluída", regiao: "Ibura", data: "2025-10-23T12:00:00Z" },
  { tipo: "Atividade Comunitária", status: "Concluída", regiao: "Casa Amarela", data: "2025-10-24T10:00:00Z" },
];

// ======================================================================
// FUNÇÃO AUXILIAR: Abreviar rótulos longos no eixo X
// ======================================================================
const abreviarRotulo = (nome: string): string => {
  // Abreviar Tipos de Ocorrência
  if (nome.includes("Acidente Trânsito")) return "Acide. Trâns.";
  if (nome.includes("Resgate em Altura")) return "Resg. Altura";
  if (nome.includes("Incêndio Estrutural")) return "Inc. Estrut.";
  if (nome.includes("Incêndio em Veículo")) return "Inc. Veículo";
  if (nome.includes("Salvamento Aquático")) return "Salv. Aquát.";
  if (nome.includes("Atividade Comunitária")) return "Ativ. Comunit.";
  if (nome.includes("Produtos Perigosos")) return "Prod. Perig.";
  if (nome.includes("Prevenção Aquática")) return "Prev. Aquát.";
  
  return nome; // Retorna o nome original se for curto
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
        return parsedData.length > 0 ? parsedData : DADOS_INICIAIS_FICTICIOS;
      } catch (e) {
        return DADOS_INICIAIS_FICTICIOS;
      }
    }
    return DADOS_INICIAIS_FICTICIOS;
  });

  const carregarDados = () => {
    const data = localStorage.getItem("ocorrencias");
    if (data) {
        try {
            setOcorrencias(JSON.parse(data)); 
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

  // Função helper para agregação
  const aggregateData = (key: keyof Ocorrencia): DadosGrafico[] => {
    return Object.entries(
      ocorrencias.reduce((acc, o) => {
        const itemKey = o[key] as string;
        acc[itemKey] = (acc[itemKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));
  };

  // ==================================================================
  // 5- Cálculos dos dados para os gráficos
  // ==================================================================

  const totalHoje = ocorrencias.length;

  // KPIs
  const emAndamento = ocorrencias.filter(o => o.status === "Em andamento").length;
  const pendentes = ocorrencias.filter(o => o.status === "Pendente").length;
  const concluidas = ocorrencias.filter(o => o.status === "Concluída").length;

  // Gráfico 1 - Ocorrências por Tipo (Rosca)
  const dadosGraficoTipo = aggregateData("tipo");
  
  // Gráfico 3 - Ocorrências por Região (Barra)
  const dadosGraficoRegiao = aggregateData("regiao");

  // Gráfico 4 - Evolução Mensal (Linha)
  const dadosEvolucaoMensal = DADOS_MENSAIS_EVOLUCAO; 

  // Gráfico 5 - Top 5 Tipos (Barras)
  const dadosGraficoTop5: DadosGrafico[] = dadosGraficoTipo
    .sort((a, b) => b.value - a.value) 
    .slice(0, 5); 

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
        
        {/* POSIÇÃO 1: CARD OCORRÊNCIAS HOJE (kpi-azul) */}
        <div className="kpi-card kpi-azul">
          <div className="kpi-info">
            <span className="kpi-title">Ocorrências Hoje</span>
            <span className="kpi-value">{totalHoje}</span>
            <span className="kpi-details">Registradas nas últimas 24h</span>
          </div>
          <div className="kpi-icon"><AlertTriangle /></div>
        </div>

        {/* POSIÇÃO 2: CARD EM ANDAMENTO (kpi-vermelho) */}
        <div className="kpi-card kpi-vermelho">
          <div className="kpi-info">
            <span className="kpi-title">Em Andamento</span>
            <span className="kpi-value">{emAndamento}</span>
            <span className="kpi-details">Equipes mobilizadas</span>
          </div>
          <div className="kpi-icon"><Clock /></div>
        </div>
        
        {/* POSIÇÃO 3: CARD PENDENTES (kpi-amarelo) - PRIORIDADE */}
        <div className="kpi-card kpi-amarelo">
          <div className="kpi-info">
            <span className="kpi-title">Pendentes</span>
            <span className="kpi-value">{pendentes}</span>
            <span className="kpi-details">Aguardando despacho</span>
          </div>
          <div className="kpi-icon"><BarChart3 /></div>
        </div>

        {/* POSIÇÃO 4: CARD CONCLUÍDAS (kpi-verde) */}
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
                    // Lógica para mapear a cor baseada na Natureza (palavra-chave no nome)
                    const naturezaChave = Object.keys(NATUREZA_COLOR_MAP).find(key => 
                        d.name.includes(key)
                    );

                    // Atribui a cor mapeada ou usa a próxima cor da paleta (fallback)
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
          <h3>Evolução Mensal (Tendência 2025)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosEvolucaoMensal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0d47a1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Slot 3 — Ocorrências por Região (Barra) */}
        <div className="info-card chart-card">
          <h3>Ocorrências por Região</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGraficoRegiao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                interval={0}        /* 1. MANTÉM TODOS OS RÓTULOS (não omite) */
                angle={-35}          /* 2. GIRA o texto em 35 graus (na diagonal) */
                textAnchor="end"     /* 3. ANCORA o texto na extremidade final (para melhor alinhamento) */
                height={80}          /* 4. AUMENTA a altura do eixo X para dar espaço para o texto girado */
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#c62828" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Slot 4 — Top 5 Tipos (Barras) - ABREVIAÇÃO APLICADA */}
        <div className="info-card chart-card">
          <h3>Top 5 Tipos de Ocorrência</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
                data={dadosGraficoTop5}
                margin={{ top: 5, right: 5, left: 25, bottom: 5 }} /* Margem para texto */
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                interval={0} 
                angle={-35} 
                textAnchor="end" 
                height={80} 
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