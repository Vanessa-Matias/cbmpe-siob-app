/**
 * @file FormularioPage.tsx
 * @description Página que serve como container para o fluxo de criação ou edição de ocorrências.
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import FormularioBasico from './FormularioBasico';
import './FormularioPage.css'; // Certifique-se que o nome do arquivo CSS está correto

const FormularioPage = () => {
  const { id } = useParams<{ id: string }>();

  // Lógica para definir o título da página dinamicamente.
  const isEditing = Boolean(id);
  
  // ===== TEXTOS CORRIGIDOS AQUI =====
  const pageTitle = isEditing ? `Editando Ocorrência: #${id}` : 'Nova Ocorrência';
  const pageSubtitle = isEditing ? `Altere os dados necessários da ocorrência` : 'Registre uma nova ocorrência no sistema';

  return (
    <div className="page-container">
      {/* O cabeçalho agora usa os títulos corretos do protótipo. */}
      <header className="page-header">
        <div className="page-title">
          <h2>{pageTitle}</h2>
          <p>{pageSubtitle}</p>
        </div>
      </header>
      
      {/* O componente FormularioBasico é renderizado aqui. */}
      <FormularioBasico />
    </div>
  );
};

export default FormularioPage;