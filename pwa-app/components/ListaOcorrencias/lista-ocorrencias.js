(function(){
  const STORAGE_KEY = 'ocorrenciasPendentes';
  const EDITING_KEY = 'editingIndex';

  function render() {
    const container = document.getElementById('lista');
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (!container) return;
    if (registros.length === 0) {
      container.innerHTML = '<p>Não há ocorrências salvas localmente.</p>';
      return;
    }

    const list = document.createElement('div');
    list.className = 'ocorrencias-list';

    registros.forEach((r, idx) => {
      const card = document.createElement('div');
      card.className = 'field-col';
      card.style.marginBottom = '12px';

      const title = document.createElement('div');
      title.innerHTML = `<strong>${r.pontoBase || 'Sem Ponto'}</strong> <span style="margin-left:8px; color:#666;">${r.dataRegistro || ''}</span>`;
      card.appendChild(title);

      if (r.naturezaAviso) {
        const nat = document.createElement('div');
        nat.textContent = 'Natureza: ' + r.naturezaAviso;
        card.appendChild(nat);
      }

      const actions = document.createElement('div');
      actions.style.marginTop = '8px';

      const editar = document.createElement('button');
      editar.textContent = 'Editar';
      editar.className = 'submit-button';
      editar.style.marginRight = '8px';
      editar.addEventListener('click', () => {
        localStorage.setItem(EDITING_KEY, String(idx));
        window.location.href = 'formulario-basico.html';
      });

      const enviar = document.createElement('button');
      enviar.textContent = 'Enviar (simular)';
      enviar.className = 'button-cancel';
      enviar.style.marginRight = '8px';
      enviar.addEventListener('click', () => {
        if (!confirm('Simular envio desta ocorrência?')) return;
        // Simulação: remover do array e salvar
        registros.splice(idx, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
        render();
        alert('Ocorrência simulada como enviada.');
      });

      const excluir = document.createElement('button');
      excluir.textContent = 'Excluir';
      excluir.className = 'button-cancel';
      excluir.addEventListener('click', () => {
        if (!confirm('Excluir este registro?')) return;
        registros.splice(idx, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
        render();
      });

      actions.appendChild(editar);
      actions.appendChild(enviar);
      actions.appendChild(excluir);
      card.appendChild(actions);
      list.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(list);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
