import { useState, useEffect, useMemo } from 'react';
import type { Client } from '../../core/entities/Client';
import { IndexedDBClientRepository } from '../../infrastructure/repositories/IndexedDBClientRepository';

const clientRepository = new IndexedDBClientRepository();

export const useClients = (clientId?: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Client>({
    name: '',
    email: '',
    phone: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setListLoading(true);
        const data = await clientRepository.getAll();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setListLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (clientId) {
      const loadClient = async () => {
        try {
          setFormLoading(true);
          const data = await clientRepository.getById(clientId);
          if (data) {
            setFormData(data);
          }
        } catch (error) {
          console.error('Error loading client:', error);
        } finally {
          setFormLoading(false);
        }
      };
      loadClient();
    }
  }, [clientId]);

  const handleDelete = async (id: string) => {
    try {
      await clientRepository.delete(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleSave = async () => {
    setFormLoading(true);
    try {
      if (clientId) {
        await clientRepository.update(clientId, formData);
      } else {
        await clientRepository.add(formData);
      }
      return true;
    } catch (error) {
      console.error('Error saving client:', error);
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const filteredClients = useMemo(
    () =>
      clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [clients, searchTerm]
  );

  return {
    clients: filteredClients,
    listLoading,
    searchTerm,
    setSearchTerm,
    handleDelete,
    formData,
    setFormData,
    formLoading,
    handleSave,
  };
};
