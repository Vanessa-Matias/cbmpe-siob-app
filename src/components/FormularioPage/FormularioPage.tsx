/**
 * @file FormularioPage.tsx
 * @description Página que serve como container para o fluxo de criação ou edição de ocorrências.
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FormularioBasico from './FormularioBasico';
import './FormularioPage.css'; 

const FormularioPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const pageTitle = isEditing ? `Editando Ocorrência: #${id}` : 'Nova Ocorrência';
  const pageSubtitle = isEditing
    ? `Altere os dados necessários da ocorrência`
    : 'Registre uma nova ocorrência no sistema';

  // ===== ESTADO CENTRALIZADO =====
  const [formData, setFormData] = useState({
    pontoBase: '', viaturaTipo: '', viaturaOrdem: '', numAviso: '', dataAviso: '',

    horaRecebimento: '', formaAcionamento: '', situacaoOcorrencia: '', motivoNaoAtendida: '', outroMotivoNaoAtendida: '',

    localAcionamento: '', rua: '', numero: '', aptoSala: '', bairro: '', telefone: '', municipio: '', uf: 'PE', areaOBM: 'S', outraUF: '', coordenadas: '', codigoLocal: '', referencia: '',

    nomeSolicitante: '', cpfRg: '', orgaoExpedidor: '', idadeSolicitante: '', sexoSolicitante: '', contatoTelefonico: '',

    horarioSaida: '', horarioNoLocal: '', horarioSaidaLocal: '', horarioChegadaDestino: '', horarioRetornoQuartel: '', hodometroSaida: '', hodometroLocal: '', primeiraVtrPrefixo: '', primeiraVtrPlaca: '',

    apoio: { celpe: false, samu: false, compesa: false, defesaCivil: false, orgaoAmbiental: false, pmpe: false, prf: false, guardaMunicipal: false, ffaa: false, outro: false, outroDesc: '' },
    viatura1: '', guarnicao1: '', viatura2: '', guarnicao2: '', viatura3: '', guarnicao3: '',

    historico: '',

    dificuldades: { tempoDeslocamento: false, obmProximaAtendimento: false, faltaIncorrecaoDados: false, obmSemViatura: false, faltaSinalizacao: false, transitoIntenso: false, areaDificilAcesso: false, paneEquipamento: false, paneViatura: false, faltaMaterial: false, naoHouve: false, outro: false },
    eventoNaturezaInicial: '',

    formulariosPreenchidos: { atdPreHospitalar: false, salvamento: false, atividadeComunitaria: false, prevencao: false, formularioGerenciamento: false, produtoPerigoso: false, incendio: false, outroRelatorio: false, outroRelatorioEspec: '' },

    qtdTotalVitimas: '', feridas: '', fatais: '', ilesas: '', desaparecidas: '',
    veiculosEnvolvidos: 'NAO',
    veiculo1: { modelo: '', cor: '', placa: '', estado: '', nomeCondutor: '', rgCpfCondutor: '', orgaoExpCondutor: '' },
    veiculo2: { modelo: '', cor: '', placa: '', estado: '', nomeCondutor: '', rgCpfCondutor: '', orgaoExpCondutor: '' },

    guarnicaoEmpenhada: { postoGrad: '', matriculaCmt: '', nomeGuerraCmt: '', vistoDivisao: '', componentes: ['', '', '', '', '', ''] }
  });

  // ===== HANDLE CHANGE GENÉRICO (VERSÃO FINAL E ROBUSTA) =====
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;
  const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
  const parts = name.split('.');

  // CASO 1: Três níveis de profundidade (ex: guarnicaoEmpenhada.componentes.0)
  // Este bloco é específico para atualizar um item dentro de um array aninhado.
  if (parts.length === 3) {
    const [key, subkey, indexStr] = parts;
    const index = parseInt(indexStr, 10);

    setFormData(prev => {
      // Cria uma cópia do array que queremos modificar
      const newArray = [...(prev as any)[key][subkey]];
      // Atualiza apenas o elemento no índice correto
      newArray[index] = finalValue;

      // Retorna o novo estado com o array atualizado
      return {
        ...prev,
        [key]: {
          ...(prev as any)[key],
          [subkey]: newArray
        }
      };
    });

  // CASO 2: Dois níveis de profundidade (ex: veiculo1.modelo)
  } else if (parts.length === 2) {
    const [key, subkey] = parts;
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...(prev as any)[key],
        [subkey]: finalValue
      }
    }));
    
  // CASO 3: Nível único (ex: pontoBase)
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  }
};
  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-title">
          <h2>{pageTitle}</h2>
          <p>{pageSubtitle}</p>
        </div>
      </header>

      <FormularioBasico formData={formData} handleChange={handleChange} />
    </div>
  );
};

export default FormularioPage;
