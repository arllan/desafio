export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Wallet {
  balance_brl: string;
  balance_btc: string;
}

export interface MarketPrice {
  currency: string;
  price: string;
}

export type TransactionType = 'buy' | 'sell';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount_brl: string;
  amount_btc: string;
  btc_price: string;
  created_at: string;
}

export interface AuthTokens {
  user: User;
  token: string;
}

export interface FormattedTransaction {
  id: number;
  type: 'buy' | 'sell';
  typeLabel: string;
  amountBrl: string;
  amountBtc: string;
  btcPrice: string;
  date: string;
}
