import React from 'react';
import { useClients } from '../../../hooks/useClients';
import './styles.css';

interface ClientListProps {
  onCreate: () => void;
  onEdit: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ onCreate, onEdit }) => {
  const {
    clients: filteredClients,
    listLoading: loading,
    searchTerm,
    setSearchTerm,
    handleDelete,
  } = useClients();

  return (
    <div className="container">
      <div className="header">
        <div className='header-title-group'>
          <h1 className="page-title">Meus Clientes</h1>
          <p className="page-subtitle">Gerencie sua base de clientes.</p>
        </div>
        <button
          onClick={onCreate}
          className="new-client-btn"
        >
          <span>+</span> Novo Cliente
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-container">Carregando clientes...</div>
      ) : filteredClients.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">
            {searchTerm ? 'Nenhum cliente encontrado para sua busca.' : 'Você ainda não tem clientes cadastrados.'}
          </p>
          {!searchTerm && (
            <button
              onClick={onCreate}
              className="first-client-btn"
            >
              Cadastrar Primeiro Cliente
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="thead-tr">
                <th className="th">Nome</th>
                <th className="th">Email</th>
                <th className="th">Telefone</th>
                <th className="th">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="tr">
                  <td className="td td-name">{client.name}</td>
                  <td className="td td-secondary">{client.email || '-'}</td>
                  <td className="td td-secondary">{client.phone || '-'}</td>
                  <td className="td td-actions">
                    <button
                      onClick={() => onEdit(client.id!)}
                      className="action-btn action-btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(client.id!)}
                      className="action-btn action-btn-delete"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientList;
