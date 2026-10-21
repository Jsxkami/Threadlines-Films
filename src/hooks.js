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
