import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import SidebarMenu from '../components/ui/SidebarMenu';

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

interface DetalhesNaturezaParams {
  natureza: string;
  ocorrenciaId?: string;
}

export default function DetalhesNaturezaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<DetalhesNaturezaParams>();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const natureza = params.natureza || 'Salvamento';
  const ocorrenciaId = params.ocorrenciaId || 'OCR-202510-002';

  // Estado para formulário de Produtos Perigosos
  const [produtosPerigososData, setProdutosPerigososData] = useState({
    // Identificação do Produto
    nomeProduto: '',
    numeroONU: '',
    classeRisco: '',
    estadoFisico: '',
    tipoRecipiente: '',
    responsavelProduto: '',
    cpfCnpj: '',

    // Volume e Área Afetada
    vazamentoEstimado: '',
    volumeRecipienteAfetado: '',
    areaIsolada: '',
    areaContaminada: '',

    // Pessoas Afetadas
    numeroContaminados: '',
    numeroEvacuados: '',
    numeroObitos: '',
    numeroFeridos: '',

    // Ambiente Afetado
    ambienteAfetado: {
      solo: false,
      atmosfera: false,
      mananciais: false,
      edificacoes: false,
    },

    // Ações Realizadas
    acoesRealizadas: {
      identificacao: false,
      isolamento: false,
      contencao: false,
      neutralizacao: false,
      descontaminacao: false,
      resfriamentoVaso: false,
    }
  });

  // Estado para formulário de Gerenciamento
  const [gerenciamentoData, setGerenciamentoData] = useState({
    situacaoAtual: '',
    objetivosAcoes: '',
    numBMEmpregados: '',
    efetivoTotal: '',
    numVtrsEmpregadas: '',
    totalVTRs: '',
    numEmbarcacoes: '',
    orgaosEnvolvidos: '',
    recursosAdicionais: '',
  });

  // Estado para formulário de Prevenção
  const [prevencaoData, setPrevencaoData] = useState({
    // Dados e Público do Evento
    nomeEvento: '',
    horaChegada: '',
    horaInicio: '',
    horaSaida: '',
    publicoEstimado: '',
    eventoRegularizado: '',

    // Tipo de Atividade
    tipoAtividade: '',

    // Prevenção Aquática
    prevencaoAquaticaAtivaReativa: false,
    prevencaoAquaticaOrlaMaritima: false,
    prevencaoAquaticaRio: false,

    // Serviços Realizados
    servicoOrientacaoVerbal: false,
    servicoSinalizacaoAreaRisco: false,
    servicoIsolamentoAreaRisco: false,

    // Status
    status: '',
  });

  // Estado para formulário de Atividade Comunitária
  const [atividadeComunitariaData, setAtividadeComunitariaData] = useState({
    // Dados e Público do Evento
    nomeEvento: '',
    horaChegada: '',
    horaInicio: '',
    horaSaida: '',
    publicoEstimado: '',
    publicoPresente: '',

    // Grupo da Atividade
    grupoApoioSocial: false,
    grupoInteracaoEducativa: false,
    grupoInteracaoReligiosa: false,

    // Subgrupo Apoio Social
    subgrupoAbastecimentoAgua: false,
    subgrupoTransporteObeso: false,
    subgrupoAcaoCivicoSocial: false,
    subgrupoVisitaPreventiva: false,
    subgrupoBanhoNeblina: false,

    // Subgrupo Interação Educativa
    subgrupoDemonstracao: false,
    subgrupoPalestra: false,
    subgrupoTreinamento: false,
  });

  // Estado para formulário de Salvamento
  const [salvamentoData, setSalvamentoData] = useState({
    // Grupo da Ocorrência
    eventoComPessoa: false,
    eventoComAnimal: false,
    eventoComObjeto: false,
    eventoComCadaver: false,
    eventoComTransporte: false,
    eventoComArvore: false,
    eventoOutro: false,
    eventoOutroEspecifico: '',

    // Tipo de Salvamento
    tipoAltura: false,
    tipoAquatico: false,
    tipoVeicular: false,
    tipoEspacoConfinado: false,

    // Detalhes Operacionais
    vitimasSocorridas: '',
    vitimasFatais: '',
    tempoResgate: '',
    equipamentosUsados: '',

    // Ações Realizadas
    acaoRetiradaVitima: false,
    acaoEstabilizacaoVeiculo: false,
    acaoAtendimentoPreHospitalar: false,
    acaoOutros: false,
    acaoOutrosEspecifico: '',
  });

  // Estado para formulário de Atendimento Pré-Hospitalar
  const [aphData, setAphData] = useState({
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
  });

  // Estado para formulário de Incêndio
  const [incendioData, setIncendioData] = useState({
    // Grupo do Incêndio
    grupoIncendio: '',

    // Detalhes Operacionais
    tempoExtincao: '',
    tempoRescaldo: '',
    consumoAgua: '',
    consumoLGE: '',

    // Ações Realizadas
    acoesRealizadas: {
      extincao: false,
      rescaldo: false,
      ventilacao: false,
      resfriamento: false,
    },

    // Recursos Hídricos Utilizados
    recursosHidricos: {
      hidranteUrbano: false,
      aguaTransportada: false,
      rio: false,
      piscina: false,
    }
  });

  const handleSave = () => {
    Alert.alert('Sucesso', 'Detalhes da natureza salvos com sucesso!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const updateProdutosPerigososData = (field: string, value: any) => {
    setProdutosPerigososData(prev => ({ ...prev, [field]: value }));
  };

  const updateGerenciamentoData = (field: string, value: any) => {
    setGerenciamentoData(prev => ({ ...prev, [field]: value }));
  };

  const updatePrevencaoData = (field: string, value: any) => {
    setPrevencaoData(prev => ({ ...prev, [field]: value }));
  };

  const updateAtividadeComunitariaData = (field: string, value: any) => {
    setAtividadeComunitariaData(prev => ({ ...prev, [field]: value }));
  };

  const updateSalvamentoData = (field: string, value: any) => {
    setSalvamentoData(prev => ({ ...prev, [field]: value }));
  };

  const updateAphData = (field: string, value: any) => {
    setAphData(prev => ({ ...prev, [field]: value }));
  };

  const updateIncendioData = (field: string, value: any) => {
    setIncendioData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ FORMULÁRIO DE PRODUTOS PERIGOSOS - NOVO
  const renderProdutosPerigososForm = () => (
    <>
      {/* CABEÇALHO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Natureza 4: Produtos Perigosos</Text>
      </View>

      {/* IDENTIFICAÇÃO DO PRODUTO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identificação do Produto</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: GLP, Gasolina..."
            value={produtosPerigososData.nomeProduto}
            onChangeText={(text) => updateProdutosPerigososData('nomeProduto', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de Recipiente</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Tambor, Tancagem"
            value={produtosPerigososData.tipoRecipiente}
            onChangeText={(text) => updateProdutosPerigososData('tipoRecipiente', text)}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Nº ONU</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 1075"
              value={produtosPerigososData.numeroONU}
              onChangeText={(text) => updateProdutosPerigososData('numeroONU', text)}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Classe de Risco</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2.1"
              value={produtosPerigososData.classeRisco}
              onChangeText={(text) => updateProdutosPerigososData('classeRisco', text)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Estado Físico</Text>
          <View style={styles.radioGroup}>
            {['Sólido', 'Líquido', 'Gasoso'].map((estado) => (
              <TouchableOpacity
                key={estado}
                style={styles.radioOption}
                onPress={() => updateProdutosPerigososData('estadoFisico', estado.toLowerCase())}
              >
                <View style={styles.radioCircle}>
                  {produtosPerigososData.estadoFisico === estado.toLowerCase() && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>{estado}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Responsável pelo Produto (Nome/Empresa)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Responsável ou Razão Social"
            value={produtosPerigososData.responsavelProduto}
            onChangeText={(text) => updateProdutosPerigososData('responsavelProduto', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>CPF/CNPJ</Text>
          <TextInput
            style={styles.input}
            placeholder="00.000.000/0000-00"
            value={produtosPerigososData.cpfCnpj}
            onChangeText={(text) => updateProdutosPerigososData('cpfCnpj', text)}
          />
        </View>
      </View>

      {/* VOLUME, ÁREA AFETADA E CONSEQUÊNCIAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Volume, Área Afetada e Consequências</Text>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Vazamento Estimado</Text>
            <TextInput
              style={styles.input}
              placeholder="Volume liberado"
              value={produtosPerigososData.vazamentoEstimado}
              onChangeText={(text) => updateProdutosPerigososData('vazamentoEstimado', text)}
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Volume Recipiente Afetado</Text>
            <TextInput
              style={styles.input}
              placeholder="Volume total"
              value={produtosPerigososData.volumeRecipienteAfetado}
              onChangeText={(text) => updateProdutosPerigososData('volumeRecipienteAfetado', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Área Isolada</Text>
            <TextInput
              style={styles.input}
              placeholder="Tamanho da zona quente"
              value={produtosPerigososData.areaIsolada}
              onChangeText={(text) => updateProdutosPerigososData('areaIsolada', text)}
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Área Contaminada</Text>
            <TextInput
              style={styles.input}
              placeholder="Área atingida pelo produto"
              value={produtosPerigososData.areaContaminada}
              onChangeText={(text) => updateProdutosPerigososData('areaContaminada', text)}
            />
          </View>
        </View>
      </View>

      {/* PESSOAS AFETADAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pessoas Afetadas</Text>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Nº Contaminados</Text>
            <TextInput
              style={styles.input}
              placeholder="Pessoas com exposição física"
              value={produtosPerigososData.numeroContaminados}
              onChangeText={(text) => updateProdutosPerigososData('numeroContaminados', text)}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Nº Evacuados</Text>
            <TextInput
              style={styles.input}
              placeholder="Pessoas retiradas"
              value={produtosPerigososData.numeroEvacuados}
              onChangeText={(text) => updateProdutosPerigososData('numeroEvacuados', text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Nº Óbitos</Text>
            <TextInput
              style={styles.input}
              placeholder="Total de vítimas fatais"
              value={produtosPerigososData.numeroObitos}
              onChangeText={(text) => updateProdutosPerigososData('numeroObitos', text)}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Nº Feridos</Text>
            <TextInput
              style={styles.input}
              placeholder="Total de feridos"
              value={produtosPerigososData.numeroFeridos}
              onChangeText={(text) => updateProdutosPerigososData('numeroFeridos', text)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* AMBIENTE AFETADO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ambiente Afetado</Text>

        <View style={styles.switchGrid}>
          {[
            { key: 'solo', label: 'Solo' },
            { key: 'atmosfera', label: 'Atmosfera' },
            { key: 'mananciais', label: 'Mananciais' },
            { key: 'edificacoes', label: 'Edificações' },
          ].map((item) => (
            <View key={item.key} style={styles.switchRow}>
              <Text style={styles.switchLabel}>{item.label}</Text>
              <Switch
                value={produtosPerigososData.ambienteAfetado[item.key as keyof typeof produtosPerigososData.ambienteAfetado]}
                onValueChange={(value) => {
                  const updatedAmbiente = {
                    ...produtosPerigososData.ambienteAfetado,
                    [item.key]: value
                  };
                  updateProdutosPerigososData('ambienteAfetado', updatedAmbiente);
                }}
                trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
                thumbColor={produtosPerigososData.ambienteAfetado[item.key as keyof typeof produtosPerigososData.ambienteAfetado] ? SIOB_COLORS.white : '#f4f3f4'}
              />
            </View>
          ))}
        </View>
      </View>

      {/* AÇÕES REALIZADAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Realizadas</Text>

        <View style={styles.switchGrid}>
          {[
            { key: 'identificacao', label: 'Identificação' },
            { key: 'isolamento', label: 'Isolamento' },
            { key: 'contencao', label: 'Contenção' },
            { key: 'neutralizacao', label: 'Neutralização' },
            { key: 'descontaminacao', label: 'Descontaminação' },
            { key: 'resfriamentoVaso', label: 'Resfriamento de Vaso' },
          ].map((item) => (
            <View key={item.key} style={styles.switchRow}>
              <Text style={styles.switchLabel}>{item.label}</Text>
              <Switch
                value={produtosPerigososData.acoesRealizadas[item.key as keyof typeof produtosPerigososData.acoesRealizadas]}
                onValueChange={(value) => {
                  const updatedAcoes = {
                    ...produtosPerigososData.acoesRealizadas,
                    [item.key]: value
                  };
                  updateProdutosPerigososData('acoesRealizadas', updatedAcoes);
                }}
                trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
                thumbColor={produtosPerigososData.acoesRealizadas[item.key as keyof typeof produtosPerigososData.acoesRealizadas] ? SIOB_COLORS.white : '#f4f3f4'}
              />
            </View>
          ))}
        </View>
      </View>
    </>
  );

  // ✅ FORMULÁRIO DE GERENCIAMENTO
  const renderGerenciamentoForm = () => (
    <>
      {/* CABEÇALHO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Formulário de Gerenciamento (SCI-1 Briefing da Emergência)</Text>
      </View>

      {/* SITUAÇÃO E OBJETIVOS OPERACIONAIS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Situação e Objetivos Operacionais</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Situação Atual / Sumário dos Problemas</Text>
          <Text style={styles.fieldDescription}>Descreva a emergência, forças e fraquezas.</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva a situação atual da emergência..."
            value={gerenciamentoData.situacaoAtual}
            onChangeText={(text) => updateGerenciamentoData('situacaoAtual', text)}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Objetivos e Ações Implementadas/Planejadas</Text>
          <Text style={styles.fieldDescription}>Defina os objetivos (e.g., Confine, Resgate) e as próximas ações.</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva os objetivos e ações planejadas..."
            value={gerenciamentoData.objetivosAcoes}
            onChangeText={(text) => updateGerenciamentoData('objetivosAcoes', text)}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* FORÇA E RECURSOS OPERACIONAIS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Força e Recursos Operacionais</Text>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Nº BM Empregados</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={gerenciamentoData.numBMEmpregados}
              onChangeText={(text) => updateGerenciamentoData('numBMEmpregados', text)}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Efetivo Total</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={gerenciamentoData.efetivoTotal}
              onChangeText={(text) => updateGerenciamentoData('efetivoTotal', text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Nº Viaturas Empregadas</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={gerenciamentoData.numVtrsEmpregadas}
              onChangeText={(text) => updateGerenciamentoData('numVtrsEmpregadas', text)}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Total de VTRs</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={gerenciamentoData.totalVTRs}
              onChangeText={(text) => updateGerenciamentoData('totalVTRs', text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nº Embarcações</Text>
          <Text style={styles.fieldDescription}>Se aplicável</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={gerenciamentoData.numEmbarcacoes}
            onChangeText={(text) => updateGerenciamentoData('numEmbarcacoes', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Órgãos Envolvidos</Text>
          <Text style={styles.fieldDescription}>Ex: SAMU, PMPE, Defesa Civil</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Liste os órgãos envolvidos..."
            value={gerenciamentoData.orgaosEnvolvidos}
            onChangeText={(text) => updateGerenciamentoData('orgaosEnvolvidos', text)}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Recursos Adicionais Solicitados</Text>
          <Text style={styles.fieldDescription}>Descreva os recursos que ainda faltam ou foram pedidos</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva os recursos adicionais necessários..."
            value={gerenciamentoData.recursosAdicionais}
            onChangeText={(text) => updateGerenciamentoData('recursosAdicionais', text)}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    </>
  );

  // ✅ FORMULÁRIO DE PREVENÇÃO
  const renderPrevencaoForm = () => (
    <>
      {/* CABEÇALHO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Natureza 5: Prevenção</Text>
      </View>

      {/* DADOS E PÚBLICO DO EVENTO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados e Público do Evento</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Evento</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Boa Viagem"
            value={prevencaoData.nomeEvento}
            onChangeText={(text) => updatePrevencaoData('nomeEvento', text)}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Hora Chegada</Text>
            <TextInput
              style={styles.input}
              placeholder="--:--"
              value={prevencaoData.horaChegada}
              onChangeText={(text) => updatePrevencaoData('horaChegada', text)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Público Estimado</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 500 Pessoas"
            value={prevencaoData.publicoEstimado}
            onChangeText={(text) => updatePrevencaoData('publicoEstimado', text)}
            keyboardType="numeric"
          />
        </View>

        {/* EVENTO REGULARIZADO */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Evento Regularizado?</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => updatePrevencaoData('eventoRegularizado', 'sim')}
            >
              <View style={styles.radioCircle}>
                {prevencaoData.eventoRegularizado === 'sim' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioLabel}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => updatePrevencaoData('eventoRegularizado', 'nao')}
            >
              <View style={styles.radioCircle}>
                {prevencaoData.eventoRegularizado === 'nao' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioLabel}>Não</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Hora Início</Text>
            <TextInput
              style={styles.input}
              placeholder="--:--"
              value={prevencaoData.horaInicio}
              onChangeText={(text) => updatePrevencaoData('horaInicio', text)}
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Hora Saída</Text>
            <TextInput
              style={styles.input}
              placeholder="--:--"
              value={prevencaoData.horaSaida}
              onChangeText={(text) => updatePrevencaoData('horaSaida', text)}
            />
          </View>
        </View>
      </View>

      {/* TIPO DE ATIVIDADE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Atividade</Text>
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Informe"
            value={prevencaoData.tipoAtividade}
            onChangeText={(text) => updatePrevencaoData('tipoAtividade', text)}
          />
        </View>
      </View>

      {/* PREVENÇÃO AQUÁTICA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prevenção Aquática</Text>

        {[
          { key: 'prevencaoAquaticaAtivaReativa', label: 'Ativa e Reativa' },
          { key: 'prevencaoAquaticaOrlaMaritima', label: 'Prevenção em Orla Marítima' },
          { key: 'prevencaoAquaticaRio', label: 'Prevenção em Rio' },
        ].map((item) => (
          <View key={item.key} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={prevencaoData[item.key as keyof typeof prevencaoData] as boolean}
              onValueChange={(value) => updatePrevencaoData(item.key, value)}
              trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
              thumbColor={prevencaoData[item.key as keyof typeof prevencaoData] ? SIOB_COLORS.white : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      {/* SERVIÇOS REALIZADOS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Serviços Realizados</Text>

        {[
          { key: 'servicoOrientacaoVerbal', label: 'Orientação verbal de segurança' },
          { key: 'servicoSinalizacaoAreaRisco', label: 'Sinalização de área de risco' },
          { key: 'servicoIsolamentoAreaRisco', label: 'Isolamento de área de risco' },
        ].map((item) => (
          <View key={item.key} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={prevencaoData[item.key as keyof typeof prevencaoData] as boolean}
              onValueChange={(value) => updatePrevencaoData(item.key, value)}
              trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
              thumbColor={prevencaoData[item.key as keyof typeof prevencaoData] ? SIOB_COLORS.white : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      {/* STATUS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Informe"
            value={prevencaoData.status}
            onChangeText={(text) => updatePrevencaoData('status', text)}
          />
        </View>
      </View>
    </>
  );

  // ✅ FORMULÁRIO DE ATIVIDADE COMUNITÁRIA
  const renderAtividadeComunitariaForm = () => (
    <>
      {/* CABEÇALHO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Natureza 6: Atividade Comunitária</Text>
      </View>

      {/* DADOS E PÚBLICO DO EVENTO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados e Público do Evento</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Evento</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Ação cívico-social / Palestra"
            value={atividadeComunitariaData.nomeEvento}
            onChangeText={(text) => updateAtividadeComunitariaData('nomeEvento', text)}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Hora Chegada</Text>
            <TextInput
              style={styles.input}
              placeholder="--:--"
              value={atividadeComunitariaData.horaChegada}
              onChangeText={(text) => updateAtividadeComunitariaData('horaChegada', text)}
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Hora Início</Text>
            <TextInput
              style={styles.input}
              placeholder="--:--"
              value={atividadeComunitariaData.horaInicio}
              onChangeText={(text) => updateAtividadeComunitariaData('horaInicio', text)}
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Hora Saída</Text>
            <TextInput
              style={styles.input}
              placeholder="--:--"
              value={atividadeComunitariaData.horaSaida}
              onChangeText={(text) => updateAtividadeComunitariaData('horaSaida', text)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Público Estimado</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 500 pessoas"
            value={atividadeComunitariaData.publicoEstimado}
            onChangeText={(text) => updateAtividadeComunitariaData('publicoEstimado', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Público Presente</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 200 pessoas"
            value={atividadeComunitariaData.publicoPresente}
            onChangeText={(text) => updateAtividadeComunitariaData('publicoPresente', text)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* GRUPO DA ATIVIDADE */}
      {atividadeComunitariaData.grupoInteracaoEducativa && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Específicas - Subgrupo 2: Interação Educativa</Text>

          {[
            { key: 'subgrupoDemonstracao', label: 'Demonstração' },
            { key: 'subgrupoPalestra', label: 'Palestra' },
            { key: 'subgrupoTreinamento', label: 'Treinamento' },
          ].map((item) => (
            <View key={item.key} style={styles.switchRow}>
              <Text style={styles.switchLabel}>{item.label}</Text>
              <Switch
                value={atividadeComunitariaData[item.key as keyof typeof atividadeComunitariaData] as boolean}
                onValueChange={(value) => updateAtividadeComunitariaData(item.key, value)}
                trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
                thumbColor={atividadeComunitariaData[item.key as keyof typeof atividadeComunitariaData] ? SIOB_COLORS.white : '#f4f3f4'}
              />
            </View>
          ))}
        </View>
      )}
    </>
  );

  // ✅ FORMULÁRIO DE SALVAMENTO
  const renderSalvamentoForm = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Natureza 3: Salvamento</Text>

        <Text style={styles.groupTitle}>
          Grupo da Ocorrência (O que está envolvido no evento?)
        </Text>

        {[
          { key: 'eventoComPessoa', label: 'Evento com Pessoa' },
          { key: 'eventoComAnimal', label: 'Evento com Animal' },
          { key: 'eventoComObjeto', label: 'Evento com Objeto' },
          { key: 'eventoComCadaver', label: 'Evento com Cadáver' },
          { key: 'eventoComTransporte', label: 'Evento com Meio de Transporte' },
          { key: 'eventoComArvore', label: 'Evento com Árvore' },
          { key: 'eventoOutro', label: 'Outro' },
        ].map((item) => (
          <View key={item.key} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={salvamentoData[item.key as keyof typeof salvamentoData] as boolean}
              onValueChange={(value) => updateSalvamentoData(item.key, value)}
              trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
              thumbColor={salvamentoData[item.key as keyof typeof salvamentoData] ? SIOB_COLORS.white : '#f4f3f4'}
            />
          </View>
        ))}

        {salvamentoData.eventoOutro && (
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              placeholder="Especifique o tipo de evento"
              value={salvamentoData.eventoOutroEspecifico}
              onChangeText={(text) => updateSalvamentoData('eventoOutroEspecifico', text)}
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Salvamento</Text>

        <View style={styles.tipoContainer}>
          <View style={styles.tipoRow}>
            <TouchableOpacity
              style={[
                styles.tipoButton,
                salvamentoData.tipoAltura && styles.tipoButtonActive
              ]}
              onPress={() => updateSalvamentoData('tipoAltura', !salvamentoData.tipoAltura)}
            >
              <Text style={[
                styles.tipoButtonText,
                salvamentoData.tipoAltura && styles.tipoButtonTextActive
              ]}>
                Em Altura
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tipoButton,
                salvamentoData.tipoAquatico && styles.tipoButtonActive
              ]}
              onPress={() => updateSalvamentoData('tipoAquatico', !salvamentoData.tipoAquatico)}
            >
              <Text style={[
                styles.tipoButtonText,
                salvamentoData.tipoAquatico && styles.tipoButtonTextActive
              ]}>
                Aquático
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipoRow}>
            <TouchableOpacity
              style={[
                styles.tipoButton,
                salvamentoData.tipoVeicular && styles.tipoButtonActive
              ]}
              onPress={() => updateSalvamentoData('tipoVeicular', !salvamentoData.tipoVeicular)}
            >
              <Text style={[
                styles.tipoButtonText,
                salvamentoData.tipoVeicular && styles.tipoButtonTextActive
              ]}>
                Veicular
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tipoButton,
                salvamentoData.tipoEspacoConfinado && styles.tipoButtonActive
              ]}
              onPress={() => updateSalvamentoData('tipoEspacoConfinado', !salvamentoData.tipoEspacoConfinado)}
            >
              <Text style={[
                styles.tipoButtonText,
                salvamentoData.tipoEspacoConfinado && styles.tipoButtonTextActive
              ]}>
                Espaço Confinado
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhes Operacionais</Text>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Vítimas Socorridas</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={salvamentoData.vitimasSocorridas}
              onChangeText={(text) => updateSalvamentoData('vitimasSocorridas', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Vítimas Fatais</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={salvamentoData.vitimasFatais}
              onChangeText={(text) => updateSalvamentoData('vitimasFatais', text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tempo de Resgate (hh:mm)</Text>
          <TextInput
            style={styles.input}
            placeholder="01:30"
            value={salvamentoData.tempoResgate}
            onChangeText={(text) => updateSalvamentoData('tempoResgate', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Equipamentos Usados</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: Corda, macas, cilindros..."
            value={salvamentoData.equipamentosUsados}
            onChangeText={(text) => updateSalvamentoData('equipamentosUsados', text)}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Realizadas</Text>

        {[
          { key: 'acaoRetiradaVitima', label: 'Retirada de vítima' },
          { key: 'acaoEstabilizacaoVeiculo', label: 'Estabilização de veículo' },
          { key: 'acaoAtendimentoPreHospitalar', label: 'Atendimento Pré-Hospitalar' },
          { key: 'acaoOutros', label: 'Outros' },
        ].map((item) => (
          <View key={item.key} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={salvamentoData[item.key as keyof typeof salvamentoData] as boolean}
              onValueChange={(value) => updateSalvamentoData(item.key, value)}
              trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
              thumbColor={salvamentoData[item.key as keyof typeof salvamentoData] ? SIOB_COLORS.white : '#f4f3f4'}
            />
          </View>
        ))}

        {salvamentoData.acaoOutros && (
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              placeholder="Especifique outras ações realizadas"
              value={salvamentoData.acaoOutrosEspecifico}
              onChangeText={(text) => updateSalvamentoData('acaoOutrosEspecifico', text)}
            />
          </View>
        )}
      </View>
    </>
  );

  // ✅ FORMULÁRIO DE INCÊNDIO
  const renderIncendioForm = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Natureza 2: Incêndio</Text>

        {/* Grupo do Incêndio */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Grupo do Incêndio</Text>
          <View style={styles.radioGroupColumn}>
            {[
              { label: 'Incêndio em Edificação', value: 'edificacao' },
              { label: 'Incêndio em Meio de Transporte', value: 'transporte' },
              { label: 'Incêndio em Vegetação', value: 'vegetacao' },
              { label: 'Incêndio em Área de Descarte', value: 'descarte' },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.radioOptionColumn}
                onPress={() => updateIncendioData('grupoIncendio', item.value)}
              >
                <View style={styles.radioCircle}>
                  {incendioData.grupoIncendio === item.value && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabelColumn}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Detalhes Operacionais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhes Operacionais</Text>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Tempo de Extinção (hh:mm)</Text>
            <TextInput
              style={styles.input}
              placeholder="01:30"
              value={incendioData.tempoExtincao}
              onChangeText={(text) => updateIncendioData('tempoExtincao', text)}
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Tempo de Rescaldo (hh:mm)</Text>
            <TextInput
              style={styles.input}
              placeholder="00:45"
              value={incendioData.tempoRescaldo}
              onChangeText={(text) => updateIncendioData('tempoRescaldo', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Consumo de Água (litros)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={incendioData.consumoAgua}
              onChangeText={(text) => updateIncendioData('consumoAgua', text)}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Consumo de LGE/EFE (litros)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={incendioData.consumoLGE}
              onChangeText={(text) => updateIncendioData('consumoLGE', text)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Ações Realizadas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Realizadas</Text>

        {[
          { key: 'extincao', label: 'Extinção de incêndio' },
          { key: 'rescaldo', label: 'Rescaldo' },
          { key: 'ventilacao', label: 'Ventilação' },
          { key: 'resfriamento', label: 'Resfriamento' },
        ].map((item) => (
          <View key={item.key} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={incendioData.acoesRealizadas[item.key as keyof typeof incendioData.acoesRealizadas]}
              onValueChange={(value) => {
                const updatedAcoes = {
                  ...incendioData.acoesRealizadas,
                  [item.key]: value
                };
                updateIncendioData('acoesRealizadas', updatedAcoes);
              }}
              trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
              thumbColor={incendioData.acoesRealizadas[item.key as keyof typeof incendioData.acoesRealizadas] ? SIOB_COLORS.white : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      {/* Recursos Hídricos Utilizados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recursos Hídricos Utilizados</Text>

        {[
          { key: 'hidranteUrbano', label: 'Hidrante urbano' },
          { key: 'aguaTransportada', label: 'Água transportada' },
          { key: 'rio', label: 'Rio' },
          { key: 'piscina', label: 'Piscina' },
        ].map((item) => (
          <View key={item.key} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={incendioData.recursosHidricos[item.key as keyof typeof incendioData.recursosHidricos]}
              onValueChange={(value) => {
                const updatedRecursos = {
                  ...incendioData.recursosHidricos,
                  [item.key]: value
                };
                updateIncendioData('recursosHidricos', updatedRecursos);
              }}
              trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
              thumbColor={incendioData.recursosHidricos[item.key as keyof typeof incendioData.recursosHidricos] ? SIOB_COLORS.white : '#f4f3f4'}
            />
          </View>
        ))}
      </View>
    </>
  );

  // ✅ FORMULÁRIO DE ATENDIMENTO PRÉ-HOSPITALAR
  const renderAtendimentoPreHospitalarForm = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Natureza I: Atendimento Pré-Hospitalar (APH)</Text>
        <Text style={styles.groupTitle}>Qualificação da Vítima</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome da Vítima</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={aphData.nomeVitima}
            onChangeText={(text) => updateAphData('nomeVitima', text)}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Idade</Text>
            <TextInput
              style={styles.input}
              placeholder="Idade"
              value={aphData.idade}
              onChangeText={(text) => updateAphData('idade', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Sexo</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe"
              value={aphData.sexo}
              onChangeText={(text) => updateAphData('sexo', text)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bombeiro em Serviço?</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe"
            value={aphData.bombeiroServico}
            onChangeText={(text) => updateAphData('bombeiroServico', text)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escala de Coma de Glasgow e Sinais Vitais</Text>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Abertura Ocular (09b)</Text>
            <TextInput
              style={styles.input}
              placeholder="Máx. 4"
              value={aphData.aberturaOcular}
              onChangeText={(text) => updateAphData('aberturaOcular', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Pressão Arterial (09g)</Text>
            <TextInput
              style={styles.input}
              placeholder="mmHg (Ex: 120x80)"
              value={aphData.pressaoArterial}
              onChangeText={(text) => updateAphData('pressaoArterial', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Resposta Verbal (09c)</Text>
            <TextInput
              style={styles.input}
              placeholder="Máx. 5"
              value={aphData.respostaVerbal}
              onChangeText={(text) => updateAphData('respostaVerbal', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Frequência Cardíaca (09g)</Text>
            <TextInput
              style={styles.input}
              placeholder="BPM"
              value={aphData.frequenciaCardiaca}
              onChangeText={(text) => updateAphData('frequenciaCardiaca', text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Resposta Motora (09d)</Text>
            <TextInput
              style={styles.input}
              placeholder="Máx. 6"
              value={aphData.respostaMotora}
              onChangeText={(text) => updateAphData('respostaMotora', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Frequência Respiratória (09g)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ipm"
              value={aphData.frequenciaRespiratoria}
              onChangeText={(text) => updateAphData('frequenciaRespiratoria', text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Total Glasgow (09f)</Text>
            <TextInput
              style={styles.input}
              placeholder="Total"
              value={aphData.totalGlasgow}
              onChangeText={(text) => updateAphData('totalGlasgow', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Temperatura (09g)</Text>
            <TextInput
              style={styles.input}
              placeholder="°C (Ex: 36.5)"
              value={aphData.temperatura}
              onChangeText={(text) => updateAphData('temperatura', text)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Realizadas</Text>

        {[
          { key: 'rcp', label: 'RCP' },
          { key: 'contencaoHemorragia', label: 'Contenção de Hemorragia' },
          { key: 'imobilizacao', label: 'Imobilização' },
          { key: 'desencarceramento', label: 'Desencarceramento' },
          { key: 'oxigenoterapia', label: 'Oxigenoterapia' },
          { key: 'ventilacaoAssistida', label: 'Ventilação Assistida' },
        ].map((item) => (
          <View key={item.key} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={aphData[item.key as keyof typeof aphData] as boolean}
              onValueChange={(value) => updateAphData(item.key, value)}
              trackColor={{ false: '#767577', true: SIOB_COLORS.primary }}
              thumbColor={aphData[item.key as keyof typeof aphData] ? SIOB_COLORS.white : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destino da Vítima</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Destino</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe"
            value={aphData.destino}
            onChangeText={(text) => updateAphData('destino', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Hospital / Órgão Competente</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Hospital, PM, PC, etc."
            value={aphData.hospitalOrgao}
            onChangeText={(text) => updateAphData('hospitalOrgao', text)}
          />
        </View>
      </View>
    </>
  );

  const renderFormByNatureza = () => {
    switch (natureza) {
      case 'Salvamento':
        return renderSalvamentoForm();
      case 'Atendimento pré-hospitalar':
      case 'Atendimento Pré-Hospitalar':
        return renderAtendimentoPreHospitalarForm();
      case 'Atividade Comunitária':
        return renderAtividadeComunitariaForm();
      case 'Prevenção':
        return renderPrevencaoForm();
      case 'Formulário de Gerenciamento':
      case 'Gerenciamento':
        return renderGerenciamentoForm();
      case 'Produto perigoso':
      case 'Produtos Perigosos':
        return renderProdutosPerigososForm();
      case 'Incêndio':
        return renderIncendioForm(); // ✅ FORMULÁRIO DE INCÊNDIO ADICIONADO
      default:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Natureza: {natureza}</Text>
            <Text style={styles.label}>Formulário específico para {natureza}</Text>
          </View>
        );
    }
  };

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

          <Text style={styles.headerTitle}>Detalhes da Natureza</Text>

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
              Editando Ocorrência #{ocorrenciaId}
            </Text>
            <Text style={styles.stepIndicator}>Etapa 2 de 2: Detalhes da Natureza</Text>
          </View>

          {/* Formulário específico baseado na natureza */}
          {renderFormByNatureza()}

          {/* BOTÕES DE AÇÃO */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => router.push('/NovaOcorrenciaScreen')}
            >
              <MaterialIcons name="arrow-back" size={16} color={SIOB_COLORS.text} />
              <Text style={styles.cancelButtonText}>Voltar ao Básico</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
            >
              <MaterialIcons name="check-circle" size={16} color={SIOB_COLORS.white} />
              <Text style={styles.saveButtonText}>Atualizar e Finalizar</Text>
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
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: SIOB_COLORS.text,
    marginBottom: 12,
    marginTop: 8,
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
  fieldDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  // Estilos para radio buttons
  radioGroupColumn: {
    marginTop: 8,
  },
  radioOptionColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: SIOB_COLORS.border,
  },
  radioLabelColumn: {
    fontSize: 14,
    color: SIOB_COLORS.text,
    flex: 1,
    flexWrap: 'wrap',
  },

  radioGroup: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SIOB_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SIOB_COLORS.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: SIOB_COLORS.text,
  },
  // Estilos para Tipo de Salvamento
  tipoContainer: {
    gap: 12,
  },
  tipoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tipoButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: SIOB_COLORS.border,
    backgroundColor: SIOB_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoButtonActive: {
    borderColor: SIOB_COLORS.primary,
    backgroundColor: SIOB_COLORS.primary,
  },
  tipoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: SIOB_COLORS.text,
    textAlign: 'center',
  },
  tipoButtonTextActive: {
    color: SIOB_COLORS.white,
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
  switchGrid: {
    // Estilo para grid de switches
  },
  divider: {
    height: 1,
    backgroundColor: SIOB_COLORS.border,
    marginVertical: 16,
  },
  // ESTILOS MELHORADOS PARA OS BOTÕES
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  cancelButton: {
    backgroundColor: SIOB_COLORS.white,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
  },
  saveButton: {
    backgroundColor: SIOB_COLORS.primary,
  },
  cancelButtonText: {
    color: SIOB_COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButtonText: {
    color: SIOB_COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});