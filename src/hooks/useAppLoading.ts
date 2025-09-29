import { useState, useEffect } from 'react';

export const useAppLoading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tempo de carregamento do app
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 segundos de loading para mostrar a animação

    return () => clearTimeout(timer);
  }, []);

  return isLoading;
};

// Hook para controlar loading manualmente
export const useManualLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};
