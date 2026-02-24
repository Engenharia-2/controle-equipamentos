import { openDB } from 'idb';
import type { Client } from '../../core/entities/Client';
import type { IClientRepository } from '../../core/interfaces/IClientRepository';

const DB_NAME = 'controle-equipamentos';
const STORE_NAME = 'clients';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export class IndexedDBClientRepository implements IClientRepository {
  async add(client: Client): Promise<Client> {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const id = await store.add({ ...client });
    await tx.done;
    return { ...client, id: id as string };
  }

  async update(id: string, client: Client): Promise<Client> {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.put({ ...client, id });
    await tx.done;
    return { ...client, id };
  }

  async delete(id: string): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.delete(id);
    await tx.done;
  }

  async getById(id: string): Promise<Client | null> {
    const db = await dbPromise;
    const client = await db.get(STORE_NAME, id);
    return client || null;
  }

  async getAll(): Promise<Client[]> {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  }
}
