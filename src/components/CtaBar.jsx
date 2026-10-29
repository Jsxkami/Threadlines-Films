import { useEffect, useState } from 'react'
import { useT } from '../i18n.jsx'
import { useIsDesktop } from '../hooks.js'

// Phone-only sticky call to action. Shows once the hero has scrolled away; hides while the
// menu is open and once the contact form (or footer) is on screen.
export default function CtaBar({ menuOpen }) {
  const { t } = useT()
  const desktop = useIsDesktop()
  const [pastHero, setPastHero] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    if (desktop) return undefined
    const hero = document.getElementById('top')
    if (!hero) return undefined
    const io = new IntersectionObserver(([e]) =>
      setPastHero(!e.isIntersecting && e.boundingClientRect.bottom <= 0),
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [desktop])

  useEffect(() => {
    if (desktop) return undefined
    const targets = [document.getElementById('contact'), document.querySelector('footer')].filter(Boolean)
    const seen = new Set()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
      setAtEnd(seen.size > 0)
    })
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [desktop])

  if (desktop) return null
  const show = pastHero && !menuOpen && !atEnd
  return (
    <div className={`cta-bar ${show ? 'is-on' : ''}`} aria-hidden={!show}>
      <a href="#contact" className="btn solid" tabIndex={show ? 0 : -1}>
        {t.hero.cta}
      </a>
    </div>
  )
}
