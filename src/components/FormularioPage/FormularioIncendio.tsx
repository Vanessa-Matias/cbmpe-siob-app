/**
 * @file FormularioIncendio.tsx
 * @description Componente de apresentação para o formulário de Incêndio.
 */
import React from 'react';
import './FormularioIncendio.css';

// Define o "contrato" de props que este componente espera receber.
type Props = {
  formData: any;
  // aceitar também textarea (para campos como textarea de bens atingidos)
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
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
        <div className="checkbox-grid-2-col"> 
          <div className="form-check-item">
            <input 
              type="radio" 
              id="grupoEdificacao" 
              name="incendio.grupo" // Nome compartilhado
              value="edificacao"
              checked={formData.incendio?.grupo === 'edificacao'} 
              onChange={handleChange}
              required={true}
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
        </div>
      </fieldset>

      {/* Detalhes condicionais (paridade com PWA) */}
      {formData.incendio?.grupo === 'edificacao' && (
        <fieldset id="detalhesEdificacao">
          <legend>Detalhes da Edificação</legend>
          <div className="form-group">
            <label htmlFor="origemIncendio">Área presumida da origem do incêndio</label>
            <input type="text" id="origemIncendio" name="incendio.edificacao.origem" placeholder="Ex: Quarto, Cozinha" value={formData.incendio?.edificacao?.origem || ''} onChange={handleChange} />
          </div>
          <div className="form-group-grid-4-col" style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label htmlFor="areaAtingida">Área Atingida (m²)</label>
              <input type="number" id="areaAtingida" name="incendio.edificacao.areaAtingida" value={formData.incendio?.edificacao?.areaAtingida || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="areaTotal">Área Total (m²)</label>
              <input type="number" id="areaTotal" name="incendio.edificacao.areaTotal" value={formData.incendio?.edificacao?.areaTotal || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Pavimentos Atingidos</label>
              <div className="input-pair">
                <input type="number" name="incendio.edificacao.pavimentoDe" placeholder="De" value={formData.incendio?.edificacao?.pavimentoDe || ''} onChange={handleChange} />
                <input type="number" name="incendio.edificacao.pavimentoAte" placeholder="Até" value={formData.incendio?.edificacao?.pavimentoAte || ''} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="classeIncendio">Classe Predominante</label>
              <select id="classeIncendio" name="incendio.edificacao.classe" value={formData.incendio?.edificacao?.classe || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="K">K</option>
              </select>
            </div>
          </div>
        </fieldset>
      )}

      {formData.incendio?.grupo === 'vegetacao' && (
        <fieldset id="detalhesVegetacao">
          <legend>Detalhes da Vegetação</legend>
          <div className="form-check-item">
            <input type="checkbox" id="apa" name="incendio.vegetacao.apa" checked={formData.incendio?.vegetacao?.apa || false} onChange={handleChange} />
            <label htmlFor="apa">Área de Proteção Ambiental (APA)</label>
          </div>
          <div className="form-group-grid-2-col" style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label htmlFor="areaVegAtingida">Área Atingida (m² ou ha)</label>
              <input type="number" id="areaVegAtingida" name="incendio.vegetacao.areaAtingida" value={formData.incendio?.vegetacao?.areaAtingida || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="areaVegNaoAtingida">Área Não Atingida (m² ou ha)</label>
              <input type="number" id="areaVegNaoAtingida" name="incendio.vegetacao.areaNaoAtingida" value={formData.incendio?.vegetacao?.areaNaoAtingida || ''} onChange={handleChange} />
            </div>
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend>Detalhes Operacionais</legend>
        <div className="form-group-grid-4-col">
          <div className="form-group">
            <label htmlFor="tempoExtincao">Tempo de Extinção (hh:mm)</label>
            <input type="text" id="tempoExtincao" name="incendio.operacao.tempoExtincao" placeholder="01:30" value={formData.incendio?.operacao?.tempoExtincao || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="tempoRescaldo">Tempo de Rescaldo (hh:mm)</label>
            <input type="text" id="tempoRescaldo" name="incendio.operacao.tempoRescaldo" placeholder="00:45" value={formData.incendio?.operacao?.tempoRescaldo || ''} onChange={handleChange} />
          </div>

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

      <fieldset>
        <legend>Preventivos Existentes na Edificação</legend>
        <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>(Em desenvolvimento - Adicionar a tabela completa de preventivos aqui)</p>
      </fieldset>

      <fieldset>
        <legend>Regularização e Atuação Anterior</legend>
        <div className="form-group-grid-2-col">
          <div className="form-group">
            <label htmlFor="regularizacaoAvcb">Situação do AR/AVCB</label>
            <select id="regularizacaoAvcb" name="incendio.regularizacao.avcbStatus" value={formData.incendio?.regularizacao?.avcbStatus || ''} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="valido">Válido</option>
              <option value="vencido">Vencido</option>
              <option value="nao_localizado">Não Localizado</option>
              <option value="nao_se_aplica">Não se Aplica</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="atuacaoAnterior">Atuação Anterior ao CBMPE</label>
            <select id="atuacaoAnterior" name="incendio.regularizacao.atuacaoAnterior" value={formData.incendio?.regularizacao?.atuacaoAnterior || ''} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="nao_houve">Não Houve</option>
              <option value="leigos">Leigos</option>
              <option value="brigada">Brigada</option>
              <option value="bombeiro_civil">Bombeiro Civil</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Bens Atingidos</legend>
        <div className="form-group">
          <label htmlFor="bensAtingidos">Descrição dos bens móveis/imóveis atingidos</label>
          <textarea id="bensAtingidos" name="incendio.bens.atingidos" rows={4} placeholder="Ex: 1 sofá, 1 TV, parte do telhado..." value={formData.incendio?.bens?.atingidos || ''} onChange={handleChange}></textarea>
        </div>
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label htmlFor="bensEntreguesA">Bens recolhidos entregues a:</label>
          <input type="text" id="bensEntreguesA" name="incendio.bens.entreguesA" placeholder="Nome do responsável" value={formData.incendio?.bens?.entreguesA || ''} onChange={handleChange} />
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