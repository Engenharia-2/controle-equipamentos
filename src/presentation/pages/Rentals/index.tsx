import React, { useState } from 'react';
import { RentalForm } from '../../components/Rental/RentalForm';
import { RentalTable } from '../../components/Rental/RentalTable';
import { RentalFilters } from '../../components/Rental/RentalFilters';
import { useRentals } from '../../hooks/useRentals';
import { Plus } from 'lucide-react';
import { Button } from '../../components/Button';
import './styles.css';

const Rentals: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const { 
    rentals, 
    loading, 
    handleFinishRental, 
    handleFilterChange,
    formatCurrency, 
    formatDate,
    refresh
  } = useRentals();

  const handleSuccess = () => {
    setView('list');
    refresh();
  };

  const handleCancel = () => {
    setView('list');
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
              onClick={() => setView('form')}
              icon={<Plus size={18} />}
            >
              Nova Locação
            </Button>
          </header>

          <main className="rentals-content">
            <RentalFilters onFilterChange={handleFilterChange} />
            
            {loading ? (
              <div className="loading" style={{ textAlign: 'center', padding: '3rem', color: 'var(--sidebar-text)' }}>Carregando locações...</div>
            ) : rentals.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', color: 'var(--sidebar-text)', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <p>Nenhuma locação encontrada com os filtros atuais.</p>
              </div>
            ) : (
              <RentalTable 
                rentals={rentals}
                onFinish={handleFinishRental}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
              />
            )}
          </main>
        </>
      ) : (
        <RentalForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Rentals;
