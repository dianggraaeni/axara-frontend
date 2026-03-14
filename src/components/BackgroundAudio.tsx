import { useState, useEffect, MouseEvent } from 'react'
import useSound from 'use-sound'
import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const [play, { pause }] = useSound('/sounds/background.mp3', {
    volume: 0.3,
    loop: true,
  })

  useEffect(() => {
    const startAudio = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        setIsPlaying(true)
        play()
      }
    }

    window.addEventListener('click', startAudio)
    return () => window.removeEventListener('click', startAudio)
  }, [hasInteracted, play])

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation()
    if (isPlaying) {
      pause()
    } else {
      play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <motion.button
      initial={{ scale: 1.1 }}
      animate={{ scale: 0.9 }}
      transition={{ type: 'spring', delay: 1 }}
      onClick={togglePlay}
      className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-[#D4AF37] rounded-full border-4 border-white flex items-center justify-center hover:scale-110 transition-all group"
      style={{
        boxShadow: isPlaying
          ? '0 8px 24px rgba(212,175,55,0.6), 0 0 0 6px rgba(212,175,55,0.2), 0 0 0 12px rgba(212,175,55,0.08)'
          : '0 8px 24px rgba(212,175,55,0.4)',
        transition: 'box-shadow 0.4s ease',
      }}
      title={isPlaying ? 'Matikan Musik' : 'Nyalakan Musik'}
    >
      {isPlaying ? (
        <>
          {/* Pulse ring saat musik nyala */}
          <motion.span
            className="absolute inset-0 rounded-full bg-[#D4AF37]"
            animate={{ scale: [1, 1.5, 1.5], opacity: [0.4, 0, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-[#D4AF37]"
            animate={{ scale: [1, 1.5, 1.5], opacity: [0.3, 0, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut', delay: 0.6 }}
          />
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Volume2 size={24} className="text-white relative z-10" />
          </motion.div>
        </>
      ) : (
        <VolumeX size={24} className="text-white/70" />
      )}

      <span className="absolute right-20 opacity-0 group-hover:opacity-100 bg-white text-xs font-bold px-3 py-1 rounded-lg shadow-md transition-opacity whitespace-nowrap pointer-events-none"
        style={{ color: '#D4AF37' }}
      >
        {isPlaying ? 'Matikan Musik' : 'Nyalakan Musik'}
      </span>
    </motion.button>
  )
}