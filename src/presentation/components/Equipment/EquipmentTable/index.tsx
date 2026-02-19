import React from 'react';
import type { Equipment } from '../../../../core/entities/Equipment';
import { EquipmentRow } from '../EquipmentRow';
import { useEquipmentTableLogic } from './useLogic';
import './styles.css';

interface EquipmentTableProps {
  equipments: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({ 
  equipments: initialEquipments,
  onEdit,
  onDelete
}) => {
  const { equipments } = useEquipmentTableLogic(initialEquipments);

  return (
    <div className="table-container">
      <table className="equipment-table">
        <thead className="table-header">
          <tr>
            <th className="header-cell">N/P</th>
            <th className="header-cell">Cliente</th>
            <th className="header-cell">Status</th>
            <th className="header-cell">Equipamento</th>
            <th className="header-cell">Início</th>
            <th className="header-cell">Término</th>
            <th className="header-cell">Valor</th>
            <th className="header-cell">Dias Restantes</th>
            <th className="header-cell">Vendedor</th>
            <th className="header-cell">N/S</th>
            <th className="header-cell">Ações</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map((equipment) => (
            <EquipmentRow 
              key={equipment.id} 
              equipment={equipment} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
