/**
 * @file FormularioPage.tsx
 * @description Página principal do fluxo de criação/edição de ocorrência,
 * AGORA COM VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS E LÓGICA COMPLETA DE PWA.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormularioBasico from './FormularioBasico';
import FormularioIncendio from './FormularioIncendio';
import './FormularioPage.css';
import brasaoLogo from '../../assets/brasao.cbm.pe.png'; 

// Interface do objeto que o Dashboard espera
interface OcorrenciaDashboard {
  tipo: string;
  status: string;
  regiao: string;
  data: string;
  id?: string;
}

// Helper para obter o estado inicial (novo)
const getInitialFormData = () => ({
  id: crypto.randomUUID(), 
  
  // Dados do Form Básico (Campos obrigatórios para validação)
  pontoBase: '',
  viaturaTipo: '',
  viaturaOrdem: '',
  numAviso: '',
  dataAviso: new Date().toISOString().split('T')[0],
  horaRecebimento: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
  situacao: 'em-andamento', // Status padrão para novos chamados
  
  // Localização (Campos de endereço)
  endereco: {
    rua: '',
    numero: '',
    bairro: '', // OBRIGATÓRIO
    municipio: 'Recife', // OBRIGATÓRIO (Assumido)
    referencia: '',
    latitude: '', 
    longitude: '',
  },
  fotoOcorrencia: '',
  assinaturaDigital: '',

  // Outros campos...
  nomeSolicitante: '',
  contatoTelefonico: '',
  horarioSaida: '',
  horarioNoLocal: '',
  apoio: {},
  dificuldades: {},
  // Campo de controle para o Dashboard e navegação
  formulariosPreenchidos: { 
    atdPreHospitalar: false,
    incendio: false,
    salvamento: false,
    produtoPerigoso: false,
  },
  guarnicaoEmpenhada: { componentes: [] },
  veiculo1: {},
  veiculo2: {},
  historico: '',
  
  // Dados de Incêndio (para Etapa 2)
  incendio: { 
    grupo: 'Edificação', 
    operacao: { consumoAgua: 0 }, 
    acoes: {}, 
    recursos: {} 
  }, 
});

const FormularioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(getInitialFormData());

  // LÓGICA PARA MODO EDIÇÃO (Quartel/Viatura)
  useEffect(() => {
    if (id) {
      const dadosSalvosJSON = localStorage.getItem("ocorrencias");
      const listaOcorrencias = dadosSalvosJSON ? JSON.parse(dadosSalvosJSON) : [];
      
      const ocorrenciaParaEditar = listaOcorrencias.find((o: any) => o.id === id);

      if (ocorrenciaParaEditar) {
        setFormData(ocorrenciaParaEditar); 
        if (ocorrenciaParaEditar.formulariosPreenchidos?.incendio) {
             setStep(2);
        }
      } else {
        alert("Ocorrência não encontrada no registro local.");
        navigate('/formulario');
      }
    }
  }, [id, navigate]); 


  // --- Handler genérico para inputs ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | any) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const keys = name.split('.');

    setFormData((prev: any) => {
      let newState = { ...prev };
      
      // Lógica de atualização
      if (keys.length === 1) newState = { ...prev, [keys[0]]: finalValue };
      else if (keys.length === 2) newState = { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: finalValue } };
      else if (keys.length === 3) {
        const [k1, k2, k3] = keys;
        newState = { ...prev, [k1]: { ...prev[k1], [k2]: { ...(prev[k1]?.[k2] || {}), [k3]: finalValue } } };
      }
      
      // Lógica de AVANÇO AUTOMÁTICO (Se Incêndio/APH/etc. for marcado)
      if (name === 'formulariosPreenchidos.incendio' && finalValue === true) {
          setTimeout(() => setStep(2), 0); 
      }
      
      return newState;
    });
  };
  
  // =========================================================================
  // FUNÇÃO DE VALIDAÇÃO (NOVO)
  // =========================================================================
  const validarFormularioBasico = (dados: any) => {
    // Campos OBRIGATÓRIOS MÍNIMOS para salvar/avançar
    const camposObrigatorios = [
        dados.pontoBase,
        dados.viaturaTipo,
        dados.viaturaOrdem,
        dados.endereco.bairro,
        dados.endereco.municipio,
        dados.numAviso,
        dados.situacao,
    ];

    const camposVazios = camposObrigatorios.filter(campo => !campo || String(campo).trim() === '');

    if (camposVazios.length > 0) {
        return { 
            valido: false, 
            mensagem: "É necessário preencher os campos obrigatórios para avançar ou salvar: Ponto Base, Viatura, Bairro/Município, Nº do Aviso e Situação.",
        };
    }
    return { valido: true, mensagem: "" };
  };


  // =========================================================================
  // HANDLER PRINCIPAL (SALVAMENTO E SINCRONIZAÇÃO)
  // =========================================================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VERIFICAÇÃO INICIAL: Impede qualquer avanço ou salvamento se o BÁSICO estiver incompleto
    const validacao = validarFormularioBasico(formData);
    if (!validacao.valido) {
        alert(validacao.mensagem);
        return; // PÁRA O FLUXO
    }

    // --- 1. AVANÇAR ETAPA (PASSO 1 -> PASSO 2) ---
    if (step === 1) {
      const deveAvancar = Object.values(formData.formulariosPreenchidos).some(val => val === true);
      
      if (deveAvancar) {
          setStep(2);
          // Feedback limpo ao avançar, sem salvar no localStorage (apenas avança o estado)
          alert(`Dados básicos salvos temporariamente. Prossiga para a Etapa 2: Detalhes da Natureza.`);
      } else {
          // Salva o registro básico (1 de 1)
          salvarOcorrenciaFinal(formData, 'Ocorrência Básica');
      }
      return; 
    } 
    
    // --- 2. FINALIZAR OCORRÊNCIA (PASSO 2 -> PERSISTÊNCIA) ---
    if (step === 2) {
        // NOTA: A validação específica para o FormulárioIncendio (campos obrigatórios da etapa 2) 
        // deve ser adicionada aqui, se necessário.
        salvarOcorrenciaFinal(formData, 'Incêndio');
    }
  };


  // FUNÇÃO CENTRAL DE SALVAMENTO (Offline e Dashboard)
  const salvarOcorrenciaFinal = (dadosCompletos: any, tipoBase: string) => {
    
    // A) NORMALIZAÇÃO DE DADOS PARA O DASHBOARD:
    const tipoDashboard = tipoBase === 'Incêndio'
        ? `Incêndio em ${dadosCompletos.incendio?.grupo || 'Geral'}`
        : tipoBase;
    
    const statusDashboard = dadosCompletos.situacao === 'em-andamento' ? "Em andamento"
                          : dadosCompletos.situacao === 'finalizada' ? "Concluída"
                          : "Pendente";
    
    const ocorrenciaParaDashboard: OcorrenciaDashboard = {
        id: dadosCompletos.id || crypto.randomUUID(),
        tipo: tipoDashboard, 
        status: statusDashboard, 
        regiao: dadosCompletos.endereco?.bairro || dadosCompletos.endereco?.municipio || "Recife",
        data: new Date().toISOString(),
        ...dadosCompletos, 
    };

    // B) PERSISTÊNCIA E SINCRONIZAÇÃO (PWA/Offline):
    try {
        const dadosSalvosJSON = localStorage.getItem("ocorrencias");
        let listaOcorrencias = dadosSalvosJSON ? JSON.parse(dadosSalvosJSON) : [];
        
        // Remove a versão antiga (se estiver editando)
        listaOcorrencias = listaOcorrencias.filter((o: any) => o.id !== ocorrenciaParaDashboard.id);
        
        // Adiciona a nova/atualizada versão
        listaOcorrencias.push(ocorrenciaParaDashboard);

        localStorage.setItem("ocorrencias", JSON.stringify(listaOcorrencias));
        
        // DISPARA O EVENTO DE ATUALIZAÇÃO DO DASHBOARD
        window.dispatchEvent(new Event("ocorrencias:updated"));
        
        // CORREÇÃO DA MENSAGEM DE FEEDBACK
        const mensagemSucesso = tipoBase === 'Ocorrência Básica'
            ? 'Registro Básico salvo com sucesso! (1 de 1).'
            : `Ocorrência (${ocorrenciaParaDashboard.tipo}) finalizada e Dashboard atualizado!`;

        alert(mensagemSucesso);
        
        setFormData(getInitialFormData()); // Reseta o formulário
        navigate('/ocorrencias'); 
        
    } catch (error) {
        console.error("Erro ao salvar dados localmente:", error);
        alert("Erro ao salvar ocorrência. Verifique o console.");
    }
  };


  // Handlers de UI
  const handleCancel = () => navigate('/ocorrencias');
  
  const handleCancelIncendio = () => {
    setStep(1); 
  };


  // CÁLCULO: Verifica se ALÉM do Básico, qualquer outro formulário foi marcado.
  const deveAvancar = Object.values(formData.formulariosPreenchidos).some(val => val === true);
  const totalEtapas = deveAvancar ? 2 : 1; 

  return (
    <div className="page-container">
      <div className="unified-card">
        <header className="page-header">
          <div className="page-title">
            <h2>{id ? `Editando Ocorrência #${id.slice(-4)}` : 'Nova Ocorrência'}</h2>
            
            {/* Contagem dinâmica para todos os formulários específicos */}
            <p>
              {step === 1 ? (
                `Etapa 1 de ${totalEtapas}: Formulário Básico`
              ) : (
                `Etapa 2 de 2: Detalhes da Natureza`
              )}
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
            // NOVO TEXTO: 'Avançar' se houver um formulário específico, senão 'Salvar'
            submitText={deveAvancar ? "Avançar" : "Salvar Registro Básico"} 
          />
        ) : (
          <FormularioIncendio
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancelIncendio}
            submitText={id ? "Atualizar Ocorrência" : "Finalizar Ocorrência"}
          />
        )}
      </div>
    </div>
  );
};

export default FormularioPage;