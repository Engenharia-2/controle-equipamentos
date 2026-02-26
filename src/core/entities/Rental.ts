export interface Rental {
  id: string;
  equipmentId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  monthlyValue: number;
  seller: string;
  status: 'Ativa' | 'Finalizada';
}
