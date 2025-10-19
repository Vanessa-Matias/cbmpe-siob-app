/**
 * @file formulario-incendio.js
 * @description Gerencia a lógica do formulário de incêndio (Etapa 2).
 * Anexa os dados de incêndio ao registro básico salvo localmente.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('incendioForm');
    const btnVoltar = document.getElementById('btnVoltar');

    // Chaves para comunicação com o formulário básico via localStorage
    const STORAGE_KEY = 'ocorrenciasPendentes';
    const LAST_INDEX_KEY = 'lastSavedIndex';

    // ==============================================================
    // === 1. LÓGICA CONDICIONAL PARA SEÇÕES DO FORMULÁRIO      ===
    // ==============================================================
    const grupoRadios = document.querySelectorAll('input[name="incendio.grupo"]');
    const detalhesEdificacao = document.getElementById('detalhesEdificacao');
    const detalhesVegetacao = document.getElementById('detalhesVegetacao');

    grupoRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const grupoSelecionado = e.target.value;
            // Mostra a seção de edificação apenas se essa opção for marcada
            detalhesEdificacao.style.display = grupoSelecionado === 'edificacao' ? 'block' : 'none';
            // Mostra a seção de vegetação apenas se essa opção for marcada
            detalhesVegetacao.style.display = grupoSelecionado === 'vegetacao' ? 'block' : 'none';
        });
    });

    // ==============================================================
    // === 2. BOTÃO VOLTAR                                        ===
    // ==============================================================
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            if (confirm('Deseja descartar as informações de incêndio e voltar ao formulário básico?')) {
                // Navega de volta para o formulário básico, usando o caminho relativo correto
                window.location.href = '../FormularioBasico/formulario-basico.html';
            }
        });
    }

    // ==============================================================
    // === 3. SUBMISSÃO DO FORMULÁRIO (LÓGICA DE FUSÃO DE DADOS) ===
    // ==============================================================
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validação simples para garantir que um grupo foi selecionado
            const grupoSelecionado = form.querySelector('input[name="incendio.grupo"]:checked');
            if (!grupoSelecionado) {
                alert('Por favor, selecione um "Grupo do Incêndio" para continuar.');
                return;
            }

            // 1. Coleta os dados do formulário de incêndio e converte em objeto aninhado
            const formData = new FormData(form);
            const dadosIncendio = {};
            for (const [rawKey, value] of formData.entries()) {
                const keys = rawKey.split('.');
                let node = dadosIncendio;
                for (let i = 0; i < keys.length - 1; i++) {
                    const k = keys[i];
                    if (!node[k]) node[k] = {};
                    node = node[k];
                }
                const last = keys[keys.length - 1];
                node[last] = value;
            }

            // Garantir que estruturas esperadas existam e normalize checkboxes para boolean
            dadosIncendio.acoes = dadosIncendio.acoes || {};
            const acoesList = ['extincao', 'rescaldo', 'ventilacao', 'resfriamento'];
            acoesList.forEach(a => {
                dadosIncendio.acoes[a] = dadosIncendio.acoes[a] ? true : false;
            });

            dadosIncendio.recursos = dadosIncendio.recursos || {};
            const recursosList = ['hidranteUrbano', 'aguaTransportada', 'rio', 'piscina'];
            recursosList.forEach(r => {
                dadosIncendio.recursos[r] = dadosIncendio.recursos[r] ? true : false;
            });

            // Vegetação - APA
            if (!dadosIncendio.vegetacao) dadosIncendio.vegetacao = {};
            dadosIncendio.vegetacao.apa = dadosIncendio.vegetacao.apa ? true : false;

            // Garantir objeto operacao e bens
            dadosIncendio.operacao = dadosIncendio.operacao || {};
            dadosIncendio.bens = dadosIncendio.bens || {};

            // 2. Carrega os registros pendentes do localStorage
            const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            const lastIdx = localStorage.getItem(LAST_INDEX_KEY);

            if (lastIdx === null || registros.length === 0) {
                alert('Erro: Não foi possível encontrar o registro básico da ocorrência para anexar os detalhes. Por favor, comece novamente.');
                window.location.href = '../FormularioBasico/formulario-basico.html';
                return;
            }

            const idx = parseInt(lastIdx, 10);

            // 3. Encontra o registro básico e anexa os dados de incêndio a ele
            if (registros[idx]) {
                // Adiciona/mescla o objeto 'incendio' ao registro básico existente
                registros[idx].incendio = {
                    ...(registros[idx].incendio || {}),
                    ...dadosIncendio
                };

                // Atualiza o status para indicar que a ocorrência está completa e pronta para sincronizar
                registros[idx].status = 'pronto';

                // 4. Salva o registro atualizado de volta no localStorage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));

                // Limpa o índice para não ser reutilizado
                localStorage.removeItem(LAST_INDEX_KEY);

                // 5. Notifica o usuário e redireciona para a lista de ocorrências
                alert('Ocorrência registrada com sucesso!');
                window.location.href = '../ListaOcorrencias/lista-ocorrencias.html';

            } else {
                alert(`Erro crítico: O registro no índice ${idx} não foi encontrado.`);
            }
        });
    }
});