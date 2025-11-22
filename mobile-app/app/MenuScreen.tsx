// app/MenuScreen.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Constantes de Cores SIOB ---
const SIOB_COLORS = {
  primary: '#AE1A16', // Vermelho SIOB
  white: '#FFFFFF',
  text: '#212529',
  background: '#f8f9fa',
  cardBg: '#FFFFFF',
  border: '#dee2e6',
  darkRed: '#8B0000',
};

// Dados do menu (baseado na sua imagem)
const menuItems = [
  {
    title: 'Dashboard de Ocorrências',
    icon: 'dashboard',
    screen: 'DashboardScreen',
  },
  {
    title: 'Ocorrências',
    icon: 'list-alt',
    screen: 'OcorrenciaScreen',
  },
  {
    title: 'Configurações',
    icon: 'settings',
    screen: 'ConfigScreen',
  },
];

export default function MenuScreen() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(`/${path}`);
  };

  const handleLogout = () => {
    // Lógica para logout
    Alert.alert('Sair', 'Deseja realmente sair do aplicativo?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        onPress: () => router.push('/login'),
        style: 'destructive',
      },
    ]);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={SIOB_COLORS.primary} barStyle="light-content" />

      {/* HEADER VERMELHO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={SIOB_COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SIOB</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* SEÇÃO DO MENU */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>MENU</Text>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.screen)}
            >
              <View style={styles.menuItemContent}>
                <MaterialIcons
                  name={item.icon as any}
                  size={20}
                  color={SIOB_COLORS.primary}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={16}
                color="#666"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* LINHA DIVISÓRIA */}
        <View style={styles.divider} />

        {/* SEÇÃO DO USUÁRIO */}
        <View style={styles.userSection}>
          <Text style={styles.sectionLabel}>USUÁRIO</Text>

          {/* Informações do Usuário */}
          <View style={styles.userInfoCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>TA</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Tenente Amanda</Text>
              <Text style={styles.userRole}>Chefe de Guarnição</Text>
            </View>
          </View>

          {/* Botão Sair */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <View style={styles.logoutContent}>
              <MaterialIcons
                name="logout"
                size={18}
                color={SIOB_COLORS.darkRed}
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Sair</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ESPAÇO NO FINAL */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos Atualizados ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SIOB_COLORS.white,
  },
  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SIOB_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: SIOB_COLORS.darkRed,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SIOB_COLORS.white,
  },
  headerPlaceholder: {
    width: 32,
  },
  container: {
    flex: 1,
    backgroundColor: SIOB_COLORS.white,
  },
  // SEÇÕES
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  userSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // ITENS DO MENU
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SIOB_COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: SIOB_COLORS.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
    width: 24,
  },
  menuItemText: {
    fontSize: 16,
    color: SIOB_COLORS.text,
    fontWeight: '500',
  },
  // DIVISÓRIA
  divider: {
    height: 8,
    backgroundColor: SIOB_COLORS.background,
  },
  // INFORMAÇÕES DO USUÁRIO
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SIOB_COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SIOB_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: SIOB_COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  // BOTÃO SAIR
  logoutButton: {
    backgroundColor: SIOB_COLORS.white,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    color: SIOB_COLORS.darkRed,
    fontWeight: '500',
  },
  // ESPAÇO FINAL
  bottomSpace: {
    height: 20,
  },
});