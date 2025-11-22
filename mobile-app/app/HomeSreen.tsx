import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SidebarMenu from '../components/ui/SidebarMenu';

const SIOB_COLORS = {
  primary: '#AE1A16',
  white: '#FFFFFF',
  text: '#212529',
  background: '#f8f9fa',
  cardBg: '#FFFFFF',
  border: '#dee2e6',
  cardLaranjaPadrao: '#FF8C00',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
};

// ... (resto do código do HomeScreen permanece igual, apenas adicione o estado do menu)

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  // ... (resto do código do HomeScreen)

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER COM BOTÃO MENU */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          >
            <MaterialIcons name="menu" size={28} color={SIOB_COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* ... (resto do conteúdo do HomeScreen) */}

        {/* MENU LATERAL */}
        <SidebarMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
}

// Adicione estes estilos ao seu StyleSheet existente:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SIOB_COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: SIOB_COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SIOB_COLORS.white,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 33,
  },
  // ... (resto dos estilos)
});