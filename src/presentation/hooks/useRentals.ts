import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Rental } from '../../core/entities/Rental';
import { useRepositories } from '../../shared/contexts/RepositoryContext';
import type { RentalFilterState } from '../components/Rental/RentalFilters/useLogic';

export interface RentalWithDetails extends Rental {
  clientName: string;
  equipmentName: string;
  serialNumber: string;
}

export const useRentals = () => {
  const [rentals, setRentals] = useState<RentalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<RentalFilterState>({});
  const [editingRental, setEditingRental] = useState<RentalWithDetails | null>(null);

  const { rentalRepository } = useRepositories();

  const loadRentals = useCallback(async () => {
    try {
      setLoading(true);
      const rentalsData = await rentalRepository.getAll();

      // Filtrar apenas locações ativas para a listagem principal
      const activeRentalsData = rentalsData.filter(r => r.status === 'Ativa');

      const detailedRentals = activeRentalsData.map(rental => {
        // Na API, as relações já vêm populadas (ou deveriam, conforme configuramos no service)
        const client = (rental as any).client;
        const equipment = (rental as any).equipment;

        return {
          ...rental,
          clientName: client ? client.name : (rental.clientId ? 'Cliente não encontrado' : 'Cliente Excluído'),
          equipmentName: equipment ? equipment.equipmentName : 'Equipamento não encontrado',
          serialNumber: equipment ? equipment.serialNumber : '-'
        } as RentalWithDetails;
      });

      setRentals(detailedRentals);
    } catch (error) {
      console.error('Erro ao carregar locações:', error);
    } finally {
      setLoading(false);
    }
  }, [rentalRepository]);

  useEffect(() => {
    loadRentals();
  }, [loadRentals]);

  const handleFinishRental = async (rental: RentalWithDetails) => {
    if (window.confirm('Deseja finalizar esta locação? O equipamento voltará a ficar disponível e o histórico será preservado.')) {
      try {
        await rentalRepository.update({
          ...rental,
          status: 'Finalizada'
        });
        await loadRentals();
      } catch (error) {
        console.error('Erro ao finalizar locação:', error);
        alert('Erro ao finalizar locação.');
      }
    }
  };

  const handleDeleteRental = async (id: string) => {
    if (window.confirm('Deseja EXCLUIR permanentemente este registro de locação? Esta ação não pode ser desfeita.')) {
      try {
        await rentalRepository.delete(id);
        await loadRentals();
      } catch (error) {
        console.error('Erro ao excluir locação:', error);
        alert('Erro ao excluir locação.');
      }
    }
  };

  const handleFilterChange = (filters: RentalFilterState) => {
    setActiveFilters(filters);
  };

  const filteredRentals = useMemo(() => {
    return rentals.filter(rental => matchesRentalFilters(rental, activeFilters));
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
    editingRental,
    setEditingRental,
    handleFinishRental,
    handleDeleteRental,
    handleFilterChange,
    formatCurrency,
    formatDate,
    refresh: loadRentals
  };
};

/**
 * Função auxiliar para verificar se uma locação atende aos filtros ativos.
 * Encapsula a lógica de comparação para reduzir o acoplamento no hook principal.
 */
function matchesRentalFilters(rental: RentalWithDetails, filters: RentalFilterState): boolean {
  // Filtro de Status Dinâmico (Alocado, Expirando, Expirado)
  if (filters.status) {
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

    if (currentStatus !== filters.status) return false;
  }

  // Filtros de Texto (Busca Case-Insensitive)
  const normalize = (val: string | number | undefined) => String(val ?? '').toLowerCase();
  
  if (filters.clientName && !normalize(rental.clientName).includes(normalize(filters.clientName))) return false;
  if (filters.equipmentName && !normalize(rental.equipmentName).includes(normalize(filters.equipmentName))) return false;
  if (filters.serialNumber && !normalize(rental.serialNumber).includes(normalize(filters.serialNumber))) return false;
  if (filters.seller && !normalize(rental.seller).includes(normalize(filters.seller))) return false;

  // Filtro de Mês de Término
  if (filters.endMonth !== undefined) {
    const endDate = new Date(rental.endDate);
    if (endDate.getMonth() !== filters.endMonth) return false;
  }

  return true;
}

