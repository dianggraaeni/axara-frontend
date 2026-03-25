// src/i18n/config.ts

export type Language = 'id' | 'en';

export interface Translations {
  common: {
    back: string; next: string; submit: string; reset: string;
    loading: string; done: string; close: string; cancel: string;
    confirm: string; or: string; day: string; edit: string; // ✨ Added edit
  };
  nav: {
    home: string; world: string; battle: string; verse: string;
    badge: string; profile: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    username: string;
    usernamePlaceholder: string;
    loginButton: string;
    registerButton: string;
    noAccount: string;
    hasAccount: string;
    registerLink: string;
    gender: string;
    male: string;
    female: string;
    errorRequired: string;
    errorGeneric: string;
  };
  landing: {
    hero: {
      title: string;
      description: string;
      ctaStart: string;
      ctaLearn: string;
      welcome: string;
    };
    features: {
      title: string;
      world: { title: string; desc: string };
      battle: { title: string; desc: string };
      verse: { title: string; desc: string };
      badge: { title: string; desc: string };
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
  // ✨ TAMBAHAN UNTUK MAP & QUEST
  world: {
    title: string;
    subtitle: string;
    inProgress: string;
    completed: string;
    locked: string;
    provinceInfo: string;
  };
  games: {
    guessTheCulture: { title: string; description: string; xpLabel: string };
    memoryMatch: { title: string; description: string; xpLabel: string };
    cultureSwipe: { title: string; description: string; xpLabel: string };
    aksaraScramble: { title: string; description: string; xpLabel: string };
  };
  badges: { live: string; new: string; completed: string };
  quest: {
    title: string;
    subtitle: string;
    activeProvince: string;
    questsCompleted: string;
    noProvince: string;
    backToMap: string;
    progressBadge: string;
    allComplete: string;
    unlockBadge: string;
    selectQuest: string;
    totalXP: string;
    perProvince: string;
  };
  // ✨ TAMBAHAN UNTUK VERSE & PROFILE
  verse: {
    title: string;
    subtitle: string;
    greeting: string;
    placeholder: string;
    suggestTitle: string;
    suggestHistory: string;
    suggestTradition: string;
    suggestFood: string;
    suggestMusic: string;
  };
  profile: {
    title: string;
    subtitle: string; // ✨ Added
    level: string;
    xp: string;
    totalXP: string; // ✨ Added
    provinces: string; // ✨ Added
    badges: string; // ✨ Added
    badgeCollection: string; // ✨ Added
    totalBadges: string;
    badgesSection: string;
    noBadges: string;
    logout: string;
    editProfile: string;
  };
}

export const translations: Record<Language, Translations> = {
  id: {
    common: {
      back: 'Kembali', next: 'Lanjut', submit: 'Kirim', reset: 'Reset',
      loading: 'Memuat', done: 'Selesai', close: 'Tutup', cancel: 'Batal',
      confirm: 'Konfirmasi', or: 'atau', day: 'Hari', edit: 'Edit'
    },
    nav: {
      home: 'Beranda', world: 'AxaraWorld', battle: 'AxaraBattle',
      verse: 'AxaraVerse', badge: 'AxaraBadge', profile: 'Profil'
    },
    auth: {
      login: 'Masuk', register: 'Daftar', email: 'Email', password: 'Kata Sandi',
      username: 'Nama Pengguna', usernamePlaceholder: 'Username (min. 3 karakter)',
      loginButton: 'Masuk ke Akun', registerButton: 'Buat Akun',
      noAccount: 'Belum punya akun?', hasAccount: 'Sudah punya akun?',
      registerLink: 'Daftar sekarang', gender: 'Jenis Kelamin',
      male: '👦 Laki-laki', female: '👧 Perempuan',
      errorRequired: 'Email dan password wajib diisi.', errorGeneric: 'Terjadi kesalahan. Coba lagi.',
    },
    landing: {
      hero: {
        title: 'Jelajahi Budaya Abadi Nusantara',
        description: 'AXARA adalah platform gamifikasi edukasi yang mengajak pengguna menjelajahi budaya Indonesia melalui peta interaktif, mini-games, dan AI storytelling.',
        ctaStart: 'Mulai Menjelajah', ctaLearn: 'Lihat Fitur', welcome: 'Selamat Datang!',
      },
    features: {
      title: 'Fitur Utama',
      world: { 
        title: 'AxaraWorld', 
        desc: 'Jelajahi budaya Nusantara lewat peta interaktif dengan cara yang seru dan mudah dipahami.' 
      },
      battle: { 
        title: 'AxaraBattle', 
        desc: 'Uji pengetahuan budaya kamu lewat berbagai mini-games seru seperti bermain game.' 
      },
      verse: { 
        title: 'AxaraVerse', 
        desc: 'Tanya budaya ke AI dan jelajahi cerita sejarah lewat storytelling interaktif.' 
      },
      badge: { 
        title: 'AxaraBadge', 
        desc: 'Kumpulkan XP dan badge, lalu naik peringkat sebagai penjelajah budaya.' 
      },
    },
      faq: { title: 'Pertanyaan Sering Diajukan' },
      contact: { title: 'Hubungi Kami', name: 'Nama Anda', email: 'Email Anda', message: 'Pesan Anda', send: 'Kirim Pesan' }
    },
    world: {
      title: 'AXARA WORLD',
      subtitle: 'Jelajahi Nusantara',
      inProgress: 'Sedang Berjalan',
      completed: 'Selesai',
      locked: 'Terkunci',
      provinceInfo: 'Informasi Provinsi',
    },
    games: {
      guessTheCulture: { title: 'Tebak Budaya', description: 'Uji pengetahuan tradisi daerah.', xpLabel: '50 XP / Soal' },
      memoryMatch: { title: 'Memory Match', description: 'Cocokkan istilah dan deskripsi.', xpLabel: '30 XP / Pasang' },
      cultureSwipe: { title: 'Culture Swipe', description: 'Geser Mitos atau Fakta.', xpLabel: '25 XP / Kartu' },
      aksaraScramble: { title: 'Aksara Scramble', description: 'Susun kata budaya Nusantara.', xpLabel: '15 XP / Kata' },
    },
    badges: { live: 'LIVE', new: 'BARU', completed: 'SELESAI' },
    quest: {
      title: 'AXARA BATTLE',
      subtitle: 'Uji Pengetahuanmu',
      activeProvince: 'Provinsi Aktif',
      questsCompleted: 'Quest Selesai',
      noProvince: 'Pilih provinsi di',
      backToMap: 'untuk memulai',
      progressBadge: 'Progres Badge',
      allComplete: 'Semua quest selesai!',
      unlockBadge: 'Lagi untuk Badge',
      selectQuest: 'Pilih Tantangan',
      totalXP: 'Total Potensi',
      perProvince: 'per Provinsi',
    },
    verse: {
      title: 'AXARA VERSE',
      subtitle: 'Pemandu Budaya Nusantara',
      greeting: 'Halo! Selamat datang di AxaraVerse! ✨ Perkenalkan, aku Axara, pemandu budaya Nusantara kamu 🌺 Ada yang ingin kamu tanyakan',
      placeholder: 'Tanyakan sesuatu tentang sejarah, tradisi, atau kuliner...',
      suggestTitle: 'Mulai dengan pertanyaan ini:',
      suggestHistory: '🏯 Cerita tentang Majapahit',
      suggestTradition: '🎭 Tradisi unik Bali',
      suggestFood: '🍜 Kuliner khas Jawa',
      suggestMusic: '🎵 Alat musik tradisional'
    },
    profile: {
      title: 'PROFIL PENJELAJAH',
      subtitle: 'Identitas Budaya Anda',
      level: 'Level',
      xp: 'Pengalaman',
      totalXP: 'Total XP',
      provinces: 'Provinsi',
      badges: 'Badge',
      badgeCollection: 'Koleksi Badge Anda',
      totalBadges: 'Badge Dikoleksi',
      badgesSection: 'Koleksi Badge Anda',
      noBadges: 'Belum ada badge yang terbuka. Ayo jelajahi peta!',
      logout: 'Keluar Akun',
      editProfile: 'Edit Profil'
    }
  },
  en: {
    common: {
      back: 'Back', next: 'Next', submit: 'Submit', reset: 'Reset',
      loading: 'Loading', done: 'Done', close: 'Close', cancel: 'Cancel',
      confirm: 'Confirm', or: 'or', day: 'Day', edit: 'Edit'
    },
    nav: {
      home: 'Home', world: 'AxaraWorld', battle: 'AxaraBattle',
      verse: 'AxaraVerse', badge: 'AxaraBadge', profile: 'Profile'
    },
    auth: {
      login: 'Login', register: 'Register', email: 'Email', password: 'Password',
      username: 'Username', usernamePlaceholder: 'Username (min. 3 characters)',
      loginButton: 'Login to Account', registerButton: 'Create Account',
      noAccount: "Don't have an account?", hasAccount: 'Already have an account?',
      registerLink: 'Register now', gender: 'Gender',
      male: '👦 Male', female: '👧 Female',
      errorRequired: 'Email and password are required.', errorGeneric: 'An error occurred. Please try again.',
    },
    landing: {
      hero: {
        title: 'Explore the Eternal Culture of Nusantara',
        description: 'AXARA is a cultural gamification platform where users explore Indonesian culture through interactive maps and AI.',
        ctaStart: 'Start Exploring', ctaLearn: 'View Features', welcome: 'Welcome!',
      },
    features: {
      title: 'Main Features',
      world: { 
        title: 'AxaraWorld', 
        desc: 'Explore Indonesian culture through an interactive map in a fun and easy way.' 
      },
      battle: { 
        title: 'AxaraBattle', 
        desc: 'Test your cultural knowledge through fun mini-games like playing a game.' 
      },
      verse: { 
        title: 'AxaraVerse', 
        desc: 'Ask AI about culture and explore historical stories through interactive storytelling.' 
      },
      badge: { 
        title: 'AxaraBadge', 
        desc: 'Collect XP and badges, then climb the ranks as a culture explorer.' 
      },
    },
      faq: { title: 'Frequently Asked Questions' },
      contact: { title: 'Contact Us', name: 'Your Name', email: 'Your Email', message: 'Your Message', send: 'Send Message' }
    },
    world: {
      title: 'AXARA WORLD',
      subtitle: 'Explore Nusantara',
      inProgress: 'In Progress',
      completed: 'Completed',
      locked: 'Locked',
      provinceInfo: 'Province Information',
    },
    games: {
      guessTheCulture: { title: 'Culture Guess', description: 'Test your knowledge of traditions.', xpLabel: '50 XP / Point' },
      memoryMatch: { title: 'Memory Match', description: 'Match terms and descriptions.', xpLabel: '30 XP / Pair' },
      cultureSwipe: { title: 'Culture Swipe', description: 'Swipe Myth or Fact cards.', xpLabel: '25 XP / Card' },
      aksaraScramble: { title: 'Aksara Scramble', description: 'Unscramble cultural words.', xpLabel: '15 XP / Word' },
    },
    badges: { live: 'LIVE', new: 'NEW', completed: 'DONE' },
    quest: {
      title: 'AXARA BATTLE',
      subtitle: 'Test Your Knowledge',
      activeProvince: 'Active Province',
      questsCompleted: 'Quests Done',
      noProvince: 'Select a province in',
      backToMap: 'to start',
      progressBadge: 'Badge Progress',
      allComplete: 'All quests completed!',
      unlockBadge: 'More for Badge',
      selectQuest: 'Select Challenge',
      totalXP: 'Potential Total',
      perProvince: 'per Province',
    },
    verse: {
      title: 'AXARA VERSE',
      subtitle: 'Nusantara Culture Guide',
      greeting: 'Hello! Welcome to AxaraVerse! ✨ Im Axara, your guide to the cultures of the Nusantara 🌺 Is there anything you\'d like to ask?',
      placeholder: 'Ask about history, traditions, or culinary...',
      suggestTitle: 'Start with these questions:',
      suggestHistory: '🏯 Story about Majapahit',
      suggestTradition: '🎭 Unique Bali traditions',
      suggestFood: '🍜 Javanese culinary',
      suggestMusic: '🎵 Traditional instruments'
    },
    profile: {
      title: 'EXPLORER PROFILE',
      subtitle: 'Your Cultural Identity',
      level: 'Level',
      xp: 'Experience',
      totalXP: 'Total XP',
      provinces: 'Provinces',
      badges: 'Badges',
      badgeCollection: 'Your Badge Collection',
      totalBadges: 'Badges Collected',
      badgesSection: 'Your Badge Collection',
      noBadges: 'No badges unlocked yet. Start exploring the map!',
      logout: 'Logout Account',
      editProfile: 'Edit Profile'
    }
  }
};

export const DEFAULT_LANGUAGE: Language = 'id';
export const LANGUAGE_STORAGE_KEY = 'axara_language';