import { useState, useEffect, useCallback } from 'react';

export type RemoteDataState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

/**
 * Generic hook for async data fetching with loading/error states and pull-to-refresh.
 *
 * Usage:
 *   const { data, loading, error, refresh } = useRemoteData(fetchCWSBracket);
 */
export function useRemoteData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): RemoteDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
