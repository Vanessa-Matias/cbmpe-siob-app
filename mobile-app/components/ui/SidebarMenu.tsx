// components/ui/SidebarMenu.tsx
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../../contexts/UserContext';

const SIOB_COLORS = {
  primary: '#AE1A16',
  white: '#FFFFFF',
  text: '#212529',
  background: '#f8f9fa',
  border: '#dee2e6',
  darkRed: '#8B0000',
};

interface SidebarMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ isVisible, onClose }: SidebarMenuProps) {
  const router = useRouter();
  const { user, clearUser } = useUser();

  const menuItems = [
    {
      title: 'Dashboard de Ocorrências',
      icon: 'dashboard',
      screen: 'DashboardScreen',
    },
    {
      title: 'Ocorrências',
      icon: 'list-alt',
      screen: 'OcorrenciasScreen',
    },
    {
      title: 'Configurações',
      icon: 'settings',
      screen: 'ConfigScreen',
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(`/${path}`);
    onClose();
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do aplicativo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            // Fecha o menu mesmo ao cancelar
            onClose();
          }
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              console.log('🚪 Iniciando logout...');

              // Fecha o menu imediatamente
              onClose();

              // Limpa os dados de autenticação do AsyncStorage
              await AsyncStorage.multiRemove(['userToken', 'userData']);
              console.log('✅ Dados de autenticação removidos');

              // Limpa o contexto do usuário (se existir a função clearUser)
              if (clearUser) {
                clearUser();
                console.log('✅ Contexto do usuário limpo');
              }

              // Aguarda um pouco para garantir que o menu fechou
              await new Promise(resolve => setTimeout(resolve, 300));

              // Redireciona para a tela de login
              console.log('🔄 Redirecionando para login...');
              router.replace('/login');

            } catch (error) {
              console.error('❌ Erro durante o logout:', error);
              // Mesmo com erro, tenta redirecionar para o login
              router.replace('/login');
            }
          },
          style: 'destructive',
        }
      ]
    );
  };

  // Função para obter iniciais do nome (para o avatar)
  const getInitials = () => {
    return user?.nome
      ? user.nome
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
      : '??';
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* VIEW PRINCIPAL DA SIDEBAR COM FLEXBOX AJUSTADO */}
        <View style={styles.sidebar}>

          {/* TOP SECTION: HEADER + MENU ITEMS */}
          <View>
            {/* HEADER VERMELHO */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>SIOB</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color={SIOB_COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* SEÇÃO DO MENU */}
            <View style={styles.menuSection}>
              {/* REMOVIDO: <Text style={styles.sectionLabel}>MENU</Text> */}

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
          </View>

          {/* BOTTOM SECTION: USER + LOGOUT */}
          <View>
            {/* LINHA DIVISÓRIA */}
            <View style={styles.divider} />

            {/* SEÇÃO DO USUÁRIO */}
            <View style={styles.userSection}>
              <Text style={styles.sectionLabel}>USUÁRIO</Text>

              {/* Informações do Usuário */}
              <View style={styles.userInfoCard}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{getInitials()}</Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
                  <Text style={styles.userRole}>{user?.cargo || 'Nenhum cargo definido'}</Text>
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
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: '80%',
    height: '100%',
    backgroundColor: SIOB_COLORS.white,
    // ESSENCIAL PARA EMPURRAR O CONTEÚDO PARA AS EXTREMIDADES
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: SIOB_COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: SIOB_COLORS.darkRed,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SIOB_COLORS.white,
  },
  closeButton: {
    padding: 4,
  },
  // O estilo content foi mantido por segurança, mas não é usado no JSX
  content: {
    paddingVertical: 20,
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    // AJUSTE: Removido o padding top de 20px que o antigo 'content' fornecia.
    paddingTop: 20,
  },
  userSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20, // Padding extra no final para o botão sair
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
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
  divider: {
    height: 1,
    backgroundColor: SIOB_COLORS.border,
    marginVertical: 0,
    marginHorizontal: 20,
  },
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
});