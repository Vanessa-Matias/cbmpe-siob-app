/**
 * @file RelatoriosPage.tsx
 * @description Componente que renderiza a página de geração e exportação de relatórios.
 */

import React from 'react';
import './RelatoriosPage.css';
import { 
  FaFileLines, FaCalendarCheck, FaDownload, FaChartLine, 
  FaChartPie, FaChartBar, FaMapLocationDot, FaFilePdf 
} from 'react-icons/fa6';

const RelatoriosPage = () => {
  
  // Função mock para simular o download (conforme conversamos)
  const handleDownload = (tipo: string) => {
    alert(`Iniciando download do relatório: ${tipo} (PDF)...`);
    // Futuramente aqui entrará a lógica real
  };

  return (
    <div className="page-container">
      {/* Cabeçalho da página */}
      <header className="page-header">
        <div className="page-title">
          <h2>Relatórios</h2>
          <p>Gere e exporte relatórios detalhados das operações</p>
        </div>
      </header>

      {/* Seção de cartões de estatísticas (KPIs) */}
      <section className="report-kpi-grid">
        <div className="report-kpi-card">
          <FaFileLines className="report-kpi-icon" />
          <div className="report-kpi-info">
            <strong>42</strong>
            <span>Relatórios Gerados</span>
          </div>
        </div>
        <div className="report-kpi-card">
          <FaCalendarCheck className="report-kpi-icon" />
          <div className="report-kpi-info">
            <strong>7</strong>
            <span>Relatórios Agendados</span>
          </div>
        </div>
        <div className="report-kpi-card">
          <FaDownload className="report-kpi-icon" />
          <div className="report-kpi-info">
            <strong>156</strong>
            <span>Downloads Este Mês</span>
          </div>
        </div>
        <div className="report-kpi-card">
          <FaChartLine className="report-kpi-icon" />
          <div className="report-kpi-info">
            <strong>98%</strong>
            <span>Taxa de Precisão</span>
          </div>
        </div>
      </section>

      {/* Seção com os cards de cada tipo de relatório para download */}
      <section className="report-cards-grid">
        
        {/* Card 1 */}
        <div className="report-card">
          <FaChartPie className="report-card-icon" />
          <h3>Relatório Mensal</h3>
          <p>Resumo completo das atividades do mês</p>
          <div className="report-info">
            <span>Formato disponível: <strong>PDF</strong></span>
            <small>Gerado pela última vez em: 20/09/2025</small>
          </div>
          <div className="report-actions">
            <button className="button-pdf" onClick={() => handleDownload('Mensal')}>
                <FaFilePdf /> Baixar PDF
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="report-card">
          <FaChartBar className="report-card-icon" />
          <h3>Performance Operacional</h3>
          <p>Métricas de tempo de resposta e eficiência</p>
          <div className="report-info">
            <span>Formato disponível: <strong>PDF</strong></span>
            <small>Gerado pela última vez em: 20/09/2025</small>
          </div>
          <div className="report-actions">
            <button className="button-pdf" onClick={() => handleDownload('Performance')}>
                <FaFilePdf /> Baixar PDF
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="report-card">
          <FaFileLines className="report-card-icon" />
          <h3>Análise de Incidentes</h3>
          <p>Distribuições e tendências por tipo de ocorrência</p>
          <div className="report-info">
            <span>Formato disponível: <strong>PDF</strong></span>
            <small>Gerado pela última vez em: 20/09/2025</small>
          </div>
          <div className="report-actions">
            <button className="button-pdf" onClick={() => handleDownload('Incidentes')}>
                <FaFilePdf /> Baixar PDF
            </button>
          </div>
        </div>

        {/* Card 4 */}
        <div className="report-card">
          <FaMapLocationDot className="report-card-icon" />
          <h3>Mapeamento Regional</h3>
          <p>Ocorrências por região e zona de atendimento</p>
          <div className="report-info">
            <span>Formato disponível: <strong>PDF</strong></span>
            <small>Gerado pela última vez em: 20/09/2025</small>
          </div>
          <div className="report-actions">
            <button className="button-pdf" onClick={() => handleDownload('Regional')}>
                <FaFilePdf /> Baixar PDF
            </button>
          </div>
        </div>

      </section>
    </div>
  );
};

export default RelatoriosPage;