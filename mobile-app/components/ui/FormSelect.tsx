// components/ui/FormSelect.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const FormSelect = ({ name, label, options, placeholder, rules }: any) => {
  // Implementação temporária para evitar o erro de módulo
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label} (Módulo OK)</Text>
      <View style={styles.inputArea}>
        <Text style={{ color: '#ccc' }}>{placeholder || 'Selecione uma opção...'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#212529' },
  inputArea: { borderWidth: 1, borderColor: '#dee2e6', padding: 10, borderRadius: 8, backgroundColor: '#fff' }
});

export default FormSelect;