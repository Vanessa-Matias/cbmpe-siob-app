// components/FormAtividadeComunitaria.tsx
import FormInput from '@/components/FormInput';
import FormRadioGroup from '@/components/FormRadioGroup';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useOccurrence } from '@/contexts/OccurrenceContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function FormAtividadeComunitaria() {
  const { occurrence, updateOccurrence } = useOccurrence();

  const [formData, setFormData] = useState({
    nomeEvento: occurrence?.nomeEvento || '',
    horaChegada: occurrence?.horaChegada || '',
    horaInicio: occurrence?.horaInicio || '',
    horaSaida: occurrence?.horaSaida || '',
    publicoEstimado: occurrence?.publicoEstimado || '',
    publicoPresente: occurrence?.publicoPresente || '',
    grupoAtividade: occurrence?.grupoAtividade || '',
    subgrupoAtividade: occurrence?.subgrupoAtividade || '',
  });

  const gruposAtividade = [
    { label: 'Apoio Social', value: 'apoio_social' },
    { label: 'Interação Educativa', value: 'interacao_educativa' },
    { label: 'Interação Religiosa', value: 'interacao_religiosa' }
  ];

  const subgruposApoioSocial = [
    { label: 'Abastecimento de água', value: 'abastecimento_agua' },
    { label: 'Transporte de Obeso', value: 'transporte_obeso' },
    { label: 'Ação cívico-social', value: 'acao_civico_social' },
    { label: 'Visita preventiva', value: 'visita_preventiva' },
    { label: 'Banho de Neblina', value: 'banho_neblina' }
  ];

  const subgruposInteracaoEducativa = [
    { label: 'Demonstração', value: 'demonstracao' },
    { label: 'Palestra', value: 'palestra' },
    { label: 'Treinamento', value: 'treinamento' }
  ];

  const subgruposInteracaoReligiosa = [
    { label: 'Celebração', value: 'celebracao' },
    { label: 'Cerimônia', value: 'cerimonia' },
    { label: 'Evento religioso', value: 'evento_religioso' }
  ];

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };

    // Se mudou o grupo, limpa o subgrupo
    if (field === 'grupoAtividade') {
      newData.subgrupoAtividade = '';
    }

    setFormData(newData);
    updateOccurrence(newData);
  };

  const getSubgrupos = () => {
    switch (formData.grupoAtividade) {
      case 'apoio_social':
        return subgruposApoioSocial;
      case 'interacao_educativa':
        return subgruposInteracaoEducativa;
      case 'interacao_religiosa':
        return subgruposInteracaoReligiosa;
      default:
        return [];
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>
          Natureza 6: Atividade Comunitária
        </ThemedText>

        {/* Dados e Público do Evento */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Dados e Público do Evento
        </ThemedText>

        <FormInput
          label="Nome do Evento"
          placeholder="Ex. Ação cívico-social / Palestra"
          value={formData.nomeEvento}
          onChangeText={(value) => handleInputChange('nomeEvento', value)}
        />

        <View style={styles.timeRow}>
          <View style={styles.timeInput}>
            <FormInput
              label="Hora Chegada"
              placeholder="--:--"
              value={formData.horaChegada}
              onChangeText={(value) => handleInputChange('horaChegada', value)}
            />
          </View>
          <View style={styles.timeInput}>
            <FormInput
              label="Hora Início"
              placeholder="--:--"
              value={formData.horaInicio}
              onChangeText={(value) => handleInputChange('horaInicio', value)}
            />
          </View>
          <View style={styles.timeInput}>
            <FormInput
              label="Hora Saída"
              placeholder="--:--"
              value={formData.horaSaida}
              onChangeText={(value) => handleInputChange('horaSaida', value)}
            />
          </View>
        </View>

        <FormInput
          label="Público Estimado"
          placeholder="Ex: 500 pessoas"
          value={formData.publicoEstimado}
          onChangeText={(value) => handleInputChange('publicoEstimado', value)}
          keyboardType="numeric"
        />

        <FormInput
          label="Público Presente"
          placeholder="Ex: 200 pessoas"
          value={formData.publicoPresente}
          onChangeText={(value) => handleInputChange('publicoPresente', value)}
          keyboardType="numeric"
        />

        {/* Grupo da Atividade */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Grupo da Atividade
        </ThemedText>

        <FormRadioGroup
          options={gruposAtividade}
          selectedValue={formData.grupoAtividade}
          onValueChange={(value) => handleInputChange('grupoAtividade', value)}
        />

        {/* Subgrupo da Atividade */}
        {formData.grupoAtividade && getSubgrupos().length > 0 && (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Ações Específicas - {formData.grupoAtividade === 'apoio_social' ? 'Subgrupo 1: Apoio Social' :
                formData.grupoAtividade === 'interacao_educativa' ? 'Subgrupo 2: Interação Educativa' :
                  'Subgrupo 3: Interação Religiosa'}
            </ThemedText>

            <FormRadioGroup
              options={getSubgrupos()}
              selectedValue={formData.subgrupoAtividade}
              onValueChange={(value) => handleInputChange('subgrupoAtividade', value)}
            />
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
  },
});