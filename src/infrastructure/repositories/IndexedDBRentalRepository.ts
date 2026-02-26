import { initDB } from './database';
import type { Rental } from '../../core/entities/Rental';
import type { IRentalRepository } from '../../core/interfaces/IRentalRepository';

const STORE_NAME = 'rentals';

export class IndexedDBRentalRepository implements IRentalRepository {
  private async getDB() {
    return await initDB();
  }

  async getAll(): Promise<Rental[]> {
    const db = await this.getDB();
    return db.getAll(STORE_NAME);
  }

  async save(rental: Rental): Promise<void> {
    const db = await this.getDB();
    await db.put(STORE_NAME, rental);
  }

  async update(rental: Rental): Promise<void> {
    await this.save(rental);
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(STORE_NAME, id);
  }

  async getById(id: string): Promise<Rental | null> {
    const db = await this.getDB();
    const rental = await db.get(STORE_NAME, id);
    return rental || null;
  }
}
