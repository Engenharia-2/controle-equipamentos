import { useState } from 'react';

export type RentalFilterStatus = 'Alocado' | 'Expirando' | 'Expirado';

export interface RentalFilterState {
  status?: RentalFilterStatus;
  clientName?: string;
  equipmentName?: string;
  serialNumber?: string;
  seller?: string;
  endMonth?: number; // 0-11
}

interface UseRentalFiltersLogicProps {
  onFilterChange: (filters: RentalFilterState) => void;
}

export const useRentalFiltersLogic = ({ onFilterChange }: UseRentalFiltersLogicProps) => {
  const [selectedStatus, setSelectedStatus] = useState<RentalFilterStatus | ''>('');
  const [clientSearch, setClientSearch] = useState('');
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [serialSearch, setSerialSearch] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const updateFilters = (
    status: RentalFilterStatus | '',
    client: string,
    equipment: string,
    serial: string,
    seller: string,
    month: string
  ) => {
    onFilterChange({
      status: status || undefined,
      clientName: client || undefined,
      equipmentName: equipment || undefined,
      serialNumber: serial || undefined,
      seller: seller || undefined,
      endMonth: month !== '' ? Number(month) : undefined
    });
  };

  const handleStatusChange = (status: RentalFilterStatus | '') => {
    setSelectedStatus(status);
    updateFilters(status, clientSearch, equipmentSearch, serialSearch, sellerSearch, selectedMonth);
  };

  const handleClientChange = (value: string) => {
    setClientSearch(value);
    updateFilters(selectedStatus, value, equipmentSearch, serialSearch, sellerSearch, selectedMonth);
  };

  const handleEquipmentChange = (value: string) => {
    setEquipmentSearch(value);
    updateFilters(selectedStatus, clientSearch, value, serialSearch, sellerSearch, selectedMonth);
  };

  const handleSerialChange = (value: string) => {
    setSerialSearch(value);
    updateFilters(selectedStatus, clientSearch, equipmentSearch, value, sellerSearch, selectedMonth);
  };

  const handleSellerChange = (value: string) => {
    setSellerSearch(value);
    updateFilters(selectedStatus, clientSearch, equipmentSearch, serialSearch, value, selectedMonth);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    updateFilters(selectedStatus, clientSearch, equipmentSearch, serialSearch, sellerSearch, value);
  };

  const clearFilters = () => {
    setSelectedStatus('');
    setClientSearch('');
    setEquipmentSearch('');
    setSerialSearch('');
    setSellerSearch('');
    setSelectedMonth('');
    onFilterChange({});
  };

  return {
    selectedStatus,
    clientSearch,
    equipmentSearch,
    serialSearch,
    sellerSearch,
    selectedMonth,
    handleStatusChange,
    handleClientChange,
    handleEquipmentChange,
    handleSerialChange,
    handleSellerChange,
    handleMonthChange,
    clearFilters
  };
};
