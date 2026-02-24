import React, { useState, useEffect } from 'react';
import { LayoutDashboard, HardDrive, Sun, Moon, Users } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import logoImg from '../../../assets/logoLHF5.png';
import './styles.css';

export const Sidebar: React.FC = () => {
  const { handleNavigation, isActive } = useNavigation();
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsLightMode(savedTheme === 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    
    if (newTheme) {
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <img src={logoImg} alt="Logo Controle Equipamentos" className="logo" />
      </div>
      <nav className="sidebar-nav">
        <button
          className={`nav-button ${isActive('/') ? 'active' : ''}`}
          onClick={() => handleNavigation('/')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button
          className={`nav-button ${isActive('/equipamentos') ? 'active' : ''}`}
          onClick={() => handleNavigation('/equipamentos')}
        >
          <HardDrive size={20} />
          <span>Equipamentos</span>
        </button>
        {/* <button
          className={`nav-button ${isActive('/clients') ? 'active' : ''}`}
          onClick={() => handleNavigation('/clients')}
        >
          <Users size={20} />
          <span>Clientes</span>
        </button> */}
      </nav>
      <div className="sidebar-footer">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          title={isLightMode ? "Ativar Modo Escuro" : "Ativar Modo Claro"}
        >
          {isLightMode ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>
    </aside>
  );
};
