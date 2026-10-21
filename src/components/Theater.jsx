import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Still from './Still.jsx'
import { useT } from '../i18n.jsx'
import { EASE } from '../hooks.js'

// Fullscreen "theater mode": letterbox bars close in, the film plays in the middle.
export default function Theater({ film, info, onClose }) {
  const { t } = useT()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      className="theater"
      role="dialog"
      aria-modal="true"
      aria-label={info.couple}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="theater-bar theater-top"
        initial={{ height: 0 }}
        animate={{ height: '11vh' }}
        exit={{ height: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
      <motion.div
        className="theater-bar theater-bottom"
        initial={{ height: 0 }}
        animate={{ height: '11vh' }}
        exit={{ height: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      <motion.div
        className="theater-stage"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      >
        {film.vimeo ? (
          <iframe
            src={`https://player.vimeo.com/video/${film.vimeo}?autoplay=1&title=0&byline=0&portrait=0`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={info.couple}
          />
        ) : film.video ? (
          <video src={film.video} controls autoPlay playsInline />
        ) : (
          <div className="theater-empty">
            <Still hue={film.hue} src={film.still} />
            <p>{t.films.empty}</p>
          </div>
        )}
      </motion.div>

      <div className="theater-info">
        <span className="display">{info.couple}</span>
        <span>{info.place}</span>
      </div>
      <button type="button" className="theater-close" onClick={onClose}>
        {t.films.close}
      </button>
    </motion.div>
  )
}
