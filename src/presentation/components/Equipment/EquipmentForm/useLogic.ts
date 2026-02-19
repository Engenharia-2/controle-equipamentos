import { useState, useEffect } from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';

interface UseEquipmentFormLogicProps {
  onSubmit: (equipment: Omit<Equipment, 'id'>) => void;
  onClose: () => void;
  initialData?: Equipment | null;
}

export const useEquipmentFormLogic = ({ onSubmit, onClose, initialData }: UseEquipmentFormLogicProps) => {
  const [formData, setFormData] = useState<Omit<Equipment, 'id' | 'remainingDays'>>({
    orderNumber: 0,
    client: '',
    status: 'Disponível',
    equipmentName: '',
    startDate: '',
    endDate: '',
    allocationValue: 0,
    seller: '',
    serialNumber: 0,
  });

  useEffect(() => {
    if (initialData) {
      const { id, remainingDays, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'orderNumber' || name === 'serialNumber' || name === 'allocationValue'
        ? Number(value) 
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, remainingDays: 0 });
    onClose();
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};
