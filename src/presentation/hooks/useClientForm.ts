import { useState, useEffect } from 'react';
import type { Client } from '../../core/entities/Client';
import { useRepositories } from '../../shared/contexts/RepositoryContext';

export const useClientForm = (clientId?: string) => {
  const [formData, setFormData] = useState<Client>({
    name: '',
    emails: [''],
    phone: '',
    cnpj: '',
    address: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const { clientRepository } = useRepositories();

  useEffect(() => {
    if (clientId) {
      const loadClient = async () => {
        try {
          setFormLoading(true);
          const data = await clientRepository.getById(clientId);
          if (data) {
            setFormData({
              ...data,
              emails: data.emails && data.emails.length > 0 ? data.emails : ['']
            });
          }
        } catch (error) {
          console.error('Error loading client:', error);
        } finally {
          setFormLoading(false);
        }
      };
      loadClient();
    }
  }, [clientId, clientRepository]);

  const handleSave = async () => {
    setFormLoading(true);
    try {
      const clientToSave = {
        ...formData,
        emails: formData.emails.filter(email => email.trim() !== '')
      };

      if (clientId) {
        await clientRepository.update(clientId, clientToSave);
      } else {
        await clientRepository.add(clientToSave);
      }
      return true;
    } catch (error) {
      console.error('Error saving client:', error);
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    formLoading,
    handleSave,
  };
};
