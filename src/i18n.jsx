import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { content } from './content.js'

const Ctx = createContext(null)

function initialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    /* storage unavailable */
  }
  return (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: content[lang] }), [lang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useT = () => useContext(Ctx)
