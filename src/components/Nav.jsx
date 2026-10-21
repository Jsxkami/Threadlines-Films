import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT } from '../i18n.jsx'
import { brand } from '../content.js'
import { EASE } from '../hooks.js'

export default function Nav() {
  const { t, lang, setLang } = useT()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const links = [
    ['about', t.nav.about],
    ['films', t.nav.films],
    ['process', t.nav.process],
    ['collections', t.nav.collections],
    ['contact', t.nav.contact],
  ]

  return (
    <>
      <nav className="nav">
        <a href="#top" className="nav-brand" onClick={() => setOpen(false)}>
          {brand.name}
        </a>
        <div className="nav-right">
          <button
            type="button"
            className="nav-btn"
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <button
            type="button"
            className="nav-btn"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <ul>
              {links.map(([id, label], i) => (
                <li key={id}>
                  <motion.a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 1, ease: EASE, delay: 0.15 + i * 0.07 }}
                  >
                    <span className="menu-idx">0{i + 1}</span>
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="menu-foot">
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
              <a href={brand.instagramUrl} target="_blank" rel="noreferrer">
                {brand.instagram}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
