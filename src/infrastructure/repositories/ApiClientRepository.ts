import axios from 'axios';
import type { Client } from '../../core/entities/Client';
import type { IClientRepository } from '../../core/interfaces/IClientRepository';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/clients`;

export class ApiClientRepository implements IClientRepository {
  async getAll(): Promise<Client[]> {
    const response = await axios.get<Client[]>(API_URL);
    return response.data;
  }

  async getById(id: string): Promise<Client | null> {
    try {
      const response = await axios.get<Client>(`${API_URL}/${id}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async add(client: Client): Promise<Client> {
    const response = await axios.post<Client>(API_URL, client);
    return response.data;
  }

  async update(id: string, client: Client): Promise<Client> {
    const response = await axios.put<Client>(`${API_URL}/${id}`, client);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}
