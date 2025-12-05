import React, { createContext, useContext, useState, useEffect } from 'react';
// 1. IMPORTEI A API QUE FOI CRIADA 
import { api } from '../lib/api'; 

type User = { id: number; username: string; email: string; [key: string]: any };

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // 2. ATUALIZEI O TIPO PARA ACEITAR A NOVA FUNÇÃO signIn
  signIn: (data: any) => Promise<void>; 
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Essa função apenas atualiza o estado local (já existia)
  const setAuthData = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    
    // ATENÇÃO: Atualiza o cabeçalho da API imediatamente para não precisar de F5
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    
    // Remove o token da API também
    delete api.defaults.headers.common['Authorization'];
  };

  // --- [NOVO] AQUI É A MÁGICA DA CONEXÃO ---
  const signIn = async ({ email, password }: any) => {
    try {
      // Chama o Backend na rota que vimos no Swagger
      const response = await api.post('/auth/login', {
        email, 
        password
      });

      // O Backend deve retornar algo como { token: "...", user: {...} }
      // Ajuste aqui se o backend devolver nomes diferentes (ex: accessToken)
      const { token, user } = response.data;

      // Chama a função interna para salvar os dados
      setAuthData(token, user);
      
      alert("Login realizado com sucesso!");

    } catch (error: any) {
      console.error("Erro no login:", error);
      alert("Erro ao entrar! Verifique suas credenciais.");
      throw error; // Lança o erro para a página saber que falhou
    }
  };
  // ------------------------------------------

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Se recuperou do storage, avisa a API para usar esse token
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    signIn, // Exportamos a nova função
    logout,
  };

  (window as any).__DEBUG_AUTH = () => console.log(value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};