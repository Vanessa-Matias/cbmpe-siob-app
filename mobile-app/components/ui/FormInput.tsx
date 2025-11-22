// components/ui/FormInput.tsx (Criar ou Atualizar)

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// Você precisará garantir que esta importação de cores seja resolvida corretamente:
import { SIOB_COLORS } from '../../constants/Colors';

interface FormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  multiline?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ name, label, placeholder, keyboardType = 'default', multiline = false }) => {
  const { control, formState: { errors } } = useFormContext();

  // A cor 'danger' é necessária. Vamos usar o vermelho principal caso não exista.
  const DANGER_COLOR = SIOB_COLORS.danger || SIOB_COLORS.primary;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        // Aplica uma regra de validação mínima
        rules={{ required: `O campo ${label} é obrigatório.` }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              errors[name] && { borderColor: DANGER_COLOR, borderWidth: 2 },
              multiline && styles.multilineInput
            ]}
            placeholder={placeholder}
            placeholderTextColor={SIOB_COLORS.muted}
            onBlur={onBlur}
            onChangeText={onChange}
            // Garante que o valor não seja nulo ou indefinido para evitar avisos
            value={value || ''}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
          />
        )}
      />
      {errors[name] && <Text style={styles.errorText}>{errors[name]?.message as string || 'Campo obrigatório.'}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, color: SIOB_COLORS.text, fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: SIOB_COLORS.border, borderRadius: 8, padding: 10,
    fontSize: 16, backgroundColor: SIOB_COLORS.cardBg, color: SIOB_COLORS.text,
  },
  multilineInput: { height: 100, textAlignVertical: 'top' },
  errorText: { color: SIOB_COLORS.danger, marginTop: 5, fontSize: 12 },
});

export default FormInput;