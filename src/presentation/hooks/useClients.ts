import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Client } from '../../core/entities/Client';
import { useRepositories } from '../../shared/contexts/RepositoryContext';
import { useDebounce } from './useDebounce';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { clientRepository } = useRepositories();

  const fetchClients = useCallback(async () => {
    try {
      setListLoading(true);
      const data = await clientRepository.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setListLoading(false);
    }
  }, [clientRepository]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleDeleteAll = async () => {
    if (window.confirm('TEM CERTEZA? Isso excluirá TODOS os clientes da base de dados permanentemente.')) {
      try {
        setListLoading(true);
        const allClients = await clientRepository.getAll();
        for (const client of allClients) {
          if (client.id) await clientRepository.delete(client.id);
        }
        await fetchClients();
        alert('Todos os clientes foram excluídos.');
      } catch (error) {
        console.error('Error deleting all clients:', error);
        alert('Erro ao excluir clientes.');
      } finally {
        setListLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await clientRepository.delete(id);
      await fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const filteredClients = useMemo(
    () =>
      clients.filter(
        (client) =>
          client.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (client.emails && client.emails.some(email => email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))) ||
          (client.cnpj && client.cnpj.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      ),
    [clients, debouncedSearchTerm]
  );

  return {
    clients: filteredClients,
    listLoading,
    searchTerm,
    setSearchTerm,
    handleDelete,
    handleDeleteAll,
    fetchClients
  };
};
