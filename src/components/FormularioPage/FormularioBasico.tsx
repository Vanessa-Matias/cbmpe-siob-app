import React, { useState } from 'react';
import './FormularioPage.css'; // Certifique-se que o nome do seu CSS está correto

const FormularioBasico = () => {
  // O estado 'formData' agora contém TODOS os campos do seu protótipo.
  const [formData, setFormData] = useState({
    // --- 1. CABEÇALHO ---
    pontoBase: '', viaturaTipo: '', viaturaOrdem: '', numAviso: '', dataAviso: '',
    // --- 2. ACIONAMENTO E SITUAÇÃO ---
    horaRecebimento: '', formaAcionamento: '', situacaoOcorrencia: '', motivoNaoAtendida: '', outroMotivoNaoAtendida: '',
    // --- 3. ENDEREÇO ---
    localAcionamento: '', rua: '', numero: '', aptoSala: '', bairro: '', telefone: '', municipio: '', uf: 'PE', areaOBM: 'S', outraUF: '', coordenadas: '', codigoLocal: '', referencia: '',
    // --- 4. SOLICITANTE ---
    nomeSolicitante: '', cpfRg: '', orgaoExpedidor: '', idadeSolicitante: '', sexoSolicitante: '', contatoTelefonico: '',
    // --- 5. DESLOCAMENTO ---
    horarioSaida: '', horarioNoLocal: '', horarioSaidaLocal: '', horarioChegadaDestino: '', horarioRetornoQuartel: '', hodometroSaida: '', hodometroLocal: '', primeiraVtrPrefixo: '', primeiraVtrPlaca: '',
    // --- 6. APOIO ---
    apoio: { celpe: false, samu: false, compesa: false, defesaCivil: false, orgaoAmbiental: false, pmpe: false, prf: false, guardaMunicipal: false, ffaa: false, outro: false, outroDesc: '' },
    viatura1: '', guarnicao1: '', viatura2: '', guarnicao2: '', viatura3: '', guarnicao3: '',
    // --- 7. HISTÓRICO ---
    historico: '',
    // --- 8. DIFICULDADES ---
    dificuldades: { tempoDeslocamento: false, obmProximaAtendimento: false, faltaIncorrecaoDados: false, obmSemViatura: false, faltaSinalizacao: false, transitoIntenso: false, areaDificilAcesso: false, paneEquipamento: false, paneViatura: false, faltaMaterial: false, naoHouve: false, outro: false },
    eventoNaturezaInicial: '',
    // --- 9. FORMULÁRIOS PREENCHIDOS ---
    formulariosPreenchidos: { atdPreHospitalar: false, salvamento: false, atividadeComunitaria: false, prevencao: false, formularioGerenciamento: false, produtoPerigoso: false, incendio: false, outroRelatorio: false, outroRelatorioEspec: '' },
    // --- 10. VÍTIMAS E VEÍCULOS ---
    qtdTotalVitimas: '', feridas: '', fatais: '', ilesas: '', desaparecidas: '',
    veiculosEnvolvidos: 'NAO',
    veiculo1: { modelo: '', cor: '', placa: '', estado: '', nomeCondutor: '', rgCpfCondutor: '', orgaoExpCondutor: '' },
    veiculo2: { modelo: '', cor: '', placa: '', estado: '', nomeCondutor: '', rgCpfCondutor: '', orgaoExpCondutor: '' },
    // --- 11. GUARNIÇÃO ---
    guarnicaoEmpenhada: { postoGrad: '', matriculaCmt: '', nomeGuerraCmt: '', vistoDivisao: '', componentes: ['', '', '', '', '', ''] }
  });

  // Função genérica para lidar com a mudança de todos os inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        const [key, subkey] = name.split('.'); // Para objetos aninhados como 'apoio.celpe'
        
        if (subkey) {
            setFormData(prev => ({
                ...prev,
                [key]: { ...(prev as any)[key], [subkey]: checked }
            }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  return (
    <form className="form-card">
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
        {/* ... (todos os inputs do solicitante) ... */}
      </fieldset>

      {/* --- SEÇÃO 5: DESLOCAMENTO --- */}
      <fieldset>
        <legend>Deslocamento</legend>
        {/* ... (todos os inputs de horários e hodômetro) ... */}
      </fieldset>

      {/* --- SEÇÃO 6: APOIO E VIATURAS ENVOLVIDAS --- */}
        <fieldset>
    <legend>Apoio e Viaturas Envolvidas</legend>

    {/* SUB-SEÇÃO 1: APOIO (Instituições) - Item 09 do Formulário Básico */}
    <fieldset className="sub-section">
        <legend>Apoio de Órgãos</legend>
        <div className="apoio-checkbox-grid">
            {/* Linha 1 */}
            <label><input type="checkbox" name="apoio.celpe" checked={formData.apoio.celpe} onChange={handleChange} /> Celpe</label>
            <label><input type="checkbox" name="apoio.samu" checked={formData.apoio.samu} onChange={handleChange} /> Samu</label>
            <label><input type="checkbox" name="apoio.compesa" checked={formData.apoio.compesa} onChange={handleChange} /> Compesa</label>
            <label><input type="checkbox" name="apoio.defesaCivil" checked={formData.apoio.defesaCivil} onChange={handleChange} /> Defesa Civil</label>
            
            {/* Linha 2 */}
            <label><input type="checkbox" name="apoio.orgaoAmbiental" checked={formData.apoio.orgaoAmbiental} onChange={handleChange} /> Órgão Ambiental</label>
            <label><input type="checkbox" name="apoio.pmpe" checked={formData.apoio.pmpe} onChange={handleChange} /> PMPE</label>
            <label><input type="checkbox" name="apoio.prf" checked={formData.apoio.prf} onChange={handleChange} /> PRF</label>
            <label><input type="checkbox" name="apoio.guardaMunicipal" checked={formData.apoio.guardaMunicipal} onChange={handleChange} /> Guarda Municipal</label>

            {/* Linha 3 */}
            <label><input type="checkbox" name="apoio.ffaa" checked={formData.apoio.ffaa} onChange={handleChange} /> FFAA</label>
            <label>
                <input type="checkbox" name="apoio.outro" checked={formData.apoio.outro} onChange={handleChange} /> Outro: 
                <input 
                    type="text" 
                    name="apoio.outroDesc" 
                    value={formData.apoio.outroDesc} 
                    onChange={handleChange} 
                    disabled={!formData.apoio.outro}
                />
            </label>
        </div>
    </fieldset>

    {/* SUB-SEÇÃO 2: VIATURAS ENVOLVIDAS - Item 10 do Formulário Básico */}
    <fieldset className="sub-section">
        <legend>Apoio de Viaturas</legend>
        <div className="viatura-inputs-grid">
            {/* Viatura 1 */}
            <div className="form-group-viatura">
                <label>Viatura 1 (Tipo e Número)</label>
                <input type="text" name="viatura1" value={formData.viatura1} onChange={handleChange} placeholder="Ex: ABS 3106" />
            </div>
            <div className="form-group-guarnicao">
                <label>Guarnição</label>
                <input type="text" name="guarnicao1" value={formData.guarnicao1} onChange={handleChange} placeholder="Ex: 05 BMs" />
            </div>

            {/* Viatura 2 */}
            <div className="form-group-viatura">
                <label>Viatura 2 (Tipo e Número)</label>
                <input type="text" name="viatura2" value={formData.viatura2} onChange={handleChange} placeholder="Ex: ABT 111" />
            </div>
            <div className="form-group-guarnicao">
                <label>Guarnição</label>
                <input type="text" name="guarnicao2" value={formData.guarnicao2} onChange={handleChange} placeholder="Ex: 04 BMs" />
            </div>

            {/* Viatura 3 */}
            <div className="form-group-viatura">
                <label>Viatura 3 (Tipo e Número)</label>
                <input type="text" name="viatura3" value={formData.viatura3} onChange={handleChange} placeholder="Opcional" />
            </div>
            <div className="form-group-guarnicao">
                <label>Guarnição</label>
                <input type="text" name="guarnicao3" value={formData.guarnicao3} onChange={handleChange} placeholder="Opcional" />
            </div>
        </div>
    </fieldset>
</fieldset>

      {/* --- SEÇÃO 7: DIFICULDADES E NATUREZA INICIAL --- */}
      <fieldset>
  <legend>Dificuldades na Atuação e Natureza do Aviso</legend>
  
  {/* Item 13: DIFICULDADES NA ATUAÇÃO DECORRENTES DO ENVIO DE RECURSOS */}
  <div className="form-group-grid-2-col checkbox-grid">
    <label>
      <input type="checkbox" name="dificuldades.tempoDeslocamento" checked={formData.dificuldades.tempoDeslocamento} onChange={handleChange} /> Tempo de deslocamento superior a 15 minutos [cite: 961]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.obmSemViatura" checked={formData.dificuldades.obmSemViatura} onChange={handleChange} /> OBM mais próxima sem viatura apropriada [cite: 962]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.obmProximaAtendimento" checked={formData.dificuldades.obmProximaAtendimento} onChange={handleChange} /> OBM mais próxima em atendimento de ocorrência [cite: 961]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.faltaSinalizacao" checked={formData.dificuldades.faltaSinalizacao} onChange={handleChange} /> Falta de sinalização de endereço [cite: 964]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.faltaIncorrecaoDados" checked={formData.dificuldades.faltaIncorrecaoDados} onChange={handleChange} /> Falta ou incorreção sobre os dados do envio [cite: 961]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.transitoIntenso" checked={formData.dificuldades.transitoIntenso} onChange={handleChange} /> Trânsito intenso [cite: 969]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.areaDificilAcesso" checked={formData.dificuldades.areaDificilAcesso} onChange={handleChange} /> Área de difícil acesso [cite: 962]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.paneEquipamento" checked={formData.dificuldades.paneEquipamento} onChange={handleChange} /> Pane em equipamento [cite: 966]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.paneViatura" checked={formData.dificuldades.paneViatura} onChange={handleChange} /> Pane em viatura [cite: 970]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.faltaMaterial" checked={formData.dificuldades.faltaMaterial} onChange={handleChange} /> Falta do material [cite: 963]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.naoHouve" checked={formData.dificuldades.naoHouve} onChange={handleChange} /> Não houve [cite: 967]
    </label>
    <label>
      <input type="checkbox" name="dificuldades.outro" checked={formData.dificuldades.outro} onChange={handleChange} /> Outro [cite: 971]
    </label>
  </div>

  {/* Item 14: EVENTO - NATUREZA INICIAL DO AVISO */}
  <div className="form-group">
    <label htmlFor="eventoNaturezaInicial">Evento - Natureza Inicial do Aviso (Conforme recebido pelo CIODS)</label>
    <input 
      type="text" 
      id="eventoNaturezaInicial"
      name="eventoNaturezaInicial" 
      value={formData.eventoNaturezaInicial} 
      onChange={handleChange} 
      placeholder="Ex: Fogo no lixo; Desabamento do Atacadão"
      className="full-width-input"
    />
  </div>
</fieldset>

      {/* --- SEÇÃO 8: FORMULÁRIOS PREENCHIDOS (O GATILHO) --- */}
<fieldset>
  <legend>Formulários Preenchidos (decorrentes da natureza do atendimento)</legend>
  <div className="form-group-grid-2-col checkbox-grid">
    <label>
      <input type="checkbox" name="formulariosPreenchidos.atdPreHospitalar" checked={formData.formulariosPreenchidos.atdPreHospitalar} onChange={handleChange} /> Atendimento pré-hospitalar [cite: 977]
    </label>
    <label>
      <input type="checkbox" name="formulariosPreenchidos.formularioGerenciamento" checked={formData.formulariosPreenchidos.formularioGerenciamento} onChange={handleChange} /> Formulário de Gerenciamento [cite: 978]
    </label>
    <label>
      <input type="checkbox" name="formulariosPreenchidos.atividadeComunitaria" checked={formData.formulariosPreenchidos.atividadeComunitaria} onChange={handleChange} /> Atividade Comunitária [cite: 977]
    </label>
    <label>
      <input type="checkbox" name="formulariosPreenchidos.produtoPerigoso" checked={formData.formulariosPreenchidos.produtoPerigoso} onChange={handleChange} /> Produto perigoso [cite: 983]
    </label>
    <label>
      <input type="checkbox" name="formulariosPreenchidos.incendio" checked={formData.formulariosPreenchidos.incendio} onChange={handleChange} /> Incêndio [cite: 981]
    </label>
    <label>
      <input type="checkbox" name="formulariosPreenchidos.salvamento" checked={formData.formulariosPreenchidos.salvamento} onChange={handleChange} /> Salvamento [cite: 982]
    </label>
    <label>
      <input type="checkbox" name="formulariosPreenchidos.prevencao" checked={formData.formulariosPreenchidos.prevencao} onChange={handleChange} /> Prevenção [cite: 983]
    </label>
    <div className="form-group-inline">
        <label>
        <input type="checkbox" name="formulariosPreenchidos.outroRelatorio" checked={formData.formulariosPreenchidos.outroRelatorio} onChange={handleChange} /> Outro relatório específico: 
        </label>
        <input 
            type="text" 
            name="formulariosPreenchidos.outroRelatorioEspec" 
            value={formData.formulariosPreenchidos.outroRelatorioEspec} 
            onChange={handleChange} 
            disabled={!formData.formulariosPreenchidos.outroRelatorio}
        />
    </div>
  </div>
</fieldset>

      {/* --- SEÇÃO 9: TIPO DE VÍTIMA --- */}
      <fieldset>
  <legend>Tipo de Vítima</legend>
  <div className="form-group-grid-5-col">
    <div className="form-group">
      <label htmlFor="qtdTotalVitimas">Quantidade total de vítimas</label>
      <input type="number" id="qtdTotalVitimas" name="qtdTotalVitimas" value={formData.qtdTotalVitimas} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label htmlFor="feridas">Feridas</label>
      <input type="number" id="feridas" name="feridas" value={formData.feridas} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label htmlFor="fatais">Fatais</label>
      <input type="number" id="fatais" name="fatais" value={formData.fatais} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label htmlFor="ilesas">Ilesas (Desas.)</label>
      <input type="number" id="ilesas" name="ilesas" value={formData.ilesas} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label htmlFor="desaparecidas">Desaparecidas</label>
      <input type="number" id="desaparecidas" name="desaparecidas" value={formData.desaparecidas} onChange={handleChange} />
    </div>
  </div>
</fieldset>

      {/* --- SEÇÃO 10: VEÍCULOS ENVOLVIDOS (Renderização Condicional) --- */}
      <fieldset>
  <legend>Veículos Envolvidos</legend>
  <div className="form-group">
    <div className="radio-columns">
      <label>
        <input 
          type="radio" 
          name="veiculosEnvolvidos" 
          value="SIM" 
          checked={formData.veiculosEnvolvidos === 'SIM'} 
          onChange={handleChange} 
        /> Sim
      </label>
      <label>
        <input 
          type="radio" 
          name="veiculosEnvolvidos" 
          value="NAO" 
          checked={formData.veiculosEnvolvidos === 'NAO'} 
          onChange={handleChange} 
        /> Não
      </label>
    </div>
  </div>

  {formData.veiculosEnvolvidos === 'SIM' && (
    <div className="veiculos-detail-grid">
      {/* VEÍCULO 1 */}
      <h4>Veículo 1</h4>
      <div className="form-group">
        <label>Modelo</label>
        <input 
          type="text" 
          name="veiculo1.modelo" 
          value={formData.veiculo1.modelo} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Cor predominante</label>
        <input 
          type="text" 
          name="veiculo1.cor" 
          value={formData.veiculo1.cor} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Placa</label>
        <input 
          type="text" 
          name="veiculo1.placa" 
          value={formData.veiculo1.placa} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Estado</label>
        <input 
          type="text" 
          name="veiculo1.estado" 
          value={formData.veiculo1.estado} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Nome do condutor</label>
        <input 
          type="text" 
          name="veiculo1.nomeCondutor" 
          value={formData.veiculo1.nomeCondutor} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>RG/CPF</label>
        <input 
          type="text" 
          name="veiculo1.rgCpfCondutor" 
          value={formData.veiculo1.rgCpfCondutor} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Órgão Expedidor</label>
        <input 
          type="text" 
          name="veiculo1.orgaoExpCondutor" 
          value={formData.veiculo1.orgaoExpCondutor} 
          onChange={handleChange} 
        />
      </div>

      {/* VEÍCULO 2 */}
      <h4>Veículo 2</h4>
      <div className="form-group">
        <label>Modelo</label>
        <input 
          type="text" 
          name="veiculo2.modelo" 
          value={formData.veiculo2.modelo} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Cor predominante</label>
        <input 
          type="text" 
          name="veiculo2.cor" 
          value={formData.veiculo2.cor} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Placa</label>
        <input 
          type="text" 
          name="veiculo2.placa" 
          value={formData.veiculo2.placa} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Estado</label>
        <input 
          type="text" 
          name="veiculo2.estado" 
          value={formData.veiculo2.estado} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Nome do condutor</label>
        <input 
          type="text" 
          name="veiculo2.nomeCondutor" 
          value={formData.veiculo2.nomeCondutor} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>RG/CPF</label>
        <input 
          type="text" 
          name="veiculo2.rgCpfCondutor" 
          value={formData.veiculo2.rgCpfCondutor} 
          onChange={handleChange} 
        />
      </div>
      <div className="form-group">
        <label>Órgão Expedidor</label>
        <input 
          type="text" 
          name="veiculo2.orgaoExpCondutor" 
          value={formData.veiculo2.orgaoExpCondutor} 
          onChange={handleChange} 
        />
      </div>
    </div>
  )}
</fieldset>
      
      {/* --- SEÇÃO 11: HISTÓRICO --- */}
      <fieldset>
        <legend>Histórico</legend>
        <div className="form-group">
          <textarea name="historico" rows={8} placeholder="Descreva aqui os detalhes relevantes da ocorrência..." value={formData.historico} onChange={handleChange}></textarea>
        </div>
      </fieldset>
      
      {/* --- SEÇÃO 12: GUARNIÇÃO EMPENHADA --- */}
      <fieldset>
  <legend>Guarnição Empenhada</legend>
  <div className="form-group-grid-4-col">
    <div className="form-group">
      <label>Posto/Grad.</label>
      <input type="text" name="guarnicaoEmpenhada.postoGrad" value={formData.guarnicaoEmpenhada.postoGrad} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Matrícula – CMT Op.</label>
      <input type="text" name="guarnicaoEmpenhada.matriculaCmt" value={formData.guarnicaoEmpenhada.matriculaCmt} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Nome de Guerra do CMT da Op.</label>
      <input type="text" name="guarnicaoEmpenhada.nomeGuerraCmt" value={formData.guarnicaoEmpenhada.nomeGuerraCmt} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Visto da Divisão de Operações</label>
      <input type="date" name="guarnicaoEmpenhada.vistoDivisao" value={formData.guarnicaoEmpenhada.vistoDivisao} onChange={handleChange} />
    </div>
  </div>

  <div className="guarnicao-grid">
    {formData.guarnicaoEmpenhada.componentes.map((comp, idx) => (
      <div className="form-group" key={idx}>
        <label>Matrícula do componente {idx+1}</label>
        <input
          type="text"
          name={`guarnicaoEmpenhada.componentes.${idx}`}
          value={formData.guarnicaoEmpenhada.componentes[idx]}
          onChange={handleChange}
        />
      </div>
    ))}
  </div>

  <div className="assinatura">
    <p>Assinatura</p>
  </div>
</fieldset>
      
      {/* --- AÇÕES DO FORMULÁRIO --- */}
      <div className="form-actions">
        <button type="submit" className="submit-button">Salvar Ocorrência</button>
      </div>
    </form>
  );
};

export default FormularioBasico;