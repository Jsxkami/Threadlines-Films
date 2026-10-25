import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n.jsx'

const pad = (n) => String(n).padStart(2, '0')
const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

const COPY = {
  en: { placeholder: 'Select a date', clear: 'Clear', today: 'Today', prev: 'Previous month', next: 'Next month' },
  es: { placeholder: 'Selecciona una fecha', clear: 'Borrar', today: 'Hoy', prev: 'Mes anterior', next: 'Mes siguiente' },
}

// Minimal on-brand calendar; value is an ISO yyyy-mm-dd string. Past dates are disabled.
export default function DatePicker({ value, onChange }) {
  const { lang } = useT()
  const c = COPY[lang]
  const locale = lang === 'es' ? 'es-US' : 'en-US'
  const now = new Date()
  const todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate())
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const d = value ? new Date(`${value}T00:00:00`) : now
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const first = new Date(view.y, view.m, 1)
  const lead = (first.getDay() + 6) % 7 // Monday-first
  const days = new Date(view.y, view.m + 1, 0).getDate()
  const dows = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2),
  )
  const title = first.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  const label = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
    : null
  const atMin = view.y === now.getFullYear() && view.m === now.getMonth()

  const go = (delta) => {
    const d = new Date(view.y, view.m + delta, 1)
    setView({ y: d.getFullYear(), m: d.getMonth() })
  }
  const pick = (d) => {
    onChange(iso(view.y, view.m, d))
    setOpen(false)
  }

  return (
    <div className="dp" ref={ref}>
      <button type="button" className="dp-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className={label ? '' : 'ph'}>{label ?? c.placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
          <rect x="1.5" y="3" width="13" height="11.5" />
          <path d="M1.5 6.5h13M5 1.5v3M11 1.5v3" />
        </svg>
      </button>
      {open && (
        <div className="dp-pop" role="dialog">
          <div className="dp-head">
            <button type="button" className="dp-nav" onClick={() => go(-1)} disabled={atMin} aria-label={c.prev}>
              ←
            </button>
            <span className="dp-title">{title}</span>
            <button type="button" className="dp-nav" onClick={() => go(1)} aria-label={c.next}>
              →
            </button>
          </div>
          <div className="dp-grid">
            {dows.map((d, i) => (
              <span className="dp-dow" key={i}>
                {d}
              </span>
            ))}
            {Array.from({ length: lead }, (_, i) => (
              <span key={`b${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1
              const v = iso(view.y, view.m, d)
              return (
                <button
                  type="button"
                  key={d}
                  className={`dp-day ${v === value ? 'sel' : ''} ${v === todayIso ? 'today' : ''}`}
                  disabled={v < todayIso}
                  onClick={() => pick(d)}
                >
                  {d}
                </button>
              )
            })}
          </div>
          <div className="dp-foot">
            <button
              type="button"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
            >
              {c.clear}
            </button>
            <button type="button" onClick={() => setView({ y: now.getFullYear(), m: now.getMonth() })}>
              {c.today}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
