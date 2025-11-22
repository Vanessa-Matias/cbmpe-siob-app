// app/ConfigScreen.tsx
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SidebarMenu from '../components/ui/SidebarMenu';
import { useUser } from '../contexts/UserContext';

// Cores do tema SIOB
const SIOB_COLORS = {
  primary: '#AE1A16',
  white: '#FFFFFF',
  text: '#212529',
  background: '#f8f9fa',
  border: '#dee2e6',
  link: '#007AFF',
  success: '#28a745',
};

export default function ConfigScreen() {
  const { user, updateUser } = useUser();

  // Estado da foto de perfil
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Estado do modal de edição
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [editValue, setEditValue] = useState('');

  // Estado para controlar se mostra opções de foto
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // Estado do menu lateral
  const [menuVisible, setMenuVisible] = useState(false);

  // Solicitar permissões de forma separada
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  // Tirar foto com a câmera
  const handleTakePhoto = async () => {
    setShowPhotoOptions(false);

    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à sua câmera para tirar fotos.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('Abrindo câmera...');
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Resultado da câmera:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Foto capturada:', imageUri);
        setProfileImage(imageUri);
        Alert.alert('Sucesso', 'Foto tirada com sucesso!');
      } else if (result.canceled) {
        console.log('Usuário cancelou a câmera');
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  // Escolher foto da galeria
  const handleChooseFromGallery = async () => {
    setShowPhotoOptions(false);

    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à sua galeria para escolher fotos.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('Abrindo galeria...');
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Resultado da galeria:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Foto selecionada:', imageUri);
        setProfileImage(imageUri);
        Alert.alert('Sucesso', 'Foto selecionada com sucesso!');
      } else if (result.canceled) {
        console.log('Usuário cancelou a galeria');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  // Remover foto
  const handleRemovePhoto = () => {
    setShowPhotoOptions(false);
    setProfileImage(null);
    Alert.alert('Sucesso', 'Foto removida!');
  };

  // Mostrar opções de foto
  const showImageOptions = () => {
    setShowPhotoOptions(true);
  };

  // Função para editar perfil - BLOQUEIA EDIÇÃO DA MATRÍCULA
  const handleEditProfile = (field: string) => {
    // Não permite editar a matrícula
    if (field === 'matricula') {
      Alert.alert('Informação', 'A matrícula não pode ser editada.');
      return;
    }

    setEditingField(field);
    setEditValue(user[field as keyof typeof user] || '');
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() === '') {
      Alert.alert('Erro', 'O campo não pode estar vazio.');
      return;
    }

    // Atualiza o contexto global
    updateUser({ [editingField]: editValue });

    setEditModalVisible(false);
    Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditValue('');
  };

  const handleChangePassword = () => {
    Alert.alert('Alterar Senha', 'Funcionalidade em desenvolvimento');
  };

  const handleOpenUnitLink = () => {
    Linking.openURL('https://www.cbm.pe.gov.br/');
  };

  // Função para obter o label do campo em edição
  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      nome: 'Nome Completo',
      matricula: 'Matrícula',
      telefone: 'Telefone',
      unidadeAtuacao: 'Unidade de Atuação',
      email: 'E-mail',
    };
    return labels[field] || field;
  };

  // FUNÇÃO GETINITIALS - ATUALIZADA PARA USAR O CONTEXTO
  const getInitials = () => {
    return user.nome
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
          <Text style={styles.headerTitle}>Configurações</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Cabeçalho do Perfil COM FOTO */}
          <View style={styles.profileHeader}>
            {/* Foto de Perfil */}
            <TouchableOpacity
              style={styles.profilePhotoContainer}
              onPress={showImageOptions}
            >
              <View style={styles.profilePhoto}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.profilePhotoText}>{getInitials()}</Text>
                )}
              </View>
              {/* Ícone de câmera para indicar que é editável */}
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraIconText}>📷</Text>
              </View>
            </TouchableOpacity>

            {/* Informações de Texto - AGORA USA O CONTEXTO */}
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{user.nome}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>

            {/* Botão Editar */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditProfile('nome')}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          {/* Nome Completo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nome Completo</Text>

            {/* Item com bullet point */}
            <TouchableOpacity
              style={styles.bulletItem}
              onPress={() => handleEditProfile('nome')}
            >
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>{user.nome}</Text>
            </TouchableOpacity>

            {/* Matrícula - NÃO EDITÁVEL */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Matrícula</Text>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={[styles.fieldValue, styles.nonEditableText]}>{user.matricula}</Text>
              </View>
              <Text style={styles.nonEditableNote}>Matrícula não editável</Text>
            </View>

            {/* Telefone */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Telefone</Text>
              <TouchableOpacity
                style={styles.bulletItem}
                onPress={() => handleEditProfile('telefone')}
              >
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.fieldValue}>{user.telefone}</Text>
              </TouchableOpacity>
            </View>

            {/* Unidade de Atuação */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Unidade de Atuação</Text>
              <TouchableOpacity
                onPress={() => handleEditProfile('unidadeAtuacao')}
              >
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.linkText}>
                    {user.unidadeAtuacao}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* E-mail */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>E-mail</Text>
              <TouchableOpacity
                style={styles.bulletItem}
                onPress={() => handleEditProfile('email')}
              >
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.fieldValue}>{user.email}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Segurança da Conta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Segurança da Conta</Text>

            <View style={styles.securityContainer}>
              <Text style={styles.securityTitle}>Alterar Senha</Text>
              <Text style={styles.securityDescription}>
                Recomendamos que você altere sua senha periodicamente.
              </Text>
              <TouchableOpacity
                style={styles.alterarButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.alterarButtonText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* MENU LATERAL */}
        <SidebarMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />

        {/* Modal de Edição de Dados */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCancelEdit}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    Editar {getFieldLabel(editingField)}
                  </Text>

                  <TextInput
                    style={styles.textInput}
                    value={editValue}
                    onChangeText={setEditValue}
                    placeholder={`Digite o ${getFieldLabel(editingField).toLowerCase()}`}
                    multiline={editingField === 'unidadeAtuacao'}
                    numberOfLines={editingField === 'unidadeAtuacao' ? 3 : 1}
                  />

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={handleCancelEdit}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.saveButton]}
                      onPress={handleSaveEdit}
                    >
                      <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal de Opções de Foto */}
        <Modal
          visible={showPhotoOptions}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowPhotoOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.photoModalContainer}>
              <View style={styles.photoModalContent}>
                <Text style={styles.photoModalTitle}>Alterar Foto de Perfil</Text>

                <TouchableOpacity
                  style={styles.photoOption}
                  onPress={handleTakePhoto}
                >
                  <Text style={styles.photoOptionText}>📷 Tirar Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoOption}
                  onPress={handleChooseFromGallery}
                >
                  <Text style={styles.photoOptionText}>🖼️ Escolher da Galeria</Text>
                </TouchableOpacity>

                {profileImage && (
                  <TouchableOpacity
                    style={[styles.photoOption, styles.removePhotoOption]}
                    onPress={handleRemovePhoto}
                  >
                    <Text style={styles.removePhotoText}>🗑️ Remover Foto</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.cancelPhotoOption}
                  onPress={() => setShowPhotoOptions(false)}
                >
                  <Text style={styles.cancelPhotoText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

// ESTILOS ATUALIZADOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SIOB_COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  // HEADER
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  // SEÇÃO
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    marginBottom: 15,
  },
  // ESTILOS ESPECÍFICOS DA TELA DE CONFIGURAÇÕES
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: SIOB_COLORS.white,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profilePhotoContainer: {
    marginRight: 16,
    position: 'relative',
  },
  profilePhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: SIOB_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  profilePhotoText: {
    color: SIOB_COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: SIOB_COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: SIOB_COLORS.white,
  },
  cameraIconText: {
    color: SIOB_COLORS.white,
    fontSize: 14,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: SIOB_COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: SIOB_COLORS.primary,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  editButtonText: {
    color: SIOB_COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: SIOB_COLORS.border,
    marginVertical: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  bulletPoint: {
    fontSize: 16,
    color: SIOB_COLORS.text,
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    fontSize: 16,
    color: SIOB_COLORS.text,
    lineHeight: 22,
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: SIOB_COLORS.text,
    lineHeight: 22,
    flex: 1,
  },
  // NOVOS ESTILOS PARA TEXTO NÃO EDITÁVEL
  nonEditableText: {
    color: '#666',
    fontStyle: 'italic',
  },
  nonEditableNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 20,
  },
  linkText: {
    fontSize: 16,
    color: SIOB_COLORS.link,
    lineHeight: 22,
    flex: 1,
    textDecorationLine: 'underline',
  },
  securityContainer: {
    backgroundColor: SIOB_COLORS.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    marginBottom: 8,
  },
  securityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  alterarButton: {
    backgroundColor: SIOB_COLORS.white,
    borderWidth: 1,
    borderColor: SIOB_COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  alterarButtonText: {
    color: SIOB_COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 40,
  },
  // Modal de Edição Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: SIOB_COLORS.white,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: SIOB_COLORS.background,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
  },
  saveButton: {
    backgroundColor: SIOB_COLORS.primary,
  },
  cancelButtonText: {
    color: SIOB_COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: SIOB_COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal de Foto Styles
  photoModalContainer: {
    width: '80%',
    maxWidth: 300,
  },
  photoModalContent: {
    backgroundColor: SIOB_COLORS.white,
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  photoModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    padding: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: SIOB_COLORS.border,
  },
  photoOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: SIOB_COLORS.border,
  },
  photoOptionText: {
    fontSize: 16,
    color: SIOB_COLORS.text,
    textAlign: 'center',
  },
  removePhotoOption: {
    borderBottomWidth: 1,
    borderBottomColor: SIOB_COLORS.border,
  },
  removePhotoText: {
    fontSize: 16,
    color: '#DC3545',
    textAlign: 'center',
  },
  cancelPhotoOption: {
    padding: 16,
  },
  cancelPhotoText: {
    fontSize: 16,
    color: SIOB_COLORS.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
});