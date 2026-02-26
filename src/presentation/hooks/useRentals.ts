import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Rental } from '../../core/entities/Rental';
import { IndexedDBRentalRepository } from '../../infrastructure/repositories/IndexedDBRentalRepository';
import { IndexedDBClientRepository } from '../../infrastructure/repositories/IndexedDBClientRepository';
import { IndexedDBEquipmentRepository } from '../../infrastructure/repositories/IndexedDBEquipmentRepository';
import type { RentalFilterState } from '../components/Rental/RentalFilters/useLogic';

export interface RentalWithDetails extends Rental {
  clientName: string;
  equipmentName: string;
  serialNumber: number | string;
}

export const useRentals = () => {
  const [rentals, setRentals] = useState<RentalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<RentalFilterState>({});

  const rentalRepository = useMemo(() => new IndexedDBRentalRepository(), []);
  const clientRepository = useMemo(() => new IndexedDBClientRepository(), []);
  const equipmentRepository = useMemo(() => new IndexedDBEquipmentRepository(), []);

  const loadRentals = useCallback(async () => {
    try {
      setLoading(true);
      const [rentalsData, clientsData, equipmentsData] = await Promise.all([
        rentalRepository.getAll(),
        clientRepository.getAll(),
        equipmentRepository.getAll()
      ]);

      // Filtrar apenas locações ativas para a listagem principal
      const activeRentalsData = rentalsData.filter(r => r.status === 'Ativa');

      const detailedRentals = activeRentalsData.map(rental => {
        const client = clientsData.find(c => c.id === rental.clientId);
        const equipment = equipmentsData.find(e => e.id === rental.equipmentId);

        return {
          ...rental,
          clientName: client ? client.name : 'Cliente não encontrado',
          equipmentName: equipment ? equipment.equipmentName : 'Equipamento não encontrado',
          serialNumber: equipment ? equipment.serialNumber : '-'
        };
      });

      setRentals(detailedRentals);
    } catch (error) {
      console.error('Erro ao carregar locações:', error);
    } finally {
      setLoading(false);
    }
  }, [rentalRepository, clientRepository, equipmentRepository]);

  useEffect(() => {
    loadRentals();
  }, [loadRentals]);

  const handleFinishRental = async (rental: RentalWithDetails) => {
    if (window.confirm('Deseja finalizar esta locação? O equipamento voltará a ficar disponível e o histórico será preservado.')) {
      try {
        // 1. Atualizar a locação para status 'Finalizada' (em vez de deletar)
        await rentalRepository.update({
          ...rental,
          status: 'Finalizada'
        });

        // 2. Voltar equipamento para Disponível
        const equipment = await equipmentRepository.getById(rental.equipmentId);
        if (equipment) {
          await equipmentRepository.update({
            ...equipment,
            status: 'Disponível',
            client: '-',
            startDate: '-',
            endDate: '-',
            allocationValue: 0,
            seller: '-'
          });
        }

        await loadRentals();
      } catch (error) {
        console.error('Erro ao finalizar locação:', error);
        alert('Erro ao finalizar locação.');
      }
    }
  };

  const handleFilterChange = (filters: RentalFilterState) => {
    setActiveFilters(filters);
  };

  const filteredRentals = useMemo(() => {
    return rentals.filter(rental => {
      // Filtro de Status Dinâmico (Alocado, Expirando, Expirado)
      if (activeFilters.status) {
        const end = new Date(rental.endDate);
        const start = new Date(rental.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);

        let currentStatus = 'Alocado';
        if (today > end) {
          currentStatus = 'Expirado';
        } else {
          const totalTime = end.getTime() - start.getTime();
          const remainingTime = end.getTime() - today.getTime();
          const totalDays = Math.max(1, totalTime / (1000 * 60 * 60 * 24));
          const remainingDays = Math.max(0, remainingTime / (1000 * 60 * 60 * 24));
          if (remainingDays <= (totalDays * 0.3)) {
            currentStatus = 'Expirando';
          }
        }

        if (currentStatus !== activeFilters.status) return false;
      }

      // Filtros de Texto
      if (activeFilters.clientName && !rental.clientName.toLowerCase().includes(activeFilters.clientName.toLowerCase())) return false;
      if (activeFilters.equipmentName && !rental.equipmentName.toLowerCase().includes(activeFilters.equipmentName.toLowerCase())) return false;
      if (activeFilters.serialNumber && !String(rental.serialNumber).toLowerCase().includes(activeFilters.serialNumber.toLowerCase())) return false;
      if (activeFilters.seller && !rental.seller.toLowerCase().includes(activeFilters.seller.toLowerCase())) return false;
      
      // Filtro de Mês de Término
      if (activeFilters.endMonth !== undefined) {
        const endDate = new Date(rental.endDate);
        if (endDate.getMonth() !== activeFilters.endMonth) return false;
      }

      return true;
    });
  }, [rentals, activeFilters]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  return {
    rentals: filteredRentals,
    loading,
    handleFinishRental,
    handleFilterChange,
    formatCurrency,
    formatDate,
    refresh: loadRentals
  };
};
