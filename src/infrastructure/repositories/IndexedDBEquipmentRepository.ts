import { initDB } from './database';
import type { Equipment } from '../../core/entities/Equipment';
import type { IEquipmentRepository } from '../../core/interfaces/IEquipmentRepository';

const STORE_NAME = 'equipments';

export class IndexedDBEquipmentRepository implements IEquipmentRepository {
  private async getDB() {
    return await initDB();
  }

  async getAll(): Promise<Equipment[]> {
    const db = await this.getDB();
    return db.getAll(STORE_NAME);
  }

  async getById(id: string): Promise<Equipment | null> {
    const db = await this.getDB();
    const equipment = await db.get(STORE_NAME, id);
    return equipment || null;
  }

  async save(equipment: Equipment): Promise<void> {
    const db = await this.getDB();
    await db.put(STORE_NAME, equipment);
  }

  async update(equipment: Equipment): Promise<void> {
    await this.save(equipment);
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(STORE_NAME, id);
  }
}
