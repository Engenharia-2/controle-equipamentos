import { useState, useEffect, useMemo } from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';
import type { Rental } from '../../../../core/entities/Rental';
import { useRepositories } from '../../../../shared/contexts/RepositoryContext';
import { useDashboard } from '../../../contexts/DashboardContext';

export const useFinancialSummaryLogic = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [allRentals, setAllRentals] = useState<Rental[]>([]);
  const { filters } = useDashboard();
  
  const { equipmentRepository, rentalRepository } = useRepositories();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eqData, rentalData] = await Promise.all([
          equipmentRepository.getAll(),
          rentalRepository.getAll()
        ]);
        setEquipments(eqData);
        setAllRentals(rentalData);
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
      }
    };
    loadData();
  }, [equipmentRepository, rentalRepository]);

  const metrics = useMemo(() => {
    const { month, year, equipmentModel } = filters;

    // Filtro de Modelo nos Equipamentos (para potencial)
    const filteredEquipments = equipmentModel 
      ? equipments.filter(e => e.equipmentName === equipmentModel)
      : equipments;

    // Função para verificar se uma locação estava ativa no mês/ano filtrado
    const wasActiveInPeriod = (rental: any) => {
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      const targetStart = new Date(year, month, 1);
      const targetEnd = new Date(year, month + 1, 0);

      // Verificação direta no modelo do equipamento aninhado
      if (equipmentModel && rental.equipment?.equipmentName !== equipmentModel) {
        return false;
      }

      return start <= targetEnd && end >= targetStart;
    };

    // Locações vigentes no período filtrado
    const activeRentalsInPeriod = allRentals.filter(wasActiveInPeriod);
    
    // 1. Faturamento Mensal do Período
    const monthlyActiveRevenue = activeRentalsInPeriod.reduce((acc, r) => acc + (r.monthlyValue || 0), 0);
    
    // 2. Volume de Locações no Período
    const activeCount = activeRentalsInPeriod.length;
    
    // 3. Ticket Médio no Período
    const averageMonthlyTicket = activeCount > 0 ? monthlyActiveRevenue / activeCount : 0;

    // 4. Valor Total Contratado (Pro rata baseada no mês)
    const totalContractedValue = activeRentalsInPeriod.reduce((acc, r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return acc + ((r.monthlyValue / 30) * diffDays);
    }, 0);

    // 5. Potencial Mensal Máximo (Baseado no baseValue do estoque filtrado)
    const totalPotentialMonthlyRevenue = filteredEquipments.reduce((acc, eq) => acc + (eq.baseValue || 0), 0);

    return {
      monthlyActiveRevenue,
      averageMonthlyTicket,
      totalPotentialMonthlyRevenue,
      totalContractedValue,
      activeCount
    };
  }, [equipments, allRentals, filters]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return {
    metrics,
    formatCurrency,
    hasData: equipments.length > 0 || allRentals.length > 0
  };
};
