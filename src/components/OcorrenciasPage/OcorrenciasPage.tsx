/**
 * @file OcorrenciasPage.tsx
 * @description Componente que renderiza a página de listagem e gerenciamento de ocorrências.
 * A partir desta tela, o usuário pode visualizar, filtrar e iniciar o processo de
 * registro de uma nova ocorrência.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para navegação programática
import './OcorrenciasPage.css';
import { FaUpload, FaPlus, FaMagnifyingGlass } from 'react-icons/fa6';

/**
 * Representa a estrutura de dados de uma única ocorrência.
 */
interface Ocorrencia {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  status: 'Pendente' | 'Em andamento' | 'Encerrado';
  prioridade: 'Alta' | 'Média' | 'Baixa';
  regiao: string;
  data: string;
  hora: string;
  equipe: string;
}

/**
 * Componente funcional OcorrenciasPage.
 * Exibe filtros de busca e uma tabela com a lista de ocorrências.
 */
const OcorrenciasPage = () => {
  // Hook do React Router para permitir a navegação entre páginas.
  const navigate = useNavigate();

  // Dados estáticos para simulação da tabela de ocorrências.
  // No futuro, estes dados virão de uma API.
  const ocorrencias: Ocorrencia[] = [
    { id: 'OCR-2025-001', tipo: 'Incêndio', titulo: 'Incêndio em Residência - Rua das Flores', descricao: '', status: 'Pendente', prioridade: 'Alta', regiao: 'Recife - Centro', data: '20/01/2025', hora: '12:40', equipe: 'Aguardando designação' },

    { id: 'OCR-2025-002', tipo: 'Emergência Médica', titulo: 'Acidente de Trânsito - BR-101', descricao: '', status: 'Em andamento', prioridade: 'Média', regiao: 'Jaboatão dos Guararapes', data: '20/01/2025', hora: '11:55', equipe: 'Por: Sgt. Oliveira' },

    { id: 'OCR-2025-003', tipo: 'Acidente', titulo: 'Emergência Médica - Idoso com Mal Súbito', descricao: '', status: 'Encerrado', prioridade: 'Baixa', regiao: 'Olinda - Centro', data: '20/01/2025', hora: '11:15', equipe: 'Por: Sgt. Oliveira' },

    { id: 'OCR-2025-004', tipo: 'Resgate', titulo: 'Resgate em altura - Prédio Residencial', descricao: '', status: 'Encerrado', prioridade: 'Baixa', regiao: 'Recife - Boa Viagem', data: '20/01/2025', hora: '11:15', equipe: 'Por: Sgt. Oliveira' },
  ];

  // Define as listas de opções para cada filtro.
  const tiposDeOcorrencia = [ "Todos os Tipos", "Incêndio", "Acidente", "Emergência Médica", "Resgate" ];
  const statusDeOcorrencia = ["Todos os Status", "Pendente", "Em andamento", "Encerrado"];
  const prioridadesDeOcorrencia = ["Todas as Prioridades", "Alta", "Média", "Baixa"];

  // Gerencia o estado da opção selecionada em cada filtro.
  const [tipoSelecionado, setTipoSelecionado] = useState(tiposDeOcorrencia[0]);
  const [statusSelecionado, setStatusSelecionado] = useState(statusDeOcorrencia[0]);
  const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(prioridadesDeOcorrencia[0]);

  /**
   * Navega o usuário para a página de criação de uma nova ocorrência.
   * Esta função é chamada pelo botão principal "+ Nova Ocorrência".
   */
  const handleNovaOcorrencia = () => {
    // Navega para a rota designada para o formulário de criação.
    navigate('/formulario'); 
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-title">
          <h2>Ocorrências</h2>
          <p>Gerencie todas as ocorrências registradas no sistema</p>
        </div>
        <div className="page-actions">
          <button className="button-secondary"><FaUpload /> Exportar</button>
          {/* O botão agora chama a função para criar uma nova ocorrência */}
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
            <input type="text" placeholder="Buscar por ID, título ou região..." />
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
        <h3>Lista de Ocorrências</h3>
        <table className="ocorrencias-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Título</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Região</th>
              <th>Data/Hora</th>
              <th>Equipe</th>
              {/* Coluna "Ações" foi removida para seguir a lógica correta e o design do protótipo */}
            </tr>
          </thead>
          <tbody>
            {ocorrencias.map((ocorrencia) => (
              <tr key={ocorrencia.id}>
                <td data-label="ID">{ocorrencia.id}</td>
                <td data-label="Tipo">{ocorrencia.tipo}</td>
                <td data-label="Título" className="titulo-descricao">
                  <span>{ocorrencia.titulo}</span>
                  <small>{ocorrencia.descricao}</small>
                </td>
                <td data-label="Status"><span className={`status-badge status-${ocorrencia.status.toLowerCase().replace(' ', '-')}`}>{ocorrencia.status}</span></td>
                <td data-label="Prioridade"><span className={`prioridade-badge prioridade-${ocorrencia.prioridade.toLowerCase()}`}>{ocorrencia.prioridade}</span></td>
                <td data-label="Região">{ocorrencia.regiao}</td>
                <td data-label="Data/Hora">
                  <div className="data-hora-container">
                    <span>{ocorrencia.data}</span>
                    <small>{ocorrencia.hora}</small>
                  </div>
                </td>
                <td data-label="Equipe">{ocorrencia.equipe}</td>
                {/* O botão de ação em cada linha foi removido. */}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Rodapé da tabela com informações de paginação. */}
        <footer className="table-footer">
          <span className="pagination-info">Exibindo 4 de 1.210 ocorrências</span>
          <div className="pagination-controls">
            <button>&lt;</button>
            <span>1-4 de 36</span>
            <button>&gt;</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OcorrenciasPage;
