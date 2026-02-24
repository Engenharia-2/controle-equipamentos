import React from 'react';
import { useClients } from '../../../hooks/Clients/useClients';
import useResponsive from '../../../hooks/useResponsive';
import './styles.css';
import { Pencil, Trash2, Phone, Mail } from 'lucide-react';

const ClientList = ({ onCreate, onEdit }) => {
    const {
        clients: filteredClients,
        listLoading: loading,
        searchTerm,
        setSearchTerm,
        handleDelete,
    } = useClients();

    const { isMobileLayout: isMobile } = useResponsive();

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
                    placeholder="Buscar por nome ou contato..."
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
                <>
                    {/* Desktop Table View */}
                    <div className="desktop-view" style={{ display: isMobile ? 'none' : 'block' }}>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr className="thead-tr">
                                        <th className="th">Nome</th>
                                        <th className="th">Contato</th>
                                        <th className="th">Email</th>
                                        <th className="th">Telefone</th>
                                        <th className="th">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client) => (
                                        <tr key={client.id} className="tr">
                                            <td className="td td-name">{client.name}</td>
                                            <td className="td td-secondary">{client.contactName || '-'}</td>
                                            <td className="td td-secondary">{client.email || '-'}</td>
                                            <td className="td td-secondary">{client.phone || '-'}</td>
                                            <td className="td td-actions">
                                                <button 
                                                    onClick={() => onEdit(client.id)}
                                                    className="action-btn action-btn-edit"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
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
                    </div>

                    {/* Mobile Card View */}
                    <div className="mobile-view" style={{ display: isMobile ? 'flex' : 'none' }}>
                        {filteredClients.map((client) => (
                            <div key={client.id} className="mobile-card">
                                <div className="mobile-card-header">
                                    <div>
                                        <h3 className="mobile-card-title">{client.name}</h3>
                                        <p className="mobile-card-subtitle">{client.contactName}</p>
                                    </div>
                                    <div className="mobile-card-actions">
                                        <button 
                                            onClick={() => onEdit(client.id)}
                                            className="mobile-action-btn mobile-btn-edit"
                                        >
                                            <Pencil />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            className="mobile-action-btn mobile-btn-delete"
                                        >
                                            <Trash2 />
                                        </button>
                                    </div>
                                </div>

                                <div className="mobile-card-details">
                                    <div className="mobile-detail-item">
                                        <Mail /> {client.email || '-'}
                                    </div>
                                    <div className="mobile-detail-item">
                                        <Phone /> {client.phone || '-'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ClientList;