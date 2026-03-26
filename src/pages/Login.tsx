// src/pages/Login.tsx
// Halaman Login & Register dengan sistem multi-bahasa terintegrasi.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';

type Tab = 'login' | 'register';

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export default function LoginPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const passwordHint =
    t?.common?.back === 'Back'
      ? 'Min. 8 characters, letters and numbers'
      : 'Min. 8 karakter, kombinasi huruf dan angka';

  const handleSubmit = async () => {
    // Validasi Dasar menggunakan teks dari config
    if (!email || !password) {
      setError(t.auth.errorRequired);
      return;
    }
    if (tab === 'register' && !username) {
      setError(t.auth.usernamePlaceholder);
      return;
    }

    if (tab === 'register' && !PASSWORD_RULE.test(password)) {
      setError(passwordHint);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(email, username, password, gender);
      }
      navigate('/app');
    } catch (e: any) {
      // Mengambil error dari server jika ada, jika tidak pakai error generic dari config
      setError(e?.response?.data?.error ?? t.auth.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {/* Background pattern dekoratif */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border-4 border-white/20"
      >
        {/* Language Switcher di pojok kanan atas kartu */}
        <div className="absolute top-4 right-4">
          <LanguageSwitcher variant="minimal" />
        </div>

        {/* Logo Axara */}
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center group">
          <div className="w-12 h-12 overflow-hidden">
            <img src="/logo.png" alt="Axara" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-black text-3xl text-primary tracking-tight">AXARA</span>
        </Link>

        {/* Tab Switcher (Masuk / Daftar) */}
        <div className="flex bg-cream rounded-2xl p-1 mb-8">
          {(['login', 'register'] as Tab[]).map((tabType) => (
            <button
              key={tabType}
              onClick={() => {
                setTab(tabType);
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === tabType ? 'bg-white text-primary shadow-sm' : 'text-text-light'
              }`}
            >
              {tabType === 'login' ? t.auth.login : t.auth.register}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Alert Error */}
            {error && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm font-medium"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Field Email */}
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="email"
                placeholder={t.auth.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full pl-11 pr-4 py-3.5 bg-cream border-2 border-cream-dark rounded-xl focus:border-primary focus:outline-none font-medium text-text placeholder:text-text-light transition-colors"
              />
            </div>

            {/* Field Username (Hanya muncul saat Register) */}
            {tab === 'register' && (
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="text"
                  placeholder={t.auth.usernamePlaceholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-cream border-2 border-cream-dark rounded-xl focus:border-primary focus:outline-none font-medium text-text placeholder:text-text-light transition-colors"
                />
              </div>
            )}

            {/* Field Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder={t.auth.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full pl-11 pr-12 py-3.5 bg-cream border-2 border-cream-dark rounded-xl focus:border-primary focus:outline-none font-medium text-text placeholder:text-text-light transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password hint khusus register */}
            {tab === 'register' && (
              <p className="text-xs font-semibold px-1 -mt-2" style={{ color: 'rgba(26,15,10,0.45)' }}>
                Min. 8 karakter, kombinasi huruf dan angka
              </p>
            )}

            {/* Pemilihan Gender (Hanya muncul saat Register) */}
            {tab === 'register' && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-text-light px-1">{t.auth.gender}</p>
                <div className="flex gap-3">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                        gender === g
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-cream-dark text-text-light hover:bg-cream'
                      }`}
                    >
                      {g === 'male' ? t.auth.male : t.auth.female}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tombol Submit Utama */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-hover disabled:opacity-60 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <Loader2 size={20} className="animate-spin" />}
              {tab === 'login' ? t.auth.loginButton : t.auth.registerButton}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Footer Link untuk pindah tab */}
        <p className="text-center text-sm text-text-light font-medium mt-6">
          {tab === 'login' ? t.auth.noAccount : t.auth.hasAccount}{' '}
          <button
            onClick={() => {
              setTab(tab === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-primary font-bold hover:underline"
          >
            {tab === 'login' ? t.auth.registerLink : t.auth.login}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
