// components/ui/FormLocationCapture.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type LocationData = { latitude: number; longitude: number; };

interface FormLocationCaptureProps<TFieldValues extends FieldValues> extends UseControllerProps<TFieldValues> {
  label: string;
  rules?: UseControllerProps<TFieldValues>['rules'];
}

const SIOB_COLORS = {
  primary: '#AE1A16', primaryLight: '#FBE9E9', text: '#212529', white: '#FFFFFF',
  success: '#28a745', error: '#dc3545', border: '#dee2e6',
};

function FormLocationCapture<TFieldValues extends FieldValues>({
  name, label, rules, ...props
}: FormLocationCaptureProps<TFieldValues>) {

  const { field, fieldState: { error } } = useController({ name, rules });
  const [isLoading, setIsLoading] = useState(false);
  const [capturedLocation, setCapturedLocation] = useState<LocationData | null>(field.value || null);

  const handleCaptureLocation = useCallback(async () => {
    setIsLoading(true);
    setCapturedLocation(null);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockLocation: LocationData = {
      latitude: -8.0578 + (Math.random() - 0.5) * 0.1,
      longitude: -34.8824 + (Math.random() - 0.5) * 0.1,
    };

    setCapturedLocation(mockLocation);
    field.onChange(mockLocation);
    setIsLoading(false);
    Alert.alert('Sucesso', 'Localização GPS capturada (Mock).');

  }, [field.onChange]);

  const isCaptured = !!capturedLocation;

  return (
    <View style={[styles.container, error && styles.containerError]}>
      <Text style={styles.label}>{label} {rules?.required && <Text style={styles.required}>*</Text>}</Text>

      <View style={styles.contentRow}>
        <View style={styles.statusBox}>
          {isLoading ? (
            <ActivityIndicator color={SIOB_COLORS.primary} size="small" />
          ) : isCaptured ? (
            <>
              <MaterialIcons name="check-circle" size={24} color={SIOB_COLORS.success} />
              <Text style={styles.statusText}>Capturado</Text>
            </>
          ) : (
            <>
              <MaterialIcons name="gps-not-fixed" size={24} color={SIOB_COLORS.text} />
              <Text style={styles.statusText}>Aguardando</Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, isCaptured && styles.buttonUpdate]}
          onPress={handleCaptureLocation}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <Text style={styles.buttonText}>Aguarde...</Text>
          ) : (
            <>
              <MaterialIcons name={isCaptured ? "refresh" : "my-location"} size={18} color={SIOB_COLORS.white} />
              <Text style={styles.buttonText}>{isCaptured ? 'Atualizar GPS' : 'Capturar Localização'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {isCaptured && (
        <View style={styles.dataDisplay}>
          <Text style={styles.dataText}>Lat: <Text style={styles.dataValue}>{capturedLocation!.latitude.toFixed(6)}</Text></Text>
          <Text style={styles.dataText}>Long: <Text style={styles.dataValue}>{capturedLocation!.longitude.toFixed(6)}</Text></Text>
        </View>
      )}

      {error && <Text style={styles.errorMessage}>{error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15, paddingVertical: 5 },
  containerError: { borderLeftWidth: 3, borderLeftColor: SIOB_COLORS.error, paddingLeft: 10 },
  label: { fontSize: 16, fontWeight: '600', color: SIOB_COLORS.text, marginBottom: 8 },
  required: { color: SIOB_COLORS.error },
  contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: SIOB_COLORS.primaryLight, padding: 8, borderRadius: 8, marginRight: 10, flexShrink: 1 },
  statusText: { marginLeft: 5, fontSize: 14, color: SIOB_COLORS.text, fontWeight: '500' },
  button: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: SIOB_COLORS.primary,
    paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, flexGrow: 1, justifyContent: 'center',
  },
  buttonUpdate: { backgroundColor: SIOB_COLORS.primary },
  buttonText: { color: SIOB_COLORS.white, fontSize: 15, fontWeight: 'bold', marginLeft: 5 },
  dataDisplay: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, padding: 8, backgroundColor: SIOB_COLORS.border, borderRadius: 4 },
  dataText: { fontSize: 14, color: SIOB_COLORS.text },
  dataValue: { fontWeight: 'bold' },
  errorMessage: { color: SIOB_COLORS.error, marginTop: 5, fontSize: 13 },
});

export default FormLocationCapture;