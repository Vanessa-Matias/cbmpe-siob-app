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

  // ===== HANDLE CHANGE GENÉRICO =====
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      const [key, subkey] = name.split('.');
      if (subkey) {
        setFormData(prev => ({
          ...prev,
          [key]: { ...(prev as any)[key], [subkey]: checked }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
