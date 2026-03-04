import React, { useState } from 'react';
import { RentalForm } from '../../components/Rental/RentalForm';
import { RentalTable } from '../../components/Rental/RentalTable';
import { RentalFilters } from '../../components/Rental/RentalFilters';
import { useRentals } from '../../hooks/useRentals';
import { useRentalFilters } from '../../hooks/useRentalFilters';
import { Plus } from 'lucide-react';
import { Button } from '../../components/Button';
import './styles.css';

const Rentals: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const { 
    rentals, 
    loading, 
    editingRental,
    setEditingRental,
    handleFinishRental, 
    handleDeleteRental,
    refresh
  } = useRentals();

  const { filteredRentals, handleFilterChange } = useRentalFilters(rentals);

  const handleSuccess = () => {
    setView('list');
    setEditingRental(null);
    refresh();
  };

  const handleCancel = () => {
    setView('list');
    setEditingRental(null);
  };

  const handleEdit = (rental: any) => {
    setEditingRental(rental);
    setView('form');
  };

  const handleAddNew = () => {
    setEditingRental(null);
    setView('form');
  };

  return (
    <div className="rentals-page">
      {view === 'list' ? (
        <>
          <header className="rentals-header">
            <div className="rentals-title-container">
              <h1>Locações</h1>
              <p>Gerenciamento de contratos e vínculos entre clientes e equipamentos.</p>
            </div>
            <Button 
              onClick={handleAddNew}
              icon={<Plus size={18} />}
            >
              Nova Locação
            </Button>
          </header>

          <main className="rentals-content">
            <RentalFilters onFilterChange={handleFilterChange} />
            
            {loading ? (
              <div className="loading" style={{ textAlign: 'center', padding: '3rem', color: 'var(--sidebar-text)' }}>Carregando locações...</div>
            ) : filteredRentals.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', color: 'var(--sidebar-text)', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <p>Nenhuma locação encontrada com os filtros atuais.</p>
              </div>
            ) : (
              <RentalTable 
                rentals={filteredRentals}
                onFinish={handleFinishRental}
                onDelete={handleDeleteRental}
                onEdit={handleEdit}
              />
            )}
          </main>
        </>
      ) : (
        <RentalForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          editingRental={editingRental}
        />
      )}
    </div>
  );
};

export default Rentals;
