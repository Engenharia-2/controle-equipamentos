import { useState, useEffect, useMemo } from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';
import { ApiEquipmentRepository } from '../../../../infrastructure/repositories/ApiEquipmentRepository';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const useEquipmentDistributionLogic = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const repository = useMemo(() => new ApiEquipmentRepository(), []);

  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const data = await repository.getAll();
        setEquipments(data);
      } catch (error) {
        console.error('Erro ao carregar dados para o gráfico:', error);
      }
    };
    loadEquipments();
  }, [repository]);

  const chartData: ChartData<'pie'> = useMemo(() => {
    const distribution: Record<string, number> = {};
    
    equipments.forEach(eq => {
      const name = eq.equipmentName;
      distribution[name] = (distribution[name] || 0) + 1;
    });

    const labels = Object.keys(distribution);
    const data = Object.values(distribution);

    return {
      labels,
      datasets: [
        {
          label: 'Quantidade',
          data,
          backgroundColor: [
            'rgba(100, 108, 255, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)',
            'rgba(83, 102, 255, 0.7)',
            'rgba(40, 167, 69, 0.7)',
            'rgba(220, 53, 69, 0.7)',
            'rgba(255, 193, 7, 0.7)',
          ],
          borderColor: [
            'rgba(100, 108, 255, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(40, 167, 69, 1)',
            'rgba(220, 53, 69, 1)',
            'rgba(255, 193, 7, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [equipments]);

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#ccc',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return {
    chartData,
    options,
    hasData: equipments.length > 0
  };
};
