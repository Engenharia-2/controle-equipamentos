import { useState, useEffect } from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';

interface UseEquipmentFormLogicProps {
  onSubmit: (equipment: Omit<Equipment, 'id'>) => void;
  onClose: () => void;
  initialData?: Equipment | null;
}

export const useEquipmentFormLogic = ({ onSubmit, onClose, initialData }: UseEquipmentFormLogicProps) => {
  const [formData, setFormData] = useState<Omit<Equipment, 'id' | 'remainingDays'>>({
    client: '-',
    status: 'Disponível',
    equipmentName: '',
    startDate: '-',
    endDate: '-',
    allocationValue: 0,
    seller: '-',
    serialNumber: '',
  });

  useEffect(() => {
    if (initialData) {
      const { id, remainingDays, ...rest } = initialData;
      setFormData({
        ...rest,
        serialNumber: String(rest.serialNumber)
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'allocationValue'
        ? Number(value) 
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No novo modelo, campos como client e dates serão preenchidos pela Locação futuramente.
    // Por enquanto, enviamos valores padrão para manter compatibilidade com a interface atual.
    onSubmit({ ...formData, remainingDays: 0 });
    onClose();
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};
