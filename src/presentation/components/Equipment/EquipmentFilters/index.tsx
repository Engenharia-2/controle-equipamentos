import React from 'react';
import { useEquipmentFiltersLogic } from './useLogic';
import type { EquipmentStatus } from '../../../../core/entities/Equipment';
import { Search, Hash,  } from 'lucide-react';
import './styles.css';

interface FilterState {
  status?: EquipmentStatus;
  equipmentName?: string;
  orderNumber?: string;
  seller?: string;
  client?: string;
  serialNumber?: string;
  endMonth?: number;
}

interface EquipmentFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  hideSeller?: boolean;
  hideClient?: boolean;
  hideMonth?: boolean;
}

export const EquipmentFilters: React.FC<EquipmentFiltersProps> = ({ 
  onFilterChange,
  hideSeller = false,
  hideClient = false,
  hideMonth = false
}) => {
  const { 
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
  } = useEquipmentFiltersLogic({ onFilterChange });
  
  const statusOptions: EquipmentStatus[] = ['Locação', 'Disponível', 'Expirado'];
  
  const months = [
    { value: '0', label: 'Janeiro' },
    { value: '1', label: 'Fevereiro' },
    { value: '2', label: 'Março' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Maio' },
    { value: '5', label: 'Junho' },
    { value: '6', label: 'Julho' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Setembro' },
    { value: '9', label: 'Outubro' },
    { value: '10', label: 'Novembro' },
    { value: '11', label: 'Dezembro' }
  ];

  const hasActiveFilters = 
    selectedStatus !== '' || 
    selectedEquipment !== '' || 
    orderSearch !== '' ||
    sellerSearch !== '' || 
    clientSearch !== '' || 
    serialSearch !== '' ||
    selectedMonth !== '';

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label className="filter-label">Status:</label>
        <select 
          className="filter-select" 
          value={selectedStatus} 
          onChange={(e) => handleStatusChange(e.target.value as EquipmentStatus | '')}
        >
          <option value="">Todos</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Nº Pedido:</label>
        <div className="search-input-wrapper">
          <Hash size={16} className="search-icon" />
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Buscar pedido..."
            value={orderSearch}
            onChange={(e) => handleOrderChange(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Equipamento:</label>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Buscar modelo..."
            value={selectedEquipment}
            onChange={(e) => handleEquipmentChange(e.target.value)}
          />
        </div>
      </div>

      {!hideSeller && (
        <div className="filter-group">
          <label className="filter-label">Vendedor:</label>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              className="filter-input" 
              placeholder="Buscar vendedor..."
              value={sellerSearch}
              onChange={(e) => handleSellerChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {!hideClient && (
        <div className="filter-group">
          <label className="filter-label">Cliente:</label>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              className="filter-input" 
              placeholder="Buscar cliente..."
              value={clientSearch}
              onChange={(e) => handleClientChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="filter-group">
        <label className="filter-label">Nº Série:</label>
        <div className="search-input-wrapper">
          <Hash size={16} className="search-icon" />
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Buscar série..."
            value={serialSearch}
            onChange={(e) => handleSerialChange(e.target.value)}
          />
        </div>
      </div>

      {!hideMonth && (
        <div className="filter-group">
          <label className="filter-label">Mês Término:</label>
          <select 
            className="filter-select" 
            value={selectedMonth} 
            onChange={(e) => handleMonthChange(e.target.value)}
          >
            <option value="">Todos</option>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      )}

      {hasActiveFilters && (
        <button className="clear-filters-btn" onClick={clearFilters}>
          Limpar Filtros
        </button>
      )}
    </div>
  );
};
