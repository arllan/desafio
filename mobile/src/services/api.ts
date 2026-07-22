import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_URL = 'https://desafio-production-2296.up.railway.app/api';

export const TOKEN_KEY = 'auth_token';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
