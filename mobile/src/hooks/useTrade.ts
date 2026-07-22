import { useCallback, useEffect, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import NetInfo from '@react-native-community/netinfo';
import api from '../services/api';
import { formatBRL, formatBTC } from '../utils/format';
import { useWalletContext } from '../contexts/WalletContext';
import type { MarketPrice, Transaction } from '../types';

type Mode = 'buy' | 'sell';

interface UseTradeReturn {
  mode: Mode;
  setMode: (m: Mode) => void;
  amount: string;
  setAmount: (v: string) => void;
  preview: string;
  btcPrice: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  submit: () => Promise<void>;
  resetFeedback: () => void;
}

export function useTrade(): UseTradeReturn {
  const { refresh: refreshWallet } = useWalletContext();
  const [mode, setModeState] = useState<Mode>('buy');
  const [amount, setAmount] = useState('');
  const [rawPrice, setRawPrice] = useState('');
  const [btcPrice, setBtcPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    api.get<MarketPrice>('/market/btc').then((res) => {
      const price = res.data.price;
      setRawPrice(price);
      setBtcPrice(formatBRL(price));
    });
  }, []);

  const resetFeedback = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const setMode = useCallback(
    (m: Mode) => {
      setModeState(m);
      setAmount('');
      resetFeedback();
    },
    [resetFeedback],
  );

  const preview = useMemo(() => {
    const numAmount = parseFloat(amount);
    const numPrice = parseFloat(rawPrice);

    if (!numAmount || numAmount <= 0 || !numPrice || numPrice <= 0) {
      return '';
    }

    if (mode === 'buy') {
      // Trunca em 8 casas decimais igual ao bcdiv do backend
      const btc = Math.floor((numAmount / numPrice) * 1e8) / 1e8;
      return `≈ ${formatBTC(btc)}`;
    }

    // Arredonda em 2 casas decimais igual ao backend
    const brl = Math.round(numAmount * numPrice * 100) / 100;
    return `≈ ${formatBRL(brl)}`;
  }, [amount, rawPrice, mode]);

  const submit = useCallback(async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) {
      setError('Sem conexão com a internet. Verifique sua rede e tente novamente.');
      return;
    }

    const numAmount = parseFloat(amount);

    if (!amount || numAmount <= 0) {
      setError('Informe um valor válido.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'buy') {
        await api.post<Transaction>('/trade/buy', { amount_brl: amount });
        setSuccess('Compra realizada!');
      } else {
        await api.post<Transaction>('/trade/sell', { amount_btc: amount });
        setSuccess('Venda realizada!');
      }
      setAmount('');
      await refreshWallet();
    } catch (err) {
      const message =
        isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message ?? 'Erro ao processar operação.'
          : 'Erro ao processar operação.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [amount, mode]);

  return {
    mode,
    setMode,
    amount,
    setAmount,
    preview,
    btcPrice,
    loading,
    error,
    success,
    submit,
    resetFeedback,
  };
}
