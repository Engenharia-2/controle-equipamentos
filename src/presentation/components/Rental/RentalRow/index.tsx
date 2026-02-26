import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useRentalRowLogic } from './useLogic';
import './styles.css';

interface RentalRowProps {
  rental: any;
  onFinish: (rental: any) => void;
  formatDate: (date: string) => string;
  formatCurrency: (value: number) => string;
}

export const RentalRow: React.FC<RentalRowProps> = ({ 
  rental, 
  onFinish, 
  formatDate, 
  formatCurrency 
}) => {
  const { statusInfo } = useRentalRowLogic(rental.startDate, rental.endDate);

  return (
    <tr className="rental-row">
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
          title="Finalizar Locação (Devolver Equipamento)"
        >
          <CheckCircle size={18} />
          <span>Finalizar</span>
        </button>
      </td>
    </tr>
  );
};
