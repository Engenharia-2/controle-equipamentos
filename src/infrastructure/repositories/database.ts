import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'controle-equipamentos-db';
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('clients')) {
        db.createObjectStore('clients', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('equipments')) {
        db.createObjectStore('equipments', { keyPath: 'id' });
      }
      // Reservado para futura store de rentals
      if (!db.objectStoreNames.contains('rentals')) {
        db.createObjectStore('rentals', { keyPath: 'id' });
      }
    },
  });
};
