// ==========================================================================
// App.tsx (Versão Correta com AuthContext)
// Este arquivo gerencia as rotas e protege o dashboard com o "PrivateRoute".
// ==========================================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Páginas / Componentes ---
import LoginPage from './components/LoginPage/LoginPage';
import DashboardLayout from './components/DashboardPage/DashboardPage';
import OcorrenciasPage from './components/OcorrenciasPage/OcorrenciasPage';
import DashboardContent from './components/DashboardContent/DashboardContent';
import RelatoriosPage from './components/RelatoriosPage/RelatoriosPage';
import UsuariosPage from './Pages/UsuariosPage/UsuariosPage';
import AuditoriaPage from './components/AuditoriaPage/AuditoriaPage';
import ConfiguracoesPage from './components/ConfiguracoesPage/ConfiguracoesPage';
import FormularioPage from './components/FormularioPage/FormularioPage';

// --- Contexto de Autenticação ---
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Componente de Rota Privada (O "Porteiro") ---
// Verifica se o usuário está autenticado antes de mostrar as rotas filhas.
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Se estiver autenticado, mostra o conteúdo. Senão, redireciona para /login.
  return (isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />);
};

// --- Componente de Rotas da Aplicação ---
function AppRoutes() {
  return (
    <Routes>
      {/* --- Rota Pública: Login --- */}
      {/* O LoginPage agora terá a lógica do "login falso". */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- Rotas Protegidas (Envolvidas pelo PrivateRoute) --- */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            {/* O DashboardLayout só é renderizado se o PrivateRoute permitir */}
            <DashboardLayout toggleTheme={() => { /* Lógica de tema pode ser movida para um Contexto depois */ }} />
          </PrivateRoute>
        }
      >
        {/* Rotas filhas (Dashboard, Ocorrências, etc.) */}
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardContent />} />
        <Route path="ocorrencias" element={<OcorrenciasPage />} />
        <Route path="relatorios" element={<RelatoriosPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="auditoria" element={<AuditoriaPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
        <Route path="formulario" element={<FormularioPage />} />
        <Route path="ocorrencia/:id/formulario" element={<FormularioPage />} />
      </Route>

      {/* --- Redirecionamento Padrão --- */}
      {/* Se qualquer outra rota for acessada, redireciona para o login (se deslogado) ou dashboard (se logado) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// --- Componente Raiz ---
// Envolve toda a aplicação com o Provedor de Autenticação (AuthProvider)
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

