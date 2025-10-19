/**
 * @file LoginPage.tsx
 * @description Este arquivo define o componente da página de Login.
 * Ele é responsável por renderizar o formulário de login, gerenciar a visibilidade
 * da senha e notificar o componente principal (App.tsx) quando o login for bem-sucedido.
 */

// ==========================================================================
//   1. Importações de Módulos e Estilos
// ==========================================================================

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import './LoginPage.css';

// Importa a imagem da logo que está na pasta 'assets'.
import siobLogo from '../../assets/siob-logo.png';


// ==========================================================================
//   2. Definição de Tipos (Props)
// ==========================================================================

type LoginPageProps = {
  // Define que o componente deve receber uma função chamada 'onLoginSuccess'.
  onLoginSuccess: () => void;
};


// ==========================================================================
//   3. Definição do Componente
// ==========================================================================

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  // Estado para controlar a visibilidade da senha (mostrando/escondendo).
  const [showPassword, setShowPassword] = useState(false);

  // Função para alternar o estado de visibilidade da senha.
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      
      {/* O cabeçalho da página de login, com logo e títulos. */}
      <header className="login-header">
        {/* Usamos uma div para ser a "caixa" branca. */}
        <div className="login-logo-container">
          {/* A imagem fica dentro da div. */}
          <img src={siobLogo} alt="Logo SIOB" className="login-logo-image" />
        </div>
        <h1>SIOB</h1>
        <h2>Sistema Integrado de Ocorrências dos Bombeiros</h2>
        <p>Sistema de Gestão de Ocorrências</p>
      </header>

      {/* A caixa branca principal que contém o formulário. */}
      <main className="login-box">
        <h3>Acesso ao Sistema</h3>
        <p className="login-subtitle">Digite suas credenciais para continuar</p>
        
        {/* Campo de Email */}
        <div className="input-group">
          <label htmlFor="email">E-mail institucional</label>
          <input 
            type="email" 
            id="email" 
            placeholder="exemplo@cbmpe.gov.br" 
          />
        </div>
        
        {/* Campo de Senha com a funcionalidade de visibilidade */}
        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="password" 
              placeholder="senha123" 
            />
            <span onClick={togglePasswordVisibility} className="password-toggle-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        
        {/* Botão de Login */}
        <button className="login-button" onClick={onLoginSuccess}>
          Entrar no Sistema
        </button>
      </main>

      {/* O rodapé da página. */}
      <footer className="login-footer">
        <p>Sistema Oficial do Corpo de Bombeiros Militar de Pernambuco</p>
        <p>versão 1.0 - 2025</p>
      </footer>

    </div>
  );
};


// ==========================================================================
//   4. Exportação do Componente
// ==========================================================================

// Exporta o componente para que ele possa ser usado em outras partes da aplicação.
export default LoginPage;