import React from 'react';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';
import { useRentalRowLogic } from './useLogic';
import { formatDate, formatCurrency } from '../../../../shared/utils/formatters';
import type { RentalWithDetails } from '../../../hooks/useRentals';
import './styles.css';

interface RentalRowProps {
  rental: RentalWithDetails;
  onFinish: (rental: RentalWithDetails) => void;
  onEdit: (rental: RentalWithDetails) => void;
  onDelete: (id: string) => void;
}

export const RentalRow: React.FC<RentalRowProps> = ({ 
  rental, 
  onFinish, 
  onEdit,
  onDelete
}) => {
  const { statusInfo } = useRentalRowLogic(rental.startDate, rental.endDate);

  return (
    <tr className="rental-row">
      <td className="rental-cell">{rental.orderNumber || '-'}</td>
      <td className="rental-cell rental-name">{rental.clientName}</td>
      <td className="rental-cell">{rental.equipmentName}</td>
      <td className="rental-cell rental-secondary">{rental.serialNumber}</td>
      <td className="rental-cell">
        <span className={`rental-status-badge ${statusInfo.class}`}>
          {statusInfo.label}
        </span>
      </td>
      <td className="rental-cell">{formatDate(rental.startDate)}</td>
      <td className="rental-cell">{formatDate(rental.endDate)}</td>
      <td className="rental-cell rental-secondary">{rental.seller}</td>
      <td className="rental-cell">{formatCurrency(rental.monthlyValue)}</td>
      <td className="actions-cell">
        <button
          onClick={() => onFinish(rental)}
          className="action-button finish-button"
          title="Finalizar Locação"
        >
          <CheckCircle size={18} />
        </button>
        <button
          onClick={() => onEdit(rental)}
          className="action-button edit-button"
          title="Editar Registro"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(rental.id)}
          className="action-button delete-button"
          title="Excluir Registro"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};
