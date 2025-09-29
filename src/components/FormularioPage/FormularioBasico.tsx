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
      <div className="top-section-grid">
        <fieldset>
          <div className="form-group-grid">
            <div className="form-group">
              <label htmlFor="pontoBase">Ponto Base</label>
              <input type="text" id="pontoBase" name="pontoBase" placeholder="Ex: GBI - 1a SB" value={formData.pontoBase} onChange={handleChange}/>
              <p className="ome-text">OME ______ / *GB / Seção* ______</p>
            </div>
            <div className="form-group">
              <label>Viatura Responsável</label>
              <div className="input-pair">
                <input type="text" name="viaturaTipo" placeholder="Tipo (Ex: ABT)" value={formData.viaturaTipo} onChange={handleChange}/>
                <input type="text" name="viaturaOrdem" placeholder="N° Ordem" value={formData.viaturaOrdem} onChange={handleChange}/>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Formulário Básico</legend>
          <div className="form-group-grid">
            <div className="form-group">
              <label htmlFor="numAviso">Número do aviso (I-NETDISPATCHER)</label>
              <input type="text" id="numAviso" name="numAviso" placeholder="Ex: B-2025001234" value={formData.numAviso} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="dataAviso">Data</label>
              <input type="date" id="dataAviso" name="dataAviso" value={formData.dataAviso} onChange={handleChange}/>
            </div>
          </div>
        </fieldset>
      </div>

      {/* --- SEÇÃO 2: ACIONAMENTO E SITUAÇÃO --- */}
      <fieldset>
        <div className="acionamento-grid">
          {/* ... (campos de Hora, Acionamento, Situação) ... */}
        </div>
      </fieldset>

      {/* --- SEÇÃO 3: ENDEREÇO --- */}
      <fieldset>
        <legend>Local e Endereço da Ocorrência</legend>
        {/* ... (todos os inputs de endereço) ... */}
      </fieldset>

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
        {/* ... (checkboxes de apoio e inputs das viaturas) ... */}
      </fieldset>
      
      {/* --- SEÇÃO 7: DIFICULDADES E NATUREZA INICIAL --- */}
      <fieldset>
        <legend>Dificuldades na Atuação e Natureza do Aviso</legend>
        {/* ... (checkboxes de dificuldades e input da natureza) ... */}
      </fieldset>

      {/* --- SEÇÃO 8: FORMULÁRIOS PREENCHIDOS (O GATILHO) --- */}
      <fieldset>
        <legend>Formulários Preenchidos (decorrentes da natureza do atendimento)</legend>
        {/* ... (checkboxes que definirão o fluxo) ... */}
      </fieldset>

      {/* --- SEÇÃO 9: TIPO DE VÍTIMA --- */}
      <fieldset>
        <legend>Tipo de Vítima</legend>
        {/* ... (inputs da quantidade de vítimas) ... */}
      </fieldset>

      {/* --- SEÇÃO 10: VEÍCULOS ENVOLVIDOS (Renderização Condicional) --- */}
      <fieldset>
        <legend>Veículos Envolvidos</legend>
        <div className="form-group">
          <div className="radio-columns">
            <label><input type="radio" name="veiculosEnvolvidos" value="SIM" checked={formData.veiculosEnvolvidos === 'SIM'} onChange={handleChange}/> Sim</label>
            <label><input type="radio" name="veiculosEnvolvidos" value="NAO" checked={formData.veiculosEnvolvidos === 'NAO'} onChange={handleChange}/> Não</label>
          </div>
        </div>
        {formData.veiculosEnvolvidos === 'SIM' && (
          <div className="veiculos-grid">
            {/* Aqui entrariam os inputs para os Veículos 1 e 2 */}
            <p className="full-span">Detalhes do Veículo 1...</p>
            <p className="full-span">Detalhes do Veículo 2...</p>
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
        {/* ... (Inputs de Posto/Grad, Matrículas, etc) ... */}
        <div className="guarnicao-grid">
            <div className="assinatura">
                <p>Assinatura</p>
            </div>
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