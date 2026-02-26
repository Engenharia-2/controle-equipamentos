import React from 'react';
import { useEquipmentFormLogic } from './useLogic';
import { Button } from '../../Button';
import type { Equipment } from '../../../../core/entities/Equipment';
import './styles.css';

interface EquipmentFormProps {
  onSubmit: (equipment: Omit<Equipment, 'id'>) => void;
  onClose: () => void;
  initialData?: Equipment | null;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({ onSubmit, onClose, initialData }) => {
  const { formData, handleChange, handleSubmit } = useEquipmentFormLogic({ onSubmit, onClose, initialData });

  return (
    <div className="equipment-form-container">
      <header className="form-header">
        <h2 className="form-title">{initialData ? 'Editar Equipamento' : 'Novo Equipamento'}</h2>
        <p className="form-subtitle">Preencha os dados técnicos do ativo.</p>
      </header>
      
      <div className="form-card">
        <form onSubmit={handleSubmit} className="equipment-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nº Pedido *</label>
              <input 
                type="number" 
                name="orderNumber" 
                className="form-input" 
                value={formData.orderNumber || ''} 
                onChange={handleChange} 
                required 
                placeholder="Ex: 1234"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nº Série *</label>
              <input 
                type="text" 
                name="serialNumber" 
                className="form-input" 
                value={formData.serialNumber || ''} 
                onChange={handleChange} 
                required 
                placeholder="Número de série do fabricante"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Equipamento (Modelo) *</label>
            <input 
              type="text"
              name="equipmentName" 
              className="form-input" 
              value={formData.equipmentName} 
              onChange={handleChange} 
              required
              placeholder="Descreva o modelo do equipamento"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <Button type="submit">
              {initialData ? 'Atualizar Equipamento' : 'Salvar Equipamento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
