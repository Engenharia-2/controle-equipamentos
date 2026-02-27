import axios from 'axios';
import type { Rental } from '../../core/entities/Rental';
import type { IRentalRepository } from '../../core/interfaces/IRentalRepository';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/rentals`;

export class ApiRentalRepository implements IRentalRepository {
  async getAll(): Promise<Rental[]> {
    const response = await axios.get<Rental[]>(API_URL);
    return response.data;
  }

  async getById(id: string): Promise<Rental | null> {
    try {
      const response = await axios.get<Rental>(`${API_URL}/${id}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async save(rental: Rental): Promise<void> {
    await axios.post(API_URL, rental);
  }

  async update(rental: Rental): Promise<void> {
    await axios.put(`${API_URL}/${rental.id}`, rental);
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}
