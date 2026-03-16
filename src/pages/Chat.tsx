import { React, useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithGuide } from '../services/ai.service';
import { useTranslation } from '../hooks/useTranslation'; // ✨ ADDED
import LanguageSwitcher from '../components/LanguageSwitcher'; // ✨ ADDED

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

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

const BotAvatar = () => (
  <div className="w-14 h-14 shrink-0" style={{ marginBottom: '-6px' }}>
    <img
      src="/axara-bot-2.png"
      alt="Axara"
      className="w-full h-full object-contain"
      style={{ filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.2))' }}
    />
  </div>
);

export default function ChatPage() {
  const { t } = useTranslation(); // ✨ ADDED

  // ✨ DYNAMIC QUICK PROMPTS based on language
  const QUICK_PROMPTS = t.chat.greeting.includes('Hello') 
    ? [
        '🏯 Story about Majapahit',
        '🎭 Unique Bali traditions',
        '🍜 Javanese cuisine',
        '🎵 Traditional instruments',
      ]
    : [
        '🏯 Cerita tentang Majapahit',
        '🎭 Tradisi unik Bali',
        '🍜 Kuliner khas Jawa',
        '🎵 Alat musik tradisional',
      ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: t.chat.greeting, // ✨ TRANSLATED
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const responseText = await chatWithGuide(userMsg.text, history);

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: t.chat.greeting.includes('Hello') 
          ? 'Sorry, an error occurred. Please try again!'
          : 'Maaf, terjadi kesalahan. Coba lagi ya!', // ✨ TRANSLATED
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col w-full overflow-hidden relative"
      style={{ height: '100dvh', background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <header
        className="shrink-0 z-10 px-5 pt-3 pb-3 flex items-center gap-3"
        style={{ borderBottom: '4px solid #1a0f0a', background: '#F14C38' }}
      >
        <div className="w-12 h-12 shrink-0">
          <img
            src="/axara-bot-2.png"
            alt="Axara"
            className="w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))' }}
          />
        </div>
        <div className="flex-1">
          {/* ✨ TRANSLATED */}
          <h1 className="text-lg font-black leading-none text-white uppercase">
            Axara <span style={{ color: '#FBBF24' }}>
              {t.chat.greeting.includes('Hello') ? 'Guide' : 'Guide'}
            </span>
          </h1>
          <p className="text-[9px] font-black tracking-widest uppercase leading-none mt-0.5 text-white/60">
            {t.chat.greeting.includes('Hello') ? 'AI Nusantara Culture Guide' : 'AI Pemandu Budaya Nusantara'}
          </p>
        </div>

        {/* ✨ Language Switcher */}
        <div className="mr-2">
          <LanguageSwitcher variant="minimal" />
        </div>

        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
          style={{ background: '#1a0f0a', border: '2px solid #FBBF24' }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 5px #4ade80' }} />
          <span className="text-[10px] font-black text-white">Online</span>
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto z-10 px-4 py-5 space-y-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22 }}
            className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'model' ? (
              <BotAvatar />
            ) : (
              <div
                className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: '#FBBF24', border: '2.5px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a' }}
              >
                <span className="text-[9px] font-black" style={{ color: '#1a0f0a' }}>YOU</span>
              </div>
            )}

            <div
              className="max-w-[72%] px-4 py-3"
              style={{
                background: msg.role === 'user' ? '#F14C38' : 'white',
                border: '3px solid #1a0f0a',
                boxShadow: '3px 3px 0 #1a0f0a',
                borderRadius: msg.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
              }}
            >
              <p
                className="text-sm font-bold leading-relaxed whitespace-pre-wrap"
                style={{ color: msg.role === 'user' ? 'white' : '#1a0f0a' }}
              >
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-end gap-2"
            >
              <BotAvatar />
              <div
                className="px-5 py-4 flex items-center gap-2"
                style={{
                  background: 'white',
                  border: '3px solid #1a0f0a',
                  boxShadow: '3px 3px 0 #1a0f0a',
                  borderRadius: '4px 20px 20px 20px',
                }}
              >
                {[0, 0.18, 0.36].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: '#F14C38' }}
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && !isLoading && (
        <div className="shrink-0 z-10 px-4 pb-2">
          {/* ✨ TRANSLATED */}
          <p
            className="text-[9px] font-black uppercase tracking-widest mb-2 px-1"
            style={{ color: 'rgba(26,15,10,0.4)' }}
          >
            {t.chat.greeting.includes('Hello') ? 'Start with these questions:' : 'Mulai dengan pertanyaan ini:'}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="shrink-0 px-3 py-2 rounded-xl font-black text-[11px] uppercase whitespace-nowrap"
                style={{
                  background: 'white',
                  border: '2.5px solid #1a0f0a',
                  boxShadow: '2px 2px 0 #1a0f0a',
                  color: '#1a0f0a',
                  transition: 'all 0.1s',
                }}
                {...pressHandlers}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="shrink-0 z-10 px-4 py-3"
        style={{ borderTop: '4px solid #1a0f0a', background: '#F4F1E0' }}
      >
        <div className="flex gap-2 items-end">
          <div
            className="flex-1 rounded-2xl overflow-hidden"
            style={{ border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a', background: 'white' }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t.chat.placeholder} // ✨ TRANSLATED
              rows={1}
              className="w-full px-4 py-3 font-bold text-sm resize-none"
              style={{
                background: 'transparent',
                color: '#1a0f0a',
                outline: 'none',
                maxHeight: '120px',
              }}
            />
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 flex items-center justify-center rounded-2xl shrink-0"
            style={{
              background: !input.trim() || isLoading ? 'rgba(241,76,56,0.35)' : '#F14C38',
              border: '3px solid #1a0f0a',
              boxShadow: '3px 3px 0 #1a0f0a',
              color: 'white',
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.1s',
            }}
            {...(!(!input.trim() || isLoading) ? pressHandlers : {})}
          >
            {isLoading
              ? <Loader2 size={18} strokeWidth={3} className="animate-spin" />
              : <Send size={18} strokeWidth={3} />
            }
          </button>
        </div>
        {/* ✨ TRANSLATED */}
        <p
          className="text-center text-[9px] font-black uppercase tracking-widest mt-2"
          style={{ color: 'rgba(26,15,10,0.3)' }}
        >
          {t.chat.greeting.includes('Hello') 
            ? 'Enter to send · Shift+Enter for new line'
            : 'Enter untuk kirim · Shift+Enter untuk baris baru'}
        </p>
      </div>
    </div>
  );
}