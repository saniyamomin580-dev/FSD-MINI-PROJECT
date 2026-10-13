import { useCallback, useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '../api/client.js';

// GETs `url` whenever url/params change. Returns { data, loading, error, reload }.
export default function useFetch(url, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const latest = useRef(0); // ignore answers from older, slower requests
  const key = JSON.stringify(params || {});

  const load = useCallback(async () => {
    const id = ++latest.current;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(url, { params: JSON.parse(key) });
      if (id === latest.current) setData(res.data);
    } catch (err) {
      if (id === latest.current) setError(errorMessage(err));
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }, [url, key]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
