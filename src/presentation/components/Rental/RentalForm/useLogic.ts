import { useState, useEffect, useMemo } from 'react';
import type { Rental } from '../../../../core/entities/Rental';
import type { Client } from '../../../../core/entities/Client';
import type { Equipment } from '../../../../core/entities/Equipment';
import { IndexedDBRentalRepository } from '../../../../infrastructure/repositories/IndexedDBRentalRepository';
import { IndexedDBClientRepository } from '../../../../infrastructure/repositories/IndexedDBClientRepository';
import { IndexedDBEquipmentRepository } from '../../../../infrastructure/repositories/IndexedDBEquipmentRepository';

interface RentalFormData extends Omit<Rental, 'id' | 'status'> {}

export const useRentalFormLogic = (onSuccess: () => void, onCancel: () => void) => {
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

  const rentalRepository = useMemo(() => new IndexedDBRentalRepository(), []);
  const clientRepository = useMemo(() => new IndexedDBClientRepository(), []);
  const equipmentRepository = useMemo(() => new IndexedDBEquipmentRepository(), []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, equipmentsData] = await Promise.all([
          clientRepository.getAll(),
          equipmentRepository.getAll()
        ]);
        
        setAllClients(clientsData);
        setAllEquipments(equipmentsData.filter(eq => eq.status === 'Disponível'));
      } catch (error) {
        console.error('Erro ao carregar dados para locação:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [clientRepository, equipmentRepository]);

  // Filtragem de Clientes
  const filteredClients = useMemo(() => {
    const query = clientSearch.toLowerCase().trim();
    if (!query || formData.clientId && clientSearch === allClients.find(c => c.id === formData.clientId)?.name) {
      return [];
    }
    return allClients
      .filter(c => c.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [allClients, clientSearch, formData.clientId]);

  // Filtragem de Equipamentos - CORRIGIDO para evitar erro de toLowerCase
  const filteredEquipments = useMemo(() => {
    const query = equipmentSearch.toLowerCase().trim();
    
    // Se a busca estiver vazia ou já tivermos selecionado exatamente este item, não mostrar resultados
    if (!query) return [];

    return allEquipments
      .filter(e => {
        const nameMatch = (e.equipmentName || '').toLowerCase().includes(query);
        // Garantir que serialNumber seja string antes de buscar
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
      const rentalId = crypto.randomUUID();
      const newRental: Rental = {
        ...formData,
        id: rentalId,
        status: 'Ativa'
      };

      await rentalRepository.save(newRental);

      const equipment = allEquipments.find(eq => eq.id === formData.equipmentId);
      const client = allClients.find(c => c.id === formData.clientId);

      if (equipment && client) {
        await equipmentRepository.update({
          ...equipment,
          status: 'Locação',
          client: client.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          allocationValue: formData.monthlyValue,
          seller: formData.seller
        });
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
