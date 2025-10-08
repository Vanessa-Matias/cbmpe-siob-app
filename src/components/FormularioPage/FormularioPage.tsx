/**
 * @file FormularioPage.tsx
 * @description Componente "container" ou "inteligente". Gerencia o estado
 * e a lógica para o fluxo de criação/edição de ocorrências.
 */

//========== Imports =================
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormularioBasico from './FormularioBasico';
import FormularioIncendio from './FormularioIncendio';
import './FormularioPage.css'; 

// 1.  IMAGEM DO BRASÃO AQUI
import brasaoLogo from '../../assets/brasao.cbm.pe.png'; // Verifique se o caminho e o nome estão corretos

const FormularioPage = () => {
  //========== Hooks ===============
  // Hook para ler parâmetros da URL (ex: ID da ocorrência)
  const { id } = useParams<{ id: string }>();
  // Hook para controlar a navegação entre as páginas
  const navigate = useNavigate();

  // Estado para controlar a etapa do formulário (1 = Básico, 2 = Específico)
  const [step, setStep] = useState(1);

  //================= State ===============
  const [formData, setFormData] = useState({
    // --- Dados do Formulário Básico (já existentes) ---
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
    guarnicaoEmpenhada: { postoGrad: '', matriculaCmt: '', nomeGuerraCmt: '', vistoDivisao: '', componentes: ['', '', '', '', '', ''] },

    // Objeto para armazenar os dados do formulário de incêndio
    incendio: {
      grupo: '',
      operacao: { tempoExtincao: '', tempoRescaldo: '', consumoAgua: '', consumoLGE: '' },
      acoes: { extincao: false, rescaldo: false, ventilacao: false, resfriamento: false /* ...outras acoes */ },
      recursos: { hidranteUrbano: false, aguaTransportada: false, rio: false, piscina: false /* ...outros recursos */ }
    }
  });

  /* ========================= Handlers (Manipuladores de Eventos) ===================== /*
   * Handler genérico e robusto para todos os inputs.
   * Suporta dados aninhados em até 3 níveis.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
  const parts = name.split('.');

  setFormData(prev => {
    // Nível 1: Atualiza campos simples como 'rua'
    if (parts.length === 1) {
      return { ...prev, [parts[0]]: finalValue };
    }

    // Nível 2: Atualiza campos em objetos como 'incendio.grupo'
    if (parts.length === 2) {
      const [key, subkey] = parts;
      return {
        ...prev,
        [key]: {
          ...(prev as any)[key],
          [subkey]: finalValue,
        },
      };
    }

    // Nível 3: Lida com objetos aninhados E arrays
    if (parts.length === 3) {
      const [key, subkey, field] = parts;
      const target = (prev as any)[key]?.[subkey];

      // NOVO: Verifica se o alvo é um array e o 'field' é um número de índice
      if (Array.isArray(target) && !isNaN(parseInt(field, 10))) {
        // Lógica antiga para ARRAYS (ex: guarnicao.componentes.0)
        const index = parseInt(field, 10);
        const newArray = [...target];
        newArray[index] = finalValue;
        return {
          ...prev,
          [key]: {
            ...(prev as any)[key],
            [subkey]: newArray,
          },
        };
      } else {
        // Lógica NOVA para OBJETOS ANINHADOS (ex: incendio.operacao.tempoExtincao)
        return {
          ...prev,
          [key]: {
            ...(prev as any)[key],
            [subkey]: {
              ...((prev as any)[key]?.[subkey] || {}),
              [field]: finalValue,
            },
          },
        };
      }
    }

    return prev; // Retorna o estado anterior se o nome não for reconhecido
  });
};

  /* ================================= Lógica de etapas no handleSubmit========================*/
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Se estamos na etapa 1 (Básico), apenas avançamos para a etapa 2
      console.log("Dados do Formulário Básico:", formData);
      alert("Formulário Básico salvo! Preencha agora os detalhes do incêndio.");
      setStep(2); // Muda para a próxima etapa
    } else {
      // Se estamos na etapa 2 (Incêndio), finalizamos a ocorrência
      console.log("DADOS FINAIS DA OCORRÊNCIA:", formData);
      alert("Ocorrência de Incêndio registrada com sucesso!");
      navigate('/ocorrencias'); // Navega para a lista de ocorrências
    }
  };

  const handleCancel = () => {
    navigate('/ocorrencias');
  };


  /* ================ Lógica de Renderização ================== */
  const isEditing = Boolean(id);
  const pageTitle = isEditing ? `Editando Ocorrência: #${id}` : 'Nova Ocorrência';
  const pageSubtitle = step === 1 ? 'Etapa 1 de 2: Formulário Básico' : 'Etapa 2 de 2: Detalhes do Incêndio';
  const submitButtonText = step === 1 ? 'Avançar' : 'Finalizar Ocorrência';

  return (
    <div className="page-container">
      <div className="unified-card"> 
        <header className="page-header">
          <div className="page-title">
            <h2>{pageTitle}</h2>
            <p>{pageSubtitle}</p>
          </div>
          <img src={brasaoLogo} alt="Brasão CBMPE" className="header-logo" />
        </header>

        {/* NOVO: Lógica para renderizar o formulário correto com base na etapa */}
        {step === 1 && (
          <FormularioBasico 
            formData={formData} 
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            submitText={submitButtonText} 
          />
        )}

        {step === 2 && (
          <FormularioIncendio
            formData={formData} 
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            // O botão "Cancelar" da etapa 2 volta para a etapa 1
            handleCancel={() => setStep(1)}
            submitText={submitButtonText}
          />
        )}
      </div>
    </div>
  );
};

export default FormularioPage;
