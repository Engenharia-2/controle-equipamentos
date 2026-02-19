import React from 'react';
import { LayoutDashboard, HardDrive } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import './styles.css';

export const Sidebar: React.FC = () => {
  const { handleNavigation, isActive } = useNavigation();

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Controle EQ</div>
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
      </nav>
    </aside>
  );
};
