import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { num: '10+', label: 'Weddings Filmed' },
  { num: '3', label: 'Years of Experience' },
  { num: '7', label: 'Destination Weddings' },
  { num: '20+', label: 'Happy Couples' },
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal', sectionRef.current).forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="wrap about-grid">
        <div className="about-text">
          <span className="eyebrow reveal">About</span>
          <h2 className="section-heading reveal">
            Creating timeless wedding films with honesty, emotion, and cinematic storytelling.
          </h2>
          <p className="reveal">
            I started filming weddings because I couldn't stand watching a day like that
            disappear. Not the highlight reel version — the real one: the pause before
            someone says their vows, the way a father's hands shake tying a bowtie, the
            fifteen minutes after the ceremony when no one is performing for a camera.
          </p>
          <p className="reveal">
            Threadlines Films is built around that instinct. Every project I take on is
            treated like a short film, not a coverage package — shot with intention, cut
            with restraint, and handed back as something you'll still want to watch in
            twenty years.
          </p>
          <a href="#portfolio" className="btn reveal">Learn More</a>
        </div>

        <div className="about-stats">
          {STATS.map((s) => (
            <div key={s.label} className="reveal">
              <p className="about-stat-num">{s.num}</p>
              <p className="about-stat-label">{s.label}</p>
            </div>
          ))}
<div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted">
  <img src="/images/jorge-morales.png" className="h-full w-full rounded-3xl" /> 
  <div className="flex h-full w-full items-center justify-center">
    <span className="font-display text-7xl font-bold text-muted-foreground/20"> JORGE MORALES
      {/* {SITE.name
        .split(" ")
        .map((n) => n[0])
        .join("")} */}
    </span>
  </div>
</div>
        </div>
        
      </div>
      
    </section>
  )
}
