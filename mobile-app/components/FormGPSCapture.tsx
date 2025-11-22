import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location'; // Requer 'npx expo install expo-location'
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Constantes de Cores ---
const SIOB_COLORS = {
  primary: '#AE1A16', white: '#FFFFFF', text: '#212529',
  muted: '#6c757d', destructive: '#DC3545', success: '#28A745',
  background: '#f8f9fa', border: '#dee2e6',
};

interface FormGPSCaptureProps { name: string; label: string; }

export default function FormGPSCapture({ name, label }: FormGPSCaptureProps) {
  const { control, setValue, formState: { errors } } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const isInvalid = !!errors[name];

  const captureLocation = async () => {
    setIsLoading(true);
    // Solicita permissão de localização
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'A permissão de acesso à localização é necessária para capturar o GPS.');
      setIsLoading(false);
      return;
    }

    try {
      // Captura a localização atual com alta precisão
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
      });

      const lat = location.coords.latitude.toFixed(6);
      const lon = location.coords.longitude.toFixed(6);

      const locationString = `Lat: ${lat}, Lon: ${lon}`;

      // Define o valor no formulário (ex: "Lat: -8.053890, Lon: -34.881110")
      setValue(name, locationString, { shouldValidate: true });

    } catch (error) {
      console.error(error);
      Alert.alert('Erro GPS', 'Não foi possível obter a localização. Verifique o GPS do dispositivo.');
      setValue(name, '', { shouldValidate: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.formItem}>
      <Text style={[styles.label, isInvalid && styles.errorText]}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { value } }) => (
          <View style={styles.captureContainer}>
            <View style={[styles.displayBox, isInvalid && styles.displayBoxError]}>
              <MaterialIcons
                name={value ? 'check-circle' : 'location-off'}
                size={24}
                color={value ? SIOB_COLORS.success : SIOB_COLORS.muted}
              />
              <Text style={styles.displayText} numberOfLines={1}>
                {value || 'Localização não capturada'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.captureButton, isLoading && { opacity: 0.6 }]}
              onPress={captureLocation}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color={SIOB_COLORS.white} />
              ) : (
                <MaterialIcons name="gps-fixed" size={20} color={SIOB_COLORS.white} />
              )}
              <Text style={styles.captureButtonText}>
                {isLoading ? 'Capturando...' : 'Capturar GPS'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {isInvalid && (
        <Text style={styles.errorMessage}>
          {errors[name]?.message as string}
        </Text>
      )}
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  formItem: { marginBottom: 20, width: '100%' },
  label: { fontSize: 14, fontWeight: 'bold', color: SIOB_COLORS.text, marginBottom: 8 },
  captureContainer: { flexDirection: 'column', gap: 10 },
  displayBox: {
    flexDirection: 'row', alignItems: 'center', padding: 15,
    backgroundColor: SIOB_COLORS.white, borderWidth: 1, borderColor: SIOB_COLORS.border,
    borderRadius: 8,
  },
  displayBoxError: { borderColor: SIOB_COLORS.destructive, borderWidth: 2 },
  displayText: { marginLeft: 10, fontSize: 14, color: SIOB_COLORS.text, flex: 1 },
  captureButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: SIOB_COLORS.primary, borderRadius: 8, paddingVertical: 12,
  },
  captureButtonText: { marginLeft: 8, color: SIOB_COLORS.white, fontSize: 16, fontWeight: 'bold' },
  errorText: { color: SIOB_COLORS.destructive },
  errorMessage: { marginTop: 5, fontSize: 12, color: SIOB_COLORS.destructive },
});