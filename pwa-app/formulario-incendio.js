document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formIncendio');
  const cancelarButton = document.getElementById('cancelarButton');
  const STORAGE_KEY = 'ocorrenciasPendentes';

  // === Cancelar e voltar para o formulário básico ===
  cancelarButton.addEventListener('click', () => {
    if (confirm('Deseja cancelar o preenchimento e voltar?')) {
      window.location.href = 'formulario-basico.html';
    }
  });

  // === Salvar dados localmente ===
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const dados = {
      grupo: form.querySelector('input[name="grupo"]:checked')?.value || '',
      tempoExtincao: form.tempoExtincao.value,
      tempoRescaldo: form.tempoRescaldo.value,
      consumoAgua: form.consumoAgua.value,
      consumoLGE: form.consumoLGE.value,
      acoes: {
        extincao: document.getElementById('acaoExtincao').checked,
        rescaldo: document.getElementById('acaoRescaldo').checked,
        ventilacao: document.getElementById('acaoVentilacao').checked,
        resfriamento: document.getElementById('acaoResfriamento').checked,
      },
      recursos: {
        hidranteUrbano: document.getElementById('recursoHidranteUrbano').checked,
        aguaTransportada: document.getElementById('recursoAguaTransportada').checked,
        rio: document.getElementById('recursoRio').checked,
        piscina: document.getElementById('recursoPiscina').checked,
      },
      dataRegistro: new Date().toLocaleString(),
      tipoFormulario: 'incendio'
    };

    // Adiciona ao LocalStorage
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    registros.push(dados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));

    alert('Formulário de Incêndio salvo localmente!');
    form.reset();
  });
});
