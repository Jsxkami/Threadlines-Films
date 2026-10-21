import { useEffect, useState } from 'react'
import { Reveal } from '../components/Reveal.jsx'
import { useT } from '../i18n.jsx'
import { brand } from '../content.js'

// Set VITE_FORM_ENDPOINT (e.g. a Formspree URL) in Vercel to post the form.
// Without it, the form opens the visitor's email app with the message ready.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT

const EMPTY = { name: '', email: '', date: '', where: '', budget: '', message: '' }

export default function Contact({ prefill }) {
  const { t } = useT()
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (prefill) setForm((f) => ({ ...f, message: prefill }))
  }, [prefill])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!ENDPOINT) {
      const subject = encodeURIComponent(`${brand.name} — ${form.name}`)
      const body = encodeURIComponent(
        `${form.message}\n\n${t.contact.name}: ${form.name}\n${t.contact.mail}: ${form.email}\n${t.contact.date}: ${form.date}\n${t.contact.where}: ${form.where}\n${t.contact.budget}: ${form.budget}`,
      )
      window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('bad response')
      setStatus('sent')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section className="final-cta on-dark">
        <div className="container">
          <Reveal as="span" className="eyebrow">
            {t.cta.eyebrow}
          </Reveal>
          <Reveal as="h2" className="display cta-title" delay={0.05}>
            {t.cta.title}
          </Reveal>
          <Reveal className="cta-buttons" delay={0.12}>
            <a href="#contact" className="btn">
              {t.cta.button}
            </a>
            <a href={`mailto:${brand.email}?subject=${encodeURIComponent(t.cta.secondary)}`} className="btn">
              {t.cta.secondary}
            </a>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="contact section">
        <div className="container contact-grid">
          <div className="contact-info">
            <Reveal as="span" className="eyebrow">
              {t.contact.eyebrow}
            </Reveal>
            <Reveal as="h2" className="display section-title" delay={0.05}>
              {t.contact.title}
            </Reveal>
            <Reveal as="p" delay={0.1}>
              {t.contact.sub}
            </Reveal>
            <Reveal className="contact-lines" delay={0.15}>
              <div>
                <span className="eyebrow muted">{t.contact.email}</span>
                <a href={`mailto:${brand.email}`}>{brand.email}</a>
              </div>
              <div>
                <span className="eyebrow muted">{t.contact.instagram}</span>
                <a href={brand.instagramUrl} target="_blank" rel="noreferrer">
                  {brand.instagram}
                </a>
              </div>
              <div>
                <span className="eyebrow muted">{t.contact.location}</span>
                <span>{t.contact.locationValue}</span>
              </div>
            </Reveal>
          </div>

          <Reveal as="form" className="form" onSubmit={submit} delay={0.1}>
            <label>
              <span>{t.contact.name}</span>
              <input required value={form.name} onChange={set('name')} autoComplete="name" />
            </label>
            <label>
              <span>{t.contact.mail}</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
            </label>
            <div className="form-row">
              <label>
                <span>{t.contact.date}</span>
                <input type="date" value={form.date} onChange={set('date')} />
              </label>
              <label>
                <span>{t.contact.where}</span>
                <input value={form.where} onChange={set('where')} />
              </label>
            </div>
            <label>
              <span>{t.contact.budget}</span>
              <input value={form.budget} onChange={set('budget')} />
            </label>
            <label>
              <span>{t.contact.message}</span>
              <textarea required rows={5} value={form.message} onChange={set('message')} />
            </label>
            <div className="form-foot">
              <button type="submit" className="btn solid" disabled={status === 'sending'}>
                {status === 'sending' ? t.contact.sending : t.contact.send}
              </button>
              {!ENDPOINT && status === 'idle' && <p className="muted small">{t.contact.mailtoNote}</p>}
              {status === 'sent' && <p className="form-ok">{t.contact.sent}</p>}
              {status === 'error' && <p className="form-err">{t.contact.error}</p>}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
