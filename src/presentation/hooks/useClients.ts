import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Client } from '../../core/entities/Client';
import { IndexedDBClientRepository } from '../../infrastructure/repositories/IndexedDBClientRepository';
import Papa from 'papaparse';

const clientRepository = new IndexedDBClientRepository();

export const useClients = (clientId?: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Client>({
    name: '',
    emails: [''],
    phone: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [importProgress, setImportProgress] = useState<number | null>(null);

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
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleImportCSV = async (file: File) => {
    setImportProgress(0);
    let totalProcessed = 0;
    const fileSize = file.size;
    
    console.log(`Iniciando importação de arquivo com ${fileSize} bytes...`);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "Windows-1252",
      // Removemos o 'worker: true' para permitir o uso de pause/resume com sucesso
      chunkSize: 1024 * 1024 * 1, // Pedacos de 1MB para processamento mais frequente
      chunk: async (results, parser) => {
        // Agora o pause() funcionará corretamente na thread principal
        parser.pause();
        
        const data = results.data as any[];
        
        try {
          // Processamento do lote atual
          for (const row of data) {
            const getField = (possibleNames: string[]) => {
              for (const name of possibleNames) {
                if (row[name] !== undefined) return row[name];
                const foundKey = Object.keys(row).find(key => key.toLowerCase() === name.toLowerCase());
                if (foundKey) return row[foundKey];
              }
              return '';
            };

            const name = getField(['Nome da pessoa', 'Nome', 'Name']) || '';
            if (!name) continue;

            const emailRaw = getField(['Email da pessoa', 'Email', 'E-mail']) || '';
            const emails = emailRaw.split(/[;,]/).map((e: string) => e.trim()).filter((e: string) => e !== '');
            const phone = getField(['Telefone da Pessoa', 'Telefone da pessoa', 'Telefone', 'Phone', 'Celular']) || '-';

            await clientRepository.add({ name, emails, phone });
            totalProcessed++;
          }

          // Atualiza o progresso (usando cursor para precisão sobre o tamanho do arquivo)
          const progress = Math.min(99, Math.round((results.meta.cursor / fileSize) * 100));
          setImportProgress(progress);
          
          // Pequeno timeout para garantir que o React tenha tempo de renderizar a barra
          setTimeout(() => {
            parser.resume();
          }, 1);
        } catch (error) {
          console.error('Erro ao processar lote:', error);
          parser.abort();
          setImportProgress(null);
          alert('Erro durante o processamento dos dados.');
        }
      },
      complete: async () => {
        setImportProgress(100);
        setTimeout(async () => {
          setImportProgress(null);
          alert(`${totalProcessed} clientes importados com sucesso!`);
          await fetchClients();
        }, 500);
      },
      error: (error) => {
        console.error('Erro no parser do CSV:', error);
        setImportProgress(null);
        alert('Erro ao carregar o arquivo CSV.');
      }
    });
  };

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
  }, [clientId]);

  const handleDelete = async (id: string) => {
    try {
      await clientRepository.delete(id);
      const data = await clientRepository.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

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

  const filteredClients = useMemo(
    () =>
      clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (client.emails && client.emails.some(email => email.toLowerCase().includes(searchTerm.toLowerCase())))
      ),
    [clients, searchTerm]
  );

  return {
    clients: filteredClients,
    listLoading,
    searchTerm,
    setSearchTerm,
    handleDelete,
    handleDeleteAll,
    formData,
    setFormData,
    formLoading,
    handleSave,
    handleImportCSV,
    importProgress
  };
};
