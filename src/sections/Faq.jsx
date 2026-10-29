import { useState } from 'react'
import { AnimatePresence, m as motion } from 'framer-motion'
import { Reveal } from '../components/Reveal.jsx'
import { useT } from '../i18n.jsx'
import { EASE } from '../hooks.js'

export default function Faq() {
  const { t } = useT()
  const [open, setOpen] = useState(0)

  return (
    <section className="faq section">
      <div className="container faq-grid">
        <div>
          <Reveal as="span" className="eyebrow">
            {t.faq.eyebrow}
          </Reveal>
          <Reveal as="h2" className="display section-title" delay={0.05}>
            {t.faq.title}
          </Reveal>
        </div>
        <div className="faq-list">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal className="faq-item" key={item.q} delay={i * 0.05}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="display">{item.q}</span>
                  <motion.span
                    className="faq-icon"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
