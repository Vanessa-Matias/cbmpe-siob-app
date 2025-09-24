/**
 * @file OcorrenciasPage.tsx
 * @description Componente que renderiza a página de listagem e gerenciamento de ocorrências.
 */

import React from 'react';
import './OcorrenciasPage.css';
// O ícone FaPencil foi removido da lista de importação.
import { FaUpload, FaPlus, FaMagnifyingGlass } from 'react-icons/fa6';

/**
 * Componente funcional OcorrenciasPage.
 * Exibe filtros de busca e uma tabela com a lista de ocorrências.
 */
const OcorrenciasPage = () => {
  // Dados estáticos para simulação da tabela.
  const ocorrencias = [
    { id: 'OCR-2025-001', tipo: 'Incêndio', titulo: 'Incêndio em Residência', status: 'Pendente', prioridade: 'Alta', regiao: 'Recife - Centro', data: '20/01/2025', hora: '12:40', equipe: 'Aguardando designação' },
    { id: 'OCR-2025-002', tipo: 'Acidente de Trânsito', titulo: 'Emergência Médica', status: 'Em andamento', prioridade: 'Média', regiao: 'Jaboatão dos Guararapes', data: '20/01/2025', hora: '11:55', equipe: 'Por: Sgt. Oliveira' },
    { id: 'OCR-2025-003', tipo: 'Acidente de Trânsito', titulo: 'Emergência Médica', status: 'Encerrado', prioridade: 'Baixa', regiao: 'Olinda', data: '20/01/2025', hora: '11:15', equipe: 'Por: Sgt. Oliveira' },
    { id: 'OCR-2025-004', tipo: 'Resgate', titulo: 'Resgate em altura', status: 'Encerrado', prioridade: 'Baixa', regiao: 'Recife - Boa Viagem', data: '20/01/2025', hora: '11:15', equipe: 'Por: Sgt. Oliveira' },
  ];

  return (
    // Container principal da página.
    <div className="page-container">
      {/* Cabeçalho da página com título e botões de ação. */}
      <header className="page-header">
        <div className="page-title">
          <h2>Ocorrências</h2>
          <p>Gerencie todas as ocorrências registradas no sistema</p>
        </div>
        <div className="page-actions">
          <button className="button-secondary"><FaUpload /> Exportar</button>
          <button className="button-primary"><FaPlus /> Nova Ocorrência</button>
        </div>
      </header>

      {/* Card com os campos de filtro e busca. */}
      <div className="filter-card">
        <h3>Filtro e Busca</h3>
        <p>Use o filtro para encontrar ocorrências específicas</p>
        <div className="filter-inputs">
          <div className="search-input-wrapper">
            <FaMagnifyingGlass className="search-icon" />
            <input type="text" placeholder="Buscar por ID, título ou região..." />
          </div>
          <select><option>Todos os Tipos</option></select>
          <select><option>Todos os Status</option></select>
          <select><option>Todas as Prioridades</option></select>
        </div>
      </div>

      {/* Card com a tabela de listagem das ocorrências. */}
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapeia o array de ocorrências para renderizar uma linha para cada item. */}
            {ocorrencias.map((ocorrencia) => (
              <tr key={ocorrencia.id}>
                <td data-label="ID">{ocorrencia.id}</td>
                <td data-label="Tipo">{ocorrencia.tipo}</td>
                <td data-label="Título">
                  <span>{ocorrencia.titulo}</span>
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
                <td data-label="Ações">
                  <button className="button-action">
                    {/* O ícone foi removido desta linha. */}
                    Formulário
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OcorrenciasPage;