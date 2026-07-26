import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Hero() {
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const eyebrowRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, '-=0.4')
      .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  }, [])

  return (
    <header id="top" className="hero">
      <video
    className="hero-video"
    autoPlay
    muted
    loop
    playsInline
    poster="/videos/reel-pic1.jpg"
  >
    <source src="/videos/demo.mp4" type="video/mp4" />
  </video>
      <div className="hero-noise" />
      <div className="hero-content">

      <p ref={eyebrowRef} className="hero-eyebrow">Cinematic Wedding Films</p>

      <h1 ref={titleRef} className="hero-title">
        We film the version <em>you'll want</em><br />to remember.
      </h1>

      <div ref={subRef} className="hero-sub">
        <p>
          Threadlines Films documents weddings as they actually unfold —
          quiet glances, unscripted laughter, the parts no one thinks to plan for.
        </p>
        <div className="hero-scroll">
          <span className="hero-scroll-line" />
          Scroll
        </div>
      </div>
      </div>
    </header>
  )
}
