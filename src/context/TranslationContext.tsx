import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE } from '../i18n/config';

interface TranslationContextType {
  t: any;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('axara_language');
    return (saved === 'en' || saved === 'id') ? (saved as Language) : 'id';
  });

  useEffect(() => {
    localStorage.setItem('axara_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'id' ? 'en' : 'id');
  };

  // Pastikan translations terambil berdasarkan state language yang aktif
  const t = translations[language];

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage, toggleLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};