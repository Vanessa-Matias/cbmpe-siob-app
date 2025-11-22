import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Switch as RNSwitch, StyleSheet, Text, View } from 'react-native';

// --- Constantes de Cores ---
const SIOB_COLORS = {
  primary: '#AE1A16', white: '#FFFFFF', text: '#212529',
  muted: '#6c757d', destructive: '#DC3545',
};

interface FormSwitchProps { name: string; label: string; }

export default function FormSwitch({ name, label }: FormSwitchProps) {
  const { control, formState: { errors } } = useFormContext();
  const isInvalid = !!errors[name];

  return (
    <Controller
      control={control}
      name={name}
      // value deve ser um booleano (true/false)
      render={({ field: { onChange, value } }) => (
        <View style={[styles.formItem, isInvalid && styles.errorItem]}>
          <Text style={styles.label}>{label}</Text>

          <RNSwitch
            onValueChange={onChange} // Recebe o novo valor booleano
            value={!!value} // Garante que o valor seja booleano
            trackColor={{ false: SIOB_COLORS.muted, true: SIOB_COLORS.primary }}
            thumbColor={SIOB_COLORS.white}
            style={styles.switchControl}
          />

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
  formItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  label: { fontSize: 16, color: SIOB_COLORS.text, flex: 1 },
  switchControl: { transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] },
  errorItem: { borderBottomColor: SIOB_COLORS.destructive, borderBottomWidth: 1 },
  errorMessage: {
    marginTop: 5,
    fontSize: 12,
    color: SIOB_COLORS.destructive,
    position: 'absolute',
    bottom: -20,
    left: 0,
  },
});