import { useState, useMemo } from 'react';
import type { RentalWithDetails } from './useRentals';
import type { RentalFilterState } from '../components/Rental/RentalFilters/useLogic';
import { calculateRentalStatus } from '../../shared/utils/rentalStatus';

export const useRentalFilters = (rentals: RentalWithDetails[]) => {
  const [activeFilters, setActiveFilters] = useState<RentalFilterState>({});

  const handleFilterChange = (filters: RentalFilterState) => {
    setActiveFilters(filters);
  };

  const filteredRentals = useMemo(() => {
    return rentals.filter(rental => matchesRentalFilters(rental, activeFilters));
  }, [rentals, activeFilters]);

  return {
    filteredRentals,
    activeFilters,
    handleFilterChange
  };
};

/**
 * Função auxiliar para verificar se uma locação atende aos filtros ativos.
 * Encapsula a lógica de comparação para reduzir o acoplamento no hook principal.
 */
function matchesRentalFilters(rental: RentalWithDetails, filters: RentalFilterState): boolean {
  // Filtro de Status Dinâmico usando lógica centralizada
  if (filters.status) {
    const { status } = calculateRentalStatus(rental.startDate, rental.endDate);
    if (status !== filters.status) return false;
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
