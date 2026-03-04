export type EquipmentStatus = 'Locação' | 'Expirado' | 'Disponível';

export interface Equipment {
  id: string;
  client: string;
  status: EquipmentStatus;
  equipmentName: string;
  startDate: string;
  endDate: string;
  allocationValue: number;
  remainingDays: number;
  seller: string;
  serialNumber: string;
}
