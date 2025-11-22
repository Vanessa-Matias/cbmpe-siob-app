import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useOccurrence } from '../contexts/OccurrenceContext';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormSwitch from './FormSwitch';

const FormProdutosPerigosos = () => {
  const { occurrence, updateOccurrence } = useOccurrence();
  const [formData, setFormData] = useState({
    // Identificação do Produto
    nomeProduto: occurrence?.naturezaDetails?.produtosPerigosos?.nomeProduto || '',
    numeroONU: occurrence?.naturezaDetails?.produtosPerigosos?.numeroONU || '',
    classeRisco: occurrence?.naturezaDetails?.produtosPerigosos?.classeRisco || '',
    estadoFisico: occurrence?.naturezaDetails?.produtosPerigosos?.estadoFisico || '',
    tipoRecipiente: occurrence?.naturezaDetails?.produtosPerigosos?.tipoRecipiente || '',
    responsavelProduto: occurrence?.naturezaDetails?.produtosPerigosos?.responsavelProduto || '',
    cpfCnpj: occurrence?.naturezaDetails?.produtosPerigosos?.cpfCnpj || '',

    // Volume e Área Afetada
    vazamentoEstimado: occurrence?.naturezaDetails?.produtosPerigosos?.vazamentoEstimado || '',
    volumeRecipienteAfetado: occurrence?.naturezaDetails?.produtosPerigosos?.volumeRecipienteAfetado || '',
    areaIsolada: occurrence?.naturezaDetails?.produtosPerigosos?.areaIsolada || '',
    areaContaminada: occurrence?.naturezaDetails?.produtosPerigosos?.areaContaminada || '',

    // Pessoas Afetadas
    numeroContaminados: occurrence?.naturezaDetails?.produtosPerigosos?.numeroContaminados || '',
    numeroEvacuados: occurrence?.naturezaDetails?.produtosPerigosos?.numeroEvacuados || '',
    numeroObitos: occurrence?.naturezaDetails?.produtosPerigosos?.numeroObitos || '',
    numeroFeridos: occurrence?.naturezaDetails?.produtosPerigosos?.numeroFeridos || '',

    // Ambiente Afetado
    ambienteAfetado: occurrence?.naturezaDetails?.produtosPerigosos?.ambienteAfetado || {
      solo: false,
      atmosfera: false,
      mananciais: false,
      edificacoes: false,
    },

    // Ações Realizadas
    acoesRealizadas: occurrence?.naturezaDetails?.produtosPerigosos?.acoesRealizadas || {
      identificacao: false,
      isolamento: false,
      contencao: false,
      neutralizacao: false,
      descontaminacao: false,
      resfriamentoVaso: false,
    }
  });

  const handleInputChange = (field: string, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    // Atualiza o contexto
    updateOccurrence({
      naturezaDetails: {
        ...occurrence?.naturezaDetails,
        produtosPerigosos: updatedData
      }
    });
  };

  const handleAmbienteChange = (ambiente: string, value: boolean) => {
    const updatedAmbiente = { ...formData.ambienteAfetado, [ambiente]: value };
    handleInputChange('ambienteAfetado', updatedAmbiente);
  };

  const handleAcoesChange = (acao: string, value: boolean) => {
    const updatedAcoes = { ...formData.acoesRealizadas, [acao]: value };
    handleInputChange('acoesRealizadas', updatedAcoes);
  };

  const estadosFisicos = [
    { label: 'Selecione', value: '' },
    { label: 'Sólido', value: 'solido' },
    { label: 'Líquido', value: 'liquido' },
    { label: 'Gasoso', value: 'gasoso' },
  ];

  return (
    <ScrollView className="flex-1 p-4">
      {/* Identificação do Produto */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4 text-gray-800">
          Identificação do Produto
        </Text>

        <FormInput
          label="Nome do Produto"
          placeholder="Ex: GLP, Gasolina..."
          value={formData.nomeProduto}
          onChangeText={(value) => handleInputChange('nomeProduto', value)}
        />

        <FormInput
          label="Tipo de Recipiente"
          placeholder="Ex: Tambor, Tancagem"
          value={formData.tipoRecipiente}
          onChangeText={(value) => handleInputChange('tipoRecipiente', value)}
        />

        <View className="flex-row flex-wrap -mx-2">
          <View className="w-1/2 px-2">
            <FormInput
              label="Nº ONU"
              placeholder="Ex: 1075"
              value={formData.numeroONU}
              onChangeText={(value) => handleInputChange('numeroONU', value)}
              keyboardType="numeric"
            />
          </View>
          <View className="w-1/2 px-2">
            <FormInput
              label="Classe de Risco"
              placeholder="Ex: 2.1"
              value={formData.classeRisco}
              onChangeText={(value) => handleInputChange('classeRisco', value)}
            />
          </View>
        </View>

        <FormSelect
          label="Estado Físico"
          items={estadosFisicos}
          selectedValue={formData.estadoFisico}
          onValueChange={(value) => handleInputChange('estadoFisico', value)}
        />

        <FormInput
          label="Responsável pelo Produto (Nome/Empresa)"
          placeholder="Nome do Responsável ou Razão Social"
          value={formData.responsavelProduto}
          onChangeText={(value) => handleInputChange('responsavelProduto', value)}
        />

        <FormInput
          label="CPF/CNPJ"
          placeholder="00.000.000/0000-00"
          value={formData.cpfCnpj}
          onChangeText={(value) => handleInputChange('cpfCnpj', value)}
        />
      </View>

      {/* Volume, Área Afetada e Consequências */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4 text-gray-800">
          Volume, Área Afetada e Consequências
        </Text>

        <View className="flex-row flex-wrap -mx-2">
          <View className="w-1/2 px-2">
            <FormInput
              label="Vazamento Estimado"
              placeholder="Volume liberado"
              value={formData.vazamentoEstimado}
              onChangeText={(value) => handleInputChange('vazamentoEstimado', value)}
            />
          </View>
          <View className="w-1/2 px-2">
            <FormInput
              label="Volume Recipiente Afetado"
              placeholder="Volume total"
              value={formData.volumeRecipienteAfetado}
              onChangeText={(value) => handleInputChange('volumeRecipienteAfetado', value)}
            />
          </View>
        </View>

        <View className="flex-row flex-wrap -mx-2">
          <View className="w-1/2 px-2">
            <FormInput
              label="Área Isolada"
              placeholder="Tamanho da zona quente"
              value={formData.areaIsolada}
              onChangeText={(value) => handleInputChange('areaIsolada', value)}
            />
          </View>
          <View className="w-1/2 px-2">
            <FormInput
              label="Área Contaminada"
              placeholder="Área atingida pelo produto"
              value={formData.areaContaminada}
              onChangeText={(value) => handleInputChange('areaContaminada', value)}
            />
          </View>
        </View>
      </View>

      {/* Pessoas Afetadas */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4 text-gray-800">
          Pessoas Afetadas
        </Text>

        <View className="flex-row flex-wrap -mx-2">
          <View className="w-1/2 px-2">
            <FormInput
              label="Nº Contaminados"
              placeholder="Pessoas com exposição física"
              value={formData.numeroContaminados}
              onChangeText={(value) => handleInputChange('numeroContaminados', value)}
              keyboardType="numeric"
            />
          </View>
          <View className="w-1/2 px-2">
            <FormInput
              label="Nº Evacuados"
              placeholder="Pessoas retiradas"
              value={formData.numeroEvacuados}
              onChangeText={(value) => handleInputChange('numeroEvacuados', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View className="flex-row flex-wrap -mx-2">
          <View className="w-1/2 px-2">
            <FormInput
              label="Nº Óbitos"
              placeholder="Total de vítimas fatais"
              value={formData.numeroObitos}
              onChangeText={(value) => handleInputChange('numeroObitos', value)}
              keyboardType="numeric"
            />
          </View>
          <View className="w-1/2 px-2">
            <FormInput
              label="Nº Feridos"
              placeholder="Total de feridos"
              value={formData.numeroFeridos}
              onChangeText={(value) => handleInputChange('numeroFeridos', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Ambiente Afetado */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4 text-gray-800">
          Ambiente Afetado
        </Text>

        <View className="flex-row flex-wrap">
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Solo"
              value={formData.ambienteAfetado.solo}
              onValueChange={(value) => handleAmbienteChange('solo', value)}
            />
          </View>
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Atmosfera"
              value={formData.ambienteAfetado.atmosfera}
              onValueChange={(value) => handleAmbienteChange('atmosfera', value)}
            />
          </View>
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Mananciais"
              value={formData.ambienteAfetado.mananciais}
              onValueChange={(value) => handleAmbienteChange('mananciais', value)}
            />
          </View>
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Edificações"
              value={formData.ambienteAfetado.edificacoes}
              onValueChange={(value) => handleAmbienteChange('edificacoes', value)}
            />
          </View>
        </View>
      </View>

      {/* Ações Realizadas */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4 text-gray-800">
          Ações Realizadas
        </Text>

        <View className="flex-row flex-wrap">
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Identificação"
              value={formData.acoesRealizadas.identificacao}
              onValueChange={(value) => handleAcoesChange('identificacao', value)}
            />
          </View>
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Isolamento"
              value={formData.acoesRealizadas.isolamento}
              onValueChange={(value) => handleAcoesChange('isolamento', value)}
            />
          </View>
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Contenção"
              value={formData.acoesRealizadas.contencao}
              onValueChange={(value) => handleAcoesChange('contencao', value)}
            />
          </View>
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Neutralização"
              value={formData.acoesRealizadas.neutralizacao}
              onValueChange={(value) => handleAcoesChange('neutralizacao', value)}
            />
          </View>
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Descontaminação"
              value={formData.acoesRealizadas.descontaminacao}
              onValueChange={(value) => handleAcoesChange('descontaminacao', value)}
            />
          </View>
          <View className="w-1/2 mb-2">
            <FormSwitch
              label="Resfriamento de Vaso"
              value={formData.acoesRealizadas.resfriamentoVaso}
              onValueChange={(value) => handleAcoesChange('resfriamentoVaso', value)}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default FormProdutosPerigosos;