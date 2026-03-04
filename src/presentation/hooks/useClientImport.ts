import { useState } from 'react';
import Papa from 'papaparse';
import { useRepositories } from '../../shared/contexts/RepositoryContext';
import { ClientImportStrategy } from '../../shared/utils/import/ClientImportStrategy';

export const useClientImport = (onComplete?: () => Promise<void>) => {
  const [importProgress, setImportProgress] = useState<number | null>(null);
  const { clientRepository } = useRepositories();
  const strategy = new ClientImportStrategy();

  const handleImportCSV = async (file: File) => {
    setImportProgress(0);
    let totalProcessed = 0;
    const fileSize = file.size;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "Windows-1252",
      chunkSize: 1024 * 1024 * 1, // 1MB
      chunk: async (results, parser) => {
        parser.pause();
        const data = results.data as any[];

        try {
          for (const row of data) {
            const clientData = strategy.processRow(row);
            if (clientData) {
              await clientRepository.add(clientData);
              totalProcessed++;
            }
          }

          const progress = Math.min(99, Math.round((results.meta.cursor / fileSize) * 100));
          setImportProgress(progress);

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
          if (onComplete) await onComplete();
        }, 500);
      },
      error: (error) => {
        console.error('Erro no parser do CSV:', error);
        setImportProgress(null);
        alert('Erro ao carregar o arquivo CSV.');
      }
    });
  };

  return {
    handleImportCSV,
    importProgress
  };
};
