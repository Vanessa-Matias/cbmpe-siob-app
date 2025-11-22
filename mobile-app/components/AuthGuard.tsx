// components/AuthGuard.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      console.log('🔍 AuthGuard - Token:', token);
      console.log('🔍 AuthGuard - UserData:', userData);

      if (token && userData) {
        console.log('✅ USUÁRIO AUTENTICADO');
        setIsAuthenticated(true);
      } else {
        console.log('🔴 USUÁRIO NÃO AUTENTICADO');
        setIsAuthenticated(false);
        setShouldRedirect(true);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
      setShouldRedirect(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && shouldRedirect) {
      console.log('🔴 REDIRECIONANDO PARA LOGIN');
      router.replace('/login');
    }
  }, [loading, shouldRedirect, router]);

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <ActivityIndicator size="large" color="#AE1A16" />
        <Text style={{ marginTop: 10, color: '#666' }}>Verificando autenticação...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    console.log('✅ RENDERIZANDO CONTEÚDO PROTEGIDO');
    return <>{children}</>;
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <ActivityIndicator size="large" color="#AE1A16" />
      <Text style={{ marginTop: 10, color: '#666' }}>Redirecionando para login...</Text>
    </View>
  );
}