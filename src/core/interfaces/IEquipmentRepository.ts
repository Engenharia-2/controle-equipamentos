import type { Equipment } from '../entities/Equipment';

export interface IEquipmentRepository {
  getAll(): Promise<Equipment[]>;
  save(equipment: Equipment): Promise<void>;
  update(equipment: Equipment): Promise<void>;
  delete(id: string): Promise<void>;
}
