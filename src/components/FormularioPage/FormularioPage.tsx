/**
 * @file FormularioPage.tsx
 * @description Componente principal que gerencia as etapas do formulário de ocorrência.
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FormularioBasico from './FormularioBasico'; // Importa a primeira etapa
import './FormularioPage.css';

/**
 * Componente funcional FormularioPage.
 * Controla o fluxo de preenchimento do formulário de ocorrência.
 */
const FormularioPage = () => {
  // O hook 'useParams' pega o ':id' da ocorrência que definimos na URL.
  const { id } = useParams();

  return (
    <div className="page-container">
      {/* Cabeçalho da página do formulário */}
      <header className="page-header">
        <div className="page-title">
          <h2>Registro de Ocorrência: #{id}</h2>
          <p>Preencha os dados abaixo para registrar a ocorrência</p>
        </div>
      </header>

      {/* Container principal do formulário */}
      <div className="form-card">
        {/* Por enquanto, renderizamos apenas o componente do Formulário Básico */}
        <FormularioBasico />
      </div>
    </div>
  );
};

export default FormularioPage;