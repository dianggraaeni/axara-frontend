// src/services/auth.service.ts
import { api, setToken, setRestoringSession } from './apiClient';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  gender: 'male' | 'female' | null;
  xp: number;
  level: number;
  streakDays: number;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Status yang berarti "token tidak sah" → wajib logout
const FORCE_LOGOUT_STATUSES = new Set([401, 403]);

// Status yang berarti "server/network bermasalah" → jangan logout, pakai cache
const TRANSIENT_ERROR_STATUSES = new Set([500, 502, 503, 504]);

function clearAuthStorage() {
  setToken(null);
  localStorage.removeItem('axara_refresh');
  localStorage.removeItem('axara_user');
}

export const authService = {
  async register(
    email: string,
    username: string,
    password: string,
    gender?: 'male' | 'female'
  ): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', { email, username, password, gender });
    const result: AuthResponse = data.data;
    setToken(result.accessToken);
    localStorage.setItem('axara_refresh', result.refreshToken);
    localStorage.setItem('axara_user', JSON.stringify(result.user));
    return result;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', { email, password });
    const result: AuthResponse = data.data;
    setToken(result.accessToken);
    localStorage.setItem('axara_refresh', result.refreshToken);
    localStorage.setItem('axara_user', JSON.stringify(result.user));
    return result;
  },

  async logout(): Promise<void> {
    const refresh = localStorage.getItem('axara_refresh');
    if (refresh) {
      try {
        await api.post('/auth/logout', { refreshToken: refresh });
      } catch {
        // Tetap lanjut logout lokal meski server gagal
      }
    }
    clearAuthStorage();
  },

  async restoreSession(): Promise<AuthUser | null> {
    const refresh = localStorage.getItem('axara_refresh');
    if (!refresh) return null;

    setRestoringSession(true);
    try {
      const { data } = await api.post('/auth/refresh', { refreshToken: refresh });
      const newAccessToken: string = data.data.accessToken;
      const newRefreshToken: string = data.data.refreshToken;

      setToken(newAccessToken);
      localStorage.setItem('axara_refresh', newRefreshToken);

      const { data: profileData } = await api.get('/users/me');
      const user: AuthUser = profileData.data;
      localStorage.setItem('axara_user', JSON.stringify(user));
      return user;

    } catch (err: any) {
      const status: number | undefined = err?.response?.status;
      const isNetworkError = !status; // Tidak ada response sama sekali

      // 401 / 403 → token tidak sah atau akun bermasalah → wajib logout
      if (status && FORCE_LOGOUT_STATUSES.has(status)) {
        clearAuthStorage();
        return null;
      }

      // 409 → race condition (token sudah dirotasi request lain)
      // Tidak logout — token baru sudah ada di localStorage dari request lain
      if (status === 409) {
        console.warn('restoreSession: token rotation conflict, using cached user');
        return this.getCachedUser();
      }

      // 5xx / network error / timeout → server bermasalah, jangan paksa logout
      if (isNetworkError || (status && TRANSIENT_ERROR_STATUSES.has(status))) {
        console.warn('restoreSession: transient error, using cached user:', err?.message);
        return this.getCachedUser();
      }

      // Status lain yang tidak terduga (4xx selain 401/403/409)
      // Contoh: 400 Bad Request (refresh token malformed) → logout paksa
      // karena ini indikasi token corrupt, bukan masalah server
      console.warn('restoreSession: unexpected error status', status, '→ force logout');
      clearAuthStorage();
      return null;

    } finally {
      setRestoringSession(false);
    }
  },

  getCachedUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem('axara_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};