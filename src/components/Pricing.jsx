import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PACKAGES = [
  {
    name: 'Essential',
    price: '$2,000',
    features: [
      '8 hours of coverage',
      'Getting ready through the party',
      '1 Videographer',
      '1 Assistant',
      'Highlight Film (3–5 min)',
      'Delivery in 6–8 weeks',
    ],
  },
  {
    name: 'Standard',
    price: '$2,500',
    badge: 'Most Popular',
    features: [
      '10 hours of coverage',
      'Getting ready through the party',
      '1 Videographer',
      '1 Assistant',
      'Highlight Film (4–6 min)',
      'Cinematic Teaser',
      'Delivery in 4–6 weeks',
    ],
  },
  {
    name: 'Full Cover',
    price: '$4,000',
    features: [
      '12 hours of coverage',
      'Getting ready through the party',
      '2 Videographers',
      '1 Assistant',
      'Highlight Film (4–6 min)',
      'Cinematic Teaser',
      'Mini Documentary (8–11 min)',
      'Delivery in 4–6 weeks',
    ],
  },
    {
    name: 'Custom Quotes',
    price: 'Your Budget',
    features: [
      'Let us know your vision and budget, and we’ll create a custom package tailored to your needs.',
    ],
  },
]

const ADDONS = [
  { name: 'Teaser', price: '$600' },
  { name: 'Professional Highlight Film', price: '$800' },
  { name: 'Highlight + Professional Teaser', price: '$1,200' },
  { name: 'Mini Documentary', price: '$1,300' },
  { name: 'Standard Teaser (Music Only)', price: '$400' },
]

export default function Pricing() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.pricing-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: { trigger: card, start: 'top 88%' },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <section id="pricing" className="pricing" ref={sectionRef}>
        <div className="wrap">
          <div className="pricing-head">
            <span className="eyebrow">Pricing</span>
            <h2 className="section-heading">Wedding Film Collections</h2>
            <p>Every wedding is unique. Choose the collection that best tells your story with timeless cinematic filmmaking.</p>
          </div>

          <div className="pricing-grid">
            {PACKAGES.map((pkg) => (
              <div className="pricing-card" key={pkg.name}>
                {pkg.badge && <span className="pricing-badge">{pkg.badge}</span>}
                <span className="pricing-card-title">{pkg.name}</span>
                <p className="pricing-card-price">{pkg.price}</p>
                <hr className="pricing-divider" />
                <ul className="pricing-features">
                  {pkg.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a href="#contact" className="btn">Book This Collection</a>
              </div>
            ))}
          </div>

          <div className="addons">
            <span className="eyebrow">Editorial Add-Ons</span>
            {ADDONS.map((a) => (
              <div className="addon-row" key={a.name}>
                <span>{a.name}</span>
                <span>{a.price}</span>
              </div>
            ))}
            <p className="addons-note">
              All collections include professional color grading for S-Log footage
              and cinematic sound design when required.
            </p>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <h2>Let's Tell Your Story</h2>
        <p>Every wedding is different. Let's create a collection tailored to your vision.</p>
        <div className="final-cta-buttons">
          <a href="#contact" className="btn btn-invert">Book Your Date</a>
          <a href="#contact" className="btn btn-invert">Schedule a Consultation</a>
        </div>
      </section>
    </>
  )
}
