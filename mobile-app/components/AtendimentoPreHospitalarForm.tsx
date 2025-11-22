import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FormCheckbox } from '../ui/FormCheckbox';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { ThemedText } from '../ui/themed-text';
import { ThemedView } from '../ui/themed-view';

export const AtendimentoPreHospitalarForm = () => {
  const [formData, setFormData] = useState({
    // Qualificação da Vítima
    nomeVitima: '',
    idade: '',
    sexo: '',
    bombeiroServico: '',

    // Escala de Glasgow
    aberturaOcular: '',
    respostaVerbal: '',
    respostaMotora: '',
    totalGlasgow: '',

    // Sinais Vitais
    pressaoArterial: '',
    frequenciaCardiaca: '',
    frequenciaRespiratoria: '',
    temperatura: '',

    // Ações Realizadas
    rcp: false,
    contencaoHemorragia: false,
    imobilizacao: false,
    desencarceramento: false,
    oxigenoterapia: false,
    ventilacaoAssistida: false,

    // Destino da Vítima
    destino: '',
    hospitalOrgao: ''
    // REMOVIDO: ditarBasico
  });

  const sexoOptions = [
    { label: 'Mulher cis', value: 'mulher_cis' },
    { label: 'Mulher trans', value: 'mulher_trans' },
    { label: 'Homem cis', value: 'homem_cis' },
    { label: 'Homem trans', value: 'homem_trans' },
    { label: 'Não-Binário', value: 'nao_binario' },
    { label: 'Outro', value: 'outro' }
  ];

  const destinoOptions = [
    { label: 'Entregue no Hospital', value: 'entregue_hospital' },
    { label: 'Recusou Atendimento', value: 'recusou_atendimento' },
    { label: 'Permaneceu no Local (Médico liberou)', value: 'permaneceu_local' },
    { label: 'Encaminhada ao Suporte SAMU', value: 'encaminhada_samu' }
  ];

  const bombeiroOptions = [
    { label: 'Sim', value: 'sim' },
    { label: 'Não', value: 'nao' }
  ];

  const glasgowOcularOptions = [
    { label: '4 - Espontânea', value: '4' },
    { label: '3 - Ao comando verbal', value: '3' },
    { label: '2 - À dor', value: '2' },
    { label: '1 - Nenhuma', value: '1' }
  ];

  const glasgowVerbalOptions = [
    { label: '5 - Orientado', value: '5' },
    { label: '4 - Confuso', value: '4' },
    { label: '3 - Palavras inadequadas', value: '3' },
    { label: '2 - Sons incompreensíveis', value: '2' },
    { label: '1 - Nenhuma', value: '1' }
  ];

  const glasgowMotoraOptions = [
    { label: '6 - Obedece a comandos', value: '6' },
    { label: '5 - Localiza dor', value: '5' },
    { label: '4 - Retirada à dor', value: '4' },
    { label: '3 - Flexão anormal', value: '3' },
    { label: '2 - Extensão anormal', value: '2' },
    { label: '1 - Nenhuma', value: '1' }
  ];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ThemedView>
      <ScrollView style={styles.container}>
        {/* Qualificação da Vítima */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Qualificação da Vítima</ThemedText>

          <FormInput
            label="Nome da Vítima"
            placeholder="Nome completo"
            value={formData.nomeVitima}
            onChangeText={(value) => updateField('nomeVitima', value)}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput
                label="Idade"
                placeholder="Idade"
                value={formData.idade}
                onChangeText={(value) => updateField('idade', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfInput}>
              <FormSelect
                label="Sexo"
                options={sexoOptions}
                selectedValue={formData.sexo}
                onValueChange={(value) => updateField('sexo', value)}
                placeholder="Informe"
              />
            </View>
          </View>

          <FormSelect
            label="Bombeiro em Serviço?"
            options={bombeiroOptions}
            selectedValue={formData.bombeiroServico}
            onValueChange={(value) => updateField('bombeiroServico', value)}
            placeholder="Informe"
          />
        </View>

        {/* Escala de Glasgow e Sinais Vitais */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Escala de Coma de Glasgow e Sinais Vitais</ThemedText>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormSelect
                label="Abertura Ocular (09b)"
                options={glasgowOcularOptions}
                selectedValue={formData.aberturaOcular}
                onValueChange={(value) => updateField('aberturaOcular', value)}
                placeholder="Máx. 4"
              />
            </View>

            <View style={styles.halfInput}>
              <FormInput
                label="Pressão Arterial (09g)"
                placeholder="mmHg (Ex: 120x80)"
                value={formData.pressaoArterial}
                onChangeText={(value) => updateField('pressaoArterial', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormSelect
                label="Resposta Verbal (09c)"
                options={glasgowVerbalOptions}
                selectedValue={formData.respostaVerbal}
                onValueChange={(value) => updateField('respostaVerbal', value)}
                placeholder="Máx. 5"
              />
            </View>

            <View style={styles.halfInput}>
              <FormInput
                label="Frequência Cardíaca (09g)"
                placeholder="BPM"
                value={formData.frequenciaCardiaca}
                onChangeText={(value) => updateField('frequenciaCardiaca', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormSelect
                label="Resposta Motora (09d)"
                options={glasgowMotoraOptions}
                selectedValue={formData.respostaMotora}
                onValueChange={(value) => updateField('respostaMotora', value)}
                placeholder="Máx. 6"
              />
            </View>

            <View style={styles.halfInput}>
              <FormInput
                label="Frequência Respiratória (09g)"
                placeholder="Ipm"
                value={formData.frequenciaRespiratoria}
                onChangeText={(value) => updateField('frequenciaRespiratoria', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput
                label="Total Glasgow (09f)"
                placeholder="Total"
                value={formData.totalGlasgow}
                onChangeText={(value) => updateField('totalGlasgow', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfInput}>
              <FormInput
                label="Temperatura (09g)"
                placeholder="°C (Ex: 36.5)"
                value={formData.temperatura}
                onChangeText={(value) => updateField('temperatura', value)}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Ações Realizadas */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Ações Realizadas</ThemedText>

          <View style={styles.checkboxContainer}>
            <FormCheckbox
              label="RCP"
              value={formData.rcp}
              onValueChange={(value) => updateField('rcp', value)}
            />
            <FormCheckbox
              label="Contenção de Hemorragia"
              value={formData.contencaoHemorragia}
              onValueChange={(value) => updateField('contencaoHemorragia', value)}
            />
            <FormCheckbox
              label="Imobilização"
              value={formData.imobilizacao}
              onValueChange={(value) => updateField('imobilizacao', value)}
            />
            <FormCheckbox
              label="Desencarceramento"
              value={formData.desencarceramento}
              onValueChange={(value) => updateField('desencarceramento', value)}
            />
            <FormCheckbox
              label="Oxigenoterapia"
              value={formData.oxigenoterapia}
              onValueChange={(value) => updateField('oxigenoterapia', value)}
            />
            <FormCheckbox
              label="Ventilação Assistida"
              value={formData.ventilacaoAssistida}
              onValueChange={(value) => updateField('ventilacaoAssistida', value)}
            />
          </View>
        </View>

        {/* Destino da Vítima */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Destino da Vítima</ThemedText>

          <FormSelect
            label="Destino"
            options={destinoOptions}
            selectedValue={formData.destino}
            onValueChange={(value) => updateField('destino', value)}
            placeholder="Informe"
          />

          <FormInput
            label="Hospital / Órgão Competente"
            placeholder="Nome do Hospital, PM, PC, etc."
            value={formData.hospitalOrgao}
            onChangeText={(value) => updateField('hospitalOrgao', value)}
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
  section: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  checkboxContainer: {
    marginTop: 8,
  },
});