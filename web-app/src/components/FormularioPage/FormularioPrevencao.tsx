/**
 * @file FormularioPrevencao.tsx
 * @description Componente de apresentação para o Formulário de Prevenção (Natureza 5).
 * Implementa campos e ações do Item 7.8 do MOp.002, com design PWA.
 * Autora: Vanessa Matias 💻
 */
import React from 'react';
import './FormularioPrevencao.css';

type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  submitText: string;
};

const FormularioPrevencao: React.FC<Props> = ({ formData, handleChange, handleSubmit, handleCancel, submitText }) => {
  
  // --- BLINDAGEM DE DADOS ---
  // Garante acesso seguro aos objetos aninhados
  const prevencaoData = formData.prevencao || {};
  const aquatica = prevencaoData.aquatica || {};
  const servicos = prevencaoData.servicos || {};

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      
      {/* CABEÇALHO VERDE (Natureza 5: Prevenção) */}
      <div className="form-section-header-prevencao">
        <h3>Natureza 5: Prevenção</h3>
      </div>

      {/* SEÇÃO DADOS DO EVENTO (Item 03, 04) */}
      <fieldset>
        <legend>Dados e Público do Evento</legend>
        <div className="form-group-grid-4-col">
          {/* Item 03: Nome do Evento */}
          <div className="form-group">
            <label htmlFor="nomeEvento">Nome do Evento</label>
            <input 
              type="text" 
              id="nomeEvento" 
              name="prevencao.nomeEvento" 
              value={prevencaoData.nomeEvento || ''} 
              onChange={handleChange} 
              placeholder="Ex: Prevenção na orla" 
            />
          </div>

          {/* Item 03a: Hora Chegada */}
          <div className="form-group">
            <label htmlFor="horaChegada">Hora Chegada</label>
            <input 
              type="time" 
              id="horaChegada" 
              name="prevencao.horaChegada" 
              value={prevencaoData.horaChegada || ''} 
              onChange={handleChange} 
            />
          </div>

          {/* Item 03b: Hora Início */}
          <div className="form-group">
            <label htmlFor="horaInicio">Hora Início</label>
            <input 
              type="time" 
              id="horaInicio" 
              name="prevencao.horaInicio" 
              value={prevencaoData.horaInicio || ''} 
              onChange={handleChange} 
            />
          </div>

          {/* Item 03c: Hora Saída */}
          <div className="form-group">
            <label htmlFor="horaSaida">Hora Saída</label>
            <input 
              type="time" 
              id="horaSaida" 
              name="prevencao.horaSaida" 
              value={prevencaoData.horaSaida || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="form-group-grid-2-col" style={{ marginTop: '1rem' }}>

          {/* Item 06d: Público Estimado */}
          <div className="form-group">
            <label htmlFor="publicoEst">Público Estimado</label>
            <input 
              type="number" 
              id="publicoEst" 
              name="prevencao.publicoEstimado" 
              value={prevencaoData.publicoEstimado || ''} 
              onChange={handleChange} 
              placeholder="Ex: 500 Pessoas" 
            />
          </div>

          {/* Item 06e: Público Presente */}
          <div className="form-group">
            <label htmlFor="publicoPres">Público Presente</label>
            <input 
              type="number" 
              id="publicoPres" 
              name="prevencao.publicoPresente" 
              value={prevencaoData.publicoPresente || ''} 
              onChange={handleChange} 
              placeholder="Ex: 450 Pessoas" 
            />
          </div>
        </div>

        <div className="form-group-grid-2-col" style={{ marginTop: '1rem' }}>

          {/* Item 04: Evento Regularizado? */}
          <div className="form-group">
              <label className="label-select-group" style={{ marginBottom: '10px', display: 'block' }}>
                  Evento Regularizado?
              </label>
              <div className="form-group-grid-2-col" style={{ gap: '10px' }}>
  <div className="form-check-item">
    <input 
      type="radio" 
      id="regSim" 
      name="prevencao.regularizado" 
      value="Sim" 
      checked={prevencaoData.regularizado === 'Sim'} 
      onChange={handleChange} 
    />
    <label htmlFor="regSim">Sim</label>
  </div>

  <div className="form-check-item">
    <input 
      type="radio" 
      id="regNao" 
      name="prevencao.regularizado" 
      value="Não" 
      checked={prevencaoData.regularizado === 'Não'} 
      onChange={handleChange} 
    />
    <label htmlFor="regNao">Não</label>
  </div>
</div>

          </div>

          {/* Item 06: AR/AVCB (Simplificado) */}
          <div className="form-group">
            <label htmlFor="situacaoAvcb">Situação AR/AVCB</label>
            <select 
              id="situacaoAvcb" 
              name="prevencao.situacaoAvcb" 
              value={prevencaoData.situacaoAvcb || ''} 
              onChange={handleChange}
            >
                <option value="">Selecione</option>
                <option value="Valido">Válido</option>
                <option value="Vencido">Vencido</option>
                <option value="NaoLocalizado">Não Localizado</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* SEÇÃO TIPO DE ATIVIDADE (Item 09) */}
      <fieldset>
        <legend>Tipo de Atividade</legend>
        
        <p className="sub-legend">Prevenção Aquática</p>
        <div className="checkbox-grid-3-col">
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="pAtivaReativa" 
              name="prevencao.aquatica.ativaReativa" 
              checked={aquatica.ativaReativa || false} 
              onChange={handleChange} 
            />
            <label htmlFor="pAtivaReativa">Ativa e Reativa</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="pOrlaMaritima" 
              name="prevencao.aquatica.orlaMaritima" 
              checked={aquatica.orlaMaritima || false} 
              onChange={handleChange} 
            />
            <label htmlFor="pOrlaMaritima">Prevenção em Orla Marítima</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="pRio" 
              name="prevencao.aquatica.rio" 
              checked={aquatica.rio || false} 
              onChange={handleChange} 
            />
            <label htmlFor="pRio">Prevenção em Rio</label>
          </div>
        </div>
        
        <p className="sub-legend" style={{ marginTop: '24px' }}>Serviços Realizados</p>
        <div className="checkbox-grid-3-col">
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="sOrientacao" 
              name="prevencao.servicos.orientacaoVerbal" 
              checked={servicos.orientacaoVerbal || false} 
              onChange={handleChange} 
            />
            <label htmlFor="sOrientacao">Orientação verbal de segurança</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="sSinalizacao" 
              name="prevencao.servicos.sinalizacao" 
              checked={servicos.sinalizacao || false} 
              onChange={handleChange} 
            />
            <label htmlFor="sSinalizacao">Sinalização de área de risco</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="sIsolamento" 
              name="prevencao.servicos.isolamento" 
              checked={servicos.isolamento || false} 
              onChange={handleChange} 
            />
            <label htmlFor="sIsolamento">Isolamento de área de risco</label>
          </div>
        </div>
      </fieldset>

      {/* BOTÕES DE AÇÃO */}
      <div className="form-actions">
        <button type="button" className="button-cancel" onClick={handleCancel}>Voltar ao Básico</button>
        <button type="submit" className="submit-button">{submitText}</button>
      </div>

    </form>
  );
};

export default FormularioPrevencao;