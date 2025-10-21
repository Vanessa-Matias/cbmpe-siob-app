import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './DashboardPage.css';
import { FaBars, FaMoon, FaSun } from 'react-icons/fa6';

const DashboardLayout = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const currentTheme = document.documentElement.getAttribute('data-theme');

  return (
    <>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        toggleTheme={toggleTheme} 
      />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <FaBars className="header-icon" onClick={() => setSidebarOpen(true)} />
            <h1>Sistema Integrado de Ocorrências dos Bombeiros</h1>
          </div>
        </header>
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;