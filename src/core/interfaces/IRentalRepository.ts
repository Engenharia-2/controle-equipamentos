import type { Rental } from '../entities/Rental';

export interface IRentalRepository {
  getAll(): Promise<Rental[]>;
  save(rental: Rental): Promise<void>;
  update(rental: Rental): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Rental | null>;
}
