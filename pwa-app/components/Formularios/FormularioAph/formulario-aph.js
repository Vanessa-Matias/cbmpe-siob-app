document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'ocorrenciasPendentes';
  const LAST_INDEX_KEY = 'lastSavedIndex';
  const form = document.querySelector('form');
  if (!form) return;
  function formDataToObject(f) { return Object.fromEntries(new FormData(f).entries()); }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = formDataToObject(form);
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const lastIdxRaw = localStorage.getItem(LAST_INDEX_KEY);
    const idx = lastIdxRaw !== null ? parseInt(lastIdxRaw, 10) : (registros.length - 1);
    if (idx >= 0 && registros[idx]) {
      registros[idx].aph = dados;
      registros[idx].status = 'pronto';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
    } else {
      const novo = { dataRegistro: new Date().toLocaleString(), status: 'pronto', aph: dados };
      registros.push(novo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
    }
    alert('Ocorrência registrada com sucesso!');
    window.location.href = '../ListaOcorrencias/lista-ocorrencias.html';
  });
});
