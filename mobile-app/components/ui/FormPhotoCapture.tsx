import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SIOB_COLORS = {
  primary: '#AE1A16',
  white: '#FFFFFF',
  text: '#212529',
  background: '#f8f9fa',
  border: '#dee2e6',
};

interface FormPhotoCaptureProps {
  onPhotoCaptured: (uri: string) => void;
  currentPhoto?: string;
}

export default function FormPhotoCapture({ onPhotoCaptured, currentPhoto }: FormPhotoCaptureProps) {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão da câmera para tirar fotos.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        onPhotoCaptured(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        onPhotoCaptured(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fotografia da Ocorrência</Text>

      {currentPhoto ? (
        <View style={styles.photoPreview}>
          <Image source={{ uri: currentPhoto }} style={styles.photoImage} />
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={takePhoto}
          >
            <Text style={styles.changePhotoText}>Trocar Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.photoOptions}>
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <MaterialIcons name="camera-alt" size={24} color={SIOB_COLORS.primary} />
            <Text style={styles.photoButtonText}>Abrir Câmera</Text>
            <Text style={styles.photoDescription}>Toque para abrir a câmera traseira e registrar uma foto.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.photoButton} onPress={pickFromGallery}>
            <MaterialIcons name="photo-library" size={24} color={SIOB_COLORS.primary} />
            <Text style={styles.photoButtonText}>Escolher da Galeria</Text>
            <Text style={styles.photoDescription}>Selecionar foto existente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SIOB_COLORS.text,
    marginBottom: 12,
  },
  photoOptions: {
    gap: 12,
  },
  photoButton: {
    backgroundColor: SIOB_COLORS.white,
    borderWidth: 2,
    borderColor: SIOB_COLORS.border,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: SIOB_COLORS.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  photoDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  photoPreview: {
    alignItems: 'center',
  },
  photoImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  changePhotoButton: {
    backgroundColor: SIOB_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  changePhotoText: {
    color: SIOB_COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
});