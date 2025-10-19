/**
 * @file formulario-basico.js
 * @description Gerencia a lógica e interatividade do formulário básico de ocorrências para o PWA.
 * Inclui captura de GPS, assinatura digital, modo offline, validação e sincronização local.
 */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('ocorrenciaForm');
  const cancelButton = document.getElementById('cancelButton');
  const btnCapturarGps = document.getElementById('btnCapturarGps');
  const latitudeInput = document.getElementById('latitude');
  const longitudeInput = document.getElementById('longitude');
  const btnAvancar = document.getElementById('avancarButton');

  // --- VARIÁVEIS GLOBAIS ---
  let signaturePad;
  const STORAGE_KEY = 'ocorrenciasPendentes';
  const LAST_INDEX_KEY = 'lastSavedIndex';

  // ==============================================================
  // === 1. VEÍCULOS ENVOLVIDOS ===
  // ==============================================================
  const veiculosRadios = document.querySelectorAll('input[name="veiculosEnvolvidos"]');
  const veiculosDetalhesContainer = document.getElementById('veiculos-detalhes-container');

  veiculosRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const show = e.target.value === 'SIM';
      veiculosDetalhesContainer.style.display = show ? 'grid' : 'none';
    });
  });

  // ==============================================================
  // === 2. CAPTURA DE GPS ===
  // ==============================================================
  if (btnCapturarGps) {
    btnCapturarGps.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocalização não suportada neste navegador.');
        return;
      }

      btnCapturarGps.textContent = 'Capturando...';
      btnCapturarGps.disabled = true;

      navigator.geolocation.getCurrentPosition((pos) => {
        latitudeInput.value = pos.coords.latitude.toFixed(7);
        longitudeInput.value = pos.coords.longitude.toFixed(7);
        btnCapturarGps.textContent = 'GPS Capturado!';
        btnCapturarGps.style.backgroundColor = '#28a745';
      }, (err) => {
        console.error('Erro ao capturar GPS:', err);
        alert('Erro ao obter coordenadas. Verifique permissões.');
        btnCapturarGps.textContent = 'Capturar GPS';
        btnCapturarGps.disabled = false;
      });
    });
  }

  // ==============================================================
  // === 3. ASSINATURA DIGITAL ===
  // ==============================================================
  const canvas = document.getElementById('signature-canvas');
  if (canvas) {
    signaturePad = new SignaturePad(canvas, { backgroundColor: 'white' });

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      signaturePad.clear();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const clearBtn = document.getElementById('btnClearSignature');
    if (clearBtn) clearBtn.addEventListener('click', () => signaturePad.clear());
  }

  // ==============================================================
  // === 4. BOTÃO CANCELAR ===
  // ==============================================================
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      if (confirm('Deseja realmente limpar o formulário?')) {
        form.reset();
        if (signaturePad) signaturePad.clear();
        veiculosDetalhesContainer.style.display = 'none';
      }
    });
  }

  // ==============================================================
  // === 5. APOIO E DIFICULDADES ===
  // ==============================================================
  const apoioOutroCheck = document.getElementById('apoioOutroCheck');
  const apoioOutroDesc = document.getElementById('apoioOutroDesc');
  if (apoioOutroCheck && apoioOutroDesc) {
    apoioOutroCheck.addEventListener('change', (e) => {
      apoioOutroDesc.disabled = !e.target.checked;
      if (!e.target.checked) apoioOutroDesc.value = '';
    });
  }

  // ==============================================================
  // === Máscaras/formatadores (CPF e Telefone) ===
  // ==============================================================
  function formatCPF(value) {
    // remove não dígitos
    const v = value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 3) return v;
    if (v.length <= 6) return v.replace(/(\d{3})(\d+)/, '$1.$2');
    if (v.length <= 9) return v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }

  function formatPhoneBR(value) {
    const v = value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 2) return v;
    if (v.length <= 6) return v.replace(/(\d{2})(\d+)/, '($1) $2');
    if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  // Attach listeners when form exists
  const cpfInput = document.getElementById('cpfRg');
  if (cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      const pos = e.target.selectionStart;
      e.target.value = formatCPF(e.target.value);
      // tentativa simples de manter o caret ao final
      e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
    });
    cpfInput.addEventListener('blur', (e) => { e.target.value = formatCPF(e.target.value); });
  }

  const telInput = document.getElementById('contatoTelefonico');
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      e.target.value = formatPhoneBR(e.target.value);
      e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
    });
    telInput.addEventListener('blur', (e) => { e.target.value = formatPhoneBR(e.target.value); });
  }

  // Helper: remove todos os caracteres não numéricos
  function stripNonDigits(str) {
    return (str || '').toString().replace(/\D/g, '');
  }

  // Validação simples do CPF (módulo 11)
  function validateCPF(cpf) {
    if (!cpf) return false;
    const s = stripNonDigits(cpf);
    if (s.length !== 11) return false;
    // Elimina CPFs com todos dígitos iguais
    if (/^(\d)\1{10}$/.test(s)) return false;

    const digits = s.split('').map(d => parseInt(d, 10));

    // cálculo do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== digits[9]) return false;

    // cálculo do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    return rev === digits[10];
  }

  // Helper: ler File como DataURL (Promise)
  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function coletarApoioEDificuldades() {
    return {
      apoio: {
        celpe: document.getElementById('apoioCelpe').checked,
        samu: document.getElementById('apoioSamu').checked,
        compesa: document.getElementById('apoioCompesa').checked,
        defesaCivil: document.getElementById('apoioDefesaCivil').checked,
        orgaoAmbiental: document.getElementById('apoioAmbiental').checked,
        pmpe: document.getElementById('apoioPmpe').checked,
        prf: document.getElementById('apoioPrf').checked,
        guardaMunicipal: document.getElementById('apoioGuarda').checked,
        ffaa: document.getElementById('apoioFfaa').checked,
        outro: apoioOutroCheck.checked,
        outroDesc: apoioOutroDesc.value
      },
      viaturas: [
        { viatura: document.getElementById('viatura1').value, guarnicao: document.getElementById('guarnicao1').value },
        { viatura: document.getElementById('viatura2').value, guarnicao: document.getElementById('guarnicao2').value },
        { viatura: document.getElementById('viatura3').value, guarnicao: document.getElementById('guarnicao3').value },
      ],
      dificuldades: {
        tempoDeslocamento: document.getElementById('difTempo').checked,
        obmSemViatura: document.getElementById('difObmSemViatura').checked,
        obmEmAtendimento: document.getElementById('difObmEmAtendimento').checked,
        faltaSinalizacao: document.getElementById('difFaltaSinalizacao').checked,
        faltaDados: document.getElementById('difFaltaDados').checked,
        transito: document.getElementById('difTransito').checked,
        areaDificilAcesso: document.getElementById('difAcesso').checked,
        paneEquipamento: document.getElementById('difPaneEquip').checked,
        paneViatura: document.getElementById('difPaneViatura').checked,
        faltaMaterial: document.getElementById('difFaltaMaterial').checked,
        naoHouve: document.getElementById('difNaoHouve').checked,
        outro: document.getElementById('difOutro').checked
      },
      naturezaAviso: document.getElementById('eventoNaturezaInicial').value
    };
  }

  // ==============================================================
  // === 6. SALVAR LOCALMENTE (modo offline) ===
  // ==============================================================
  const EDITING_KEY = 'editingIndex';

  // Preencher formulário se estamos editando um registro
  (function prefillIfEditing() {
    const editIdx = localStorage.getItem(EDITING_KEY);
    if (editIdx === null) return;
    const idx = parseInt(editIdx, 10);
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const item = registros[idx];
    if (!item) return;

    // percorre inputs/selects/textarea e preenche por name ou id
    const elements = form.querySelectorAll('input, select, textarea');
    elements.forEach(el => {
      const key = el.name || el.id;
      if (!key) return;

      // Prioriza o valor direto (quando o campo foi salvo com mesmo nome)
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const val = item[key];
        if (el.type === 'checkbox') el.checked = val === 'true' || val === 'on' || val === true;
        else if (el.type === 'radio') {
          if (el.value === val) el.checked = true;
        } else {
          el.value = val;
        }
        return;
      }

      // Tenta resolver chaves com notação ponto (ex: endereco.rua) em objeto aninhado
      const parts = key.split('.');
      let v = item;
      for (const p of parts) {
        if (v && Object.prototype.hasOwnProperty.call(v, p)) v = v[p]; else { v = undefined; break; }
      }
      if (v === undefined) return;
      if (el.type === 'checkbox') el.checked = v === 'true' || v === 'on' || v === true;
      else el.value = v;
    });

    // Restaurar assinatura se existir
    if (item.assinaturaDigital && signaturePad) {
      try { signaturePad.fromDataURL(item.assinaturaDigital); } catch (err) { console.warn('Erro ao restaurar assinatura', err); }
    }

    // Formatar CPF e telefone para exibição se existirem no item (são salvos sem máscara)
    try {
      const cpfEl = document.getElementById('cpfRg');
      if (cpfEl && item.cpfRg) cpfEl.value = formatCPF(item.cpfRg);
      const telEl = document.getElementById('contatoTelefonico');
      if (telEl && item.contatoTelefonico) telEl.value = formatPhoneBR(item.contatoTelefonico);
    } catch (err) { /* não fatal */ }

    // Limpa a flag de edição (será removida quando salvar)
  })();

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validação usando a API de Constraints do HTML: aproveita os atributos `required`, `type`, `min`, etc.
      // Se o formulário for inválido, mostra as mensagens do browser e interrompe o submit.
      if (!form.checkValidity()) {
        // mostra mensagens de validação padrão do navegador (foco/tooltip nos campos inválidos)
        form.reportValidity();
        alert('Por favor, preencha todos os campos obrigatórios destacados.');
        return;
      }

      const fotoInput = document.getElementById('fotoOcorrencia');
      const formData = new FormData(form);
      const dados = Object.fromEntries(formData.entries());
      dados.dataRegistro = new Date().toLocaleString();
      dados.status = 'pendente';
      dados.apoioEDificuldades = coletarApoioEDificuldades();

     // =============================
     //      Assinatura digital
     // ============================
      if (signaturePad && !signaturePad.isEmpty()) {
        dados.assinaturaDigital = signaturePad.toDataURL();
      }

      // ============================
      //             GPS
      // ============================
      dados.latitude = latitudeInput.value || null;
      dados.longitude = longitudeInput.value || null;

      // Valida CPF (se informado)
      if (dados.cpfRg) {
        if (!validateCPF(dados.cpfRg)) {
          alert('CPF inválido. Verifique e tente novamente.');
          return;
        }
      }

      // ============================================
      //    Foto: converter para dataURL se houver
      // ============================================
      if (fotoInput && fotoInput.files && fotoInput.files[0]) {
        try {
          dados.fotoOcorrencia = await readFileAsDataURL(fotoInput.files[0]);
        } catch (err) {
          console.error('Erro ao ler foto:', err);
        }
      }

      // =========================================
      // Salva no localStorage (respeita edição)
      // =========================================
  // Antes de salvar, remover máscaras de CPF/telefone para armazenamento consistente
  if (dados.cpfRg) dados.cpfRg = stripNonDigits(dados.cpfRg);
  if (dados.contatoTelefonico) dados.contatoTelefonico = stripNonDigits(dados.contatoTelefonico);

  let registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      const editIdx = parseInt(localStorage.getItem(EDITING_KEY), 10);
      if (!Number.isNaN(editIdx)) {
        registros[editIdx] = dados;
        localStorage.removeItem(EDITING_KEY);
      } else {
        registros.push(dados);
      }
      // grava array atualizado
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));

      // salva índice do último registro adicionado/atualizado para uso na etapa seguinte
      const lastIdx = (!Number.isNaN(editIdx) ? editIdx : (registros.length - 1));
      localStorage.setItem(LAST_INDEX_KEY, String(lastIdx));

      // Notificação padrão de salvamento local
      alert('Ocorrência salva localmente (modo offline).');

      // Se houver uma ação pós-save solicitada (ex: avançar para incêndio), trate-a
      if (window.afterSaveAction) {
        const action = window.afterSaveAction;
        window.afterSaveAction = null;
        if (action === 'gotoIncendio') {
          alert('Formulário Básico salvo! Preencha agora os detalhes do incêndio.');
          window.location.href = '../FormularioIncendio/formulario-incendio.html';
          return;
        }
        if (action === 'gotoSalvamento') {
          alert('Formulário Básico salvo! Preencha agora os detalhes do salvamento.');
          window.location.href = '../FormularioSalvamento/formulario-salvamento.html';
          return;
        }
        if (action === 'gotoPrevencao') {
          alert('Formulário Básico salvo! Preencha agora os detalhes da prevenção.');
          window.location.href = '../FormularioPrevencao/formulario-prevencao.html';
          return;
        }
        if (action === 'gotoAph') {
          alert('Formulário Básico salvo! Preencha agora os detalhes do atendimento pré-hospitalar.');
          window.location.href = '../FormularioAph/formulario-aph.html';
          return;
        }
      }

      // comportamento padrão: limpar formulário
      form.reset();
      if (signaturePad) signaturePad.clear();
      veiculosDetalhesContainer.style.display = 'none';
    });
  }

  // ==============================================
  // SINCRONIZAÇÃO AUTOMÁTICA AO VOLTAR ONLINE 
  // ==============================================
  window.addEventListener('online', () => {
    const pendentes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (pendentes.length > 0) {
      alert(`Reconectado! Enviando ${pendentes.length} ocorrência(s) para o servidor...`);
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEY);
        alert('Ocorrências sincronizadas com sucesso!');
      }, 1500);
    }
  });

  // =========================================
  //        OUTRO RELATÓRIO 
  // =========================================
  const outroCheck = document.getElementById('outroRelatorio');
  const outroInput = document.getElementById('outroRelatorioEspec');
  if (outroCheck && outroInput) {
    outroCheck.addEventListener('change', (e) => {
      outroInput.disabled = !e.target.checked;
      if (!e.target.checked) outroInput.value = '';
    });
  }

  // ==============================
  //        BOTÃO AVANÇAR 
  // ==============================
  if (btnAvancar) {
    btnAvancar.addEventListener('click', (e) => {
      // Se o formulário estiver dentro de <form> e for submit, prevenir submit padrão
      e.preventDefault && e.preventDefault();

      const has = id => !!document.getElementById(id) && document.getElementById(id).checked;

      if (has('formIncendio')) {
        // Se o usuário escolheu o formulário de Incêndio, queremos salvar o formulário básico
        // e então redirecionar para a etapa de incêndio mostrando a mensagem solicitada.
        // Sinalizamos para o submit handler que, após salvar, deve abrir o Incêndio.
        window.afterSaveAction = 'gotoIncendio';
        // Aciona o submit do formulário; o handler fará a navegação quando terminar.
        if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
        else if (form) form.submit();
        return;
      }
      if (has('formSalvamento')) {
        window.afterSaveAction = 'gotoSalvamento';
        if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
        else if (form) form.submit();
        return;
      }
      if (has('formPrevencao')) {
        window.afterSaveAction = 'gotoPrevencao';
        if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
        else if (form) form.submit();
        return;
      }
      if (has('formAph')) {
        window.afterSaveAction = 'gotoAph';
        if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
        else if (form) form.submit();
        return;
      }

      alert('Selecione ao menos um formulário para continuar.');
    });
  }

});

