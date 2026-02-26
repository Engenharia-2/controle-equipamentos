import { useState, useEffect, useMemo } from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';
import type { Rental } from '../../../../core/entities/Rental';
import { IndexedDBEquipmentRepository } from '../../../../infrastructure/repositories/IndexedDBEquipmentRepository';
import { IndexedDBRentalRepository } from '../../../../infrastructure/repositories/IndexedDBRentalRepository';

export const useFinancialSummaryLogic = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [allRentals, setAllRentals] = useState<Rental[]>([]);
  
  const equipmentRepository = useMemo(() => new IndexedDBEquipmentRepository(), []);
  const rentalRepository = useMemo(() => new IndexedDBRentalRepository(), []);

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
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    // Função para verificar se uma locação estava ativa em um determinado mês/ano
    const wasActiveIn = (rental: Rental, month: number, year: number) => {
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      const targetStart = new Date(year, month, 1);
      const targetEnd = new Date(year, month + 1, 0);

      return start <= targetEnd && end >= targetStart;
    };

    // Métrica Atual (Mês Presente)
    const activeRentalsNow = allRentals.filter(r => r.status === 'Ativa');
    const monthlyActiveRevenue = activeRentalsNow.reduce((acc, r) => acc + (r.monthlyValue || 0), 0);
    const activeCount = activeRentalsNow.length;
    const averageMonthlyTicket = activeCount > 0 ? monthlyActiveRevenue / activeCount : 0;

    // Métrica Mês Anterior (Para Comparativo)
    const rentalsLastMonth = allRentals.filter(r => wasActiveIn(r, lastMonth, lastMonthYear));
    const revenueLastMonth = rentalsLastMonth.reduce((acc, r) => acc + (r.monthlyValue || 0), 0);
    const countLastMonth = rentalsLastMonth.length;

    // Cálculo de Tendência (Diferença percentual ou absoluta)
    const revenueGrowth = revenueLastMonth > 0 
      ? ((monthlyActiveRevenue - revenueLastMonth) / revenueLastMonth) * 100 
      : 0;

    // Potencial e Valor Contratado (Baseado no estado atual)
    const totalPotentialMonthlyRevenue = equipments.reduce((acc, eq) => acc + (eq.allocationValue || 0), 0);
    
    const totalContractedValue = activeRentalsNow.reduce((acc, r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return acc + ((r.monthlyValue / 30) * diffDays);
    }, 0);

    return {
      monthlyActiveRevenue,
      revenueLastMonth,
      revenueGrowth,
      averageMonthlyTicket,
      totalPotentialMonthlyRevenue,
      totalContractedValue,
      activeCount,
      countLastMonth,
      countGrowth: monthlyActiveRevenue - revenueLastMonth // Diferença absoluta de valor
    };
  }, [equipments, allRentals]);

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
