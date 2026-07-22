import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { formatBRL, formatBTC, formatDate } from '../utils/format';
import type { Transaction, FormattedTransaction } from '../types';

export type TransactionTypeFilter = 'all' | 'buy' | 'sell';

export interface TransactionFilters {
  type: TransactionTypeFilter;
  minAmount: string;
}

function mapTransaction(tx: Transaction): FormattedTransaction {
  return {
    id: tx.id,
    type: tx.type,
    typeLabel: tx.type === 'buy' ? 'Compra' : 'Venda',
    amountBrl: formatBRL(tx.amount_brl),
    amountBtc: formatBTC(tx.amount_btc),
    btcPrice: formatBRL(tx.btc_price),
    date: formatDate(tx.created_at),
  };
}

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({ type: 'all', minAmount: '' });

  const fetchData = useCallback(async (activeFilters: TransactionFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (activeFilters.type !== 'all') params.type = activeFilters.type;
      if (activeFilters.minAmount.trim()) params.min_amount = activeFilters.minAmount.trim();

      const response = await api.get<Transaction[]>('/transactions', { params });
      setTransactions(response.data.map(mapTransaction));
    } catch {
      setError('Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [fetchData, filters]);

  const applyFilters = useCallback((newFilters: TransactionFilters) => {
    setFilters(newFilters);
  }, []);

  const refresh = useCallback(() => {
    fetchData(filters);
  }, [fetchData, filters]);

  return { transactions, loading, error, refresh, filters, applyFilters };
}
