import { useMemo } from 'react';

export const useRentalRowLogic = (startDate: string, endDate: string) => {
  const statusInfo = useMemo(() => {
    if (!startDate || !endDate || startDate === '-' || endDate === '-') {
      return { label: 'Indefinido', class: 'status-undefined' };
    }

    // Criar objetos de data (formato esperado: YYYY-MM-DD)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    // Normalizar para comparar apenas as datas (ignorar horas)
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    // 1. Verificar se já expirou (Data atual é maior que a data de término)
    if (today > end) {
      return { label: 'Expirado', class: 'status-expired' };
    }

    // 2. Calcular duração total e tempo restante
    const totalTime = end.getTime() - start.getTime();
    const remainingTime = end.getTime() - today.getTime();
    
    // Converter milissegundos para dias
    const totalDays = Math.max(1, totalTime / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, remainingTime / (1000 * 60 * 60 * 24));
    
    // Regra dos 30%: Se os dias restantes forem 30% ou menos da duração total
    if (remainingDays <= (totalDays * 0.3)) {
      return { label: 'Expirando', class: 'status-expiring' };
    }

    return { label: 'Alocado', class: 'status-allocated' };
  }, [startDate, endDate]);

  return {
    statusInfo
  };
};
