import { useState, useEffect } from 'react';

/**
 * Hook para atrasar a atualização de um valor (Debounce).
 * Útil para evitar re-renderizações excessivas em campos de busca.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
