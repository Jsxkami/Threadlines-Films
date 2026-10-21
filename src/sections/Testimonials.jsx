import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT } from '../i18n.jsx'
import { EASE } from '../hooks.js'

const variants = {
  enter: (d) => ({ opacity: 0, x: 70 * d }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: -70 * d }),
}

export default function Testimonials() {
  const { t } = useT()
  const items = t.testimonials.items
  const [[index, dir], setState] = useState([0, 1])

  const go = (d) => setState(([i]) => [(i + d + items.length) % items.length, d])

  useEffect(() => {
    const id = setTimeout(() => go(1), 9000)
    return () => clearTimeout(id)
  }, [index])

  const item = items[index]

  return (
    <section className="testimonials section on-dark">
      <div className="container">
        <span className="eyebrow">{t.testimonials.eyebrow}</span>
        <div className="quote-wrap">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={index}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8, ease: EASE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1)
                else if (info.offset.x > 80) go(-1)
              }}
            >
              <blockquote className="display">
                <em>“</em>
                {item.quote}
                <em>”</em>
              </blockquote>
              <figcaption>
                <span className="display">{item.name}</span>
                <span className="eyebrow muted">{item.place}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="quote-controls">
          <button type="button" onClick={() => go(-1)} aria-label={t.testimonials.prev}>
            ←
          </button>
          <span className="eyebrow muted">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          <button type="button" onClick={() => go(1)} aria-label={t.testimonials.next}>
            →
          </button>
        </div>
      </div>
    </section>
  )
}
