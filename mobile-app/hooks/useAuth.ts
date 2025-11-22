// hooks/useAuth.ts - NA RAIZ DO PROJETO
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      console.log('🔍 CheckAuth - Token:', token);
      console.log('🔍 CheckAuth - UserData:', userData);

      if (token && userData) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (matricula: string, senha: string) => {
    try {
      console.log('🔐 Login attempt:', { matricula, senha });

      const fakeToken = 'fake-jwt-token-' + Date.now();
      const userData = JSON.stringify({
        matricula,
        nome: 'Usuário Teste'
      });

      await AsyncStorage.setItem('userToken', fakeToken);
      await AsyncStorage.setItem('userData', userData);

      console.log('✅ Login realizado');
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    }
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth
  };
}