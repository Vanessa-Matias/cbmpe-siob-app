import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import siobLogo from '../../assets/siob-logo.png';
import { 
  FaXmark, FaGrip, FaTriangleExclamation, FaChartPie, FaUsers, FaShieldHalved, FaGear, FaArrowRightFromBracket, FaMoon, FaSun
} from 'react-icons/fa6';

// 1. Adicionamos a nova propriedade 'toggleTheme' ao nosso "contrato".
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void; // A nova propriedade foi adicionada aqui.
};

const Sidebar = ({ isOpen, onClose, toggleTheme }: SidebarProps) => {
  const currentTheme = document.documentElement.getAttribute('data-theme');

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-overlay" onClick={onClose}></div>
      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-container">
              <img src={siobLogo} alt="Logo SIOB" className="sidebar-logo-image" />
            </div>
            <div className="sidebar-logo-text">
              <strong>SIOB</strong>
              <small>Sistema Operacional</small>
            </div>
          </div>
          <button onClick={onClose} className="sidebar-close-btn">
            <FaXmark />
          </button>
        </header>

        <nav className="sidebar-nav">
          <p>Navegação Principal</p>
          <ul>
            <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}> <FaGrip /> Dashboard</NavLink></li>
            <li><NavLink to="/ocorrencias" className={({ isActive }) => isActive ? "active-link" : ""}> <FaTriangleExclamation /> Ocorrências</NavLink></li>
            <li><NavLink to="/relatorios" className={({ isActive }) => isActive ? "active-link" : ""}> <FaChartPie /> Relatórios</NavLink></li>
            <li><NavLink to="/usuarios" className={({ isActive }) => isActive ? "active-link" : ""}> <FaUsers /> Usuários</NavLink></li>
            <li><NavLink to="/auditoria" className={({ isActive }) => isActive ? "active-link" : ""}> <FaShieldHalved /> Auditoria</NavLink></li>
            <li><NavLink to="/configuracoes" className={({ isActive }) => isActive ? "active-link" : ""}> <FaGear /> Configurações</NavLink></li>
          </ul>
        </nav>

        <footer className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">CS</div>
            <div className="user-info">
              <span>Comandante Silva</span>
              <small>Admin</small>
            </div>
          </div>
          <button className="logout-button-sidebar">
            <FaArrowRightFromBracket /> Sair
          </button>
        </footer>
      </aside>
    </div>
  );
};

export default Sidebar;