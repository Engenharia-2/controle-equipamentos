import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClientList from '../../components/Clients/ClientList';
import ClientForm from '../../components/Clients/ClientForm';

const ClientsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const view = searchParams.get('view') || 'list';
    const clientId = searchParams.get('id');

    const handleCreateNew = () => {
        setSearchParams({ view: 'form' });
    };

    const handleEdit = (id) => {
        setSearchParams({ view: 'form', id });
    };

    const handleBackToList = () => {
        setSearchParams({ view: 'list' });
    };

    const handleSuccess = () => {
        // Refresh list logic is handled by useClients fetching on mount/update, 
        // but since we are just switching views, the list component might remount 
        // and fetch again.
        setSearchParams({ view: 'list' });
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {view === 'list' ? (
                <ClientList 
                    onCreate={handleCreateNew} 
                    onEdit={handleEdit} 
                />
            ) : (
                <ClientForm 
                    clientId={clientId} 
                    onCancel={handleBackToList} 
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default ClientsPage;
