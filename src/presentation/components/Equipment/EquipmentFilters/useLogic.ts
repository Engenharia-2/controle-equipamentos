import { useState } from 'react';
import type { EquipmentStatus } from '../../../../core/entities/Equipment';

interface FilterState {
  status?: EquipmentStatus;
  equipmentName?: string;
  seller?: string;
  client?: string;
  serialNumber?: string;
  endMonth?: number; // 0-11
}

interface UseEquipmentFiltersLogicProps {
  onFilterChange: (filters: FilterState) => void;
}

export const useEquipmentFiltersLogic = ({ onFilterChange }: UseEquipmentFiltersLogicProps) => {
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus | ''>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [sellerSearch, setSellerSearch] = useState<string>('');
  const [clientSearch, setClientSearch] = useState<string>('');
  const [serialSearch, setSerialSearch] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const updateFilters = (
    status: EquipmentStatus | '', 
    equipment: string, 
    seller: string, 
    client: string,
    serial: string,
    month: string
  ) => {
    onFilterChange({
      status: status || undefined,
      equipmentName: equipment || undefined,
      seller: seller || undefined,
      client: client || undefined,
      serialNumber: serial || undefined,
      endMonth: month !== '' ? Number(month) : undefined
    });
  };

  const handleStatusChange = (status: EquipmentStatus | '') => {
    setSelectedStatus(status);
    updateFilters(status, selectedEquipment, sellerSearch, clientSearch, serialSearch, selectedMonth);
  };

  const handleEquipmentChange = (name: string) => {
    setSelectedEquipment(name);
    updateFilters(selectedStatus, name, sellerSearch, clientSearch, serialSearch, selectedMonth);
  };

  const handleSellerChange = (value: string) => {
    setSellerSearch(value);
    updateFilters(selectedStatus, selectedEquipment, value, clientSearch, serialSearch, selectedMonth);
  };

  const handleClientChange = (value: string) => {
    setClientSearch(value);
    updateFilters(selectedStatus, selectedEquipment, sellerSearch, value, serialSearch, selectedMonth);
  };

  const handleSerialChange = (value: string) => {
    setSerialSearch(value);
    updateFilters(selectedStatus, selectedEquipment, sellerSearch, clientSearch, value, selectedMonth);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    updateFilters(selectedStatus, selectedEquipment, sellerSearch, clientSearch, serialSearch, value);
  };

  const clearFilters = () => {
    setSelectedStatus('');
    setSelectedEquipment('');
    setSellerSearch('');
    setClientSearch('');
    setSerialSearch('');
    setSelectedMonth('');
    onFilterChange({});
  };

  return {
    selectedStatus,
    selectedEquipment,
    sellerSearch,
    clientSearch,
    serialSearch,
    selectedMonth,
    handleStatusChange,
    handleEquipmentChange,
    handleSellerChange,
    handleClientChange,
    handleSerialChange,
    handleMonthChange,
    clearFilters
  };
};
