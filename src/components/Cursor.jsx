import { useEffect, useState } from 'react'
import { m as motion, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer } from '../hooks.js'

// Custom cursor: a small dot that blooms into a labelled disc ("Play")
// over any element carrying data-cursor="Label". Desktop pointers only.
export default function Cursor() {
  const fine = useFinePointer()
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 })
  const [label, setLabel] = useState(null)

  useEffect(() => {
    if (!fine) return undefined
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const el = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      setLabel(el ? el.getAttribute('data-cursor') : null)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [fine, x, y])

  if (!fine) return null

  return (
    <motion.div className="cursor" style={{ x: sx, y: sy }} aria-hidden="true">
      <motion.div
        className="cursor-disc"
        animate={{ scale: label ? 1 : 0.1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <motion.span animate={{ opacity: label ? 1 : 0 }} transition={{ duration: 0.2 }}>
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
