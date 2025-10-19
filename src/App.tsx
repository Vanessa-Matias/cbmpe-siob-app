// /**
//  * @file App.tsx
//  * @description Componente raiz da aplicação. Gerencia o estado global (login, tema) e as rotas.
//  */

// // Importações do React e da biblioteca de roteamento.
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// // Importação dos componentes de página.
// import LoginPage from './components/LoginPage/LoginPage';
// import DashboardLayout from './components/DashboardPage/DashboardPage';
// import OcorrenciasPage from './components/OcorrenciasPage/OcorrenciasPage';
// import DashboardContent from './components/DashboardContent/DashboardContent';
// import RelatoriosPage from './components/RelatoriosPage/RelatoriosPage';
// import UsuariosPage from './Pages/UsuariosPage/UsuariosPage';
// import AuditoriaPage from './components/AuditoriaPage/AuditoriaPage';
// import ConfiguracoesPage from './components/ConfiguracoesPage/ConfiguracoesPage';
// import FormularioPage from './components/FormularioPage/FormularioPage';

// /**
//  * Componente principal da aplicação.
//  */
// function App() {
//   // Estado para controlar se o usuário está autenticado. Inicia como 'false'.
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   // Estado para controlar o tema atual da aplicação (light/dark). Inicia como 'light'.
//   const [theme, setTheme] = useState('light');

//   // Função para atualizar o estado para 'logado', geralmente chamada após o sucesso no login.
//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   // Função para alternar o tema entre 'light' e 'dark'.
//   const toggleTheme = () => {
//     setTheme(theme === 'light' ? 'dark' : 'light');
//   };

//   // Efeito que aplica o tema ao documento HTML sempre que o estado 'theme' é alterado.
//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', theme);
//   }, [theme]);

//   return (
//     // O BrowserRouter envolve todas as rotas da aplicação, ativando o sistema de navegação.
//     <BrowserRouter>
//       {/* O componente Routes gerencia qual rota será renderizada com base na URL. */}
//       <Routes>
//         {/* Renderização condicional: exibe um conjunto de rotas se o usuário NÃO estiver logado. */}
//         {!isLoggedIn ? (
//           <>
//             {/* Rota para a página de login. */}
//             <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />
//             {/* Qualquer outra rota digitada redireciona o usuário para a página de login. */}
//             <Route path="*" element={<Navigate to="/login" />} />
//           </>
//         ) : (
//           /* Renderização condicional: exibe as rotas protegidas se o usuário ESTIVER logado. */
//           <>
//             {/* Rota "pai" que utiliza o DashboardLayout para encapsular todas as páginas internas. */}
//             <Route path="/" element={<DashboardLayout toggleTheme={toggleTheme} />}>
//               {/* Rota inicial ('/'), redireciona para a página principal do dashboard. */}
//               <Route index element={<Navigate to="/dashboard" />} />

//               {/*======== Rota para o conteúdo do dashboard ========= */}
//               <Route path="dashboard" element={<DashboardContent />} />

//               {/*======== Rota para a página de ocorrências ========== */}
//               <Route path="ocorrencias" element={<OcorrenciasPage />} />

//               {/*======== Rota para a página de relatórios =========== */}
//               <Route path="relatorios" element={<RelatoriosPage />} />

//               {/* ================== Rota de usuários ================ */}
//               <Route path="usuarios" element={<UsuariosPage />} />

//               {/* ================ Rota de Auditoria ================= */}
//               <Route path='auditoria' element={<AuditoriaPage/>} />

//               {/* =============== Rota de Configuração ================ */}
//               <Route path='configuracoes' element={<ConfiguracoesPage/>} />

//               {/*= Rota para a página de CRIAÇÃO de um novo formulário =*/}
//               <Route path="formulario" element={<FormularioPage />} />

//               {/* Rota dinâmica para editar o formulário de uma ocorrência específica. */}
//               <Route path="ocorrencia/:id/formulario" element={<FormularioPage />} />

//             </Route>
//             {/* Se um usuário logado tentar acessar /login, ele é redirecionado de volta para o dashboard. */}
//             <Route path="/login" element={<Navigate to="/dashboard" />} />
//           </>
//         )}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// src/App.tsx
/**
 * @file App.tsx
 * @description Componente raiz da aplicação. Gerencia rotas e integra AuthContext.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Páginas / componentes
import LoginPage from './components/LoginPage/LoginPage';
import DashboardLayout from './components/DashboardPage/DashboardPage';
import OcorrenciasPage from './components/OcorrenciasPage/OcorrenciasPage';
import DashboardContent from './components/DashboardContent/DashboardContent';
import RelatoriosPage from './components/RelatoriosPage/RelatoriosPage';
import UsuariosPage from './Pages/UsuariosPage/UsuariosPage';
import AuditoriaPage from './components/AuditoriaPage/AuditoriaPage';
import ConfiguracoesPage from './components/ConfiguracoesPage/ConfiguracoesPage';
import FormularioPage from './components/FormularioPage/FormularioPage';

// Auth
import { AuthProvider, useAuth } from './context/AuthContext';

// util para ler token/user salvos (se o LoginPage ainda os grava em localStorage)
const readTokenFromStorage = () => localStorage.getItem('authToken');
const readUserFromStorage = () => {
  const u = localStorage.getItem('authUser');
  return u ? JSON.parse(u) : null;
};

// PrivateRoute protege rotas que exigem autenticação
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return (isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />);
};

// Envoltório para o LoginPage: quando o LoginPage chama onLoginSuccess,
// aqui lemos o token que o LoginPage já gravou no localStorage e notificamos o contexto.
// Envoltório simples para LoginPage — o LoginPage usa useAuth() internamente
const LoginWrapper: React.FC = () => {
  return <LoginPage />;
};


function AppRoutes() {
  return (
    <Routes>
      {/* rotas públicas */}
      <Route path="/login" element={<LoginWrapper />} />

      {/* rotas protegidas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout toggleTheme={() => { /* opcional */ }} />
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
        <Route path="formulario" element={<FormularioPage />} />
        <Route path="ocorrencia/:id/formulario" element={<FormularioPage />} />
      </Route>

      {/* redirects */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

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
