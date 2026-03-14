// src/pages/Quest.tsx
import React, { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { generateQuiz } from '../services/ai.service';
import { questsService } from '../services/quests.service';
import {
  Loader2, X, Check, Brain, Image as ImageIcon, Sparkles,
  Map, Trophy, Zap, Star, Swords, Shield, Clock, ArrowRight,
  RotateCcw, Flame, ChevronLeft,
} from 'lucide-react';
import MemoryMatch from '../components/games/MemoryMatch';
import CultureSwipe from '../components/games/CultureSwipe';
import BadgeUnlockModal from '../components/BadgeUnlockModal';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
}

type GameId = 'guess' | 'memory' | 'swipe';

const PROVINCE_NAMES: Record<string, string> = {
  'bali': 'Bali',
  'jawa-tengah': 'Jawa Tengah',
  'sumatera-barat': 'Sumatera Barat',
  'sulawesi-selatan': 'Sulawesi Selatan',
  'papua': 'Papua',
  'dki-jakarta': 'DKI Jakarta',
  'jawa-barat': 'Jawa Barat',
  'jawa-timur': 'Jawa Timur',
  'kalimantan-timur': 'Kalimantan Timur',
  'sulawesi-utara': 'Sulawesi Utara',
};

const STORAGE_KEY_PROVINCE  = 'axara_quest_province';
const STORAGE_KEY_COMPLETED = 'axara_quest_completed';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makePressHandlers(releaseShadow: string) {
  return {
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.boxShadow = '0 0 0 #1a0f0a';
      e.currentTarget.style.transform = 'translateY(5px)';
    },
    onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.boxShadow = releaseShadow;
      e.currentTarget.style.transform = 'none';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.boxShadow = releaseShadow;
      e.currentTarget.style.transform = 'none';
    },
  };
}

// Cream + dot-grid wrapper used on every screen
function GameWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col w-full relative overflow-hidden"
      style={{ minHeight: '100dvh', background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div className="relative z-10 flex flex-col flex-1">{children}</div>
    </div>
  );
}

// Animated XP / progress bar
function XPBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div
      className="w-full h-4 rounded-full overflow-hidden"
      style={{ background: 'rgba(26,15,10,0.1)', border: '2.5px solid #1a0f0a' }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

// ─── GuessCultureGame ─────────────────────────────────────────────────────────
function GuessCultureGame({
  questions,
  onComplete,
  onBack,
}: {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}) {
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect]           = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const scoreRef = useRef(0);

  const question  = questions[currentIndex];
  const progress  = ((currentIndex + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100;
  const LABELS    = ['A', 'B', 'C', 'D'];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const correct = idx === question.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    if (correct) scoreRef.current += 1;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      onComplete(scoreRef.current, questions.length);
    }
  };

  return (
    <GameWrapper>
      {/* Header */}
      <header className="shrink-0 px-5 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0"
          style={{ background: 'white', border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a', transition: 'all 0.1s' }}
          {...makePressHandlers('3px 3px 0 #1a0f0a')}
        >
          <ChevronLeft size={20} strokeWidth={3} style={{ color: '#1a0f0a' }} />
        </button>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#F14C38' }}>
              Soal {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-1">
              <Flame size={12} style={{ color: '#FBBF24' }} strokeWidth={3} />
              <span className="text-xs font-black" style={{ color: '#1a0f0a' }}>
                {scoreRef.current} benar
              </span>
            </div>
          </div>
          <div
            className="w-full h-4 rounded-full overflow-hidden"
            style={{ background: 'rgba(26,15,10,0.1)', border: '2.5px solid #1a0f0a' }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 60 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #F14C38, #FBBF24)' }}
            />
          </div>
        </div>

        {/* XP counter */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl shrink-0"
          style={{ background: '#1a0f0a', border: '2px solid #FBBF24' }}
        >
          <Star size={12} fill="#FBBF24" className="text-yellow-400" strokeWidth={2} />
          <span className="text-sm font-black text-white">{scoreRef.current * 50} XP</span>
        </div>
      </header>

      <div className="flex flex-col flex-1 px-5 pb-5 gap-4">
        {/* Question card */}
        <motion.div
          key={currentIndex}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 210, damping: 22 }}
          className="rounded-[26px] p-7"
          style={{ background: 'white', border: '4px solid #1a0f0a', boxShadow: '7px 7px 0 #1a0f0a' }}
        >
          {question?.category && (
            <div
              className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full"
              style={{ background: '#F14C38', border: '2.5px solid #1a0f0a' }}
            >
              <Brain size={11} className="text-white" strokeWidth={3} />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                {question.category}
              </span>
            </div>
          )}
          <p
            className="font-black leading-snug"
            style={{ color: '#1a0f0a', fontSize: 'clamp(1.15rem, 3vw, 1.5rem)' }}
          >
            {question?.question}
          </p>
        </motion.div>

        {/* Answer options */}
        <div className="flex flex-col gap-3 flex-1">
          {question?.options.map((opt, idx) => {
            const isSelected      = selectedAnswer === idx;
            const isCorrectOption = idx === question.correctIndex;
            const revealed        = selectedAnswer !== null;

            let bg         = 'white';
            let border     = 'rgba(26,15,10,0.18)';
            let shadow     = '3px 3px 0 rgba(26,15,10,0.12)';
            let textColor  = '#1a0f0a';
            let labelBg    = '#F14C38';
            let labelColor = 'white';
            let opacityVal = 1;

            if (revealed) {
              if (isCorrectOption) {
                bg = '#d1fae5'; border = '#22c55e'; shadow = '4px 4px 0 #166534';
                textColor = '#166534'; labelBg = '#22c55e';
              } else if (isSelected) {
                bg = '#fee2e2'; border = '#ef4444'; shadow = '4px 4px 0 #991b1b';
                textColor = '#991b1b'; labelBg = '#ef4444';
              } else {
                opacityVal = 0.38; border = 'rgba(26,15,10,0.1)'; shadow = 'none';
                labelBg = '#d1d5db'; labelColor = '#9ca3af';
              }
            }

            return (
              <motion.button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={revealed}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: opacityVal }}
                transition={{ delay: idx * 0.06, type: 'spring', stiffness: 210, damping: 22 }}
                whileHover={!revealed ? { y: -3 } : {}}
                whileTap={!revealed ? { scale: 0.98 } : {}}
                className="flex items-center gap-4 rounded-[18px] p-4 text-left w-full"
                style={{
                  background: bg,
                  border: `3px solid ${border}`,
                  boxShadow: shadow,
                  cursor: revealed ? 'default' : 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                {/* Label circle */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-black text-base"
                  style={{
                    background: labelBg,
                    color: labelColor,
                    border: '2.5px solid rgba(26,15,10,0.18)',
                    boxShadow: '2px 2px 0 rgba(26,15,10,0.12)',
                  }}
                >
                  {revealed && isCorrectOption
                    ? <Check size={18} strokeWidth={3} />
                    : revealed && isSelected && !isCorrectOption
                    ? <X size={18} strokeWidth={3} />
                    : LABELS[idx]}
                </div>
                <span className="font-bold text-lg flex-1 leading-snug" style={{ color: textColor }}>
                  {opt}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Explanation bottom panel */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 270, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-5"
            style={{
              background: isCorrect ? '#d1fae5' : '#fee2e2',
              borderTop: `4px solid ${isCorrect ? '#22c55e' : '#ef4444'}`,
              boxShadow: '0 -8px 28px rgba(0,0,0,0.12)',
            }}
          >
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: isCorrect ? '#22c55e' : '#ef4444',
                    border: '3px solid #1a0f0a',
                    boxShadow: '3px 3px 0 #1a0f0a',
                  }}
                >
                  {isCorrect
                    ? <Check size={22} className="text-white" strokeWidth={3} />
                    : <X size={22} className="text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1">
                  <p className="font-black text-lg" style={{ color: isCorrect ? '#166534' : '#991b1b' }}>
                    {isCorrect ? '🎉 Luar Biasa!' : '😅 Kurang Tepat!'}
                  </p>
                  <p className="text-base font-bold mt-1 leading-relaxed" style={{ color: isCorrect ? '#15803d' : '#b91c1c' }}>
                    {question.explanation}
                  </p>
                </div>
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 font-black text-base uppercase rounded-2xl text-white tracking-widest"
                style={{
                  background: isCorrect ? '#22c55e' : '#ef4444',
                  border: '3px solid #1a0f0a',
                  boxShadow: `0 5px 0 ${isCorrect ? '#166534' : '#991b1b'}`,
                  transition: 'all 0.1s',
                }}
                {...makePressHandlers(`0 5px 0 ${isCorrect ? '#166834' : '#991b1b'}`)}
              >
                {currentIndex < questions.length - 1 ? 'Lanjut →' : '🏁 Selesai!'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameWrapper>
  );
}

// ─── GameCard component (selector screen) ─────────────────────────────────────
function GameCard({
  icon, title, description, xpLabel, accentColor,
  badge, isDone, disabled, onClick,
}: {
  icon: React.ReactNode; title: string; description: string;
  xpLabel: string; accentColor: string; badge: React.ReactNode;
  isDone: boolean; disabled: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -6, rotate: -0.4 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      className="flex flex-col rounded-[24px] overflow-hidden text-left w-full"
      style={{
        background: isDone ? '#fff7ed' : 'white',
        border: `4px solid ${isDone ? '#F14C38' : '#1a0f0a'}`,
        boxShadow: isDone ? '6px 6px 0 #F14C38' : '6px 6px 0 #1a0f0a',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.2s',
      }}
    >
      {/* Top accent stripe */}
      <div className="h-2 w-full" style={{ background: isDone ? '#F14C38' : accentColor }} />

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: isDone ? '#F14C38' : accentColor + '1a',
              border: `3px solid ${isDone ? '#1a0f0a' : accentColor}`,
              boxShadow: `3px 3px 0 ${isDone ? '#1a0f0a' : accentColor + '88'}`,
              color: isDone ? 'white' : accentColor,
            }}
          >
            {icon}
          </div>
          {badge}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-black leading-tight" style={{ color: '#1a0f0a' }}>{title}</h3>
          <p className="text-sm font-bold mt-2 leading-relaxed" style={{ color: 'rgba(26,15,10,0.55)' }}>
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide"
            style={{
              background: isDone ? 'rgba(241,76,56,0.1)' : accentColor + '18',
              color: isDone ? '#F14C38' : accentColor,
              border: `1.5px solid ${isDone ? '#F14C38' : accentColor}`,
            }}
          >
            {xpLabel}
          </span>
          {isDone
            ? <div className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{ background: '#F14C38', border: '2px solid #1a0f0a' }}>
                <Check size={10} className="text-white" strokeWidth={3} />
                <span className="text-[9px] font-black text-white uppercase tracking-wide">Selesai</span>
              </div>
            : <ArrowRight size={20} strokeWidth={3} style={{ color: accentColor }} />}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main QuestPage ────────────────────────────────────────────────────────────
export default function QuestPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const urlProvinceId = searchParams.get('province');
  const [provinceId]  = useState<string | null>(() => {
    if (urlProvinceId) { sessionStorage.setItem(STORAGE_KEY_PROVINCE, urlProvinceId); return urlProvinceId; }
    return sessionStorage.getItem(STORAGE_KEY_PROVINCE);
  });

  const provinceName = provinceId
    ? (PROVINCE_NAMES[provinceId] ?? provinceId.replace(/-/g, ' '))
    : 'Indonesia';

  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [questions, setQuestions]       = useState<QuizQuestion[]>([]);
  const [loading, setLoading]           = useState(false);
  const [isFinished, setIsFinished]     = useState(false);
  const [finalScore, setFinalScore]     = useState(0);
  const [finalTotal, setFinalTotal]     = useState(0);
  const [finalXp, setFinalXp]           = useState(0);

  const [completedGames, setCompletedGames] = useState<GameId[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_COMPLETED);
      if (stored) {
        const parsed = JSON.parse(stored) as { provinceId: string; games: GameId[] };
        const cur    = urlProvinceId || sessionStorage.getItem(STORAGE_KEY_PROVINCE);
        if (parsed.provinceId === cur) return parsed.games;
      }
    } catch { /* ignore */ }
    return [];
  });

  const [showBadge, setShowBadge] = useState(false);

  const saveCompletedGames = (games: GameId[]) => {
    sessionStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify({ provinceId, games }));
    setCompletedGames(games);
  };

  const startGuessCulture = async () => {
    if (!provinceId) { alert('Pilih provinsi dahulu!'); return; }
    setSelectedGame('guess');
    setLoading(true);
    try {
      const qs = await generateQuiz(provinceName, 3, 'easy');
      setQuestions(qs);
    } catch {
      alert('Gagal memuat soal. Pastikan API key sudah diset.');
      setSelectedGame(null);
    } finally {
      setLoading(false);
    }
  };

  const submitToBackend = async (
    gameType: 'guess_culture' | 'memory_match' | 'province_puzzle',
    score: number, total: number, questionsData: QuizQuestion[]
  ) => {
    if (!provinceId) return;
    try {
      const { sessionId } = await questsService.createSession(provinceId, gameType, questionsData);
      const answers = Array(total).fill(0).map((_, i) => (i < score ? 0 : -1));
      await questsService.submitSession(sessionId, answers);
    } catch (err) { console.error('Backend silent fail:', err); }
  };

  const finishGame = async (score: number, total: number, xpPerPoint: number, questionsData?: QuizQuestion[]) => {
    const xp = score * xpPerPoint;
    setFinalScore(score); setFinalTotal(total); setFinalXp(xp);

    if (selectedGame && provinceId && questionsData) {
      const map: Record<GameId, 'guess_culture' | 'memory_match' | 'province_puzzle'> = {
        guess: 'guess_culture', memory: 'memory_match', swipe: 'province_puzzle',
      };
      await submitToBackend(map[selectedGame], score, total, questionsData);
    }

    if (provinceId && selectedGame) {
      if (!completedGames.includes(selectedGame)) {
        const newList: GameId[] = [...completedGames, selectedGame];
        saveCompletedGames(newList);
        if (newList.length === 3) {
          confetti({ particleCount: 200, spread: 90, colors: ['#F14C38', '#FBBF24', '#fff'] });
          setShowBadge(true);
        } else if (score === total) {
          confetti({ particleCount: 100, spread: 70, colors: ['#F14C38', '#FBBF24', '#fff'] });
        }
      } else if (score === total) {
        confetti({ particleCount: 100, spread: 70, colors: ['#F14C38', '#FBBF24', '#fff'] });
      }
    }
    setIsFinished(true);
  };

  const resetGame = () => {
    setIsFinished(false); setSelectedGame(null); setQuestions([]);
    setFinalXp(0); setFinalScore(0); setFinalTotal(0);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <GameWrapper>
        <div className="flex flex-col items-center justify-center flex-1 gap-7 px-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
            className="w-24 h-24 rounded-[28px] flex items-center justify-center"
            style={{ background: '#F14C38', border: '5px solid #1a0f0a', boxShadow: '7px 7px 0 #1a0f0a' }}
          >
            <Brain size={40} className="text-white" strokeWidth={3} />
          </motion.div>
          <div
            className="px-8 py-6 rounded-[22px] text-center"
            style={{ background: 'white', border: '4px solid #1a0f0a', boxShadow: '6px 6px 0 #1a0f0a' }}
          >
            <p className="font-black text-2xl uppercase tracking-widest" style={{ color: '#1a0f0a' }}>
              AI Menyiapkan Soal
            </p>
            <p className="text-base font-bold mt-2" style={{ color: 'rgba(26,15,10,0.5)' }}>
              Tentang {provinceName}...
            </p>
          </div>
        </div>
      </GameWrapper>
    );
  }

  // ── Finish Screen ────────────────────────────────────────────────────────
  if (isFinished) {
    const isPerfect = finalScore === finalTotal;
    const stars     = finalScore === 0 ? 1 : finalScore < finalTotal ? 2 : 3;

    return (
      <>
        <BadgeUnlockModal
          isOpen={showBadge}
          onClose={() => setShowBadge(false)}
          badgeName={`Master ${provinceName}`}
          badgeIcon="👑"
        />
        <GameWrapper>
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="flex flex-col items-center justify-center flex-1 gap-6 px-5 py-8"
          >
            {/* Trophy */}
            <div className="relative">
              <div
                className="w-32 h-32 rounded-[36px] flex items-center justify-center"
                style={{
                  background: isPerfect ? '#FBBF24' : '#F14C38',
                  border: '5px solid #1a0f0a',
                  boxShadow: '9px 9px 0 #1a0f0a',
                }}
              >
                <Trophy size={56} className="text-white" strokeWidth={2.5} />
              </div>
              {/* Star row */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5">
                {[1, 2, 3].map(s => (
                  <motion.div key={s}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + s * 0.1, type: 'spring', stiffness: 400 }}>
                    <Star
                      size={24} strokeWidth={2}
                      fill={s <= stars ? '#FBBF24' : 'transparent'}
                      style={{ color: s <= stars ? '#FBBF24' : 'rgba(26,15,10,0.2)' }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="text-center mt-4">
              <h1 className="text-4xl font-black uppercase tracking-tight" style={{ color: '#1a0f0a' }}>
                {isPerfect ? 'SEMPURNA! 🔥' : finalScore > 0 ? 'BAGUS! 💪' : 'COBA LAGI! 💡'}
              </h1>
              <p className="text-base font-bold mt-1" style={{ color: 'rgba(26,15,10,0.5)' }}>Quest Selesai</p>
            </div>

            {/* Score card */}
            <div className="w-full max-w-sm rounded-[26px] overflow-hidden"
              style={{ border: '4px solid #1a0f0a', boxShadow: '7px 7px 0 #1a0f0a' }}>
              <div className="flex items-center justify-center gap-3 py-6 px-6" style={{ background: '#1a0f0a' }}>
                <span className="text-6xl font-black text-white">{finalScore}</span>
                <span className="text-4xl font-black" style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
                <span className="text-4xl font-black" style={{ color: 'rgba(255,255,255,0.5)' }}>{finalTotal}</span>
              </div>
              <div className="py-6 px-6 flex flex-col items-center gap-3" style={{ background: 'white' }}>
                <div className="flex items-center gap-2">
                  <Zap size={18} fill="#FBBF24" style={{ color: '#FBBF24' }} strokeWidth={2} />
                  <span className="font-black text-sm uppercase tracking-widest" style={{ color: 'rgba(26,15,10,0.5)' }}>
                    XP Diperoleh
                  </span>
                </div>
                <motion.p
                  initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                  className="text-6xl font-black" style={{ color: '#F14C38' }}
                >
                  +{finalXp}
                </motion.p>
                <XPBar value={finalXp} max={finalTotal * 50} color="#F14C38" />
                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'rgba(26,15,10,0.35)' }}>
                  XP sudah tersimpan ke profil ✓
                </p>
              </div>
            </div>

            {/* Quest progress badges */}
            <div className="flex items-center justify-center gap-2">
              {(['guess', 'memory', 'swipe'] as GameId[]).map(g => (
                <div key={g} className="flex items-center gap-1.5 px-3 py-2 rounded-full"
                  style={{
                    background: completedGames.includes(g) ? '#F14C38' : 'white',
                    border: `2.5px solid ${completedGames.includes(g) ? '#1a0f0a' : 'rgba(26,15,10,0.15)'}`,
                  }}>
                  <span className="text-[10px] font-black uppercase tracking-wide"
                    style={{ color: completedGames.includes(g) ? 'white' : 'rgba(26,15,10,0.3)' }}>
                    {g === 'guess' ? 'Quiz' : g === 'memory' ? 'Match' : 'Swipe'}
                  </span>
                  {completedGames.includes(g) && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="w-full max-w-sm flex flex-col gap-3">
              <button
                onClick={() => completedGames.length === 3 ? navigate('/app') : resetGame()}
                className="w-full py-5 font-black text-xl uppercase rounded-2xl text-white tracking-widest"
                style={{
                  background: '#F14C38', border: '4px solid #1a0f0a',
                  boxShadow: '0 7px 0 #1a0f0a', transition: 'all 0.1s',
                }}
                {...makePressHandlers('0 7px 0 #1a0f0a')}
              >
                {completedGames.length === 3 ? '🗺️ Kembali ke AxaraWorld' : '⚔️ Pilih Game Lain'}
              </button>
              <button
                onClick={resetGame}
                className="w-full py-4 font-black text-base uppercase rounded-2xl flex items-center justify-center gap-2 tracking-widest"
                style={{
                  background: 'transparent', color: 'rgba(26,15,10,0.4)',
                  border: '3px solid rgba(26,15,10,0.15)', transition: 'all 0.15s',
                }}
              >
                <RotateCcw size={15} strokeWidth={3} /> Main Lagi
              </button>
            </div>
          </motion.div>
        </GameWrapper>
      </>
    );
  }

  // ── Active Games ─────────────────────────────────────────────────────────
  if (selectedGame === 'guess' && questions.length > 0) {
    return (
      <GuessCultureGame
        questions={questions}
        onComplete={(score, total) => finishGame(score, total, 50, questions)}
        onBack={() => setSelectedGame(null)}
      />
    );
  }
  if (selectedGame === 'memory' && provinceId) {
    return (
      <MemoryMatch
        provinceId={provinceId}
        onWin={(matched: number, total: number) => {
          const q: QuizQuestion[] = Array(total).fill(null).map((_, i) => ({
            question: `Pasangan ${i + 1}`, options: ['', '', '', ''],
            correctIndex: 0, explanation: 'Memory match pair',
          }));
          finishGame(matched, total, 30, q);
        }}
        onExit={() => setSelectedGame(null)}
      />
    );
  }
  if (selectedGame === 'swipe' && provinceId) {
    return (
      <CultureSwipe
        provinceId={provinceId}
        onWin={(score, total) => {
          const q: QuizQuestion[] = Array(total).fill(null).map((_, i) => ({
            question: `Kartu ${i + 1}`, options: ['', '', '', ''],
            correctIndex: 0, explanation: 'Culture swipe card',
          }));
          finishGame(score, total, 25, q);
        }}
        onExit={() => setSelectedGame(null)}
      />
    );
  }

  // ── Game Selector ─────────────────────────────────────────────────────────
  const isGuessDone  = completedGames.includes('guess');
  const isMemoryDone = completedGames.includes('memory');
  const isSwipeDone  = completedGames.includes('swipe');
  const totalDone    = completedGames.length;

  const BadgePill = ({ done, label }: { done: boolean; label: string }) =>
    done ? (
      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
        style={{ background: '#F14C38', border: '2px solid #1a0f0a' }}>
        <Check size={10} className="text-white" strokeWidth={3} />
        <span className="text-[9px] font-black text-white uppercase">Selesai</span>
      </div>
    ) : (
      <div className="px-2.5 py-1.5 rounded-full"
        style={{ background: label === '🔥 NEW' ? '#ede9fe' : '#d1fae5', border: `2px solid ${label === '🔥 NEW' ? '#8B5CF6' : '#22c55e'}` }}>
        <span className="text-[9px] font-black uppercase tracking-wide"
          style={{ color: label === '🔥 NEW' ? '#8B5CF6' : '#15803d' }}>{label}</span>
      </div>
    );

  return (
    <GameWrapper>
      {/* Header */}
      <header className="shrink-0 px-5 pt-4 pb-3 flex items-center justify-between gap-3">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#F14C38', border: '3px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a' }}>
            <Swords size={17} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-xl font-black leading-none" style={{ color: '#1a0f0a' }}>
              AXARA <span style={{ color: '#F14C38' }}>BATTLE</span>
            </h1>
            <p className="text-[9px] font-black tracking-widest uppercase leading-none mt-0.5" style={{ color: '#F14C38' }}>
              Taklukkan Nusantara
            </p>
          </div>
        </motion.div>

        <button
          onClick={() => { sessionStorage.removeItem(STORAGE_KEY_PROVINCE); sessionStorage.removeItem(STORAGE_KEY_COMPLETED); navigate('/app'); }}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl"
          style={{ background: 'white', border: '2.5px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a', transition: 'all 0.1s' }}
          {...makePressHandlers('2px 2px 0 #1a0f0a')}
        >
          <Map size={14} strokeWidth={3} style={{ color: '#F14C38' }} />
          <span className="text-[11px] font-black uppercase tracking-wide" style={{ color: '#1a0f0a' }}>Peta</span>
        </button>
      </header>

      <div className="flex flex-col flex-1 px-5 pb-6 gap-5 overflow-y-auto">

        {/* Province banner */}
        {provinceId ? (
          <motion.div
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
            className="rounded-[22px] p-5 flex items-center gap-4"
            style={{ background: '#F14C38', border: '4px solid #1a0f0a', boxShadow: '5px 5px 0 rgba(241,76,56,0.45)' }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: '#F14C38', border: '3px solid #fbbf24' }}>
              <Shield size={26} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#fbbf24' }}>
                Provinsi Aktif
              </p>
              <p className="text-xl font-black text-white uppercase leading-tight truncate">{provinceName}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-3.5 h-3.5 rounded-full"
                    style={{
                      background: i < totalDone ? '#FBBF24' : 'rgba(255,255,255,0.12)',
                      border: `2px solid ${i < totalDone ? '#FBBF24' : 'rgba(255,255,255,0.2)'}`,
                    }} />
                ))}
              </div>
              <span className="text-[9px] font-black uppercase tracking-wide" style={{ color: '#fbbf24' }}>
                {totalDone}/3 Quest
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="rounded-[18px] p-4 flex items-center gap-3"
            style={{ background: '#fff7ed', border: '3px solid #FBBF24', boxShadow: '3px 3px 0 #FBBF24' }}
          >
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-bold" style={{ color: '#92400e' }}>
              Belum ada provinsi. Kembali ke{' '}
              <button onClick={() => navigate('/app')} className="underline font-black">AxaraWorld</button>{' '}
              untuk memilih!
            </p>
          </motion.div>
        )}

        {/* Badge progress bar */}
        {provinceId && (
          <motion.div
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="rounded-[18px] p-5"
            style={{ background: 'white', border: '3px solid rgba(26,15,10,0.12)', boxShadow: '3px 3px 0 rgba(26,15,10,0.06)' }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#F14C38' }}>
                Progress Badge Master
              </span>
              <span className="text-xs font-black" style={{ color: '#1a0f0a' }}>{totalDone * 33}%</span>
            </div>
            <XPBar value={totalDone} max={3} color={totalDone === 3 ? '#FBBF24' : '#F14C38'} />
            <p className="text-xs font-bold mt-2" style={{ color: 'rgba(26,15,10,0.4)' }}>
              {totalDone === 3
                ? '🎉 Semua quest selesai! Badge Master sudah kamu raih!'
                : `Selesaikan ${3 - totalDone} quest lagi untuk unlock Badge Master ${provinceName}`}
            </p>
          </motion.div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: 'rgba(26,15,10,0.12)' }} />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(26,15,10,0.35)' }}>
            Pilih Quest
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(26,15,10,0.12)' }} />
        </div>

        {/* Game cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <GameCard
              icon={<Brain size={30} strokeWidth={2.5} />}
              title="Guess The Culture"
              description="Tebak budaya, makanan & tradisi lewat pertanyaan interaktif dari AI."
              xpLabel="+50 XP / soal"
              accentColor="#F14C38"
              isDone={isGuessDone}
              disabled={!provinceId}
              onClick={startGuessCulture}
              badge={<BadgePill done={isGuessDone} label="🟢 Live" />}
            />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}>
            <GameCard
              icon={<ImageIcon size={30} strokeWidth={2.5} />}
              title="Memory Match"
              description="Cocokkan pasangan budaya daerah dengan tepat dan secepat mungkin!"
              xpLabel="+30 XP / pasang"
              accentColor="#FBBF24"
              isDone={isMemoryDone}
              disabled={!provinceId}
              onClick={() => provinceId && setSelectedGame('memory')}
              badge={<BadgePill done={isMemoryDone} label="🟢 Live" />}
            />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.29 }}>
            <GameCard
              icon={<Sparkles size={30} strokeWidth={2.5} />}
              title="Culture Swipe"
              description="Swipe kartu budaya: Mitos atau Fakta? Lebih seru dari Quizizz!"
              xpLabel="+25 XP / kartu"
              accentColor="#8B5CF6"
              isDone={isSwipeDone}
              disabled={!provinceId}
              onClick={() => provinceId && setSelectedGame('swipe')}
              badge={<BadgePill done={isSwipeDone} label="🔥 NEW" />}
            />
          </motion.div>
        </div>

        {/* Total XP hint */}
        <motion.div
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl"
          style={{ background: 'rgba(241,76,56,0.06)', border: '2px dashed rgba(241,76,56,0.25)' }}
        >
          <Zap size={14} fill="#FBBF24" style={{ color: '#FBBF24' }} strokeWidth={2} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(26,15,10,0.4)' }}>
            Total maks: <span style={{ color: '#F14C38' }}>450 XP</span> per provinsi
          </span>
        </motion.div>
      </div>
    </GameWrapper>
  );
}