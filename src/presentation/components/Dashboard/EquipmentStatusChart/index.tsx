import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useEquipmentStatusLogic } from './useLogic';
import './styles.css';

export const EquipmentStatusChart: React.FC = () => {
  const { chartData, options, hasData } = useEquipmentStatusLogic();

  return (
    <div className="chart-container">
      <h3 className="chart-title">Distribuição de Equipamentos por Status (%)</h3>
      <div className="chart-wrapper">
        {hasData ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="no-data-msg">Sem dados de equipamentos disponíveis para exibição.</div>
        )}
      </div>
    </div>
  );
};
