/**
 * @file UserModal.tsx
 * @description Componente de UI para o modal de criação e edição de usuários.
 * Este é um "componente de apresentação", recebendo dados e funções via props.
 */

import React, { useState, useEffect } from 'react';
import './UserModal.css';

// Define a tipagem das props que o componente espera receber do pai (UsuariosPage).
type Props = {
  user: any | null;       // Objeto do usuário para edição, ou null para criação.
  onSave: (user: any) => void; // Função callback para salvar os dados.
  onClose: () => void;      // Função callback para fechar o modal.
};

const UserModal: React.FC<Props> = ({ user, onSave, onClose }) => {
  // Estado interno para gerenciar os dados do formulário.
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    email: '',
    cargo: '',
    status: 'Ativo',
  });

  // Hook de efeito para popular o formulário quando em modo de edição.
  // Executa sempre que a prop 'user' é alterada.
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  /**
   * Manipulador genérico para atualizar o estado do formulário a cada alteração nos inputs.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Manipulador para o envio do formulário.
   * Invoca a função 'onSave' passada via props, delegando a lógica de salvamento ao componente pai.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previne o recarregamento padrão da página.
    onSave(formData);
  };

  // Define o título do modal dinamicamente com base na existência de um usuário para edição.
  const modalTitle = user ? 'Editar Usuário' : 'Adicionar Novo Usuário';

  return (
    // O overlay escurece o fundo. O onClick aciona o fechamento do modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* O stopPropagation evita que o clique dentro do modal feche a janela. */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* Cabeçalho do modal com título dinâmico e botão de fechar. */}
          <div className="modal-header">
            <h3>{modalTitle}</h3>
            <button type="button" className="close-button" onClick={onClose}>&times;</button>
          </div>

          {/* Corpo do modal contendo os campos do formulário. */}
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="cargo">Cargo</label>
                <select id="cargo" name="cargo" value={formData.cargo} onChange={handleChange} required>
                  <option value="">Selecione...</option>
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
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rodapé do modal com os botões de ação. */}
          <div className="modal-footer">
            <button type="button" className="button-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="button-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;

