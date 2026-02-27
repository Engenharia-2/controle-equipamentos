import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useEquipmentDistributionLogic } from './useLogic';
import styles from './styles.module.css';

export const EquipmentDistributionChart: React.FC = () => {
  const { chartData, options, hasData } = useEquipmentDistributionLogic();

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartWrapper} style={{ height: '400px' }}>
        {hasData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className={styles.noDataMsg}>Sem dados de equipamentos disponíveis para exibição.</div>
        )}
      </div>
    </div>
  );
};
