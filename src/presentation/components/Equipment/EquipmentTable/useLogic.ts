import type { Equipment } from '../../../../core/entities/Equipment';

export const useEquipmentTableLogic = (equipments: Equipment[]) => {
  // Logic for sorting, filtering etc. can be added here
  return {
    equipments,
  };
};
