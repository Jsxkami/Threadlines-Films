import { useEffect, useRef, useState } from 'react'
import { m as motion } from 'framer-motion'
import { useT } from '../i18n.jsx'
import { films } from '../content.js'
import { EASE, lockScroll, useIsDesktop } from '../hooks.js'

// Project modal: the film player on the left, the story and its other films on the right.
// Phones stack it into a single scrolling column.
export default function Theater({ index, onChange, onClose }) {
  const { t } = useT()
  const desktop = useIsDesktop()
  const film = films[index]
  const info = t.filmItems[index]
  const [videoIdx, setVideoIdx] = useState(0)
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const video = film.videos[videoIdx] ?? film.videos[0]
  const count = films.length

  // New project → start on its first film.
  useEffect(() => setVideoIdx(0), [index])

  useEffect(() => {
    const unlock = lockScroll(!desktop)
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab') return
      const items = panelRef.current?.querySelectorAll('button, a[href], video')
      if (!items?.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unlock()
    }
  }, [desktop, onClose])

  const go = (d) => onChange((index + d + count) % count)

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={info.couple}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <button ref={closeRef} type="button" className="modal-close" onClick={onClose}>
          {t.films.close}
          <span aria-hidden="true">×</span>
        </button>

        <div className="modal-media">
          <div className="modal-stage">
            <video
              key={video.src}
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              controlsList="nodownload"
            />
          </div>
        </div>

        <div className="modal-side">
          <div className="modal-info">
            <span className="eyebrow">{info.type}</span>
            <h3 className="display modal-title">{info.couple}</h3>
            <dl className="modal-meta">
              {info.place && (
                <div>
                  <dt>{t.films.labels.place}</dt>
                  <dd>{info.place}</dd>
                </div>
              )}
              {info.date && (
                <div>
                  <dt>{t.films.labels.date}</dt>
                  <dd>{info.date}</dd>
                </div>
              )}
              {info.services?.length > 0 && (
                <div className="modal-meta-wide">
                  <dt>{t.films.labels.services}</dt>
                  <dd>{info.services.join(' · ')}</dd>
                </div>
              )}
            </dl>
            <p className="modal-blurb">{info.blurb}</p>
          </div>

          <div className="modal-list">
            <span className="eyebrow muted">{t.films.inProject}</span>
            <ul>
              {film.videos.map((v, i) => (
                <li key={v.src}>
                  <button
                    type="button"
                    className={`modal-thumb ${i === videoIdx ? 'on' : ''}`}
                    onClick={() => setVideoIdx(i)}
                    aria-pressed={i === videoIdx}
                  >
                    <span className="modal-thumb-img">
                      <img src={v.poster} alt="" loading="lazy" decoding="async" />
                      <span className="modal-thumb-play" aria-hidden="true" />
                    </span>
                    <span className="modal-thumb-txt">
                      <span>{t.films.kinds[v.kind]}</span>
                      <small>{v.duration}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {count > 1 && (
            <div className="modal-nav">
              <button type="button" onClick={() => go(-1)}>
                ← {t.films.prev}
              </button>
              <button type="button" onClick={() => go(1)}>
                {t.films.next} →
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
