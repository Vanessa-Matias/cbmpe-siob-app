import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Constantes de Cores ---
const SIOB_COLORS = {
  primary: '#AE1A16', white: '#FFFFFF', text: '#212529',
  muted: '#6c757d', destructive: '#DC3545',
};

interface Option { label: string; value: string; }
interface FormRadioGroupProps {
  name: string; label: string; options: Option[];
  direction?: 'row' | 'column';
}

export default function FormRadioGroup({ name, label, options, direction = 'column' }: FormRadioGroupProps) {
  const { control, formState: { errors } } = useFormContext();
  const isInvalid = !!errors[name];

  const RadioButton: React.FC<{
    option: Option, currentValue: string, onChange: (value: string) => void, isInvalid: boolean
  }> = ({ option, currentValue, onChange, isInvalid }) => {
    const isSelected = option.value === currentValue;

    return (
      <TouchableOpacity
        style={[styles.radioOption, direction === 'row' && styles.radioOptionRow]}
        onPress={() => onChange(option.value)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.radioBase,
          isSelected && styles.radioSelected,
          isInvalid && styles.radioError,
        ]}>
          {/* O PONTO INTERNO */}
          {isSelected && <View style={styles.radioDot} />}
        </View>
        <Text style={styles.radioLabel}>{option.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.formItem}>
      <Text style={[styles.mainLabel, isInvalid && styles.errorText]}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View style={direction === 'row' ? styles.groupRow : styles.groupColumn}>
            {options.map((option) => (
              <RadioButton
                key={option.value}
                option={option}
                currentValue={value as string}
                onChange={onChange}
                isInvalid={isInvalid}
              />
            ))}
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
  mainLabel: { fontSize: 14, fontWeight: 'bold', color: SIOB_COLORS.text, marginBottom: 10 },
  groupColumn: { flexDirection: 'column' },
  groupRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  radioOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  radioOptionRow: { width: '48%', marginBottom: 8 },
  radioBase: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: SIOB_COLORS.muted,
    justifyContent: 'center', alignItems: 'center', backgroundColor: SIOB_COLORS.white,
  },
  radioSelected: { borderColor: SIOB_COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: SIOB_COLORS.primary },
  radioError: { borderColor: SIOB_COLORS.destructive },
  radioLabel: { marginLeft: 10, fontSize: 16, color: SIOB_COLORS.text },
  errorText: { color: SIOB_COLORS.destructive },
  errorMessage: { marginTop: 5, fontSize: 12, color: SIOB_COLORS.destructive },
});