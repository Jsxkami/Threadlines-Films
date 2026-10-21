import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Reveal } from '../components/Reveal.jsx'
import { useT } from '../i18n.jsx'

export default function Process() {
  const { t } = useT()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.65', 'end 0.75'] })

  return (
    <section id="process" className="process section">
      <div className="container process-grid">
        <div className="process-head">
          <Reveal as="span" className="eyebrow">
            {t.process.eyebrow}
          </Reveal>
          <Reveal as="h2" className="display section-title" delay={0.05}>
            {t.process.title}
          </Reveal>
        </div>

        <div className="process-steps" ref={ref}>
          <div className="process-line" aria-hidden="true">
            <motion.span style={{ scaleY: scrollYProgress }} />
          </div>
          {t.process.steps.map((s) => (
            <Reveal className="step" key={s.n}>
              <span className="display step-n">{s.n}</span>
              <div>
                <h3 className="display">{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
