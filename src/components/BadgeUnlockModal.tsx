// src/components/BadgeUnlockModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface BadgeUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeName: string;
  badgeIcon?: string;
}

export default function BadgeUnlockModal({ isOpen, onClose, badgeName, badgeIcon = "🏅" }: BadgeUnlockModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      // Tembakkan confetti warna emas pas badge muncul
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#D4AF37', '#FBBF24', '#FFFFFF']
      });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Overlay Hitam */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative bg-linear-to-b from-yellow-50 to-white p-8 rounded-4xl border-4 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.4)] max-w-sm w-full text-center z-10"
          >
            {/* Tombol Close */}
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={24} />
            </button>

            {/* Icon/Gambar Badge */}
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
              className="w-32 h-32 mx-auto bg-white rounded-full border-4 border-[#D4AF37] shadow-xl flex items-center justify-center text-6xl mb-6 relative"
            >
              {/* Efek Glow di belakang icon */}
              <div className="absolute inset-0 bg-[#D4AF37] blur-xl opacity-30 rounded-full"></div>
              <span className="relative z-10">{badgeIcon}</span>
            </motion.div>

            {/* Teks Ucapan */}
            <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-2">Badge Baru Dibuka!</h3>
            <h2 className="text-3xl font-black text-[#0a0a0a] mb-4">{badgeName}</h2>
            <p className="text-gray-600 font-medium mb-8">Luar biasa! Pencapaianmu telah ditambahkan ke profil AxaraBadge.</p>
            
            <button 
              onClick={onClose}
              className="w-full py-4 bg-[#D4AF37] hover:bg-[#b8972f] text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-yellow-500/30"
            >
              Lanjut Berpetualang
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}