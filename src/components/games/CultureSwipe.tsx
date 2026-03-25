// src/components/games/CultureSwipe.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Check, AlertCircle, Clock, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateCultureSwipeData, SwipeCard } from '../../services/ai.service';
import { useSound } from '../../hooks/useSound'; // ✨ SOUND IMPORT

interface CultureSwipeProps {
  provinceId: string;
  onExit: () => void;
  onWin: (score: number, total: number) => void;
}

const SWIPE_THRESHOLD = 100;
const TIME_PER_CARD = 15;

// ─── Press-down helper ────────────────────────────────────────────────────────
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

// ─── Background wrapper (cream + dot-grid) ───────────────────────────────────
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

export default function CultureSwipe({ provinceId, onExit, onWin }: CultureSwipeProps) {
  // ── All hooks first ───────────────────────────────────────────────────────
  const [cards, setCards]           = useState<SwipeCard[]>([]);
  const [loading, setLoading]       = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore]           = useState(0);
  const [feedback, setFeedback]     = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [timeLeft, setTimeLeft]     = useState(TIME_PER_CARD);
  const [isGameOver, setIsGameOver] = useState(false);

  const x          = useMotionValue(0);
  const rotate     = useTransform(x, [-220, 220], [-13, 13]);
  const cardOpacity = useTransform(x, [-220, -80, 0, 80, 220], [0.5, 1, 1, 1, 0.5]);
  const mitosOpacity = useTransform(x, [-180, -30, 0], [1, 0.5, 0]);
  const faktaOpacity = useTransform(x, [0, 30, 180], [0, 0.5, 1]);
  const mitosScale   = useTransform(x, [-180, 0], [1.2, 0.8]);
  const faktaScale   = useTransform(x, [0, 180], [0.8, 1.2]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✨ SOUND EFFECTS
  const { playCorrect, playWrong, playSwipe } = useSound();

  const formattedProvinceName = provinceId
    ? provinceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Indonesia';

  // Load AI data
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await generateCultureSwipeData(formattedProvinceName);
        if (isMounted) setCards(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [provinceId]);

  // Timer
  useEffect(() => {
    if (loading || feedback || isGameOver || cards.length === 0 || currentIndex >= cards.length) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setFeedback({ isCorrect: false, explanation: `⏱️ Waktu habis! ${cards[currentIndex]?.explanation ?? ''}` });
          if (timerRef.current) clearInterval(timerRef.current);
          return TIME_PER_CARD;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex, loading, feedback, isGameOver, cards]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAnswer = (answerIsFact: boolean) => {
    if (feedback || currentIndex >= cards.length) return;
    const card = cards[currentIndex];
    const isCorrect = answerIsFact === card.isFact;
    if (isCorrect) {
      setScore(s => s + 1);
      playCorrect(); // ✨ PLAY CORRECT SOUND
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 }, colors: ['#F14C38', '#FBBF24', '#fff'] });
    } else {
      playWrong(); // ✨ PLAY WRONG SOUND
    }
    setFeedback({ isCorrect, explanation: card.explanation });
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleDragEnd = (_e: unknown, info: { offset: { x: number } }) => {
    if (feedback) return;
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      playSwipe(); // ✨ PLAY SWIPE SOUND
      handleAnswer(info.offset.x > 0);
    } else {
      x.set(0);
    }
  };

  const nextCard = () => {
    setFeedback(null);
    setTimeLeft(TIME_PER_CARD);
    x.set(0);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setIsGameOver(true);
      confetti({ particleCount: 150, spread: 80, colors: ['#F14C38', '#FBBF24', '#fff'] });
      setTimeout(() => onWin(score, cards.length), 1200);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <GameWrapper>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 px-5">
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
              AXARA Menyiapkan Kartu
            </p>
            <p className="text-base font-bold mt-2" style={{ color: 'rgba(26,15,10,0.5)' }}>
              Budaya {formattedProvinceName}...
            </p>
          </div>
        </div>
      </GameWrapper>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (cards.length === 0) {
    return (
      <GameWrapper>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 px-5 text-center">
          <div
            className="w-24 h-24 rounded-[28px] flex items-center justify-center"
            style={{ background: '#fee2e2', border: '5px solid #ef4444', boxShadow: '7px 7px 0 #991b1b' }}
          >
            <AlertCircle size={40} style={{ color: '#ef4444' }} strokeWidth={3} />
          </div>
          <div>
            <p className="font-black text-2xl" style={{ color: '#1a0f0a' }}>Gagal Memuat</p>
            <p className="text-base font-bold mt-1" style={{ color: 'rgba(26,15,10,0.5)' }}>Coba lagi nanti.</p>
          </div>
          <button
            className="px-10 py-4 font-black text-lg uppercase rounded-2xl text-white tracking-widest"
            style={{ background: '#F14C38', border: '4px solid #1a0f0a', boxShadow: '0 6px 0 #1a0f0a', transition: 'all 0.1s' }}
            onClick={onExit}
            {...makePressHandlers('0 6px 0 #1a0f0a')}
          >
            Kembali
          </button>
        </div>
      </GameWrapper>
    );
  }

  // ── Game Over ──────────────────────────────────────────────────────────────
  if (isGameOver) {
    const pct = Math.round((score / cards.length) * 100);
    return (
      <GameWrapper>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center justify-center flex-1 gap-6 px-5"
        >
          <div
            className="w-32 h-32 rounded-[36px] flex items-center justify-center"
            style={{ background: '#FBBF24', border: '5px solid #1a0f0a', boxShadow: '9px 9px 0 #1a0f0a' }}
          >
            <span style={{ fontSize: 56 }}>🏆</span>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase" style={{ color: '#1a0f0a' }}>Game Selesai!</h1>
            <p className="text-base font-bold mt-1" style={{ color: 'rgba(26,15,10,0.5)' }}>Culture Swipe</p>
          </div>
          <div
            className="w-full max-w-sm rounded-[26px] overflow-hidden"
            style={{ border: '4px solid #1a0f0a', boxShadow: '7px 7px 0 #1a0f0a' }}
          >
            <div className="flex items-center justify-center gap-3 py-6 px-6" style={{ background: '#1a0f0a' }}>
              <span className="text-6xl font-black text-white">{score}</span>
              <span className="text-4xl font-black" style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
              <span className="text-4xl font-black" style={{ color: 'rgba(255,255,255,0.5)' }}>{cards.length}</span>
            </div>
            <div className="py-5 px-6 text-center" style={{ background: 'white' }}>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(26,15,10,0.4)' }}>Akurasi</p>
              <p className="text-5xl font-black" style={{ color: '#F14C38' }}>{pct}%</p>
            </div>
          </div>
          <button
            className="w-full max-w-sm py-5 font-black text-xl uppercase rounded-2xl text-white tracking-widest"
            style={{ background: '#F14C38', border: '4px solid #1a0f0a', boxShadow: '0 7px 0 #1a0f0a', transition: 'all 0.1s' }}
            onClick={onExit}
            {...makePressHandlers('0 7px 0 #1a0f0a')}
          >
            Kembali ke Menu
          </button>
        </motion.div>
      </GameWrapper>
    );
  }

  // ── Main Game ──────────────────────────────────────────────────────────────
  const currentCard = cards[currentIndex];
  const progress    = ((currentIndex + (feedback ? 1 : 0)) / cards.length) * 100;
  const timerPct    = (timeLeft / TIME_PER_CARD) * 100;
  const timerColor  = timeLeft <= 5 ? '#ef4444' : timeLeft <= 8 ? '#FBBF24' : '#22c55e';

  return (
    <GameWrapper>
      {/* ── Header ── */}
      <header className="shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
        {/* Back btn */}
        <button
          onClick={onExit}
          className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0"
          style={{ background: 'white', border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a', transition: 'all 0.1s' }}
          {...makePressHandlers('3px 3px 0 #1a0f0a')}
        >
          <X size={20} strokeWidth={3} style={{ color: '#1a0f0a' }} />
        </button>

        {/* Progress */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#F14C38' }}>
              Kartu {currentIndex + 1} / {cards.length}
            </span>
            <span className="text-xs font-black" style={{ color: '#1a0f0a' }}>
              ✅ {score} benar
            </span>
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

        {/* Timer pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl shrink-0"
          style={{
            background: timeLeft <= 5 ? '#fee2e2' : 'white',
            border: `3px solid ${timerColor}`,
            boxShadow: `2px 2px 0 ${timerColor}`,
            transition: 'all 0.3s',
          }}
        >
          <Clock size={15} strokeWidth={3} style={{ color: timerColor }} />
          <span className="text-sm font-black" style={{ color: timerColor, minWidth: '20px' }}>
            {timeLeft}s
          </span>
        </div>
      </header>

      {/* Timer strip */}
      <div className="shrink-0 px-5 pb-2">
        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ background: 'rgba(26,15,10,0.08)', border: '2px solid rgba(26,15,10,0.12)' }}
        >
          <motion.div
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.9, ease: 'linear' }}
            className="h-full rounded-full"
            style={{ background: timerColor, transition: 'background 0.3s' }}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 pb-5 gap-4">

        {/* Title badge */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ background: '#1a0f0a', border: '3px solid #FBBF24', boxShadow: '3px 3px 0 rgba(251,191,36,0.4)' }}
          >
            <span className="text-lg">🤔</span>
            <span className="text-base font-black text-white uppercase tracking-widest">Mitos atau Fakta?</span>
          </div>
        </div>

        {/* ── Card zone ── */}
        <AnimatePresence mode="wait">
          {!feedback ? (
            /* Swipeable card */
            <motion.div
              key={`card-${currentIndex}`}
              className="relative flex-1"
              style={{ minHeight: '280px' }}
            >
              {/* Stack bg cards */}
              <div
                className="absolute inset-x-5 top-3 bottom-0 rounded-[26px]"
                style={{ background: 'rgba(26,15,10,0.06)', border: '3px solid rgba(26,15,10,0.09)' }}
              />
              <div
                className="absolute inset-x-2.5 top-1.5 bottom-0 rounded-[26px]"
                style={{ background: 'rgba(26,15,10,0.04)', border: '3px solid rgba(26,15,10,0.06)' }}
              />

              {/* Draggable card */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                style={{ x, rotate, opacity: cardOpacity }}
                initial={{ scale: 0.9, opacity: 0, y: 18 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                whileTap={{ cursor: 'grabbing' }}
                className="absolute inset-0 cursor-grab"
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center rounded-[26px] relative overflow-hidden"
                  style={{ background: 'white', border: '4px solid #1a0f0a', boxShadow: '8px 8px 0 #1a0f0a' }}
                >
                  {/* Swipe direction labels */}
                  <motion.div
                    style={{ opacity: mitosOpacity, scale: mitosScale }}
                    className="absolute top-5 left-5 px-4 py-2.5 rounded-[14px] font-black text-base -rotate-12"
                    css-only-inline={{ background: '#fee2e2', border: '3px solid #ef4444', color: '#ef4444' }}
                  >
                    <span style={{
                      display: 'block',
                      background: '#fee2e2',
                      border: '3px solid #ef4444',
                      color: '#ef4444',
                      padding: '6px 14px',
                      borderRadius: '14px',
                      fontWeight: 900,
                      fontSize: '1rem',
                      transform: 'rotate(-12deg)',
                    }}>
                      ❌ MITOS
                    </span>
                  </motion.div>
                  <motion.div
                    style={{ opacity: faktaOpacity, scale: faktaScale }}
                    className="absolute top-5 right-5"
                  >
                    <span style={{
                      display: 'block',
                      background: '#d1fae5',
                      border: '3px solid #22c55e',
                      color: '#22c55e',
                      padding: '6px 14px',
                      borderRadius: '14px',
                      fontWeight: 900,
                      fontSize: '1rem',
                      transform: 'rotate(12deg)',
                    }}>
                      ✅ FAKTA
                    </span>
                  </motion.div>

                  {/* Card content */}
                  <div className="flex flex-col items-center gap-5 px-8 py-10">
                    {currentCard?.category && (
                      <div
                        className="px-4 py-2 rounded-full"
                        style={{ background: '#F14C38', border: '2.5px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a' }}
                      >
                        <span className="text-xs font-black text-white uppercase tracking-widest">
                          {currentCard.category}
                        </span>
                      </div>
                    )}

                    {/* Statement — BIG & READABLE */}
                    <p
                      className="text-center font-black leading-snug"
                      style={{ color: '#1a0f0a', fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)', maxWidth: '440px' }}
                    >
                      "{currentCard?.statement}"
                    </p>
                  </div>

                  {/* Swipe hint at bottom */}
                  <div
                    className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2"
                  >
                    <span style={{ color: 'rgba(26,15,10,0.3)', fontSize: '1.1rem' }}>←</span>
                    <span
                      className="text-xs font-black uppercase tracking-widest"
                      style={{ color: 'rgba(26,15,10,0.3)' }}
                    >
                      Geser kartu
                    </span>
                    <span style={{ color: 'rgba(26,15,10,0.3)', fontSize: '1.1rem' }}>→</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Feedback card */
            <motion.div
              key="feedback"
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              className="flex-1 flex flex-col rounded-[26px] overflow-hidden"
              style={{
                border: `4px solid ${feedback.isCorrect ? '#22c55e' : '#ef4444'}`,
                boxShadow: `7px 7px 0 ${feedback.isCorrect ? '#166534' : '#991b1b'}`,
                background: feedback.isCorrect ? '#d1fae5' : '#fee2e2',
                minHeight: '280px',
              }}
            >
              <div className="flex flex-col items-center justify-center flex-1 gap-5 p-8 text-center">
                <div
                  className="w-20 h-20 rounded-[22px] flex items-center justify-center"
                  style={{
                    background: feedback.isCorrect ? '#22c55e' : '#ef4444',
                    border: '4px solid #1a0f0a',
                    boxShadow: '5px 5px 0 #1a0f0a',
                  }}
                >
                  {feedback.isCorrect
                    ? <Check size={36} className="text-white" strokeWidth={3} />
                    : <X size={36} className="text-white" strokeWidth={3} />}
                </div>

                <h3
                  className="text-3xl font-black"
                  style={{ color: feedback.isCorrect ? '#166534' : '#991b1b' }}
                >
                  {feedback.isCorrect ? '🎉 Luar Biasa!' : '😅 Kurang Tepat!'}
                </h3>

                <p
                  className="text-lg font-bold leading-relaxed"
                  style={{ color: feedback.isCorrect ? '#15803d' : '#b91c1c', maxWidth: '420px' }}
                >
                  {feedback.explanation}
                </p>

                <div
                  className="px-5 py-2.5 rounded-full"
                  style={{ background: 'rgba(26,15,10,0.08)', border: '2.5px solid rgba(26,15,10,0.15)' }}
                >
                  <span className="text-base font-black" style={{ color: '#1a0f0a' }}>
                    Skor: {score} / {currentIndex + 1}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom buttons ── */}
        {!feedback ? (
          <div className="flex gap-4 shrink-0">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleAnswer(false)}
              className="flex-1 py-5 font-black text-xl uppercase rounded-2xl text-white flex items-center justify-center gap-2 tracking-widest"
              style={{
                background: '#ef4444',
                border: '4px solid #1a0f0a',
                boxShadow: '0 7px 0 #991b1b',
                transition: 'all 0.1s',
              }}
              {...makePressHandlers('0 7px 0 #991b1b')}
            >
              <span className="text-2xl">❌</span> MITOS
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleAnswer(true)}
              className="flex-1 py-5 font-black text-xl uppercase rounded-2xl text-white flex items-center justify-center gap-2 tracking-widest"
              style={{
                background: '#22c55e',
                border: '4px solid #1a0f0a',
                boxShadow: '0 7px 0 #166534',
                transition: 'all 0.1s',
              }}
              {...makePressHandlers('0 7px 0 #166534')}
            >
              <span className="text-2xl">✅</span> FAKTA
            </motion.button>
          </div>
        ) : (
          <motion.button
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12 }}
            whileTap={{ scale: 0.97 }}
            onClick={nextCard}
            className="w-full py-5 font-black text-xl uppercase rounded-2xl text-white tracking-widest shrink-0"
            style={{
              background: feedback.isCorrect ? '#22c55e' : '#ef4444',
              border: '4px solid #1a0f0a',
              boxShadow: `0 7px 0 ${feedback.isCorrect ? '#166534' : '#991b1b'}`,
              transition: 'all 0.1s',
            }}
            {...makePressHandlers(`0 7px 0 ${feedback.isCorrect ? '#166534' : '#991b1b'}`)}
          >
            {currentIndex < cards.length - 1 ? 'Kartu Berikutnya →' : '🏁 Lihat Hasil!'}
          </motion.button>
        )}
      </div>
    </GameWrapper>
  );
}