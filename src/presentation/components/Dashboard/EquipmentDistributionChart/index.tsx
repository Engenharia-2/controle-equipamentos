import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useEquipmentDistributionLogic } from './useLogic';
import './styles.css';

export const EquipmentDistributionChart: React.FC = () => {
  const { chartData, options, hasData } = useEquipmentDistributionLogic();

  return (
    <div className="chart-container">
      <h3 className="chart-title">Distribuição de Equipamentos por Modelo (%)</h3>
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
