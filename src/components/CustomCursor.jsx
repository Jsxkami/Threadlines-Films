import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3.out' })

    const move = (e) => {
      ringX(e.clientX)
      ringY(e.clientY)
      dotX(e.clientX)
      dotY(e.clientY)
    }

    const onEnter = (e) => {
      if (e.target.closest('a, button, .portfolio-card, input, textarea')) {
        ring.classList.add('is-active')
      }
    }
    const onLeave = (e) => {
      if (e.target.closest('a, button, .portfolio-card, input, textarea')) {
        ring.classList.remove('is-active')
      }
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  )
}
