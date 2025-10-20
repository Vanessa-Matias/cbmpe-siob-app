/**
 * @file UsuariosPage.tsx
 * @description Componente principal para a página de gerenciamento de usuários.
 * Controla a exibição da lista, filtros e o ciclo de vida do modal de CRUD.
 */

import React, { useState, useMemo } from 'react';
import './UsuariosPage.css';
import UserModal from './UserModal';

// Mock de dados para simulação da lista de usuários.
const mockUsers = [
  { id: 1, nome: 'Cap. João Silva', email: 'joao.silva@cbm.pe.gov.br', cargo: 'Capitão', status: 'Ativo' },
  { id: 2, nome: 'Ten. Maria Santos', email: 'maria.santos@cbm.pe.gov.br', cargo: 'Tenente', status: 'Ativo' },
  { id: 3, nome: 'Sgt. Pedro Oliveira', email: 'pedro.oliveira@cbm.pe.gov.br', cargo: 'Sargento', status: 'Inativo' },
  { id: 4, nome: 'Cb. Ana Costa', email: 'ana.costa@cbm.pe.gov.br', cargo: 'Cabo', status: 'Inativo' },
  { id: 5, nome: 'Cel. Ana Beatriz', email: 'ana.beatriz@cbm.pe.gov.br', cargo: 'Coronel', status: 'Ativo' },
];

// Componentes funcionais para renderização de ícones SVG.
const IconeLupa = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const IconeEditar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const IconeExcluir = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

/**
 * Renderiza a página de gerenciamento de usuários.
 */
const UsuariosPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  //  Estados para controlar os valores dos filtros.
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCargo, setFilterCargo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  /**
   * Abre o modal para criação/edição.
   */
  const handleOpenModal = (user: any | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  /**
   * Fecha o modal.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  /**
   * Salva um usuário (novo ou editado).
   */
  const handleSaveUser = (userToSave: any) => {
    if (userToSave.id) {
      setUsers(users.map(u => u.id === userToSave.id ? userToSave : u));
      alert('Usuário atualizado com sucesso!');
    } else {
      const newUser = { ...userToSave, id: Date.now(), status: 'Ativo' };
      setUsers([...users, newUser]);
      alert('Usuário adicionado com sucesso!');
    }
    handleCloseModal();
  };
  
  /**
   * Exclui um usuário.
   */
  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
        setUsers(users.filter(u => u.id !== userId));
        alert('Usuário excluído com sucesso!');
    }
  };

  // Lógica de filtragem.
  // 'useMemo' otimiza a performance, recalculando a lista apenas quando os filtros mudam.
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchTermLower = searchTerm.toLowerCase();
      // Condição 1: Filtro de busca (nome ou email)
      const matchesSearch = user.nome.toLowerCase().includes(searchTermLower) ||
                            user.email.toLowerCase().includes(searchTermLower);
      // Condição 2: Filtro de cargo
      const matchesCargo = filterCargo ? user.cargo === filterCargo : true;
      // Condição 3: Filtro de status
      const matchesStatus = filterStatus ? user.status === filterStatus : true;

      return matchesSearch && matchesCargo && matchesStatus;
    });
  }, [users, searchTerm, filterCargo, filterStatus]);

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title">
            <h2>Gerenciamento de Usuários</h2>
            <p>Gerencie usuários e permissões do sistema</p>
          </div>
          <div className="page-actions">
            <button className="button-primary" onClick={() => handleOpenModal()}>Adicionar Usuário</button>
          </div>
        </div>

        <div className="filter-card">
            <h3>Filtro e Busca</h3>
            <p>Busque e filtre usuários</p>
            <div className="filter-inputs">
                <div className="search-input-wrapper">
                    <span className="search-icon"><IconeLupa /></span>
                    {/* Conecta o input ao estado 'searchTerm' */}
                    <input 
                      type="text" 
                      placeholder="Buscar por nome ou email..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/*  Conecta o select ao estado 'filterCargo' */}
                <select value={filterCargo} onChange={(e) => setFilterCargo(e.target.value)}>
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
                {/* Conecta o select ao estado 'filterStatus' */}
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">Todos os Status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
            </div>
        </div>

        <div className="user-list-card">
            <h3>Lista de Usuários</h3>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Cargo</th>
                        <th>Status</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Renderiza a lista de usuários JÁ FILTRADA */}
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td data-label="Nome" className="user-name-cell">
                            <span className={`status-dot status-${user.status.toLowerCase()}`}></span>
                        {user.nome}
                        </td>
                            <td data-label="Email">{user.email}</td>
                            <td data-label="Cargo">{user.cargo}</td>
                            <td data-label="Status">
                                <span className={`status-badge status-${user.status.toLowerCase()}`}>{user.status}</span>
                            </td>
                            <td data-label="Ação" className="action-buttons">
                                <button className="edit-btn" title="Editar" onClick={() => handleOpenModal(user)}><IconeEditar /></button>
                                <button className="delete-btn" title="Excluir" onClick={() => handleDeleteUser(user.id)}><IconeExcluir /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <UserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default UsuariosPage;

