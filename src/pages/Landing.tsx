import { motion, useScroll, useSpring } from 'framer-motion'; 
import { Link, useNavigate } from 'react-router-dom';
import { 
  Map, Swords, MessageCircle, Award, 
  ChevronDown, Star, Send, Instagram, Linkedin, Mail,
  Compass, BookOpen, Target, Trophy, ArrowRight,
  Flame, Menu, X, CheckCircle2, RefreshCw, Newspaper
} from 'lucide-react';
import React, { useState, useRef } from "react";
import FloatingChat from '../components/FloatingChat';
import { useTranslation } from '../hooks/useTranslation'; // ✨ ADDED
import LanguageSwitcher from '../components/LanguageSwitcher'; // ✨ ADDED

const floatingIcons = [
  { img: '/icons/borobudur.jpg', label: 'Borobudur', delay: 0 },
  { img: '/icons/komodo.jpg', label: 'Komodo', delay: 0.1 },
  { img: '/icons/rafflesia.jpg', label: 'Rafflesia', delay: 0.2 },
  { img: '/icons/wayang.jpg', label: 'Wayang', delay: 0.3 },
  { img: '/icons/batik.jpg', label: 'Batik', delay: 0.4 },
  { img: '/icons/rumah-gadang.jpg', label: 'Rumah Gadang', delay: 0.5 },
  { img: '/icons/angklung.jpg', label: 'Angklung', delay: 0.6 },
  { img: '/icons/bali-temple.jpg', label: 'Bali Temple', delay: 0.7 },
  { img: '/icons/bromo.jpg', label: 'Bromo', delay: 0.8 },
  { img: '/icons/rendang.jpg', label: 'Rendang', delay: 0.9 },
  { img: '/icons/harimau.jpg', label: 'Harimau', delay: 1.0 },
  { img: '/icons/gamelan.jpg', label: 'Gamelan', delay: 1.1 },
  { img: '/icons/keris.jpg', label: 'Keris', delay: 1.2 },
  { img: '/icons/garuda.jpg', label: 'Garuda', delay: 1.3 },
  { img: '/icons/phinisi.jpg', label: 'Phinisi', delay: 1.4 },
];

const avatarColors = [
  'bg-[#F04E36]', 'bg-[#D4AF37]', 'bg-emerald-500',
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-orange-500', 'bg-teal-500', 'bg-indigo-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-amber-500',
];

const getAvatarProps = (name: string) => {
  const initial = name.charAt(0).toUpperCase();
  const idx = name.charCodeAt(0) % avatarColors.length;
  return { initial, bgColor: avatarColors[idx] };
};

export default function LandingPage() {
  const { t } = useTranslation(); // ✨ ADDED
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const isLoggedIn = !!localStorage.getItem('user') || !!localStorage.getItem('token');

  // ✨ DYNAMIC FEATURES with translations
  const features = [
    {
      id: 'world',
      title: t.landing.features.world.title,
      description: t.landing.features.world.desc,
      icon: Map,
      windowBg: '/axara-fitur-2.jpg',
      targetUrl: 'https://axara-mu.vercel.app/app'
    },
    {
      id: 'battle',
      title: t.landing.features.battle.title,
      description: t.landing.features.battle.desc,
      icon: Swords,
      windowBg: '/axara-fitur.jpg',
      targetUrl: 'https://axara-mu.vercel.app/app/quest'
    },
    {
      id: 'verse',
      title: t.landing.features.verse.title,
      description: t.landing.features.verse.desc,
      icon: MessageCircle,
      windowBg: '/axara-fitur-2.jpg',
      targetUrl: 'https://axara-mu.vercel.app/app/verse'
    },
    {
      id: 'badge',
      title: t.landing.features.badge.title,
      description: t.landing.features.badge.desc,
      icon: Award,
      windowBg: '/axara-fitur.jpg',
      targetUrl: 'https://axara-mu.vercel.app/app/profile'
    }
  ];

  // ✨ DYNAMIC STEPS with translations
  const steps = [
    { icon: Compass, label: t.landing.features.world.title.includes('World') ? 'Explore Provinces' : 'Jelajahi Provinsi' },
    { icon: BookOpen, label: t.landing.features.world.title.includes('World') ? 'Learn Culture' : 'Pelajari Budaya' },
    { icon: Target, label: t.landing.features.battle.title.includes('Battle') ? 'Complete Quests' : 'Selesaikan Quest' },
    { icon: Star, label: t.landing.features.badge.title.includes('Badge') ? 'Earn XP' : 'Dapatkan XP' },
    { icon: Award, label: t.landing.features.badge.title.includes('Badge') ? 'Unlock Badges' : 'Buka Badge' },
    { icon: Trophy, label: t.landing.features.badge.title.includes('Badge') ? 'Climb Ranks' : 'Naik Peringkat' },
  ];

  // ✨ TESTIMONIALS - Keep as is (user-generated content)
  const testimonialList = [
    { text: 'Platform ini membuat belajar budaya Indonesia terasa seperti bermain game.', author: 'Budi S.', role: 'Pelajar' },
    { text: 'Cara yang indah untuk memperkenalkan budaya Nusantara kepada generasi muda.', author: 'Ibu Ratna', role: 'Guru' },
    { text: 'Saya menemukan begitu banyak tradisi unik yang tidak pernah saya ketahui sebelumnya.', author: 'Sarah M.', role: 'Wisatawan' },
    { text: 'AxaraWorld membuat saya jatuh cinta lagi dengan kebudayaan Indonesia yang kaya.', author: 'Deni P.', role: 'Mahasiswa' },
    { text: 'Mini game-nya seru banget! Saya sampai lupa waktu belajar tentang batik dan wayang.', author: 'Rina A.', role: 'Desainer' },
    { text: 'Fitur AI Story-nya luar biasa. Seperti membaca novel sejarah yang hidup!', author: 'Pak Hendra', role: 'Dosen' },
    { text: 'Sistem badge dan XP bikin saya terus semangat menjelajahi setiap provinsi.', author: 'Tika W.', role: 'Pelajar SMA' },
    { text: 'Akhirnya ada platform yang membuat budaya lokal terasa keren dan relevan!', author: 'Fajar N.', role: 'Content Creator' },
    { text: 'Saya pakai AXARA untuk mengajar di kelas, murid-murid sangat antusias!', author: 'Bu Sari', role: 'Guru SD' },
    { text: 'Pengalaman belajar yang interaktif dan menyenangkan. Highly recommended!', author: 'Kevin L.', role: 'Wisatawan Mancanegara' },
    { text: 'Peta interaktifnya sangat detail. Saya bisa mengenal budaya Kalimantan dengan mudah.', author: 'Mega R.', role: 'Peneliti' },
    { text: 'AXARA berhasil membuat saya bangga dengan warisan budaya bangsa sendiri.', author: 'Agus T.', role: 'Karyawan Swasta' },
  ];

  // ✨ FAQ with translations
  const faqs = [
    { q: t.landing.hero.title.includes('Explore') ? 'What is AXARA?' : 'Apa itu AXARA?', 
      a: t.landing.hero.description },
    { q: t.landing.hero.title.includes('Explore') ? 'How does the XP system work?' : 'Bagaimana sistem XP bekerja?', 
      a: t.landing.hero.title.includes('Explore') 
        ? 'You earn XP by completing cultural quests, mini-games, and interacting with the AI guide. Collect XP to level up and unlock badges.'
        : 'Anda mendapatkan XP dengan menyelesaikan quest budaya, mini-game, dan berinteraksi dengan panduan AI. Kumpulkan XP untuk naik level dan membuka badge.' },
    { q: t.landing.hero.title.includes('Explore') ? 'Is the platform free?' : 'Apakah platform ini gratis?', 
      a: t.landing.hero.title.includes('Explore')
        ? 'Yes! AXARA is completely free for anyone who wants to learn about Indonesian culture.'
        : 'Ya! AXARA sepenuhnya gratis digunakan bagi siapa saja yang ingin belajar tentang budaya Indonesia.' },
    { q: t.landing.hero.title.includes('Explore') ? 'Can I explore all provinces?' : 'Bisakah saya menjelajahi semua provinsi?', 
      a: t.landing.hero.title.includes('Explore')
        ? 'We are continuously adding more provinces. Currently, you can explore several major regions, with more coming soon!'
        : 'Kami terus menambahkan lebih banyak provinsi. Saat ini, Anda dapat menjelajahi beberapa wilayah utama, dan lebih banyak lagi akan segera hadir!' },
    { q: t.landing.hero.title.includes('Explore') ? 'Does AXARA use AI?' : 'Apakah AXARA menggunakan AI?', 
      a: t.landing.hero.title.includes('Explore')
        ? 'Yes, AXARA uses AI to generate dynamic quizzes and power the AxaraVerse cultural story guide.'
        : 'Ya, AXARA menggunakan AI untuk menghasilkan kuis dinamis dan menggerakkan panduan cerita budaya AxaraVerse.' },
  ];

  const handleFeatureNavigation = (targetUrl: string) => {
    if (isLoggedIn) {
      window.location.href = targetUrl;
    } else {
      navigate('/login');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleSendAgain = () => {
    setFormData({ name: '', email: '', message: '' });
    setFormSubmitted(false);
  };

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-cream text-text font-sans overflow-x-hidden">

      {/* ===================== NAVBAR ===================== */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Axara Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-primary">AXARA</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="font-bold text-text-light hover:text-primary transition-colors">
                {t.landing.features.title}
              </a>
              <a href="#how-it-works" className="font-bold text-text-light hover:text-primary transition-colors">
                {t.landing.hero.title.includes('Explore') ? 'How to Play' : 'Cara Bermain'}
              </a>
              <a href="#faq" className="font-bold text-text-light hover:text-primary transition-colors">FAQ</a>
              
              <div className="flex items-center gap-4 bg-cream px-4 py-2 rounded-2xl border border-cream-dark">
                <div className="flex items-center gap-2">
                  <Flame className="text-primary" size={20} />
                  <span className="font-bold text-text">{t.landing.hero.title.includes('Explore') ? 'Day 1' : 'Hari 1'}</span>
                </div>
                <div className="w-px h-6 bg-cream-dark"></div>
                <div className="flex items-center gap-2">
                  <Star className="text-[#ffce00]" size={20} />
                  <div className="w-24 h-3 bg-white rounded-full overflow-hidden border border-cream-dark">
                    <div className="h-full bg-[#ffce00] w-1/3 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* ✨ Language Switcher */}
              <LanguageSwitcher variant="minimal" />

              <Link to="/app" className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30 hover:-translate-y-1 transform duration-200">
                {t.landing.hero.ctaStart}
              </Link>
            </div>

            <button className="md:hidden text-text" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ===================== HERO SECTION ===================== */}
      <section 
        className="relative pt-32 pb-0 bg-primary overflow-hidden flex flex-col justify-between min-h-[90vh] bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(240, 78, 54, 0.4), rgba(240, 78, 54, 0.6)), url('/bg-hero.jpg')` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full pb-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* ✨ TRANSLATED HERO */}
              <h1 className="text-5xl md:text-6xl font-display font-extrabold leading-tight text-white">
                {t.landing.hero.title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-[#ffce00]">{t.landing.hero.title.split(' ').slice(-1)}</span>
              </h1>
              <p className="text-lg text-white/90 font-medium leading-relaxed">
                {t.landing.hero.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/app" className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cream transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2">
                  {t.landing.hero.ctaStart} <ArrowRight size={20} />
                </Link>
                <a href="#features" className="bg-transparent text-white border-2 border-white/50 px-8 py-4 rounded-2xl font-bold text-lg hover:border-white hover:bg-white/10 transition-all">
                  {t.landing.hero.ctaLearn}
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }} 
              transition={{ duration: 0.6, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              className="relative h-125 flex items-center justify-center" 
            >
              <div className="absolute w-112.5 h-112.5 bg-primary/40 blur-[120px] rounded-full z-0 opacity-70 animate-pulse"></div>
              <div className="absolute w-75 h-75 bg-[#ffce00]/30 blur-[80px] rounded-full z-0"></div>

              <div className="relative z-10 w-100 h-120 flex items-center justify-center overflow-visible">
                <motion.img 
                  src="/left-deco.png" alt="Cloud Decoration"
                  animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-20 bottom-10 w-64 h-auto object-contain z-0 pointer-events-none opacity-90"
                />
                <motion.img 
                  src="/right-deco.png" alt="Wayang Decoration"
                  animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-24 top-10 w-56 h-auto object-contain z-0 pointer-events-none opacity-90"
                />

                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                  transition={{ duration: 0.5, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                  className="absolute top-4 -right-16 z-40 drop-shadow-2xl" 
                >
                  <div className="relative flex items-center justify-center">
                    <svg width="220" height="80" viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30 10C15 10 5 20 5 35C5 50 15 60 30 60H40L35 75C45 70 55 60 60 60H190C205 60 215 50 215 35C215 20 205 10 190 10H30Z" fill="white" stroke="#E2E8F0" strokeWidth="1" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pb-4 pr-2">
                      <span className="text-primary font-bold text-lg tracking-tight">
                        {t.landing.hero.title.includes('Explore') ? 'Welcome!' : 'Selamat Datang!'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <img src="/mascot.png" alt="Axara Explorer" className="relative z-20 w-full h-full object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Marquee Strip */}
        <div 
          className="w-full border-t border-white/20 overflow-hidden py-4 backdrop-blur-sm bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(240, 78, 54, 0.7), rgba(240, 78, 54, 0.7)), url('/bg-pattern-icon.jpg')` }}
        >
          <div className="relative flex">
            <motion.div 
              className="flex flex-nowrap gap-12 items-center"
              animate={{ x: [0, -1000] }}
              transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" } }}
            >
              {[...floatingIcons, ...floatingIcons, ...floatingIcons].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0 group">
                  <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden border-2 border-[#ffce00] transition-transform duration-300 group-hover:scale-110">
                    <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-[9px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES SECTION ===================== */}
      <section 
        id="features" 
        ref={containerRef}
        className="py-24 bg-cream text-text relative"
        style={{ backgroundImage: `linear-gradient(rgba(255, 251, 235, 0.95), rgba(255, 251, 235, 0.95)), url('/bg.png')`, backgroundAttachment: 'fixed' }}
      >
        <div className="hidden md:block absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 72 15 L 28 38 L 72 61 L 28 84" fill="none" stroke="#ffce00" strokeWidth="0.15" strokeDasharray="1,1" className="opacity-20" />
            <motion.path
              d="M 72 15 L 28 38 L 72 61 L 28 84"
              fill="none"
              stroke="#ffce00"
              strokeWidth="0.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength }}
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* ✨ TRANSLATED FEATURES TITLE */}
          <div className="text-center max-w-3xl mx-auto mb-32">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-4 text-primary">
              {t.landing.features.title.split(' ')[0]}{' '}
              <span className="text-[#ffce00]">{t.landing.features.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-text-light font-medium text-lg">
              {t.landing.hero.title.includes('Explore') 
                ? 'Learn through gamification designed to preserve Nusantara traditions.'
                : 'Belajarlah melalui gamifikasi yang dirancang untuk melestarikan tradisi Nusantara.'}
            </p>
          </div>

          <div className="space-y-48">
            {features.map((feature, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={feature.id} className={`flex flex-col md:flex-row items-center gap-16 md:gap-24 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 space-y-6">
                    <div className="w-16 h-16 bg-white text-primary rounded-2xl flex items-center justify-center shadow-md border-2 border-primary/10">
                      <feature.icon size={32} />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-primary">{feature.title}</h3>
                    <p className="text-text font-medium leading-relaxed text-lg">{feature.description}</p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: "-20%" }}
                    className="flex-1 w-full cursor-pointer group/window"
                    onClick={() => handleFeatureNavigation(feature.targetUrl)}
                  >
                    <div className="bg-white rounded-2xl border-4 border-primary/10 overflow-hidden shadow-2xl relative transition-transform duration-300 group-hover/window:-translate-y-2">
                      <div className="bg-cream-dark px-4 py-3 flex items-center justify-between border-b-4 border-primary/10">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div className="w-3 h-3 rounded-full bg-[#ffce00]"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-xs text-text-light font-mono font-bold tracking-widest">{feature.id}.exe</span>
                      </div>
                      <div className="aspect-video relative overflow-hidden">
                        <img src={feature.windowBg} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/window:scale-110" />
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center transition-opacity group-hover/window:opacity-0">
                          <div className="bg-white/90 p-6 rounded-full shadow-xl">
                            <feature.icon size={48} className="text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== HOW TO PLAY ===================== */}
      <section 
        id="how-it-works" 
        className="py-24 text-white overflow-hidden bg-cover bg-center relative"
        style={{ backgroundImage: `linear-gradient(rgba(240, 78, 54, 0.45), rgba(200, 40, 20, 0.5)), url('/bg-howtoplay.jpg')` }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* ✨ TRANSLATED */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-extrabold mb-4">
              {t.landing.hero.title.includes('Explore') ? 'How to Play' : 'Cara Bermain'}
            </h2>
            <p className="text-white/80 font-medium text-lg">
              {t.landing.hero.title.includes('Explore') ? 'Your journey to becoming a Culture Master.' : 'Perjalananmu menjadi Master Budaya.'}
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-white/20 -translate-y-1/2"></div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 relative z-10">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center mb-4 border-2 border-[#ffce00] shadow-lg shadow-[#D4AF37]/40 hover:scale-110 transition-transform">
                    <step.icon size={28} className="text-white" />
                  </div>
                  <h4 className="font-bold text-sm md:text-base text-white">{step.label}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONI ===================== */}
      <section className="py-24 bg-cream text-text relative" >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* ✨ TRANSLATED */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-primary mb-4">
              {t.landing.hero.title.includes('Explore') ? 'Explorer Stories' : 'Kata Penjelajah'}
            </h2>
            <p className="text-text-light font-medium text-lg max-w-2xl mx-auto">
              {t.landing.hero.title.includes('Explore')
                ? 'Thousands of explorers have experienced the thrill of discovering Nusantara culture with AXARA.'
                : 'Ribuan penjelajah telah merasakan serunya menjelajahi budaya Nusantara bersama AXARA.'}
            </p>
          </div>

          <div 
            className="h-175 overflow-hidden relative"
            style={{ 
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">

              <div className="flex flex-col gap-8" style={{ animation: 'scrollUp 25s linear infinite' }}>
                {[...testimonialList.slice(0, 4), ...testimonialList.slice(0, 4)].map((tm, i) => {
                  const { initial, bgColor } = getAvatarProps(tm.author);
                  return (
                    <div key={i} className="bg-white p-8 rounded-3xl border-2 border-cream-dark shadow-sm hover:shadow-xl transition-all">
                      <div className="flex text-[#D4AF37] mb-4">
                        {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
                      </div>
                      <p className="text-lg text-text italic font-medium leading-relaxed mb-6">"{tm.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg ${bgColor}`}>{initial}</div>
                        <div>
                          <p className="font-bold text-primary">{tm.author}</p>
                          <p className="text-sm font-medium text-text-light">{tm.role}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden md:flex flex-col gap-8" style={{ animation: 'scrollUp 18s linear infinite', marginTop: '-150px' }}>
                {[...testimonialList.slice(4, 8), ...testimonialList.slice(4, 8)].map((tm, i) => {
                  const { initial, bgColor } = getAvatarProps(tm.author);
                  return (
                    <div key={i} className="bg-white p-8 rounded-3xl border-2 border-cream-dark shadow-sm hover:shadow-xl transition-all">
                      <div className="flex text-[#D4AF37] mb-4">
                        {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
                      </div>
                      <p className="text-lg text-text italic font-medium leading-relaxed mb-6">"{tm.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg ${bgColor}`}>{initial}</div>
                        <div>
                          <p className="font-bold text-primary">{tm.author}</p>
                          <p className="text-sm font-medium text-text-light">{tm.role}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden lg:flex flex-col gap-8" style={{ animation: 'scrollUp 32s linear infinite', marginTop: '-50px' }}>
                {[...testimonialList.slice(8, 12), ...testimonialList.slice(8, 12)].map((tm, i) => {
                  const { initial, bgColor } = getAvatarProps(tm.author);
                  return (
                    <div key={i} className="bg-white p-8 rounded-3xl border-2 border-cream-dark shadow-sm hover:shadow-xl transition-all">
                      <div className="flex text-[#D4AF37] mb-4">
                        {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
                      </div>
                      <p className="text-lg text-text italic font-medium leading-relaxed mb-6">"{tm.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg ${bgColor}`}>{initial}</div>
                        <div>
                          <p className="font-bold text-primary">{tm.author}</p>
                          <p className="text-sm font-medium text-text-light">{tm.role}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        <style>{`
          @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .pause-on-hover:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* ===================== WARTA NUSANTARA SECTION ===================== */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `url('/bg-pattern-icon.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <Newspaper size={18} className="text-[#ffce00]" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  {t.landing.hero.title.includes('Explore') ? 'Latest Update' : 'Update Terbaru'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6 leading-tight">
                <span className="text-white">Warta </span>
                <span className="text-[#ffce00]">Nusantara</span>
              </h2>

              {/* Description */}
              <p className="text-lg text-white/90 font-medium leading-relaxed mb-8">
                {t.landing.hero.title.includes('Explore')
                  ? 'Your hub for the latest Indonesian cultural news. Discover festivals, traditional events, conservation efforts, and creative UMKM promotions.'
                  : 'Pusat informasi budaya terkini. Temukan festival budaya, acara tradisi, berita pelestarian, hingga promosi UMKM kreatif daerah.'}
              </p>

              {/* Feature list */}
              <div className="space-y-4 mb-8">
                {[
                  { emoji: '🎉', labelId: 'Festival Budaya', labelEn: 'Cultural Festivals' },
                  { emoji: '🎭', labelId: 'Acara Tradisi', labelEn: 'Traditional Events' },
                  { emoji: '🏛️', labelId: 'Pelestarian Budaya', labelEn: 'Cultural Conservation' },
                  { emoji: '🛍️', labelId: 'UMKM Kreatif', labelEn: 'Creative SMEs' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-xl border border-white/20">
                      {item.emoji}
                    </div>
                    <span className="font-bold text-white">
                      {t.landing.hero.title.includes('Explore') ? item.labelEn : item.labelId}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <Link 
                to="/app/warta"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#ffce00] hover:text-text transition-all shadow-xl hover:-translate-y-1"
              >
                <Newspaper size={20} />
                {t.landing.hero.title.includes('Explore') ? 'Read News' : 'Baca Berita'}
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            {/* Right side - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ffce00]/20 rounded-full blur-3xl" />
              
              {/* Mock news cards */}
              <div className="relative space-y-4">
                {/* Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-linear-to-br from-primary to-[#D4AF37] flex items-center justify-center text-2xl shrink-0">
                      🎉
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-primary uppercase mb-1">
                        {t.landing.hero.title.includes('Explore') ? 'Festival' : 'Festival'}
                      </div>
                      <h4 className="font-bold text-text text-sm mb-1 line-clamp-1">
                        {t.landing.hero.title.includes('Explore') 
                          ? 'Batik Festival 2025'
                          : 'Festival Batik 2025'}
                      </h4>
                      <p className="text-xs text-text-light">
                        {t.landing.hero.title.includes('Explore') ? '2 days ago • Solo' : '2 hari lalu • Solo'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl shrink-0">
                      🛍️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-emerald-600 uppercase mb-1">UMKM</div>
                      <h4 className="font-bold text-text text-sm mb-1 line-clamp-1">
                        {t.landing.hero.title.includes('Explore')
                          ? 'NTT Weaving Goes to Paris'
                          : 'Tenun NTT ke Paris'}
                      </h4>
                      <p className="text-xs text-text-light">
                        {t.landing.hero.title.includes('Explore') ? '5 days ago • Jakarta' : '5 hari lalu • Jakarta'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-2xl shrink-0">
                      🏛️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-blue-600 uppercase mb-1">
                        {t.landing.hero.title.includes('Explore') ? 'Conservation' : 'Pelestarian'}
                      </div>
                      <h4 className="font-bold text-text text-sm mb-1 line-clamp-1">
                        {t.landing.hero.title.includes('Explore')
                          ? 'Wayang in School Curriculum'
                          : 'Wayang Masuk Kurikulum'}
                      </h4>
                      <p className="text-xs text-text-light">
                        {t.landing.hero.title.includes('Explore') ? '1 week ago • Yogyakarta' : '1 minggu lalu • Yogyakarta'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ✨ TRANSLATED */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-extrabold text-primary mb-4">
              {t.landing.hero.title.includes('Explore') ? 'Frequently Asked Questions' : 'Pertanyaan yang Sering Diajukan'}
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-2 border-cream-dark rounded-2xl overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-cream transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-lg text-text">{faq.q}</span>
                  <ChevronDown className={`transform transition-transform ${openFaq === i ? 'rotate-180 text-primary' : 'text-text-light'}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 py-4 bg-cream border-t-2 border-cream-dark">
                    <p className="text-text font-medium">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FOOTER + KONTAK ===================== */}
      <footer
        className="text-text pt-20 pb-10 bg-cover bg-center relative"
        style={{
          backgroundImage: "linear-gradient(rgba(255,251,235,0.9), rgba(255,251,235,0.9)), url('/bg-footer.jpg')"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 mb-16">
            {/* Info Kiri */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Axara Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-primary">AXARA</span>
              </div>
              <p className="text-text font-medium mb-8 max-w-md leading-relaxed">
                {t.landing.hero.title.includes('Explore')
                  ? 'Preserving Culture Through Exploration. Join us in making Indonesian history and traditions accessible and fun for everyone.'
                  : 'Melestarikan Budaya Melalui Eksplorasi. Bergabunglah bersama kami dalam membuat sejarah dan tradisi Indonesia dapat diakses dan menyenangkan bagi semua orang.'}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm border border-cream">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm border border-cream">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm border border-cream">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            {/* Form Kontak */}
            <div className="bg-white p-8 rounded-3xl border-2 border-cream shadow-sm">
              <h3 className="text-2xl font-display font-bold mb-6 text-primary">
                {t.landing.hero.title.includes('Explore') ? 'Contact Us' : 'Hubungi Kami'}
              </h3>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center gap-6 py-8"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-200">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-primary mb-2">
                      {t.landing.hero.title.includes('Explore') ? 'Message Sent! 🎉' : 'Pesan Terkirim! 🎉'}
                    </h4>
                    <p className="text-text-light font-medium">
                      {t.landing.hero.title.includes('Explore')
                        ? 'Thank you! The AXARA team will respond to your message soon.'
                        : 'Terima kasih! Tim AXARA akan segera merespons pesan Anda.'}
                    </p>
                  </div>
                  <button
                    onClick={handleSendAgain}
                    className="flex items-center gap-2 bg-cream border-2 border-cream-dark text-primary font-bold px-6 py-3 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    <RefreshCw size={18} />
                    {t.landing.hero.title.includes('Explore') ? 'Send Another Message' : 'Kirim Pesan Lagi'}
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.landing.hero.title.includes('Explore') ? 'Your Name' : 'Nama Anda'} 
                    className="w-full bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors font-bold placeholder:text-text-light"
                  />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.landing.hero.title.includes('Explore') ? 'Your Email' : 'Email Anda'} 
                    className="w-full bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors font-bold placeholder:text-text-light"
                  />
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.landing.hero.title.includes('Explore') ? 'Your Message' : 'Pesan Anda'} 
                    rows={4}
                    className="w-full bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors resize-none font-bold placeholder:text-text-light"
                  ></textarea>
                  <button 
                    type="submit" 
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-hover transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {t.landing.hero.title.includes('Explore') ? 'Send Message' : 'Kirim Pesan'} <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="border-t border-cream pt-8 text-center text-text-light font-bold text-sm">
            &copy; {new Date().getFullYear()} AXARA —{' '}
            {t.landing.hero.title.includes('Explore')
              ? 'Preserving Culture Through Exploration.'
              : 'Melestarikan Budaya Melalui Eksplorasi.'}
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <FloatingChat />
    </div>
  );
}