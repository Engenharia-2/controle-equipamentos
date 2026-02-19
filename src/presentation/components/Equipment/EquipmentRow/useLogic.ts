import type { Equipment } from '../../../../core/entities/Equipment';

export const useEquipmentRowLogic = (equipment: Equipment) => {
  const getStatusClass = () => {
    switch (equipment.status) {
      case 'Locação':
        return 'status-rented';
      case 'Expirado':
        return 'status-expired';
      case 'Disponível':
        return 'status-available';
      default:
        return '';
    }
  };

  const formatDate = (date: string) => {
    if (!date || date === '-') return '-';
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return date;
    }
  };

  const calculateRemainingDays = (endDate: string) => {
    if (!endDate || endDate === '-' || equipment.status === 'Disponível') return 0;

    const end = new Date(endDate);
    const now = new Date();
    
    // Reset hours to compare only dates
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffInTime = end.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    return diffInDays > 0 ? diffInDays : 0;
  };

  return {
    getStatusClass,
    formatDate,
    remainingDays: calculateRemainingDays(equipment.endDate),
  };
};
