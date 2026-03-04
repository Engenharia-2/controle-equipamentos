import { useState, useEffect, useCallback } from 'react';
import type { Rental } from '../../core/entities/Rental';
import { useRepositories } from '../../shared/contexts/RepositoryContext';

export interface RentalWithDetails extends Rental {
  clientName: string;
  equipmentName: string;
  serialNumber: string;
}

export const useRentals = () => {
  const [rentals, setRentals] = useState<RentalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRental, setEditingRental] = useState<RentalWithDetails | null>(null);

  const { rentalRepository } = useRepositories();

  const loadRentals = useCallback(async () => {
    try {
      setLoading(true);
      const rentalsData = await rentalRepository.getAll();

      // Filtrar apenas locações ativas para a listagem principal
      const activeRentalsData = rentalsData.filter(r => r.status === 'Ativa');

      const detailedRentals = activeRentalsData.map(rental => {
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

  return {
    rentals,
    loading,
    editingRental,
    setEditingRental,
    handleFinishRental,
    handleDeleteRental,
    refresh: loadRentals
  };
};
