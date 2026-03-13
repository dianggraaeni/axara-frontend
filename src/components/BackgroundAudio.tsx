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
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 1 }}
      onClick={togglePlay}
      className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-[#D4AF37] rounded-full shadow-2xl shadow-[#D4AF37]/50 border-4 border-white flex items-center justify-center hover:scale-110 transition-all group"
      title={isPlaying ? 'Matikan Musik' : 'Nyalakan Musik'}
    >
      {isPlaying ? (
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Volume2 size={24} className="text-white" />
        </motion.div>
      ) : (
        <VolumeX size={24} className="text-white/70" />
      )}

      <span className="absolute left-16 opacity-0 group-hover:opacity-100 bg-white text-primary text-xs font-bold px-3 py-1 rounded-lg shadow-md transition-opacity whitespace-nowrap pointer-events-none">
        {isPlaying ? 'Matikan Musik' : 'Nyalakan Musik'}
      </span>
    </motion.button>
  )
}