import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ClientService } from '../../services/ClientService';
import { useDialog } from '../../contexts/DialogContext';

export const useClients = (clientId = null) => {
    const { currentUser } = useAuth();
    const { showDialog } = useDialog();

    // State for the list
    const [clients, setClients] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State for the form
    const [formData, setFormData] = useState({
        name: '', address: '', contactName: '', email: '', phone: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    // Fetch all clients (for the list)
    useEffect(() => {
        if (!currentUser) return;

        const fetchClients = async () => {
            try {
                setListLoading(true);
                const data = await ClientService.getUserClients(currentUser.uid);
                setClients(data);
            } catch (error) {
                console.error('Error fetching clients:', error);
                showDialog({ type: 'error', title: 'Erro', message: 'Erro ao buscar clientes.' });
            } finally {
                setListLoading(false);
            }
        };

        fetchClients();
    }, [currentUser, showDialog]);

    // Fetch a single client (for the form)
    useEffect(() => {
        if (clientId && currentUser) {
            const loadClient = async () => {
                try {
                    setFormLoading(true);
                    const data = await ClientService.getClient(clientId);
                    if (data) {
                        setFormData(data);
                    }
                } catch (error) {
                    console.error('Error loading client:', error);
                    showDialog({ type: 'error', title: 'Erro', message: 'Erro ao carregar cliente.' });
                } finally {
                    setFormLoading(false);
                }
            };
            loadClient();
        }
    }, [clientId, currentUser, showDialog]);

    const handleDelete = async (id) => {
        showDialog({
            type: 'confirm',
            title: 'Excluir Cliente',
            message: 'Tem certeza que deseja excluir este cliente?',
            confirmText: 'Excluir',
            onConfirm: async () => {
                try {
                    await ClientService.deleteClient(id);
                    setClients(prev => prev.filter(c => c.id !== id));
                    showDialog({ type: 'success', title: 'Sucesso', message: 'Cliente excluído com sucesso.' });
                } catch (error) {
                    console.error('Error deleting client:', error);
                    showDialog({ type: 'error', title: 'Erro', message: 'Erro ao excluir cliente.' });
                }
            }
        });
    };

    const handleSave = async () => {
        if (!currentUser) return false;

        setFormLoading(true);
        try {
            await ClientService.saveClient(currentUser.uid, formData, clientId);
            showDialog({ type: 'success', title: 'Sucesso', message: 'Cliente salvo com sucesso!' });
            return true;
        } catch (error) {
            console.error('Error saving client:', error);
            showDialog({ type: 'error', title: 'Erro', message: 'Erro ao salvar cliente.' });
            return false;
        } finally {
            setFormLoading(false);
        }
    };

    const filteredClients = useMemo(() =>
        clients.filter(client =>
            (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (client.contactName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        ), [clients, searchTerm]);

    return {
        // For the list
        clients: filteredClients,
        listLoading,
        searchTerm,
        setSearchTerm,
        handleDelete,

        // For the form
        formData,
        setFormData,
        formLoading,
        handleSave,
    };
};