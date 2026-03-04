import React from 'react';
import { RentalRow } from '../RentalRow';
import type { RentalWithDetails } from '../../../hooks/useRentals';
import './styles.css';

interface RentalTableProps {
  rentals: RentalWithDetails[];
  onFinish: (rental: RentalWithDetails) => void;
  onEdit: (rental: RentalWithDetails) => void;
  onDelete: (id: string) => void;
}

export const RentalTable: React.FC<RentalTableProps> = ({ 
  rentals, 
  onFinish, 
  onEdit,
  onDelete
}) => {
  return (
    <div className="table-container">
      <table className="rental-table">
        <thead className="table-header">
          <tr>
            <th className="header-cell">Pedido</th>
            <th className="header-cell">Cliente</th>
            <th className="header-cell">Equipamento</th>
            <th className="header-cell">Série</th>
            <th className="header-cell">Status</th>
            <th className="header-cell">Início</th>
            <th className="header-cell">Término</th>
            <th className="header-cell">Vendedor</th>
            <th className="header-cell">Valor Mensal</th>
            <th className="header-cell">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <RentalRow 
              key={rental.id} 
              rental={rental} 
              onFinish={onFinish}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
