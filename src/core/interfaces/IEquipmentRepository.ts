import type { Equipment } from '../entities/Equipment';

export interface IEquipmentRepository {
  getAll(): Promise<Equipment[]>;
  getById(id: string): Promise<Equipment | null>;
  save(equipment: Equipment): Promise<void>;
  update(equipment: Equipment): Promise<void>;
  delete(id: string): Promise<void>;
}
