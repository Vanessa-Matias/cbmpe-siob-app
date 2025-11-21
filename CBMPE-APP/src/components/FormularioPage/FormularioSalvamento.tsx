/**
 * @file FormularioSalvamento.tsx
 * @description Formulário específico para ocorrências de salvamento.
 * Autora: Vanessa Matias 💻
 */

import React from 'react';
import './FormularioSalvamento.css';

type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  submitText: string;
};

const FormularioSalvamento: React.FC<Props> = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
  submitText,
}) => {
  
  // --- BLINDAGEM DE DADOS ---
  // Garante acesso seguro aos objetos aninhados
  const salvamentoData = formData.salvamento || {};
  const grupos = salvamentoData.grupos || {};
  const tipo = salvamentoData.tipo || {};
  const vitimas = salvamentoData.vitimas || {};
  const acoes = salvamentoData.acoes || {};

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {/* --- CABEÇALHO --- */}
      <div className="form-section-header-salvamento">
        <h3>Natureza 3: Salvamento</h3>
      </div>


    {/* ---  SEÇÃO DE GRUPOS DE OCORRÊNCIA (Campo 04 do Manual) --- */}
    <fieldset>
  <legend>Grupo da Ocorrência (O que está envolvido no evento?)</legend>
  
  {/* Agora com layout consistente em 3 colunas */}
  <div className="checkbox-grid-3-col"> 
    <div className="form-check-item">
      <input
        type="checkbox"
        id="grupoPessoa"
        name="salvamento.grupos.pessoa"
        checked={grupos.pessoa || false}
        onChange={handleChange}
      />
      <label htmlFor="grupoPessoa">Evento com Pessoa</label>
    </div>

    <div className="form-check-item">
      <input
        type="checkbox"
        id="grupoAnimal"
        name="salvamento.grupos.animal"
        checked={grupos.animal || false}
        onChange={handleChange}
      />
      <label htmlFor="grupoAnimal">Evento com Animal</label>
    </div>

    <div className="form-check-item">
      <input
        type="checkbox"
        id="grupoObjeto"
        name="salvamento.grupos.objeto"
        checked={grupos.objeto || false}
        onChange={handleChange}
      />
      <label htmlFor="grupoObjeto">Evento com Objeto</label>
    </div>

    <div className="form-check-item">
      <input
        type="checkbox"
        id="grupoCadaver"
        name="salvamento.grupos.cadaver"
        checked={grupos.cadaver || false}
        onChange={handleChange}
      />
      <label htmlFor="grupoCadaver">Evento com Cadáver</label>
    </div>

    <div className="form-check-item">
      <input
        type="checkbox"
        id="grupoTransporte"
        name="salvamento.grupos.meioTransporte"
        checked={grupos.meioTransporte || false}
        onChange={handleChange}
      />
      <label htmlFor="grupoTransporte">Evento com Meio de Transporte</label>
    </div>

    <div className="form-check-item">
      <input
        type="checkbox"
        id="grupoArvore"
        name="salvamento.grupos.arvore"
        checked={grupos.arvore || false}
        onChange={handleChange}
      />
      <label htmlFor="grupoArvore">Evento com Árvore</label>
    </div>

    <div className="form-check-item">
      <input
        type="checkbox"
        id="grupoOutro"
        name="salvamento.grupos.outro"
        checked={grupos.outro || false}
        onChange={handleChange}
      />
      <label htmlFor="grupoOutro">Outro</label>
    </div>
  </div>
</fieldset>


      {/* --- SEÇÃO: Tipo de Salvamento --- */}
      <fieldset>
        <legend>Tipo de Salvamento</legend>
        <div className="checkbox-grid-4-col">
          <div className="form-check-item">
            <input
              type="checkbox"
              id="salvamentoAltura"
              name="salvamento.tipo.altura"
              checked={tipo.altura || false}
              onChange={handleChange}
            />
            <label htmlFor="salvamentoAltura">Em Altura</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="salvamentoAquatico"
              name="salvamento.tipo.aquatico"
              checked={tipo.aquatico || false}
              onChange={handleChange}
            />
            <label htmlFor="salvamentoAquatico">Aquático</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="salvamentoVeicular"
              name="salvamento.tipo.veicular"
              checked={tipo.veicular || false}
              onChange={handleChange}
            />
            <label htmlFor="salvamentoVeicular">Veicular</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="salvamentoConfinado"
              name="salvamento.tipo.confinado"
              checked={tipo.confinado || false}
              onChange={handleChange}
            />
            <label htmlFor="salvamentoConfinado">Espaço Confinado</label>
          </div>
        </div>
      </fieldset>

      {/* --- SEÇÃO: Recursos e Detalhes --- */}
      <fieldset>
        <legend>Detalhes Operacionais</legend>
        <div className="form-group-grid-4-col">
          <div className="form-group">
            <label htmlFor="vitimasSocorridas">Vítimas Socorridas</label>
            <input
              type="number"
              id="vitimasSocorridas"
              name="salvamento.vitimas.socorridas"
              value={vitimas.socorridas || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vitimasFatais">Vítimas Fatais</label>
            <input
              type="number"
              id="vitimasFatais"
              name="salvamento.vitimas.fatais"
              value={vitimas.fatais || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tempoResgate">Tempo de Resgate (hh:mm)</label>
            <input
              type="text"
              id="tempoResgate"
              name="salvamento.tempoResgate"
              value={salvamentoData.tempoResgate || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="equipamentosUsados">Equipamentos Usados</label>
            <input
              type="text"
              id="equipamentosUsados"
              name="salvamento.equipamentosUsados"
              value={salvamentoData.equipamentosUsados || ''}
              onChange={handleChange}
              placeholder="Ex: Corda, macas, cilindros..."
            />
          </div>
        </div>
      </fieldset>

      {/* --- SEÇÃO: Ações Realizadas --- */}
      <fieldset>
        <legend>Ações Realizadas</legend>
        <div className="checkbox-grid-4-col">
          <div className="form-check-item">
            <input
              type="checkbox"
              id="acaoRetiradaVitima"
              name="salvamento.acoes.retiradaVitima"
              checked={acoes.retiradaVitima || false}
              onChange={handleChange}
            />
            <label htmlFor="acaoRetiradaVitima">Retirada de vítima</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="acaoEstabilizacao"
              name="salvamento.acoes.estabilizacao"
              checked={acoes.estabilizacao || false}
              onChange={handleChange}
            />
            <label htmlFor="acaoEstabilizacao">Estabilização de veículo</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="acaoAtendimento"
              name="salvamento.acoes.atendimento"
              checked={acoes.atendimento || false}
              onChange={handleChange}
            />
            <label htmlFor="acaoAtendimento">Atendimento Pré-Hospitalar</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="acaoOutros"
              name="salvamento.acoes.outros"
              checked={acoes.outros || false}
              onChange={handleChange}
            />
            <label htmlFor="acaoOutros">Outros</label>
          </div>
        </div>
      </fieldset>

      {/* --- BOTÕES --- */}
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

export default FormularioSalvamento;