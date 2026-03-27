// src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/auth.service';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  lastUpdated: number;
  lastBadgeUpdated: number;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, gender?: 'male' | 'female') => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => void;
  triggerBadgeRefetch: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inisialisasi langsung dari cache — user tidak null saat pertama render
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCachedUser());
  const [lastUpdated, setLastUpdated] = useState<number>(() => Date.now());
  const [lastBadgeUpdated, setLastBadgeUpdated] = useState<number>(() => Date.now());

  // isLoading hanya true jika ada refresh token yang perlu divalidasi
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return !!localStorage.getItem('axara_refresh');
  });

  useEffect(() => {
    const hasRefreshToken = !!localStorage.getItem('axara_refresh');

    // Tidak ada refresh token → tidak perlu hit API, langsung selesai
    if (!hasRefreshToken) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    // Timeout 8 detik — jika backend tidak merespons, tetap pakai cached user
    const timeout = setTimeout(() => {
      if (!cancelled) {
        console.warn('Session restore timeout — menggunakan cached user');
        setIsLoading(false);
        // Tidak hapus data — user tetap login dengan data cache
      }
    }, 8000);

    authService.restoreSession()
      .then((restoredUser) => {
        if (cancelled) return;
        clearTimeout(timeout);
        // restoreSession sudah handle semua kasus:
        // - sukses: return fresh user dari server
        // - 401/403: return null (sudah hapus localStorage)
        // - network error: return cached user
        if (restoredUser) {
          setUser(restoredUser);
        } else {
          // null berarti refresh token invalid → setUser null
          setUser(null);
        }
      })
      .catch(() => {
        // Seharusnya tidak sampai sini karena restoreSession sudah catch semua
        // Tapi jika terjadi, jangan logout — pakai cached user
        if (!cancelled) {
          clearTimeout(timeout);
          console.warn('Unexpected restoreSession error — keeping cached user');
        }
      })
      .finally(() => {
        if (!cancelled) {
          clearTimeout(timeout);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    setLastUpdated(Date.now());
  };

  const register = async (email: string, username: string, password: string, gender?: 'male' | 'female') => {
    const result = await authService.register(email, username, password, gender);
    setUser(result.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    setUser((prev) => prev ? { ...prev, ...partial } : null);
    setLastUpdated(Date.now());
  };

  const triggerBadgeRefetch = () => {
    setLastBadgeUpdated(Date.now());
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      lastUpdated,
      lastBadgeUpdated,
      login,
      register,
      logout,
      updateUser,
      triggerBadgeRefetch,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}