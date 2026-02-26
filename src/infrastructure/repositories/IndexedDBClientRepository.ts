import { initDB } from './database';
import type { Client } from '../../core/entities/Client';
import type { IClientRepository } from '../../core/interfaces/IClientRepository';
import { v4 as uuidv4 } from 'uuid';

const STORE_NAME = 'clients';

export class IndexedDBClientRepository implements IClientRepository {
  private async getDB() {
    return await initDB();
  }

  async add(client: Client): Promise<Client> {
    const db = await this.getDB();
    const newClient = { ...client, id: client.id || uuidv4() };
    await db.put(STORE_NAME, newClient);
    return newClient;
  }

  async update(id: string, client: Client): Promise<Client> {
    const db = await this.getDB();
    const updatedClient = { ...client, id };
    await db.put(STORE_NAME, updatedClient);
    return updatedClient;
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(STORE_NAME, id);
  }

  async getById(id: string): Promise<Client | null> {
    const db = await this.getDB();
    const client = await db.get(STORE_NAME, id);
    return client || null;
  }

  async getAll(): Promise<Client[]> {
    const db = await this.getDB();
    return db.getAll(STORE_NAME);
  }
}
