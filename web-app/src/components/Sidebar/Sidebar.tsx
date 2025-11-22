import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';
import siobLogo from '../../assets/siob-logo.png';
import { 
  FaXmark, FaGrip, FaTriangleExclamation, FaChartPie, FaUsers, FaShieldHalved, FaGear, FaArrowRightFromBracket 
} from 'react-icons/fa6';

// 1. Removida a propriedade 'toggleTheme' do contrato.
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  // Removida a lógica de ler o 'data-theme'

  // --- LÓGICA DE LOGOUT ---
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

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
              <span>Capitã Vanessa</span>
              <small>Admin</small>
            </div>
          </div>
          
          <div className="footer-actions">
            <button className="logout-button-sidebar" onClick={handleLogout}>
              <FaArrowRightFromBracket /> <span>Sair</span>
            </button>
            {/* Botão de tema removido daqui */}
          </div>
        </footer>
      </aside>
    </div>
  );
};

export default Sidebar;