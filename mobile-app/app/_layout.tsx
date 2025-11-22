// app/_layout.tsx
import { Stack } from 'expo-router';
import { OccurrenceProvider } from '../contexts/OccurrenceContext';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <OccurrenceProvider>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="DashboardScreen" options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
          <Stack.Screen name="OcorrenciasScreen" options={{ headerShown: false }} />
          <Stack.Screen name="NovaOcorrenciaScreen" options={{ headerShown: false }} />
          <Stack.Screen name="DetalhesOcorrenciaScreen" options={{ headerShown: false }} />
          <Stack.Screen name="MenuScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ConfigScreen" options={{ headerShown: false }} />
          <Stack.Screen name="DetalhesNaturezaScreen" options={{ headerShown: false }} />
        </Stack>
      </OccurrenceProvider>
    </UserProvider>
  );
}