import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormCheckbox from './FormCheckbox';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

interface FormIncendioProps {
  onDataChange: (data: any) => void;
}

const FormIncendio: React.FC<FormIncendioProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
    grupoIncendio: '',
    tipoIncendio: '',
    tempoExtincao: '',
    tempoRescaldo: '',
    consumoAgua: '',
    consumoLGE: '',
    acoesRealizadas: {
      extincao: false,
      rescaldo: false,
      ventilacao: false,
      resfriamento: false,
    },
    recursosHidricos: {
      hidranteUrbano: false,
      aguaTransportada: false,
      rio: false,
      piscina: false,
    }
  });

  const gruposIncendio = [
    { label: 'Incêndio em Edificação', value: 'edificacao' },
    { label: 'Incêndio em Meio de Transporte', value: 'transporte' },
    { label: 'Incêndio em Vegetação', value: 'vegetacao' },
    { label: 'Incêndio em Área de Descarte', value: 'descarte' },
  ];

  const updateFormData = (newData: any) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    onDataChange(updatedData);
  };

  const handleAcaoChange = (key: string, value: boolean) => {
    const updatedAcoes = { ...formData.acoesRealizadas, [key]: value };
    updateFormData({ acoesRealizadas: updatedAcoes });
  };

  const handleRecursoChange = (key: string, value: boolean) => {
    const updatedRecursos = { ...formData.recursosHidricos, [key]: value };
    updateFormData({ recursosHidricos: updatedRecursos });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Natureza 2: Incêndio</Text>

      <FormSelect
        label="Grupo do Incêndio"
        options={gruposIncendio}
        selectedValue={formData.grupoIncendio}
        onValueChange={(value) => updateFormData({ grupoIncendio: value })}
      />

      <Text style={styles.subSectionTitle}>Detalhes Operacionais</Text>

      <FormInput
        label="Tempo de Extinção (hh:mm)"
        value={formData.tempoExtincao}
        onChangeText={(text) => updateFormData({ tempoExtincao: text })}
        placeholder="00:00"
      />

      <FormInput
        label="Tempo de Rescaldo (hh:mm)"
        value={formData.tempoRescaldo}
        onChangeText={(text) => updateFormData({ tempoRescaldo: text })}
        placeholder="00:00"
      />

      <FormInput
        label="Consumo de Água (litros)"
        value={formData.consumoAgua}
        onChangeText={(text) => updateFormData({ consumoAgua: text })}
        placeholder="0"
        keyboardType="numeric"
      />

      <FormInput
        label="Consumo de LGE/EFE (litros)"
        value={formData.consumoLGE}
        onChangeText={(text) => updateFormData({ consumoLGE: text })}
        placeholder="0"
        keyboardType="numeric"
      />

      <Text style={styles.subSectionTitle}>Ações Realizadas</Text>

      <FormCheckbox
        label="Extinção de incêndio"
        value={formData.acoesRealizadas.extincao}
        onValueChange={(value) => handleAcaoChange('extincao', value)}
      />

      <FormCheckbox
        label="Rescaldo"
        value={formData.acoesRealizadas.rescaldo}
        onValueChange={(value) => handleAcaoChange('rescaldo', value)}
      />

      <FormCheckbox
        label="Ventilação"
        value={formData.acoesRealizadas.ventilacao}
        onValueChange={(value) => handleAcaoChange('ventilacao', value)}
      />

      <FormCheckbox
        label="Resfriamento"
        value={formData.acoesRealizadas.resfriamento}
        onValueChange={(value) => handleAcaoChange('resfriamento', value)}
      />

      <Text style={styles.subSectionTitle}>Recursos Hídricos Utilizados</Text>

      <FormCheckbox
        label="Hidrante urbano"
        value={formData.recursosHidricos.hidranteUrbano}
        onValueChange={(value) => handleRecursoChange('hidranteUrbano', value)}
      />

      <FormCheckbox
        label="Água transportada"
        value={formData.recursosHidricos.aguaTransportada}
        onValueChange={(value) => handleRecursoChange('aguaTransportada', value)}
      />

      <FormCheckbox
        label="Rio"
        value={formData.recursosHidricos.rio}
        onValueChange={(value) => handleRecursoChange('rio', value)}
      />

      <FormCheckbox
        label="Piscina"
        value={formData.recursosHidricos.piscina}
        onValueChange={(value) => handleRecursoChange('piscina', value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#555',
  },
});

export default FormIncendio;