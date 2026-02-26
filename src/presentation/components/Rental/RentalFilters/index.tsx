import React from 'react';
import { useRentalFiltersLogic } from './useLogic';
import type { RentalFilterStatus, RentalFilterState } from './useLogic';
import { Search, Hash } from 'lucide-react';
import './styles.css';

interface RentalFiltersProps {
  onFilterChange: (filters: RentalFilterState) => void;
}

export const RentalFilters: React.FC<RentalFiltersProps> = ({ onFilterChange }) => {
  const { 
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
  } = useRentalFiltersLogic({ onFilterChange });
  
  const statusOptions: RentalFilterStatus[] = ['Alocado', 'Expirando', 'Expirado'];
  
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
    clientSearch !== '' || 
    equipmentSearch !== '' || 
    serialSearch !== '' || 
    sellerSearch !== '' || 
    selectedMonth !== '';

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label className="filter-label">Status:</label>
        <select 
          className="filter-select" 
          value={selectedStatus} 
          onChange={(e) => handleStatusChange(e.target.value as RentalFilterStatus | '')}
        >
          <option value="">Todos</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

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

      <div className="filter-group">
        <label className="filter-label">Equipamento:</label>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Buscar modelo..."
            value={equipmentSearch}
            onChange={(e) => handleEquipmentChange(e.target.value)}
          />
        </div>
      </div>

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

      {hasActiveFilters && (
        <button className="clear-filters-btn" onClick={clearFilters}>
          Limpar Filtros
        </button>
      )}
    </div>
  );
};
