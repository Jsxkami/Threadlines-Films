import { useEffect, useMemo, useState } from 'react'
import { m as motion, useSpring, useTransform } from 'framer-motion'
import { Reveal } from '../components/Reveal.jsx'
import { useT } from '../i18n.jsx'
import { builderConfig as cfg, plans } from '../content.js'
import { EASE } from '../hooks.js'
import { fmt } from '../format.js'

function AnimatedPrice({ value }) {
  const spring = useSpring(value, { stiffness: 110, damping: 22 })
  useEffect(() => {
    spring.set(value)
  }, [value, spring])
  const text = useTransform(spring, (v) => fmt(Math.round(v / 10) * 10))
  return <motion.span>{text}</motion.span>
}

function Timeline({ hours, t }) {
  const hourLabel = (h) => (Number.isInteger(h) ? `${h}` : h.toFixed(1))
  return (
    <div className="timeline">
      <p className="eyebrow muted">{t.builder.day}</p>
      <div className="timeline-bar" aria-hidden="true">
        {cfg.moments.map((m) => {
          const dur = m.end - m.start
          const fill = Math.max(0, Math.min(1, (hours - m.start) / dur))
          return (
            <div className="seg" key={m.id} style={{ flex: `${dur} 1 0` }}>
              <motion.span
                className="seg-fill"
                initial={false}
                animate={{ scaleX: fill }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
          )
        })}
      </div>
      <ul className="timeline-list">
        {cfg.moments.map((m) => {
          const covered = hours >= m.end
          const partial = hours > m.start && hours < m.end
          return (
            <motion.li
              key={m.id}
              initial={false}
              animate={{ opacity: covered ? 1 : partial ? 0.7 : 0.3 }}
              transition={{ duration: 0.4 }}
            >
              <span className={`dot ${covered ? 'on' : partial ? 'half' : ''}`} />
              <span>{t.builder.moments[m.id]}</span>
              <span className="muted">
                {hourLabel(m.start)}–{hourLabel(m.end)}
                {t.builder.hoursUnit}
              </span>
              <span className="sr-only">{covered ? t.builder.covered : t.builder.notCovered}</span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Builder({ onSend }) {
  const { t } = useT()
  const [planId, setPlanId] = useState(cfg.defaultPlan)
  const plan = plans.find((p) => p.id === planId)
  const [hours, setHours] = useState(plan.hours)
  const [extras, setExtras] = useState(cfg.defaultExtras)

  const total = useMemo(() => {
    const extrasSum = extras.reduce((sum, k) => sum + cfg.extras[k], 0)
    return plan.price + (hours - plan.hours) * cfg.perHour + extrasSum
  }, [plan, hours, extras])

  const pickPlan = (p) => {
    setPlanId(p.id)
    setHours(p.hours)
  }

  const toggle = (key) =>
    setExtras((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]))

  const send = () => {
    const names = extras.map((k) => t.builder.extraNames[k])
    const lines = [
      t.builder.msgIntro,
      `• ${t.builder.msgHours}: ${hours}${t.builder.hoursUnit}`,
      `• ${t.builder.msgCollection}: ${t.collections.names[plan.id]}`,
      `• ${t.builder.msgDeliverables}: ${names.length ? names.join(', ') : '—'}`,
      `• ${t.builder.msgTotal}: ${fmt(total)}`,
    ]
    onSend(lines.join('\n'))
  }

  const pct = ((hours - plan.hours) / (cfg.maxHours - plan.hours)) * 100

  return (
    <div className="builder" id="builder">
      <div className="builder-head">
        <Reveal as="span" className="eyebrow">
          {t.builder.eyebrow}
        </Reveal>
        <Reveal as="h3" className="display builder-title" delay={0.05}>
          {t.builder.title}
        </Reveal>
        <Reveal as="p" delay={0.1}>
          {t.builder.sub}
        </Reveal>
      </div>

      <div className="builder-body">
        <div className="builder-controls">
          <div className="control">
            <label htmlFor="hours" className="eyebrow muted">
              {t.builder.hours}
            </label>
            <div className="hours-row">
              <span className="display hours-n">
                {hours}
                <small>{t.builder.hoursUnit}</small>
              </span>
              <input
                id="hours"
                type="range"
                min={plan.hours}
                max={cfg.maxHours}
                step={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                style={{ '--pct': `${pct}%` }}
              />
            </div>
          </div>

          <div className="control">
            <span className="eyebrow muted">{t.builder.collection}</span>
            <div className="segmented" role="group" aria-label={t.builder.collection}>
              {plans.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className={planId === p.id ? 'active' : ''}
                  onClick={() => pickPlan(p)}
                  aria-pressed={planId === p.id}
                >
                  {planId === p.id && (
                    <motion.span
                      layoutId="crew-pill"
                      className="pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="pill-label">{t.collections.names[p.id]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control">
            <span className="eyebrow muted">{t.builder.extras}</span>
            <div className="chips">
              {Object.keys(cfg.extras).map((key) => {
                const on = extras.includes(key)
                return (
                  <motion.button
                    type="button"
                    key={key}
                    className={`chip ${on ? 'on' : ''}`}
                    onClick={() => toggle(key)}
                    aria-pressed={on}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span className="chip-mark">{on ? '✓' : '+'}</span>
                    {t.builder.extraNames[key]}
                    <span className="chip-price">+{fmt(cfg.extras[key])}</span>
                  </motion.button>
                )
              })}
            </div>
            <p className="muted small">{t.builder.included}</p>
          </div>
        </div>

        <div className="builder-result">
          <Timeline hours={hours} t={t} />
          <div className="estimate">
            <span className="eyebrow muted">{t.builder.estimate}</span>
            <span className="display estimate-n">
              <AnimatedPrice value={total} />
            </span>
            <p className="muted small">{t.builder.disclaimer}</p>
            <button type="button" className="btn solid" onClick={send}>
              {t.builder.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
