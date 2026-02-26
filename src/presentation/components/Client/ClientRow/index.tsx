import React from 'react';
import type { Client } from '../../../../core/entities/Client';
import { Edit, Trash2 } from 'lucide-react';
import './styles.css';

interface ClientRowProps {
  client: Client;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClientRow: React.FC<ClientRowProps> = ({ client, onEdit, onDelete }) => {
  return (
    <tr className="client-row">
      <td className="client-cell client-name">{client.name}</td>
      <td className="client-cell client-secondary">
        {client.emails && client.emails.length > 0 ? client.emails[0] : '-'}
      </td>
      <td className="client-cell client-secondary">{client.phone || '-'}</td>
      <td className="actions-cell">
        <button
          onClick={() => onEdit(client.id!)}
          className="action-button edit-button"
          title="Editar"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(client.id!)}
          className="action-button delete-button"
          title="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};
