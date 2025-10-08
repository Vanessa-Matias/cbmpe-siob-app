/**
 * @file FormularioBasico.tsx
 * @description Componente de "apresentação" que renderiza a UI completa do formulário básico.
 * Recebe todos os dados e funções de seu componente pai via props.
 */
import React from 'react';
import './FormularioPage.css';

// Define o "contrato" de props que este componente espera receber do pai.
interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  submitText: string;
}

const FormularioBasico: React.FC<Props> = ({ formData, handleChange, handleSubmit, handleCancel, submitText }) => {
  return (
    // O formulário invoca a função handleSubmit do pai ao ser submetido.
    <form className="form-card" onSubmit={handleSubmit}>

      {/* --- SEÇÃO 1: CABEÇALHO --- */}
      <div className="top-header-grid">
        {/* Coluna 1 - Ponto Base */}
        <fieldset className="field-col">
          <div className="form-group">
            <label htmlFor="pontoBase">Ponto Base</label>
            <input
              type="text"
              id="pontoBase"
              name="pontoBase"
              placeholder="Ex: B-2025001234"
              value={formData.pontoBase}
              onChange={handleChange}
            />
            <p className="ome-text">OME ________ / GB / Seção ________</p>
          </div>
        </fieldset>

        {/* Coluna 2 - Viatura Responsável */}
        <fieldset className="field-col">
          <div className="form-group">
            <label>Viatura Responsável</label>
            <div className="input-pair">
              <input
                type="text"
                name="viaturaTipo"
                placeholder="Tipo (Ex: ABT)"
                value={formData.viaturaTipo}
                onChange={handleChange}
              />
              <input
                type="text"
                name="viaturaOrdem"
                placeholder="Nº Ordem"
                value={formData.viaturaOrdem}
                onChange={handleChange}
              />
            </div>
          </div>
        </fieldset>

        {/* Coluna 3 - Formulário Básico */}
        <fieldset className="field-col">
          <legend>Formulário Básico</legend>
          <div className="form-group-grid">
            <div className="form-group">
              <label htmlFor="numAviso">Número do aviso (I-NETDISPATCHER)</label>
              <input
                type="text"
                id="numAviso"
                name="numAviso"
                placeholder="Informe o tipo e o número ordem"
                value={formData.numAviso}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dataAviso">Data</label>
              <input
                type="date"
                id="dataAviso"
                name="dataAviso"
                value={formData.dataAviso}
                onChange={handleChange}
              />
            </div>
          </div>
        </fieldset>
      </div>

      {/* --- SEÇÃO 4: SOLICITANTE --- */}
      <fieldset>
        <legend>Dados do Solicitante</legend>
        <div className="form-group-grid-4-col">
          <div className="form-group">
            <label>Nome</label>
            <input 
              type="text" 
              name="nomeSolicitante" 
              value={formData.nomeSolicitante} 
              onChange={handleChange} 
              placeholder="Ex: João da Silva" 
            />
          </div>
          <div className="form-group">
            <label>CPF/RG</label>
            <input 
              type="text" 
              name="cpfRg" 
              value={formData.cpfRg} 
              onChange={handleChange} 
              placeholder="000.000.000-00" 
            />
          </div>
          <div className="form-group">
            <label>Órgão Expedidor</label>
            <input 
              type="text" 
              name="orgaoExpedidor" 
              value={formData.orgaoExpedidor} 
              onChange={handleChange} 
              placeholder="SSD-PE" 
            />
          </div>
          <div className="form-group">
            <label>Idade</label>
            <input 
              type="number" 
              name="idadeSolicitante"
              value={formData.idadeSolicitante} 
              onChange={handleChange} 
              placeholder="Ex: 35" 
            />
          </div>
          <div className="form-group">
            <label>Sexo</label>
            <select 
              name="sexoSolicitante" 
              value={formData.sexoSolicitante} 
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input 
              type="tel" 
              name="contatoTelefonico" 
              value={formData.contatoTelefonico} 
              onChange={handleChange} 
              placeholder="(81) 99999-0000" 
            />
          </div>
        </div>
      </fieldset>

      {/* --- SEÇÃO 5: DESLOCAMENTO --- */}
      <fieldset>
        <legend>Deslocamento</legend>
        <div className="form-group-grid-5-col">
          <div className="form-group">
            <label>Horário de Saída</label>
            <input type="time" name="horarioSaida" value={formData.horarioSaida} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Horário no Local</label>
            <input type="time" name="horarioNoLocal" value={formData.horarioNoLocal} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Saída do Local</label>
            <input type="time" name="horarioSaidaLocal" value={formData.horarioSaidaLocal} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Chegada ao Destino</label>
            <input type="time" name="horarioChegadaDestino" value={formData.horarioChegadaDestino} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Retorno ao Quartel</label>
            <input type="time" name="horarioRetornoQuartel" value={formData.horarioRetornoQuartel} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Hodômetro Saída</label>
            <input type="number" name="hodometroSaida" value={formData.hodometroSaida} onChange={handleChange} placeholder="Ex: 12000" />
          </div>
          <div className="form-group">
            <label>Hodômetro Local</label>
            <input type="number" name="hodometroLocal" value={formData.hodometroLocal} onChange={handleChange} placeholder="Ex: 12015" />
          </div>
        </div>
      </fieldset>

      {/* --- SEÇÃO 6: APOIO E VIATURAS --- */}
      <fieldset>
        <legend>Apoio e Viaturas Envolvidas</legend>

        {/* Sub: Apoio de Órgãos */}
  <div className="sub-section">
    <legend>Apoio de Órgãos</legend>
    <div className="apoio-checkbox-grid">
        {/* Usamos o name com ponto para o handleChange genérico funcionar */}
        <label><input type="checkbox" name="apoio.celpe" checked={formData.apoio.celpe} onChange={handleChange}/> Celpe</label>
        <label><input type="checkbox" name="apoio.samu" checked={formData.apoio.samu} onChange={handleChange}/> Samu</label>
        <label><input type="checkbox" name="apoio.compesa" checked={formData.apoio.compesa} onChange={handleChange}/> Compesa</label>
        <label><input type="checkbox" name="apoio.defesaCivil" checked={formData.apoio.defesaCivil} onChange={handleChange}/> Defesa Civil</label>
        <label><input type="checkbox" name="apoio.orgaoAmbiental" checked={formData.apoio.orgaoAmbiental} onChange={handleChange}/> Órgão Ambiental</label>
        <label><input type="checkbox" name="apoio.pmpe" checked={formData.apoio.pmpe} onChange={handleChange}/> PMPE</label>
        <label><input type="checkbox" name="apoio.prf" checked={formData.apoio.prf} onChange={handleChange}/> PRF</label>
        <label><input type="checkbox" name="apoio.guardaMunicipal" checked={formData.apoio.guardaMunicipal} onChange={handleChange}/> Guarda Municipal</label>
        <label><input type="checkbox" name="apoio.ffaa" checked={formData.apoio.ffaa} onChange={handleChange}/> FFAA</label>
        <label>
          <input type="checkbox" name="apoio.outro" checked={formData.apoio.outro} onChange={handleChange}/> Outro:
          <input type="text" name="apoio.outroDesc" value={formData.apoio.outroDesc} onChange={handleChange} disabled={!formData.apoio.outro}/>
        </label>
    </div>
  </div>

  {/* Sub: Viaturas de Apoio */}
  <div className="sub-section">
    <legend>Apoio de Viaturas</legend>
    <div className="viatura-inputs-grid">
      
      {/* Par 1 */}
      <div className="viatura-guarnicao-pair">
        <div className="form-group">
          <label>Viatura 1 (Tipo e Número)</label>
          <input type="text" name="viatura1" value={formData.viatura1} onChange={handleChange} placeholder="Ex: ABS 3106"/>
        </div>
        <div className="form-group">
          <label>Guarnição</label>
          <input type="text" name="guarnicao1" value={formData.guarnicao1} onChange={handleChange} placeholder="Ex: 05"/>
        </div>
      </div>

      {/* Par 2 */}
      <div className="viatura-guarnicao-pair">
        <div className="form-group">
          <label>Viatura 2 (Tipo e Número)</label>
          <input type="text" name="viatura2" value={formData.viatura2} onChange={handleChange} placeholder="Ex: ABT 111"/>
        </div>
        <div className="form-group">
          <label>Guarnição</label>
          <input type="text" name="guarnicao2" value={formData.guarnicao2} onChange={handleChange} placeholder="Ex: 04"/>
        </div>
      </div>

      {/* Par 3 */}
      <div className="viatura-guarnicao-pair">
        <div className="form-group">
          <label>Viatura 3 (Tipo e Número)</label>
          <input type="text" name="viatura3" value={formData.viatura3} onChange={handleChange} placeholder="Opcional"/>
        </div>
        <div className="form-group">
          <label>Guarnição</label>
          <input type="text" name="guarnicao3" value={formData.guarnicao3} onChange={handleChange} placeholder="Opcional"/>
        </div>
      </div>

    </div>
  </div>
</fieldset>

      {/* --- SEÇÃO 7: DIFICULDADES --- */}
      <fieldset>
  <legend>Dificuldades na Atuação e Natureza do Aviso</legend>
  
  <div className="dificuldades-grid">
    <input type="checkbox" id="difTempo" name="dificuldades.tempoDeslocamento" checked={formData.dificuldades.tempoDeslocamento} onChange={handleChange} />
    <label htmlFor="difTempo">Tempo de deslocamento superior a 15 minutos</label>

    <input type="checkbox" id="difObmSemViatura" name="dificuldades.obmSemViatura" checked={formData.dificuldades.obmSemViatura} onChange={handleChange} />
    <label htmlFor="difObmSemViatura">OBM mais próxima sem viatura apropriada</label>

    <input type="checkbox" id="difObmEmAtendimento" name="dificuldades.obmProximaAtendimento" checked={formData.dificuldades.obmProximaAtendimento} onChange={handleChange} />
    <label htmlFor="difObmEmAtendimento">OBM mais próxima em atendimento</label>
    
    <input type="checkbox" id="difFaltaSinalizacao" name="dificuldades.faltaSinalizacao" checked={formData.dificuldades.faltaSinalizacao} onChange={handleChange} />
    <label htmlFor="difFaltaSinalizacao">Falta de sinalização de endereço</label>
    
    <input type="checkbox" id="difFaltaDados" name="dificuldades.faltaIncorrecaoDados" checked={formData.dificuldades.faltaIncorrecaoDados} onChange={handleChange} />
    <label htmlFor="difFaltaDados">Falta ou incorreção nos dados do envio</label>
    
    <input type="checkbox" id="difTransito" name="dificuldades.transitoIntenso" checked={formData.dificuldades.transitoIntenso} onChange={handleChange} />
    <label htmlFor="difTransito">Trânsito intenso</label>
    
    <input type="checkbox" id="difAcesso" name="dificuldades.areaDificilAcesso" checked={formData.dificuldades.areaDificilAcesso} onChange={handleChange} />
    <label htmlFor="difAcesso">Área de difícil acesso</label>
    
    <input type="checkbox" id="difPaneEquip" name="dificuldades.paneEquipamento" checked={formData.dificuldades.paneEquipamento} onChange={handleChange} />
    <label htmlFor="difPaneEquip">Pane em equipamento</label>
    
    <input type="checkbox" id="difPaneViatura" name="dificuldades.paneViatura" checked={formData.dificuldades.paneViatura} onChange={handleChange} />
    <label htmlFor="difPaneViatura">Pane em viatura</label>
    
    <input type="checkbox" id="difFaltaMaterial" name="dificuldades.faltaMaterial" checked={formData.dificuldades.faltaMaterial} onChange={handleChange} />
    <label htmlFor="difFaltaMaterial">Falta de material</label>
    
    <input type="checkbox" id="difNaoHouve" name="dificuldades.naoHouve" checked={formData.dificuldades.naoHouve} onChange={handleChange} />
    <label htmlFor="difNaoHouve">Não houve</label>
    
    <input type="checkbox" id="difOutro" name="dificuldades.outro" checked={formData.dificuldades.outro} onChange={handleChange} />
    <label htmlFor="difOutro">Outro</label>
  </div>

  <div className="form-group" style={{ marginTop: '1.5rem' }}>
    <label htmlFor="eventoNaturezaInicial">Evento - Natureza Inicial do Aviso</label>
    <input 
      type="text" 
      id="eventoNaturezaInicial"
      name="eventoNaturezaInicial" 
      value={formData.eventoNaturezaInicial} 
      onChange={handleChange} 
      placeholder="Ex: Fogo no lixo; Desabamento do Atacadão"
    />
  </div>
</fieldset>

      {/* --- SEÇÃO 8: FORMULÁRIOS PREENCHIDOS --- */}
      <fieldset>
  <legend>Formulários Preenchidos (decorrentes da natureza do atendimento)</legend>
  
  {/* Usamos a classe de grid padrão para 2 colunas */}
  <div className="checkbox-grid-2-col">

    {/* Cada par (input + label) é agrupado em um "form-check-item" */}
    <div className="form-check-item">
      <input type="checkbox" id="formAph" name="formulariosPreenchidos.atdPreHospitalar" checked={formData.formulariosPreenchidos.atdPreHospitalar} onChange={handleChange} />
      <label htmlFor="formAph">Atendimento pré-hospitalar</label>
    </div>
    
    <div className="form-check-item">
      <input type="checkbox" id="formGerenciamento" name="formulariosPreenchidos.formularioGerenciamento" checked={formData.formulariosPreenchidos.formularioGerenciamento} onChange={handleChange} />
      <label htmlFor="formGerenciamento">Formulário de Gerenciamento</label>
    </div>

    <div className="form-check-item">
      <input type="checkbox" id="formComunitaria" name="formulariosPreenchidos.atividadeComunitaria" checked={formData.formulariosPreenchidos.atividadeComunitaria} onChange={handleChange} />
      <label htmlFor="formComunitaria">Atividade Comunitária</label>
    </div>

    <div className="form-check-item">
      <input type="checkbox" id="formProdutoPerigoso" name="formulariosPreenchidos.produtoPerigoso" checked={formData.formulariosPreenchidos.produtoPerigoso} onChange={handleChange} />
      <label htmlFor="formProdutoPerigoso">Produto perigoso</label>
    </div>

    <div className="form-check-item">
      <input type="checkbox" id="formIncendio" name="formulariosPreenchidos.incendio" checked={formData.formulariosPreenchidos.incendio} onChange={handleChange} />
      <label htmlFor="formIncendio">Incêndio</label>
    </div>

    <div className="form-check-item">
      <input type="checkbox" id="formSalvamento" name="formulariosPreenchidos.salvamento" checked={formData.formulariosPreenchidos.salvamento} onChange={handleChange} />
      <label htmlFor="formSalvamento">Salvamento</label>
    </div>

    <div className="form-check-item">
      <input type="checkbox" id="formPrevencao" name="formulariosPreenchidos.prevencao" checked={formData.formulariosPreenchidos.prevencao} onChange={handleChange} />
      <label htmlFor="formPrevencao">Prevenção</label>
    </div>
  </div>

  {/* O campo 'Outro' fica fora do grid para tratamento especial */}
  <div className="form-group-inline">
  <input 
    type="checkbox" 
    id="outroRelatorio" 
    name="formulariosPreenchidos.outroRelatorio" 
    checked={formData.formulariosPreenchidos.outroRelatorio} 
    onChange={handleChange} 
  />
  <label htmlFor="outroRelatorio">Outro relatório específico:</label>
  <input 
    type="text" 
    name="formulariosPreenchidos.outroRelatorioEspec" 
    value={formData.formulariosPreenchidos.outroRelatorioEspec} 
    onChange={handleChange} 
    disabled={!formData.formulariosPreenchidos.outroRelatorio}
  />
</div>
</fieldset>

      {/* --- SEÇÃO 9: TIPO DE VÍTIMA --- */}
      <fieldset>
        <legend>Tipo de Vítima</legend>
        <div className="form-group-grid-5-col">
          <div className="form-group"><label>Total</label><input type="number" name="qtdTotalVitimas" value={formData.qtdTotalVitimas} onChange={handleChange}/></div>
          <div className="form-group"><label>Feridas</label><input type="number" name="feridas" value={formData.feridas} onChange={handleChange}/></div>
          <div className="form-group"><label>Fatais</label><input type="number" name="fatais" value={formData.fatais} onChange={handleChange}/></div>
          <div className="form-group"><label>Ilesas</label><input type="number" name="ilesas" value={formData.ilesas} onChange={handleChange}/></div>
          <div className="form-group"><label>Desaparecidas</label><input type="number" name="desaparecidas" value={formData.desaparecidas} onChange={handleChange}/></div>
        </div>
      </fieldset>

     {/* --- SEÇÃO 10: VEÍCULOS ENVOLVIDOS --- */}
      <fieldset>
        <legend>Veículos Envolvidos</legend>
        <div className="radio-columns">
          <label><input type="radio" name="veiculosEnvolvidos" value="SIM" checked={formData.veiculosEnvolvidos === 'SIM'} onChange={handleChange} /> Sim</label>
          <label><input type="radio" name="veiculosEnvolvidos" value="NAO" checked={formData.veiculosEnvolvidos === 'NAO'} onChange={handleChange} /> Não</label>
        </div>

        {/* Renderiza os campos apenas se a opção "Sim" estiver marcada */}
        {formData.veiculosEnvolvidos === 'SIM' && (
          <div className="veiculos-detail-grid">
            
            {/* Veículo 1 */}
            <h4>Veículo 1</h4>
            <div className="form-group">
              <input type="text" name="veiculo1.modelo" value={formData.veiculo1.modelo} onChange={handleChange} placeholder="Modelo" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.cor" value={formData.veiculo1.cor} onChange={handleChange} placeholder="Cor" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.placa" value={formData.veiculo1.placa} onChange={handleChange} placeholder="Placa" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.estado" value={formData.veiculo1.estado} onChange={handleChange} placeholder="Estado" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.nomeCondutor" value={formData.veiculo1.nomeCondutor} onChange={handleChange} placeholder="Nome do Condutor" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.rgCpfCondutor" value={formData.veiculo1.rgCpfCondutor} onChange={handleChange} placeholder="RG/CPF" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.orgaoExpCondutor" value={formData.veiculo1.orgaoExpCondutor} onChange={handleChange} placeholder="Órgão Expedidor" />
            </div>

            {/* Veículo 2 */}
            <h4>Veículo 2</h4>
            <div className="form-group">
              <input type="text" name="veiculo2.modelo" value={formData.veiculo2.modelo} onChange={handleChange} placeholder="Modelo" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.cor" value={formData.veiculo2.cor} onChange={handleChange} placeholder="Cor" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.placa" value={formData.veiculo2.placa} onChange={handleChange} placeholder="Placa" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.estado" value={formData.veiculo2.estado} onChange={handleChange} placeholder="Estado" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.nomeCondutor" value={formData.veiculo2.nomeCondutor} onChange={handleChange} placeholder="Nome do Condutor" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.rgCpfCondutor" value={formData.veiculo2.rgCpfCondutor} onChange={handleChange} placeholder="RG/CPF" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.orgaoExpCondutor" value={formData.veiculo2.orgaoExpCondutor} onChange={handleChange} placeholder="Órgão Expedidor" />
            </div>

          </div>
        )}
      </fieldset>

            {/* --- SEÇÃO 11: HISTÓRICO --- */}
            <fieldset>
              <legend>Histórico</legend>
              <div className="form-group">
          <textarea 
            name="historico" 
            rows={8} 
            value={formData.historico} 
            onChange={handleChange} 
            placeholder="Descreva a ocorrência..."
          ></textarea>
        </div>
      </fieldset>

      {/* --- SEÇÃO 12: GUARNIÇÃO EMPENHADA --- */}
      <fieldset>
        <legend>Guarnição Empenhada</legend>
        <div className="form-group-grid-4-col">
          <input type="text" name="guarnicaoEmpenhada.postoGrad" value={formData.guarnicaoEmpenhada.postoGrad} onChange={handleChange} placeholder="Posto/Grad."/>
          <input type="text" name="guarnicaoEmpenhada.matriculaCmt" value={formData.guarnicaoEmpenhada.matriculaCmt} onChange={handleChange} placeholder="Matrícula CMT"/>
          <input type="text" name="guarnicaoEmpenhada.nomeGuerraCmt" value={formData.guarnicaoEmpenhada.nomeGuerraCmt} onChange={handleChange} placeholder="Nome de Guerra"/>
          <input type="date" name="guarnicaoEmpenhada.vistoDivisao" value={formData.guarnicaoEmpenhada.vistoDivisao} onChange={handleChange}/>
        </div>
        <div className="guarnicao-grid">
          {formData.guarnicaoEmpenhada.componentes.map((comp:any, idx:number)=>(
            <input key={idx} type="text" name={`guarnicaoEmpenhada.componentes.${idx}`} value={comp} onChange={handleChange} placeholder={`Matrícula componente ${idx+1}`}/>
          ))}
        </div>
        <div className="assinatura"><p>Assinatura</p></div>
      </fieldset>

      {/* --- BOTÕES DE AÇÃO --- */}
      <div className="form-actions">
        <button 
          type="button" 
          className="button-cancel" 
          onClick={handleCancel}
        >
          Cancelar
        </button>
        <button type="submit" className="submit-button">
          {submitText}
        </button>
      </div>

    </form>
  );
};

export default FormularioBasico;
