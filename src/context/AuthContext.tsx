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
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCachedUser());
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return !!localStorage.getItem('axara_refresh');
  });
  const [lastUpdated, setLastUpdated] = useState<number>(() => Date.now());
  const [lastBadgeUpdated, setLastBadgeUpdated] = useState<number>(() => Date.now());

  useEffect(() => {
    const hasRefreshToken = !!localStorage.getItem('axara_refresh');
    if (!hasRefreshToken) {
      setIsLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      console.warn('Session restore timeout — menggunakan cached user');
      setIsLoading(false);
    }, 5000);

    authService.restoreSession()
      .then((u) => {
        clearTimeout(timeout);
        if (u) setUser(u);
      })
      .catch(() => {
        clearTimeout(timeout);
        setUser(null);
      })
      .finally(() => {
        clearTimeout(timeout);
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setUser(result.user);
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