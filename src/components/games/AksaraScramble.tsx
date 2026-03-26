// src/components/games/AksaraScramble.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check, AlertCircle, Award, Sparkles, RotateCcw, ChevronLeft, Flame, PenTool } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateAksaraScramble, ScrambleWord } from '../../services/ai.service';
import { useSound } from '../../hooks/useSound'; // ✨ SOUND IMPORT

interface AksaraScrambleProps {
  provinceId: string;
  onExit: () => void;
  onWin: (score: number, total: number) => void;
}

const TOTAL_WORDS = 5;

function makePressHandlers(releaseShadow: string) {
  return {
    whileHover: { y: -4, boxShadow: releaseShadow },
    whileTap: { y: 0, boxShadow: '0px 0px 0px #1a0f0a' },
  };
}

export default function AksaraScramble({ provinceId, onExit, onWin }: AksaraScrambleProps) {
  const [words, setWords] = useState<ScrambleWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ letter: string; used: boolean }[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // ✨ SOUND EFFECTS
  const { playCorrect, playWrong, playClick } = useSound();

  const formattedProvinceName = provinceId 
    ? provinceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Indonesia';

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await generateAksaraScramble(formattedProvinceName, TOTAL_WORDS);
        if (isMounted) {
          setWords(data);
          if (data.length > 0) {
            initializeLetters(data[0].scrambledWord);
          }
        }
      } catch (error) {
        console.error('Error loading aksara scramble:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [provinceId]);

  const initializeLetters = (scrambled: string) => {
    const letters = scrambled.split('').map(letter => ({ letter, used: false }));
    setAvailableLetters(letters);
    setSelectedLetters([]);
  };

  const handleLetterClick = (index: number) => {
    if (feedback || availableLetters[index].used) return;
    
    // ✨ PLAY CLICK SOUND
    playClick();
    
    const letter = availableLetters[index].letter;
    setSelectedLetters(prev => [...prev, letter]);
    setAvailableLetters(prev => prev.map((item, i) => i === index ? { ...item, used: true } : item));
  };

  const handleRemoveLetter = (selectedIndex: number) => {
    if (feedback) return;
    
    // ✨ PLAY CLICK SOUND
    playClick();
    
    const removedLetter = selectedLetters[selectedIndex];
    setSelectedLetters(prev => prev.filter((_, i) => i !== selectedIndex));
    
    const originalIndex = availableLetters.findIndex(item => item.letter === removedLetter && item.used);
    if (originalIndex !== -1) {
      setAvailableLetters(prev => prev.map((item, i) => i === originalIndex ? { ...item, used: false } : item));
    }
  };

  const handleSubmit = () => {
    if (selectedLetters.length === 0 || feedback) return;

    const userAnswer = selectedLetters.join('').toUpperCase();
    const correctAnswer = words[currentIndex].correctWord.toUpperCase();

    if (userAnswer === correctAnswer) {
      // ✨ PLAY CORRECT SOUND
      playCorrect();
      
      setScore(s => s + 1);
      setFeedback({ isCorrect: true, message: `Benar! Kata yang dicari adalah ${correctAnswer}.` });
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#F14C38', '#FBBF24', '#fff'] });
    } else {
      // ✨ PLAY WRONG SOUND
      playWrong();
      
      setFeedback({ isCorrect: false, message: `Salah! Jawabannya adalah: ${correctAnswer}` });
    }
  };

  const handleReset = () => {
    initializeLetters(words[currentIndex].scrambledWord);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(c => c + 1);
      initializeLetters(words[currentIndex + 1].scrambledWord);
      setFeedback(null);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#10B981', '#34D399', '#6EE7B7']
      });

      setTimeout(() => {
        onWin(score + (feedback?.isCorrect ? 1 : 0), words.length);
      }, 1500);
    }
  };

  // ─── LOADING STATE (Neo-Brutalism) ───────────
  if (loading) {
    return (
      <div className="flex flex-col w-full relative overflow-hidden" style={{ minHeight: '100dvh', background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-7 px-5">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
            className="w-24 h-24 rounded-[28px] flex items-center justify-center"
            style={{ background: '#10B981', border: '5px solid #1a0f0a', boxShadow: '7px 7px 0 #1a0f0a' }}>
            <PenTool size={40} className="text-white" strokeWidth={3} />
          </motion.div>
          <div className="px-8 py-6 rounded-[22px] text-center" style={{ background: 'white', border: '4px solid #1a0f0a', boxShadow: '6px 6px 0 #1a0f0a' }}>
            <p className="font-black text-2xl uppercase tracking-widest" style={{ color: '#1a0f0a' }}>AXARA Menyiapkan Susunan</p>
            <p className="text-base font-bold mt-2" style={{ color: 'rgba(26,15,10,0.5)' }}>Dari {formattedProvinceName}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (words.length === 0) return null;
  if (isGameOver) return null; // Ditangani di Quest.tsx

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + (feedback !== null ? 1 : 0)) / words.length) * 100;

  return (
    <div className="flex flex-col w-full relative min-h-dvh" style={{ background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
      
      <div className="relative z-10 flex flex-col flex-1 max-w-2xl mx-auto w-full">
        {/* Header Progress */}
        <header className="shrink-0 px-5 pt-4 pb-3 flex items-center gap-3">
          <button onClick={onExit} className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0" style={{ background: 'white', border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a', transition: 'all 0.1s' }}>
            <ChevronLeft size={20} strokeWidth={3} style={{ color: '#1a0f0a' }} />
          </button>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#10B981' }}>
                Kata {currentIndex + 1} / {words.length}
              </span>
              <div className="flex items-center gap-1">
                <Flame size={12} style={{ color: '#FBBF24' }} strokeWidth={3} />
                <span className="text-xs font-black" style={{ color: '#1a0f0a' }}>{score} benar</span>
              </div>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: 'rgba(26,15,10,0.1)', border: '2.5px solid #1a0f0a' }}>
              <motion.div animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 60 }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
            </div>
          </div>
        </header>

        {!feedback ? (
          <div className="flex flex-col flex-1 px-5 pb-5 gap-6">
            <motion.div
              initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 210, damping: 22 }}
              className="rounded-[26px] p-7 text-center relative mt-4"
              style={{ background: 'white', border: '4px solid #1a0f0a', boxShadow: '7px 7px 0 #1a0f0a' }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border-[3px] border-[#1a0f0a] bg-[#FBBF24] flex items-center gap-2">
                <Sparkles size={14} className="text-[#1a0f0a]" strokeWidth={3} />
                <span className="font-black text-[12px] uppercase tracking-widest text-[#1a0f0a]">Petunjuk</span>
              </div>
              <p className="font-black leading-snug mt-2" style={{ color: '#1a0f0a', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>
                "{currentWord.clue}"
              </p>
            </motion.div>

            {/* Selected Letters */}
            <div className="mt-4 min-h-20 bg-green-50 border-[3px] border-dashed border-[#1a0f0a]/30 rounded-[26px] p-4 flex items-center justify-center gap-2 flex-wrap">
              <AnimatePresence>
                {selectedLetters.length === 0 ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#1a0f0a]/40 font-black tracking-widest uppercase text-sm">
                    Tap huruf untuk menyusun
                  </motion.p>
                ) : (
                  selectedLetters.map((letter, index) => (
                    <motion.button
                      key={`selected-${index}`}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      onClick={() => handleRemoveLetter(index)}
                      className="w-12 h-12 md:w-14 md:h-14 bg-[#FBBF24] border-[3px] border-[#1a0f0a] shadow-[3px_3px_0_#1a0f0a] rounded-xl font-black text-2xl text-[#1a0f0a] transition-transform hover:-translate-y-1"
                    >
                      {letter}
                    </motion.button>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Available Letters */}
            <div className="flex items-center justify-center gap-3 flex-wrap mt-2">
              {availableLetters.map((item, index) => (
                <motion.button
                  key={`letter-${index}`}
                  {...makePressHandlers('4px 4px 0 #1a0f0a')}
                  onClick={() => handleLetterClick(index)}
                  disabled={item.used}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl font-black text-2xl border-[3px] border-[#1a0f0a] transition-all duration-200 ${
                    item.used ? 'bg-gray-200 text-gray-400 opacity-0 scale-50' : 'bg-white text-[#1a0f0a]'
                  }`}
                  style={{ boxShadow: item.used ? 'none' : '4px 4px 0 #1a0f0a' }}
                >
                  {item.letter}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-4 mt-auto pt-6">
              <button onClick={handleReset} className="px-6 py-4 bg-white border-[3px] border-[#1a0f0a] shadow-[4px_4px_0_#1a0f0a] rounded-2xl font-black hover:-translate-y-1 transition-transform flex items-center justify-center">
                <RotateCcw size={20} strokeWidth={3} className="text-[#1a0f0a]" />
              </button>
              <button onClick={handleSubmit} disabled={selectedLetters.length === 0} className="flex-1 py-4 bg-[#10B981] border-[3px] border-[#1a0f0a] shadow-[4px_4px_0_#1a0f0a] rounded-2xl font-black text-lg text-white uppercase tracking-widest hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:shadow-none">
                Cek Jawaban
              </button>
            </div>
          </div>
   ) : (
          <AnimatePresence>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 270, damping: 28 }}
              className="absolute bottom-0 left-0 right-0 z-50 p-5"
              style={{ background: feedback.isCorrect ? '#d1fae5' : '#fee2e2', borderTop: `4px solid ${feedback.isCorrect ? '#22c55e' : '#ef4444'}`, boxShadow: '0 -8px 28px rgba(0,0,0,0.12)' }}
            >
              <div className="max-w-2xl mx-auto flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: feedback.isCorrect ? '#22c55e' : '#ef4444', border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a' }}>
                    {feedback.isCorrect ? <Check size={22} className="text-white" strokeWidth={3} /> : <AlertCircle size={22} className="text-white" strokeWidth={3} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-lg" style={{ color: feedback.isCorrect ? '#166534' : '#991b1b' }}>{feedback.isCorrect ? '🎉 Luar Biasa!' : '😅 Kurang Tepat!'}</p>
                    <p className="text-base font-bold mt-1 leading-relaxed" style={{ color: feedback.isCorrect ? '#15803d' : '#b91c1c' }}>{feedback.message}</p>
                  </div>
                </div>
                <button onClick={handleNext} className="w-full py-4 font-black text-base uppercase rounded-2xl text-white tracking-widest hover:-translate-y-1 transition-transform" style={{ background: feedback.isCorrect ? '#22c55e' : '#ef4444', border: '3px solid #1a0f0a', boxShadow: `0 5px 0 ${feedback.isCorrect ? '#166534' : '#991b1b'}` }}>
                  {currentIndex < words.length - 1 ? 'Lanjut →' : '🏁 Selesai!'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}