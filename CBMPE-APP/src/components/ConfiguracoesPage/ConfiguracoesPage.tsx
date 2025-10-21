/**
 * @file ConfiguracoesPage.tsx
 * @description Página de configurações aprimorada, baseada no protótipo do Figma.
 * Inclui modo de edição para o perfil e modal para alteração de senha com botão de exibição de senha.
 */

import React, { useState } from 'react';
import './ConfiguracoesPage.css';

// Importação da foto de perfil
import profileImage from '../../assets/teste1.png';

// --- Ícones SVG ---
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// --- Ícone de Olho (mostrar/ocultar senha) ---
const EyeIcon = ({ visible }: { visible: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
    {visible ? (
      <>
        <path d="M1 1l22 22" stroke="currentColor" />
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7.03 20 2.73 16.11 1 12c.69-1.58 1.76-3.04 3.1-4.34m3.45-2.54A10.94 10.94 0 0 1 12 4c4.97 0 9.27 3.89 11 8-1.05 2.38-2.79 4.46-4.94 6.01" />
      </>
    ) : (
      <>
        <path d="M1 12C2.73 16.11 7.03 20 12 20s9.27-3.89 11-8c-1.73-4.11-6.03-8-11-8S2.73 7.89 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

// --- Componente Principal ---
const ConfiguracoesPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [userData, setUserData] = useState({
    nome: 'Sargento Vanessa Matias',
    matricula: '20240001',
    email: 'vanessa.matias@cbm.pe.gov.br',
    telefone: '(81) 98765-4321',
    unidade: 'Grupamento de Bombeiros da Região Metropolitana do Recife',
    avatarUrl: profileImage,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="configuracoes-page-container">
      {/* Cabeçalho */}
      <div className="page-header">
        <div className="page-title">
          <h2>Minha Conta</h2>
          <p>Gerencie suas informações de perfil e segurança.</p>
        </div>
      </div>

      {/* Card de Perfil */}
      <div className="settings-card">
        <div className="profile-header">
          <img src={userData.avatarUrl} alt="Foto de Perfil" className="profile-avatar" />
          <div className="profile-header-info">
            <h3>{userData.nome}</h3>
            <p>{userData.email}</p>
          </div>
          {!isEditing && (
            <button className="button-edit" onClick={() => setIsEditing(true)}>
              <EditIcon />
              <span>Editar</span>
            </button>
          )}
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome" value={userData.nome} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div className="form-group">
            <label htmlFor="matricula">Matrícula</label>
            <input type="text" id="matricula" name="matricula" value={userData.matricula} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input type="tel" id="telefone" name="telefone" value={userData.telefone} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div className="form-group">
            <label htmlFor="unidade">Unidade de Atuação</label>
            <input type="text" id="unidade" name="unidade" value={userData.unidade} disabled />
          </div>
        </div>

        {isEditing && (
          <div className="settings-card-footer">
            <button className="button-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
            <button className="button-primary" onClick={() => setIsEditing(false)}>Salvar Alterações</button>
          </div>
        )}
      </div>

      {/* Card de Segurança */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h3 className="header-with-icon"><LockIcon /> Segurança da Conta</h3>
        </div>
        <div className="security-item">
          <div>
            <h4>Alterar Senha</h4>
            <p>Recomendamos que você altere sua senha periodicamente.</p>
          </div>
          <button className="button-secondary" onClick={() => setIsModalOpen(true)}>Alterar</button>
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Alterar Senha</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {/* Campo 1 */}
              <div className="form-group password-field">
                <label htmlFor="currentPassword">Senha Atual</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    id="currentPassword"
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                  >
                    <EyeIcon visible={showPassword.current} />
                  </button>
                </div>
              </div>

              {/* Campo 2 */}
              <div className="form-group password-field">
                <label htmlFor="newPassword">Nova Senha</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="newPassword"
                    placeholder="Digite a nova senha"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  >
                    <EyeIcon visible={showPassword.new} />
                  </button>
                </div>
              </div>

              {/* Campo 3 */}
              <div className="form-group password-field">
                <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirme a nova senha"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    <EyeIcon visible={showPassword.confirm} />
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="button-primary" onClick={() => setIsModalOpen(false)}>Salvar Nova Senha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracoesPage;
