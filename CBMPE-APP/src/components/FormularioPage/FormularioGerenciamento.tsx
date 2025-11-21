/**
 * @file FormularioGerenciamento.tsx
 * @description Formulário de Gerenciamento (SCI-1 Briefing da Emergência).
 * Usado pelo Comandante da Operação para registrar situação e recursos (Item 818).
 * Autora: Vanessa Matias 💻.
 */
import React from 'react';
import './FormularioGerenciamento.css';

type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  submitText: string;
};

const FormularioGerenciamento: React.FC<Props> = ({ formData, handleChange, handleSubmit, handleCancel, submitText }) => {
  
  // --- BLINDAGEM DE DADOS ---
  // Garante que o objeto de gerenciamento exista antes de acessar suas propriedades
  const gerenciamentoData = formData.gerenciamento || {};

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      
      {/* CABEÇALHO MARROM (Cor de Gerenciamento/Controle) */}
      <div className="form-section-header-gerenciamento">
        <h3>Formulário de Gerenciamento (SCI-1 Briefing da Emergência)</h3>
      </div>

      {/* SEÇÃO 1: SITUAÇÃO E OBJETIVOS (Item 818) */}
      <fieldset>
        <legend>Situação e Objetivos Operacionais</legend>
        
        {/* Situação Atual */}
        <div className="form-group">
          <label htmlFor="situacaoAtual">Situação Atual / Sumário dos Problemas</label>
          <textarea 
            id="situacaoAtual" 
            name="gerenciamento.situacaoAtual" 
            rows={4} 
            value={gerenciamentoData.situacaoAtual || ''} 
            onChange={handleChange} 
            placeholder="Descreva a emergência, forças e fraquezas."
          ></textarea>
        </div>
        
        {/* Objetivos e Ações Planejadas */}
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label htmlFor="objetivos">Objetivos e Ações Implementadas/Planejadas</label>
          <textarea 
            id="objetivos" 
            name="gerenciamento.objetivos" 
            rows={4} 
            value={gerenciamentoData.objetivos || ''} 
            onChange={handleChange} 
            placeholder="Defina os objetivos (e.g., Confine, Resgate) e as próximas ações."
          ></textarea>
        </div>
      </fieldset>

      {/* SEÇÃO 2: RECURSOS E EFETIVO (Item 5.3.1.1) */}
      <fieldset>
        <legend>Força e Recursos Operacionais</legend>
        <div className="form-group-grid-4-col">
          
          {/* Nº de Bombeiros Empregados */}
          <div className="form-group">
            <label htmlFor="bmEmpregados">Nº BM Empregados</label>
            <input 
              type="number" 
              id="bmEmpregados" 
              name="gerenciamento.bmEmpregados" 
              value={gerenciamentoData.bmEmpregados || ''} 
              onChange={handleChange} 
              placeholder="Efetivo Total" 
            />
          </div>
          
          {/* Nº de Viaturas Empregadas */}
          <div className="form-group">
            <label htmlFor="viaturasEmpregadas">Nº Viaturas Empregadas</label>
            <input 
              type="number" 
              id="viaturasEmpregadas" 
              name="gerenciamento.viaturasEmpregadas" 
              value={gerenciamentoData.viaturasEmpregadas || ''} 
              onChange={handleChange} 
              placeholder="Total de VTRs" 
            />
          </div>
          
          {/* Nº de Embarcações Empregadas */}
          <div className="form-group">
            <label htmlFor="embarcacoesEmpregadas">Nº Embarcações</label>
            <input 
              type="number" 
              id="embarcacoesEmpregadas" 
              name="gerenciamento.embarcacoesEmpregadas" 
              value={gerenciamentoData.embarcacoesEmpregadas || ''} 
              onChange={handleChange} 
              placeholder="Se aplicável" 
            />
          </div>

          {/* Orgãos Envolvidos (Simplificado) */}
          <div className="form-group">
            <label htmlFor="orgaosEnvolvidos">Órgãos Envolvidos</label>
            <input 
              type="text" 
              id="orgaosEnvolvidos" 
              name="gerenciamento.orgaosEnvolvidos" 
              value={gerenciamentoData.orgaosEnvolvidos || ''} 
              onChange={handleChange} 
              placeholder="Ex: SAMU, PMPE, Defesa Civil" 
            />
          </div>
        </div>
        
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label htmlFor="recursosSolicitados">Recursos Adicionais Solicitados</label>
          <input 
            type="text" 
            id="recursosSolicitados" 
            name="gerenciamento.recursosSolicitados" 
            value={gerenciamentoData.recursosSolicitados || ''} 
            onChange={handleChange} 
            placeholder="Descreva os recursos que ainda faltam ou foram pedidos" 
          />
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

export default FormularioGerenciamento;