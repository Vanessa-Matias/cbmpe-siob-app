/**
 * @file LoginPage.tsx
 * @description Componente de Login e Boas-vindas do SIOB.
 */

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

// Imagens principais
import loginImage1 from '../../assets/login01.jpg';
import loginImage2 from '../../assets/login03.jpg';
import siobLogo from '../../assets/siob-logo.png';
import logoFormulario from '../../assets/siob-logo1.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isIntro, setIsIntro] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email) return 'Informe o e-mail institucional.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'E-mail inválido.';
    if (!password) return 'Informe a senha.';
    return null;
  };

  const safeStore = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return 'localStorage';
    } catch {
      try {
        sessionStorage.setItem(key, value);
        return 'sessionStorage';
      } catch {
        return null;
      }
    }
  };

  const handleLogin = async () => {
    setError(null);
    const v = validate();
    if (v) return setError(v);
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    try {
      const mockUser = {
        id: 1,
        username: "tenente.amanda",
        email,
        nome: "Tenente Amanda",
        cargo: "Chefe de Guarnição"
      };
      const mockToken = "fake-jwt-token-12345";
      const where1 = safeStore('authToken', mockToken);
      const where2 = safeStore('authUser', JSON.stringify(mockUser));
      if (!where1 || !where2) throw new Error('Erro ao armazenar credenciais.');
      login(mockToken, mockUser);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Erro ao simular login');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(s => !s);
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleLogin(); };
  const handleIntroClick = () => setIsIntro(false);

  // --- FUNÇÃO DE FORMATAÇÃO DE SENHA (MÁSCARA 0000.000-00) ---
  const formatarSenha = (valor: string) => {
    let v = valor.replace(/\D/g, '');
    if (v.length > 9) v = v.slice(0, 9);
    v = v.replace(/^(\d{4})(\d)/, '$1.$2');
    v = v.replace(/\.(\d{3})(\d)/, '.$1-$2');
    return v;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarSenha(e.target.value);
    setPassword(valorFormatado);
  };


  // --- Tela 1: Boas-Vindas ---
  const renderIntroScreen = () => (
    <div className="login-container intro-screen">
      <img src={loginImage1} alt="Bombeiro em ação" className="hero-image" />

      <div className="intro-content">
        <div className="logo-siob-container">
            <img src={siobLogo} alt="Logo SIOB" className="intro-logo large" />
        </div>
        
        <h2 className="intro-subtitle large">
          Sistema Integrado de{'\n'}Ocorrências dos Bombeiros
        </h2>

        <div className="bottom-left-access">
          <button className="intro-access-button" onClick={handleIntroClick}>
            Seja Bem-vindo(a)
          </button>
        </div>
      </div>
    </div>
  );

  // --- Tela 2: Login ---
  const renderLoginScreen = () => (
    <div className="login-container login-form-screen">
      <img src={loginImage2} alt="Bombeiro com máscara" className="hero-image" />

      <main className="login-box">
        <header className="login-header minimal">
          <div className="login-logo-container">
            <img src={logoFormulario} alt="Logo SIOB" className="login-logo-image" />
          </div>
        </header>

        <p className="login-subtitle center">
          Digite suas credenciais para continuar
        </p>

        <div className="input-group">
          <label htmlFor="email">E-mail institucional</label>
          <input
            id="email"
            type="email"
            placeholder="exemplo@cbmpe.gov.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="0000.000-00"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={onKeyDown}
              maxLength={11} 
            />
            <button
              type="button"
              className="password-toggle-icon"
              onClick={togglePassword}
              aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error && <div className="login-error" role="alert">{error}</div>}

        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar no Sistema'}
        </button>
      </main>

      {/* === RODAPÉ SIMPLIFICADO (SEM LOGO GOV) === */}
      <footer className="login-footer-logos">
        <p className="footer-copyright">
          © Sistema Integrado de Ocorrências dos Bombeiros
          <br />
          versão 1.0 - 2025
        </p>
      </footer>

    </div>
  );

  return (
    <div className="login-page">
      {isIntro ? renderIntroScreen() : renderLoginScreen()}
    </div>
  );
};

export default LoginPage;