import axios from 'axios';
import type { Equipment } from '../../core/entities/Equipment';
import type { IEquipmentRepository } from '../../core/interfaces/IEquipmentRepository';

const API_URL = 'http://localhost:3000/equipments';

export class ApiEquipmentRepository implements IEquipmentRepository {
  async getAll(): Promise<Equipment[]> {
    const response = await axios.get<Equipment[]>(API_URL);
    return response.data;
  }

  async save(equipment: Equipment): Promise<void> {
    await axios.post(API_URL, equipment);
  }

  async update(equipment: Equipment): Promise<void> {
    await axios.put(`${API_URL}/${equipment.id}`, equipment);
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}
