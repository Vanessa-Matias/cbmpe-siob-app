import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FormCheckbox } from '@/components/ui/FormCheckbox';
import { FormInput } from '@/components/ui/FormInput';
import { FormRadioGroup } from '@/components/ui/FormRadioGroup';
import { FormSelect } from '@/components/ui/FormSelect';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

interface FormPrevencaoProps {
  onDataChange: (data: any) => void;
  initialData?: any;
}

export const FormPrevencao: React.FC<FormPrevencaoProps> = ({
  onDataChange,
  initialData = {}
}) => {
  const [formData, setFormData] = useState({
    // Dados do Evento
    nomeEvento: initialData.nomeEvento || '',
    horaChegada: initialData.horaChegada || '',
    horaInicio: initialData.horaInicio || '',
    horaSaida: initialData.horaSaida || '',

    // Público Estimado
    publicoEstimado: initialData.publicoEstimado || '',
    eventoRegularizado: initialData.eventoRegularizado || '',

    // Tipo de Atividade
    tipoAtividade: initialData.tipoAtividade || '',

    // Prevenção Aquática
    prevencaoAquatica: initialData.prevencaoAquatica || [],

    // Serviços Realizados
    servicosRealizados: initialData.servicosRealizados || [],

    // Status
    status: initialData.status || '',
  });

  const updateFormData = (newData: Partial<typeof formData>) => {
    const updated = { ...formData, ...newData };
    setFormData(updated);
    onDataChange(updated);
  };

  const atividadesPrevencao = [
    { label: 'Ativa e Reativa', value: 'ativa-reativa' },
    { label: 'Prevenção em Orla Marítima', value: 'orla-maritima' },
    { label: 'Prevenção em Rio', value: 'rio' },
  ];

  const servicosOptions = [
    { label: 'Orientação verbal de segurança', value: 'orientacao-verbal' },
    { label: 'Sinalização de área de risco', value: 'sinalizacao-area-risco' },
    { label: 'Isolamento de área de risco', value: 'isolamento-area-risco' },
  ];

  const statusOptions = [
    { label: 'Válido', value: 'valido' },
    { label: 'Vencido', value: 'vencido' },
    { label: 'Não Localizado', value: 'nao-localizado' },
  ];

  return (
    <ScrollView className="flex-1">
      <ThemedView className="p-4">

        {/* Dados e Público do Evento */}
        <ThemedText type="subtitle" className="mb-4">
          Dados e Público do Evento
        </ThemedText>

        <View className="mb-4">
          <FormInput
            label="Nome do Evento"
            value={formData.nomeEvento}
            onChangeText={(text) => updateFormData({ nomeEvento: text })}
            placeholder="Ex: Boa Viagem"
          />
        </View>

        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <FormInput
              label="Hora Chegada"
              value={formData.horaChegada}
              onChangeText={(text) => updateFormData({ horaChegada: text })}
              placeholder="➡️ ➡️ ➡️"
            />
          </View>
          <View className="flex-1 ml-2">
            <FormInput
              label="Hora Início"
              value={formData.horaInicio}
              onChangeText={(text) => updateFormData({ horaInicio: text })}
              placeholder="➡️ ➡️"
            />
          </View>
        </View>

        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <FormInput
              label="Hora Saída"
              value={formData.horaSaida}
              onChangeText={(text) => updateFormData({ horaSaida: text })}
              placeholder="➡️ ➡️"
            />
          </View>
        </View>

        {/* Público Estimado */}
        <View className="mb-4">
          <FormInput
            label="Público Estimado"
            value={formData.publicoEstimado}
            onChangeText={(text) => updateFormData({ publicoEstimado: text })}
            placeholder="Ex: 500 Pessoas"
            keyboardType="numeric"
          />
        </View>

        {/* Evento Regularizado */}
        <View className="mb-6">
          <ThemedText className="mb-2">Evento Regularizado?</ThemedText>
          <FormRadioGroup
            options={[
              { label: 'Sim', value: 'sim' },
              { label: 'Não', value: 'nao' },
            ]}
            selectedValue={formData.eventoRegularizado}
            onValueChange={(value) => updateFormData({ eventoRegularizado: value })}
          />
        </View>

        {/* Tipo de Atividade */}
        <View className="mb-4">
          <ThemedText type="subtitle" className="mb-2">
            Tipo de Atividade
          </ThemedText>
          <FormSelect
            options={atividadesPrevencao}
            selectedValue={formData.tipoAtividade}
            onValueChange={(value) => updateFormData({ tipoAtividade: value })}
            placeholder="Selecione o tipo de atividade"
          />
        </View>

        {/* Prevenção Aquática */}
        <View className="mb-4">
          <ThemedText type="subtitle" className="mb-2">
            Prevenção Aquática
          </ThemedText>
          <FormCheckbox
            options={atividadesPrevencao}
            selectedValues={formData.prevencaoAquatica}
            onValuesChange={(values) => updateFormData({ prevencaoAquatica: values })}
          />
        </View>

        {/* Serviços Realizados */}
        <View className="mb-4">
          <ThemedText type="subtitle" className="mb-2">
            Serviços Realizados
          </ThemedText>
          <FormCheckbox
            options={servicosOptions}
            selectedValues={formData.servicosRealizados}
            onValuesChange={(values) => updateFormData({ servicosRealizados: values })}
          />
        </View>

        {/* Status */}
        <View className="mb-4">
          <FormSelect
            label="Status"
            options={statusOptions}
            selectedValue={formData.status}
            onValueChange={(value) => updateFormData({ status: value })}
            placeholder="Informe"
          />
        </View>

      </ThemedView>
    </ScrollView>
  );
};