import { useState, useEffect, useMemo } from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';
import type { Rental } from '../../../../core/entities/Rental';
import { useRepositories } from '../../../../shared/contexts/RepositoryContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { useDashboard } from '../../../contexts/DashboardContext';

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

    filteredEquipments.forEach(eq => {
      // Busca se houve locação ativa para este equipamento específico no mês selecionado
      const rentalInPeriod = allRentals.find(r => {
        // Ajuste para lidar com o objeto vindo da API
        const rEquipmentId = typeof (r as any).equipment === 'object' ? (r as any).equipment.id : (r as any).equipment || r.equipmentId;
        if (rEquipmentId !== eq.id) return false;
        
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        return start <= targetEnd && end >= targetStart;
      });

      if (rentalInPeriod) {
        const end = new Date(rentalInPeriod.endDate);
        const today = new Date(); // Aqui poderíamos usar targetEnd se quiséssemos o status "naquele dia"
        
        if (targetEnd > end) {
          statusCounts['Expirado']++;
        } else {
          statusCounts['Locação']++;
        }
      } else {
        statusCounts['Disponível']++;
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
