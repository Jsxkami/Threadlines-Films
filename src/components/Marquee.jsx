import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

// Marquee that speeds up (and reverses) with your scroll velocity.
export default function Marquee({ text }) {
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

  const copies = [0, 1, 2, 3]
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={{ x }}>
        {copies.map((i) => (
          <span key={i}>{text}</span>
        ))}
      </motion.div>
    </div>
  )
}
