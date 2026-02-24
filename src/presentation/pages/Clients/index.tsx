import React from 'react';
import ClientList from '../../components/Client/ClientList';
import ClientForm from '../../components/Client/ClientForm';
import { useNavigation } from '../../hooks/useNavigation';

const Clients: React.FC = () => {
    const { view, id, navigateTo } = useNavigation();

    const handleCreateNew = () => {
        navigateTo('form');
    };

    const handleEdit = (clientId: string) => {
        navigateTo('form', clientId);
    };

    const handleBackToList = () => {
        navigateTo('list');
    };

    const handleSuccess = () => {
        navigateTo('list');
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
                    clientId={id}
                    onCancel={handleBackToList}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default Clients;