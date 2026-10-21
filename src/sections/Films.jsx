import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Still from '../components/Still.jsx'
import Theater from '../components/Theater.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { useT } from '../i18n.jsx'
import { films } from '../content.js'
import { EASE, useIsDesktop } from '../hooks.js'

function Card({ film, info, index, onOpen }) {
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(index)
    }
  }
  return (
    <motion.article
      className="film-card"
      data-cursor="Play"
      role="button"
      tabIndex={0}
      aria-label={`${info.couple} — ${info.place}`}
      onClick={() => onOpen(index)}
      onKeyDown={onKey}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
    >
      <div className="film-media">
        <motion.div
          className="film-media-inner"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
          transition={{ duration: 1.3, ease: EASE }}
        >
          <Still src={film.still} hue={film.hue} alt={info.couple} />
        </motion.div>
        <span className="film-idx">0{index + 1}</span>
        {film.duration && <span className="film-dur">{film.duration}</span>}
      </div>
      <div className="film-meta">
        <span className="eyebrow">{info.type}</span>
        <h3 className="display">{info.couple}</h3>
        <p>{info.place}</p>
      </div>
    </motion.article>
  )
}

// Desktop: vertical scroll drives a horizontal "film strip". Mobile: native swipe + snap.
export default function Films() {
  const { t } = useT()
  const desktop = useIsDesktop()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [dist, setDist] = useState(0)
  const [active, setActive] = useState(null)

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      setDist(Math.max(0, trackRef.current.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [desktop, t])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])

  const openFilm = (i) => setActive(i)

  return (
    <section
      id="films"
      className={`films ${desktop ? 'is-desktop' : ''}`}
      ref={sectionRef}
      style={desktop ? { height: `calc(${dist}px + 100vh)` } : undefined}
    >
      <div className="films-sticky">
        <div className="container films-head">
          <div>
            <Reveal as="span" className="eyebrow">
              {t.films.eyebrow}
            </Reveal>
            <Reveal as="h2" className="display section-title" delay={0.05}>
              {t.films.title}
            </Reveal>
          </div>
          <Reveal as="p" className="films-sub" delay={0.1}>
            {t.films.sub}
          </Reveal>
        </div>

        <div className="films-viewport">
          <motion.div className="films-track" ref={trackRef} style={desktop ? { x } : undefined}>
            {films.map((film, i) => (
              <Card key={film.id} film={film} info={t.filmItems[i]} index={i} onOpen={openFilm} />
            ))}
            <span className="films-end" aria-hidden="true" />
          </motion.div>
        </div>

        {desktop && (
          <div className="container films-progress">
            <span className="eyebrow muted">{t.films.hint}</span>
            <div className="films-progress-bar">
              <motion.span style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {active !== null && (
          <Theater
            key="theater"
            film={films[active]}
            info={t.filmItems[active]}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
