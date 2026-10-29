import { lazy, Suspense } from 'react'
import { Reveal } from '../components/Reveal.jsx'
import { useT } from '../i18n.jsx'
import { plans } from '../content.js'
import { fmt } from '../format.js'

const Builder = lazy(() => import('./Builder.jsx'))

export default function Collections({ onSend }) {
  const { t } = useT()
  return (
    <section id="collections" className="collections section">
      <div className="container">
        <div className="collections-head">
          <Reveal as="span" className="eyebrow">
            {t.collections.eyebrow}
          </Reveal>
          <Reveal as="h2" className="display section-title" delay={0.05}>
            {t.collections.title}
          </Reveal>
          <Reveal as="p" delay={0.1} className="collections-sub">
            {t.collections.sub}
          </Reveal>
        </div>

        <div className="plans">
          {plans.map((plan, i) => {
            const name = t.collections.names[plan.id]
            return (
              <Reveal
                className={`plan ${plan.featured ? 'featured' : ''}`}
                key={plan.id}
                delay={i * 0.1}
              >
                {plan.featured && <span className="plan-badge">{t.collections.popular}</span>}
                <span className="eyebrow">{name}</span>
                <span className="display plan-price">
                  {fmt(plan.price)}
                </span>
                <ul>
                  {t.collections.features[plan.id].map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`btn ${plan.featured ? 'light' : ''}`}
                  onClick={() => onSend(`${t.collections.pickMsg} ${name}${t.collections.pickMsgEnd}`)}
                >
                  {t.collections.book}
                </button>
              </Reveal>
            )
          })}
        </div>
        <p className="muted small collections-note">
          {t.collections.note}
          <br />
          {t.collections.area}
        </p>

        <Suspense fallback={<div className="builder" id="builder" style={{ minHeight: 600 }} />}>
          <Builder onSend={onSend} />
        </Suspense>
      </div>
    </section>
  )
}
