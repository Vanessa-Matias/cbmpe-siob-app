/**
 * @file FormularioPage.tsx
 * @description Lógica corrigida: Detecção flexível de natureza na edição.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import FormularioBasico from './FormularioBasico';
import FormularioIncendio from './FormularioIncendio';
import FormularioSalvamento from './FormularioSalvamento';
import FormularioAPH from './FormularioAPH';
import FormularioPrevencao from './FormularioPrevencao';
import FormularioGerenciamento from './FormularioGerenciamento';
import FormularioAtividadeComunitaria from './FormularioAtividadeComunitaria';
import FormularioProdutoPerigoso from './FormularioProdutoPerigoso';

import './FormularioPage.css';
import brasaoLogo from '../../assets/brasao.cbm.pe.png';
import { api } from '../../lib/api';

/* ---------------------------------------------------------------------
   Estado inicial do formulário
--------------------------------------------------------------------- */
const getInitialFormData = () => ({
  id: '', 
  numAviso: '',
  pontoBase: '',
  viaturaTipo: '',
  viaturaOrdem: '',
  dataAviso: new Date().toISOString().split('T')[0],
  situacao: 'PENDENTE',
  prioridade: 'MEDIA',
  endereco: { rua: '', numero: '', bairro: '', municipio: 'Recife', latitude: '', longitude: '', codigoLocal: '', referencia: '' },
  fotoOcorrencia: '',
  assinaturaDigital: '',
  formulariosPreenchidos: {
    atdPreHospitalar: false,
    incendio: false,
    salvamento: false,
    formularioGerenciamento: false,
    atividadeComunitaria: false,
    produtoPerigoso: false,
    prevencao: false,
    outroRelatorio: false,
  },
  incendio: { grupo: 'edificacao', operacao: { consumoAgua: 0 }, acoes: {}, recursos: {} },
  salvamento: { tipo: {}, acoes: {}, vitimas: {} },
  guarnicaoEmpenhada: { componentes: Array(6).fill(''), postoGrad: '', matriculaCmt: '', nomeGuerraCmt: '', vistoDivisao: '' },
  veiculo1: {},
  veiculo2: {},
  historico: '',
  qtdTotalVitimas: 0, feridas: 0, fatais: 0, ilesas: 0, desaparecidas: 0,
  co: '', ciods: '', numero193: '',
  veiculosEnvolvidos: 'NAO'
});

const FormularioPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>(getInitialFormData());
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeNature, setActiveNature] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  /* -----------------------------------------------------------------
     TRADUTOR REVERSO (CORRIGIDO PARA FLEXIBILIDADE)
  ----------------------------------------------------------------- */
  const adaptarParaFrontend = (dadosBack: any) => {
      const dataFormatada = dadosBack.data_acionamento ? String(dadosBack.data_acionamento).split('T')[0] : '';
      
      // Normaliza o tipo para comparação segura (Tudo maiúsculo)
      const tipoBack = (dadosBack.tipo || '').toUpperCase();

      return {
          ...getInitialFormData(), 
          id: dadosBack.id,
          
          numAviso: dadosBack.nr_aviso,
          pontoBase: dadosBack.ponto_base,
          viaturaTipo: dadosBack.viatura_tipo,
          viaturaOrdem: dadosBack.viatura_numero,
          dataAviso: dataFormatada,
          situacao: (dadosBack.status || 'PENDENTE').toLowerCase(),
          prioridade: dadosBack.prioridade === 'MEDIA' ? 'Média' : (dadosBack.prioridade || 'Média'),
          historico: dadosBack.historico_texto,
          
          co: dadosBack.cod_co,
          ciods: dadosBack.cod_ciods,
          numero193: dadosBack.cod_193,

          endereco: {
              rua: dadosBack.rua_avenida,
              numero: dadosBack.numero_local,
              bairro: dadosBack.bairro,
              municipio: dadosBack.municipio,
              referencia: dadosBack.ponto_referencia,
              latitude: dadosBack.latitude,
              longitude: dadosBack.longitude,
              codigoLocal: '' 
          },

          guarnicaoEmpenhada: {
              postoGrad: dadosBack.guarnicao_posto_grad,
              matriculaCmt: dadosBack.guarnicao_matricula,
              nomeGuerraCmt: dadosBack.guarnicao_nome_guerra,
              componentes: dadosBack.guarnicao_componentes || Array(6).fill(''),
              vistoDivisao: ''
          },

          qtdTotalVitimas: dadosBack.vitimas_total,
          feridas: dadosBack.vitimas_feridas,
          fatais: dadosBack.vitimas_fatais,
          ilesas: dadosBack.vitimas_ilesas,
          desaparecidas: dadosBack.vitimas_desaparecidas,

          veiculosEnvolvidos: dadosBack.veiculos_envolvidos === 'Nenhum' ? 'NAO' : 'SIM',
          
          // LÓGICA FLEXÍVEL DE DETECÇÃO DE NATUREZA
          formulariosPreenchidos: {
              incendio: tipoBack.includes('INCENDIO') || tipoBack.includes('INCÊNDIO'),
              salvamento: tipoBack.includes('SALVAMENTO') || tipoBack.includes('RESGATE'),
              atdPreHospitalar: tipoBack.includes('APH') || tipoBack.includes('PRE-HOSPITALAR'),
              prevencao: tipoBack.includes('PREVENCAO') || tipoBack.includes('PREVENÇÃO'),
              produtoPerigoso: tipoBack.includes('PERIGOSO'),
              atividadeComunitaria: tipoBack.includes('COMUNITARIA') || tipoBack.includes('COMUNITÁRIA'),
              formularioGerenciamento: tipoBack.includes('GERENCIAMENTO'),
              outroRelatorio: false
          }
      };
  };

  /* -----------------------------------------------------------------
     CARREGAMENTO
  ----------------------------------------------------------------- */
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      carregarDadosDaAPI(id);
    } else {
      setIsEditMode(false);
      setFormData(getInitialFormData());
      setStep(1);
    }
  }, [id]);

  const carregarDadosDaAPI = async (idOcorrencia: string) => {
      try {
          const response = await api.get(`/ocorrencias/${idOcorrencia}`);
          const dadosBrutos = response.data;
          
          const dadosAdaptados = adaptarParaFrontend(dadosBrutos);
          setFormData(dadosAdaptados);
          
          const markedNature = findMarkedNature(dadosAdaptados.formulariosPreenchidos);
          if(markedNature) setActiveNature(markedNature);

      } catch (error) {
          console.error("Erro ao carregar ocorrência:", error);
          alert("Erro ao carregar dados. Voltando para lista.");
          navigate('/ocorrencias');
      }
  }

  const findMarkedNature = (formularios: any) => {
    if (!formularios) return '';
    if (formularios.incendio) return 'incendio';
    if (formularios.salvamento) return 'salvamento';
    if (formularios.atdPreHospitalar) return 'atdPreHospitalar';
    if (formularios.prevencao) return 'prevencao';
    if (formularios.atividadeComunitaria) return 'atividadeComunitaria';
    if (formularios.formularioGerenciamento) return 'formularioGerenciamento';
    if (formularios.produtoPerigoso) return 'produtoPerigoso';
    return '';
  };

  /* -----------------------------------------------------------------
     HANDLERS
  ----------------------------------------------------------------- */
  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? e.target.checked : value;
    const keys = (name || '').split('.').filter(Boolean);

    setFormData((prev: any) => {
      const next = { ...prev };
      if (!name) return next;

      if (keys.length === 1) {
        next[keys[0]] = finalValue;
      } else {
        let cur = next;
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i];
          cur[k] = cur[k] ?? {};
          cur = cur[k];
        }
        cur[keys[keys.length - 1]] = finalValue;
      }

      if (keys[0] === 'formulariosPreenchidos') {
        const updatedNaturezas = { ...next.formulariosPreenchidos, [keys[1]]: finalValue };
        setActiveNature(findMarkedNature(updatedNaturezas));
      }

      return next;
    });
  };

  /* -----------------------------------------------------------------
     TRADUTOR (FRONTEND -> BACKEND DTO)
  ----------------------------------------------------------------- */
  const prepararDTO = (dados: any) => {
      return {
          tipo: activeNature ? activeNature.toUpperCase() : "OCORRENCIA_BASICA",
          prioridade: dados.prioridade === 'Média' ? 'MEDIA' : dados.prioridade.toUpperCase(),
          status: dados.situacao === 'pendente' ? 'PENDENTE' : dados.situacao.toUpperCase(),
          
          data_acionamento: new Date().toISOString(),
          hora_acionamento: new Date().toISOString(),
          
          rua_avenida: dados.endereco?.rua || "Rua não informada",
          numero_local: dados.endereco?.numero || "S/N",
          bairro: dados.endereco?.bairro || "Centro",
          municipio: dados.endereco?.municipio || "Recife",
          ponto_referencia: dados.endereco?.referencia || "",
          latitude: Number(dados.endereco?.latitude) || 0,
          longitude: Number(dados.endereco?.longitude) || 0,

          historico_texto: dados.historico || "Sem histórico",
          nr_aviso: dados.numAviso || "AVISO-AUTO",
          viatura_tipo: dados.viaturaTipo || "ABT",
          viatura_numero: dados.viaturaOrdem || "000",
          ponto_base: dados.pontoBase || "PB-01",
          
          cod_co: dados.co || "CO-000",
          cod_ciods: dados.ciods || "CIODS-000",
          cod_193: dados.numero193 || "193-000",
          ome_gb_secao: "GBI",

          vitimas_total: Number(dados.qtdTotalVitimas) || 0,
          vitimas_feridas: Number(dados.feridas) || 0,
          vitimas_fatais: Number(dados.fatais) || 0,
          vitimas_ilesas: Number(dados.ilesas) || 0,
          vitimas_desaparecidas: Number(dados.desaparecidas) || 0,
          
          veiculos_envolvidos: dados.veiculosEnvolvidos === 'SIM' ? 'Sim' : 'Nenhum'
      };
  };

  /* -----------------------------------------------------------------
     PERSISTÊNCIA
  ----------------------------------------------------------------- */
  const persistirOcorrencia = async (dados: any, isFinalizing = false) => {
    setIsSaving(true); 

    try {
      const dto = prepararDTO(dados);
      
      // MODO EDIÇÃO (PUT)
      if (dados.id && dados.id.length > 5) { 
          await api.put(`/ocorrencias/${dados.id}`, dto);
          
          if (isFinalizing) {
              alert("Ocorrência atualizada com sucesso!");
              navigate('/ocorrencias'); 
          }
      
      // MODO CRIAÇÃO (POST)
      } else {
          const response = await api.post('/ocorrencias', dto);
          const novaOcorrencia = response.data;
          
          // Tenta pegar o ID gerado (pode vir em .id ou .data.id)
          const novoID = novaOcorrencia.id || novaOcorrencia.data?.id; 

          if (novoID) {
              setFormData((prev: any) => ({ ...prev, id: novoID }));
              setIsEditMode(true); 
          }
          
          if (isFinalizing) {
             alert("Ocorrência criada com sucesso!");
             navigate('/ocorrencias');
          }
      }

      window.dispatchEvent(new Event('ocorrencias:updated'));
      
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      const msg = err.response?.data?.message || 'Erro ao salvar. Verifique os campos.';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // --- HANDLER PRINCIPAL (SALVAR E AVANÇAR) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const markedNature = findMarkedNature(formData.formulariosPreenchidos);
    
    // 1. Salva o Básico primeiro (para garantir que temos o ID)
    await persistirOcorrencia(formData, false);

    // 2. Se salvou com sucesso e tem natureza, AVANÇA para etapa 2
    if (markedNature) {
      setActiveNature(markedNature);
      setStep(2); 
    } else {
      // Se não marcou natureza, já redireciona para a lista
      navigate('/ocorrencias');
    }
  };

  const handleFinalizeNature = (e: React.FormEvent) => {
    e.preventDefault();
    persistirOcorrencia(formData, true); 
  };

  const handleCancel = () => {
    if (window.confirm('Deseja cancelar e voltar à listagem?')) {
      navigate('/ocorrencias');
    }
  };

  /* -----------------------------------------------------------------
     RENDERIZAÇÃO
  ----------------------------------------------------------------- */
  const renderNatureForm = () => {
    const sharedProps = {
      formData,
      handleChange,
      handleSubmit: handleFinalizeNature,
      handleCancel: () => setStep(1),
      submitText: isEditMode ? 'Salvar Alterações' : 'Finalizar Ocorrência',
      isLoading: isSaving
    };

    switch (activeNature) {
      case 'incendio': return <FormularioIncendio {...sharedProps} />;
      case 'salvamento': return <FormularioSalvamento {...sharedProps} />;
      case 'atdPreHospitalar': return <FormularioAPH {...sharedProps} />;
      case 'prevencao': return <FormularioPrevencao {...sharedProps} />;
      case 'atividadeComunitaria': return <FormularioAtividadeComunitaria {...sharedProps} />;
      case 'formularioGerenciamento': return <FormularioGerenciamento {...sharedProps} />;
      case 'produtoPerigoso': return <FormularioProdutoPerigoso {...sharedProps} />;
      default:
        return (
          <div className="sub-section">
            <p>Nenhuma natureza marcada.</p>
            <button className="button-cancel" onClick={() => setStep(1)}>Voltar</button>
          </div>
        );
    }
  };

  const deveAvancar = Object.values(formData.formulariosPreenchidos || {}).some((v: any) => v === true);
  const totalEtapas = deveAvancar ? 2 : 1;

  return (
    <div className="page-container">
      <div className="unified-card">
        <header className="page-header">
          <div className="page-title">
            <h2>{isEditMode ? `Editando Ocorrência` : 'Nova Ocorrência'}</h2>
            <p>{step === 1 ? `Etapa 1 de ${totalEtapas}: Formulário Básico` : `Etapa 2 de ${totalEtapas}: Detalhes da Natureza`}</p>
          </div>
          <img src={brasaoLogo} alt="Brasão CBMPE" className="header-logo" />
        </header>

        {step === 1 ? (
          <FormularioBasico
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            submitText={deveAvancar ? 'Salvar e Avançar' : 'Salvar e Finalizar'}
            isLoading={isSaving}
          />
        ) : (
          renderNatureForm()
        )}
      </div>
    </div>
  );
};

export default FormularioPage;