import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import FormPhotoCapture from '../components/ui/FormPhotoCapture';
import FormSignaturePad from '../components/ui/FormSignaturePad';
import SidebarMenu from '../components/ui/SidebarMenu';
import { useOccurrences } from '../contexts/OccurrenceContext';

const SIOB_COLORS = {
  primary: '#AE1A16',
  white: '#FFFFFF',
  text: '#212529',
  background: '#f8f9fa',
  cardBg: '#FFFFFF',
  border: '#dee2e6',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
};

// Tipos para o formulário
interface NovaOcorrenciaForm {
  // Ponto Base
  pontoBase: string;
  ome: string;
  gb: string;
  secao: string;

  // Viatura Responsável
  tipoViatura: string;
  numeroOrdem: string;

  // Número do aviso
  numeroAviso: string;
  data: string;

  // Dados da Ocorrência
  co: string;
  ciods: string;
  numero193: string;
  situacao: string;
  prioridade: string;

  // Localização
  rua: string;
  numero: string;
  bairro: string;
  municipio: string;
  codigoLocal: string;
  pontoReferencia: string;
  latitude: string;
  longitude: string;

  // Formulários Preenchidos
  formularios: {
    preHospitalar: boolean;
    gerenciamento: boolean;
    atividadeComunitaria: boolean;
    produtoPerigoso: boolean;
    incendio: boolean;
    salvamento: boolean;
    prevencao: boolean;
    outroRelatorio: boolean;
    outroRelatorioEspecifico: string;
  };

  // Tipo de Vítima
  tipoVitima: string;
  totalVitimas: string;

  // Mídia e Assinaturas
  fotoOcorrencia: string;
  assinaturaDigital: string;
}

export default function NovaOcorrenciaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { addOccurrence, updateOccurrence } = useOccurrences();

  // Verifica se está em modo de edição
  const modoEdicao = params.modoEdicao === 'true';
  const ocorrenciaId = params.ocorrenciaId as string;
  const ocorrenciaData = params.ocorrenciaData ? JSON.parse(params.ocorrenciaData as string) : null;

  const [formData, setFormData] = useState<NovaOcorrenciaForm>({
    pontoBase: '',
    ome: '',
    gb: '',
    secao: '',
    tipoViatura: '',
    numeroOrdem: '',
    numeroAviso: '',
    data: new Date().toLocaleDateString('pt-BR'),
    co: '',
    ciods: '',
    numero193: '',
    situacao: '',
    prioridade: 'Média',
    rua: '',
    numero: '',
    bairro: '',
    municipio: 'Recife',
    codigoLocal: '',
    pontoReferencia: '',
    latitude: '',
    longitude: '',
    formularios: {
      preHospitalar: false,
      gerenciamento: false,
      atividadeComunitaria: false,
      produtoPerigoso: false,
      incendio: false,
      salvamento: false,
      prevencao: false,
      outroRelatorio: false,
      outroRelatorioEspecifico: '',
    },
    tipoVitima: '',
    totalVitimas: '',
    fotoOcorrencia: '',
    assinaturaDigital: '',
  });

  // Carrega os dados da ocorrência se estiver em modo de edição
  useEffect(() => {
    if (modoEdicao && ocorrenciaData) {
      console.log('📝 Carregando dados para edição:', ocorrenciaData);

      // Extrai dados básicos da ocorrência para preencher o formulário
      // Esta é uma implementação básica - você pode ajustar conforme sua estrutura de dados
      const descricao = ocorrenciaData.descricao || '';

      // Tenta extrair informações da descrição (lógica básica)
      const pontoBaseMatch = descricao.match(/Ponto Base: ([^-]+)/);
      const viaturaMatch = descricao.match(/Viatura: ([^-]+)/);
      const ordemMatch = descricao.match(/Ordem: ([^-]+)/);
      const avisoMatch = descricao.match(/Aviso: (.+)$/);

      setFormData(prev => ({
        ...prev,
        pontoBase: pontoBaseMatch ? pontoBaseMatch[1].trim() : '',
        tipoViatura: viaturaMatch ? viaturaMatch[1].trim() : '',
        numeroOrdem: ordemMatch ? ordemMatch[1].trim() : '',
        numeroAviso: avisoMatch ? avisoMatch[1].trim() : '',
        prioridade: ocorrenciaData.prioridade || 'Média',
        // Para localização, você pode precisar de lógica mais complexa
        // baseada na estrutura real dos seus dados
        rua: ocorrenciaData.rua || '',
        numero: ocorrenciaData.numero || '',
        bairro: ocorrenciaData.bairro || '',
        municipio: ocorrenciaData.municipio || 'Recife',
      }));
    }
  }, [modoEdicao, ocorrenciaData]);

  const handleSave = () => {
    // Validação básica
    if (!formData.pontoBase || !formData.tipoViatura || !formData.numeroOrdem) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios: Ponto Base, Tipo de Viatura e Nº Ordem');
      return;
    }

    if (modoEdicao) {
      // ✅ ATUALIZA A OCORRÊNCIA EXISTENTE
      const ocorrenciaAtualizada = {
        id: ocorrenciaId,
        tipo: getTipoOcorrencia(),
        local: formData.rua && formData.numero && formData.bairro
          ? `${formData.rua}, ${formData.numero} - ${formData.bairro}`
          : 'Local não informado',
        data: new Date().toLocaleString('pt-BR'),
        status: ocorrenciaData?.status || 'Pendente',
        prioridade: (formData.prioridade || 'Média') as 'Baixa' | 'Média' | 'Alta',
        descricao: `Ponto Base: ${formData.pontoBase} - Viatura: ${formData.tipoViatura} - Ordem: ${formData.numeroOrdem}${formData.numeroAviso ? ` - Aviso: ${formData.numeroAviso}` : ''}`,
        // Mantém outros dados da ocorrência original
        ...(ocorrenciaData && {
          rua: formData.rua || ocorrenciaData.rua,
          numero: formData.numero || ocorrenciaData.numero,
          bairro: formData.bairro || ocorrenciaData.bairro,
          municipio: formData.municipio || ocorrenciaData.municipio,
        })
      };

      console.log('Atualizando ocorrência:', ocorrenciaAtualizada);
      updateOccurrence(ocorrenciaId, ocorrenciaAtualizada);

      Alert.alert('Sucesso', 'Ocorrência atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.push('/OcorrenciasScreen')
        }
      ]);
    } else {
      // ✅ SALVA A NOVA OCORRÊNCIA
      const novaOcorrencia = {
        tipo: getTipoOcorrencia(),
        local: formData.rua && formData.numero && formData.bairro
          ? `${formData.rua}, ${formData.numero} - ${formData.bairro}`
          : 'Local não informado',
        data: new Date().toLocaleString('pt-BR'),
        status: 'Pendente',
        prioridade: (formData.prioridade || 'Média') as 'Baixa' | 'Média' | 'Alta',
        descricao: `Ponto Base: ${formData.pontoBase} - Viatura: ${formData.tipoViatura} - Ordem: ${formData.numeroOrdem}${formData.numeroAviso ? ` - Aviso: ${formData.numeroAviso}` : ''}`,
        rua: formData.rua,
        numero: formData.numero,
        bairro: formData.bairro,
        municipio: formData.municipio,
      };

      console.log('Salvando nova ocorrência:', novaOcorrencia);
      addOccurrence(novaOcorrencia);

      Alert.alert('Sucesso', 'Ocorrência registrada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.push('/OcorrenciasScreen')
        }
      ]);
    }
  };

  const getTipoOcorrencia = (): string => {
    const formularios = formData.formularios;

    if (formularios.incendio) return 'Incêndio';
    if (formularios.salvamento) return 'Salvamento';
    if (formularios.preHospitalar) return 'Atendimento Pré-Hospitalar';
    if (formularios.produtoPerigoso) return 'Produto Perigoso';
    if (formularios.prevencao) return 'Prevenção';
    if (formularios.atividadeComunitaria) return 'Atividade Comunitária';
    if (formularios.gerenciamento) return 'Gerenciamento';
    if (formularios.outroRelatorio && formularios.outroRelatorioEspecifico) {
      return formularios.outroRelatorioEspecifico;
    }

    return 'Outros';
  };

  const handleCaptureGPS = () => {
    setFormData(prev => ({
      ...prev,
      latitude: '-8.047562',
      longitude: '-34.877002'
    }));
    Alert.alert('GPS', 'Coordenadas capturadas com sucesso!');
  };

  const updateFormulario = (field: keyof typeof formData.formularios, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      formularios: {
        ...prev.formularios,
        [field]: value
      }
    }));
  };

  const handlePhotoCaptured = (photoUri: string) => {
    setFormData(prev => ({ ...prev, fotoOcorrencia: photoUri }));
  };

  const handleSignatureCaptured = (signatureUri: string) => {
    setFormData(prev => ({ ...prev, assinaturaDigital: signatureUri }));
  };

  const handleFormularioSelection = (formularioKey: string, formularioLabel: string) => {
    const currentValue = formData.formularios[formularioKey as keyof typeof formData.formularios];
    updateFormulario(formularioKey as keyof typeof formData.formularios, !currentValue);

    if (formularioKey !== 'outroRelatorio' && !currentValue) {
      router.push({
        pathname: '/DetalhesNaturezaScreen',
        params: {
          natureza: formularioLabel,
          ocorrenciaId: modoEdicao ? ocorrenciaId : `OCR-${new Date().getTime()}`
        }
      });
    }
  };

  // Título dinâmico baseado no modo
  const headerTitle = modoEdicao ? 'Editar Ocorrência' : 'Nova Ocorrência';
  const saveButtonText = modoEdicao ? 'Atualizar Ocorrência' : 'Salvar Ocorrência';

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={SIOB_COLORS.primary} barStyle="light-content" />
      <SidebarMenu isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuButton}>
            <MaterialIcons name="menu" size={24} color={SIOB_COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={SIOB_COLORS.white} />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Cabeçalho do Sistema */}
          <View style={styles.systemHeader}>
            <Text style={styles.systemTitle}>Sistema Integrado de Ocorrências dos Bombeiros</Text>
            <Text style={styles.stepIndicator}>
              {modoEdicao ? 'Editando Ocorrência' : 'Etapa 1 de 1: Formulário Básico'}
            </Text>
            {modoEdicao && ocorrenciaId && (
              <Text style={styles.ocorrenciaIdText}>ID: {ocorrenciaId}</Text>
            )}
          </View>

          {/* SEÇÃO 1: PONTO BASE */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ponto Base</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Número do Ponto Base *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: B-2025001234"
                value={formData.pontoBase}
                onChangeText={(text) => setFormData({ ...formData, pontoBase: text })}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>OME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="______"
                  value={formData.ome}
                  onChangeText={(text) => setFormData({ ...formData, ome: text })}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>GB</Text>
                <TextInput
                  style={styles.input}
                  placeholder="______"
                  value={formData.gb}
                  onChangeText={(text) => setFormData({ ...formData, gb: text })}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Seção</Text>
                <TextInput
                  style={styles.input}
                  placeholder="______"
                  value={formData.secao}
                  onChangeText={(text) => setFormData({ ...formData, secao: text })}
                />
              </View>
            </View>
          </View>

          {/* SEÇÃO 2: VIATURA RESPONSÁVEL */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Viatura Responsável</Text>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Tipo *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: ABT"
                  value={formData.tipoViatura}
                  onChangeText={(text) => setFormData({ ...formData, tipoViatura: text })}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Nº Ordem *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Número de ordem"
                  value={formData.numeroOrdem}
                  onChangeText={(text) => setFormData({ ...formData, numeroOrdem: text })}
                />
              </View>
            </View>
          </View>

          {/* SEÇÃO 3: NÚMERO DO AVISO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Número do aviso (I-NETDISPATCHER)</Text>
            <Text style={styles.label}>Informe o tipo e número de ordem</Text>

            <View style={styles.formGroup}>
              <TextInput
                style={styles.input}
                placeholder="Número do aviso"
                value={formData.numeroAviso}
                onChangeText={(text) => setFormData({ ...formData, numeroAviso: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                value={formData.data}
                onChangeText={(text) => setFormData({ ...formData, data: text })}
              />
            </View>
          </View>

          {/* SEÇÃO 4: DADOS DA OCORRÊNCIA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados da Ocorrência</Text>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>CO</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 123"
                  value={formData.co}
                  onChangeText={(text) => setFormData({ ...formData, co: text })}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>CIODS</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 45"
                  value={formData.ciods}
                  onChangeText={(text) => setFormData({ ...formData, ciods: text })}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>193</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 567"
                  value={formData.numero193}
                  onChangeText={(text) => setFormData({ ...formData, numero193: text })}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex2]}>
                <Text style={styles.label}>Situação</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Informe"
                  value={formData.situacao}
                  onChangeText={(text) => setFormData({ ...formData, situacao: text })}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Prioridade</Text>
                <TextInput
                  style={styles.input}
                  value={formData.prioridade}
                  onChangeText={(text) => setFormData({ ...formData, prioridade: text })}
                />
              </View>
            </View>
          </View>

          {/* SEÇÃO 5: LOCALIZAÇÃO DA OCORRÊNCIA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localização da Ocorrência</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rua / Avenida</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Av. Gov. Agamenon Magalhães"
                value={formData.rua}
                onChangeText={(text) => setFormData({ ...formData, rua: text })}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Nº</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 123"
                  value={formData.numero}
                  onChangeText={(text) => setFormData({ ...formData, numero: text })}
                />
              </View>

              <View style={[styles.formGroup, styles.flex2]}>
                <Text style={styles.label}>Bairro</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Boa Viagem"
                  value={formData.bairro}
                  onChangeText={(text) => setFormData({ ...formData, bairro: text })}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex2]}>
                <Text style={styles.label}>Município</Text>
                <TextInput
                  style={styles.input}
                  value={formData.municipio}
                  onChangeText={(text) => setFormData({ ...formData, municipio: text })}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Código do Local</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Cód. Anexo B"
                  value={formData.codigoLocal}
                  onChangeText={(text) => setFormData({ ...formData, codigoLocal: text })}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ponto de Referência</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Próximo ao Shopping Recife"
                value={formData.pontoReferencia}
                onChangeText={(text) => setFormData({ ...formData, pontoReferencia: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Coordenadas GPS</Text>
              <View style={styles.row}>
                <View style={[styles.formGroup, styles.flex1]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Latitude"
                    value={formData.latitude}
                    onChangeText={(text) => setFormData({ ...formData, latitude: text })}
                  />
                </View>
                <View style={[styles.formGroup, styles.flex1]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Longitude"
                    value={formData.longitude}
                    onChangeText={(text) => setFormData({ ...formData, longitude: text })}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.gpsButton} onPress={handleCaptureGPS}>
                <MaterialIcons name="gps-fixed" size={16} color={SIOB_COLORS.white} />
                <Text style={styles.gpsButtonText}>Capturar GPS</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SEÇÃO 6: FORMULÁRIOS PREENCHIDOS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formulários Preenchidos</Text>
            <Text style={styles.sectionSubtitle}>(decorrentes da natureza do atendimento)</Text>

            {[
              { key: 'preHospitalar', label: 'Atendimento pré-hospitalar' },
              { key: 'gerenciamento', label: 'Formulário de Gerenciamento' },
              { key: 'atividadeComunitaria', label: 'Atividade Comunitária' },
              { key: 'produtoPerigoso', label: 'Produto perigoso' },
              { key: 'incendio', label: 'Incêndio' },
              { key: 'salvamento', label: 'Salvamento' },
              { key: 'prevencao', label: 'Prevenção' },
              { key: 'outroRelatorio', label: 'Outro relatório específico' },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.switchRow}
                onPress={() => handleFormularioSelection(item.key, item.label)}
              >
                <Text style={styles.switchLabel}>{item.label}</Text>
                <Switch
                  value={formData.formularios[item.key as keyof typeof formData.formularios]}
                  onValueChange={(value) => handleFormularioSelection(item.key, item.label)}
                  trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
                  thumbColor={formData.formularios[item.key as keyof typeof formData.formularios] ? SIOB_COLORS.white : '#f4f3f4'}
                />
              </TouchableOpacity>
            ))}

            {formData.formularios.outroRelatorio && (
              <View style={styles.formGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Especifique o relatório"
                  value={formData.formularios.outroRelatorioEspecifico}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    formularios: {
                      ...formData.formularios,
                      outroRelatorioEspecifico: text
                    }
                  })}
                />
              </View>
            )}
          </View>

          {/* SEÇÃO 7: TIPO DE VÍTIMA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de Vítima</Text>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex2]}>
                <Text style={styles.label}>Tipo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tipo de vítima"
                  value={formData.tipoVitima}
                  onChangeText={(text) => setFormData({ ...formData, tipoVitima: text })}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Total</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.totalVitimas}
                  onChangeText={(text) => setFormData({ ...formData, totalVitimas: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* SEÇÃO 8: MÍDIA E ASSINATURAS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mídia e Assinaturas</Text>

            {/* Fotografia da Ocorrência */}
            <FormPhotoCapture
              onPhotoCaptured={handlePhotoCaptured}
              currentPhoto={formData.fotoOcorrencia}
            />

            {/* Assinatura Digital */}
            <FormSignaturePad
              onSignatureCaptured={handleSignatureCaptured}
              currentSignature={formData.assinaturaDigital}
            />
          </View>

          {/* BOTÃO DE AÇÃO ÚNICO E CENTRALIZADO */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <MaterialIcons name="save" size={16} color={SIOB_COLORS.white} />
              <Text style={styles.saveButtonText}>{saveButtonText}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SIOB_COLORS.background,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    backgroundColor: SIOB_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SIOB_COLORS.white,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  backButtonText: {
    color: SIOB_COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  systemHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: SIOB_COLORS.primary,
  },
  systemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SIOB_COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 14,
    color: SIOB_COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  ocorrenciaIdText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: SIOB_COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SIOB_COLORS.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: SIOB_COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: SIOB_COLORS.text,
    backgroundColor: SIOB_COLORS.white,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SIOB_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  gpsButtonText: {
    color: SIOB_COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: SIOB_COLORS.border,
  },
  switchLabel: {
    fontSize: 14,
    color: SIOB_COLORS.text,
    flex: 1,
  },
  actionsContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SIOB_COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    minHeight: 44,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  saveButtonText: {
    color: SIOB_COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});