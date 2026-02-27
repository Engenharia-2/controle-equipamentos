import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useEquipmentRentalLogic } from './useLogic';
import styles from './styles.module.css';

export const EquipmentRentalChart: React.FC = () => {
  const { chartData, options, hasData } = useEquipmentRentalLogic();

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartWrapper} style={{ height: '350px' }}>
        {hasData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className={styles.noDataMsg}>Sem locações registradas para o período selecionado.</div>
        )}
      </div>
    </div>
  );
};
