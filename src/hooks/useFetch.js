import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching data with mock fallback.
 * @param {string|null} url - API endpoint to fetch. If null/undefined, uses mockData.
 * @param {Object} options - Fetch options and mockData.
 * @returns {{ data: any, loading: boolean, error: Error|null, refetch: Function }}
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!url) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        try {
          const cached = window.localStorage.getItem('app-data');
          if (cached) {
            setData(JSON.parse(cached));
          } else {
            const defaultData = options.mockData || null;
            setData(defaultData);
            if (defaultData) {
              window.localStorage.setItem('app-data', JSON.stringify(defaultData));
            }
          }
        } catch (e) {
          setData(options.mockData || null);
        }
      } else {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const json = await response.json();
        setData(json);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options?.mockData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
