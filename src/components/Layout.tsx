// src/components/Layout.tsx
import { ReactNode, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Map, Swords, MessageCircle, User, Loader2, Zap, Newspaper } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../hooks/useBackendData';

const navItems = [
  { path: '/app',         label: 'AxaraWorld',  shortLabel: 'World',  icon: Map,           emoji: '🗺️' },
  { path: '/app/quest',   label: 'AxaraBattle', shortLabel: 'Battle', icon: Swords,        emoji: '⚔️' },
  { path: '/app/verse',   label: 'AxaraVerse',  shortLabel: 'Verse',  icon: MessageCircle, emoji: '💬' },
  { path: '/app/warta',   label: 'AxaraWarta',  shortLabel: 'Warta',  icon: Newspaper,     emoji: '📰' },
  { path: '/app/profile', label: 'AxaraBadge',  shortLabel: 'Badge',  icon: User,          emoji: '🏅' },
];

export default function Layout({ children }: { children: ReactNode }) { 
  const location = useLocation();
  const { user, isLoading, isAuthenticated, updateUser } = useAuth();
  const { stats } = useUserStats();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4"
        style={{ background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: '#F14C38', border: '4px solid #1a0f0a', boxShadow: '4px 4px 0 #1a0f0a' }}>
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest"
          style={{ color: '#1a0f0a', opacity: 0.45 }}>Memuat dunia...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

const xp        = stats?.xp    ?? user?.xp    ?? 0;
  const level     = stats?.level ?? user?.level ?? 1;
  const avatarUrl = user?.avatarUrl ?? null;
  const name      = user?.username ?? 'Petualang';
  const lastSelectedProvince = typeof window !== 'undefined'
    ? localStorage.getItem('axara_quest_province_v2')
    : null;
const navItemsResolved = navItems.map((item) => {
  if (item.path !== '/app/quest') return item;
  return {
    ...item,
    path: lastSelectedProvince
      ? `/app/quest?province=${encodeURIComponent(lastSelectedProvince)}`
      : '/app/quest',
  };
});

const xpInLevel  = xp % 100;
  const xpPercent  = Math.min(xpInLevel, 100);

  useEffect(() => {
    if (!stats || !user) return;
    const needSync =
      (typeof stats.xp === 'number' && stats.xp !== user.xp) ||
      (typeof stats.level === 'number' && stats.level !== user.level);
    if (needSync) {
      updateUser({
        xp: typeof stats.xp === 'number' ? stats.xp : user.xp,
        level: typeof stats.level === 'number' ? stats.level : user.level,
      });
    }
  }, [stats, user, updateUser]);

  return (
    <div className="flex h-screen overflow-hidden"
      style={{ background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}>

      {/* ════════════════════════════════════════
          DESKTOP SIDEBAR
      ════════════════════════════════════════ */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 overflow-hidden"
        style={{
          background: '#FFFFFF',
          borderRight: '4px solid rgba(26,15,10,0.08)',
          boxShadow: '4px 0 20px rgba(241,76,56,0.05)'
        }}>

        {/* ── Logo ── */}
        <Link to="/"
          className="flex items-center gap-3 px-5 pt-6 pb-5 transition-opacity hover:opacity-75">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shrink-0"
            style={{ border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #F14C38' }}>
            <img src="/logo.png" alt="Axara" className="w-full h-full object-contain"
              referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-2xl font-black leading-none tracking-tight" style={{ color: '#1a0f0a' }}>
              AX<span style={{ color: '#F14C38' }}>ARA</span>
            </h1>
            <p className="text-[10px] font-black tracking-widest uppercase mt-0.5"
              style={{ color: '#F14C38' }}>Adventure</p>
          </div>
        </Link>

        {/* Divider */}
        <div className="mx-4 mb-4"
          style={{ height: '2px', background: 'rgba(26,15,10,0.06)', borderRadius: '2px' }} />

        {/* ── Nav items ── */}
        <nav className="flex-1 px-3 space-y-1.5">
         {navItemsResolved.map((item) => {
           const isActive = item.path.startsWith('/app/quest')
  ? location.pathname === '/app/quest'
  : location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wide transition-all"
                style={{
                  background:  isActive ? '#F14C38'           : 'transparent',
                  color:       isActive ? '#FFFFFF'           : 'rgba(26,15,10,0.45)',
                  border:      isActive ? '3px solid #1a0f0a' : '3px solid transparent',
                  boxShadow:   isActive ? '3px 3px 0 #1a0f0a' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = '#F4F1E0';
                    (e.currentTarget as HTMLElement).style.color = '#1a0f0a';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(26,15,10,0.45)';
                  }
                }}>
                <span className="text-lg w-6 text-center leading-none">{item.emoji}</span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-5 rounded-full opacity-60" style={{ background: 'white' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 mt-3 mb-4"
          style={{ height: '2px', background: 'rgba(26,15,10,0.06)', borderRadius: '2px' }} />

        {/* ── User card ── */}
        <div className="px-3 pb-5">
          <Link to="/app/profile"
            className="flex items-center gap-3 p-3.5 rounded-2xl transition-all"
            style={{ border: '3px solid rgba(26,15,10,0.1)', transition: 'all 0.15s' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#F4F1E0';
              (e.currentTarget as HTMLElement).style.borderColor = '#F14C38';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,15,10,0.1)';
            }}>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center font-black text-xl"
              style={{
                border: '3px solid #1a0f0a', background: '#F14C38',
                color: 'white', boxShadow: '2px 2px 0 #1a0f0a'
              }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                : name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-black text-base truncate leading-tight" style={{ color: '#1a0f0a' }}>
                {name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Zap size={11} style={{ color: '#F14C38' }} strokeWidth={3} />
                <span className="text-xs font-black" style={{ color: '#F14C38' }}>Lv.{level}</span>
                <span className="text-xs font-bold" style={{ color: 'rgba(26,15,10,0.4)' }}>
                  · {xp} XP
                </span>
              </div>
              {/* XP bar */}
              <div className="mt-1.5 h-2 rounded-full overflow-hidden"
                style={{ background: '#F4F1E0', border: '1.5px solid rgba(26,15,10,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${xpPercent}%`, background: '#F14C38' }} />
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════ */}
      <main className="flex-1 overflow-hidden flex flex-col pb-16 md:pb-0"
        style={{ background: '#F4F1E0', minWidth: 0 }}>
        {children}
      </main>

      {/* ════════════════════════════════════════
          MOBILE BOTTOM NAV
      ════════════════════════════════════════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: '#FFFFFF',
          borderTop: '4px solid rgba(26,15,10,0.1)',
          boxShadow: '0 -4px 16px rgba(241,76,56,0.08)'
        }}>
        <div className="flex justify-around px-2 py-2 pb-safe">
{navItemsResolved.map((item) => {
  const isActive = item.path.startsWith('/app/quest')
    ? location.pathname === '/app/quest'
    : location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all"
                style={{
                  background: isActive ? '#F14C38' : 'transparent',
                  border:     isActive ? '2.5px solid #1a0f0a' : '2.5px solid transparent',
                  boxShadow:  isActive ? '2px 2px 0 #1a0f0a' : 'none',
                  minWidth: '60px'
                }}>
                <span className="text-xl leading-none">{item.emoji}</span>
                <span className="text-[9px] font-black uppercase tracking-wide"
                  style={{ color: isActive ? 'white' : 'rgba(26,15,10,0.4)' }}>
                  {item.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}