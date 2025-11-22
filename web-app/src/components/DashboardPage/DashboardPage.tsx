import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './DashboardPage.css';
import { FaBars } from 'react-icons/fa6'; // Ícones de lua e sol removidos

// Removi a prop { toggleTheme } da definição do componente
const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // A lógica de ler o atributo 'data-theme' foi removida

  return (
    <>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        // Removi a linha: toggleTheme={toggleTheme} 
      />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <FaBars className="header-icon" onClick={() => setSidebarOpen(true)} />
            <h1>Sistema Integrado de Ocorrências dos Bombeiros</h1>
          </div>
          {/* Se houver um botão de tema aqui no header, pode remover também */}
        </header>
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;