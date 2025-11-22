// components/Sidebar.tsx 

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Use as constantes de cores do seu projeto
const SIOB_COLORS = { primary: '#AE1A16', white: '#FFFFFF', text: '#212529', cardBg: '#FFFFFF', border: '#dee2e6' };

const { width } = Dimensions.get('window');

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const menuItems = [
  // Dashboard é a rota raiz ('/')
  { name: 'Dashboard de Ocorrências', icon: 'dashboard', path: '/' },
  // Ocorrências - Mantendo o caminho de rota do seu projeto
  { name: 'Ocorrências', icon: 'fire', path: '/OcorrenciasScreen' },
  // Configurações
  { name: 'Configurações', icon: 'settings', path: '/ConfiguracoesScreen' },
];

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const router = useRouter();

  if (!isVisible) {
    return null;
  }

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleLogout = () => {
    onClose();
    alert('Saindo do Sistema...');
  };

  return (
    <>
      {/* Overlay Escuro */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Menu Lateral */}
      <View style={styles.sidebar}>

        {/* Cabeçalho do Sidebar */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="fire" size={24} color={SIOB_COLORS.white} />
          <Text style={styles.menuTitle}>SIOB</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={SIOB_COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Itens de Navegação */}
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.menuItem}
              onPress={() => handleNavigate(item.path)}
            >
              {/* A imagem mostra ícones MaterialIcons para Dashboard e Configurações */}
              <MaterialIcons name={item.icon as any} size={24} color={SIOB_COLORS.primary} />
              <Text style={styles.menuItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Sair */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color={SIOB_COLORS.white} />
            <Text style={styles.logoutButtonText}>SAIR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 10,
  },
  sidebar: {
    position: 'absolute', top: 0, bottom: 0, left: 0,
    width: width * 0.75,
    backgroundColor: SIOB_COLORS.cardBg,
    zIndex: 11,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: SIOB_COLORS.primary,
    paddingVertical: 15, paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },
  menuTitle: { fontSize: 20, fontWeight: 'bold', color: SIOB_COLORS.white, marginLeft: 10, flex: 1 },
  closeButton: { padding: 5, marginLeft: 'auto' },

  menuList: { flexGrow: 1, paddingVertical: 10 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: SIOB_COLORS.border,
  },
  menuItemText: { fontSize: 16, color: SIOB_COLORS.text, marginLeft: 15, fontWeight: '500' },

  footer: { padding: 15, borderTopWidth: 1, borderTopColor: SIOB_COLORS.border },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: SIOB_COLORS.primary,
    borderRadius: 8, paddingVertical: 12,
  },
  logoutButtonText: { color: SIOB_COLORS.white, fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default Sidebar;