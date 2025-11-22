import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Constantes de Cores ---
const SIOB_COLORS = {
  primary: '#AE1A16', white: '#FFFFFF', text: '#212529',
  muted: '#6c757d', destructive: '#DC3545',
};

interface FormCheckboxProps { name: string; label: string; }

export default function FormCheckbox({ name, label }: FormCheckboxProps) {
  const { control, formState: { errors } } = useFormContext();
  const isInvalid = !!errors[name];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.formItem}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => onChange(!value)} // Inverte o valor booleano
            activeOpacity={0.8}
          >
            {/* QUADRADO DO CHECKBOX */}
            <View style={[
              styles.checkboxBase,
              value && styles.checkboxChecked,
              isInvalid && styles.checkboxError,
            ]}>
              {value && (
                <MaterialIcons name="check" size={16} color={SIOB_COLORS.white} />
              )}
            </View>

            {/* LABEL */}
            <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>

          {isInvalid && (
            <Text style={styles.errorMessage}>
              {errors[name]?.message as string}
            </Text>
          )}
        </View>
      )}
    />
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  formItem: { marginBottom: 15, width: '100%' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  checkboxBase: {
    width: 24, height: 24, justifyContent: 'center', alignItems: 'center',
    borderRadius: 4, borderWidth: 2, borderColor: SIOB_COLORS.muted,
    backgroundColor: SIOB_COLORS.white,
  },
  checkboxChecked: { backgroundColor: SIOB_COLORS.primary, borderColor: SIOB_COLORS.primary },
  checkboxError: { borderColor: SIOB_COLORS.destructive },
  label: { marginLeft: 10, fontSize: 16, color: SIOB_COLORS.text },
  errorMessage: { marginTop: 5, marginLeft: 34, fontSize: 12, color: SIOB_COLORS.destructive },
});