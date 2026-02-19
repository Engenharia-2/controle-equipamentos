import React from 'react';
import { EquipmentDistributionChart } from '../../components/Dashboard/EquipmentDistributionChart';
import { EquipmentStatusChart } from '../../components/Dashboard/EquipmentStatusChart';
import './styles.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral dos equipamentos e locações.</p>
      </header>
      
      <main className="dashboard-grid">
        <section>
          <EquipmentDistributionChart />
        </section>
        <section>
          <EquipmentStatusChart />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
