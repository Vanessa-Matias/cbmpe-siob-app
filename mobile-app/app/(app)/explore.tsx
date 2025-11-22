// app/(app)/explore.tsx

// GARANTA que não há importações de reanimated, parallax-scroll-view, etc.
import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Explore - SIOB Mobile</Text>
      <Text style={styles.subtitle}>O componente Parallax foi removido.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
});