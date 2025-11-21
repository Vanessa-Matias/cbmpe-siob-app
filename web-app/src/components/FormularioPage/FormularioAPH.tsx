/**
 * @file FormularioAPH.tsx
 * @description Formulário de Atendimento Pré-Hospitalar (APH) do CBMPE.
 * Reflete a Natureza 1 e inclui a Escala de Coma de Glasgow (Item 09).
 * Autora: Vanessa Matias 💻
 */

import React from 'react';
import './FormularioAPH.css';

// Props padrão de integração entre os formulários
type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  submitText: string;
};

const FormularioAPH: React.FC<Props> = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
  submitText
}) => {
  
  // --- BLINDAGEM DE DADOS ---
  // Garante que os objetos existam para evitar erros de undefined
  const aphData = formData.aph || {};
  const qualificacao = aphData.qualificacao || {};
  const glasgow = aphData.glasgow || {};
  const sinaisVitais = aphData.sinaisVitais || {};
  const procedimentos = aphData.procedimentos || {};
  const destino = aphData.destino || {};

  // Função para calcular ou estimar a pontuação de Glasgow (Soma 09b, 09c, 09d)
  const calcularGlasgow = () => {
    const ocular = parseInt(glasgow.ocular || 0);
    const verbal = parseInt(glasgow.verbal || 0);
    const motora = parseInt(glasgow.motora || 0);
    
    // A pontuação final é a soma das três componentes (mínimo 3, máximo 15)
    const total = ocular + verbal + motora;
    
    // Retorna o total ou vazio se for 0 (para não mostrar 0 sem preenchimento)
    return total > 0 ? total : '';
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>

      {/* ==========================================================
          CABEÇALHO DO FORMULÁRIO (Natureza 1: AZUL)
      =========================================================== */}
      <div className="form-section-header-aph">
        <h3>Natureza 1: Atendimento Pré-Hospitalar (APH)</h3>
      </div>

      {/* ==========================================================
          SEÇÃO 1 - QUALIFICAÇÃO DA VÍTIMA (Item 10)
      =========================================================== */}
      <fieldset>
        <legend>Qualificação da Vítima</legend>
        <div className="form-group-grid-2-col"> 
          {/* COLUNA 1: Nome (Largo) */}
          <div className="form-group">
            <label htmlFor="nomeVitima">Nome da Vítima</label>
            <input 
              type="text" 
              id="nomeVitima" 
              name="aph.qualificacao.nome" 
              value={qualificacao.nome || ''} 
              onChange={handleChange} 
              placeholder="Nome completo" 
            />
          </div>
          {/* COLUNA 2: Idade (Curta) */}
          <div className="form-group">
            <label htmlFor="idadeVitima">Idade</label>
            <input 
              type="number" 
              id="idadeVitima" 
              name="aph.qualificacao.idade" 
              value={qualificacao.idade || ''} 
              onChange={handleChange} 
              placeholder="Idade" 
            />
          </div>

          {/* COLUNA 3 (inicia nova linha): Sexo */}
          <div className="form-group">
            <label htmlFor="sexoVitima">Sexo</label>
            <select 
              id="sexoVitima" 
              name="aph.qualificacao.sexo" 
              value={qualificacao.sexo || ''} 
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="M_CIS">Mulher cis</option>
              <option value="M_TRANS">Mulher trans</option>
              <option value="H_CIS">Homem cis</option>
              <option value="H_TRANS">Homem trans</option>
              <option value="NB">Não-Binário</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
          {/* COLUNA 4: Bombeiro em Serviço? */}
          <div className="form-group">
            <label htmlFor="bombeiroServico">Bombeiro em Serviço?</label>
            <select 
              id="bombeiroServico" 
              name="aph.qualificacao.bombeiroServico" 
              value={qualificacao.bombeiroServico || ''} 
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* ==========================================================
          SEÇÃO 2 - AVALIAÇÃO DA VÍTIMA (Item 09)
      =========================================================== */}
      <fieldset>
        <legend>Escala de Coma de Glasgow e Sinais Vitais</legend>
        <div className="form-group-grid-4-col">
          
          {/* --- ESCALA DE GLASGOW --- */}
          <div className="form-group">
              <label htmlFor="ocular">Abertura Ocular (09b)</label>
              <input 
                type="number" 
                id="ocular" 
                name="aph.glasgow.ocular" 
                min={1} max={4} 
                value={glasgow.ocular || ''} 
                onChange={handleChange} 
                placeholder="Máx 4" 
              />
          </div>
          <div className="form-group">
              <label htmlFor="verbal">Resposta Verbal (09c)</label>
              <input 
                type="number" 
                id="verbal" 
                name="aph.glasgow.verbal" 
                min={1} max={5} 
                value={glasgow.verbal || ''} 
                onChange={handleChange} 
                placeholder="Máx 5" 
              />
          </div>
          <div className="form-group">
              <label htmlFor="motora">Resposta Motora (09d)</label>
              <input 
                type="number" 
                id="motora" 
                name="aph.glasgow.motora" 
                min={1} max={6} 
                value={glasgow.motora || ''} 
                onChange={handleChange} 
                placeholder="Máx 6" 
              />
          </div>
          <div className="form-group">
              <label htmlFor="glasgowTotal">Total Glasgow (09f)</label>
              <input 
                type="text" 
                id="glasgowTotal" 
                value={calcularGlasgow()} 
                readOnly 
                placeholder="Soma" 
                className="input-read-only" 
              />
          </div>
          
          {/* --- SINAIS VITAIS --- */}
          <div className="form-group">
              <label htmlFor="pressaoArterial">Pressão Arterial (09g)</label>
              <input 
                type="text" 
                id="pressaoArterial" 
                name="aph.sinaisVitais.pa" 
                value={sinaisVitais.pa || ''} 
                onChange={handleChange} 
                placeholder="mmHg (Ex: 120x80)" 
              />
          </div>
          <div className="form-group">
              <label htmlFor="frequenciaCardiaca">Frequência Cardíaca (09g)</label>
              <input 
                type="number" 
                id="frequenciaCardiaca" 
                name="aph.sinaisVitais.fc" 
                value={sinaisVitais.fc || ''} 
                onChange={handleChange} 
                placeholder="BPM" 
              />
          </div>
          <div className="form-group">
              <label htmlFor="frequenciaRespiratoria">Frequência Respiratória (09g)</label>
              <input 
                type="number" 
                id="frequenciaRespiratoria" 
                name="aph.sinaisVitais.fr" 
                value={sinaisVitais.fr || ''} 
                onChange={handleChange} 
                placeholder="ipm" 
              />
          </div>
          <div className="form-group">
              <label htmlFor="temperatura">Temperatura (09g)</label>
              <input 
                type="text" 
                id="temperatura" 
                name="aph.sinaisVitais.temp" 
                value={sinaisVitais.temp || ''} 
                onChange={handleChange} 
                placeholder="°C (Ex: 36.5)" 
              />
          </div>
        </div>
      </fieldset>

      {/* ==========================================================
          SEÇÃO 3 - AÇÕES REALIZADAS (Item 07)
      =========================================================== */}
      <fieldset>
        <legend>Ações Realizadas</legend>
        <div className="checkbox-grid-3-col">
          <div className="form-check-item">
            <input
              type="checkbox"
              id="rcp"
              name="aph.procedimentos.rcp"
              checked={procedimentos.rcp || false}
              onChange={handleChange}
            />
            <label htmlFor="rcp">RCP</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="imobilizacao"
              name="aph.procedimentos.imobilizacao"
              checked={procedimentos.imobilizacao || false}
              onChange={handleChange}
            />
            <label htmlFor="imobilizacao">Imobilização</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="oxigenoterapia"
              name="aph.procedimentos.oxigenoterapia"
              checked={procedimentos.oxigenoterapia || false}
              onChange={handleChange}
            />
            <label htmlFor="oxigenoterapia">Oxigenoterapia</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="controleHemorragia"
              name="aph.procedimentos.controleHemorragia"
              checked={procedimentos.controleHemorragia || false}
              onChange={handleChange}
            />
            <label htmlFor="controleHemorragia">Contenção de Hemorragia</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="desencarceramento"
              name="aph.procedimentos.desencarceramento"
              checked={procedimentos.desencarceramento || false}
              onChange={handleChange}
            />
            <label htmlFor="desencarceramento">Desencarceramento</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="ventilacaoAssistida"
              name="aph.procedimentos.ventilacaoAssistida"
              checked={procedimentos.ventilacaoAssistida || false}
              onChange={handleChange}
            />
            <label htmlFor="ventilacaoAssistida">Ventilação Assistida</label>
          </div>
        </div>
      </fieldset>

      {/* ==========================================================
          SEÇÃO 4 - DESTINO DA VÍTIMA (Item 13)
      =========================================================== */}
      <fieldset>
        <legend>Destino da Vítima</legend>
        <div className="form-group-grid-2-col">
          {/* Campo 1: Destino */}
          <div className="form-group">
            <label htmlFor="destino">Destino</label>
            <select
              id="destino"
              name="aph.destino.tipo"
              value={destino.tipo || ''}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="Entregue Hospital">Entregue no Hospital</option>
              <option value="Recusa">Recusou Atendimento</option>
              <option value="Permaneceu Local">Permaneceu no Local (Médico liberou)</option>
              <option value="Encaminhada SAMU">Encaminhada ao Suporte SAMU</option>
            </select>
          </div>

          {/* Campo 2: Hospital / Órgão */}
          <div className="form-group">
            <label htmlFor="hospitalDestino">Hospital / Órgão Competente</label>
            <input
              type="text"
              id="hospitalDestino"
              name="aph.destino.referencia"
              value={destino.referencia || ''}
              onChange={handleChange}
              placeholder="Nome do Hospital, PM, PC, etc."
            />
          </div>
        </div>
      </fieldset>

      {/* ==========================================================
          BOTÕES DE AÇÃO
      =========================================================== */}
      <div className="form-actions">
        <button type="button" className="button-cancel" onClick={handleCancel}>
          Voltar ao Básico
        </button>
        <button type="submit" className="submit-button">
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default FormularioAPH;