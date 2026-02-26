import React from 'react';
import type { Client } from '../../../../core/entities/Client';
import { ClientRow } from '../ClientRow';
import './styles.css';

interface ClientTableProps {
  clients: Client[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({ 
  clients,
  onEdit,
  onDelete
}) => {
  return (
    <div className="table-container">
      <table className="client-table">
        <thead className="table-header">
          <tr>
            <th className="header-cell">Nome</th>
            <th className="header-cell">Email</th>
            <th className="header-cell">Telefone</th>
            <th className="header-cell">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <ClientRow 
              key={client.id} 
              client={client} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
