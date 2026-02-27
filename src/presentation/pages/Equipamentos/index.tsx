import React, { useState } from 'react';
import { EquipmentTable } from '../../components/Equipment/EquipmentTable';
import { EquipmentForm } from '../../components/Equipment/EquipmentForm';
import { EquipmentFilters } from '../../components/Equipment/EquipmentFilters';
import { Button } from '../../components/Button';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { useEquipamentosLogic } from './useLogic';
import './styles.css';

const Equipamentos: React.FC = () => {
  const { 
    equipments, 
    editingEquipment,
    handleSaveEquipment,
    handleDeleteEquipment,
    handleDeleteAll,
    handleFilterChange,
    setEditingEquipment,
    handleImportCSV
  } = useEquipamentosLogic();

  const [view, setView] = useState<'list' | 'form'>('list');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenForm = () => {
    setEditingEquipment(null);
    setView('form');
  };

  const handleEditOpenForm = (equipment: any) => {
    setEditingEquipment(equipment);
    setView('form');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImportCSV(file);
    }
  };

  const handleCloseForm = () => {
    setView('list');
  };

  const onSave = async (data: any) => {
    await handleSaveEquipment(data);
    setView('list');
  };

  return (
    <div className="equipamentos-page">
      {view === 'list' ? (
        <>
          <header className="equipamentos-header">
            <div className="equipamentos-title-container">
              <h1>Controle de Equipamentos</h1>
              <p>Gerenciamento de ativos físicos e estoque.</p>
            </div>
            <div className="header-actions">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                style={{ display: 'none' }} 
              />
              <Button 
                variant="secondary" 
                onClick={handleDeleteAll}
                icon={<Trash2 size={18} />}
                className="btn-danger"
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
                onClick={handleOpenForm}
                icon={<Plus size={18} />}
              >
                Novo Equipamento
              </Button>
            </div>
          </header>
          
          <main className="equipamentos-content">
            <section className="table-section">
              <EquipmentFilters 
                onFilterChange={handleFilterChange} 
                hideSeller 
                hideClient 
                hideMonth 
              />
              <EquipmentTable 
                equipments={equipments} 
                onEdit={handleEditOpenForm}
                onDelete={handleDeleteEquipment}
              />
            </section>
          </main>
        </>
      ) : (
        <EquipmentForm 
          onClose={handleCloseForm} 
          onSubmit={onSave} 
          initialData={editingEquipment}
        />
      )}
    </div>
  );
};

export default Equipamentos;
