// src/services/apiClient.ts
import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

let accessToken: string | null = null;
let isRefreshing = false;
let isRestoringSession = false;
let refreshQueue: ((token: string) => void)[] = [];

export const setToken = (token: string | null) => { accessToken = token; };
export const getToken = () => accessToken;
export const setRestoringSession = (val: boolean) => { isRestoringSession = val; };

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status === 401 && !original._retry) {
      // Jangan intercept jika restoreSession sedang berjalan
      if (isRestoringSession) {
        return Promise.reject(error);
      }

      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('axara_refresh');
        if (!refresh) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: refresh,
        });
        const newAccess: string = data.data.accessToken;
        const newRefresh: string = data.data.refreshToken;

        setToken(newAccess);
        localStorage.setItem('axara_refresh', newRefresh);

        refreshQueue.forEach((cb) => cb(newAccess));
        refreshQueue = [];

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);

      } catch (refreshError: any) {
        const status = refreshError?.response?.status;

        // 409 = token sudah dirotasi (race condition) — jangan logout
        // Token baru sudah di-set oleh restoreSession
        if (status === 409) {
          refreshQueue = [];
          return Promise.reject(error);
        }

        // 401/403 = benar-benar invalid → logout
        setToken(null);
        localStorage.removeItem('axara_refresh');
        localStorage.removeItem('axara_user');
        refreshQueue = [];

        if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
          window.location.href = '/login';
        }

        return Promise.reject(error);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);