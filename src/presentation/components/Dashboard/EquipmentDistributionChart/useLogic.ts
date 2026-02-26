import { useState, useEffect, useMemo } from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';
import { IndexedDBEquipmentRepository } from '../../../../infrastructure/repositories/IndexedDBEquipmentRepository';
import { 
  Chart as ChartJS, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend 
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const useEquipmentDistributionLogic = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light'));
  const repository = useMemo(() => new IndexedDBEquipmentRepository(), []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLightMode(document.body.classList.contains('light'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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

  const chartData: ChartData<'bar'> = useMemo(() => {
    const distribution: Record<string, number> = {};
    
    equipments.forEach(eq => {
      const name = eq.equipmentName;
      distribution[name] = (distribution[name] || 0) + 1;
    });

    // Ordenar por quantidade decrescente para facilitar a leitura
    const sortedEntries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    const labels = sortedEntries.map(entry => entry[0]);
    const data = sortedEntries.map(entry => entry[1]);

    return {
      labels,
      datasets: [
        {
          label: 'Quantidade',
          data,
          backgroundColor: 'rgba(100, 108, 255, 0.7)',
          borderColor: 'rgba(100, 108, 255, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [equipments]);

  const options: ChartOptions<'bar'> = useMemo(() => ({
    indexAxis: 'y' as const, // Transforma em gráfico de barras horizontais
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ocultar legenda pois só temos um dataset
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a: any, b: any) => (a as number) + (b as number), 0);
            const value = context.raw as number;
            const percentage = ((value / (total as number)) * 100).toFixed(1);
            return `Quantidade: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: isLightMode ? '#505050' : '#ccc',
        },
        grid: {
          color: isLightMode ? '#e1e4e8' : '#333',
        }
      },
      y: {
        ticks: {
          color: isLightMode ? '#505050' : '#ccc',
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    }
  }), [isLightMode]);

  return {
    chartData,
    options,
    hasData: equipments.length > 0
  };
};
