// components/FormGerenciamento.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FormInput from './FormInput';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export interface GerenciamentoData {
  situacaoAtual: string;
  objetivosAcoes: string;
  numBMEmpregados: string;
  efetivoTotal: string;
  numVtrsEmpregadas: string;
  totalVTRs: string;
  numEmbarcacoes: string;
  orgaosEnvolvidos: string;
  recursosAdicionais: string;
}

interface FormGerenciamentoProps {
  onDataChange: (data: GerenciamentoData) => void;
  initialData?: GerenciamentoData;
}

export const FormGerenciamento: React.FC<FormGerenciamentoProps> = ({
  onDataChange,
  initialData
}) => {
  const [formData, setFormData] = useState<GerenciamentoData>(
    initialData || {
      situacaoAtual: '',
      objetivosAcoes: '',
      numBMEmpregados: '',
      efetivoTotal: '',
      numVtrsEmpregadas: '',
      totalVTRs: '',
      numEmbarcacoes: '',
      orgaosEnvolvidos: '',
      recursosAdicionais: '',
    }
  );

  const updateField = (field: keyof GerenciamentoData, value: string) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    onDataChange(newData);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Formulário de Gerenciamento (SCI-1 Briefing da Emergência)
        </ThemedText>

        {/* Situação e Objetivos Operacionais */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionHeader}>
            Situação e Objetivos Operacionais
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
            Situação Atual / Sumário dos Problemas
          </ThemedText>
          <ThemedText type="default" style={styles.fieldDescription}>
            Descreva a emergência, forças e fraquezas.
          </ThemedText>
          <FormInput
            placeholder="Descreva a situação atual da emergência..."
            value={formData.situacaoAtual}
            onChangeText={(text) => updateField('situacaoAtual', text)}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
            Objetivos e Ações Implementadas/Planejadas
          </ThemedText>
          <ThemedText type="default" style={styles.fieldDescription}>
            Defina os objetivos (e.g., Confine, Resgate) e as próximas ações.
          </ThemedText>
          <FormInput
            placeholder="Descreva os objetivos e ações planejadas..."
            value={formData.objetivosAcoes}
            onChangeText={(text) => updateField('objetivosAcoes', text)}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>

        {/* Força e Recursos Operacionais */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionHeader}>
            Força e Recursos Operacionais
          </ThemedText>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
                Nº BM Empregados
              </ThemedText>
              <FormInput
                placeholder="0"
                value={formData.numBMEmpregados}
                onChangeText={(text) => updateField('numBMEmpregados', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
                Efetivo Total
              </ThemedText>
              <FormInput
                placeholder="0"
                value={formData.efetivoTotal}
                onChangeText={(text) => updateField('efetivoTotal', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
                Nº Viaturas Empregadas
              </ThemedText>
              <FormInput
                placeholder="0"
                value={formData.numVtrsEmpregadas}
                onChangeText={(text) => updateField('numVtrsEmpregadas', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
                Total de VTRs
              </ThemedText>
              <FormInput
                placeholder="0"
                value={formData.totalVTRs}
                onChangeText={(text) => updateField('totalVTRs', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
            Nº Embarcações
          </ThemedText>
          <ThemedText type="default" style={styles.fieldDescription}>
            Se aplicável
          </ThemedText>
          <FormInput
            placeholder="0"
            value={formData.numEmbarcacoes}
            onChangeText={(text) => updateField('numEmbarcacoes', text)}
            keyboardType="numeric"
          />

          <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
            Órgãos Envolvidos
          </ThemedText>
          <ThemedText type="default" style={styles.fieldDescription}>
            Ex: SAMU, PMPE, Defesa Civil
          </ThemedText>
          <FormInput
            placeholder="Liste os órgãos envolvidos..."
            value={formData.orgaosEnvolvidos}
            onChangeText={(text) => updateField('orgaosEnvolvidos', text)}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
            Recursos Adicionais Solicitados
          </ThemedText>
          <ThemedText type="default" style={styles.fieldDescription}>
            Descreva os recursos que ainda faltam ou foram pedidos
          </ThemedText>
          <FormInput
            placeholder="Descreva os recursos adicionais necessários..."
            value={formData.recursosAdicionais}
            onChangeText={(text) => updateField('recursosAdicionais', text)}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    marginBottom: 16,
    color: '#0066cc',
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  fieldDescription: {
    fontSize: 12,
    marginBottom: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    flex: 0.48,
  },
});

export default FormGerenciamento;