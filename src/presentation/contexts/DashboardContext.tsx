import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardFilters {
  month: number; // 0-11
  year: number;
  equipmentModel: string;
}

interface DashboardContextData {
  filters: DashboardFilters;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  setEquipmentModel: (model: string) => void;
  clearFilters: () => void;
}

const DashboardContext = createContext<DashboardContextData>({} as DashboardContextData);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const now = new Date();
  const [filters, setFilters] = useState<DashboardFilters>({
    month: now.getMonth(),
    year: now.getFullYear(),
    equipmentModel: ''
  });

  const setMonth = (month: number) => setFilters(prev => ({ ...prev, month }));
  const setYear = (year: number) => setFilters(prev => ({ ...prev, year }));
  const setEquipmentModel = (equipmentModel: string) => setFilters(prev => ({ ...prev, equipmentModel }));
  
  const clearFilters = () => {
    const today = new Date();
    setFilters({
      month: today.getMonth(),
      year: today.getFullYear(),
      equipmentModel: ''
    });
  };

  return (
    <DashboardContext.Provider value={{ filters, setMonth, setYear, setEquipmentModel, clearFilters }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
