import { useState, useEffect, useMemo } from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';
import type { Rental } from '../../../../core/entities/Rental';
import { useRepositories } from '../../../../shared/contexts/RepositoryContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { useDashboard } from '../../../contexts/DashboardContext';
import { calculateRentalStatus } from '../../../../shared/utils/rentalStatus';

ChartJS.register(ArcElement, Tooltip, Legend);

export const useEquipmentStatusLogic = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [allRentals, setAllRentals] = useState<Rental[]>([]);
  const { filters } = useDashboard();
  const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light'));
  
  const { equipmentRepository, rentalRepository } = useRepositories();

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
        const [eqData, rentData] = await Promise.all([
          equipmentRepository.getAll(),
          rentalRepository.getAll()
        ]);
        setEquipments(eqData);
        setAllRentals(rentData);
      } catch (error) {
        console.error('Erro ao carregar dados para o gráfico:', error);
      }
    };
    loadData();
  }, [equipmentRepository, rentalRepository]);

  const chartData: ChartData<'pie'> = useMemo(() => {
    const { month, year, equipmentModel } = filters;
    const targetStart = new Date(year, month, 1);
    const targetEnd = new Date(year, month + 1, 0);

    // Filtra equipamentos por modelo se selecionado
    const filteredEquipments = equipmentModel 
      ? equipments.filter(e => e.equipmentName === equipmentModel)
      : equipments;

    const statusCounts = {
      'Locação': 0,
      'Disponível': 0,
      'Expirado': 0
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredEquipments.forEach(eq => {
      const activeRental = allRentals.find(r => {
        const rEquipmentId = typeof (r as any).equipment === 'object' ? (r as any).equipment.id : (r as any).equipment || r.equipmentId;
        return rEquipmentId === eq.id && r.status === 'Ativa' && new Date(r.startDate) <= targetEnd;
      });

      if (activeRental) {
        // Usa a data de referência (hoje ou fim do mês filtrado)
        const referenceDate = targetEnd > today ? targetEnd : today;
        const { status } = calculateRentalStatus(activeRental.startDate, activeRental.endDate, referenceDate);

        if (status === 'Expirado') {
          statusCounts['Expirado']++;
        } else {
          statusCounts['Locação']++;
        }
      } else {
        const wasRentedInPeriod = allRentals.some(r => {
          const rEquipmentId = typeof (r as any).equipment === 'object' ? (r as any).equipment.id : (r as any).equipment || r.equipmentId;
          return rEquipmentId === eq.id && r.status === 'Finalizada' && new Date(r.startDate) <= targetEnd && new Date(r.endDate) >= targetStart;
        });

        if (wasRentedInPeriod) {
          statusCounts['Locação']++;
        } else {
          statusCounts['Disponível']++;
        }
      }
    });

    return {
      labels: ['Locação', 'Disponível', 'Expirado'],
      datasets: [
        {
          data: [statusCounts['Locação'], statusCounts['Disponível'], statusCounts['Expirado']],
          backgroundColor: [
            'rgba(46, 125, 50, 0.7)',
            'rgba(25, 118, 210, 0.7)',
            'rgba(211, 47, 47, 0.7)',
          ],
          borderColor: [
            'rgba(46, 125, 50, 1)',
            'rgba(25, 118, 210, 1)',
            'rgba(211, 47, 47, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [equipments, allRentals, filters]);

  const options: ChartOptions<'pie'> = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isLightMode ? '#505050' : '#ccc',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
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
