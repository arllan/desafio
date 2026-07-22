import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { formatBRL, formatBTC } from '../utils/format';
import type { User, Wallet } from '../types';

interface WalletContextValue {
  balanceBrl: string;
  balanceBtc: string;
  rawBalanceBtc: string;
  userName: string;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balanceBrl, setBalanceBrl] = useState('');
  const [balanceBtc, setBalanceBtc] = useState('');
  const [rawBalanceBtc, setRawBalanceBtc] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletRes, meRes] = await Promise.all([
        api.get<Wallet>('/wallet'),
        api.get<User>('/me'),
      ]);
      setBalanceBrl(formatBRL(walletRes.data.balance_brl));
      setBalanceBtc(formatBTC(walletRes.data.balance_btc));
      setRawBalanceBtc(String(walletRes.data.balance_btc));
      setUserName(meRes.data.name);
    } catch {
      setError('Não foi possível carregar a carteira.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <WalletContext.Provider value={{ balanceBrl, balanceBtc, rawBalanceBtc, userName, loading, error, refresh }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used inside WalletProvider');
  return ctx;
}
