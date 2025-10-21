/**
 * @file AuditoriaPage.tsx
 * @description Página para visualização de logs de auditoria do sistema com filtro em tempo real.
 */

// Importações do React e dos estilos específicos da página.
import React, { useState, useEffect } from 'react';
import './AuditoriaPage.css';

// --- Ícones SVG como Componentes Internos ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

// --- Dados de Exemplo (Originais, sem filtro) ---
const allLogs = [
    { id: 1, user: 'Major Wedja Souza', cargo: 'Major', initials: 'WS', action: 'LOGIN', details: 'Login bem-sucedido no sistema', timestamp: '2025-10-26 08:00:15', ip: '187.55.12.34' },
    { id: 2, user: 'Capitã Vanessa Matias', cargo: 'Capitão', initials: 'VM', action: 'CREATE', details: 'Criou a ocorrência #B01234 (Incêndio em Edificação)', timestamp: '2025-10-26 09:15:42', ip: '177.99.45.11' },
    { id: 3, user: 'Tenente Wslany Amorim', cargo: 'Primeiro Tenente', initials: 'WA', action: 'UPDATE', details: 'Atualizou status da ocorrência #B01234 para "Em Andamento"', timestamp: '2025-10-26 09:30:05', ip: '177.99.45.11' },
    { id: 4, user: 'Sargento Marcela Negrão', cargo: 'Primeiro Sargento', initials: 'MN', action: 'DELETE', details: 'Excluiu o usuário "temporario@bombeiro.pe.gov.br"', timestamp: '2025-10-26 10:05:21', ip: '200.17.88.90' },
    { id: 5, user: 'Cabo Sophia Santos', cargo: 'Cabo', initials: 'SS', action: 'UPDATE', details: 'Adicionou foto à ocorrência #B01235 (Acidente de Trânsito)', timestamp: '2025-10-26 10:15:00', ip: '192.168.1.10' },
    { id: 6, user: 'Soldado Agnes Ribeiro', cargo: 'Soldado', initials: 'AR', action: 'CREATE', details: 'Registrou nova ocorrência #B01236 (Atendimento Pré-Hospitalar)', timestamp: '2025-10-26 10:30:11', ip: '201.54.23.98' },
    { id: 7, user: 'Major Wedja Souza', cargo: 'Major', initials: 'WS', action: 'EXPORT', details: 'Exportou relatório de ocorrências de Outubro/2025', timestamp: '2025-10-26 11:20:00', ip: '187.55.12.34' },
];

// --- Componente Principal da Página de Auditoria ---
const AuditoriaPage = () => {
    // --- Estados para os Filtros ---
    // Armazenam os valores selecionados pelo usuário em cada campo de filtro.
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCargo, setSelectedCargo] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // --- Estado para os Logs Exibidos ---
    // Armazena a lista de logs que será de fato renderizada na tabela, já filtrada.
    const [filteredLogs, setFilteredLogs] = useState(allLogs);

    // --- Efeito para Aplicar os Filtros ---
    // Este `useEffect` é executado toda vez que um dos estados de filtro (searchTerm, etc.) muda.
    useEffect(() => {
        let logs = allLogs;

        // 1. Filtro por Termo de Busca (case-insensitive)
        if (searchTerm) {
            logs = logs.filter(log =>
                log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.ip.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Filtro por Cargo
        if (selectedCargo) {
            logs = logs.filter(log => log.cargo === selectedCargo);
        }

        // 3. Filtro por Ação
        if (selectedAction) {
            logs = logs.filter(log => log.action === selectedAction);
        }
        
        // 4. Filtro por Data
        if (selectedDate) {
            logs = logs.filter(log => log.timestamp.startsWith(selectedDate));
        }

        // Atualiza o estado dos logs que serão exibidos na tela.
        setFilteredLogs(logs);

    }, [searchTerm, selectedCargo, selectedAction, selectedDate]); // O array de dependências


    return (
        <div className="auditoria-page-container">
            {/* Cabeçalho da página */}
            <div className="page-header">
                <div className="page-title">
                    <h2>Auditoria</h2>
                    <p>Acompanhe os eventos e ações importantes realizadas no sistema.</p>
                </div>
            </div>

            {/* Card de Filtros */}
            <div className="filter-card">
                <div className="filter-header">
                    <h3>Filtrar Registros</h3>
                    <p>Os resultados são atualizados automaticamente.</p>
                </div>

                <div className="filter-grid">
                    {/* Input de busca */}
                    <div className="search-input-wrapper">
                        <span className="search-icon"><SearchIcon /></span>
                        <input
                            type="text"
                            placeholder="Buscar por detalhes ou IP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Select de Cargos */}
                    <select value={selectedCargo} onChange={(e) => setSelectedCargo(e.target.value)}>
                        <option value="">Todos os Cargos</option>
                        <optgroup label="Praças">
                            <option value="Soldado">Soldado</option>
                            <option value="Cabo">Cabo</option>
                            <option value="Terceiro Sargento">Terceiro Sargento</option>
                            <option value="Segundo Sargento">Segundo Sargento</option>
                            <option value="Primeiro Sargento">Primeiro Sargento</option>
                            <option value="Subtenente">Subtenente</option>
                        </optgroup>
                        <optgroup label="Oficiais">
                            <option value="Segundo Tenente">Segundo Tenente</option>
                            <option value="Primeiro Tenente">Primeiro Tenente</option>
                            <option value="Capitão">Capitão</option>
                            <option value="Major">Major</option>
                            <option value="Tenente-Coronel">Tenente-Coronel</option>
                            <option value="Coronel">Coronel</option>
                        </optgroup>
                    </select>

                    {/* Select de Ações */}
                    <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
                        <option value="">Todas as Ações</option>
                        <option value="LOGIN">Login</option>
                        <option value="CREATE">Criação</option>
                        <option value="UPDATE">Atualização</option>
                        <option value="DELETE">Exclusão</option>
                        <option value="EXPORT">Exportação</option>
                    </select>

                    {/* Input de Data */}
                    <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>
            
            {/* Tabela de Logs */}
            <div className="list-card">
                <table className="auditoria-table">
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Ação</th>
                            <th>Detalhes</th>
                            <th>Data e Hora</th>
                            <th>Endereço IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.id}>
                                <td data-label="Usuário">
                                    <div className="table-user-info">
                                        <div className="table-user-avatar">{log.initials}</div>
                                        <span>{log.user}</span>
                                    </div>
                                </td>
                                <td data-label="Ação">
                                    <span className={`action-badge action-${log.action.toLowerCase()}`}>{log.action}</span>
                                </td>
                                <td data-label="Detalhes">{log.details}</td>
                                <td data-label="Data e Hora">{log.timestamp}</td>
                                <td data-label="Endereço IP">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {/* Mensagem para quando nenhum resultado é encontrado */}
                 {filteredLogs.length === 0 && (
                    <div className="no-results-message">
                        <p>Nenhum registro encontrado para os filtros selecionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditoriaPage;

