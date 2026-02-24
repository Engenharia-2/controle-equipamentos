import { useState, useEffect, useMemo } from 'react';
import type { Equipment, EquipmentStatus } from '../../../core/entities/Equipment';
import { ApiEquipmentRepository } from '../../../infrastructure/repositories/ApiEquipmentRepository';

export const useEquipamentosLogic = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [activeFilters, setActiveFilters] = useState<{ 
    status?: EquipmentStatus;
    equipmentName?: string;
    seller?: string;
    client?: string;
    serialNumber?: string;
    endMonth?: number;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  
  const repository = useMemo(() => new ApiEquipmentRepository(), []);

  const loadEquipments = async () => {
    try {
      const data = await repository.getAll();
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      const correctedData = data.map(eq => {
        if (eq.status === 'Locação' && eq.endDate && eq.endDate !== '-') {
          try {
            // Adicionado 'T00:00:00' para garantir que a data seja interpretada no fuso horário local
            const endDate = new Date(`${eq.endDate}T00:00:00`);
            if (endDate < today) {
              return { ...eq, status: 'Expirado' as EquipmentStatus };
            }
          } catch (e) {
            console.error(`Data de término inválida para o equipamento ID ${eq.id}: ${eq.endDate}`, e);
          }
        }
        return eq;
      });

      setEquipments(correctedData);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    }
  };

  useEffect(() => {
    loadEquipments();
  }, [repository]);

  const filteredEquipments = useMemo(() => {
    return equipments.filter(eq => {
      const statusMatch = !activeFilters.status || eq.status === activeFilters.status;
      const equipmentMatch = !activeFilters.equipmentName || eq.equipmentName === activeFilters.equipmentName;
      const sellerMatch = !activeFilters.seller || 
        eq.seller.toLowerCase().includes(activeFilters.seller.toLowerCase());
      const clientMatch = !activeFilters.client || 
        eq.client.toLowerCase().includes(activeFilters.client.toLowerCase());
      const serialMatch = !activeFilters.serialNumber || 
        eq.serialNumber.toString().includes(activeFilters.serialNumber);
      
      let monthMatch = true;
      if (activeFilters.endMonth !== undefined) {
        if (!eq.endDate || eq.endDate === '-') {
          monthMatch = false;
        } else {
          const endDate = new Date(`${eq.endDate}T00:00:00`);
          monthMatch = endDate.getMonth() === activeFilters.endMonth;
        }
      }
      
      return statusMatch && equipmentMatch && sellerMatch && clientMatch && serialMatch && monthMatch;
    });
  }, [equipments, activeFilters]);

  const handleOpenModal = () => {
    setEditingEquipment(null);
    setIsModalOpen(true);
  };

  const handleEditOpenModal = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEquipment(null);
  };

  const handleSaveEquipment = async (equipmentData: Omit<Equipment, 'id'>) => {
    try {
      const dataToSave = { ...equipmentData };

      if (dataToSave.status === 'Locação' && dataToSave.endDate && dataToSave.endDate !== '-') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(`${dataToSave.endDate}T00:00:00`);
        if (endDate < today) {
          dataToSave.status = 'Expirado';
        }
      }

      if (editingEquipment) {
        const updatedEquipment: Equipment = {
          ...dataToSave,
          id: editingEquipment.id,
        };
        await repository.update(updatedEquipment);
      } else {
        const newEquipment: Equipment = {
          ...dataToSave,
          id: crypto.randomUUID(),
        };
        await repository.save(newEquipment);
      }
      await loadEquipments();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este equipamento?')) {
      try {
        await repository.delete(id);
        await loadEquipments();
      } catch (error) {
        console.error('Erro ao deletar equipamento:', error);
      }
    }
  };

  const handleFilterChange = (filters: { 
    status?: EquipmentStatus;
    equipmentName?: string;
    seller?: string;
    client?: string;
    serialNumber?: string;
    endMonth?: number;
  }) => {
    setActiveFilters(filters);
  };

  return {
    equipments: filteredEquipments,
    isModalOpen,
    editingEquipment,
    handleOpenModal,
    handleEditOpenModal,
    handleCloseModal,
    handleSaveEquipment,
    handleDeleteEquipment,
    handleFilterChange
  };
};
