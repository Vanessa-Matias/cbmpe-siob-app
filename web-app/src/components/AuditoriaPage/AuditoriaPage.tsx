/**
 * @file AuditoriaPage.tsx
 * @description Página para visualização de logs de auditoria (Dados Estáticos para Apresentação).
 */

import React, { useState, useEffect } from 'react';
import './AuditoriaPage.css';
// Padronizando com os ícones que você já usa no projeto
import { FaMagnifyingGlass } from 'react-icons/fa6'; 

// --- Dados de Exemplo (MANTIDOS para garantir funcionamento na apresentação) ---
const allLogs = [
    { id: 1, user: 'Major Wedja Souza', cargo: 'Major', initials: 'WS', action: 'LOGIN', details: 'Login bem-sucedido no sistema', timestamp: '2025-10-26 08:00:15', ip: '187.55.12.34' },
    { id: 2, user: 'Capitã Vanessa Matias', cargo: 'Capitão', initials: 'VM', action: 'CREATE', details: 'Criou a ocorrência #B01234 (Incêndio em Edificação)', timestamp: '2025-10-26 09:15:42', ip: '177.99.45.11' },
    { id: 3, user: 'Tenente Wslany Amorim', cargo: 'Primeiro Tenente', initials: 'WA', action: 'UPDATE', details: 'Atualizou status da ocorrência #B01234 para "Em Andamento"', timestamp: '2025-10-26 09:30:05', ip: '177.99.45.11' },
    { id: 4, user: 'Sargento Marcela Negrão', cargo: 'Primeiro Sargento', initials: 'MN', action: 'DELETE', details: 'Excluiu o usuário "temporario@bombeiro.pe.gov.br"', timestamp: '2025-10-26 10:05:21', ip: '200.17.88.90' },
    { id: 5, user: 'Cabo Sophia Santos', cargo: 'Cabo', initials: 'SS', action: 'UPDATE', details: 'Adicionou foto à ocorrência #B01235 (Acidente de Trânsito)', timestamp: '2025-10-26 10:15:00', ip: '192.168.1.10' },
    { id: 6, user: 'Soldado Agnes Ribeiro', cargo: 'Soldado', initials: 'AR', action: 'CREATE', details: 'Registrou nova ocorrência #B01236 (Atendimento Pré-Hospitalar)', timestamp: '2025-10-26 10:30:11', ip: '201.54.23.98' },
    { id: 7, user: 'Major Wedja Souza', cargo: 'Major', initials: 'WS', action: 'EXPORT', details: 'Exportou relatório de ocorrências de Outubro/2025', timestamp: '2025-10-26 11:20:00', ip: '187.55.12.34' },
];

const AuditoriaPage = () => {
    // --- Estados para os Filtros ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCargo, setSelectedCargo] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const [filteredLogs, setFilteredLogs] = useState(allLogs);

    // --- Efeito de Filtro em Tempo Real ---
    useEffect(() => {
        let logs = allLogs;

        // 1. Filtro por Texto
        if (searchTerm) {
            logs = logs.filter(log =>
                log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.user.toLowerCase().includes(searchTerm.toLowerCase())
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

        setFilteredLogs(logs);

    }, [searchTerm, selectedCargo, selectedAction, selectedDate]);


    return (
        <div className="page-container"> {/* Padronizado com as outras páginas */}
            
            {/* Cabeçalho */}
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

                <div className="filter-inputs">
                    {/* Input de busca */}
                    <div className="search-input-wrapper">
                        <FaMagnifyingGlass className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por usuário, detalhes ou IP..."
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
                <table className="auditoria-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                                    <div className="table-user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="table-user-avatar" style={{ 
                                            background: '#d32f2f', color: '#fff', width: '32px', height: '32px', 
                                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' 
                                        }}>
                                            {log.initials}
                                        </div>
                                        <span>{log.user}</span>
                                    </div>
                                </td>
                                <td data-label="Ação">
                                    <span className={`action-badge action-${log.action.toLowerCase()}`} style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                                        backgroundColor: log.action === 'DELETE' ? '#ffebee' : log.action === 'CREATE' ? '#e8f5e9' : '#e3f2fd',
                                        color: log.action === 'DELETE' ? '#c62828' : log.action === 'CREATE' ? '#2e7d32' : '#1565c0'
                                    }}>
                                        {log.action}
                                    </span>
                                </td>
                                <td data-label="Detalhes">{log.details}</td>
                                <td data-label="Data e Hora">{log.timestamp}</td>
                                <td data-label="Endereço IP">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 
                 {filteredLogs.length === 0 && (
                    <div className="no-results-message" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        <p>Nenhum registro encontrado para os filtros selecionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditoriaPage;