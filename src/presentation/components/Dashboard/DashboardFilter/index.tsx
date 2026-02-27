import React, { useEffect, useState, useMemo } from 'react';
import { useDashboard } from '../../../contexts/DashboardContext';
import { useRepositories } from '../../../../shared/contexts/RepositoryContext';
import { X } from 'lucide-react';
import styles from './styles.module.css';

export const DashboardFilter: React.FC = () => {
  const { filters, setMonth, setYear, setEquipmentModel, clearFilters } = useDashboard();
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const { equipmentRepository } = useRepositories();

  useEffect(() => {
    const loadModels = async () => {
      const equipments = await equipmentRepository.getAll();
      const models = Array.from(new Set(equipments.map(e => e.equipmentName))).sort();
      setAvailableModels(models);
    };
    loadModels();
  }, [equipmentRepository]);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    return Array.from({ length: 6 }, (_, i) => startYear + i).reverse();
  }, []);

  const hasActiveFilters = useMemo(() => {
    const now = new Date();
    return filters.equipmentModel !== '' || 
           filters.month !== now.getMonth() || 
           filters.year !== now.getFullYear();
  }, [filters]);

  return (
    <div className={styles.dashboardFilterContainer}>
      <div className={styles.filterMainGroup}>
        <div className={styles.filterItem}>
          <label>Período de Análise</label>
          <div className={styles.periodSelectors}>
            <select 
              value={filters.month} 
              onChange={(e) => setMonth(Number(e.target.value))}
              className={styles.dashSelect}
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <select 
              value={filters.year} 
              onChange={(e) => setYear(Number(e.target.value))}
              className={styles.dashSelect}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${styles.filterItem} ${styles.modelFilter}`}>
          <label>Modelo de Equipamento</label>
          <select 
            value={filters.equipmentModel} 
            onChange={(e) => setEquipmentModel(e.target.value)}
            className={styles.dashSelect}
          >
            <option value="">Todos os Modelos</option>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <button className={styles.dashClearBtn} onClick={clearFilters}>
          <X size={16} /> Limpar Filtros
        </button>
      )}
    </div>
  );
};
