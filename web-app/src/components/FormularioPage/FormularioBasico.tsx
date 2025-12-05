/**
 * @file FormularioBasico.tsx
 * @description Renderiza a UI completa do formulário básico de ocorrência.
 * Inclui blindagem contra dados undefined para evitar crashes.
 * Requer: npm install signature_pad
 * Autora: Vanessa Matias 💻.
 */
import React, { useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';
import './FormularioPage.css';
import { MapPin, Camera, Signature } from 'lucide-react';

// Interface do componente
interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  submitText: string;
  isLoading?: boolean; // <--- 1. ADICIONADO AQUI
}

const FormularioBasico: React.FC<Props> = ({ formData, handleChange, handleSubmit, handleCancel, submitText, isLoading }) => { // <--- 2. ADICIONADO AQUI
  
  // --- BLINDAGEM DE DADOS (Segurança contra Crashes) ---
  // Garante acesso seguro aos objetos aninhados, mesmo que venham vazios do banco/localstorage
  const endereco = formData.endereco || {};
  const formulariosPreenchidos = formData.formulariosPreenchidos || {};
  const veiculo1 = formData.veiculo1 || {};
  const veiculo2 = formData.veiculo2 || {};
  const guarnicaoEmpenhada = formData.guarnicaoEmpenhada || {};
  const componentesGuarnicao = guarnicaoEmpenhada.componentes || Array(6).fill('');

  // REFERÊNCIAS
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadInstance = useRef<SignaturePad | null>(null);

  // --- LÓGICA DE INICIALIZAÇÃO DA ASSINATURA (useEffect) ---
  useEffect(() => {
    if (canvasRef.current) {
      // 1. Inicializa o SignaturePad
      signaturePadInstance.current = new SignaturePad(canvasRef.current, {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgba(255,255,255,0)",
        minWidth: 1,
        maxWidth: 2,
      });
      
      // 2. Função para redimensionar o canvas
      const resizeCanvas = () => {
          if (canvasRef.current && signaturePadInstance.current) {
              const ratio = Math.max(window.devicePixelRatio || 1, 1);
              canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
              canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
              canvasRef.current.getContext('2d')?.scale(ratio, ratio);
              
              // Tenta restaurar a assinatura se houver dados (modo edição)
              if (formData.assinaturaDigital) {
                  signaturePadInstance.current.fromDataURL(formData.assinaturaDigital);
              } else {
                  signaturePadInstance.current?.clear(); 
              }
          }
      };
      
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas(); 
      
      // Cleanup
      return () => {
          window.removeEventListener('resize', resizeCanvas);
          signaturePadInstance.current?.off(); 
          signaturePadInstance.current = null;
      };
    }
  }, [formData.assinaturaDigital]); 

  // --- 3. Função de captura de localização GPS ---
  const handleGPSCapture = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada neste dispositivo.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleChange({ target: { name: 'endereco.latitude', value: latitude } });
        handleChange({ target: { name: 'endereco.longitude', value: longitude } });
      },
      (error) => alert('Erro ao capturar localização: ' + error.message)
    );
  };
  
  // --- 4. Função para limpar o canvas de assinatura ---
  const handleClearSignature = () => {
      signaturePadInstance.current?.clear();
      handleChange({ target: { name: 'assinaturaDigital', value: '' } });
  };
  
  // --- 5. Handler que captura a assinatura antes de submeter ---
  const preSubmitHandler = (e: React.FormEvent) => {
      e.preventDefault(); // IMPORTANTE: Previne reload
      // Captura a assinatura no formato base64 antes de enviar
      if (signaturePadInstance.current && !signaturePadInstance.current.isEmpty()) {
          const dataURL = signaturePadInstance.current.toDataURL(); 
          handleChange({ target: { name: 'assinaturaDigital', value: dataURL } }); 
      }
      handleSubmit(e); // Chama o handler principal
  }

  return (
    <form className="form-card" onSubmit={preSubmitHandler}> 
      {/* --- SEÇÃO 1: CABEÇALHO --- */}
      <div className="top-header-grid">
        {/* Ponto Base */}
        <fieldset className="field-col">
          <div className="form-group">
            <label htmlFor="pontoBase">Ponto Base</label>
            <input
              type="text"
              id="pontoBase"
              name="pontoBase"
              placeholder="Ex: B-2025001234"
              value={formData.pontoBase || ''}
              onChange={handleChange}
            />
            <p className="ome-text">OME ________ / GB / Seção ________</p>
          </div>
        </fieldset>

        {/* Viatura Responsável */}
        <fieldset className="field-col">
          <div className="form-group">
            <label>Viatura Responsável</label>
            <div className="input-pair">
              <input
                type="text"
                name="viaturaTipo"
                placeholder="Tipo (Ex: ABT)"
                value={formData.viaturaTipo || ''}
                onChange={handleChange}
              />
              <input
                type="text"
                name="viaturaOrdem"
                placeholder="Nº Ordem"
                value={formData.viaturaOrdem || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </fieldset>

        {/* Formulário Básico */}
        <fieldset className="field-col">
          <legend>Formulário Básico</legend>
          <div className="form-group-grid">
            <div className="form-group">
              <label htmlFor="numAviso">Número do aviso (I-NETDISPATCHER)</label>
              <input
                type="text"
                id="numAviso"
                name="numAviso"
                placeholder="Informe o tipo e número de ordem"
                value={formData.numAviso || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dataAviso">Data</label>
              <input
                type="date"
                id="dataAviso"
                name="dataAviso"
                value={formData.dataAviso || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </fieldset>
      </div>

      {/* --- SEÇÃO 2: DADOS DA OCORRÊNCIA --- */}
      <fieldset>
        <legend>Dados da Ocorrência</legend>
        <div className="ocorrencia-mini-grid">
            <div className="form-group">
                <label htmlFor="co">CO</label>
                <input type="text" id="co" name="co" placeholder="Ex: 123" value={formData.co || ''} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="ciods">CIODS</label>
                <input type="text" id="ciods" name="ciods" placeholder="Ex: 45" value={formData.ciods || ''} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="numero193">193</label>
                <input type="text" id="numero193" name="numero193" placeholder="Ex: 567" value={formData.numero193 || ''} onChange={handleChange}/>
            </div>
            <div className="form-group"> 
                <label htmlFor="situacao">Situação</label>
                <select id="situacao" name="situacao" value={formData.situacao || 'pendente'} onChange={handleChange}>
                    <option value="pendente">Pendente</option>
                    <option value="em-andamento">Em andamento</option>
                    <option value="finalizada">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="trote">Trote</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="prioridade">Prioridade</label>
                <select id="prioridade" name="prioridade" value={formData.prioridade || 'Média'} onChange={handleChange}>
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                </select>
            </div>
        </div>
      </fieldset>
       
      {/* --- SEÇÃO 3: LOCALIZAÇÃO E GPS --- */}
      <fieldset>
        <legend>Localização da Ocorrência</legend>
        <div className="form-group">
          <label htmlFor="rua">Rua / Avenida</label>
          <input type="text" id="rua" name="endereco.rua" value={endereco.rua || ''} onChange={handleChange} placeholder="Ex: Av. Gov. Agamenon Magalhães" />
        </div>
        <div className="form-group-grid-4-col" style={{ marginTop: '1rem' }}>
          <div className="form-group"><label htmlFor="numero">Nº</label><input type="text" id="numero" name="endereco.numero" value={endereco.numero || ''} onChange={handleChange} placeholder="Ex: 123" /></div>
          <div className="form-group"><label htmlFor="bairro">Bairro</label><input type="text" id="bairro" name="endereco.bairro" value={endereco.bairro || ''} onChange={handleChange} placeholder="Ex: Boa Viagem" /></div>
          <div className="form-group"><label htmlFor="municipio">Município</label><input type="text" id="municipio" name="endereco.municipio" value={endereco.municipio || ''} onChange={handleChange} placeholder="Ex: Recife" /></div>
          <div className="form-group"><label htmlFor="codigoLocal">Código do Local</label><input type="text" id="codigoLocal" name="endereco.codigoLocal" value={endereco.codigoLocal || ''} onChange={handleChange} placeholder="Cód. Anexo B" /></div>
        </div>
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label htmlFor="referencia">Ponto de Referência</label>
          <input type="text" id="referencia" name="endereco.referencia" value={endereco.referencia || ''} onChange={handleChange} placeholder="Ex: Próximo ao Shopping Recife" />
        </div>
        
        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>Coordenadas GPS</label>
          <div className="gps-capture-group">
            <input type="text" id="latitude" name="endereco.latitude" placeholder="Latitude" readOnly value={endereco.latitude || ''} />
            <input type="text" id="longitude" name="endereco.longitude" placeholder="Longitude" readOnly value={endereco.longitude || ''} />
            <button type="button" id="btnCapturarGps" className="gps-button" onClick={handleGPSCapture}>
              Capturar GPS
            </button>
          </div>
        </div>
      </fieldset>

      {/* --- SEÇÃO MÍDIA E ASSINATURAS --- */}
      <fieldset>
        <legend>Mídia e Assinaturas</legend>
        
        <div className="form-group">
          <label htmlFor="fotoOcorrencia">Fotografia da Ocorrência</label>
          <input 
            type="file" 
            id="fotoOcorrencia" 
            name="fotoOcorrencia" 
            accept="image/*" 
            capture="environment" 
            onChange={handleChange}
          />
          <small>Toque para abrir a câmera traseira e registrar uma foto.</small>
        </div>
        
        <div className="form-group" style={{marginTop: '1.5rem'}}>
          <label>Assinatura Digital (Testemunha / Vítima)</label>
          <div id="signature-pad-container" className="assinatura-container">
              <canvas ref={canvasRef} id="signature-canvas" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}></canvas>
          </div>
          <button type="button" id="btnClearSignature" className="button-cancel" style={{ marginTop: '10px', width: 'auto' }} onClick={handleClearSignature}>
              Limpar Assinatura
          </button>
        </div>
      </fieldset>

      {/* --- SEÇÃO 8: FORMULÁRIOS PREENCHIDOS --- */}
      <fieldset>
        <legend>Formulários Preenchidos (decorrentes da natureza do atendimento)</legend>

        <div className="checkbox-grid-2-col">
          <div className="form-check-item">
            <input
              type="checkbox"
              id="formAph"
              name="formulariosPreenchidos.atdPreHospitalar"
              checked={formulariosPreenchidos.atdPreHospitalar || false}
              onChange={handleChange}
            />
            <label htmlFor="formAph">Atendimento Pré-Hospitalar</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="formGerenciamento"
              name="formulariosPreenchidos.formularioGerenciamento"
              checked={formulariosPreenchidos.formularioGerenciamento || false}
              onChange={handleChange}
            />
            <label htmlFor="formGerenciamento">Formulário de Gerenciamento</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="formComunitaria"
              name="formulariosPreenchidos.atividadeComunitaria"
              checked={formulariosPreenchidos.atividadeComunitaria || false}
              onChange={handleChange}
            />
            <label htmlFor="formComunitaria">Atividade Comunitária</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="formProdutoPerigoso"
              name="formulariosPreenchidos.produtoPerigoso"
              checked={formulariosPreenchidos.produtoPerigoso || false}
              onChange={handleChange}
            />
            <label htmlFor="formProdutoPerigoso">Produto Perigoso</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="formIncendio"
              name="formulariosPreenchidos.incendio"
              checked={formulariosPreenchidos.incendio || false}
              onChange={handleChange}
            />
            <label htmlFor="formIncendio">Incêndio</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="formSalvamento"
              name="formulariosPreenchidos.salvamento"
              checked={formulariosPreenchidos.salvamento || false}
              onChange={handleChange}
            />
            <label htmlFor="formSalvamento">Salvamento</label>
          </div>
          <div className="form-check-item">
            <input
              type="checkbox"
              id="formPrevencao"
              name="formulariosPreenchidos.prevencao"
              checked={formulariosPreenchidos.prevencao || false}
              onChange={handleChange}
            />
            <label htmlFor="formPrevencao">Prevenção</label>
          </div>
        </div>

        <div className="form-group-inline">
          <input
            type="checkbox"
            id="outroRelatorio"
            name="formulariosPreenchidos.outroRelatorio"
            checked={formulariosPreenchidos.outroRelatorio || false}
            onChange={handleChange}
          />
          <label htmlFor="outroRelatorio">Outro relatório específico:</label>
          <input
            type="text"
            name="formulariosPreenchidos.outroRelatorioEspec"
            value={formulariosPreenchidos.outroRelatorioEspec || ''}
            onChange={handleChange}
            disabled={!formulariosPreenchidos.outroRelatorio}
            placeholder="Descreva o tipo de relatório"
          />
        </div>
      </fieldset>

      {/* --- SEÇÃO 9: TIPO DE VÍTIMA --- */}
      <fieldset>
        <legend>Tipo de Vítima</legend>
        <div className="form-group-grid-5-col">
          <div className="form-group"><label>Total</label><input type="number" name="qtdTotalVitimas" value={formData.qtdTotalVitimas || ''} onChange={handleChange}/></div>
          <div className="form-group"><label>Feridas</label><input type="number" name="feridas" value={formData.feridas || ''} onChange={handleChange}/></div>
          <div className="form-group"><label>Fatais</label><input type="number" name="fatais" value={formData.fatais || ''} onChange={handleChange}/></div>
          <div className="form-group"><label>Ilesas</label><input type="number" name="ilesas" value={formData.ilesas || ''} onChange={handleChange}/></div>
          <div className="form-group"><label>Desaparecidas</label><input type="number" name="desaparecidas" value={formData.desaparecidas || ''} onChange={handleChange}/></div>
        </div>
      </fieldset>

      {/* --- SEÇÃO 10: VEÍCULOS ENVOLVIDOS --- */}
      <fieldset>
        <legend>Veículos Envolvidos</legend>
        <div className="radio-columns">
          <label><input type="radio" name="veiculosEnvolvidos" value="SIM" checked={formData.veiculosEnvolvidos === 'SIM'} onChange={handleChange} /> Sim</label>
          <label><input type="radio" name="veiculosEnvolvidos" value="NAO" checked={formData.veiculosEnvolvidos === 'NAO'} onChange={handleChange} /> Não</label>
        </div>

        {formData.veiculosEnvolvidos === 'SIM' && (
          <div className="veiculos-detail-grid">
            {/* Veículo 1 */}
            <h4>Veículo 1</h4>
            <div className="form-group">
              <input type="text" name="veiculo1.modelo" value={veiculo1.modelo || ''} onChange={handleChange} placeholder="Modelo" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.cor" value={veiculo1.cor || ''} onChange={handleChange} placeholder="Cor" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.placa" value={veiculo1.placa || ''} onChange={handleChange} placeholder="Placa" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.estado" value={veiculo1.estado || ''} onChange={handleChange} placeholder="Estado" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.nomeCondutor" value={veiculo1.nomeCondutor || ''} onChange={handleChange} placeholder="Nome do Condutor" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.rgCpfCondutor" value={veiculo1.rgCpfCondutor || ''} onChange={handleChange} placeholder="RG/CPF" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo1.orgaoExpCondutor" value={veiculo1.orgaoExpCondutor || ''} onChange={handleChange} placeholder="Órgão Expedidor" />
            </div>

            {/* Veículo 2 */}
            <h4>Veículo 2</h4>
            <div className="form-group">
              <input type="text" name="veiculo2.modelo" value={veiculo2.modelo || ''} onChange={handleChange} placeholder="Modelo" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.cor" value={veiculo2.cor || ''} onChange={handleChange} placeholder="Cor" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.placa" value={veiculo2.placa || ''} onChange={handleChange} placeholder="Placa" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.estado" value={veiculo2.estado || ''} onChange={handleChange} placeholder="Estado" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.nomeCondutor" value={veiculo2.nomeCondutor || ''} onChange={handleChange} placeholder="Nome do Condutor" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.rgCpfCondutor" value={veiculo2.rgCpfCondutor || ''} onChange={handleChange} placeholder="RG/CPF" />
            </div>
            <div className="form-group">
              <input type="text" name="veiculo2.orgaoExpCondutor" value={veiculo2.orgaoExpCondutor || ''} onChange={handleChange} placeholder="Órgão Expedidor" />
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
            value={formData.historico || ''} 
            onChange={handleChange} 
            placeholder="Descreva a ocorrência..."
          ></textarea>
        </div>
      </fieldset>

      {/* --- SEÇÃO 12: GUARNIÇÃO EMPENHADA --- */}
      <fieldset>
        <legend>Guarnição Empenhada</legend>
        <div className="form-group-grid-4-col">
          <input type="text" name="guarnicaoEmpenhada.postoGrad" value={guarnicaoEmpenhada.postoGrad || ''} onChange={handleChange} placeholder="Posto/Grad."/>
          <input type="text" name="guarnicaoEmpenhada.matriculaCmt" value={guarnicaoEmpenhada.matriculaCmt || ''} onChange={handleChange} placeholder="Matrícula CMT"/>
          <input type="text" name="guarnicaoEmpenhada.nomeGuerraCmt" value={guarnicaoEmpenhada.nomeGuerraCmt || ''} onChange={handleChange} placeholder="Nome de Guerra"/>
          <input type="date" name="guarnicaoEmpenhada.vistoDivisao" value={guarnicaoEmpenhada.vistoDivisao || ''} onChange={handleChange}/>
        </div>
        <div className="guarnicao-grid">
          {Array(6).fill('').map((_, idx) => (
            <input 
                key={idx} 
                type="text" 
                name={`guarnicaoEmpenhada.componentes.${idx}`} 
                value={componentesGuarnicao[idx] || ''} 
                onChange={handleChange} 
                placeholder={`Matrícula componente ${idx+1}`}
            />
          ))}
        </div>
        <div className="assinatura"><p>Assinatura do CMT</p></div>
      </fieldset>

      {/* --- BOTÕES --- */}
      <div className="form-actions">
        <button type="button" className="button-cancel" onClick={handleCancel} disabled={isLoading}>
          Cancelar
        </button>
        <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading} // <--- 3. BLOQUEIO AQUI
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Salvando...' : submitText}
        </button>
      </div>
    </form>
  );
};

export default FormularioBasico;