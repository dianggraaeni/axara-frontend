// src/pages/Warta.tsx
// Warta Nusantara - Berita & Update Budaya Indonesia

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper, X, Calendar, MapPin, ExternalLink,
  Share2, Bookmark, ChevronRight, Filter
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import {
  newsArticles,
  newsCategories,
  getNewsByCategory,
  formatNewsDate,
  type NewsCategory,
  type NewsArticle
} from '../services/news.data';

const pressHandlers = {
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget).style.boxShadow = '0 0 0 #1a0f0a';
    (e.currentTarget).style.transform = 'translate(2px,2px)';
  },
  onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget).style.boxShadow = '3px 3px 0 #1a0f0a';
    (e.currentTarget).style.transform = 'none';
  },
  onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget).style.boxShadow = '3px 3px 0 #1a0f0a';
    (e.currentTarget).style.transform = 'none';
  },
};

export default function WartaPage() {
  const { t, language } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [savedNews, setSavedNews] = useState<Set<string>>(new Set());

  const filteredNews = getNewsByCategory(selectedCategory);
  const isIndonesian = language === 'id';

  const handleShare = async (news: NewsArticle) => {
    const title = isIndonesian ? news?.title?.id : news?.title?.en;
    const text  = isIndonesian ? news?.excerpt?.id : news?.excerpt?.en;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(`${title}\n\n${text}`);
      alert(isIndonesian ? 'Link disalin!' : 'Link copied!');
    }
  };

  const toggleSave = (newsId: string) => {
    setSavedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  return (
    <div
      className="flex flex-col w-full overflow-hidden relative"
      style={{ minHeight: '100dvh', background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* HEADER */}
      <header
        className="shrink-0 z-10 px-5 pt-3 pb-3 flex items-center gap-3 sticky top-0"
        style={{ borderBottom: '4px solid #1a0f0a', background: '#F14C38' }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: '#FBBF24', border: '3px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a' }}>
          <Newspaper size={20} className="text-primary" strokeWidth={3} />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-black leading-none text-white uppercase">
            Warta <span style={{ color: '#FBBF24' }}>Nusantara</span>
          </h1>
          <p className="text-[9px] font-black tracking-widest uppercase leading-none mt-0.5 text-white/60">
            {isIndonesian ? 'Berita Budaya Terkini' : 'Latest Cultural News'}
          </p>
        </div>
        <LanguageSwitcher variant="minimal" />
      </header>

      {/* CATEGORY FILTERS */}
      <div className="shrink-0 z-10 px-4 py-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          {newsCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm uppercase whitespace-nowrap transition-all"
                style={{
                  background: isActive ? cat.color : 'white',
                  color: isActive ? 'white' : '#1a0f0a',
                  border: `3px solid ${isActive ? '#1a0f0a' : 'rgba(26,15,10,0.15)'}`,
                  boxShadow: isActive ? '3px 3px 0 #1a0f0a' : '2px 2px 0 rgba(26,15,10,0.1)',
                }}
                {...(isActive ? pressHandlers : {})}
              >
                <span>{cat?.icon}</span>
                <span>{isIndonesian ? cat?.label?.id : cat?.label?.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NEWS FEED */}
      <div className="flex-1 overflow-y-auto z-10 px-4 pb-20" style={{ scrollbarWidth: 'thin' }}>
        <div className="space-y-4">
          {filteredNews.map((news, index) => {
            const category = newsCategories.find(c => c.id === news?.category);
            const isSaved  = savedNews.has(news?.id);

            return (
              <motion.div
                key={news?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedNews(news)}
                className="rounded-[20px] overflow-hidden cursor-pointer group"
                style={{
                  background: 'white',
                  border: '3px solid #1a0f0a',
                  boxShadow: '4px 4px 0 #1a0f0a',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                whileHover={{ y: -4, boxShadow: '6px 6px 0 #1a0f0a' }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={news?.image}
                    alt={isIndonesian ? news?.title?.id : news?.title?.en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-news.jpg';
                    }}
                  />
                  {category && (
                    <div
                      className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{ background: category?.color, border: '2px solid #1a0f0a' }}
                    >
                      <span className="text-sm">{category?.icon}</span>
                      <span className="text-[10px] font-black uppercase text-white">
                        {isIndonesian ? category?.label?.id : category?.label?.en}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(news?.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: isSaved ? '#FBBF24' : 'white',
                      border: '2px solid #1a0f0a',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Bookmark
                      size={14}
                      strokeWidth={3}
                      fill={isSaved ? '#1a0f0a' : 'none'}
                      style={{ color: '#1a0f0a' }}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} strokeWidth={3} style={{ color: 'rgba(26,15,10,0.4)' }} />
                      <span className="text-[10px] font-bold" style={{ color: 'rgba(26,15,10,0.4)' }}>
                        {formatNewsDate(news?.date, language)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} strokeWidth={3} style={{ color: 'rgba(26,15,10,0.4)' }} />
                      <span className="text-[10px] font-bold" style={{ color: 'rgba(26,15,10,0.4)' }}>
                        {news?.location}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black leading-tight mb-2" style={{ color: '#1a0f0a' }}>
                    {isIndonesian ? news?.title?.id : news?.title?.en}
                  </h3>

                  <p
                    className="text-sm font-bold leading-relaxed mb-3 line-clamp-2"
                    style={{ color: 'rgba(26,15,10,0.6)' }}
                  >
                    {isIndonesian ? news?.excerpt?.id : news?.excerpt?.en}
                  </p>

                  <div className="flex items-center gap-1 text-primary">
                    <span className="text-sm font-black uppercase">
                      {isIndonesian ? 'Baca Selengkapnya' : 'Read More'}
                    </span>
                    <ChevronRight size={16} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-lg font-black" style={{ color: 'rgba(26,15,10,0.4)' }}>
              {isIndonesian ? 'Belum ada berita' : 'No news yet'}
            </p>
          </div>
        )}
      </div>

      {/* NEWS DETAIL MODAL */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNews(null)}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(26,15,10,0.72)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-[28px] overflow-hidden"
              style={{
                background: '#F4F1E0',
                border: '5px solid #1a0f0a',
                boxShadow: '10px 10px 0 #1a0f0a',
                maxHeight: '90vh',
              }}
            >
              {/* Modal Header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ background: '#F14C38', borderBottom: '4px solid #1a0f0a' }}
              >
                <div className="flex items-center gap-2">
                  <Newspaper size={20} className="text-white" strokeWidth={3} />
                  <span className="font-black uppercase text-sm text-white tracking-widest">
                    {isIndonesian ? 'Detail Berita' : 'News Detail'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)' }}
                >
                  <X size={18} strokeWidth={3} className="text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 200px)', scrollbarWidth: 'thin' }}>
                {/* Image */}
                <div className="rounded-[20px] overflow-hidden mb-5"
                  style={{ border: '4px solid #1a0f0a', boxShadow: '5px 5px 0 #1a0f0a' }}>
                  <img
                    src={selectedNews?.image}
                    alt={isIndonesian ? selectedNews?.title?.id : selectedNews?.title?.en}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-news.jpg';
                    }}
                  />
                </div>

                {/* Category & Meta */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{
                      background: newsCategories.find(c => c.id === selectedNews?.category)?.color,
                      border: '2px solid #1a0f0a',
                    }}
                  >
                    <span>{newsCategories.find(c => c.id === selectedNews?.category)?.icon}</span>
                    <span className="text-[10px] font-black uppercase text-white">
                      {isIndonesian
                        ? newsCategories.find(c => c.id === selectedNews?.category)?.label?.id
                        : newsCategories.find(c => c.id === selectedNews?.category)?.label?.en}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} strokeWidth={3} style={{ color: 'rgba(26,15,10,0.4)' }} />
                    <span className="text-[10px] font-bold" style={{ color: 'rgba(26,15,10,0.4)' }}>
                      {formatNewsDate(selectedNews?.date, language)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} strokeWidth={3} style={{ color: 'rgba(26,15,10,0.4)' }} />
                    <span className="text-[10px] font-bold" style={{ color: 'rgba(26,15,10,0.4)' }}>
                      {selectedNews?.location}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-black leading-tight mb-4" style={{ color: '#1a0f0a' }}>
                  {isIndonesian ? selectedNews?.title?.id : selectedNews?.title?.en}
                </h2>

                {/* Content */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-base font-medium leading-relaxed whitespace-pre-wrap" style={{ color: '#1a0f0a' }}>
                    {isIndonesian ? selectedNews?.content?.id : selectedNews?.content?.en}
                  </p>
                </div>

                {/* Tags */}
                {selectedNews?.tags && selectedNews.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {selectedNews.tags.map((tag) => (
                      <div
                        key={tag}
                        className="px-2.5 py-1 rounded-lg"
                        style={{ background: 'white', border: '2px solid rgba(26,15,10,0.15)' }}
                      >
                        <span className="text-[10px] font-bold" style={{ color: 'rgba(26,15,10,0.5)' }}>
                          #{tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleShare(selectedNews)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm uppercase"
                    style={{
                      background: 'white',
                      border: '3px solid #1a0f0a',
                      boxShadow: '3px 3px 0 #1a0f0a',
                      color: '#1a0f0a',
                      transition: 'all 0.1s',
                    }}
                    {...pressHandlers}
                  >
                    <Share2 size={16} strokeWidth={3} />
                    {isIndonesian ? 'Bagikan' : 'Share'}
                  </button>
                  {selectedNews?.externalLink && (
                    <a
                      href={selectedNews.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm uppercase"
                      style={{
                        background: '#F14C38',
                        border: '3px solid #1a0f0a',
                        boxShadow: '3px 3px 0 #1a0f0a',
                        color: 'white',
                        transition: 'all 0.1s',
                      }}
                      onMouseDown={(e) => {
                        (e.currentTarget).style.boxShadow = '0 0 0 #1a0f0a';
                        (e.currentTarget).style.transform = 'translate(2px,2px)';
                      }}
                      onMouseUp={(e) => {
                        (e.currentTarget).style.boxShadow = '3px 3px 0 #1a0f0a';
                        (e.currentTarget).style.transform = 'none';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget).style.boxShadow = '3px 3px 0 #1a0f0a';
                        (e.currentTarget).style.transform = 'none';
                      }}
                    >
                      <ExternalLink size={16} strokeWidth={3} />
                      {isIndonesian ? 'Kunjungi' : 'Visit'}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}