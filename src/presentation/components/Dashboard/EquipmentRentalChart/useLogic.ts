import { useState, useEffect, useMemo } from 'react';
import type { Rental } from '../../../../core/entities/Rental';
import { useRepositories } from '../../../../shared/contexts/RepositoryContext';
import { 
  Chart as ChartJS, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend 
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { useDashboard } from '../../../contexts/DashboardContext';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const useEquipmentRentalLogic = () => {
  const [allRentals, setAllRentals] = useState<Rental[]>([]);
  const { filters } = useDashboard();
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light'));
  const { rentalRepository } = useRepositories();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLightMode(document.body.classList.contains('light'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await rentalRepository.getAll();
        setAllRentals(data);
      } catch (error) {
        console.error('Erro ao carregar dados para o gráfico de locações:', error);
      }
    };
    loadData();
  }, [rentalRepository]);

  const chartData: ChartData<'bar'> = useMemo(() => {
    const { month, year, equipmentModel } = filters;
    const targetStart = new Date(year, month, 1);
    const targetEnd = new Date(year, month + 1, 0);

    const distribution: Record<string, number> = {};
    
    // Filtra locações ativas no período
    const activeRentals = allRentals.filter(rental => {
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      
      // Verifica se a locação estava ativa no período alvo
      const isActiveInPeriod = start <= targetEnd && end >= targetStart;
      if (!isActiveInPeriod) return false;

      // Se houver filtro de modelo, aplica
      if (equipmentModel) {
        const modelName = (rental as any).equipment?.equipmentName || '';
        return modelName === equipmentModel;
      }

      return true;
    });

    activeRentals.forEach(rental => {
      const modelName = (rental as any).equipment?.equipmentName || 'Modelo não Identificado';
      distribution[modelName] = (distribution[modelName] || 0) + 1;
    });

    const sortedEntries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    const labels = sortedEntries.map(entry => entry[0]);
    const data = sortedEntries.map(entry => entry[1]);

    return {
      labels,
      datasets: [
        {
          label: 'Locações Ativas',
          data,
          backgroundColor: 'rgba(46, 125, 50, 0.7)', // Tom de verde para diferenciar do estoque
          borderColor: 'rgba(46, 125, 50, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [allRentals, filters]);

  const options: ChartOptions<'bar'> = useMemo(() => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `Locações: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { 
          color: isLightMode ? '#505050' : '#ccc',
          stepSize: 1
        },
        grid: { color: isLightMode ? '#e1e4e8' : '#333' }
      },
      y: {
        ticks: { 
          color: isLightMode ? '#505050' : '#ccc',
          font: { size: 11 }
        },
        grid: { display: false }
      }
    }
  }), [isLightMode]);

  return {
    chartData,
    options,
    hasData: allRentals.length > 0
  };
};
