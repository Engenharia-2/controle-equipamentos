import React from 'react';
import { FinancialSummary } from '../../components/Dashboard/FinancialSummary';
import { EquipmentStatusChart } from '../../components/Dashboard/EquipmentStatusChart';
import { EquipmentDistributionChart } from '../../components/Dashboard/EquipmentDistributionChart';
import { EquipmentRentalChart } from '../../components/Dashboard/EquipmentRentalChart';
import { DashboardFilter } from '../../components/Dashboard/DashboardFilter';
import { DashboardProvider } from '../../contexts/DashboardContext';
import styles from './styles.module.css';

const Dashboard: React.FC = () => {
  return (
    <DashboardProvider>
      <div className={styles.dashboardPage}>
        <header className={styles.dashboardHeader}>
          <h1>Dashboard de Gestão</h1>
          <p>Visão geral de faturamento, contratos e estoque.</p>
        </header>

        <main className={styles.dashboardContent}>
          <section className={styles.filterSection}>
            <DashboardFilter />
          </section>

          <div className={styles.mainLayout}>
            {/* Coluna da Esquerda: Indicadores Financeiros */}
            <aside className={styles.sideColumn}>
              <FinancialSummary />
            </aside>

            {/* Coluna da Direita: Gráficos */}
            <section className={styles.chartsColumn}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartCardTitle}>Performance de Locações por Modelo</h3>
                <EquipmentRentalChart />
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartCardTitle}>Status do Estoque no Período</h3>
                <EquipmentStatusChart />
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartCardTitle}>Distribuição Total de Estoque</h3>
                <EquipmentDistributionChart />
              </div>
            </section>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
