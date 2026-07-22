import * as SecureStore from 'expo-secure-store';
import api, { TOKEN_KEY } from './api';
import type { AuthTokens } from '../types';

export async function login(email: string, password: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/login', { email, password });
  await SecureStore.setItemAsync(TOKEN_KEY, data.token);
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });
  await SecureStore.setItemAsync(TOKEN_KEY, data.token);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/logout');
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}
