/**
 * @file FormularioPage.tsx
 * @description Página principal do fluxo de criação/edição de ocorrência — agora com todas as naturezas de formulário integradas.
 * Autora: Vanessa Matias 💻.
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

/* ---------------------------------------------------------------------
   Interface e Funções Auxiliares
--------------------------------------------------------------------- */
interface OcorrenciaDashboard {
  tipo: string;
  status: string;
  regiao: string;
  data: string;
  id?: string;
  numAviso?: string;
  prioridade?: string;
}

// UUID simples (mantido)
const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

/* ---------------------------------------------------------------------
   Estado inicial do formulário
--------------------------------------------------------------------- */
const getInitialFormData = () => ({
  id: generateUUID(),
  numAviso: '',
  pontoBase: '',
  viaturaTipo: '',
  viaturaOrdem: '',
  dataAviso: new Date().toISOString().split('T')[0],
  situacao: 'pendente',
  prioridade: 'Média',
  endereco: { rua: '', numero: '', bairro: '', municipio: 'Recife', latitude: '', longitude: '' },
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
});

/* ---------------------------------------------------------------------
   COMPONENTE PRINCIPAL
--------------------------------------------------------------------- */
const FormularioPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>(getInitialFormData());
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeNature, setActiveNature] = useState<
    | 'incendio'
    | 'salvamento'
    | 'atdPreHospitalar'
    | 'prevencao'
    | 'atividadeComunitaria'
    | 'formularioGerenciamento'
    | 'produtoPerigoso'
    | ''
  >('');

  /* -----------------------------------------------------------------
     CARREGAMENTO / EDIÇÃO (CORRIGIDO)
  ----------------------------------------------------------------- */
  useEffect(() => {
    // Limpa o estado anterior para evitar "piscar" de dados antigos
    setStep(1); 
    setActiveNature('');
    
    if (id) {
      // MODO EDIÇÃO
      setIsEditMode(true);
      const raw = localStorage.getItem('ocorrencias');
      const list = raw ? JSON.parse(raw) : [];
      const found = list.find((o: any) => o.id === id);

      if (found) {
        // 1. Carrega os dados salvos
        setFormData(found);
        
        // 2. Detecta a natureza (se houver), mas NÃO MUDA DE ETAPA
        const markedNature = findMarkedNature(found.formulariosPreenchidos || {});
        if (markedNature) {
          setActiveNature(markedNature);
        }
        // O 'step' permanece 1, forçando o usuário a ver o FormularioBasico
      
      } else {
        alert('Ocorrência não encontrada. Abrindo formulário em branco.');
        setIsEditMode(false);
        setFormData(getInitialFormData());
      }
    } else {
      // MODO CRIAÇÃO
      setIsEditMode(false);
      setFormData(getInitialFormData());
    }
  }, [id]); // O 'id' é a única dependência 

  /* -----------------------------------------------------------------
     DETECTA QUAL FORMULÁRIO DE NATUREZA ESTÁ MARCADO
  ----------------------------------------------------------------- */
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

      // Atualiza activeNature se o usuário marcar/desmarcar natureza
      if (keys[0] === 'formulariosPreenchidos') {
        const updatedNaturezas = { ...next.formulariosPreenchidos, [keys[1]]: finalValue };
        setActiveNature(findMarkedNature(updatedNaturezas));
      }

      return next;
    });
  };

  /* -----------------------------------------------------------------
     SUBMIT BÁSICO E FINALIZAÇÃO
  ----------------------------------------------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const markedNature = findMarkedNature(formData.formulariosPreenchidos);
    persistirOcorrencia(formData, false);

    if (markedNature) {
      setActiveNature(markedNature);
      setStep(2);
      alert('Formulário Básico salvo. Continue preenchendo a Etapa 2.');
    }
  };

  const handleFinalizeNature = (e: React.FormEvent) => {
    e.preventDefault();
    persistirOcorrencia(formData, true);
    setFormData(getInitialFormData());
  };

  const persistirOcorrencia = (dados: any, shouldRedirect = false) => {
    try {
      const raw = localStorage.getItem('ocorrencias');
      const lista = raw ? JSON.parse(raw) : [];
      const filtered = lista.filter((o: any) => o.id !== dados.id);
      filtered.push(dados);
      localStorage.setItem('ocorrencias', JSON.stringify(filtered));

      window.dispatchEvent(new Event('ocorrencias:updated'));
      if (shouldRedirect) navigate('/ocorrencias');
    } catch (err) {
      console.error('Erro ao salvar ocorrência:', err);
      alert('Erro ao salvar ocorrência.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Deseja cancelar e voltar à listagem de ocorrências?')) {
      navigate('/ocorrencias');
    }
  };

  /* -----------------------------------------------------------------
     RENDERIZA O FORMULÁRIO CORRESPONDENTE À NATUREZA
  ----------------------------------------------------------------- */
  const renderNatureForm = () => {
    const sharedProps = {
      formData,
      handleChange,
      handleSubmit: handleFinalizeNature,
      handleCancel: () => setStep(1),
      submitText: isEditMode ? 'Atualizar e Finalizar' : 'Finalizar Ocorrência',
    };

    switch (activeNature) {
      case 'incendio':
        return <FormularioIncendio {...sharedProps} />;
      case 'salvamento':
        return <FormularioSalvamento {...sharedProps} />;
      case 'atdPreHospitalar':
        return <FormularioAPH {...sharedProps} />;
      case 'prevencao':
        return <FormularioPrevencao {...sharedProps} />;
      case 'atividadeComunitaria':
        return <FormularioAtividadeComunitaria {...sharedProps} />;
      case 'formularioGerenciamento':
        return <FormularioGerenciamento {...sharedProps} />;
      case 'produtoPerigoso':
        return <FormularioProdutoPerigoso {...sharedProps} />;
      default:
        return (
          <div className="sub-section">
            <p>Nenhuma natureza marcada. Marque uma opção e salve para avançar.</p>
            <button className="button-cancel" onClick={() => setStep(1)}>
              Voltar
            </button>
          </div>
        );
    }
  };

  /* -----------------------------------------------------------------
     RENDERIZAÇÃO FINAL
  ----------------------------------------------------------------- */
  const deveAvancar = Object.values(formData.formulariosPreenchidos || {}).some((v: any) => v === true);
  const totalEtapas = deveAvancar ? 2 : 1;

  return (
    <div className="page-container">
      <div className="unified-card">
        <header className="page-header">
          <div className="page-title">
            <h2>{isEditMode ? `Editando Ocorrência #${formData.numAviso || 'Rascunho'}` : 'Nova Ocorrência'}</h2>
            <p>
              {step === 1
                ? `Etapa 1 de ${totalEtapas}: Formulário Básico`
                : `Etapa 2 de ${totalEtapas}: Detalhes da Natureza`}
            </p>
          </div>
          <img src={brasaoLogo} alt="Brasão CBMPE" className="header-logo" />
        </header>

        {step === 1 ? (
          <FormularioBasico
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            submitText={deveAvancar ? 'Avançar' : 'Salvar Rascunho'}
          />
        ) : (
          renderNatureForm()
        )}
      </div>
    </div>
  );
};

export default FormularioPage;
