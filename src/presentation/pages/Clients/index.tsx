import React, { useState, useRef } from 'react';
import { ClientTable } from '../../components/Client/ClientTable';
import ClientForm from '../../components/Client/ClientForm';
import { useClients } from '../../hooks/useClients';
import { Plus, Upload, Trash } from 'lucide-react';
import { Button } from '../../components/Button';
import './styles.css';

const Clients: React.FC = () => {
    const {
        clients: filteredClients,
        listLoading: loading,
        searchTerm,
        setSearchTerm,
        handleDelete,
        handleDeleteAll,
        handleImportCSV,
        importProgress
    } = useClients();

    const [view, setView] = useState<'list' | 'form'>('list');
    const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateNew = () => {
        setSelectedClientId(undefined);
        setView('form');
    };

    const handleEdit = (clientId: string) => {
        setSelectedClientId(clientId);
        setView('form');
    };

    const handleBackToList = () => {
        setView('list');
    };

    const handleSuccess = () => {
        setView('list');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImportCSV(file);
        }
    };

    return (
        <div className="clients-page">
            {view === 'list' ? (
                <>
                    <header className="clients-header">
                        <div className="clients-title-container">
                            <h1>Meus Clientes</h1>
                            <p>Gerencie sua base de clientes.</p>
                        </div>
                        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={onFileChange} 
                                accept=".csv" 
                                style={{ display: 'none' }} 
                            />
                            
                            <Button
                                variant="secondary"
                                onClick={handleDeleteAll}
                                icon={<Trash size={18} />}
                            >
                                Excluir Todos
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={handleImportClick}
                                icon={<Upload size={18} />}
                            >
                                Importar CSV
                            </Button>
                            
                            <Button
                                onClick={handleCreateNew}
                                icon={<Plus size={18} />}
                            >
                                Novo Cliente
                            </Button>
                        </div>
                    </header>

                    {importProgress !== null && (
                        <div className="import-progress-container" style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <p style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-color)' }}>Importando clientes... {importProgress}%</p>
                            <div className="progress-bar-bg" style={{ height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
                                <div className="progress-bar-fill" style={{ width: `${importProgress}%`, height: '100%', backgroundColor: '#076df2', transition: 'width 0.3s ease' }}></div>
                            </div>
                        </div>
                    )}

                    <div className="search-container" style={{ marginBottom: '2rem' }}>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-color)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    {loading ? (
                        <div className="loading-container">Carregando clientes...</div>
                    ) : filteredClients.length === 0 ? (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px' }}>
                            <p className="empty-state-text" style={{ color: 'var(--sidebar-text)', marginBottom: '1rem' }}>
                                {searchTerm ? 'Nenhum cliente encontrado para sua busca.' : 'Você ainda não tem clientes cadastrados.'}
                            </p>
                            {!searchTerm && (
                                <Button onClick={handleCreateNew}>
                                    Cadastrar Primeiro Cliente
                                </Button>
                            )}
                        </div>
                    ) : (
                        <ClientTable 
                            clients={filteredClients} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                        />
                    )}
                </>
            ) : (
                <ClientForm
                    clientId={selectedClientId}
                    onCancel={handleBackToList}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default Clients;
