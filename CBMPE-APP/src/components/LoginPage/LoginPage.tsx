// ==========================================================================
// LoginPage.tsx (Versão de Demonstração - Com Login Falso)
// ==========================================================================

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';
import siobLogo from '../../assets/siob-logo.png';

// Não vamos mais usar o STRAPI_URL, pois o backend está desligado.
// const STRAPI_URL = 'http://localhost:1337';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    // Pega a função 'login' do nosso "porteiro" (AuthContext)
    const { login } = useAuth(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Validação (Mantida) ---
    // (Ainda é bom validar se os campos estão preenchidos para a demo)
    const validate = () => {
        if (!email) return 'Informe o e-mail.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'E-mail inválido.';
        if (!password) return 'Informe a senha.';
        return null;
    };

    // --- Função de Armazenamento Seguro (Mantida) ---
    // (O seu AuthContext espera ler do localStorage, então isso está correto)
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

    // ======================================================
    // --- AJUSTE PRINCIPAL (MOCK LOGIN PARA DEMONSTRAÇÃO) ---
    // ======================================================
    const handleLogin = async () => {
        setError(null);
        
        // 1. Validação (Mantida)
        // (Preencha os campos para a demo)
        const v = validate();
        if (v) { setError(v); return; }

        setLoading(true);

        // --- INÍCIO DO LOGIN FALSO (MOCK) ---
        // Não vamos mais chamar o 'fetch' para o backend.
        // Vamos simular um sucesso após 0.5 segundos.
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da rede

        try {
            // 1. Cria um usuário fictício (mock)
            // (Usando os dados que já definimos, para consistência)
            const mockUser = {
                id: 1,
                username: "tenente.amanda",
                email: email, // Usa o e-mail que você digitou
                nome: "Tenente Amanda",
                cargo: "Chefe de Guarnição"
            };
            const mockToken = "fake-jwt-token-for-demo-12345"; // Um token falso

            // 2. Salva o usuário e o token no localStorage
            const where1 = safeStore('authToken', mockToken);
            const where2 = safeStore('authUser', JSON.stringify(mockUser));

            if (!where1 || !where2) {
                throw new Error('Não foi possível gravar credenciais no storage do browser.');
            }

            // 3. CHAMA A FUNÇÃO login() DO useAuth()
            // Este é o passo mais importante: avisa o "porteiro" (AuthContext)
            // que o login foi um SUCESSO.
            login(mockToken, mockUser);
            
            console.log('[LoginPage] Login FALSO (DEMO) realizado. Redirecionando...');

            // 4. Navega para o dashboard
            navigate('/dashboard', { replace: true });

        } catch (err: any) {
            console.error('Erro no login falso:', err);
            setError(err?.message || 'Erro ao simular login');
            setLoading(false); // Garante que o loading pare em caso de erro
        }
        // O finally { setLoading(false) } do código original foi movido
        // para dentro do try/catch para garantir o fluxo correto.

        // --- FIM DO LOGIN FALSO ---


        /*
        // --- CÓDIGO ORIGINAL (AGORA DESABILITADO) ---
        // (Este código tentava falar com o backend que não existe mais)
        
        setLoading(true);
        try {
          const res = await fetch(`${STRAPI_URL}/api/auth/local`, { ... });
          const body = await res.json().catch(() => ({}));
          if (!res.ok) { ... }
          if (!body.jwt || !body.user) throw new Error('Resposta inválida do servidor');
          
          const where1 = safeStore('authToken', body.jwt);
          const where2 = safeStore('authUser', JSON.stringify(body.user));
          
          if (!where1 || !where2) { ... }

          login(body.jwt, body.user); // <-- O ponto que nunca era alcançado
          
          navigate('/dashboard', { replace: true });
        } catch (err: any) {
          console.error('Erro no login:', err);
          setError(err?.message || 'Erro ao autenticar');
        } finally {
          setLoading(false);
        }
        */
    }; // --- Fim da função handleLogin ---

    // --- Funções Auxiliares (Sem alterações) ---
    const togglePassword = () => setShowPassword(s => !s);
    const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleLogin(); };

    // --- Renderização JSX (Sem alterações) ---
    return (
        <div className="login-page">
            <header className="login-header">
                {/* ... (código JSX do header) ... */}
                <div className="login-logo-container">
          <img src={siobLogo} alt="Logo SIOB" className="login-logo-image" />
        </div>
        <h1>SIOB</h1>
        <h2>Sistema Integrado de Ocorrências dos Bombeiros</h2>
            </header>

            <main className="login-box">
                <p className="login-subtitle">Digite suas credenciais para continuar</p>

                {/* --- Input de E-mail --- */}
                <div className="input-group">
                    <label htmlFor="email">E-mail institucional</label>
                    <input id="email" type="email" placeholder="exemplo@cbmpe.gov.br"
                           value={email} onChange={(e) => setEmail(e.target.value)}
                           onKeyDown={onKeyDown} autoComplete="username" />
                </div>

                {/* --- Input de Senha --- */}
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

                {/* --- Exibição de Erro --- */}
                {error && <div className="login-error" role="alert">{error}</div>}

                {/* --- Botão de Entrar --- */}
                <button className="login-button" onClick={handleLogin} disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar no Sistema'}
                </button>
            </main>

            {/* --- Rodapé --- */}
            <footer className="login-footer">
                <p>Sistema Oficial do Corpo de Bombeiros Militar de Pernambuco</p>
                <p>versão 1.0 - 2025</p>
            </footer>
        </div>
    );
};

export default LoginPage;