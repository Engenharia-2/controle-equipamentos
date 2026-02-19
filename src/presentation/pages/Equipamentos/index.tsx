import React from 'react';
import { EquipmentTable } from '../../components/Equipment/EquipmentTable';
import { EquipmentForm } from '../../components/Equipment/EquipmentForm';
import { EquipmentFilters } from '../../components/Equipment/EquipmentFilters';
import { Button } from '../../components/Button';
import { Plus } from 'lucide-react';
import { useEquipamentosLogic } from './useLogic';
import './styles.css';

const Equipamentos: React.FC = () => {
  const { 
    equipments, 
    isModalOpen, 
    editingEquipment,
    handleOpenModal, 
    handleEditOpenModal,
    handleCloseModal, 
    handleSaveEquipment,
    handleDeleteEquipment,
    handleFilterChange
  } = useEquipamentosLogic();

  return (
    <div className="equipamentos-page">
      <header className="equipamentos-header">
        <div className="equipamentos-title-container">
          <h1>Controle de Equipamentos</h1>
          <p>Gerenciamento de itens sob locação e disponibilidade de estoque.</p>
        </div>
        <Button 
          onClick={handleOpenModal}
          icon={<Plus size={18} />}
        >
          Novo Equipamento
        </Button>
      </header>
      
      <main className="equipamentos-content">
        <section className="table-section">
          <EquipmentFilters onFilterChange={handleFilterChange} />
          <EquipmentTable 
            equipments={equipments} 
            onEdit={handleEditOpenModal}
            onDelete={handleDeleteEquipment}
          />
        </section>
      </main>

      {isModalOpen && (
        <EquipmentForm 
          onClose={handleCloseModal} 
          onSubmit={handleSaveEquipment} 
          initialData={editingEquipment}
        />
      )}
    </div>
  );
};

export default Equipamentos;
