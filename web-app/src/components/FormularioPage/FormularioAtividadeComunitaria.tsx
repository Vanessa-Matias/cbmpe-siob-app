/**
 * @file FormularioAtividadeComunitaria.tsx
 * @description Componente de apresentação para o Formulário de Atividade Comunitária (Natureza 6).
 * Segue o padrão de design PWA e a cor Azul da paleta (Natureza 6)
 * Autora: Vanessa Matias 💻.
 */
import React from 'react';
import './FormularioAtividadeComunitaria.css';

// Props padrão de integração entre os formulários
type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  submitText: string;
};

const FormularioAtividadeComunitaria: React.FC<Props> = ({ formData, handleChange, handleSubmit, handleCancel, submitText }) => {
  
  // --- BLINDAGEM DE DADOS ---
  // Garante acesso seguro aos objetos aninhados para evitar undefined
  const comunitariaData = formData.comunitaria || {};
  const apoio = comunitariaData.apoio || {};
  const educativa = comunitariaData.educativa || {};

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      
      {/* CABEÇALHO AZUL (Natureza 6: Atividade Comunitária) */}
      <div className="form-section-header-comunitaria">
        <h3>Natureza 6: Atividade Comunitária</h3>
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
              name="comunitaria.nomeEvento" 
              value={comunitariaData.nomeEvento || ''} 
              onChange={handleChange} 
              placeholder="Ex: Ação cívico-social / Palestra" 
            />
          </div>
          {/* Item 04: Hora Chegada */}
          <div className="form-group">
            <label htmlFor="horaChegada">Hora Chegada</label>
            <input 
              type="time" 
              id="horaChegada" 
              name="comunitaria.horaChegada" 
              value={comunitariaData.horaChegada || ''} 
              onChange={handleChange} 
            />
          </div>
          {/* Item 04a: Hora Início */}
          <div className="form-group">
            <label htmlFor="horaInicio">Hora Início</label>
            <input 
              type="time" 
              id="horaInicio" 
              name="comunitaria.horaInicio" 
              value={comunitariaData.horaInicio || ''} 
              onChange={handleChange} 
            />
          </div>
          {/* Item 04b: Hora Saída */}
          <div className="form-group">
            <label htmlFor="horaSaida">Hora Saída</label>
            <input 
              type="time" 
              id="horaSaida" 
              name="comunitaria.horaSaida" 
              value={comunitariaData.horaSaida || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="form-group-grid-2-col" style={{ marginTop: '1rem' }}>
          {/* Item 05a: Público Estimado */}
          <div className="form-group">
            <label htmlFor="publicoEst">Público Estimado</label>
            <input 
              type="number" 
              id="publicoEst" 
              name="comunitaria.publicoEstimado" 
              value={comunitariaData.publicoEstimado || ''} 
              onChange={handleChange} 
              placeholder="Ex: 500 pessoas" 
            />
          </div>
          {/* Item 05a: Público Presente */}
          <div className="form-group">
            <label htmlFor="publicoPres">Público Presente</label>
            <input 
              type="number" 
              id="publicoPres" 
              name="comunitaria.publicoPresente" 
              value={comunitariaData.publicoPresente || ''} 
              onChange={handleChange} 
              placeholder="Ex: 200 pessoas" 
            />
          </div>
        </div>
      </fieldset>

      {/* SEÇÃO TIPO DE ATIVIDADE (Natureza 6 - Grupos) */}
      <fieldset>
        <legend>Grupo da Atividade</legend>
        <div className="checkbox-grid-3-col"> 
          {/* Grupo 1: Apoio Social */}
          <div className="form-check-item">
            <input 
              type="radio" 
              id="gApoioSocial" 
              name="comunitaria.grupo" 
              value="apoioSocial" 
              checked={comunitariaData.grupo === 'apoioSocial'} 
              onChange={handleChange} 
            />
            <label htmlFor="gApoioSocial">Apoio Social</label>
          </div>
          {/* Grupo 2: Interação Educativa */}
          <div className="form-check-item">
            <input 
              type="radio" 
              id="gInteracaoEducativa" 
              name="comunitaria.grupo" 
              value="interacaoEducativa" 
              checked={comunitariaData.grupo === 'interacaoEducativa'} 
              onChange={handleChange} 
            />
            <label htmlFor="gInteracaoEducativa">Interação Educativa</label>
          </div>
          {/* Grupo 3: Interação Religiosa */}
          <div className="form-check-item">
            <input 
              type="radio" 
              id="gInteracaoReligiosa" 
              name="comunitaria.grupo" 
              value="interacaoReligiosa" 
              checked={comunitariaData.grupo === 'interacaoReligiosa'} 
              onChange={handleChange} 
            />
            <label htmlFor="gInteracaoReligiosa">Interação Religiosa</label>
          </div>
        </div>
      </fieldset>

      {/* SEÇÃO DETALHES DAS AÇÕES (Subgrupos de 6.1 e 6.2) */}
      <fieldset>
        <legend>Ações Específicas</legend>
        
        <p className="sub-legend">Subgrupo 1: Apoio Social</p>
        <div className="checkbox-grid-3-col">
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="aAbastecimentoAgua" 
              name="comunitaria.apoio.abastecimentoAgua" 
              checked={apoio.abastecimentoAgua || false} 
              onChange={handleChange} 
            />
            <label htmlFor="aAbastecimentoAgua">Abastecimento de água</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="aAcaoCivicoSocial" 
              name="comunitaria.apoio.acaoCivicoSocial" 
              checked={apoio.acaoCivicoSocial || false} 
              onChange={handleChange} 
            />
            <label htmlFor="aAcaoCivicoSocial">Ação cívico-social</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="aBanhoNeblina" 
              name="comunitaria.apoio.banhoNeblina" 
              checked={apoio.banhoNeblina || false} 
              onChange={handleChange} 
            />
            <label htmlFor="aBanhoNeblina">Banho de Neblina</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="aTranspObeso" 
              name="comunitaria.apoio.transpObeso" 
              checked={apoio.transpObeso || false} 
              onChange={handleChange} 
            />
            <label htmlFor="aTranspObeso">Transporte de Obeso</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="aVisitaPreventiva" 
              name="comunitaria.apoio.visitaPreventiva" 
              checked={apoio.visitaPreventiva || false} 
              onChange={handleChange} 
            />
            <label htmlFor="aVisitaPreventiva">Visita preventiva</label>
          </div>
        </div>
        
        <p className="sub-legend" style={{ marginTop: '24px' }}>Subgrupo 2: Interação Educativa </p>
        <div className="checkbox-grid-3-col">
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="eDemonstracao" 
              name="comunitaria.educativa.demonstracao" 
              checked={educativa.demonstracao || false} 
              onChange={handleChange} 
            />
            <label htmlFor="eDemonstracao">Demonstração</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="ePalestra" 
              name="comunitaria.educativa.palestra" 
              checked={educativa.palestra || false} 
              onChange={handleChange} 
            />
            <label htmlFor="ePalestra">Palestra</label>
          </div>
          <div className="form-check-item">
            <input 
              type="checkbox" 
              id="eTreinamento" 
              name="comunitaria.educativa.treinamento" 
              checked={educativa.treinamento || false} 
              onChange={handleChange} 
            />
            <label htmlFor="eTreinamento">Treinamento</label>
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

export default FormularioAtividadeComunitaria;