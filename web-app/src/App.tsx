// ==========================================================================
// App.tsx
// Gerenciamento de rotas, autenticação e tema global.
// ==========================================================================

import React, { useState } from 'react';
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
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return (isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />);
};

// --- Componente de Rotas da Aplicação ---
function AppRoutes() {
  
  // --- LÓGICA DO TEMA (DARK MODE) ---
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Atualiza o atributo no HTML para o CSS reagir
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Routes>
      {/* --- Rota Pública: Login --- */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- Rotas Protegidas --- */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            {/* Passamos a função real de alternar tema aqui */}
            <DashboardLayout toggleTheme={toggleTheme} />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardContent />} />
        <Route path="ocorrencias" element={<OcorrenciasPage />} />
        <Route path="relatorios" element={<RelatoriosPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="auditoria" element={<AuditoriaPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
        
        {/* Rotas de Formulário */}
        <Route path="formulario" element={<FormularioPage />} />
        <Route path="ocorrencia/:id/formulario" element={<FormularioPage />} />
      </Route>

      {/* --- Redirecionamento Padrão --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// --- Componente Raiz ---
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