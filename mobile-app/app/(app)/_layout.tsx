// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import AuthGuard from '../../components/AuthGuard';

export default function AppLayout() {
  return (
    <AuthGuard>
      <Stack>
        <Stack.Screen name="DashboardScreen" options={{ headerShown: false }} />
        <Stack.Screen name="OcorrenciasScreen" options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesNaturezaScreen" options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
        <Stack.Screen name="NovaOcorrenciasScreen" options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesOcorrenciaScreen" options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesNaturezaScreen" options={{ headerShown: false }} />
        <Stack.Screen name="MenuScreen" options={{ headerShown: false }} />
      </Stack>
    </AuthGuard>
  );
}