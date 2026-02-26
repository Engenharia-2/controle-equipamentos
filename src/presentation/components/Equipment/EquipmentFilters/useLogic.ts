import { useState } from 'react';
import type { EquipmentStatus } from '../../../../core/entities/Equipment';

interface FilterState {
  status?: EquipmentStatus;
  equipmentName?: string;
  orderNumber?: string;
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
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [sellerSearch, setSellerSearch] = useState<string>('');
  const [clientSearch, setClientSearch] = useState<string>('');
  const [serialSearch, setSerialSearch] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const updateFilters = (
    status: EquipmentStatus | '', 
    equipment: string, 
    order: string,
    seller: string, 
    client: string,
    serial: string,
    month: string
  ) => {
    onFilterChange({
      status: status || undefined,
      equipmentName: equipment || undefined,
      orderNumber: order || undefined,
      seller: seller || undefined,
      client: client || undefined,
      serialNumber: serial || undefined,
      endMonth: month !== '' ? Number(month) : undefined
    });
  };

  const handleStatusChange = (status: EquipmentStatus | '') => {
    setSelectedStatus(status);
    updateFilters(status, selectedEquipment, orderSearch, sellerSearch, clientSearch, serialSearch, selectedMonth);
  };

  const handleEquipmentChange = (name: string) => {
    setSelectedEquipment(name);
    updateFilters(selectedStatus, name, orderSearch, sellerSearch, clientSearch, serialSearch, selectedMonth);
  };

  const handleOrderChange = (value: string) => {
    setOrderSearch(value);
    updateFilters(selectedStatus, selectedEquipment, value, sellerSearch, clientSearch, serialSearch, selectedMonth);
  };

  const handleSellerChange = (value: string) => {
    setSellerSearch(value);
    updateFilters(selectedStatus, selectedEquipment, orderSearch, value, clientSearch, serialSearch, selectedMonth);
  };

  const handleClientChange = (value: string) => {
    setClientSearch(value);
    updateFilters(selectedStatus, selectedEquipment, orderSearch, sellerSearch, value, serialSearch, selectedMonth);
  };

  const handleSerialChange = (value: string) => {
    setSerialSearch(value);
    updateFilters(selectedStatus, selectedEquipment, orderSearch, sellerSearch, clientSearch, value, selectedMonth);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    updateFilters(selectedStatus, selectedEquipment, orderSearch, sellerSearch, clientSearch, serialSearch, value);
  };

  const clearFilters = () => {
    setSelectedStatus('');
    setSelectedEquipment('');
    setOrderSearch('');
    setSellerSearch('');
    setClientSearch('');
    setSerialSearch('');
    setSelectedMonth('');
    onFilterChange({});
  };

  return {
    selectedStatus,
    selectedEquipment,
    orderSearch,
    sellerSearch,
    clientSearch,
    serialSearch,
    selectedMonth,
    handleStatusChange,
    handleEquipmentChange,
    handleOrderChange,
    handleSellerChange,
    handleClientChange,
    handleSerialChange,
    handleMonthChange,
    clearFilters
  };
};
