import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Still from '../components/Still.jsx'
import { useT } from '../i18n.jsx'
import { media } from '../content.js'
import { EASE } from '../hooks.js'

// The reel starts full-bleed and, as you scroll, shrinks into a cinema frame
// while the page background fades from ink to paper — a seamless hand-off to the next section.
export default function Hero() {
  const { t } = useT()
  const ref = useRef(null)
  const videoRef = useRef(null)
  const [soundOn, setSoundOn] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const clipPath = useTransform(scrollYProgress, (p) => {
    const k = Math.min(p / 0.75, 1)
    const e = 1 - Math.pow(1 - k, 3)
    const wide = typeof window !== 'undefined' && window.innerWidth >= 900
    const iy = e * (wide ? 15 : 12)
    const ix = e * (wide ? 20 : 7)
    return `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${e * 6}px)`
  })
  const scale = useTransform(scrollYProgress, [0, 0.75], [1.18, 1])
  const bg = useTransform(scrollYProgress, [0.35, 0.95], ['#0a0a0a', '#f7f5f1'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0])
  const copyY = useTransform(scrollYProgress, [0, 0.28], [0, -90])
  const captionOpacity = useTransform(scrollYProgress, [0.7, 0.92], [0, 1])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !soundOn
  }, [soundOn])

  return (
    <header id="top" className="hero" ref={ref}>
      <motion.div className="hero-sticky" style={{ backgroundColor: bg }}>
        <motion.div className="hero-frame" style={{ clipPath }}>
          <motion.div className="hero-media" style={{ scale }}>
            <Still hue={20} />
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={media.heroPoster}
            >
              <source src={media.heroVideo} type="video/mp4" />
            </video>
          </motion.div>
          <div className="hero-shade" />
          <button
            type="button"
            className="hero-sound"
            onClick={() => setSoundOn((s) => !s)}
            aria-pressed={soundOn}
          >
            {soundOn ? t.hero.soundOn : t.hero.soundOff}
          </button>
        </motion.div>

        <motion.div className="hero-copy" style={{ opacity: copyOpacity, y: copyY }}>
          <motion.span
            className="eyebrow hero-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.7 }}
          >
            {t.hero.eyebrow}
          </motion.span>
          <h1 className="display hero-title">
            {[t.hero.l1, t.hero.l2, t.hero.l3].map((line, i) => (
              <span className="line" key={i}>
                <motion.span
                  className="line-inner"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.3, ease: EASE, delay: 1.8 + i * 0.12 }}
                >
                  {i === 1 ? <em>{line}</em> : line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            className="hero-lower"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 2.3 }}
          >
            <p>{t.hero.sub}</p>
            <a href="#contact" className="btn on-video">
              {t.hero.cta}
            </a>
          </motion.div>
          <div className="hero-scroll">
            <span className="hero-scroll-line" />
            {t.hero.scroll}
          </div>
        </motion.div>

        <motion.div className="hero-caption" style={{ opacity: captionOpacity }}>
          <span>{t.hero.caption}</span>
          <span className="hero-caption-rule" />
          <span>{t.hero.eyebrow}</span>
        </motion.div>
      </motion.div>
    </header>
  )
}
