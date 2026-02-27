import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Equipment, EquipmentStatus } from '../../../core/entities/Equipment';
import { useRepositories } from '../../../shared/contexts/RepositoryContext';
import Papa from 'papaparse';

export const useEquipamentosLogic = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [activeFilters, setActiveFilters] = useState<{ 
    status?: EquipmentStatus;
    equipmentName?: string;
    orderNumber?: string;
    seller?: string;
    client?: string;
    serialNumber?: string;
    endMonth?: number;
  }>({});
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  
  const { equipmentRepository } = useRepositories();

  const loadEquipments = useCallback(async () => {
    try {
      const data = await equipmentRepository.getAll();
      setEquipments(data);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    }
  }, [equipmentRepository]);

  useEffect(() => {
    loadEquipments();
  }, [loadEquipments]);

  const handleImportCSV = async (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "Windows-1252", 
      complete: async (results) => {
        const data = results.data as any[];
        let successCount = 0;

        try {
          for (const row of data) {
            // Limpeza e extração do número do pedido (PD 01216 -> 1216)
            const orderRaw = row['Pedido de venda'] || '';
            const orderNumber = parseInt(orderRaw.replace(/\D/g, '')) || 0;

            // Extração do nome (Descrição do produto)
            const equipmentName = row['Descrio do produto'] || row['Descrição do produto'] || 'Equipamento não identificado';

            // Extração do Serial (SN: ou SN)
            const serialNumber = (row['SN:'] || row['SN'] || '').trim();

            const newEquipment: Equipment = {
              id: crypto.randomUUID(),
              orderNumber,
              equipmentName,
              serialNumber,
              status: 'Disponível',
              client: '-',
              startDate: '-',
              endDate: '-',
              allocationValue: 0,
              seller: '-',
              remainingDays: 0
            };

            await equipmentRepository.save(newEquipment);
            successCount++;
          }

          alert(`${successCount} equipamentos importados com sucesso!`);
          await loadEquipments();
        } catch (error) {
          console.error('Erro ao salvar equipamentos importados:', error);
          alert('Ocorreu um erro ao salvar os equipamentos no banco de dados.');
        }
      },
      error: (error) => {
        console.error('Erro ao processar CSV:', error);
        alert('Erro ao processar o arquivo CSV.');
      }
    });
  };

  const handleSaveEquipment = async (equipmentData: Omit<Equipment, 'id'>) => {
    try {
      if (editingEquipment) {
        await equipmentRepository.update({ ...equipmentData, id: editingEquipment.id });
      } else {
        const newEquipment: Equipment = {
          ...equipmentData,
          id: crypto.randomUUID(),
        };
        await equipmentRepository.save(newEquipment);
      }
      await loadEquipments();
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
      try {
        await equipmentRepository.delete(id);
        await loadEquipments();
      } catch (error) {
        console.error('Erro ao excluir equipamento:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('TEM CERTEZA? Isso excluirá TODOS os equipamentos da base de dados permanentemente.')) {
      try {
        const allEquipments = await equipmentRepository.getAll();
        for (const eq of allEquipments) {
          if (eq.id) await equipmentRepository.delete(eq.id);
        }
        await loadEquipments();
        alert('Todos os equipamentos foram excluídos.');
      } catch (error) {
        console.error('Erro ao excluir todos os equipamentos:', error);
        alert('Erro ao excluir equipamentos.');
      }
    }
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const filteredEquipments = useMemo(() => {
    return equipments.filter(eq => {
      if (activeFilters.status && eq.status !== activeFilters.status) return false;
      if (activeFilters.equipmentName && !eq.equipmentName.toLowerCase().includes(activeFilters.equipmentName.toLowerCase())) return false;
      if (activeFilters.orderNumber && !String(eq.orderNumber).includes(activeFilters.orderNumber)) return false;
      if (activeFilters.serialNumber && !eq.serialNumber.toLowerCase().includes(activeFilters.serialNumber.toLowerCase())) return false;
      return true;
    });
  }, [equipments, activeFilters]);

  return {
    equipments: filteredEquipments,
    editingEquipment,
    setEditingEquipment,
    handleSaveEquipment,
    handleDeleteEquipment,
    handleDeleteAll,
    handleFilterChange,
    handleImportCSV
  };
};
