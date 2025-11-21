/**
 * @file FormularioIncendio.tsx
 * @description Componente de apresentação para o formulário de Incêndio.
 * Inclui proteção contra erros de leitura de dados (undefined).
 * Autora: Vanessa Matias 💻
 */
import React from 'react';
import './FormularioIncendio.css';

// Define o "contrato" de props que este componente espera receber.
type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  submitText: string;
};

const FormularioIncendio: React.FC<Props> = ({ formData, handleChange, handleSubmit, handleCancel, submitText  }) => {
  
  // --- BLINDAGEM DE DADOS ---
  // Garante que os objetos existam, evitando erro "Cannot read properties of undefined"
  const incendioData = formData.incendio || {};
  const operacao = incendioData.operacao || {};
  const acoes = incendioData.acoes || {};
  const recursos = incendioData.recursos || {};

  return (
    // Reutilizei a mesma classe .form-card para manter o estilo.
    <form className="form-card" onSubmit={handleSubmit}>
      
      {/* --- CABEÇALHO ESPECÍFICO DO FORMULÁRIO --- */}
      <div className="form-section-header-incendio">
        <h3>Natureza 2: Incêndio</h3>
      </div>

      {/* --- SEÇÃO DE GRUPO --- */}
      <fieldset>
        <legend>Grupo do Incêndio</legend>
        <div className="checkbox-grid-2-col"> 
          <div className="form-check-item">
            <input 
              type="radio" 
              id="grupoEdificacao" 
              name="incendio.grupo" 
              value="edificacao"
              checked={incendioData.grupo === 'edificacao'} 
              onChange={handleChange} 
            />
            <label htmlFor="grupoEdificacao">Incêndio em Edificação</label>
          </div>
          <div className="form-check-item">
            <input 
              type="radio" 
              id="grupoTransporte" 
              name="incendio.grupo" 
              value="transporte"
              checked={incendioData.grupo === 'transporte'} 
              onChange={handleChange} 
            />
            <label htmlFor="grupoTransporte">Incêndio em Meio de Transporte</label>
          </div>
          <div className="form-check-item">
            <input 
              type="radio" 
              id="grupoVegetacao" 
              name="incendio.grupo" 
              value="vegetacao"
              checked={incendioData.grupo === 'vegetacao'} 
              onChange={handleChange} 
            />
            <label htmlFor="grupoVegetacao">Incêndio em Vegetação</label>
          </div>
          <div className="form-check-item">
            <input 
              type="radio" 
              id="grupoDescarte" 
              name="incendio.grupo" 
              value="descarte"
              checked={incendioData.grupo === 'descarte'} 
              onChange={handleChange} 
            />
            <label htmlFor="grupoDescarte">Incêndio em Área de Descarte</label>
          </div>
        </div>
      </fieldset>

      {/* --- SEÇÃO DE DETALHES OPERACIONAIS --- */}
      <fieldset>
        <legend>Detalhes Operacionais</legend>
        <div className="form-group-grid-4-col">

          {/* Campo 06 do Manual */}
          <div className="form-group">
            <label htmlFor="tempoExtincao">Tempo de Extinção (hh:mm)</label>
            <input 
              type="text" 
              id="tempoExtincao" 
              name="incendio.operacao.tempoExtincao" 
              value={operacao.tempoExtincao || ''} 
              onChange={handleChange} 
              placeholder="01:30" 
            />
          </div>

          <div className="form-group">
            <label htmlFor="tempoRescaldo">Tempo de Rescaldo (hh:mm)</label>
            <input 
              type="text" 
              id="tempoRescaldo" 
              name="incendio.operacao.tempoRescaldo" 
              value={operacao.tempoRescaldo || ''} 
              onChange={handleChange} 
              placeholder="00:45" 
            />
          </div>

          {/* Campo 07 do Manual */}
          <div className="form-group">
            <label htmlFor="consumoAgua">Consumo de Água (litros)</label>
            <input 
              type="number" 
              id="consumoAgua" 
              name="incendio.operacao.consumoAgua" 
              value={operacao.consumoAgua || ''} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="consumoLGE">Consumo de LGE/EFE (litros)</label>
            <input 
              type="number" 
              id="consumoLGE" 
              name="incendio.operacao.consumoLGE" 
              value={operacao.consumoLGE || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
      </fieldset>

      {/* --- SEÇÃO DE AÇÕES E RECURSOS --- */}
      <fieldset>
        <legend>Ações Realizadas e Recursos Hídricos</legend>
        
        {/* Campo 11 do Manual */}
        <label className="sub-legend">Ações Realizadas</label>
        <div className="checkbox-grid-4-col">
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="acaoExtincao" 
              name="incendio.acoes.extincao" 
              checked={acoes.extincao || false} 
              onChange={handleChange} 
            />
            <label htmlFor="acaoExtincao">Extinção de incêndio</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="acaoRescaldo" 
              name="incendio.acoes.rescaldo" 
              checked={acoes.rescaldo || false} 
              onChange={handleChange} 
            />
            <label htmlFor="acaoRescaldo">Rescaldo</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="acaoVentilacao" 
              name="incendio.acoes.ventilacao" 
              checked={acoes.ventilacao || false} 
              onChange={handleChange} 
            />
            <label htmlFor="acaoVentilacao">Ventilação</label>
          </div>
           <div className="form-check-item">
            <input 
              type="checkbox" 
              id="acaoResfriamento" 
              name="incendio.acoes.resfriamento" 
              checked={acoes.resfriamento || false} 
              onChange={handleChange} 
            />
            <label htmlFor="acaoResfriamento">Resfriamento</label>
          </div>
        </div>

        {/* Campo 12 do Manual */}
        <label className="sub-legend" style={{ marginTop: '24px' }}>Recursos Hídricos Utilizados</label>
        <div className="checkbox-grid-4-col">
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="recursoHidranteUrbano" 
              name="incendio.recursos.hidranteUrbano" 
              checked={recursos.hidranteUrbano || false} 
              onChange={handleChange} 
            />
            <label htmlFor="recursoHidranteUrbano">Hidrante urbano</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="recursoAguaTransportada" 
              name="incendio.recursos.aguaTransportada" 
              checked={recursos.aguaTransportada || false} 
              onChange={handleChange} 
            />
            <label htmlFor="recursoAguaTransportada">Água transportada</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="recursoRio" 
              name="incendio.recursos.rio" 
              checked={recursos.rio || false} 
              onChange={handleChange} 
            />
            <label htmlFor="recursoRio">Rio</label>
          </div>
           <div className="form-check-item">
            <input 
              type="checkbox" 
              id="recursoPiscina" 
              name="incendio.recursos.piscina" 
              checked={recursos.piscina || false} 
              onChange={handleChange} 
            />
            <label htmlFor="recursoPiscina">Piscina</label>
          </div>
        </div>
      </fieldset>
      
      {/* --- BOTÕES DE AÇÃO --- */}
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

export default FormularioIncendio;