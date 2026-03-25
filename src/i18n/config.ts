// src/i18n/config.ts

export type Language = 'id' | 'en';

export interface Translations {
  common: {
    back: string; next: string; submit: string; reset: string;
    loading: string; done: string; close: string; cancel: string;
    confirm: string; or: string; day: string;
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
}

export const translations: Record<Language, Translations> = {
  id: {
    common: {
      back: 'Kembali', next: 'Lanjut', submit: 'Kirim', reset: 'Reset',
      loading: 'Memuat', done: 'Selesai', close: 'Tutup', cancel: 'Batal',
      confirm: 'Konfirmasi', or: 'atau', day: 'Hari'
    },
    nav: {
      home: 'Beranda', world: 'AxaraWorld', battle: 'AxaraBattle',
      verse: 'AxaraVerse', badge: 'AxaraBadge', profile: 'Profil'
    },
    auth: {
      login: 'Masuk',
      register: 'Daftar',
      email: 'Email',
      password: 'Kata Sandi',
      username: 'Nama Pengguna',
      usernamePlaceholder: 'Username (min. 3 karakter)',
      loginButton: 'Masuk ke Akun',
      registerButton: 'Buat Akun',
      noAccount: 'Belum punya akun?',
      hasAccount: 'Sudah punya akun?',
      registerLink: 'Daftar sekarang',
      gender: 'Jenis Kelamin',
      male: '👦 Laki-laki',
      female: '👧 Perempuan',
      errorRequired: 'Email dan password wajib diisi.',
      errorGeneric: 'Terjadi kesalahan. Coba lagi.',
    },
    landing: {
      hero: {
        title: 'Jelajahi Budaya Abadi Nusantara',
        description: 'AXARA adalah platform gamifikasi edukasi yang mengajak pengguna menjelajahi budaya Indonesia melalui peta interaktif, mini-games, dan AI storytelling.',
        ctaStart: 'Mulai Menjelajah',
        ctaLearn: 'Lihat Fitur',
        welcome: 'Selamat Datang!',
      },
      features: {
        title: 'Fitur Utama',
        world: { 
          title: 'AxaraWorld', 
          desc: 'Jelajahi budaya Nusantara lewat peta interaktif dan temukan berbagai daerah dengan cara yang seru dan mudah dipahami.' 
        },
        battle: { 
          title: 'AxaraBattle', 
          desc: 'Uji pengetahuan budayamu lewat berbagai mini-games seru yang membuat belajar terasa seperti bermain game.' 
        },
        verse: { 
          title: 'AxaraVerse', 
          desc: 'Tanyakan apa saja tentang budaya ke AI dan jelajahi cerita sejarah Nusantara lewat storytelling interaktif.' 
        },
        badge: { 
          title: 'AxaraBadge', 
          desc: 'Kumpulkan XP dan badge, naikkan peringkat, dan buktikan perjalananmu sebagai penjelajah budaya Indonesia.' 
        },
      },
      faq: { title: 'Pertanyaan Sering Diajukan' },
      contact: {
        title: 'Hubungi Kami',
        name: 'Nama Anda',
        email: 'Email Anda',
        message: 'Pesan Anda',
        send: 'Kirim Pesan',
      }
    }
  },
  en: {
    common: {
      back: 'Back', next: 'Next', submit: 'Submit', reset: 'Reset',
      loading: 'Loading', done: 'Done', close: 'Close', cancel: 'Cancel',
      confirm: 'Confirm', or: 'or', day: 'Day'
    },
    nav: {
      home: 'Home', world: 'AxaraWorld', battle: 'AxaraBattle',
      verse: 'AxaraVerse', badge: 'AxaraBadge', profile: 'Profile'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      usernamePlaceholder: 'Username (min. 3 characters)',
      loginButton: 'Login to Account',
      registerButton: 'Create Account',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      registerLink: 'Register now',
      gender: 'Gender',
      male: '👦 Male',
      female: '👧 Female',
      errorRequired: 'Email and password are required.',
      errorGeneric: 'An error occurred. Please try again.',
    },
    landing: {
      hero: {
        title: 'Explore the Eternal Culture of Nusantara',
        description: 'AXARA is a cultural gamification platform where users explore Indonesian culture through interactive maps, mini-games, and AI storytelling.',
        ctaStart: 'Start Exploring',
        ctaLearn: 'View Features',
        welcome: 'Welcome!',
      },
      features: {
        title: 'Main Features',
        world: { 
          title: 'AxaraWorld', 
          desc: 'Explore Indonesian culture through an interactive map in a fun and engaging way.' 
        },
        battle: { 
          title: 'AxaraBattle', 
          desc: 'Test your cultural knowledge through fun mini-games that make learning feel like playing.' 
        },
        verse: { 
          title: 'AxaraVerse', 
          desc: 'Ask AI about culture and explore Indonesian history through interactive storytelling.' 
        },
        badge: { 
          title: 'AxaraBadge', 
          desc: 'Collect XP and badges, climb the leaderboard, and prove your journey as a culture explorer.' 
        },
      },
      faq: { title: 'Frequently Asked Questions' },
      contact: {
        title: 'Contact Us',
        name: 'Your Name',
        email: 'Your Email',
        message: 'Your Message',
        send: 'Send Message',
      }
    }
  }
};

export const DEFAULT_LANGUAGE: Language = 'id';
export const LANGUAGE_STORAGE_KEY = 'axara_language';