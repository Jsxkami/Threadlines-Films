import { lazy, Suspense, useState } from 'react'
import { AnimatePresence, m as motion } from 'framer-motion'
import Still from '../components/Still.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { useT } from '../i18n.jsx'
import { films } from '../content.js'
import { EASE } from '../hooks.js'

const Theater = lazy(() => import('../components/Theater.jsx'))

function Card({ film, info, index, onOpen }) {
  const { t } = useT()
  const n = film.videos.length
  return (
    <Reveal delay={index * 0.1}>
      <motion.button
        type="button"
        className="film-card"
        data-cursor="Play"
        onClick={() => onOpen(index)}
        aria-label={`${t.films.watch}: ${info.couple}`}
        initial="rest"
        whileHover="hover"
        whileFocus="hover"
      >
        <span className="film-media">
          <motion.span
            className="film-media-inner"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <Still src={film.cover} hue={film.hue} alt="" />
          </motion.span>
          <span className="film-idx">0{index + 1}</span>
          <span className="film-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
        </span>
        <span className="film-meta">
          <span className="eyebrow">{info.type}</span>
          <span className="display film-title">{info.couple}</span>
          <span className="film-tags">
            {film.videos.map((v) => (
              <span key={v.kind}>{t.films.kinds[v.kind]}</span>
            ))}
            <span className="muted">
              {n} {t.films.count[n === 1 ? 0 : 1]}
            </span>
          </span>
        </span>
      </motion.button>
    </Reveal>
  )
}

export default function Films() {
  const { t } = useT()
  const [active, setActive] = useState(null)

  return (
    <section id="films" className="films section">
      <div className="container">
        <div className="films-head">
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

        <div className="films-grid">
          {films.map((film, i) => (
            <Card key={film.id} film={film} info={t.filmItems[i]} index={i} onOpen={setActive} />
          ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <AnimatePresence>
          {active !== null && (
            <Theater
              key="theater"
              index={active}
              onChange={setActive}
              onClose={() => setActive(null)}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </section>
  )
}
