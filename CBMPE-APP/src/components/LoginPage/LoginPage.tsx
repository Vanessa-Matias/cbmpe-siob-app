// src/components/LoginPage/LoginPage.tsx
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';
import siobLogo from '../../assets/siob-logo.png';

const STRAPI_URL = 'http://localhost:1337';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email) return 'Informe o e-mail.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'E-mail inválido.';
    if (!password) return 'Informe a senha.';
    return null;
  };

  const safeStore = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      console.log(`[LoginPage] gravado em localStorage ${key}`);
      return 'localStorage';
    } catch (e) {
      console.warn('[LoginPage] falha ao gravar localStorage, tentando sessionStorage', e);
      try {
        sessionStorage.setItem(key, value);
        console.log(`[LoginPage] gravado em sessionStorage ${key}`);
        return 'sessionStorage';
      } catch (e2) {
        console.error('[LoginPage] falha ao gravar sessionStorage também', e2);
        return null;
      }
    }
  };

  const handleLogin = async () => {
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = body?.error?.message || body?.message || 'Credenciais inválidas';
        throw new Error(msg);
      }
      if (!body.jwt || !body.user) throw new Error('Resposta inválida do servidor');

      // ===== gravação segura =====
      console.log('[LoginPage] resposta:', body);
      const where1 = safeStore('authToken', body.jwt);
      const where2 = safeStore('authUser', JSON.stringify(body.user));

      // expõe para debugging rápido no console
      (window as any).__LAST_LOGIN = { where1, where2, jwt: body.jwt, user: body.user };

      // se nada foi possível salvar, lançar erro (para não prosseguir)
      if (!where1 || !where2) {
        throw new Error('Não foi possível gravar credenciais no storage do browser.');
      }

      // atualiza contexto auth (centraliza estado)
      login(body.jwt, body.user);

      console.log('[LoginPage] Login realizado, token salvo. Redirecionando...', body.user);

      // redireciona
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err?.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(s => !s);
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-logo-container">
          <img src={siobLogo} alt="Logo SIOB" className="login-logo-image" />
        </div>
        <h1>SIOB</h1>
        <h2>Sistema Integrado de Ocorrências dos Bombeiros</h2>
        <p>Sistema de Gestão de Ocorrências</p>
      </header>

      <main className="login-box">
        <h3>Acesso ao Sistema</h3>
        <p className="login-subtitle">Digite suas credenciais para continuar</p>

        <div className="input-group">
          <label htmlFor="email">E-mail institucional</label>
          <input id="email" type="email" placeholder="exemplo@cbmpe.gov.br"
                 value={email} onChange={(e) => setEmail(e.target.value)}
                 onKeyDown={onKeyDown} autoComplete="username" />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <div className="password-input-wrapper">
            <input id="password" type={showPassword ? 'text' : 'password'} placeholder="senha123"
                   value={password} onChange={(e) => setPassword(e.target.value)}
                   onKeyDown={onKeyDown} autoComplete="current-password" />
            <button type="button" className="password-toggle-icon" onClick={togglePassword}
                    aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error && <div className="login-error" role="alert">{error}</div>}

        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar no Sistema'}
        </button>
      </main>

      <footer className="login-footer">
        <p>Sistema Oficial do Corpo de Bombeiros Militar de Pernambuco</p>
        <p>versão 1.0 - 2025</p>
      </footer>
    </div>
  );
};

export default LoginPage;
