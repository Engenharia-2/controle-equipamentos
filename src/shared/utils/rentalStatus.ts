/**
 * Lógica centralizada para determinar o status de uma locação
 */

export type RentalStatusType = 'Alocado' | 'Expirando' | 'Expirado';

interface StatusResult {
  status: RentalStatusType;
  remainingDays: number;
  totalDays: number;
  percentageRemaining: number;
}

export const calculateRentalStatus = (startDate: string, endDate: string, referenceDate?: Date): StatusResult => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = referenceDate ? new Date(referenceDate) : new Date();
  
  // Normalizar para considerar apenas a data, sem horas
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const totalTime = end.getTime() - start.getTime();
  const remainingTime = end.getTime() - today.getTime();
  
  const totalDays = Math.max(1, totalTime / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, remainingTime / (1000 * 60 * 60 * 24));
  const percentageRemaining = (remainingTime / totalTime);

  let status: RentalStatusType = 'Alocado';

  if (today > end) {
    status = 'Expirado';
  } else if (remainingDays <= (totalDays * 0.3)) {
    // Regra de negócio: 30% ou menos do tempo total
    status = 'Expirando';
  }

  return {
    status,
    remainingDays: Math.round(remainingDays),
    totalDays: Math.round(totalDays),
    percentageRemaining
  };
};
