import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useEquipmentStatusLogic } from './useLogic';
import styles from './styles.module.css';

export const EquipmentStatusChart: React.FC = () => {
  const { chartData, options, hasData } = useEquipmentStatusLogic();

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartWrapper}>
        {hasData ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className={styles.noDataMsg}>Sem dados de equipamentos disponíveis para exibição.</div>
        )}
      </div>
    </div>
  );
};
