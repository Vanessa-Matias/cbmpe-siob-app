// ==========================================================================
// components/Formularios/formulario-basico.js
// Lógica do Formulário Básico - Adaptado para SPA
// ==========================================================================

console.log("Script formulario-basico.js carregado.");

// --- Função Principal de Inicialização ---
// Chamada após o HTML ser carregado pelo app.js
function inicializarFormularioBasico() {
    console.log("Inicializando Formulário Básico...");

    // --- Referências aos Elementos do DOM ---
    const form = document.getElementById('ocorrenciaForm');
    const cancelButton = document.getElementById('cancelButton');
    const btnCapturarGps = document.getElementById('btnCapturarGps');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const btnAvancar = document.getElementById('avancarButton');
    const canvas = document.getElementById('signature-canvas');
    const clearSignatureBtn = document.getElementById('btnClearSignature');
    const veiculosRadios = document.querySelectorAll('input[name="veiculosEnvolvidos"]');
    const veiculosDetalhesContainer = document.getElementById('veiculos-detalhes-container');
    const apoioOutroCheck = document.getElementById('apoioOutroCheck');
    const apoioOutroDesc = document.getElementById('apoioOutroDesc');
    const outroRelatorioCheck = document.getElementById('outroRelatorio');
    const outroRelatorioInput = document.getElementById('outroRelatorioEspec');
    const cpfInput = document.getElementById('cpfRg');
    const telInput = document.getElementById('contatoTelefonico');

    // --- Variáveis Globais do Módulo ---
    let signaturePad = null; // Inicializa como null
    const STORAGE_KEY = 'ocorrencias'; // Chave unificada das ocorrências
    // const EDITING_KEY = 'editingIndex'; // Lógica de edição pode ser reimplementada depois
    // const LAST_INDEX_KEY = 'lastSavedIndex';

    // --- Verifica se os elementos essenciais existem ---
    if (!form || !btnAvancar) {
        console.error("ERRO CRÍTICO: Formulário ou botão Avançar não encontrado!");
        return;
    }

    // ==============================================================
    // === 1. CARREGAR BIBLIOTECA SignaturePad DINAMICAMENTE ===
    // ==============================================================
    function loadSignaturePadScript(callback) {
        // Verifica se a biblioteca já foi carregada
        if (typeof SignaturePad !== 'undefined') {
            console.log("SignaturePad já carregado.");
            callback();
            return;
        }
        // Cria a tag script dinamicamente
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js';
        script.onload = () => {
            console.log("Biblioteca SignaturePad carregada com sucesso.");
            callback(); // Chama a função de inicialização do pad
        };
        script.onerror = () => {
            console.error("ERRO: Falha ao carregar a biblioteca SignaturePad.");
            alert("Não foi possível carregar a funcionalidade de assinatura.");
        };
        document.body.appendChild(script); // Adiciona ao final do body
    }

    // ==============================================================
    // === 2. INICIALIZAÇÃO DA ASSINATURA (Após carregar script) ===
    // ==============================================================
    function initializeSignaturePad() {
        if (canvas && typeof SignaturePad !== 'undefined') {
            // Garante que o canvas tenha dimensões antes de inicializar
            if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
                 signaturePad = new SignaturePad(canvas, { backgroundColor: 'white' });
                 console.log("SignaturePad inicializado.");

                 // Função para redimensionar o canvas (importante para assinatura)
                 const resizeCanvas = () => {
                     const ratio = Math.max(window.devicePixelRatio || 1, 1);
                     canvas.width = canvas.offsetWidth * ratio;
                     canvas.height = canvas.offsetHeight * ratio;
                     canvas.getContext('2d').scale(ratio, ratio);
                     signaturePad.clear(); // Limpa ao redimensionar
                     console.log("Canvas da assinatura redimensionado.");
                 };

                 // Adiciona listener para redimensionar se a janela mudar
                 window.addEventListener('resize', resizeCanvas);
                 resizeCanvas(); // Chama uma vez para definir o tamanho inicial

                 // Adiciona listener para o botão de limpar
                 if (clearSignatureBtn) {
                     clearSignatureBtn.addEventListener('click', () => {
                         if (signaturePad) signaturePad.clear();
                     });
                 } else { console.warn("Botão Limpar Assinatura não encontrado."); }

            } else {
                 console.warn("Canvas da assinatura ainda não tem dimensões visíveis. Tentando novamente em breve...");
                 // Tenta inicializar novamente após um pequeno atraso
                 setTimeout(initializeSignaturePad, 100);
            }
        } else {
            console.warn("Elemento canvas ou biblioteca SignaturePad não encontrados para inicialização.");
        }
    }

    // Carrega o script e DEPOIS inicializa o pad
    loadSignaturePadScript(initializeSignaturePad);

    // ==============================================================
    // === 3. VEÍCULOS ENVOLVIDOS ===
    // ==============================================================
    if (veiculosRadios.length > 0 && veiculosDetalhesContainer) {
        // Define o estado inicial baseado no radio 'Nao' que está 'checked'
        veiculosDetalhesContainer.style.display = document.querySelector('input[name="veiculosEnvolvidos"][value="NAO"]:checked') ? 'none' : 'grid';

        veiculosRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const show = e.target.value === 'SIM';
                veiculosDetalhesContainer.style.display = show ? 'grid' : 'none';
            });
        });
    } else { console.warn("Elementos para 'Veículos Envolvidos' não encontrados."); }

    // ==============================================================
    // === 4. CAPTURA DE GPS ===
    // ==============================================================
    if (btnCapturarGps && latitudeInput && longitudeInput) {
        btnCapturarGps.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('Geolocalização não suportada neste navegador.');
                return;
            }
            btnCapturarGps.textContent = 'Capturando...';
            btnCapturarGps.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    latitudeInput.value = pos.coords.latitude.toFixed(7);
                    longitudeInput.value = pos.coords.longitude.toFixed(7);
                    btnCapturarGps.textContent = 'GPS Capturado!';
                    btnCapturarGps.style.backgroundColor = '#28a745'; // Verde sucesso
                    setTimeout(() => { // Volta ao normal depois de um tempo
                        btnCapturarGps.textContent = 'Capturar GPS';
                        btnCapturarGps.style.backgroundColor = ''; // Remove cor de fundo
                        btnCapturarGps.disabled = false;
                    }, 3000);
                },
                (err) => {
                    console.error('Erro ao capturar GPS:', err);
                    alert(`Erro ao obter coordenadas: ${err.message}. Verifique as permissões de localização.`);
                    btnCapturarGps.textContent = 'Falha ao Capturar';
                    btnCapturarGps.style.backgroundColor = '#dc3545'; // Vermelho erro
                     setTimeout(() => { // Volta ao normal depois de um tempo
                        btnCapturarGps.textContent = 'Capturar GPS';
                        btnCapturarGps.style.backgroundColor = '';
                        btnCapturarGps.disabled = false;
                    }, 3000);
                },
                { // Opções para melhorar a precisão e tempo limite
                    enableHighAccuracy: true,
                    timeout: 10000, // 10 segundos
                    maximumAge: 0 // Força nova leitura
                }
            );
        });
    } else { console.warn("Elementos para captura de GPS não encontrados."); }


    // ==============================================================
    // === 5. BOTÃO CANCELAR ===
    // ==============================================================
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            if (confirm('Deseja realmente limpar todos os campos do formulário?')) {
                form.reset();
                if (signaturePad) signaturePad.clear();
                // Garante que a seção de veículos seja escondida ao resetar
                if (veiculosDetalhesContainer) veiculosDetalhesContainer.style.display = 'none';
                // Garante que o checkbox 'Nao' de veículos volte a ser marcado
                const radioNao = document.querySelector('input[name="veiculosEnvolvidos"][value="NAO"]');
                if (radioNao) radioNao.checked = true;
                // Reseta o botão do GPS
                if(btnCapturarGps){
                     btnCapturarGps.textContent = 'Capturar GPS';
                     btnCapturarGps.style.backgroundColor = '';
                     btnCapturarGps.disabled = false;
                }
                 console.log("Formulário resetado.");
            }
        });
    } else { console.warn("Botão Cancelar não encontrado."); }

    // ==============================================================
    // === 6. CAMPOS "OUTRO" (Apoio e Relatório) ===
    // ==============================================================
    function setupToggleInput(checkboxId, inputId) {
        const checkbox = document.getElementById(checkboxId);
        const input = document.getElementById(inputId);
        if (checkbox && input) {
            input.disabled = !checkbox.checked; // Estado inicial
            checkbox.addEventListener('change', (e) => {
                input.disabled = !e.target.checked;
                if (!e.target.checked) input.value = ''; // Limpa se desmarcado
            });
        } else {
             console.warn(`Checkbox ${checkboxId} ou Input ${inputId} não encontrado(s).`);
        }
    }
    setupToggleInput('apoioOutroCheck', 'apoioOutroDesc');
    setupToggleInput('outroRelatorio', 'outroRelatorioEspec');


    // ==============================================================
    // === 7. MÁSCARAS E VALIDAÇÕES ===
    // ==============================================================
    // (Funções formatCPF, formatPhoneBR, stripNonDigits, validateCPF permanecem as mesmas)
     function formatCPF(value) { /* ...código da função... */ }
     function formatPhoneBR(value) { /* ...código da função... */ }
     function stripNonDigits(str) { return (str || '').toString().replace(/\D/g, ''); }
     function validateCPF(cpf) { /* ...código da função... */ return true; /* Simplificado para teste */ }


    // Aplica máscaras aos inputs
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => { e.target.value = formatCPF(e.target.value); });
    } else { console.warn("Input CPF/RG não encontrado."); }
    if (telInput) {
        telInput.addEventListener('input', (e) => { e.target.value = formatPhoneBR(e.target.value); });
    } else { console.warn("Input Telefone não encontrado."); }


    // ==============================================================
    // === 8. LÓGICA DE SUBMISSÃO (SALVAR/AVANÇAR) ===
    // ==============================================================

    // --- Função Auxiliar: Coleta dados complexos ---
    function coletarDadosFormulario() {
        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        // --- Adiciona dados não capturados pelo FormData ---
        dados.dataRegistroISO = new Date().toISOString(); // Padrão ISO para consistência
        dados.status = 'Pendente'; // Define status inicial
        // (Você pode adicionar outros campos padrão aqui se necessário)

        // --- Adiciona GPS ---
        dados.latitude = latitudeInput?.value || null;
        dados.longitude = longitudeInput?.value || null;

        // --- Adiciona Assinatura (se houver) ---
        if (signaturePad && !signaturePad.isEmpty()) {
            dados.assinaturaDigital = signaturePad.toDataURL(); // Salva como Data URL
        } else {
            dados.assinaturaDigital = null;
        }
        
        // --- Remove máscaras antes de salvar ---
        if (dados.cpfRg) dados.cpfRg = stripNonDigits(dados.cpfRg);
        if (dados.contatoTelefonico) dados.contatoTelefonico = stripNonDigits(dados.contatoTelefonico);

        // --- Adiciona um ID único (simples para demo) ---
        dados.id = `OCR-PWA-${Date.now().toString().slice(-6)}`;

        // --- Pega informações dos checkboxes (exemplo) ---
        dados.formSelecionadoIncendio = document.getElementById('formIncendio')?.checked || false;
        // ... (adicione outros checkboxes que precisam ser salvos)

        console.log("Dados coletados:", dados); // Log para depuração
        return dados;
    }


    // --- Event Listener para o Botão AVANÇAR ---
    if (btnAvancar) {
        btnAvancar.addEventListener('click', (e) => {
            e.preventDefault(); // Impede submissão padrão se estiver dentro do form

            console.log("Botão Avançar clicado.");

            // --- Validação HTML5 ---
            if (!form.checkValidity()) {
                form.reportValidity();
                alert('Por favor, preencha todos os campos obrigatórios (*).');
                return;
            }
            
            // --- Validação Específica (Ex: CPF) ---
            if (cpfInput && cpfInput.value && !validateCPF(cpfInput.value)) {
                 alert('CPF inválido. Verifique e tente novamente.');
                 cpfInput.focus(); // Coloca o foco no campo inválido
                 return;
             }

            // --- Coleta os Dados ---
            const dadosOcorrencia = coletarDadosFormulario();

            // --- Salva no sessionStorage ---
            const ocorrenciasAtuais = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
            ocorrenciasAtuais.unshift(dadosOcorrencia); // Adiciona no início da lista
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ocorrenciasAtuais));
            console.log("Ocorrência salva no sessionStorage:", dadosOcorrencia);
            alert('Ocorrência salva localmente!');

            // --- Decide para onde navegar ---
            const irParaIncendio = document.getElementById('formIncendio')?.checked;
            // ... (adicione verificações para outros formulários: salvamento, aph, etc.)

            // --- Navegação via loadContent ---
            if (typeof loadContent === 'function') {
                if (irParaIncendio) {
                    console.log("Navegando para Formulário de Incêndio...");
                    // Certifique-se que os caminhos e nomes estão corretos!
                    loadContent('./components/Formularios/formulario-incendio.html', './components/Formularios/formulario-incendio.js');
                } else {
                    console.log("Navegando de volta para a Lista de Ocorrências...");
                    // Volta para a lista após salvar o básico
                    loadContent('./components/ListaOcorrencias/listas-ocorrencias.html', './components/ListaOcorrencias/lista-ocorrencias.js');
                }
            } else {
                 console.error("Função loadContent não encontrada. Usando fallback de hash.");
                 // Fallback (menos ideal para SPA)
                 if(irParaIncendio) window.location.hash = '#formulario-incendio';
                 else window.location.hash = '#ocorrencias';
            }

        });
    } else { console.warn("Botão Avançar não encontrado."); }

    // --- Lógica de Edição (Placeholder) ---
    // (A lógica `prefillIfEditing` precisaria ser adaptada para ler query params ou sessionStorage)
    // console.log("Verificando se está em modo de edição...");

} // --- Fim da função inicializarFormularioBasico ---


// --- Ponto de Entrada do Script ---
// Chama a função principal de inicialização.
inicializarFormularioBasico();