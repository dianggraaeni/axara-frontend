// src/i18n/config.ts
// Multi-language configuration for AXARA
// Supports: Indonesian (ID) and English (EN)

export type Language = 'id' | 'en';

export interface Translations {
  // Common
  common: {
    back: string;
    next: string;
    submit: string;
    reset: string;
    loading: string;
    done: string;
    close: string;
    cancel: string;
    confirm: string;
    or: string;
  };

  // Navigation
  nav: {
    home: string;
    world: string;
    battle: string;
    verse: string;
    badge: string;
    profile: string;
  };

  // Landing Page
  landing: {
    title: string;
    subtitle: string;
    description: string;
    startButton: string;
    featuresButton: string;
  };

  // Games
  games: {
    guessTheCulture: {
      title: string;
      description: string;
      xpLabel: string;
    };
    memoryMatch: {
      title: string;
      description: string;
      xpLabel: string;
    };
    cultureSwipe: {
      title: string;
      description: string;
      xpLabel: string;
    };
    aksaraScramble: {
      title: string;
      description: string;
      xpLabel: string;
    };
  };

  // Quest Page
  quest: {
    title: string;
    subtitle: string;
    activeProvince: string;
    noProvince: string;
    backToMap: string;
    progressBadge: string;
    selectQuest: string;
    totalXP: string;
    perProvince: string;
    questsCompleted: string;
    unlockBadge: string;
    allComplete: string;
    badgeEarned: string;
  };

  // Game States
  gameStates: {
    loading: string;
    preparing: string;
    aiPreparing: string;
    correct: string;
    wrong: string;
    awesome: string;
    tryAgain: string;
    perfect: string;
    good: string;
    gameOver: string;
    questComplete: string;
    xpEarned: string;
    xpSaved: string;
    playAgain: string;
    selectOtherGame: string;
    backToWorld: string;
  };

  // Badges
  badges: {
    live: string;
    new: string;
    completed: string;
    locked: string;
    master: string;
  };

  // Feedback
  feedback: {
    correct: string;
    incorrect: string;
    timeout: string;
    hint: string;
    explanation: string;
    tapToSelect: string;
    swipeLeft: string;
    swipeRight: string;
    myth: string;
    fact: string;
  };

  // Stats
  stats: {
    score: string;
    total: string;
    moves: string;
    pairs: string;
    accuracy: string;
    timeLeft: string;
    question: string;
    card: string;
    word: string;
  };
}

export const translations: Record<Language, Translations> = {
  id: {
    common: {
      back: 'Kembali',
      next: 'Lanjut',
      submit: 'Kirim',
      reset: 'Reset',
      loading: 'Memuat',
      done: 'Selesai',
      close: 'Tutup',
      cancel: 'Batal',
      confirm: 'Konfirmasi',
      or: 'atau',
    },

    nav: {
      home: 'Beranda',
      world: 'AxaraWorld',
      battle: 'AxaraBattle',
      verse: 'AxaraVerse',
      badge: 'AxaraBadge',
      profile: 'Profil',
    },

    landing: {
      title: 'Jelajahi Budaya Abadi Nusantara',
      subtitle: 'Petualangan Gamifikasi Budaya Indonesia',
      description: 'AXARA adalah platform gamifikasi di mana Anda menjelajahi budaya Indonesia melalui peta interaktif, quest, dan cerita berbasis AI.',
      startButton: 'Mulai Menjelajah',
      featuresButton: 'Lihat Fitur',
    },

    games: {
      guessTheCulture: {
        title: 'Guess The Culture',
        description: 'Tebak budaya, makanan & tradisi lewat pertanyaan interaktif dari AI.',
        xpLabel: '+50 XP / soal',
      },
      memoryMatch: {
        title: 'Memory Match',
        description: 'Cocokkan pasangan budaya daerah dengan tepat dan secepat mungkin!',
        xpLabel: '+30 XP / pasang',
      },
      cultureSwipe: {
        title: 'Culture Swipe',
        description: 'Swipe kartu budaya: Mitos atau Fakta? Lebih seru dari Quizizz!',
        xpLabel: '+25 XP / kartu',
      },
      aksaraScramble: {
        title: 'Aksara Scramble',
        description: 'Susun huruf acak jadi nama budaya! Tebak dari clue AI yang diberikan.',
        xpLabel: '+15 XP / kata',
      },
    },

    quest: {
      title: 'AXARA BATTLE',
      subtitle: 'Taklukkan Nusantara',
      activeProvince: 'Provinsi Aktif',
      noProvince: 'Belum ada provinsi',
      backToMap: 'Kembali ke AxaraWorld untuk memilih!',
      progressBadge: 'Progress Badge Master',
      selectQuest: 'Pilih Quest',
      totalXP: 'Total maks',
      perProvince: 'per provinsi',
      questsCompleted: 'Quest',
      unlockBadge: 'quest lagi untuk unlock Badge Master',
      allComplete: 'Semua quest selesai! Badge Master sudah kamu raih!',
      badgeEarned: 'Badge Master sudah kamu raih!',
    },

    gameStates: {
      loading: 'Memuat...',
      preparing: 'Menyiapkan',
      aiPreparing: 'AI Menyiapkan Soal',
      correct: 'Luar Biasa!',
      wrong: 'Kurang Tepat!',
      awesome: 'SEMPURNA!',
      tryAgain: 'COBA LAGI!',
      perfect: 'SEMPURNA!',
      good: 'BAGUS!',
      gameOver: 'Game Selesai',
      questComplete: 'Quest Selesai',
      xpEarned: 'XP Diperoleh',
      xpSaved: 'XP sudah tersimpan ke profil',
      playAgain: 'Main Lagi',
      selectOtherGame: 'Pilih Game Lain',
      backToWorld: 'Kembali ke AxaraWorld',
    },

    badges: {
      live: 'Live',
      new: 'NEW',
      completed: 'Selesai',
      locked: 'Terkunci',
      master: 'Master',
    },

    feedback: {
      correct: 'Benar!',
      incorrect: 'Salah!',
      timeout: 'Waktu Habis!',
      hint: 'Petunjuk',
      explanation: 'Penjelasan',
      tapToSelect: 'Tap huruf untuk menyusun',
      swipeLeft: 'Mitos',
      swipeRight: 'Fakta',
      myth: 'MITOS',
      fact: 'FAKTA',
    },

    stats: {
      score: 'Skor',
      total: 'Total',
      moves: 'Langkah',
      pairs: 'Pasang',
      accuracy: 'Akurasi',
      timeLeft: 'Waktu',
      question: 'Soal',
      card: 'Kartu',
      word: 'Kata',
    },
  },

  en: {
    common: {
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      reset: 'Reset',
      loading: 'Loading',
      done: 'Done',
      close: 'Close',
      cancel: 'Cancel',
      confirm: 'Confirm',
      or: 'or',
    },

    nav: {
      home: 'Home',
      world: 'AxaraWorld',
      battle: 'AxaraBattle',
      verse: 'AxaraVerse',
      badge: 'AxaraBadge',
      profile: 'Profile',
    },

    landing: {
      title: 'Explore the Eternal Culture of Nusantara',
      subtitle: 'Indonesian Culture Gamification Adventure',
      description: 'AXARA is a gamification platform where you explore Indonesian culture through interactive maps, quests, and AI-based stories.',
      startButton: 'Start Exploring',
      featuresButton: 'View Features',
    },

    games: {
      guessTheCulture: {
        title: 'Guess The Culture',
        description: 'Guess culture, food & traditions through interactive AI questions.',
        xpLabel: '+50 XP / question',
      },
      memoryMatch: {
        title: 'Memory Match',
        description: 'Match regional culture pairs accurately and as fast as possible!',
        xpLabel: '+30 XP / pair',
      },
      cultureSwipe: {
        title: 'Culture Swipe',
        description: 'Swipe culture cards: Myth or Fact? More fun than Quizizz!',
        xpLabel: '+25 XP / card',
      },
      aksaraScramble: {
        title: 'Aksara Scramble',
        description: 'Arrange scrambled letters into culture names! Guess from AI clues.',
        xpLabel: '+15 XP / word',
      },
    },

    quest: {
      title: 'AXARA BATTLE',
      subtitle: 'Conquer Nusantara',
      activeProvince: 'Active Province',
      noProvince: 'No province selected',
      backToMap: 'Return to AxaraWorld to select!',
      progressBadge: 'Master Badge Progress',
      selectQuest: 'Select Quest',
      totalXP: 'Max total',
      perProvince: 'per province',
      questsCompleted: 'Quests',
      unlockBadge: 'more quests to unlock Master Badge',
      allComplete: 'All quests completed! Master Badge earned!',
      badgeEarned: 'Master Badge earned!',
    },

    gameStates: {
      loading: 'Loading...',
      preparing: 'Preparing',
      aiPreparing: 'AI Preparing Questions',
      correct: 'Awesome!',
      wrong: 'Not Quite!',
      awesome: 'PERFECT!',
      tryAgain: 'TRY AGAIN!',
      perfect: 'PERFECT!',
      good: 'GOOD JOB!',
      gameOver: 'Game Over',
      questComplete: 'Quest Complete',
      xpEarned: 'XP Earned',
      xpSaved: 'XP saved to profile',
      playAgain: 'Play Again',
      selectOtherGame: 'Select Other Game',
      backToWorld: 'Back to AxaraWorld',
    },

    badges: {
      live: 'Live',
      new: 'NEW',
      completed: 'Completed',
      locked: 'Locked',
      master: 'Master',
    },

    feedback: {
      correct: 'Correct!',
      incorrect: 'Wrong!',
      timeout: 'Time Out!',
      hint: 'Hint',
      explanation: 'Explanation',
      tapToSelect: 'Tap letters to arrange',
      swipeLeft: 'Myth',
      swipeRight: 'Fact',
      myth: 'MYTH',
      fact: 'FACT',
    },

    stats: {
      score: 'Score',
      total: 'Total',
      moves: 'Moves',
      pairs: 'Pairs',
      accuracy: 'Accuracy',
      timeLeft: 'Time',
      question: 'Question',
      card: 'Card',
      word: 'Word',
    },
  },
};

// Default language
export const DEFAULT_LANGUAGE: Language = 'id';

// Language storage key
export const LANGUAGE_STORAGE_KEY = 'axara_language';