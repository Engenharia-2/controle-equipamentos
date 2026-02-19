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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{initialData ? 'Editar Equipamento' : 'Novo Equipamento'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nº Pedido</label>
            <input 
              type="number" name="orderNumber" 
              className="form-input" value={formData.orderNumber} 
              onChange={handleChange} required 
            />
          </div>
          <div className="form-group">
            <label>Cliente</label>
            <input 
              type="text" name="client" 
              className="form-input" value={formData.client} 
              onChange={handleChange} required 
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select 
              name="status" className="form-input" 
              value={formData.status} onChange={handleChange}
            >
              <option value="Disponível">Disponível</option>
              <option value="Locação">Locação</option>
              <option value="Expirado">Expirado</option>
            </select>
          </div>
          <div className="form-group">
            <label>Equipamento</label>
            <select 
              name="equipmentName" 
              className="form-input" 
              value={formData.equipmentName} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecione um equipamento</option>
              <option value="LRM-01 bancada">Miliohmimetro bancada</option>
              <option value="LRM-01 (sem bateria)">LRM-01 (sem bateria)</option>
              <option value="LRM-01">LRM-01</option>
              <option value="Megohmetro 1kv">Megohmetro 1kv</option>
              <option value="Megohmetro 5kv">Megohmetro 5kv</option>
              <option value="Surge Test 4kv M1">Surge Test 4kv M1</option>
              <option value="Surge Test 4kv (antigo)">Surge Test 4kv (antigo)</option>
              <option value="Surge Test 4kv bancada">Surge Test 4kv bancada</option>
              <option value="Surge teste 15kv">Surge teste 15kv</option>
              <option value="Surge teste 15kv MT">Surge teste 15kv MT</option>
              <option value="LRM-02">LRM-02</option>
              <option value="LRM-03">LRM-03</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Data Início</label>
              <input 
                type="date" name="startDate" 
                className="form-input" value={formData.startDate} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Data Término</label>
              <input 
                type="date" name="endDate" 
                className="form-input" value={formData.endDate} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Valor de Locação (R$)</label>
            <input 
              type="number" name="allocationValue" 
              step="0.01"
              className="form-input" value={formData.allocationValue} 
              onChange={handleChange} required 
            />
          </div>
          <div className="form-group">
            <label>Vendedor</label>
            <input 
              type="text" name="seller" 
              className="form-input" value={formData.seller} 
              onChange={handleChange} required 
            />
          </div>
          <div className="form-group">
            <label>Nº Série</label>
            <input 
              type="number" name="serialNumber" 
              className="form-input" value={formData.serialNumber} 
              onChange={handleChange} required 
            />
          </div>
          
          <div className="form-actions">
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
