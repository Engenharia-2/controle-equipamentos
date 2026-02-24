import { Client } from '../entities/Client';

export interface IClientRepository {
  add(client: Client): Promise<Client>;
  update(id: string, client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Client | null>;
  getAll(): Promise<Client[]>;
}
