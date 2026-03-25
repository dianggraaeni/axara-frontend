import { React, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2 } from 'lucide-react'
import { chatWithGuide } from '../services/ai.service'

interface Message {
  id: string
  role: 'user' | 'model'
  text: string
}

const pressHandlers = {
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
    ;(e.currentTarget).style.boxShadow = '0 0 0 #1a0f0a'
    ;(e.currentTarget).style.transform = 'translate(2px,2px)'
  },
  onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
    ;(e.currentTarget).style.boxShadow = '3px 3px 0 #1a0f0a'
    ;(e.currentTarget).style.transform = 'none'
  },
  onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
    ;(e.currentTarget).style.boxShadow = '3px 3px 0 #1a0f0a'
    ;(e.currentTarget).style.transform = 'none'
  },
}

const BotAvatar = () => (
  <div className="shrink-0" style={{ width: 46, height: 46, marginBottom: '-4px' }}>
    <img
      src="/axara-bot-2.png"
      alt="Axara"
      className="w-full h-full object-contain"
      style={{ filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.18))' }}
    />
  </div>
)

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Halo! Aku Axara, pemandu budaya Nusantara kamu 🌺 Ada yang ingin kamu tanyakan?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 60)
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    try {
      const history = messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] }))
      const responseText = await chatWithGuide(userMsg.text, history)
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }])
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: 'Maaf, terjadi kesalahan. Coba lagi ya!' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Phone-sized chat panel, fixed bottom-right ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed z-50 flex flex-col"
            style={{
              /* phone portrait proportions: ~390×700 feel */
              width: '360px',
              height: '620px',
              bottom: '96px',
              right: '20px',
              background: '#F4F1E0',
              backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              border: '4px solid #1a0f0a',
              boxShadow: '8px 8px 0 #1a0f0a',
              borderRadius: '32px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              className="shrink-0 flex items-center gap-3 px-4 py-3"
              style={{ background: '#F14C38', borderBottom: '4px solid #1a0f0a' }}
            >
              <div style={{ width: 48, height: 48 }} className="shrink-0">
                <img
                  src="/axara-bot-2.png"
                  alt="Axara"
                  className="w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))' }}
                />
              </div>
              <div className="flex-1">
                <h2 className="font-black text-base leading-none text-white uppercase">
                  Axara <span style={{ color: '#FBBF24' }}>Bot</span>
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 4px #4ade80' }} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)', transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              >
                <X size={16} strokeWidth={3} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4" style={{ scrollbarWidth: 'none' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'model' ? (
                    <BotAvatar />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ background: '#FBBF24', border: '2px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a' }}
                    >
                      <span className="text-[8px] font-black" style={{ color: '#1a0f0a' }}>YOU</span>
                    </div>
                  )}
                  <div
                    className="px-3 py-2.5"
                    style={{
                      maxWidth: 'calc(100% - 60px)',
                      background: msg.role === 'user' ? '#F14C38' : 'white',
                      border: '2.5px solid #1a0f0a',
                      boxShadow: '2px 2px 0 #1a0f0a',
                      borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    }}
                  >
                    <p
                      className="text-xs font-bold leading-relaxed whitespace-pre-wrap"
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-2"
                  >
                    <BotAvatar />
                    <div
                      className="px-4 py-3 flex items-center gap-1.5"
                      style={{ background: 'white', border: '2.5px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a', borderRadius: '4px 18px 18px 18px' }}
                    >
                      {[0, 0.18, 0.36].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: '#F14C38' }}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="shrink-0 px-3 py-3"
              style={{ borderTop: '4px solid #1a0f0a', background: '#F4F1E0' }}
            >
              <div className="flex gap-2 items-center">
                <div
                  className="flex-1 rounded-2xl overflow-hidden"
                  style={{ border: '2.5px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a', background: 'white' }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Tanya AxaraBot..."
                    className="w-full px-4 py-3 font-bold text-sm"
                    style={{ background: 'transparent', color: '#1a0f0a', outline: 'none' }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-11 h-11 flex items-center justify-center rounded-xl shrink-0"
                  style={{
                    background: !input.trim() || isLoading ? 'rgba(241,76,56,0.35)' : '#F14C38',
                    border: '2.5px solid #1a0f0a',
                    boxShadow: '2px 2px 0 #1a0f0a',
                    color: 'white',
                    cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.1s',
                  }}
                  {...(!(!input.trim() || isLoading) ? pressHandlers : {})}
                >
                  {isLoading
                    ? <Loader2 size={16} strokeWidth={3} className="animate-spin" />
                    : <Send size={16} strokeWidth={3} />
                  }
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB — lingkaran merah, border putih ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 1.1 }}
        animate={{ scale: 0.9 }}
        transition={{ type: 'spring', delay: 1 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl border-4 border-white flex items-center justify-center hover:scale-110 transition-all group"
        style={{
          background: '#F14C38',
          boxShadow: '0 8px 24px rgba(241,76,56,0.5)',
        }}
        whileTap={{ scale: 0.92 }}
        title={isOpen ? 'Tutup Chat' : 'Axara Bot'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <X size={26} strokeWidth={3} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ width: 52, height: 52 }}
              className="flex items-center justify-center"
            >
              <img
                src="/axara-bot-2.png"
                alt="AxaraBot"
                className="w-full h-full object-contain"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="absolute right-20 opacity-0 group-hover:opacity-100 bg-white text-xs font-bold px-3 py-1 rounded-lg shadow-md transition-opacity whitespace-nowrap pointer-events-none"
          style={{ color: '#F14C38' }}
        >
          {isOpen ? 'Tutup Chat' : 'Axara Bot'}
        </span>
      </motion.button>
    </div>
  )
}