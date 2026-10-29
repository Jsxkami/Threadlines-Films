import { useEffect, useLayoutEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { AnimatePresence, m as motion } from 'framer-motion'
import { useT } from '../i18n.jsx'
import { brand } from '../content.js'
import { EASE, lockScroll, useActiveSection, useIsDesktop } from '../hooks.js'

const SECTION_IDS = ['about', 'films', 'process', 'collections', 'contact']
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Nav({ open, setOpen }) {
  const { t, lang, setLang } = useT()
  const desktop = useIsDesktop()
  const menuBtnRef = useRef(null)
  const menuRef = useRef(null)
  const active = useActiveSection(desktop ? [] : SECTION_IDS)

  useLayoutEffect(() => {
    if (!open) return undefined
    return lockScroll(!desktop)
  }, [open, desktop])

  // Keep the page behind the menu out of the tab order and the accessibility tree.
  useEffect(() => {
    if (!open) return undefined
    const behind = document.querySelectorAll('main, footer')
    behind.forEach((el) => {
      el.inert = true
    })
    return () =>
      behind.forEach((el) => {
        el.inert = false
      })
  }, [open])

  // Move focus into the menu on open, back to the toggle on close.
  useEffect(() => {
    if (!open) return undefined
    const btn = menuBtnRef.current
    menuRef.current?.querySelector('a')?.focus({ preventScroll: true })
    return () => btn?.focus({ preventScroll: true })
  }, [open])

  // Escape closes; Tab wraps between the nav bar and the menu.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key !== 'Tab' || !open) return
      const items = [
        ...document.querySelectorAll('.nav a[href], .nav button'),
        ...(menuRef.current?.querySelectorAll(FOCUSABLE) ?? []),
      ]
      if (!items.length) return
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
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const links = SECTION_IDS.map((id) => [id, t.nav[id]])

  // Phones: close first (which unlocks and restores the scroll offset), then glide to the
  // section; scroll-margin-top in the CSS leaves room for the fixed nav.
  // Desktop keeps the plain anchor behaviour.
  const go = (id) => (e) => {
    if (desktop) {
      setOpen(false)
      return
    }
    e.preventDefault()
    flushSync(() => setOpen(false))
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const menuMotion = desktop
    ? {
        initial: { clipPath: 'inset(0 0 100% 0)' },
        animate: { clipPath: 'inset(0 0 0% 0)' },
        exit: { clipPath: 'inset(0 0 100% 0)' },
        transition: { duration: 0.9, ease: EASE },
      }
    : {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
        transition: { duration: 0.32, ease: EASE },
      }

  const linkMotion = (i) =>
    desktop
      ? {
          initial: { y: '110%' },
          animate: { y: 0 },
          exit: { y: '110%' },
          transition: { duration: 1, ease: EASE, delay: 0.15 + i * 0.07 },
        }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          transition: { duration: 0.4, ease: EASE, delay: 0.08 + i * 0.04 },
        }

  return (
    <>
      <nav className="nav" aria-label="Main">
        <a href="#top" className="nav-brand" onClick={open ? go('top') : undefined}>
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
            ref={menuBtnRef}
            type="button"
            className="nav-btn"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="site-menu"
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div id="site-menu" className="menu" ref={menuRef} {...menuMotion}>
            <ul>
              {links.map(([id, label], i) => (
                <li key={id}>
                  <motion.a
                    href={`#${id}`}
                    onClick={go(id)}
                    aria-current={active === id ? 'true' : undefined}
                    {...linkMotion(i)}
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
