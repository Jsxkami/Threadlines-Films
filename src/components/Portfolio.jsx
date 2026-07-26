import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import projects from '../data/projects.js'
import ProjectModal from './ProjectModal.jsx'

gsap.registerPlugin(ScrollTrigger)

// Muted tonal gradients standing in for real project stills/poster frames.
// Swap these for background-image: url(...) once you have real thumbnails.
const TONES = {
  1: 'linear-gradient(135deg, #2b2320, #1a1614)',
  2: 'linear-gradient(135deg, #241d22, #14111a)',
  3: 'linear-gradient(135deg, #1f2622, #121815)',
  4: 'linear-gradient(135deg, #262220, #151212)',
  5: 'linear-gradient(135deg, #221e26, #131018)',
  6: 'linear-gradient(135deg, #1c2126, #101216)',
}

export default function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.portfolio-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: (i % 3) * 0.1,
            scrollTrigger: { trigger: card, start: 'top 90%' },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const close = () => setActiveIndex(null)
  const next = () => setActiveIndex((i) => (i + 1) % projects.length)
  const prev = () => setActiveIndex((i) => (i - 1 + projects.length) % projects.length)

  return (
    <section id="portfolio" className="portfolio" ref={sectionRef}>
      <div className="wrap">
        <div className="portfolio-head">
          <div>
            <span className="eyebrow">Portfolio</span>
            <h2 className="section-heading">Selected Films</h2>
          </div>
          <p>A collection of weddings we've had the privilege of documenting, from intimate elopements to full destination celebrations.</p>
        </div>

        <div className="portfolio-grid">
          {projects.map((p, i) => (
            <div
              key={p.id}
              className="portfolio-card"
              onClick={() => setActiveIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(i)}
            >
              <div
                className="portfolio-card-media"
                style={{ background: TONES[p.posterTone] || TONES[1] }}
              />
              <span className="portfolio-card-index">{String(i + 1).padStart(2, '0')}</span>
              <div className="portfolio-card-overlay">
                <span className="portfolio-card-cat">{p.category}</span>
                <span className="portfolio-card-title">{p.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <ProjectModal
          project={projects[activeIndex]}
          onClose={close}
          onNext={next}
          onPrev={prev}
        />
      )}
    </section>
  )
}
