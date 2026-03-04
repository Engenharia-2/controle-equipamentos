import React from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';
import { useEquipmentRowLogic } from './useLogic';
import { Edit, Trash2 } from 'lucide-react';
import './styles.css';

interface EquipmentRowProps {
  equipment: Equipment;
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
}

export const EquipmentRow: React.FC<EquipmentRowProps> = ({ equipment, onEdit, onDelete }) => {
  const { getStatusClass } = useEquipmentRowLogic(equipment);

  // Busca o número do pedido na locação ativa vinculada
  const activeRental = (equipment as any).rentals?.find((r: any) => r.status === 'Ativa');
  const displayOrderNumber = activeRental?.orderNumber || '-';

  return (
    <tr className="equipment-row">
      <td className="equipment-cell">{displayOrderNumber}</td>
      <td className="equipment-cell">
        <span className={`status-badge ${getStatusClass()}`}>
          {equipment.status}
        </span>
      </td>
      <td className="equipment-cell">{equipment.equipmentName}</td>
      <td className="equipment-cell">{equipment.serialNumber}</td>
      <td className="actions-cell">
        <button 
          className="action-button edit-button" 
          onClick={() => onEdit(equipment)}
          title="Editar"
        >
          <Edit size={18} />
        </button>
        <button 
          className="action-button delete-button" 
          onClick={() => onDelete(equipment.id)}
          title="Remover"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};
