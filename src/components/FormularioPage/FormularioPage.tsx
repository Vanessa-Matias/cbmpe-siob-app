/**
 * @file FormularioPage.tsx
 * @description Página principal do fluxo de criação/edição de ocorrência.
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormularioBasico from './FormularioBasico';
import FormularioIncendio from './FormularioIncendio';
import './FormularioPage.css';
import brasaoLogo from '../../assets/brasao.cbm.pe.png';

const FormularioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    pontoBase: '',
    viaturaTipo: '',
    viaturaOrdem: '',
    numAviso: '',
    dataAviso: '',
    horaRecebimento: '',
    formaAcionamento: '',
    situacaoOcorrencia: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      municipio: '',
      codigoLocal: '',
      referencia: '',
      latitude: '',
      longitude: '',
    },
    nomeSolicitante: '',
    cpfRg: '',
    orgaoExpedidor: '',
    idadeSolicitante: '',
    sexoSolicitante: '',
    contatoTelefonico: '',
    horarioSaida: '',
    horarioNoLocal: '',
    horarioSaidaLocal: '',
    horarioChegadaDestino: '',
    horarioRetornoQuartel: '',
    hodometroSaida: '',
    hodometroLocal: '',
    apoio: {},
    dificuldades: {},
    formulariosPreenchidos: {},
    guarnicaoEmpenhada: { postoGrad: '', matriculaCmt: '', nomeGuerraCmt: '', vistoDivisao: '', componentes: ['', '', '', '', '', ''] },
    veiculo1: {},
    veiculo2: {},
    historico: '',
    incendio: { grupo: '', operacao: {}, acoes: {}, recursos: {} },
  });

  // --- Handler genérico para inputs ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const keys = name.split('.');

    setFormData((prev: any) => {
      if (keys.length === 1) return { ...prev, [keys[0]]: finalValue };
      if (keys.length === 2) return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: finalValue } };
      if (keys.length === 3) {
        const [k1, k2, k3] = keys;
        return {
          ...prev,
          [k1]: { ...prev[k1], [k2]: { ...(prev[k1]?.[k2] || {}), [k3]: finalValue } },
        };
      }
      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      console.log('Dados do Formulário Básico:', formData);
      alert('Formulário Básico salvo! Preencha agora os detalhes do incêndio.');
      setStep(2);
    } else {
      console.log('DADOS FINAIS DA OCORRÊNCIA:', formData);
      alert('Ocorrência registrada com sucesso!');
      navigate('/ocorrencias');
    }
  };

  const handleCancel = () => navigate('/ocorrencias');

  return (
    <div className="page-container">
      <div className="unified-card">
        <header className="page-header">
          <div className="page-title">
            <h2>{id ? `Editando Ocorrência #${id}` : 'Nova Ocorrência'}</h2>
            <p>{step === 1 ? 'Etapa 1 de 2: Formulário Básico' : 'Etapa 2 de 2: Detalhes do Incêndio'}</p>
          </div>
          <img src={brasaoLogo} alt="Brasão CBMPE" className="header-logo" />
        </header>

        {step === 1 ? (
          <FormularioBasico
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            submitText="Avançar"
          />
        ) : (
          <FormularioIncendio
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={() => setStep(1)}
            submitText="Finalizar Ocorrência"
          />
        )}
      </div>
    </div>
  );
};

export default FormularioPage;
