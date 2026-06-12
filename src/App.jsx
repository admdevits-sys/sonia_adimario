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
  { year: '1996', text: 'Onde tudo começou. Nos conhecemos através de Lécia; vocês me chamavam de NINO. Ela ficava falando de você o tempo todo e dizia que eu era muito inteligente e engraçado.' },
  { year: '1997', text: 'Fui trabalhar no Hotel da Bahia no Campo Grande, onde passamos vários momentos de felicidades e saímos em um bloco de carnaval: o VIRA LATA.' },
  { year: '1998', text: 'Continuávamos o namoro. Saíamos ao final de semana para o Pelourinho ou para alguns bazinhos com Valtercio, Jurandi, Lécia etc.' },
  { year: '1999', text: 'E assim foi o namoro, apesar de algumas briguinhas besta, mas gostávamos um do outro.' },
  { year: '2000', text: 'Fui trabalhar na WA Sistemas e você conheceu Andre, que toca violão, Fatima Jardim, que trabalhava comigo, e outros...' },
  { year: '2001', text: 'Você foi morar em Brasília, mas continuamos o namoro por telefone. Haja ligação telefônica! Conversávamos por telefone por horas etc.' },
  { year: '2002', text: 'Você ainda em Brasília e nós namorando por telefone. Aos finais de semana eu sequer saía de casa. Você me enviava diversas cartas escritas a mão com frases de amor.' },
  { year: '2003', text: 'Você retornou de Brasília e foi morar com Nety/Ceará. Começou seu trabalho no SAC da BARRA.' },
  { year: '2004', text: 'Depois você foi morar em Jacy, mas logo depois vagou uma casa de Val e alugou. Lembro até hoje: comprei todos os móveis (mesa, cadeiras, geladeira, sofá, cama, fogão etc.) tudo novo... lembro ainda do quanto você me agradeceu [eu em lágrimas].' },
  { year: '2005', text: 'Eu já estava trabalhando na BahiaPet junto com Mário. Foi o ano da minha formatura na Rui Barbosa. Foi um momento muito especial pra mim e acho que pra você também.' },
  { year: '2006', text: 'O namoro continuava. Frequentávamos a casa de Josias e Lindai. Fazíamos pequenas viagens pra ilha, Mutá, na casa da ilha da mãe de Pedro e outros lugares... E aí você ficou grávida de Júlia!!! Foi uma supresa e não esperávamos.' },
  { year: '2007', text: 'Ano de nascimento de Júlia. Você saiu do trabalho do SAC e fomos morar na casa de minha mãe. Eu me programei financeiramente para comprar tudo de melhor pra Júlia e conseguir juntar uma grana boa pra esperar esse tão esperado nascimento dela. Muita alegria!' },
  { year: '2008', text: 'Aqui foi o ano que abrimos a empresa com Murilo e fazíamos alguns passeios com Fatima, Murilo e família.' },
  { year: '2009', text: 'Ano de muitas viagens a trabalho e de cuidados com Júlia.' },
  { year: '2010', text: 'Júlia começa a frequentar a escola e nosso amor por ela cada vez maior. Nossa primeira viagem pra Gramado.' },
  { year: '2011', text: 'Já estávamos arrumando pra ir morar em Itapoan.' },
  { year: '2012', text: 'Passamos 5 anos em Itapoan com felicidades, alegrias e tristezas que fazem parte no relacionamento de qualquer casal.' },
  { year: '2013', text: 'Sua formatura de Enfermagem. Apesar da luta e dos problemas, éramos felizes.' },
  { year: '2014', text: 'Continuamos construindo nosso amor dia após dia.' },
  { year: '2017', text: 'Voltamos para casa de minha mãe agora ela não mais estando lá, pra passar uma chuva, e juntar uma grana pra comprarmos outro apartamento.' },
  { year: '2018', text: 'Você começou a frequentar a Igreja do Monte e logo depois comecei a frequentar também. Foi uma experiência muito boa.' },
  { year: '2019', text: 'Ano que começou a pandemia, e passamos ilesos. Começamos a utilizar suplementos alimentares e outros.' },
  { year: '2020', text: 'Pandemia continuava.' },
  { year: '2021', text: 'Encontramos o nosso apartamento com essa vista maravilhosa!!! Era tudo que eu queria te dar: mais conforto, um lar, tudo isso por amor a você e Júlia.' },
  { year: '2022', text: 'Preparando as coisas para a nossa nova moradia. Muita feliz. Orei pra trazer coisas boas no nosso relacionamento.' },
  { year: '2023', text: 'Apesar das divergências de pensamento e no relacionamento, seguimos em frente e com fé.' },
  { year: '2024', text: 'Fortalecendo a fé e alinhando nosso amor. O tempo passa rápido. Relacionamento entre um casal não é nada fácil manter. Algumas imaturidades minhas, mas sou e serei sempre grato por tudo que você continuava a fazer, tanto no nosso relacionamento como com Júlia.' },
  { year: '2025', text: 'Realmente você é uma pessoa incrível. Desculpa pela minha demora. Quero mudar nossa história e que você se sinta amada e realizada...' },
  { year: '2026', text: 'Este é o ano da minha maior mudança: o ano de construir uma nova história, do meu amadurecimento. Acredite: as pessoas mudam, amadurecem e aprendem com os próprios erros... Quero ter a honra de te mostrar isso e provar que o meu amor por você continua vivo. Sei que, em alguns momentos, ele pareceu esfriar, mas os meus sentimentos permanecem aqui, e estou disposto(a) a lutar por nós.... Quero reconquistar sua confiança, seu carinho e mostrar, com atitudes, tudo aquilo que as palavras nem sempre conseguem expressar.' },
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
        <p className="celebration-subtitle">Para Sônia, meu amor ❤️</p>

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
        <span>Adimario</span> & <span>Sônia</span>
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

        <h2 className="letter-title">Para Minha Sônia</h2>

        <div className="letter-body">
          <p>Meu amor, Sônia,</p>

          <p>
            Neste Dia dos Namorados, meu coração me levou até você através destas palavras.
            Não para lembrar apenas o que vivemos, mas para falar sobre tudo o que ainda acredito que podemos viver juntos.
          </p>

          <p>
            O tempo nos ensinou muitas coisas. Houve momentos de alegria, momentos difíceis, erros, silêncios e distâncias.
            Mas, apesar de tudo, existe algo que continua firme dentro de mim: o amor que sinto por você.
          </p>

          <p>
            Este é o ano da minha mudança, da reconstrução dos meus sonhos e da vontade sincera de escrever uma nova história.
            Aprendi que amar não é apenas sentir, mas também cuidar, compreender, reconhecer falhas e lutar por aquilo que realmente importa.
            E você sempre foi a pessoa mais importante da minha vida.
          </p>

          <p>
            Talvez, em alguns momentos, o nosso amor tenha parecido enfraquecido pelas dificuldades.
            Mas nunca deixou de existir dentro de mim. Pelo contrário, a saudade me fez entender ainda mais o valor da sua presença,
            do seu sorriso, da sua companhia e de tudo o que construímos juntos.
          </p>

          <p>
            Hoje, com humildade e sinceridade, quero pedir uma nova oportunidade para mostrar que as pessoas podem mudar,
            amadurecer e se tornar melhores. Quero provar, não apenas com palavras, mas com atitudes, que meu amor por você continua vivo
            e que estou disposto a lutar por nós todos os dias.
          </p>

          <p>
            Sônia, neste Dia dos Namorados, o meu maior desejo não é receber presentes, mas reconquistar o espaço que sempre existiu entre os nossos corações.
            Quero voltar a sonhar ao seu lado, compartilhar planos, vencer desafios juntos e construir um futuro que faça jus à nossa história.
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
      <p className="footer-text">Feito com amor para Sônia</p>
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