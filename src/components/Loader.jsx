import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { brand } from '../content.js'
import { EASE } from '../hooks.js'

// Cinematic intro: counter + two black bars that part like a curtain.
export default function Loader({ onDone }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    let raf
    let timer
    const start = performance.now()
    const DURATION = 1700
    const tick = (now) => {
      const p = Math.min((now - start) / DURATION, 1)
      setN(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else timer = setTimeout(onDone, 250)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [onDone])

  return (
    <motion.div className="loader" exit={{ pointerEvents: 'none' }} transition={{ duration: 0 }}>
      <motion.div
        className="loader-bar loader-top"
        exit={{ y: '-100%' }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.div
        className="loader-bar loader-bottom"
        exit={{ y: '100%' }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.div
        className="loader-center"
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className="loader-brand">{brand.name}</span>
        <span className="loader-count">{String(n).padStart(3, '0')}</span>
      </motion.div>
    </motion.div>
  )
}
