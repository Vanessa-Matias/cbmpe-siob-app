/**
 * @file FormularioProdutoPerigoso.tsx
 * @description Componente de apresentação para o Formulário de Produtos Perigosos (Natureza 4).
 * Implementa campos cruciais para registro de acidentes com PP (Item 7.7 do MOp.002).
 * Autora: Vanessa Matias 💻.
 */
import React from 'react';
import './FormularioProdutoPerigoso.css';

type Props = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  submitText: string;
};

const FormularioProdutoPerigoso: React.FC<Props> = ({ formData, handleChange, handleSubmit, handleCancel, submitText }) => {
  
  // Helper para ler os dados de forma segura
  // formData.produtoPerigoso já foi inicializado como {} no FormularioPage
  const ppData = formData.produtoPerigoso || {};

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      
      {/* CABEÇALHO AMARELO (Natureza 4: Produtos Perigosos) */}
      <div className="form-section-header-pp">
        <h3 style={{ color: '#333' }}>Natureza 4: Produtos Perigosos</h3>
      </div>

      {/* SEÇÃO IDENTIFICAÇÃO DO PRODUTO (Item 08, 08a, 08b) */}
      <fieldset>
        <legend>Identificação do Produto</legend>
        <div className="form-group-grid-4-col">
          {/* Item 08: Nome do Produto */}
          <div className="form-group"><label htmlFor="nomeProduto">Nome do Produto</label><input type="text" id="nomeProduto" name="produtoPerigoso.produto.nome" value={ppData.produto?.nome || ''} onChange={handleChange} placeholder="Ex: GLP, Gasolina..." /></div>

          {/* Item 08a: Nº ONU */}
          <div className="form-group"><label htmlFor="numONU">Nº ONU</label><input type="text" id="numONU" name="produtoPerigoso.produto.numONU" value={ppData.produto?.numONU || ''} onChange={handleChange} placeholder="Ex: 1075" /></div>

          {/* Item 08b: Classe de Risco */}
          <div className="form-group"><label htmlFor="classeRisco">Classe de Risco</label><input type="text" id="classeRisco" name="produtoPerigoso.produto.classeRisco" value={ppData.produto?.classeRisco || ''} onChange={handleChange} placeholder="Ex: 2.1" /></div>

          {/* Item 08f: Estado Físico */}
          <div className="form-group">
            <label htmlFor="estadoFisico">Estado Físico</label>
            <select id="estadoFisico" name="produtoPerigoso.produto.estadoFisico" value={ppData.produto?.estadoFisico || ''} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="solido">Sólido</option>
              <option value="liquido">Líquido</option>
              <option value="gasoso">Gasoso</option>
            </select>
          </div>
        </div>

        <div className="form-group-grid-4-col" style={{ marginTop: '1rem' }}>

          {/* Item 08c: Tipo de Recipiente (Texto livre para simplificação) */}
          <div className="form-group"><label htmlFor="tipoRecipiente">Tipo de Recipiente</label><input type="text" id="tipoRecipiente" name="produtoPerigoso.produto.tipoRecipiente" value={ppData.produto?.tipoRecipiente || ''} onChange={handleChange} placeholder="Ex: Tambor, Tancagem" /></div>

          {/* Item 08g: Responsável pelo Produto */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}><label htmlFor="respProduto">Responsável pelo Produto (Nome/Empresa)</label><input type="text" id="respProduto" name="produtoPerigoso.responsavel.nome" value={ppData.responsavel?.nome || ''} onChange={handleChange} placeholder="Nome do Responsável ou Razão Social" /></div>

          {/* Item 08h: CPF/CNPJ */}
          <div className="form-group"><label htmlFor="respCnpj">CPF/CNPJ</label><input type="text" id="respCnpj" name="produtoPerigoso.responsavel.cnpj" value={ppData.responsavel?.cnpj || ''} onChange={handleChange} placeholder="00.000.000/0000-00" /></div>
        </div>
      </fieldset>

      {/* SEÇÃO VOLUME/MASSA E CONSEQUÊNCIAS (Item 08d, 09) */}
      <fieldset>
        <legend>Volume, Área Afetada e Consequências</legend>
        <div className="form-group-grid-4-col">

          {/* Item 08d: Vazamento Estimado */}
          <div className="form-group"><label htmlFor="volumeVazado">Vazamento Estimado</label><input type="number" id="volumeVazado" name="produtoPerigoso.volume.vazado" value={ppData.volume?.vazado || ''} onChange={handleChange} placeholder="Volume liberado" /></div>

          {/* Item 08e: Volume Recipiente Afetado */}
          <div className="form-group"><label htmlFor="volumeAfetado">Volume Recipiente Afetado</label><input type="number" id="volumeAfetado" name="produtoPerigoso.volume.afetado" value={ppData.volume?.afetado || ''} onChange={handleChange} placeholder="Volume total" /></div>

          {/* Item 09f: Área Isolada */}
          <div className="form-group">
            <label htmlFor="areaIsolada">Área Isolada</label>
            {/* CORRIGIDO AQUI: Adicionado '?' em consequencias */}
            <input type="number" id="areaIsolada" name="produtoPerigoso.consequencias.areaIsolada" value={ppData.consequencias?.areaIsolada || ''} onChange={handleChange} placeholder="Tamanho da zona quente/morna" />
          </div>
          {/* Item 09g: Área Contaminada */}
          <div className="form-group">
            <label htmlFor="areaContaminada">Área Contaminada</label>
            {/* CORRIGIDO AQUI: Adicionado '?' em consequencias */}
            <input type="number" id="areaContaminada" name="produtoPerigoso.consequencias.areaContaminada" value={ppData.consequencias?.areaContaminada || ''} onChange={handleChange} placeholder="Área atingida pelo produto" />
          </div>
        </div>

        <p className="sub-legend">Pessoas Afetadas e Ambiente</p>
        <div className="form-group-grid-4-col">
          {/* Item 09a: Nº Contaminados */}
          <div className="form-group">
            <label htmlFor="numContaminados">Nº Contaminados</label>
            {/* CORRIGIDO AQUI: Adicionado '?' em consequencias */}
            <input type="number" id="numContaminados" name="produtoPerigoso.consequencias.contaminados" value={ppData.consequencias?.contaminados || ''} onChange={handleChange} placeholder="Pessoas com exposição física" />
          </div>
          {/* Item 09c: Nº Evacuados */}
          <div className="form-group">
            <label htmlFor="numEvacuados">Nº Evacuados</label>
            {/* CORRIGIDO AQUI: Adicionado '?' em consequencias */}
            <input type="number" id="numEvacuados" name="produtoPerigoso.consequencias.evacuados" value={ppData.consequencias?.evacuados || ''} onChange={handleChange} placeholder="Pessoas retiradas" />
          </div>
          {/* Item 09d: Nº Óbitos */}
          <div className="form-group">
            <label htmlFor="numObitos">Nº Óbitos</label>
            {/* CORRIGIDO AQUI: Adicionado '?' em consequencias */}
            <input type="number" id="numObitos" name="produtoPerigoso.consequencias.obitos" value={ppData.consequencias?.obitos || ''} onChange={handleChange} placeholder="Total de vítimas fatais" />
          </div>
          {/* Item 09e: Nº Feridos */}
          <div className="form-group">
            <label htmlFor="numFeridos">Nº Feridos</label>
            {/* CORRIGIDO AQUI: Adicionado '?' em consequencias */}
            <input type="number" id="numFeridos" name="produtoPerigoso.consequencias.feridos" value
={ppData.consequencias?.feridos || ''} onChange={handleChange} placeholder="Total de feridos" />
          </div>
        </div>

        <p className="sub-legend" style={{ marginTop: '24px' }}>Ambiente Afetado</p>
        <div className="checkbox-grid-4-col">
          {/* CORRIGIDO AQUI: Adicionado '?' em ambiente */}
          <div className="form-check-item"><input type="checkbox" id="aSolo" name="produtoPerigoso.ambiente.solo" checked={ppData.ambiente?.solo || false} onChange={handleChange} /><label htmlFor="aSolo">Solo</label></div>

          <div className="form-check-item"><input type="checkbox" id="aAtmosfera" name="produtoPerigoso.ambiente.atmosfera" checked={ppData.ambiente?.atmosfera || false} onChange={handleChange} /><label htmlFor="aAtmosfera">Atmosfera</label></div>

          <div className="form-check-item"><input type="checkbox" id="aMananciais" name="produtoPerigoso.ambiente.mananciais" checked={ppData.ambiente?.mananciais || false} onChange={handleChange} /><label htmlFor="aMananciais">Mananciais</label></div>

          <div className="form-check-item"><input type="checkbox" id="aEdificacoes" name="produtoPerigoso.ambiente.edificacoes" checked={ppData.ambiente?.edificacoes || false} onChange={handleChange} /><label htmlFor="aEdificacoes">Edificações</label></div>
        </div>
      </fieldset>

      {/* SEÇÃO AÇÕES REALIZADAS (Item 19) */}
      <fieldset>
        <legend>Ações Realizadas</legend>
        <div className="checkbox-grid-3-col">
          {/* CORRIGIDO AQUI: Adicionado '?' em acoes */}
          <div className="form-check-item"><input type="checkbox" id="aIdentificacao" name="produtoPerigoso.acoes.identificacao" checked={ppData.acoes?.identificacao || false} onChange={handleChange} /><label htmlFor="aIdentificacao">Identificação</label></div>

          <div className="form-check-item"><input type="checkbox" id="aIsolamento" name="produtoPerigoso.acoes.isolamento" checked={ppData.acoes?.isolamento || false} onChange={handleChange} /><label htmlFor="aIsolamento">Isolamento</label></div>

          <div className="form-check-item"><input type="checkbox" id="aContencao" name="produtoPerigoso.acoes.contencao" checked={ppData.acoes?.contencao || false} onChange={handleChange} /><label htmlFor="aContencao">Contenção</label></div>

          <div className="form-check-item"><input type="checkbox" id="aNeutralizacao" name="produtoPerigoso.acoes.neutralizacao" checked={ppData.acoes?.neutralizacao || false} onChange={handleChange} /><label htmlFor="aNeutralizacao">Neutralização</label></div>

          <div className="form-check-item"><input type="checkbox" id="aDescontaminacao" name="produtoPerigoso.acoes.descontaminacao" checked={ppData.acoes?.descontaminacao || false} onChange={handleChange} /><label htmlFor="aDescontaminacao">Descontaminação</label></div>

          <div className="form-check-item"><input type="checkbox" id="aResfriamento" name="produtoPerigoso.acoes.resfriamento" checked={ppData.acoes?.resfriamento || false} onChange={handleChange} /><label htmlFor="aResfriamento">Resfriamento de Vaso</label></div>
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

export default FormularioProdutoPerigoso;