import { useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface Translations {
  common: {
    back: string;
    next: string;
    submit: string;
    reset: string;
    loading: string;
    save: string;
    edit: string;
    delete: string;
    search: string;
    cancel: string;
    confirm: string;
    close: string;
    yes: string;
    no: string;
  };
  nav: {
    home: string;
    world: string;
    battle: string;
    verse: string;
    badge: string;
    profile: string;
    login: string;
    logout: string;
  };
  landing: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      ctaStart: string;
      ctaLearn: string;
    };
    features: {
      title: string;
      world: {
        title: string;
        desc: string;
      };
      battle: {
        title: string;
        desc: string;
      };
      verse: {
        title: string;
        desc: string;
      };
      badge: {
        title: string;
        desc: string;
      };
    };
    stats: {
      provinces: string;
      games: string;
      users: string;
    };
    testimonials: {
      title: string;
    };
    faq: {
      title: string;
    };
    contact: {
      title: string;
      name: string;
      email: string;
      message: string;
      send: string;
    };
  };
  world: {
    title: string;
    subtitle: string;
    search: string;
    explore: string;
    locked: string;
    completed: string;
    inProgress: string;
    provinceInfo: string;
  };
  quest: {
    title: string;
    subtitle: string;
    province: string;
    selectProvince: string;
    badgeProgress: string;
    gamesCompleted: string;
    startGame: string;
    continueGame: string;
    playAgain: string;
    finish: string;
    questComplete: string;
    xpEarned: string;
  };
  games: {
    guess: {
      title: string;
      desc: string;
      xpLabel: string;
    };
    memory: {
      title: string;
      desc: string;
      xpLabel: string;
    };
    swipe: {
      title: string;
      desc: string;
      xpLabel: string;
    };
    aksara: {
      title: string;
      desc: string;
      xpLabel: string;
    };
  };
  chat: {
    placeholder: string;
    send: string;
    thinking: string;
    greeting: string;
    example1: string;
    example2: string;
    example3: string;
    example4: string;
  };
  profile: {
    title: string;
    subtitle: string;
    level: string;
    totalXP: string;
    provinces: string;
    badges: string;
    streak: string;
    editProfile: string;
    logout: string;
    badgeCollection: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    username: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    loginButton: string;
    registerButton: string;
  };
  errors: {
    generic: string;
    network: string;
    notFound: string;
    unauthorized: string;
    server: string;
    validation: string;
  };
  stats: {
    score: string;
    moves: string;
    time: string;
    accuracy: string;
    rank: string;
    level: string;
    xp: string;
    badges: string;
    completed: string;
    inProgress: string;
    locked: string;
  };
  gameStates: {
    loading: string;
    ready: string;
    playing: string;
    paused: string;
    finished: string;
    correct: string;
    wrong: string;
    perfect: string;
    goodJob: string;
    tryAgain: string;
    almostThere: string;
    gameOver: string;
    youWin: string;
    newRecord: string;
  };
  badges: {
    new: string;
    live: string;
    completed: string;
    locked: string;
    master: string;
  };
  feedback: {
    correct: string;
    incorrect: string;
    hint: string;
    swipeRight: string;
    swipeLeft: string;
    match: string;
    noMatch: string;
    excellent: string;
  };
}

const translations: Record<Language, Translations> = {
  id: {
    common: {
      back: 'Kembali',
      next: 'Lanjut',
      submit: 'Kirim',
      reset: 'Reset',
      loading: 'Memuat...',
      save: 'Simpan',
      edit: 'Edit',
      delete: 'Hapus',
      search: 'Cari',
      cancel: 'Batal',
      confirm: 'Konfirmasi',
      close: 'Tutup',
      yes: 'Ya',
      no: 'Tidak',
    },
    nav: {
      home: 'Beranda',
      world: 'Dunia',
      battle: 'Pertempuran',
      verse: 'Cerita',
      badge: 'Lencana',
      profile: 'Profil',
      login: 'Masuk',
      logout: 'Keluar',
    },
    landing: {
      hero: {
        title: 'Jelajahi Budaya Abadi Nusantara',
        subtitle: 'Petualangan Budaya',
        description: 'AXARA adalah platform gamifikasi di mana Anda menjelajahi budaya Indonesia melalui peta interaktif, quest, dan cerita berbasis AI.',
        ctaStart: 'Mulai Menjelajah',
        ctaLearn: 'Lihat Fitur',
      },
      features: {
        title: 'Petualangan Budaya Interaktif',
        world: {
          title: 'AxaraWorld — Peta Eksplorasi',
          desc: 'Buka peta Indonesia, klik provinsi, dan temukan budaya seperti rumah adat, makanan, pakaian, alat musik, hingga sejarah singkat.',
        },
        battle: {
          title: 'AxaraBattle — Mini Games',
          desc: 'Uji pengetahuanmu di 4 game seru: Culture Memory Match, Guess The Culture, Province Puzzle, dan Aksara Scramble.',
        },
        verse: {
          title: 'AxaraVerse — Cerita AI',
          desc: 'Tanya AI tentang sejarah budaya atau mainkan mode "Story Adventure" di mana kamu menjadi karakter cerita interaktif.',
        },
        badge: {
          title: 'AxaraBadge — Sistem Progress',
          desc: 'Kumpulkan XP dari menjelajah provinsi, menyelesaikan game, dan membaca budaya. Koleksi badge dari seluruh Nusantara!',
        },
      },
      stats: {
        provinces: 'Provinsi',
        games: 'Game',
        users: 'Pengguna',
      },
      testimonials: {
        title: 'Kata Penjelajah',
      },
      faq: {
        title: 'Pertanyaan yang Sering Diajukan',
      },
      contact: {
        title: 'Hubungi Kami',
        name: 'Nama Anda',
        email: 'Email Anda',
        message: 'Pesan Anda',
        send: 'Kirim Pesan',
      },
    },
    world: {
      title: 'AXARA WORLD',
      subtitle: 'Jelajahi Nusantara',
      search: 'Cari provinsi...',
      explore: 'Jelajahi',
      locked: 'Terkunci',
      completed: 'Selesai',
      inProgress: 'Saat Ini',
      provinceInfo: 'Info Provinsi',
    },
    quest: {
      title: 'QUEST BUDAYA',
      subtitle: 'Petualangan Nusantara',
      province: 'Provinsi',
      selectProvince: 'Pilih Provinsi',
      badgeProgress: 'Progress Badge',
      gamesCompleted: 'Game Selesai',
      startGame: 'Mulai Game',
      continueGame: 'Lanjutkan',
      playAgain: 'Main Lagi',
      finish: 'Selesai',
      questComplete: 'Quest Selesai!',
      xpEarned: 'XP Didapat',
    },
    games: {
      guess: {
        title: 'Tebak Budaya',
        desc: 'Tebak nama budaya dari gambar yang ditampilkan',
        xpLabel: '125 XP',
      },
      memory: {
        title: 'Kartu Memori',
        desc: 'Cocokkan pasangan kartu budaya yang sama',
        xpLabel: '125 XP',
      },
      swipe: {
        title: 'Geser Provinsi',
        desc: 'Geser kartu ke provinsi yang benar',
        xpLabel: '150 XP',
      },
      aksara: {
        title: 'Susun Aksara',
        desc: 'Susun huruf aksara menjadi kata yang benar',
        xpLabel: '125 XP',
      },
    },
    chat: {
      placeholder: 'Tanya tentang budaya Indonesia...',
      send: 'Kirim',
      thinking: 'Berpikir...',
      greeting: 'Halo! Tanya aku tentang budaya Indonesia.',
      example1: 'Ceritakan tentang Borobudur',
      example2: 'Apa makanan khas Jawa Barat?',
      example3: 'Jelaskan filosofi batik',
      example4: 'Sejarah Wayang Kulit',
    },
    profile: {
      title: 'PROFIL KU',
      subtitle: 'Petualang Nusantara',
      level: 'Level',
      totalXP: 'Total XP',
      provinces: 'Provinsi',
      badges: 'Badges',
      streak: 'Streak',
      editProfile: 'Edit Profil',
      logout: 'Keluar',
      badgeCollection: 'Koleksi Badge',
    },
    auth: {
      login: 'Masuk',
      register: 'Daftar',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      forgotPassword: 'Lupa Password?',
      noAccount: 'Belum punya akun?',
      hasAccount: 'Sudah punya akun?',
      loginButton: 'Masuk',
      registerButton: 'Daftar',
    },
    errors: {
      generic: 'Terjadi kesalahan',
      network: 'Koneksi internet bermasalah',
      notFound: 'Tidak ditemukan',
      unauthorized: 'Tidak memiliki akses',
      server: 'Server bermasalah',
      validation: 'Data tidak valid',
    },
    stats: {
      score: 'Skor',
      moves: 'Langkah',
      time: 'Waktu',
      accuracy: 'Akurasi',
      rank: 'Peringkat',
      level: 'Level',
      xp: 'XP',
      badges: 'Badge',
      completed: 'Selesai',
      inProgress: 'Sedang Berjalan',
      locked: 'Terkunci',
    },
    gameStates: {
      loading: 'Memuat game...',
      ready: 'Siap!',
      playing: 'Bermain',
      paused: 'Dijeda',
      finished: 'Selesai',
      correct: 'Benar!',
      wrong: 'Salah!',
      perfect: 'Sempurna!',
      goodJob: 'Bagus!',
      tryAgain: 'Coba Lagi',
      almostThere: 'Hampir!',
      gameOver: 'Game Berakhir',
      youWin: 'Kamu Menang!',
      newRecord: 'Rekor Baru!',
    },
    badges: {
      new: 'Baru',
      live: 'Aktif',
      completed: 'Selesai',
      locked: 'Terkunci',
      master: 'Master',
    },
    feedback: {
      correct: 'Jawaban benar!',
      incorrect: 'Coba lagi!',
      hint: 'Petunjuk',
      swipeRight: 'Geser kanan jika benar',
      swipeLeft: 'Geser kiri jika salah',
      match: 'Cocok!',
      noMatch: 'Tidak cocok',
      excellent: 'Luar biasa!',
    },
  },
  en: {
    common: {
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      reset: 'Reset',
      loading: 'Loading...',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
    },
    nav: {
      home: 'Home',
      world: 'World',
      battle: 'Battle',
      verse: 'Verse',
      badge: 'Badge',
      profile: 'Profile',
      login: 'Login',
      logout: 'Logout',
    },
    landing: {
      hero: {
        title: 'Explore the Eternal Culture of Nusantara',
        subtitle: 'Cultural Adventure',
        description: 'AXARA is a gamification platform where you explore Indonesian culture through interactive maps, quests, and AI-powered stories.',
        ctaStart: 'Start Exploring',
        ctaLearn: 'Learn More',
      },
      features: {
        title: 'Interactive Cultural Adventure',
        world: {
          title: 'AxaraWorld — Exploration Map',
          desc: 'Open the Indonesia map, click on provinces, and discover cultures like traditional houses, food, clothing, musical instruments, and brief history.',
        },
        battle: {
          title: 'AxaraBattle — Mini Games',
          desc: 'Test your knowledge in 4 fun games: Culture Memory Match, Guess The Culture, Province Puzzle, and Aksara Scramble.',
        },
        verse: {
          title: 'AxaraVerse — AI Story',
          desc: 'Ask AI about cultural history or play "Story Adventure" mode where you become a character in an interactive story.',
        },
        badge: {
          title: 'AxaraBadge — Progress System',
          desc: 'Collect XP from exploring provinces, completing games, and learning about culture. Collect badges from all of Nusantara!',
        },
      },
      stats: {
        provinces: 'Provinces',
        games: 'Games',
        users: 'Users',
      },
      testimonials: {
        title: 'Explorer Stories',
      },
      faq: {
        title: 'Frequently Asked Questions',
      },
      contact: {
        title: 'Contact Us',
        name: 'Your Name',
        email: 'Your Email',
        message: 'Your Message',
        send: 'Send Message',
      },
    },
    world: {
      title: 'AXARA WORLD',
      subtitle: 'Explore Nusantara',
      search: 'Search province...',
      explore: 'Explore',
      locked: 'Locked',
      completed: 'Completed',
      inProgress: 'In Progress',
      provinceInfo: 'Province Info',
    },
    quest: {
      title: 'CULTURE QUEST',
      subtitle: 'Nusantara Adventure',
      province: 'Province',
      selectProvince: 'Select Province',
      badgeProgress: 'Badge Progress',
      gamesCompleted: 'Games Completed',
      startGame: 'Start Game',
      continueGame: 'Continue',
      playAgain: 'Play Again',
      finish: 'Finish',
      questComplete: 'Quest Complete!',
      xpEarned: 'XP Earned',
    },
    games: {
      guess: {
        title: 'Guess The Culture',
        desc: 'Guess the culture name from the displayed image',
        xpLabel: '125 XP',
      },
      memory: {
        title: 'Memory Cards',
        desc: 'Match pairs of the same culture cards',
        xpLabel: '125 XP',
      },
      swipe: {
        title: 'Province Swipe',
        desc: 'Swipe cards to the correct province',
        xpLabel: '150 XP',
      },
      aksara: {
        title: 'Aksara Scramble',
        desc: 'Arrange aksara letters into the correct word',
        xpLabel: '125 XP',
      },
    },
    chat: {
      placeholder: 'Ask about Indonesian culture...',
      send: 'Send',
      thinking: 'Thinking...',
      greeting: 'Hello! Ask me about Indonesian culture.',
      example1: 'Tell me about Borobudur',
      example2: 'What is West Java\'s signature food?',
      example3: 'Explain batik philosophy',
      example4: 'Wayang Kulit history',
    },
    profile: {
      title: 'MY PROFILE',
      subtitle: 'Nusantara Explorer',
      level: 'Level',
      totalXP: 'Total XP',
      provinces: 'Provinces',
      badges: 'Badges',
      streak: 'Streak',
      editProfile: 'Edit Profile',
      logout: 'Logout',
      badgeCollection: 'Badge Collection',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      forgotPassword: 'Forgot Password?',
      noAccount: 'Don\'t have an account?',
      hasAccount: 'Already have an account?',
      loginButton: 'Login',
      registerButton: 'Register',
    },
    errors: {
      generic: 'An error occurred',
      network: 'Network connection problem',
      notFound: 'Not found',
      unauthorized: 'Unauthorized access',
      server: 'Server error',
      validation: 'Invalid data',
    },
    stats: {
      score: 'Score',
      moves: 'Moves',
      time: 'Time',
      accuracy: 'Accuracy',
      rank: 'Rank',
      level: 'Level',
      xp: 'XP',
      badges: 'Badges',
      completed: 'Completed',
      inProgress: 'In Progress',
      locked: 'Locked',
    },
    gameStates: {
      loading: 'Loading game...',
      ready: 'Ready!',
      playing: 'Playing',
      paused: 'Paused',
      finished: 'Finished',
      correct: 'Correct!',
      wrong: 'Wrong!',
      perfect: 'Perfect!',
      goodJob: 'Good Job!',
      tryAgain: 'Try Again',
      almostThere: 'Almost!',
      gameOver: 'Game Over',
      youWin: 'You Win!',
      newRecord: 'New Record!',
    },
    badges: {
      new: 'New',
      live: 'Live',
      completed: 'Completed',
      locked: 'Locked',
      master: 'Master',
    },
    feedback: {
      correct: 'Correct answer!',
      incorrect: 'Try again!',
      hint: 'Hint',
      swipeRight: 'Swipe right if correct',
      swipeLeft: 'Swipe left if wrong',
      match: 'Match!',
      noMatch: 'No match',
      excellent: 'Excellent!',
    },
  },
};

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('axara_language');
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });

  useEffect(() => {
    localStorage.setItem('axara_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'id' ? 'en' : 'id');
  };

  return {
    t: translations[language],
    language,
    setLanguage,
    toggleLanguage,
  };
}