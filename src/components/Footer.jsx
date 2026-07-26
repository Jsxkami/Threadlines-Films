const LINKS = ['Home', 'About', 'Portfolio', 'Collections', 'Contact']
const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Vimeo', href: 'https://vimeo.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="footer-logo">Threadlines Films</p>
            <p className="footer-tagline">Cinematic Wedding Films</p>
          </div>

          <ul className="footer-nav">
            {LINKS.map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase() === 'home' ? 'top' : l.toLowerCase()}`} className="link-underline">
                  {l}
                </a>
              </li>
            ))}
          </ul>

          <ul className="footer-social">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="link-underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Threadlines Films</span>
          <span>Crafted with passion and timeless storytelling.</span>
        </div>
      </div>
    </footer>
  )
}
