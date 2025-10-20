/**
 * @file FormularioIncendio.tsx
 * @description Componente de apresentação para o formulário de Incêndio.
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
  return (
    // Reutilizamos a mesma classe .form-card para manter o estilo.
    <form className="form-card" onSubmit={handleSubmit}>
      
      {/* --- CABEÇALHO ESPECÍFICO DO FORMULÁRIO --- */}
      <div className="form-section-header-incendio">
        <h3>Natureza 2: Incêndio</h3>
      </div>

      {/* --- SEÇÃO DE GRUPO --- */}
      <fieldset>
  <legend>Grupo do Incêndio</legend>
  {/* Usamos a classe que você já tem para grids de 4 colunas ou criamos uma nova como "checkbox-grid-2-col" */}
  <div className="checkbox-grid-2-col"> 
    <div className="form-check-item">
      <input 
        type="radio" 
        id="grupoEdificacao" 
        name="incendio.grupo" // Nome compartilhado
        value="edificacao"
        checked={formData.incendio?.grupo === 'edificacao'} 
        onChange={handleChange} 
      />
      <label htmlFor="grupoEdificacao">Incêndio em Edificação</label>
    </div>
    <div className="form-check-item">
      <input 
        type="radio" 
        id="grupoTransporte" 
        name="incendio.grupo" // Nome compartilhado
        value="transporte"
        checked={formData.incendio?.grupo === 'transporte'} 
        onChange={handleChange} 
      />
      <label htmlFor="grupoTransporte">Incêndio em Meio de Transporte</label>
    </div>
    <div className="form-check-item">
      <input 
        type="radio" 
        id="grupoVegetacao" 
        name="incendio.grupo" // Nome compartilhado
        value="vegetacao"
        checked={formData.incendio?.grupo === 'vegetacao'} 
        onChange={handleChange} 
      />
      <label htmlFor="grupoVegetacao">Incêndio em Vegetação</label>
    </div>
    <div className="form-check-item">
      <input 
        type="radio" 
        id="grupoDescarte" 
        name="incendio.grupo" // Nome compartilhado
        value="descarte"
        checked={formData.incendio?.grupo === 'descarte'} 
        onChange={handleChange} 
      />
      <label htmlFor="grupoDescarte">Incêndio em Área de Descarte</label>
    </div>
    {/* Adicione os outros grupos como radio buttons também */}
  </div>
</fieldset>

      {/* --- SEÇÃO DE DETALHES OPERACIONAIS --- */}
      <fieldset>
        <legend>Detalhes Operacionais</legend>
        {/* Reutilizaremos a classe de grid que você já tem */}
        <div className="form-group-grid-4-col">

          {/* Campo 06 do Manual */}
          <div className="form-group">
            <label htmlFor="tempoExtincao">Tempo de Extinção (hh:mm)</label>
            <input type="text" id="tempoExtincao" name="incendio.operacao.tempoExtincao" value={formData.incendio?.operacao?.tempoExtincao || ''} onChange={handleChange} placeholder="01:30" />
          </div>

          <div className="form-group">
            <label htmlFor="tempoRescaldo">Tempo de Rescaldo (hh:mm)</label>
            <input type="text" id="tempoRescaldo" name="incendio.operacao.tempoRescaldo" value={formData.incendio?.operacao?.tempoRescaldo || ''} onChange={handleChange} placeholder="00:45" />
          </div>

          {/* Campo 07 do Manual */}
          <div className="form-group">
            <label htmlFor="consumoAgua">Consumo de Água (litros)</label>
            <input type="number" id="consumoAgua" name="incendio.operacao.consumoAgua" value={formData.incendio?.operacao?.consumoAgua || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="consumoLGE">Consumo de LGE/EFE (litros)</label>
            <input type="number" id="consumoLGE" name="incendio.operacao.consumoLGE" value={formData.incendio?.operacao?.consumoLGE || ''} onChange={handleChange} />
          </div>
        </div>
      </fieldset>

      {/* --- SEÇÃO DE AÇÕES E RECURSOS --- */}
      <fieldset>
        <legend>Ações Realizadas e Recursos Hídricos</legend>
        
        {/* Campo 11 do Manual */}
        <label className="sub-legend">Ações Realizadas</label>
        <div className="checkbox-grid-4-col"> {/* Usando seu grid de 4 colunas */}
          <div className="form-check-item">
            <input type="checkbox" id="acaoExtincao" name="incendio.acoes.extincao" checked={formData.incendio?.acoes?.extincao || false} onChange={handleChange} />
            <label htmlFor="acaoExtincao">Extinção de incêndio</label>
          </div>
          <div className="form-check-item">
            <input type="checkbox" id="acaoRescaldo" name="incendio.acoes.rescaldo" checked={formData.incendio?.acoes?.rescaldo || false} onChange={handleChange} />
            <label htmlFor="acaoRescaldo">Rescaldo</label>
          </div>
          <div className="form-check-item">
            <input type="checkbox" id="acaoVentilacao" name="incendio.acoes.ventilacao" checked={formData.incendio?.acoes?.ventilacao || false} onChange={handleChange} />
            <label htmlFor="acaoVentilacao">Ventilação</label>
          </div>
           <div className="form-check-item">
            <input type="checkbox" id="acaoResfriamento" name="incendio.acoes.resfriamento" checked={formData.incendio?.acoes?.resfriamento || false} onChange={handleChange} />
            <label htmlFor="acaoResfriamento">Resfriamento</label>
          </div>
          {/* Adicione os outros checkboxes do campo 11 aqui... */}
        </div>

        {/* Campo 12 do Manual */}
        <label className="sub-legend" style={{ marginTop: '24px' }}>Recursos Hídricos Utilizados</label>
        <div className="checkbox-grid-4-col">
          <div className="form-check-item">
            <input type="checkbox" id="recursoHidranteUrbano" name="incendio.recursos.hidranteUrbano" checked={formData.incendio?.recursos?.hidranteUrbano || false} onChange={handleChange} />
            <label htmlFor="recursoHidranteUrbano">Hidrante urbano</label>
          </div>
          <div className="form-check-item">
            <input type="checkbox" id="recursoAguaTransportada" name="incendio.recursos.aguaTransportada" checked={formData.incendio?.recursos?.aguaTransportada || false} onChange={handleChange} />
            <label htmlFor="recursoAguaTransportada">Água transportada</label>
          </div>
          <div className="form-check-item">
            <input type="checkbox" id="recursoRio" name="incendio.recursos.rio" checked={formData.incendio?.recursos?.rio || false} onChange={handleChange} />
            <label htmlFor="recursoRio">Rio</label>
          </div>
           <div className="form-check-item">
            <input type="checkbox" id="recursoPiscina" name="incendio.recursos.piscina" checked={formData.incendio?.recursos?.piscina || false} onChange={handleChange} />
            <label htmlFor="recursoPiscina">Piscina</label>
          </div>
           {/* Adicione os outros checkboxes do campo 12 aqui... */}
        </div>
      </fieldset>
      
      {/* --- BOTÕES DE AÇÃO --- */}
      <div className="form-actions">
        <button type="button" className="button-cancel" onClick={handleCancel}>
          Cancelar
        </button>
        <button type="submit" className="submit-button">
          {submitText}
        </button>
      </div>

    </form>
  );
};

export default FormularioIncendio;