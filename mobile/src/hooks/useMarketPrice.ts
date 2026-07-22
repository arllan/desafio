import { useEffect, useState } from 'react';
import api from '../services/api';
import type { MarketPrice } from '../types';
import { formatBRL } from '../utils/format';

const POLL_INTERVAL_MS = 30000;

interface UseMarketPriceResult {
  price: string;
  loading: boolean;
  error: string | null;
}

export function useMarketPrice(): UseMarketPriceResult {
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPrice = async () => {
      try {
        const res = await api.get<MarketPrice>('/market/btc');
        if (!cancelled) {
          setPrice(formatBRL(res.data.price));
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError('Preço indisponível.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPrice();

    const intervalId = setInterval(fetchPrice, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return { price, loading, error };
}
