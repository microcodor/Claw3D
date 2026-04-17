import { useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  error: Error | null;
}

/**
 * 加载状态 Hook
 * @returns 加载状态和控制函数
 */
export function useLoading(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingError = useCallback((err: Error | string) => {
    setIsLoading(false);
    setError(typeof err === 'string' ? new Error(err) : err);
  }, []);

  const resetLoading = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const withLoading = useCallback(async <T,>(
    fn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      startLoading();
      const result = await fn();
      stopLoading();
      return result;
    } catch (err) {
      setLoadingError(err as Error);
      return null;
    }
  }, [startLoading, stopLoading, setLoadingError]);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    resetLoading,
    withLoading,
  };
}
