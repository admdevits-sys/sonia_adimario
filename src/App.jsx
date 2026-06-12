import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { ChevronDown, Heart, X, ChevronLeft, ChevronRight, Sparkles, Lock, Gift, Eye, Key, Star, Moon, Sun, Menu } from 'lucide-react'
import './index.css'

// Photo data
const photos = Array.from({ length: 31 }, (_, i) => ({
  id: i + 1,
  src: `/Fotos/foto_${i + 1}.jpg`,
  alt: `Momento especial ${i + 1}`
}))

// Timeline data
const timelineData = [
  { year: '2015', text: 'O dia que tudo mudou... Nos conhecemos e foi amor à primeira vista! ❤️' },
  { year: '2016', text: 'Primeiro Dia dos Namorados juntos. O início de uma linda história!' },
  { year: '2017', text: 'Momentos inesquecíveis, risos e muito amor compartilhado.' },
  { year: '2018', text: 'Crescendo juntos, superando desafios e fortalecendo nosso vínculo.' },
  { year: '2019', text: 'Cada dia ao seu lado é presente que agradeço de coração.' },
  { year: '2020', text: 'Mesmo nos difíceis, você foi minha luz e meu refúgio.' },
  { year: '2021', text: 'Renovando promessas e sonhando juntos com o futuro.' },
  { year: '2022', text: 'Mais um ano de cumplicidade, amor e momentos mágicos.' },
  { year: '2023', text: 'Gratidão e amor que cresce a cada dia.' },
  { year: '2024', text: '10 anos de amor - você é meu tudo, minha vida, meu lar!' },
  { year: '2025', text: 'Juntos para sempre, meu amor. Eu te amo para sempre!' },
]

// Pergunta Secreta - opções para Sonia adivinhar
const SECRET_QUESTION = {
  question: "Qual é o nome do nosso amor?",
  answers: ['amor', 'amor verdade', 'sonia', 'adio', 'adio e sonia', 'nossp', 'namoro'],
  hint: "Pense em quem está no meu coração..."
}

// Floating particles
function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 10 + Math.random() * 10,
    size: 8 + Math.random() * 15
  }))

  return (
    <div className="particles">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.id % 4 === 0 ? '#e11d48' : p.id % 4 === 1 ? '#fb7185' : p.id % 4 === 2 ? '#fecdd3' : '#ffd1d7'
          }}
          initial={{ y: '110vh', opacity: 0, scale: 0 }}
          animate={{
            y: [-50, '110vh'],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0, 1, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  )
}

// Intro/Password Screen - Surprise!
function IntroScreen({ onEnter }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [hints, setHints] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const hints_list = [
    "Começa com a letra A...",
    "O que eu sinto por você ❤️",
    "Seu nome está no meu corazón..."
  ]

  const checkAnswer = (e) => {
    e.preventDefault()
    const answer = input.toLowerCase().trim()

    if (SECRET_QUESTION.answers.some(a => a.toLowerCase() === answer)) {
      onEnter()
    } else {
      setIsShaking(true)
      setError('Tente novamente! 💔')
      setTimeout(() => {
        setIsShaking(false)
        setError('')
      }, 500)

      if (input.length > 0) {
        setHints(prev => Math.min(prev + 1, 3))
      }
    }
  }

  return (
    <motion.div
      className="intro-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5, rotate: 10 }}
    >
      <div className="intro-bg" />
      <FloatingParticles />

      <motion.div
        className="intro-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.div
          className="intro-icon"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Gift size={80} strokeWidth={1} />
        </motion.div>

        <h1 className="intro-title">Uma Surpresa Para Você</h1>
        <p className="intro-subtitle">Mas primeiro, prove que é você...</p>

        <form onSubmit={checkAnswer} className="intro-form">
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite a resposta..."
              className={`intro-input ${isShaking ? 'shake' : ''}`}
              autoComplete="off"
            />
          </div>

          <motion.button
            type="submit"
            className="intro-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Key size={18} />
            <span>Desbloquear</span>
          </motion.button>
        </form>

        {error && (
          <motion.p
            className="intro-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}

        {hints > 0 && (
          <motion.div
            className="intro-hints"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              className="hint-button"
              onClick={() => setShowHint(!showHint)}
            >
              <Eye size={16} />
              {showHint ? 'Esconder' : 'Ver'} Dica ({hints}/3)
            </button>
            {showHint && (
              <motion.p
                className="hint-text"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                💡 {hints_list[hints - 1]}
              </motion.p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Counting hearts decoration */}
      <div className="intro-hearts">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="intro-heart"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              fontSize: `${20 + Math.random() * 30}px`
            }}
          >
            ♥
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

// Confetti celebration
function Confetti() {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ['#e11d48', '#fb7185', '#fecdd3', '#ffd1d7', '#fff'][Math.floor(Math.random() * 5)]
  }))

  return (
    <div className="confetti-container">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            background: piece.color
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: '100vh',
            rotate: 720,
            opacity: 0
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: 'easeIn'
          }}
        />
      ))}
    </div>
  )
}

// Celebration Screen
function CelebrationScreen({ onComplete }) {
  return (
    <motion.div
      className="celebration-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
    >
      <Confetti />

      <motion.div
        className="celebration-content"
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: 1,
          rotate: 0,
          transition: { type: 'spring', stiffness: 200, damping: 15 }
        }}
      >
        <motion.div
          className="celebration-icon"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Heart size={100} fill="#e11d48" />
        </motion.div>

        <h1 className="celebration-title">Feliz Dia dos Namorados!</h1>
        <p className="celebration-subtitle">Para Sonia, meu amor ❤️</p>

        <motion.button
          className="celebration-button"
          onClick={onComplete}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={20} />
          <span>Clique para começar nossa jornada</span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// Hero
function Hero() {
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9])

  return (
    <motion.section
      id="hero"
      className="hero-section"
      style={{ opacity: heroOpacity, scale: heroScale }}
    >
      <div className="hero-clouds">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="hero-cloud"
            style={{
              left: `${i * 25 - 10}%`,
              animationDelay: `${i * 2}s`,
              opacity: 0.1 + Math.random() * 0.1
            }}
          />
        ))}
      </div>

      <motion.div
        className="hero-star"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Star size={40} fill="#fbbf24" stroke="#fbbf24" />
      </motion.div>

      <motion.p
        className="hero-date"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        12 de Junho • 2026
      </motion.p>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Feliz Dia dos<br />Namorados
      </motion.h1>

      <motion.p
        className="hero-names"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <span>Adimario</span> & <span>Sonia</span>
      </motion.p>

      <motion.p
        className="hero-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        Neste dia tão especial, quero te lembrar<br />
        o quanto você é a luz da minha vida.<br />
        Cada sorriso seu ilumina meu mundo.<br />
        Você é meu tudo. Eu te amo ❤️
      </motion.p>

      <motion.div
        className="hero-hearts"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
      >
        <Heart size={32} fill="#e11d48" />
        <Heart size={24} fill="#e11d48" />
        <Heart size={32} fill="#e11d48" />
      </motion.div>

      <motion.a
        href="#gallery"
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span>Nossos momentos</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={28} />
        </motion.div>
      </motion.a>
    </motion.section>
  )
}

// Gallery
function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const nextImage = useCallback((e) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [])

  const prevImage = useCallback((e) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, closeLightbox, nextImage, prevImage])

  useEffect(() => {
    if (lightboxOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  return (
    <>
      <section id="gallery" className="section gallery-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            <Sparkles size={28} />
            Nossos Momentos
          </h2>
          <p className="section-subtitle">31 memórias do nosso amor</p>
        </motion.div>

        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03, duration: 0.4 }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              onClick={() => openLightbox(index)}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <div className="gallery-overlay">
                <span className="gallery-number">{index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="lightbox-container"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={closeLightbox}>
                <X size={28} />
              </button>

              <button className="lightbox-nav lightbox-prev" onClick={prevImage}>
                <ChevronLeft size={28} />
              </button>

              <img
                className="lightbox-image"
                src={photos[currentIndex].src}
                alt={photos[currentIndex].alt}
              />

              <button className="lightbox-nav lightbox-next" onClick={nextImage}>
                <ChevronRight size={28} />
              </button>

              <div className="lightbox-footer">
                <span className="lightbox-counter">
                  {currentIndex + 1} / {photos.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Timeline
function Timeline() {
  return (
    <section className="section timeline-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">
          <Moon size={28} />
          Nossa Jornada
        </h2>
        <p className="section-subtitle">Uma história de amor que cresce</p>
      </motion.div>

      <div className="timeline">
        {timelineData.map((item, index) => (
          <motion.div
            key={item.year}
            className="timeline-item"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
          >
            <div className="timeline-marker">
              <Heart size={16} fill="#e11d48" />
            </div>
            <div className="timeline-content">
              <span className="timeline-year">{item.year}</span>
              <p className="timeline-text">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// Love Letter
function LoveLetter() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section id="letter" className="section letter-section">
      <motion.div
        className="letter-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="letter-header">
          <Sun size={32} className="letter-icon" />
        </div>

        <h2 className="letter-title">Para Minha Sonia</h2>

        <div className="letter-body">
          <p>Meu amor,</p>

          <p>
            Quando penso em tudo que vivemos juntos, não consigo deixar de sorrir.
            Você é a melhor parte dos meus dias, a razão do meu sorriso, o amor da minha vida.
            Cada momento ao seu lado é um presente que agradeço a Deus.
          </p>

          <p>
            Você tem um coração tão belo, uma alma tão pura, um amor tão grande.
            Você me completa de uma forma que palavras não conseguem explicar.
            Sou completamente apaixonado por você - não existe um dia que eu não te ame mais.
          </p>

          <p>
            Neste Dia dos Namorados, quero te dizer que você é tudo para mim.
            Você é minha namorada, minha melhor amiga, minha família, meu lar.
            Eu te amo mais do que ontem, e menos do que amanhã.
          </p>

          <p className="letter-signature">
            Para sempre,<br />
            <span>Adimario</span> ❤️
          </p>
        </div>

        <div className="letter-footer">
          <Sparkles size={20} />
          <span>Adimario & Sonia</span>
          <Sparkles size={20} />
        </div>
      </motion.div>
    </section>
  )
}

// Music Player with auto-play on first interaction
function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (started || !audioRef.current) return

    const handleFirstInteraction = () => {
      if (!started && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
          setStarted(true)
        }).catch(() => {})
      }
    }

    document.addEventListener('click', handleFirstInteraction, { once: true })
    document.addEventListener('keydown', handleFirstInteraction, { once: true })

    // Also try immediately (works on some browsers)
    audioRef.current.play().then(() => {
      setIsPlaying(true)
      setStarted(true)
    }).catch(() => {})

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [started])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {})
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="music-player-container">
      <audio
        ref={audioRef}
        src="/Musica/She.mp3"
        loop
      />
      <motion.button
        className={`music-player-button ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </motion.button>
      <span className="music-player-label">
        {isPlaying ? 'Pausar' : 'Tocar'} Música
      </span>
    </div>
  )
}

// Navigation
function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMobileOpen(false)

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">
          <Heart size={20} fill="#e11d48" />
        </div>
        <ul className="nav-links">
          <li><a href="#hero">Início</a></li>
          <li><a href="#gallery">Fotos</a></li>
          <li><a href="#timeline">Historia</a></li>
          <li><a href="#letter">Carta</a></li>
        </ul>
        <button className="nav-mobile-toggle" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </nav>

      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="nav-mobile-close" onClick={closeMenu}>
          <X size={28} />
        </button>
        <ul className="nav-mobile-links">
          <li><a href="#hero" onClick={closeMenu}>Início</a></li>
          <li><a href="#gallery" onClick={closeMenu}>Fotos</a></li>
          <li><a href="#timeline" onClick={closeMenu}>Historia</a></li>
          <li><a href="#letter" onClick={closeMenu}>Carta</a></li>
        </ul>
      </div>
    </>
  )
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-hearts">
        <Heart size={20} fill="#e11d48" />
      </div>
      <p className="footer-text">Feito com amor para Sonia</p>
      <p className="footer-date">Dia dos Namorados • 2026</p>
    </footer>
  )
}

// Main App
function App() {
  const [stage, setStage] = useState('intro') // intro -> celebration -> main

  const handleEnter = () => {
    setStage('celebration')
  }

  const handleCelebrationComplete = () => {
    setStage('main')
  }

  return (
    <div className="app">
      <div className="bg-effects" />

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <IntroScreen key="intro" onEnter={handleEnter} />
        )}

        {stage === 'celebration' && (
          <CelebrationScreen key="celebration" onComplete={handleCelebrationComplete} />
        )}

        {stage === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Navigation />
            <MusicPlayer />
            <Hero />
            <Gallery />
            <Timeline />
            <LoveLetter />
            <Footer />
            <FloatingParticles />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App