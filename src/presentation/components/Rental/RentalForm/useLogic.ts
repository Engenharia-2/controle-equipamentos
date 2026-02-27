import { useState, useEffect, useMemo } from 'react';
import type { Rental } from '../../../../core/entities/Rental';
import type { Client } from '../../../../core/entities/Client';
import type { Equipment } from '../../../../core/entities/Equipment';
import { useRepositories } from '../../../../shared/contexts/RepositoryContext';

interface RentalFormData extends Omit<Rental, 'id' | 'status'> {}

export const useRentalFormLogic = (
  onSuccess: () => void, 
  onCancel: () => void,
  editingRental?: any
) => {
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [allEquipments, setAllEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para busca/filtro
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
        
        // Se estiver editando, permite que o equipamento atual apareça na lista mesmo que status seja 'Locação'
        setAllEquipments(equipmentsData.filter(eq => 
          eq.status === 'Disponível' || (editingRental && eq.id === (typeof editingRental.equipment === 'string' ? editingRental.equipment : editingRental.equipment?.id))
        ));

        // Preencher dados de edição se existirem
        if (editingRental) {
          const clientId = typeof editingRental.client === 'string' ? editingRental.client : editingRental.client?.id;
          const equipmentId = typeof editingRental.equipment === 'string' ? editingRental.equipment : editingRental.equipment?.id;
          
          setFormData({
            clientId: clientId || '',
            equipmentId: equipmentId || '',
            startDate: editingRental.startDate,
            endDate: editingRental.endDate,
            monthlyValue: editingRental.monthlyValue,
            seller: editingRental.seller,
          });

          setClientSearch(editingRental.clientName || editingRental.client?.name || '');
          setEquipmentSearch(`${editingRental.equipmentName || editingRental.equipment?.equipmentName} (S/N: ${editingRental.serialNumber || editingRental.equipment?.serialNumber})`);
        }
      } catch (error) {
        console.error('Erro ao carregar dados para locação:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [clientRepository, equipmentRepository, editingRental]);

  // Filtragem de Clientes
  const filteredClients = useMemo(() => {
    const query = clientSearch.toLowerCase().trim();
    if (!query || (formData.clientId && clientSearch === allClients.find(c => c.id === formData.clientId)?.name)) {
      return [];
    }
    return allClients
      .filter(c => c.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [allClients, clientSearch, formData.clientId]);

  // Filtragem de Equipamentos
  const filteredEquipments = useMemo(() => {
    const query = equipmentSearch.toLowerCase().trim();
    if (!query) return [];

    return allEquipments
      .filter(e => {
        const nameMatch = (e.equipmentName || '').toLowerCase().includes(query);
        const serialStr = String(e.serialNumber || '').toLowerCase();
        const serialMatch = serialStr.includes(query);
        return nameMatch || serialMatch;
      })
      .slice(0, 10);
  }, [allEquipments, equipmentSearch]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyValue' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.equipmentId) {
      alert('Por favor, selecione um cliente e um equipamento das listas de sugestão.');
      return;
    }

    try {
      const rentalToSave: any = {
        client: formData.clientId,
        equipment: formData.equipmentId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthlyValue: formData.monthlyValue,
        seller: formData.seller,
        status: 'Ativa'
      };

      if (editingRental) {
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
    // Busca de Clientes
    clientSearch,
    setClientSearch,
    filteredClients,
    selectClient,
    showClientResults,
    setShowClientResults,
    // Busca de Equipamentos
    equipmentSearch,
    setEquipmentSearch,
    filteredEquipments,
    selectEquipment,
    showEquipmentResults,
    setShowEquipmentResults
  };
};
