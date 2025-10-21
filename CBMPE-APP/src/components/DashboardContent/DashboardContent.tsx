import React from 'react';
// A LINHA ABAIXO É CRUCIAL: Ela conecta este componente ao seu arquivo de estilo.
import '../DashboardPage/DashboardPage.css'; 
import { 
  FaTriangleExclamation, FaClock, FaCircleCheck, FaChartLine,
  FaFire, FaCarBurst, FaHeartPulse, FaLifeRing, FaDroplet, FaShapes, FaMapPin, FaBuildingColumns
} from 'react-icons/fa6';

const DashboardContent = () => {
  return (
    <>
      <div className="dashboard-title">
        <h2>Dashboard Operacional</h2>
        <p>Visão geral das ocorrências do Corpo de Bombeiros Militar de Pernambuco</p>
      </div>
      <section className="kpi-grid">
        <div className="kpi-card kpi-red"><div className="kpi-info"><span className="kpi-title">Ocorrências Hoje</span><span className="kpi-value">8</span><span className="kpi-details">Registradas nas últimas 24h</span><span className="kpi-comparison">↓12% vs. mês anterior</span></div><FaTriangleExclamation className="kpi-icon" /></div>
        <div className="kpi-card kpi-yellow"><div className="kpi-info"><span className="kpi-title">Em andamento</span><span className="kpi-value">8</span><span className="kpi-details">Equipes mobilizadas</span><span className="kpi-comparison">↓5% vs. mês anterior</span></div><FaClock className="kpi-icon" /></div>
        <div className="kpi-card kpi-green"><div className="kpi-info"><span className="kpi-title">Concluídas</span><span className="kpi-value">231</span><span className="kpi-details">Este mês</span><span className="kpi-comparison">↑8% vs. mês anterior</span></div><FaCircleCheck className="kpi-icon" /></div>
        <div className="kpi-card kpi-blue"><div className="kpi-info"><span className="kpi-title">Tempo Médio</span><span className="kpi-value">12.5min</span><span className="kpi-details">Respostas das equipes</span><span className="kpi-comparison">↓3% vs. mês anterior</span></div><FaChartLine className="kpi-icon" /></div>
      </section>

      <section className="content-grid">
        <div className="info-card"><h3>Ocorrência por tipo</h3><p>Distribuição no mês atual</p><ul className="info-list"><li><FaFire className="icon-type icon-fire"/> Incêndio <span className="badge">45</span></li><li><FaCarBurst className="icon-type icon-accident"/> Acidente <span className="badge">45</span></li><li><FaHeartPulse className="icon-type icon-medical"/> Emergência Médica <span className="badge">45</span></li><li><FaLifeRing className="icon-type icon-rescue"/> Resgate <span className="badge">45</span></li><li><FaDroplet className="icon-type icon-leak"/> Vazamento <span className="badge">45</span></li><li><FaShapes className="icon-type icon-others"/> Outros <span className="badge">45</span></li></ul></div>
        <div className="info-card"><h3>Por Região</h3><p>Atendimento por localidade</p><ul className="info-list"><li><FaMapPin className="icon-type icon-region"/> Recife <span className="badge">45</span></li><li><FaMapPin className="icon-type icon-region"/> Olinda <span className="badge">88</span></li><li><FaMapPin className="icon-type icon-region"/> Jaboatão <span className="badge">36</span></li><li><FaMapPin className="icon-type icon-region"/> Paulista <span className="badge">45</span></li></ul></div>
        <div className="info-card"><h3>Recentes</h3><p>Últimas ocorrências registradas</p><ul className="info-list-recent"><li><FaFire className="icon-type icon-fire"/><div className="recent-details"><span className="recent-code">OCR-2025-001</span><span className="recent-title">Incêndio em Residência - Rua das Flores</span><span className="recent-location"><FaMapPin/> Recife - Centro</span></div></li><li><FaCarBurst className="icon-type icon-accident"/><div className="recent-details"><span className="recent-code">OCR-2025-002</span><span className="recent-title">Acidente de trânsito - BR-101</span><span className="recent-location"><FaBuildingColumns/> Jaboatão dos Guararapes</span></div></li><li><FaLifeRing className="icon-type icon-rescue"/><div className="recent-details"><span className="recent-code">OCR-2025-003</span><span className="recent-title">Resgate em altura - Prédio Residencial</span><span className="recent-location"><FaBuildingColumns/> Olinda</span></div></li></ul></div>
      </section>
      
      <section className="info-card">
        <h3>Status Geral das Operacoes</h3><p>Panorama atual das atividades</p><div className="status-grid"><div className="status-card status-pending"><span className="status-value">15</span><span className="status-label">Pendentes</span></div><div className="status-card status-ongoing"><span className="status-value">8</span><span className="status-label">Em andamento</span></div><div className="status-card status-completed"><span className="status-value">231</span><span className="status-label">Concluídas</span></div></div>
      </section>
    </>
  );
};
export default DashboardContent;