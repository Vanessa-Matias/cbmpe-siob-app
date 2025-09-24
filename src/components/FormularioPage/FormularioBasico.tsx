/**
 * @file FormularioBasico.tsx
 * @description Componente que renderiza a primeira etapa do formulário de ocorrência (dados básicos).
 */

import React from 'react';

/**
 * Componente funcional FormularioBasico.
 * Contém os campos essenciais para qualquer tipo de ocorrência.
 */
const FormularioBasico = () => {
  return (
    <div className="form-step-container">
      <h3>1. Informações Básicas</h3>
      <div className="form-grid">
        {/* Linha 1: Dados da Viatura e Aviso */}
        <div className="form-group">
          <label htmlFor="viatura">Viatura Responsável</label>
          <input type="text" id="viatura" />
        </div>
        <div className="form-group">
          <label htmlFor="num-aviso">Nº do Aviso (B)</label>
          <input type="text" id="num-aviso" />
        </div>
        <div className="form-group">
          <label htmlFor="data-aviso">Data do Aviso</label>
          <input type="date" id="data-aviso" />
        </div>
        <div className="form-group">
          <label htmlFor="hora-recebimento">Hora Recebimento</label>
          <input type="time" id="hora-recebimento" />
        </div>

        {/* Linha 2: Endereço */}
        <div className="form-group full-width">
          <label htmlFor="endereco">Endereço (Rua/Avenida, Nº)</label>
          <input type="text" id="endereco" />
        </div>
        <div className="form-group">
          <label htmlFor="bairro">Bairro</label>
          <input type="text" id="bairro" />
        </div>
        <div className="form-group">
          <label htmlFor="municipio">Município</label>
          <input type="text" id="municipio" />
        </div>

        {/* Linha 3: Histórico */}
        <div className="form-group full-width">
          <label htmlFor="historico">Histórico da Ocorrência</label>
          <textarea id="historico" rows={5}></textarea>
        </div>
      </div>
      
      {/* Botões de navegação do formulário */}
      <div className="form-actions">
        <button className="button-secondary" type="button">Cancelar</button>
        <button className="button-primary" type="button">Próxima Etapa</button>
      </div>
    </div>
  );
};

export default FormularioBasico;