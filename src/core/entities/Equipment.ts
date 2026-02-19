export type EquipmentStatus = 'Locação' | 'Expirado' | 'Disponível';

export interface Equipment {
  id: string;
  orderNumber: number;
  client: string;
  status: EquipmentStatus;
  equipmentName: string;
  startDate: string;
  endDate: string;
  allocationValue: number;
  remainingDays: number;
  seller: string;
  serialNumber: number;
}
