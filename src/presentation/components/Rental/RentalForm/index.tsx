import React from 'react';
import { useRentalFormLogic } from './useLogic';
import './styles.css';
import type { Equipment } from '@/core/entities/Equipment';
import type { Client } from '@/core/entities/Client';

interface RentalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingRental?: any;
}

export const RentalForm: React.FC<RentalFormProps> = ({ onSuccess, onCancel, editingRental }) => {
  const { 
    formData, 
    loading, 
    handleChange, 
    handleSubmit,
    // ... restante desestruturado
    clientSearch,
    setClientSearch,
    filteredClients,
    selectClient,
    showClientResults,
    setShowClientResults,
    equipmentSearch,
    setEquipmentSearch,
    filteredEquipments,
    selectEquipment,
    showEquipmentResults,
    setShowEquipmentResults
  } = useRentalFormLogic(onSuccess, onCancel, editingRental);

  if (loading) return <div className="loading">Carregando dados...</div>;

  return (
    <div className="rental-form-container">
      <header className="form-header">
        <h2 className="form-title">{editingRental ? 'Editar Locação' : 'Nova Locação'}</h2>
        <p className="form-subtitle">
          {editingRental ? `Editando registro ID: ${editingRental.id}` : 'Vincule um cliente a um equipamento disponível.'}
        </p>
      </header>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="rental-form">
          
          {/* Seletor de Cliente Pesquisável */}
          <div className="form-group autocomplete-container">
            <label className="form-label">Cliente *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Digite o nome do cliente para buscar..."
              value={clientSearch}
              onChange={(e) => {
                setClientSearch(e.target.value);
                setShowClientResults(true);
              }}
              onFocus={() => setShowClientResults(true)}
              autoComplete="off"
            />
            {showClientResults && filteredClients.length > 0 && (
              <ul className="autocomplete-results">
                {filteredClients.map((client: Client) => (
                  <li 
                    key={client.id} 
                    onClick={() => selectClient(client)}
                    className="autocomplete-item"
                  >
                    {client.name}
                  </li>
                ))}
              </ul>
            )}
            <input type="hidden" name="clientId" value={formData.clientId} required />
          </div>

          {/* Seletor de Equipamento Pesquisável */}
          <div className="form-group autocomplete-container">
            <label className="form-label">Equipamento Disponível *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Busque por nome ou número de série..."
              value={equipmentSearch}
              onChange={(e) => {
                setEquipmentSearch(e.target.value);
                setShowEquipmentResults(true);
              }}
              onFocus={() => setShowEquipmentResults(true)}
              autoComplete="off"
            />
            {showEquipmentResults && filteredEquipments.length > 0 && (
              <ul className="autocomplete-results">
                {filteredEquipments.map((eq: Equipment) => (
                  <li 
                    key={eq.id} 
                    onClick={() => selectEquipment(eq)}
                    className="autocomplete-item"
                  >
                    <div className="eq-item-name">{eq.equipmentName}</div>
                    <div className="eq-item-sn">S/N: {eq.serialNumber}</div>
                  </li>
                ))}
              </ul>
            )}
            <input type="hidden" name="equipmentId" value={formData.equipmentId} required />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Data Início *</label>
              <input 
                type="date" 
                name="startDate" 
                className="form-input" 
                value={formData.startDate} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Data Término *</label>
              <input 
                type="date" 
                name="endDate" 
                className="form-input" 
                value={formData.endDate} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Valor Mensal (R$) *</label>
              <input 
                type="number" 
                name="monthlyValue" 
                step="0.01"
                className="form-input" 
                value={formData.monthlyValue || ''} 
                onChange={handleChange} 
                required 
                placeholder="0,00"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vendedor *</label>
              <input 
                type="text" 
                name="seller" 
                className="form-input" 
                value={formData.seller} 
                onChange={handleChange} 
                required 
                placeholder="Nome do vendedor"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Confirmar Locação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
