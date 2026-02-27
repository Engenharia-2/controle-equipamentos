import React, { createContext, useContext, useMemo } from 'react';
import type { IEquipmentRepository } from '../../core/interfaces/IEquipmentRepository';
import type { IClientRepository } from '../../core/interfaces/IClientRepository';
import type { IRentalRepository } from '../../core/interfaces/IRentalRepository';

import { ApiEquipmentRepository } from '../../infrastructure/repositories/ApiEquipmentRepository';
import { ApiClientRepository } from '../../infrastructure/repositories/ApiClientRepository';
import { ApiRentalRepository } from '../../infrastructure/repositories/ApiRentalRepository';

import { IndexedDBEquipmentRepository } from '../../infrastructure/repositories/IndexedDBEquipmentRepository';
import { IndexedDBClientRepository } from '../../infrastructure/repositories/IndexedDBClientRepository';
import { IndexedDBRentalRepository } from '../../infrastructure/repositories/IndexedDBRentalRepository';

interface IRepositoryContext {
  equipmentRepository: IEquipmentRepository;
  clientRepository: IClientRepository;
  rentalRepository: IRentalRepository;
}

const RepositoryContext = createContext<IRepositoryContext | undefined>(undefined);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // A decisão de qual repositório usar é centralizada aqui
  const useApi = import.meta.env.VITE_USE_API !== 'false'; // Default true

  const repositories = useMemo(() => ({
    equipmentRepository: useApi ? new ApiEquipmentRepository() : new IndexedDBEquipmentRepository(),
    clientRepository: useApi ? new ApiClientRepository() : new IndexedDBClientRepository(),
    rentalRepository: useApi ? new ApiRentalRepository() : new IndexedDBRentalRepository(),
  }), [useApi]);

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepositories = () => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepositories must be used within a RepositoryProvider');
  }
  return context;
};
