import { useState, useEffect, useMemo } from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';
import { ApiEquipmentRepository } from '../../../../infrastructure/repositories/ApiEquipmentRepository';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const useEquipmentStatusLogic = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const repository = useMemo(() => new ApiEquipmentRepository(), []);

  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const data = await repository.getAll();
        setEquipments(data);
      } catch (error) {
        console.error('Erro ao carregar dados de status para o gráfico:', error);
      }
    };
    loadEquipments();
  }, [repository]);

  const chartData: ChartData<'pie'> = useMemo(() => {
    const statusCounts: Record<string, number> = {
      'Locação': 0,
      'Disponível': 0,
      'Expirado': 0,
    };
    
    equipments.forEach(eq => {
      statusCounts[eq.status]++;
    });

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    return {
      labels,
      datasets: [
        {
          label: 'Quantidade',
          data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)', // Locação (Azul)
            'rgba(75, 192, 192, 0.7)', // Disponível (Verde)
            'rgba(255, 99, 132, 0.7)', // Expirado (Vermelho)
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
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
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
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
