// src/hooks/useBackendData.ts
import { useState, useEffect, useCallback } from 'react';
import { provincesService } from '../services/provinces.service';
import { usersService } from '../services/users.service';
import { leaderboardService } from '../services/leaderboard.service';
import { useAuth } from '../context/AuthContext';

// ─── useProvinces ─────────────────────────────────────────────────────────────
export function useProvinces() {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  const fetch = useCallback(async () => {
    if (authLoading || !isAuthenticated) return;
    try {
      setIsLoading(true);
      const data = await provincesService.getAll();
      setProvinces(data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Gagal memuat provinsi');
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => { fetch(); }, [fetch]);

  return { provinces, isLoading, error, refetch: fetch };
}

// ─── useUserStats ─────────────────────────────────────────────────────────────
export function useUserStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: authLoading, isAuthenticated, lastUpdated } = useAuth();

  const fetch = useCallback(async () => {
    // Jangan fetch apapun selama auth masih loading atau belum authenticated
    if (authLoading || !isAuthenticated) return;
    try {
      setIsLoading(true);
      const data = await usersService.getStats();
      setStats(data);
    } catch { /* ignore */ } finally {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => { fetch(); }, [fetch, lastUpdated]);

  return { stats, isLoading, refetch: fetch };
}

// ─── useUserBadges ────────────────────────────────────────────────────────────
export function useUserBadges() {
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: authLoading, isAuthenticated, lastBadgeUpdated } = useAuth();

  const fetch = useCallback(async () => {
    if (authLoading || !isAuthenticated) return;
    try {
      setIsLoading(true);
      const data = await usersService.getBadges();
      setBadges(data);
    } catch { /* ignore */ } finally {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => { fetch(); }, [fetch, lastBadgeUpdated]);

  return { badges, isLoading, refetch: fetch };
}

// ─── useLeaderboard ───────────────────────────────────────────────────────────
export function useLeaderboard(page = 1) {
  const [data, setData] = useState<any>(null);
  const [myRank, setMyRank] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const load = async () => {
      try {
        setIsLoading(true);
        const [lb, rank] = await Promise.all([
          leaderboardService.getGlobal(page),
          leaderboardService.getMyRank(),
        ]);
        setData(lb);
        setMyRank(rank);
      } catch { /* ignore */ } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [page, authLoading, isAuthenticated]);

  return { data, myRank, isLoading };
}