import { useRef } from 'react'
import {
  m as motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { useIsDesktop } from '../hooks.js'

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

const COPIES = [0, 1, 2, 3]

// Marquee that speeds up (and reverses) with your scroll velocity.
function ScrollMarquee({ text }) {
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [0, 1000], [0, 5], { clamp: false })
  const direction = useRef(1)
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    let move = direction.current * 1.6 * (delta / 1000)
    const b = boost.get()
    if (b < 0) direction.current = -1
    else if (b > 0) direction.current = 1
    move += direction.current * move * b
    base.set(base.get() + move)
  })

  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={{ x }}>
        {COPIES.map((i) => (
          <span key={i}>{text}</span>
        ))}
      </motion.div>
    </div>
  )
}

// Mobile: a plain CSS translateX loop — no per-frame JS.
function CssMarquee({ text }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track marquee-track-css">
        {COPIES.map((i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee({ text }) {
  const desktop = useIsDesktop()
  return desktop ? <ScrollMarquee text={text} /> : <CssMarquee text={text} />
}
