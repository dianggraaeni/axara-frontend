import { React, useState, ChangeEvent, ReactNode } from 'react';
import {
  Award, Star, MapPin, Shield, Edit2, Check, Loader2, LogOut,
  TrendingUp, Flame, Compass, Crown, Swords, ChevronRight,
  X, Camera, User, Mail, Lock, CheckCircle, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useUserStats, useUserBadges } from '../hooks/useBackendData';
import { usersService } from '../services/users.service';
import { useTranslation } from '../hooks/useTranslation'; // ✨ ADDED
import LanguageSwitcher from '../components/LanguageSwitcher'; // ✨ ADDED

// ─── Press-down button handlers (sama persis dengan Map.tsx) ──────────────
const pressHandlers = {
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget).style.boxShadow = '0 0 0 #1a0f0a';
    (e.currentTarget).style.transform = 'translate(2px,2px)';
  },
  onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget).style.boxShadow = '3px 3px 0 #1a0f0a';
    (e.currentTarget).style.transform = 'none';
  },
  onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget).style.boxShadow = '3px 3px 0 #1a0f0a';
    (e.currentTarget).style.transform = 'none';
  },
};

// ─── XP rank titles ─────────────────────────────────────────────────────── ✨ UPDATED
function getRankTitle(level: number, isEnglish: boolean): { title: string; icon: string } {
  if (level >= 34) return { 
    title: isEnglish ? 'Grand Explorer' : 'Penjelajah Agung', 
    icon: '👑' 
  };
  if (level >= 26) return { 
    title: isEnglish ? 'Legendary Adventurer' : 'Petualang Legendaris', 
    icon: '🌟' 
  };
  if (level >= 18) return { 
    title: isEnglish ? 'Expert Explorer' : 'Penjelajah Ulung', 
    icon: '⚔️' 
  };
  if (level >= 10) return { 
    title: isEnglish ? 'Intermediate Adventurer' : 'Petualang Madya', 
    icon: '🗡️' 
  };
  if (level >= 5) return { 
    title: isEnglish ? 'Young Explorer' : 'Penjelajah Muda', 
    icon: '🧭' 
  };
  return { 
    title: isEnglish ? 'Novice Adventurer' : 'Petualang Pemula', 
    icon: '🌱' 
  };
}

export default function ProfilePage() {
  const { t } = useTranslation(); // ✨ ADDED
  const { user, logout, updateUser } = useAuth();
  const { stats, isLoading: statsLoading, refetch: refetchStats } = useUserStats();
  const { badges, isLoading: badgesLoading } = useUserBadges();

  const [isEditing, setIsEditing]   = useState(false);
  const [editName, setEditName]     = useState(user?.username ?? '');
  const [editGender, setEditGender] = useState<'male' | 'female'>(user?.gender ?? 'male');
  const [isSaving, setIsSaving]     = useState(false);
  const [saveError, setSaveError]   = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      const updated = await usersService.updateProfile({ username: editName, gender: editGender });
      updateUser({ username: updated.username, gender: updated.gender });
      await refetchStats();
      setIsEditing(false);
    } catch (e: any) {
      setSaveError(e?.response?.data?.error ?? (t.profile.subtitle.includes('Explorer') ? 'Failed to save profile.' : 'Gagal menyimpan profil.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await usersService.uploadAvatar(file);
      updateUser({ avatarUrl: result.avatarUrl });
    } catch (e: any) {
      alert(e?.response?.data?.error ?? (t.profile.subtitle.includes('Explorer') ? 'Failed to upload avatar.' : 'Gagal upload avatar.'));
    }
  };

  const name              = user?.username ?? (t.profile.subtitle.includes('Explorer') ? 'Explorer' : 'Petualang');
  const avatarUrl         = user?.avatarUrl;
  const xp                = stats?.xp ?? user?.xp ?? 0;
  const level             = stats?.level ?? user?.level ?? 1;
  const xpToNext          = stats?.xpToNext ?? 0;
  const levelProgress     = stats?.levelProgress ?? 0;
  const streakDays        = stats?.streakDays ?? user?.streakDays ?? 0;
  const provincesUnlocked = stats?.provincesUnlocked ?? 0;
  const provincesCompleted= stats?.provincesCompleted ?? 0;
  const badgeCount        = stats?.badges ?? badges.length;
  const rank              = getRankTitle(level, t.profile.subtitle.includes('Explorer')); // ✨ UPDATED

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Dot-grid texture (sama dengan Map.tsx) ── */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px'
        }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-6 pb-20 space-y-6">

        {/* ════════════ HEADER ════════════ */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#F14C38', border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a' }}>
              <User size={18} className="text-white" strokeWidth={3} />
            </div>
            <div>
              {/* ✨ TRANSLATED */}
              <h1 className="text-2xl font-black leading-none" style={{ color: '#1a0f0a' }}>
                {t.profile.title.split(' ')[0]} <span style={{ color: '#F14C38' }}>{t.profile.title.split(' ')[1] || 'PROFILE'}</span>
              </h1>
              <p className="text-[9px] font-black tracking-widest uppercase leading-none mt-0.5" style={{ color: '#F14C38' }}>
                {t.profile.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* ✨ Language Switcher */}
            <LanguageSwitcher variant="minimal" />
            
            {!isEditing && (
              <button
                onClick={() => { setIsEditing(true); setEditName(name); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm uppercase"
                style={{
                  background: '#FBBF24', color: '#1a0f0a',
                  border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a',
                  transition: 'all 0.1s'
                }}
                {...pressHandlers}
              >
                <Edit2 size={14} strokeWidth={3} /> {t.common.edit}
              </button>
            )}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm uppercase"
              style={{
                background: 'white', color: '#F14C38',
                border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a',
                transition: 'all 0.1s'
              }}
              {...pressHandlers}
            >
              <LogOut size={14} strokeWidth={3} /> {t.profile.logout}
            </button>
          </div>
        </motion.header>

        {/* ════════════ HERO CARD ════════════ */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-[28px] overflow-hidden"
          style={{ border: '4px solid #1a0f0a', boxShadow: '6px 6px 0 #1a0f0a' }}
        >
          {/* Top banner */}
          <div className="relative px-6 pt-5 pb-16"
            style={{
              background: 'linear-gradient(135deg, #F14C38 0%, #c93020 100%)',
              borderBottom: '4px solid #1a0f0a'
            }}>
            {/* Decorative dots */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '18px 18px'
              }} />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{rank.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-white/70">
                    {rank.title}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white leading-none uppercase">
                  {name}
                </h2>
                <p className="text-sm font-bold text-white/60 mt-1">{user?.email}</p>
              </div>

              {streakDays > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{ background: '#1a0f0a', border: '2px solid #FBBF24' }}>
                  <Flame size={14} className="text-yellow-400" strokeWidth={3} />
                  {/* ✨ TRANSLATED */}
                  <span className="text-sm font-black text-white">
                    {streakDays} {t.profile.subtitle.includes('Explorer') ? 'days' : 'hari'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Avatar overlapping the banner */}
          <div className="bg-white relative px-6 pb-5">
            <div className="flex items-end gap-5" style={{ marginTop: '-44px' }}>
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden"
                  style={{ border: '4px solid #1a0f0a', boxShadow: '4px 4px 0 #1a0f0a', background: '#F4F1E0' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-black"
                      style={{ color: '#F14C38' }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Level badge on avatar */}
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg"
                  style={{ background: '#FBBF24', border: '2.5px solid #1a0f0a' }}>
                  <Star size={9} fill="#1a0f0a" className="text-text" strokeWidth={0} />
                  <span className="text-[10px] font-black" style={{ color: '#1a0f0a' }}>Lv.{level}</span>
                </div>
              </div>

              {/* XP Progress */}
              <div className="flex-1 pt-12">
                <div className="flex items-center justify-between mb-1.5">
                  {/* ✨ TRANSLATED */}
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(26,15,10,0.45)' }}>
                    {t.profile.subtitle.includes('Explorer') ? `EXP to Level ${level + 1}` : `EXP ke Level ${level + 1}`}
                  </span>
                  <span className="text-[10px] font-black" style={{ color: '#F14C38' }}>
                    {xpToNext > 0 
                      ? (t.profile.subtitle.includes('Explorer') ? `${xpToNext} XP more` : `${xpToNext} XP lagi`)
                      : 'MAX!'}
                  </span>
                </div>
                <div className="h-4 rounded-full overflow-hidden"
                  style={{ background: '#F4F1E0', border: '2.5px solid #1a0f0a' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #F14C38, #FBBF24)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
                <div className="text-right mt-1">
                  {/* ✨ TRANSLATED */}
                  <span className="text-[9px] font-black uppercase" style={{ color: 'rgba(26,15,10,0.35)' }}>
                    {xp} {t.profile.subtitle.includes('Explorer') ? 'Total XP' : 'XP Total'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ════════════ EDIT FORM (AnimatePresence) ════════════ */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              className="rounded-[24px] overflow-hidden"
              style={{ background: '#F4F1E0', border: '4px solid #1a0f0a', boxShadow: '6px 6px 0 #1a0f0a' }}
            >
              {/* Edit header */}
              <div className="px-6 py-4 flex items-center justify-between"
                style={{ background: '#FBBF24', borderBottom: '4px solid #1a0f0a' }}>
                <div className="flex items-center gap-2">
                  <Edit2 size={16} strokeWidth={3} style={{ color: '#1a0f0a' }} />
                  {/* ✨ TRANSLATED */}
                  <span className="font-black uppercase tracking-widest text-sm" style={{ color: '#1a0f0a' }}>
                    {t.profile.editProfile}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl"
                  style={{ background: 'rgba(26,15,10,0.15)', border: '2px solid rgba(26,15,10,0.3)', transition: 'all 0.1s' }}
                >
                  <X size={15} strokeWidth={3} style={{ color: '#1a0f0a' }} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Avatar upload */}
                <div className="flex items-center gap-4">
                  <label className="relative cursor-pointer group shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden"
                      style={{ border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a', background: '#F4F1E0' }}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-black" style={{ color: '#F14C38' }}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-[14px]"
                        style={{ background: 'rgba(26,15,10,0.6)' }}>
                        <Camera size={18} className="text-white" strokeWidth={2.5} />
                        <span className="text-[9px] font-black text-white uppercase">Ubah</span>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                  {/* ✨ TRANSLATED */}
                  <p className="text-xs font-bold" style={{ color: 'rgba(26,15,10,0.5)' }}>
                    {t.profile.subtitle.includes('Explorer') 
                      ? 'Click photo to upload new avatar'
                      : 'Klik foto untuk upload avatar baru'}
                  </p>
                </div>

                {/* Username */}
                <div>
                  {/* ✨ TRANSLATED */}
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#F14C38' }}>
                    {t.profile.subtitle.includes('Explorer') ? 'Username' : 'Username'}
                  </label>
                  <div className="relative">
                    <User size={14} strokeWidth={3} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(26,15,10,0.35)' }} />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={50}
                      className="w-full pl-9 pr-4 py-3 rounded-xl font-black text-sm"
                      style={{
                        background: 'white', border: '3px solid #1a0f0a', color: '#1a0f0a',
                        outline: 'none', boxShadow: '2px 2px 0 rgba(26,15,10,0.1)'
                      }}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  {/* ✨ TRANSLATED */}
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#F14C38' }}>
                    {t.profile.subtitle.includes('Explorer') ? 'Gender' : 'Gender'}
                  </label>
                  <div className="flex gap-3">
                    {(['male', 'female'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setEditGender(g)}
                        className="flex-1 py-3 rounded-xl font-black text-sm uppercase transition-all"
                        style={{
                          background: editGender === g ? '#F14C38' : 'white',
                          color: editGender === g ? 'white' : 'rgba(26,15,10,0.45)',
                          border: `3px solid ${editGender === g ? '#1a0f0a' : 'rgba(26,15,10,0.15)'}`,
                          boxShadow: editGender === g ? '3px 3px 0 #1a0f0a' : '1px 1px 0 rgba(26,15,10,0.1)',
                        }}
                      >
                        {/* ✨ TRANSLATED */}
                        {g === 'male' 
                          ? (t.profile.subtitle.includes('Explorer') ? '👦 Male' : '👦 Laki-laki')
                          : (t.profile.subtitle.includes('Explorer') ? '👧 Female' : '👧 Perempuan')}
                      </button>
                    ))}
                  </div>
                </div>

                {saveError && (
                  <p className="text-sm font-bold px-4 py-2 rounded-xl"
                    style={{ background: 'rgba(241,76,56,0.1)', color: '#F14C38', border: '2px solid rgba(241,76,56,0.3)' }}>
                    ⚠️ {saveError}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 rounded-2xl font-black text-sm uppercase"
                    style={{ background: 'white', color: 'rgba(26,15,10,0.45)', border: '3px solid rgba(26,15,10,0.15)', transition: 'all 0.1s' }}
                  >
                    {/* ✨ TRANSLATED */}
                    {t.profile.subtitle.includes('Explorer') ? 'Cancel' : 'Batal'}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm uppercase"
                    style={{
                      background: isSaving ? 'rgba(241,76,56,0.5)' : '#F14C38',
                      color: 'white', border: '3px solid #1a0f0a',
                      boxShadow: '3px 3px 0 #1a0f0a', transition: 'all 0.1s'
                    }}
                    {...pressHandlers}
                  >
                    {isSaving
                      ? <Loader2 size={15} className="animate-spin" strokeWidth={3} />
                      : <Check size={15} strokeWidth={3} />}
                    {/* ✨ TRANSLATED */}
                    {isSaving 
                      ? (t.profile.subtitle.includes('Explorer') ? 'Saving...' : 'Menyimpan...')
                      : (t.profile.subtitle.includes('Explorer') ? 'Save' : 'Simpan')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════ STAT CARDS ════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {/* ✨ TRANSLATED */}
          {[
            { icon: <Star size={20} strokeWidth={3} />, label: t.profile.level, value: level, accent: '#FBBF24', emoji: '⭐' },
            { icon: <Zap  size={20} strokeWidth={3} />, label: t.profile.totalXP, value: xp, accent: '#F14C38', emoji: '⚡' },
            { icon: <MapPin size={20} strokeWidth={3}/>, label: t.profile.provinces, value: `${provincesCompleted}/${provincesUnlocked}`, accent: '#F14C38', emoji: '🗺️' },
            { icon: <Shield size={20} strokeWidth={3}/>, label: t.profile.badges, value: badgeCount, accent: '#1a0f0a', emoji: '🛡️' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="rounded-2xl p-4 flex flex-col items-center justify-center text-center"
              style={{
                background: 'white',
                border: '3px solid #1a0f0a',
                boxShadow: '4px 4px 0 #1a0f0a',
              }}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(26,15,10,0.4)' }}>
                {s.label}
              </p>
              <p className="text-2xl font-black leading-none" style={{ color: '#1a0f0a' }}>
                {statsLoading ? '—' : s.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ════════════ BADGES SECTION ════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#F14C38', border: '3px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a' }}>
              <Award size={16} className="text-white" strokeWidth={3} />
            </div>
            <div>
              {/* ✨ TRANSLATED */}
              <h2 className="text-lg font-black uppercase leading-none" style={{ color: '#1a0f0a' }}>
                {t.profile.badgeCollection}
              </h2>
              <p className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5" style={{ color: '#F14C38' }}>
                {badgeCount} {t.profile.subtitle.includes('Explorer') ? 'badges earned' : 'badge diraih'}
              </p>
            </div>
          </div>

          {badgesLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="animate-spin" style={{ color: '#F14C38' }} strokeWidth={3} />
                {/* ✨ TRANSLATED */}
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(26,15,10,0.4)' }}>
                  {t.profile.subtitle.includes('Explorer') ? 'Loading badges...' : 'Memuat badge...'}
                </span>
              </div>
            </div>
          ) : badges.length === 0 ? (
            <div className="rounded-[24px] p-10 flex flex-col items-center text-center"
              style={{
                background: 'white',
                border: '4px dashed rgba(26,15,10,0.15)',
              }}>
              <div className="text-5xl mb-3">🏆</div>
              {/* ✨ TRANSLATED */}
              <p className="font-black text-base uppercase" style={{ color: 'rgba(26,15,10,0.4)' }}>
                {t.profile.subtitle.includes('Explorer') ? 'No badges yet' : 'Belum ada badge'}
              </p>
              <p className="text-xs font-bold mt-1" style={{ color: 'rgba(26,15,10,0.3)' }}>
                {t.profile.subtitle.includes('Explorer') 
                  ? 'Complete quests in AxaraWorld to earn badges!'
                  : 'Selesaikan quest di AxaraWorld untuk mendapatkan badge!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((ub: any, i: number) => {
                const badge = ub.badge ?? ub;
                return (
                  <motion.div
                    key={ub.id ?? badge.id}
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ border: '3px solid #1a0f0a', boxShadow: '4px 4px 0 #1a0f0a', background: 'white' }}
                  >
                    {/* Top accent bar */}
                    <div style={{ height: '6px', background: 'linear-gradient(90deg, #F14C38, #FBBF24)' }} />

                    <div className="p-4 flex flex-col items-center text-center">
                      <div className="text-4xl mb-2">{badge.icon ?? '🏅'}</div>
                      <h3 className="font-black text-sm uppercase leading-tight mb-1" style={{ color: '#1a0f0a' }}>
                        {badge.name}
                      </h3>
                      <p className="text-[10px] font-bold leading-snug" style={{ color: 'rgba(26,15,10,0.5)' }}>
                        {badge.description}
                      </p>
                      <div className="mt-3 px-2.5 py-1 rounded-lg"
                        style={{ background: '#F4F1E0', border: '2px solid rgba(26,15,10,0.1)' }}>
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#F14C38' }}>
                          {ub.unlockedAt
                            ? new Date(ub.unlockedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Baru saja'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* ════════════ LOGOUT CONFIRM MODAL ════════════ */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-5"
            style={{ background: 'rgba(26,15,10,0.72)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="w-full max-w-sm rounded-[28px] overflow-hidden"
              style={{ background: '#F4F1E0', border: '5px solid #1a0f0a', boxShadow: '8px 8px 0 #1a0f0a' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal top bar */}
              <div className="px-6 py-4 flex items-center justify-between"
                style={{ background: '#F14C38', borderBottom: '4px solid #1a0f0a' }}>
                {/* ✨ TRANSLATED */}
                <span className="font-black uppercase tracking-widest text-sm text-white">
                  {t.profile.subtitle.includes('Explorer') ? 'Confirm Logout' : 'Konfirmasi Keluar'}
                </span>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)' }}>
                  <X size={15} strokeWidth={3} className="text-white" />
                </button>
              </div>

              <div className="p-6 text-center space-y-5">
                <div className="text-5xl">😢</div>
                <div>
                  {/* ✨ TRANSLATED */}
                  <p className="font-black text-lg uppercase" style={{ color: '#1a0f0a' }}>
                    {t.profile.subtitle.includes('Explorer') ? 'Are you sure you want to logout?' : 'Yakin ingin keluar?'}
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: 'rgba(26,15,10,0.5)' }}>
                    {t.profile.subtitle.includes('Explorer') 
                      ? 'Your adventure will be paused for a while...'
                      : 'Petualanganmu akan ditinggalkan sementara...'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-3 rounded-2xl font-black text-sm uppercase"
                    style={{
                      background: 'white', color: 'rgba(26,15,10,0.6)',
                      border: '3px solid rgba(26,15,10,0.2)',
                      transition: 'all 0.1s'
                    }}
                  >
                    {/* ✨ TRANSLATED */}
                    {t.profile.subtitle.includes('Explorer') ? 'Cancel' : 'Batal'}
                  </button>
                  <button
                    onClick={async () => { setShowLogoutConfirm(false); await logout(); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm uppercase"
                    style={{
                      background: '#F14C38', color: 'white',
                      border: '3px solid #1a0f0a',
                      boxShadow: '3px 3px 0 #1a0f0a',
                      transition: 'all 0.1s'
                    }}
                    {...pressHandlers}
                  >
                    {/* ✨ TRANSLATED */}
                    <LogOut size={14} strokeWidth={3} /> {t.profile.logout}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}