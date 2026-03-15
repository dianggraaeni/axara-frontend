// src/components/LanguageSwitcher.tsx
// Language switcher button component
// Can be placed in navbar, settings, or anywhere

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'pill';
  showIcon?: boolean;
  showText?: boolean;
}

export default function LanguageSwitcher({ 
  variant = 'default',
  showIcon = true,
  showText = true,
}: LanguageSwitcherProps) {
  const { language, toggleLanguage } = useTranslation();

  // Default variant (Neo-brutalism style matching AXARA)
  if (variant === 'default') {
    return (
      <motion.button
        onClick={toggleLanguage}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm uppercase tracking-wide transition-all"
        style={{
          background: 'white',
          border: '3px solid #1a0f0a',
          boxShadow: '3px 3px 0 #1a0f0a',
          color: '#1a0f0a',
        }}
      >
        {showIcon && <Globe size={16} strokeWidth={3} />}
        {showText && <span>{language.toUpperCase()}</span>}
      </motion.button>
    );
  }

  // Minimal variant (just text)
  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors hover:bg-gray-100"
        style={{ color: '#1a0f0a' }}
      >
        {showIcon && <Globe size={14} strokeWidth={2.5} />}
        {showText && <span>{language === 'id' ? 'ID' : 'EN'}</span>}
      </button>
    );
  }

  // Pill variant (toggle switch style)
  if (variant === 'pill') {
    return (
      <div
        className="relative flex items-center gap-1 p-1 rounded-full"
        style={{
          background: '#F4F1E0',
          border: '2px solid #1a0f0a',
        }}
      >
        <motion.div
          className="absolute h-[calc(100%-8px)] rounded-full"
          style={{
            background: '#F14C38',
            border: '2px solid #1a0f0a',
            width: 'calc(50% - 4px)',
          }}
          animate={{
            x: language === 'id' ? 2 : 'calc(100% + 4px)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
        <button
          onClick={() => toggleLanguage()}
          className="relative z-10 px-4 py-1.5 font-black text-xs uppercase tracking-wider transition-colors rounded-full"
          style={{
            color: language === 'id' ? 'white' : '#1a0f0a',
          }}
        >
          ID
        </button>
        <button
          onClick={() => toggleLanguage()}
          className="relative z-10 px-4 py-1.5 font-black text-xs uppercase tracking-wider transition-colors rounded-full"
          style={{
            color: language === 'en' ? 'white' : '#1a0f0a',
          }}
        >
          EN
        </button>
      </div>
    );
  }

  return null;
}