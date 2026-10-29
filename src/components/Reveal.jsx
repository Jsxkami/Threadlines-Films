import { useEffect, useRef } from 'react'
import {
  animate,
  m as motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from 'framer-motion'
import { EASE, isMobileNow, useIsDesktop } from '../hooks.js'

// Fade + rise when the element enters the viewport.
// On phones the travel, duration and stagger shrink so there is less to composite while scrolling.
export function Reveal({ children, delay = 0, y = 28, as = 'div', className = '', ...rest }) {
  const Tag = motion[as]
  const mobile = isMobileNow()
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: mobile ? Math.min(y, 12) : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: mobile ? '0px 0px -5% 0px' : '0px 0px -10% 0px' }}
      transition={{ duration: mobile ? 0.6 : 1.1, ease: EASE, delay: mobile ? Math.min(delay, 0.1) : delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

function Word({ word, index, total, progress }) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.14, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{' '}
    </>
  )
}

// Paragraph whose words light up one by one as you scroll through it.
function ScrollWordReveal({ text, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.55'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} word={w} index={i} total={words.length} progress={scrollYProgress} />
      ))}
    </p>
  )
}

// Mobile renders the paragraph as static text with a single fade-in instead of one motion value per word.
export function WordReveal({ text, className = '' }) {
  const desktop = useIsDesktop()
  if (!desktop) {
    return (
      <Reveal as="p" className={className} y={12}>
        {text}
      </Reveal>
    )
  }
  return <ScrollWordReveal text={text} className={className} />
}

// Each letter starts as the paper colour (invisible) and darkens to `toColor` — never fades out.
function Char({ char, from, to, progress, toColor }) {
  const color = useTransform(progress, [from, to], ['#f7f5f1', toColor])
  return <motion.span style={{ color }}>{char}</motion.span>
}

// Text whose letters are "typed" one by one as `progress` (0..1) moves through `range`.
// Words stay unbroken (inline-block) so line wrapping matches normal text.
export function CharReveal({ text, progress, range = [0, 1], as = 'p', toColor = '#0a0a0a', className = '' }) {
  const Tag = as
  const total = text.length
  const step = (range[1] - range[0]) / total
  let offset = 0
  const words = text.split(' ').map((w) => {
    const start = offset
    offset += w.length + 1
    return { w, start }
  })
  return (
    <Tag className={className}>
      {words.map(({ w, start }, wi) => (
        <span key={`${w}-${wi}`}>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(w).map((c, ci) => {
              const from = range[0] + (start + ci) * step
              return <Char key={ci} char={c} from={from} to={from + step} progress={progress} toColor={toColor} />
            })}
          </span>{' '}
        </span>
      ))}
    </Tag>
  )
}

// Pins its children to the screen while the page scrolls through `scrollLength` of extra height.
// children is a render function receiving the 0..1 progress of the pin.
export function Pinned({ children, scrollLength = '350vh', className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <div ref={ref} className="pin" style={{ height: `calc(100vh + ${scrollLength})` }}>
      <div className={`pin-sticky ${className}`}>{children(scrollYProgress)}</div>
    </div>
  )
}

// Number that counts up when it scrolls into view.
export function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const value = useMotionValue(0)
  const rounded = useTransform(value, (v) => Math.round(v))

  useEffect(() => {
    if (!inView) return undefined
    const controls = animate(value, to, { duration: 2.2, ease: EASE })
    return () => controls.stop()
  }, [inView, to, value])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}
