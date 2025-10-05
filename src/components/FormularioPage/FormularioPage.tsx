/**
 * @file FormularioPage.tsx
 * @description Componente "container" ou "inteligente". Gerencia o estado
 * e a lógica para o fluxo de criação/edição de ocorrências.
 */

//========== Imports =================
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormularioBasico from './FormularioBasico';
import './FormularioPage.css'; 

// 1. IMPORTE A IMAGEM DO BRASÃO AQUI
import brasaoLogo from '../../assets/brasao.cbm.pe.png'; // Verifique se o caminho e o nome estão corretos

const FormularioPage = () => {
  //========== Hooks ===============
  // Hook para ler parâmetros da URL (ex: ID da ocorrência)
  const { id } = useParams<{ id: string }>();
  // Hook para controlar a navegação entre as páginas
  const navigate = useNavigate();

  //================= State ===============
  // Objeto de estado único para armazenar todos os dados do formulário
  const [formData, setFormData] = useState({
    pontoBase: '', viaturaTipo: '', viaturaOrdem: '', numAviso: '', dataAviso: '',
    horaRecebimento: '', formaAcionamento: '', situacaoOcorrencia: '', motivoNaoAtendida: '', outroMotivoNaoAtendida: '',
    localAcionamento: '', rua: '', numero: '', aptoSala: '', bairro: '', telefone: '', municipio: '', uf: 'PE', areaOBM: 'S', outraUF: '', coordenadas: '', codigoLocal: '', referencia: '',

    nomeSolicitante: '', cpfRg: '', orgaoExpedidor: '', idadeSolicitante: '', sexoSolicitante: '', contatoTelefonico: '',
    horarioSaida: '', horarioNoLocal: '', horarioSaidaLocal: '', horarioChegadaDestino: '', horarioRetornoQuartel: '', hodometroSaida: '', hodometroLocal: '', primeiraVtrPrefixo: '', primeiraVtrPlaca: '',

    apoio: { celpe: false, samu: false, compesa: false, defesaCivil: false, orgaoAmbiental: false, pmpe: false, prf: false, guardaDeTransitoMunicipal: false, ffaa: false, outro: false, outroDesc: '' },

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

  /* ========================= Handlers (Manipuladores de Eventos) ===================== /*
   * Handler genérico e robusto para todos os inputs.
   * Suporta dados aninhados em até 3 níveis.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const parts = name.split('.');

    if (parts.length === 3) {
      const [key, subkey, indexStr] = parts;
      const index = parseInt(indexStr, 10);
      setFormData(prev => {
        const newArray = [...(prev as any)[key][subkey]];
        newArray[index] = finalValue;
        return { ...prev, [key]: { ...(prev as any)[key], [subkey]: newArray } };
      });
    } else if (parts.length === 2) {
      const [key, subkey] = parts;
      setFormData(prev => ({ ...prev, [key]: { ...(prev as any)[key], [subkey]: finalValue } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  /* =================== Handler para o botão 'Avançar' ============= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados da ocorrência:", formData);
    alert("Próxima etapa! (Verifique o console)");
  };

  /* ================== Handler para o botão 'Cancelar' ============== */
  const handleCancel = () => {
    navigate('/ocorrencias');
  };

  /* ================ Lógica de Renderização ================== */
  const isEditing = Boolean(id);
  const pageTitle = isEditing ? `Editando Ocorrência: #${id}` : 'Nova Ocorrência';
  const pageSubtitle = 'Registre uma nova ocorrência no sistema';

    return (
    <div className="page-container">
      {/* O <header> foi movido para DENTRO do novo card unificado */}
      <div className="unified-card"> 
            <header className="page-header">
            {/* O título e subtítulo ficam na div .page-title */}
            <div className="page-title">
              <h2>{pageTitle}</h2>
              <p>{pageSubtitle}</p>
            </div>

            {/* A logo agora é um "irmão" do .page-title, diretamente dentro do header */}
            <img src={brasaoLogo} alt="Brasão CBMPE" className="header-logo" />
          </header>

        {/* O FormularioBasico agora é renderizado logo abaixo do header, dentro do mesmo card */}
        <FormularioBasico 
          formData={formData} 
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </div>
    </div>
  );
};


export default FormularioPage;
