// src/components/games/MemoryMatch.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, RefreshCw, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import useSound from 'use-sound'; // IMPORT SOUND
import { generateMemoryMatchData } from '../../services/ai.service';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatch({ provinceId, onExit, onWin }: any) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const[flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  // SOUND EFFECTS
  const[playCorrect] = useSound('/sounds/correct.mp3', { volume: 0.7 });
  const [playWrong] = useSound('/sounds/wrong.mp3', { volume: 0.7 });

  const formattedProvinceName = provinceId 
    ? provinceId.replace(/-/g, ' ').toUpperCase() 
    : 'PROVINSI';

  useEffect(() => {
    const initGame = async () => {
      setLoading(true);
      try {
        const data = await generateMemoryMatchData(provinceId || 'Indonesia');
        
        let deck: Card[] =[];
        data.forEach((item: any, index: number) => {
          deck.push({ id: index, content: item.term, isFlipped: false, isMatched: false });
          deck.push({ id: index, content: item.hint || item.deskripsi, isFlipped: false, isMatched: false });
        });

        setCards(deck.sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error("Gagal load AI data", error);
      } finally {
        setLoading(false);
      }
    };
    initGame();
  }, [provinceId]);

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped =[...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]].id === cards[newFlipped[1]].id) {
        // MATCHED (BENAR)
        playCorrect(); 
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
      } else {
        // NOT MATCHED (SALAH)
        playWrong();
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors:['#F04E36', '#D4AF37', '#10B981'] });
      setTimeout(() => onWin(matched.length / 2, cards.length / 2), 1500); // Pass score
    }
  }, [matched, cards, onWin]);

  // ─── LOADING STATE (Neo-Brutalism) ───────────
  if (loading) {
    return (
      <div className="flex flex-col w-full relative overflow-hidden" style={{ minHeight: '100dvh', background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-7 px-5">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
            className="w-24 h-24 rounded-[28px] flex items-center justify-center"
            style={{ background: '#FBBF24', border: '5px solid #1a0f0a', boxShadow: '7px 7px 0 #1a0f0a' }}>
            <ImageIcon size={40} className="text-[#1a0f0a]" strokeWidth={3} />
          </motion.div>
          <div className="px-8 py-6 rounded-[22px] text-center" style={{ background: 'white', border: '4px solid #1a0f0a', boxShadow: '6px 6px 0 #1a0f0a' }}>
            <p className="font-black text-2xl uppercase tracking-widest" style={{ color: '#1a0f0a' }}>AI Menyiapkan Kartu</p>
            <p className="text-base font-bold mt-2" style={{ color: 'rgba(26,15,10,0.5)' }}>Dari {formattedProvinceName}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full relative min-h-dvh" style={{ background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
      
      <div className="relative z-10 flex flex-col flex-1 max-w-4xl mx-auto w-full px-5 py-6">
        
        <header className="flex justify-between items-center mb-8 bg-white p-5 rounded-[22px] border-4 border-[#1a0f0a] shadow-[6px_6px_0_#1a0f0a]">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 border-[3px] border-[#1a0f0a] rounded-xl flex items-center justify-center transition-all">
              <ChevronLeft size={24} className="text-[#1a0f0a]" />
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#1a0f0a] uppercase tracking-wide">Memory Match</h2>
              <p className="text-gray-500 font-bold text-sm">Cocokkan budaya {formattedProvinceName}</p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="w-12 h-12 bg-[#FBBF24] hover:bg-yellow-500 border-[3px] border-[#1a0f0a] rounded-xl flex items-center justify-center transition-all shadow-[3px_3px_0_#1a0f0a]">
            <RefreshCw size={20} className="text-[#1a0f0a]" strokeWidth={3} />
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(i);
            return (
              <motion.div
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFlip(i)}
                className="h-36 md:h-48 flex items-center justify-center p-4 rounded-[22px] cursor-pointer text-center font-black shadow-[5px_5px_0_#1a0f0a] transition-all duration-300 text-xs md:text-sm leading-snug overflow-hidden border-4 border-[#1a0f0a]"
                style={{
                  background: matched.includes(i) ? '#10B981' : isFlipped ? '#FBBF24' : 'white',
                  color: matched.includes(i) ? 'white' : isFlipped ? '#1a0f0a' : 'transparent'
                }}
              >
                <span className="line-clamp-6" style={{ backgroundImage: !isFlipped ? "url('/logo.png')" : "none", backgroundSize: '50%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                  {isFlipped ? card.content : ""}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center font-black text-xl bg-white border-4 border-[#1a0f0a] shadow-[6px_6px_0_#1a0f0a] py-4 rounded-[22px] w-full max-w-sm mx-auto">
          TOTAL LANGKAH: <span className="text-[#F14C38]">{moves}</span>
        </div>
      </div>
    </div>
  );
}