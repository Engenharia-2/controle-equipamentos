import { useState, useEffect, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Rental } from '../../../../core/entities/Rental';
import type { Client } from '../../../../core/entities/Client';
import type { Equipment } from '../../../../core/entities/Equipment';
import { useRepositories } from '../../../../shared/contexts/RepositoryContext';

interface RentalFormData extends Omit<Rental, 'id' | 'status'> {}

export const useRentalFormLogic = (
  onSuccess: () => void, 
  onCancel: () => void,
  editingRental?: Rental & { clientName?: string; equipmentName?: string; serialNumber?: string; client?: any; equipment?: any }
) => {
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [allEquipments, setAllEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [clientSearch, setClientSearch] = useState('');
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [showClientResults, setShowClientResults] = useState(false);
  const [showEquipmentResults, setShowEquipmentResults] = useState(false);

  const [formData, setFormData] = useState<RentalFormData>({
    clientId: '',
    equipmentId: '',
    startDate: '',
    endDate: '',
    monthlyValue: 0,
    seller: '',
    orderNumber: 0,
  });

  const { rentalRepository, clientRepository, equipmentRepository } = useRepositories();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, equipmentsData] = await Promise.all([
          clientRepository.getAll(),
          equipmentRepository.getAll()
        ]);
        
        setAllClients(clientsData);
        
        const editingEqId = editingRental?.equipmentId || (typeof editingRental?.equipment === 'string' ? editingRental.equipment : editingRental?.equipment?.id);

        setAllEquipments(equipmentsData.filter(eq => 
          eq.status === 'Disponível' || (editingRental && eq.id === editingEqId)
        ));

        if (editingRental) {
          const clientId = editingRental.clientId || (typeof editingRental.client === 'string' ? editingRental.client : editingRental.client?.id);
          const equipmentId = editingRental.equipmentId || (typeof editingRental.equipment === 'string' ? editingRental.equipment : editingRental.equipment?.id);
          
          setFormData({
            clientId: clientId || '',
            equipmentId: equipmentId || '',
            startDate: editingRental.startDate,
            endDate: editingRental.endDate,
            monthlyValue: editingRental.monthlyValue,
            seller: editingRental.seller,
            orderNumber: editingRental.orderNumber || 0,
          });

          setClientSearch(editingRental.clientName || editingRental.client?.name || '');
          const eqName = editingRental.equipmentName || editingRental.equipment?.equipmentName;
          const eqSn = editingRental.serialNumber || editingRental.equipment?.serialNumber;
          setEquipmentSearch(`${eqName} (S/N: ${eqSn})`);
        }
      } catch (error) {
        console.error('Erro ao carregar dados para locação:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [clientRepository, equipmentRepository, editingRental]);

  const filteredClients = useMemo(() => {
    const query = clientSearch.toLowerCase().trim();
    if (!query || (formData.clientId && clientSearch === allClients.find(c => c.id === formData.clientId)?.name)) {
      return [];
    }
    return allClients.filter(c => c.name.toLowerCase().includes(query)).slice(0, 10);
  }, [allClients, clientSearch, formData.clientId]);

  const filteredEquipments = useMemo(() => {
    const query = equipmentSearch.toLowerCase().trim();
    if (!query) return [];
    return allEquipments.filter(e => 
      e.equipmentName.toLowerCase().includes(query) || e.serialNumber.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [allEquipments, equipmentSearch]);

  const handleClientSearchChange = (value: string) => {
    setClientSearch(value);
    setShowClientResults(true);
  };

  const handleEquipmentSearchChange = (value: string) => {
    setEquipmentSearch(value);
    setShowEquipmentResults(true);
  };

  const selectClient = (client: Client) => {
    setFormData(prev => ({ ...prev, clientId: client.id! }));
    setClientSearch(client.name);
    setShowClientResults(false);
  };

  const selectEquipment = (equipment: Equipment) => {
    setFormData(prev => ({ ...prev, equipmentId: equipment.id! }));
    setEquipmentSearch(`${equipment.equipmentName} (S/N: ${equipment.serialNumber})`);
    setShowEquipmentResults(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'monthlyValue' || name === 'orderNumber') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.equipmentId) {
      alert('Por favor, selecione um cliente e um equipamento das listas de sugestão.');
      return;
    }

    try {
      const rentalToSave: any = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthlyValue: formData.monthlyValue,
        seller: formData.seller,
        orderNumber: formData.orderNumber,
        status: 'Ativa',
        client: formData.clientId, // TypeORM aceita o ID direto na propriedade da relação
        equipment: formData.equipmentId
      };

      if (editingRental?.id) {
        rentalToSave.id = editingRental.id;
        await rentalRepository.update(rentalToSave);
      } else {
        await rentalRepository.save(rentalToSave);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao processar locação:', error);
      alert('Erro ao salvar locação.');
    }
  };

  return {
    formData,
    loading,
    handleChange,
    handleSubmit,
    onCancel,
    clientSearch,
    handleClientSearchChange,
    showClientResults,
    setShowClientResults,
    filteredClients,
    selectClient,
    equipmentSearch,
    handleEquipmentSearchChange,
    showEquipmentResults,
    setShowEquipmentResults,
    filteredEquipments,
    selectEquipment,
  };
};
