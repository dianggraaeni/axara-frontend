// src/hooks/useTranslation.ts
// Custom hook for multi-language support
// Usage: const { t, language, setLanguage } = useTranslation();

import { useState, useEffect } from 'react';

// ─── INLINE TYPES & CONFIG (No external import needed) ────────────────────
export type Language = 'id' | 'en';

interface Translations {
  common: { back: string; next: string; submit: string; reset: string; loading: string; done: string; };
  nav: { home: string; world: string; battle: string; verse: string; badge: string; profile: string; };
  quest: {
    title: string; subtitle: string; activeProvince: string; noProvince: string;
    backToMap: string; progressBadge: string; selectQuest: string; totalXP: string;
    perProvince: string; questsCompleted: string; unlockBadge: string;
    allComplete: string;
  };
  games: {
    guessTheCulture: { title: string; description: string; xpLabel: string; };
    memoryMatch: { title: string; description: string; xpLabel: string; };
    cultureSwipe: { title: string; description: string; xpLabel: string; };
    aksaraScramble: { title: string; description: string; xpLabel: string; };
  };
  gameStates: {
    loading: string; aiPreparing: string; correct: string; wrong: string;
    perfect: string; good: string; tryAgain: string; questComplete: string;
    xpEarned: string; xpSaved: string; playAgain: string;
    selectOtherGame: string; backToWorld: string;
  };
  badges: { live: string; new: string; completed: string; };
  feedback: {
    correct: string; incorrect: string; hint: string; tapToSelect: string;
    swipeLeft: string; swipeRight: string; myth: string; fact: string;
  };
  stats: { score: string; total: string; moves: string; pairs: string; accuracy: string; timeLeft: string; question: string; card: string; word: string; };
}

const translations: Record<Language, Translations> = {
  id: {
    common: { back: 'Kembali', next: 'Lanjut', submit: 'Kirim', reset: 'Reset', loading: 'Memuat', done: 'Selesai' },
    nav: { home: 'Beranda', world: 'AxaraWorld', battle: 'AxaraBattle', verse: 'AxaraVerse', badge: 'AxaraBadge', profile: 'Profil' },
    quest: {
      title: 'AXARA BATTLE', subtitle: 'Taklukkan Nusantara', activeProvince: 'Provinsi Aktif',
      noProvince: 'Belum ada provinsi', backToMap: 'Kembali ke AxaraWorld untuk memilih!',
      progressBadge: 'Progress Badge Master', selectQuest: 'Pilih Quest', totalXP: 'Total maks',
      perProvince: 'per provinsi', questsCompleted: 'Quest', unlockBadge: 'quest lagi untuk unlock Badge Master',
      allComplete: 'Semua quest selesai! Badge Master sudah kamu raih!',
    },
    games: {
      guessTheCulture: { title: 'Guess The Culture', description: 'Tebak budaya, makanan & tradisi lewat pertanyaan interaktif dari AI.', xpLabel: '+50 XP / soal' },
      memoryMatch: { title: 'Memory Match', description: 'Cocokkan pasangan budaya daerah dengan tepat dan secepat mungkin!', xpLabel: '+30 XP / pasang' },
      cultureSwipe: { title: 'Culture Swipe', description: 'Swipe kartu budaya: Mitos atau Fakta? Lebih seru dari Quizizz!', xpLabel: '+25 XP / kartu' },
      aksaraScramble: { title: 'Aksara Scramble', description: 'Susun huruf acak jadi nama budaya! Tebak dari clue AI yang diberikan.', xpLabel: '+15 XP / kata' },
    },
    gameStates: {
      loading: 'Memuat...', aiPreparing: 'AI Menyiapkan Soal', correct: 'Luar Biasa!', wrong: 'Kurang Tepat!',
      perfect: 'SEMPURNA!', good: 'BAGUS!', tryAgain: 'COBA LAGI!', questComplete: 'Quest Selesai',
      xpEarned: 'XP Diperoleh', xpSaved: 'XP sudah tersimpan ke profil', playAgain: 'Main Lagi',
      selectOtherGame: 'Pilih Game Lain', backToWorld: 'Kembali ke AxaraWorld',
    },
    badges: { live: 'Live', new: 'NEW', completed: 'Selesai' },
    feedback: { correct: 'Benar!', incorrect: 'Salah!', hint: 'Petunjuk', tapToSelect: 'Tap huruf untuk menyusun', swipeLeft: 'Mitos', swipeRight: 'Fakta', myth: 'MITOS', fact: 'FAKTA' },
    stats: { score: 'Skor', total: 'Total', moves: 'Langkah', pairs: 'Pasang', accuracy: 'Akurasi', timeLeft: 'Waktu', question: 'Soal', card: 'Kartu', word: 'Kata' },
  },
  en: {
    common: { back: 'Back', next: 'Next', submit: 'Submit', reset: 'Reset', loading: 'Loading', done: 'Done' },
    nav: { home: 'Home', world: 'AxaraWorld', battle: 'AxaraBattle', verse: 'AxaraVerse', badge: 'AxaraBadge', profile: 'Profile' },
    quest: {
      title: 'AXARA BATTLE', subtitle: 'Conquer Nusantara', activeProvince: 'Active Province',
      noProvince: 'No province selected', backToMap: 'Return to AxaraWorld to select!',
      progressBadge: 'Master Badge Progress', selectQuest: 'Select Quest', totalXP: 'Max total',
      perProvince: 'per province', questsCompleted: 'Quests', unlockBadge: 'more quests to unlock Master Badge',
      allComplete: 'All quests completed! Master Badge earned!',
    },
    games: {
      guessTheCulture: { title: 'Guess The Culture', description: 'Guess culture, food & traditions through interactive AI questions.', xpLabel: '+50 XP / question' },
      memoryMatch: { title: 'Memory Match', description: 'Match regional culture pairs accurately and as fast as possible!', xpLabel: '+30 XP / pair' },
      cultureSwipe: { title: 'Culture Swipe', description: 'Swipe culture cards: Myth or Fact? More fun than Quizizz!', xpLabel: '+25 XP / card' },
      aksaraScramble: { title: 'Aksara Scramble', description: 'Arrange scrambled letters into culture names! Guess from AI clues.', xpLabel: '+15 XP / word' },
    },
    gameStates: {
      loading: 'Loading...', aiPreparing: 'AI Preparing Questions', correct: 'Awesome!', wrong: 'Not Quite!',
      perfect: 'PERFECT!', good: 'GOOD JOB!', tryAgain: 'TRY AGAIN!', questComplete: 'Quest Complete',
      xpEarned: 'XP Earned', xpSaved: 'XP saved to profile', playAgain: 'Play Again',
      selectOtherGame: 'Select Other Game', backToWorld: 'Back to AxaraWorld',
    },
    badges: { live: 'Live', new: 'NEW', completed: 'Completed' },
    feedback: { correct: 'Correct!', incorrect: 'Wrong!', hint: 'Hint', tapToSelect: 'Tap letters to arrange', swipeLeft: 'Myth', swipeRight: 'Fact', myth: 'MYTH', fact: 'FACT' },
    stats: { score: 'Score', total: 'Total', moves: 'Moves', pairs: 'Pairs', accuracy: 'Accuracy', timeLeft: 'Time', question: 'Question', card: 'Card', word: 'Word' },
  },
};

const DEFAULT_LANGUAGE: Language = 'id';
const LANGUAGE_STORAGE_KEY = 'axara_language';

// ─── HOOK ──────────────────────────────────────────────────────────────────
export const useTranslation = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (saved === 'id' || saved === 'en') ? saved : DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const toggleLanguage = () => setLanguageState(prev => prev === 'id' ? 'en' : 'id');

  const t: Translations = translations[language];

  return { t, language, setLanguage, toggleLanguage };
};