import { useEffect, useState } from 'react'

export function useMedia(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useIsDesktop = () => useMedia('(min-width: 900px)')
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)')

export const EASE = [0.16, 1, 0.3, 1]

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')

// One-off (non-reactive) check for components that render in bulk, e.g. every Reveal.
export const isMobileNow = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches

// Which of `ids` is crossing the middle of the viewport. Pass an empty list to disable.
export function useActiveSection(ids) {
  const [active, setActive] = useState('')
  const key = ids.join(',')
  useEffect(() => {
    if (!key) return undefined
    const els = key.split(',').map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  return active
}

// Freeze the page behind the menu. iOS Safari ignores overflow:hidden on body,
// so on phones the body is pinned with position:fixed and the scroll offset restored on close.
export function lockScroll(mobile) {
  const body = document.body
  if (!mobile) {
    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = ''
    }
  }
  const y = window.scrollY
  body.style.position = 'fixed'
  body.style.top = `-${y}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  return () => {
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    window.scrollTo({ top: y, behavior: 'instant' })
  }
}
