// app/DetalhesOcorrenciaScreen.tsx

import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componentes de Formulário (Caminho corrigido para 'ui')
import FormInput from '../components/ui/FormInput';
// Se você for usar Select, ele deve estar em '../components/ui/FormSelect'
// import FormSelect from '../components/ui/FormSelect'; 
// import FormLocationCapture from '../components/ui/FormLocationCapture'; 

import { SIOB_COLORS } from '../constants/Colors';


// --- Tipagem do Formulário ---
interface FormData {
  titulo: string;
  descricao: string;
  endereco: string;
  referencia: string;
  prioridade: string; // Exemplo de campo de seleção
}

// Mock de Dados para Edição
const MOCK_DATA_EDICAO = {
  'OCR-202510-003': {
    titulo: 'Acidente Grave com Vítima',
    descricao: 'Colisão entre dois veículos de passeio, com múltiplas vítimas presas às ferragens. Necessário resgate veicular e atendimento pré-hospitalar.',
    endereco: 'Av. Boa Viagem, 1500 - Em frente ao Quiosque 10',
    referencia: 'Próximo à Padaria Boa Praça.',
    prioridade: 'Alta',
  }
};

export default function DetalhesOcorrenciaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ocorrenciaId = params.id as string | undefined;

  // 1. Configuração do React Hook Form
  const methods = useForm<FormData>({
    defaultValues: {
      titulo: '',
      descricao: '',
      endereco: '',
      referencia: '',
      prioridade: 'Média',
    },
  });
  const { handleSubmit, reset } = methods;

  // 2. Efeito para carregar dados (Modo Edição)
  useEffect(() => {
    if (ocorrenciaId && MOCK_DATA_EDICAO[ocorrenciaId]) {
      reset(MOCK_DATA_EDICAO[ocorrenciaId]);
    } else {
      reset(); // Limpa se for nova ocorrência
    }
  }, [ocorrenciaId, reset]);

  // 3. Funções de Ação
  const onSubmit = (data: FormData) => {
    console.log("Dados do Formulário Enviados:", data);
    const mode = ocorrenciaId ? 'Edição' : 'Criação';
    alert(`Ocorrência ${mode} de ${ocorrenciaId || 'Nova'} salva com sucesso!`);
    router.back();
  };

  const pageTitle = ocorrenciaId ? `Editar Ocorrência: ${ocorrenciaId}` : 'Nova Ocorrência';
  const submitButtonText = ocorrenciaId ? 'Salvar Alterações' : 'Criar Ocorrência';


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SIOB_COLORS.background }}>
      <View style={styles.container}>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={SIOB_COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>{pageTitle}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Wrapper para o React Hook Form */}
          <FormProvider {...methods}>
            <View style={styles.formCard}>

              {/* Título e Descrição */}
              <FormInput name="titulo" label="Título Curto (Máx 50 caracteres)" placeholder="Ex: Incêndio em Residência" />
              <FormInput name="descricao" label="Detalhes da Ocorrência" placeholder="Descreva a situação, vítimas e necessidades..." multiline={true} />

              <View style={styles.sectionDivider} />

              {/* Localização */}
              <Text style={styles.sectionTitle}>Localização e Referência</Text>
              <FormInput name="endereco" label="Endereço Completo" placeholder="Rua, Número, Bairro, Cidade" />
              <FormInput name="referencia" label="Pontos de Referência" placeholder="Ex: Próximo a Escola X" />

              {/* Exemplo de uso de outros componentes de formulário */}
              {/* <FormSelect name="prioridade" label="Prioridade" options={['Baixa', 'Média', 'Alta']} /> */}
              {/* <FormLocationCapture name="coordenadas" label="Capturar Localização GPS" /> */}

            </View>
          </FormProvider>

          {/* Botão de Envio */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="save" size={24} color={SIOB_COLORS.white} />
            <Text style={styles.submitButtonText}>{submitButtonText}</Text>
          </TouchableOpacity>


          {/* Botão de Exclusão (Apenas se for Edição) */}
          {ocorrenciaId && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => alert('Excluir Ocorrência')} activeOpacity={0.8}>
              <MaterialIcons name="delete" size={20} color={SIOB_COLORS.danger} />
              <Text style={styles.deleteButtonText}>Excluir Ocorrência</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, backgroundColor: SIOB_COLORS.background },
  scrollContent: { paddingVertical: 20, paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginBottom: 10 },
  backButton: { paddingRight: 10 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: SIOB_COLORS.text, flex: 1 },

  formCard: {
    backgroundColor: SIOB_COLORS.cardBg, borderRadius: 12, padding: 15, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
  },
  sectionDivider: { borderBottomWidth: 1, borderBottomColor: SIOB_COLORS.border, marginVertical: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: SIOB_COLORS.primary, marginBottom: 10 },

  submitButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: SIOB_COLORS.accent, borderRadius: 8,
    paddingVertical: 15, marginBottom: 10,
    shadowColor: SIOB_COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  submitButtonText: { color: SIOB_COLORS.white, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },

  deleteButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: SIOB_COLORS.cardBg, borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1, borderColor: SIOB_COLORS.danger,
  },
  deleteButtonText: { color: SIOB_COLORS.danger, fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});