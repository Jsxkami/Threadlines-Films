import { useT } from '../i18n.jsx'
import { brand } from '../content.js'

export default function Footer() {
  const { t } = useT()
  const links = [
    ['#about', t.nav.about],
    ['#films', t.nav.films],
    ['#process', t.nav.process],
    ['#collections', t.nav.collections],
    ['#contact', t.nav.contact],
  ]
  return (
    <footer className="footer on-dark">
      <div className="container">
        <div className="footer-top">
          <div>
            <span className="display footer-brand">{brand.name}</span>
            <span className="eyebrow muted">{t.footer.tagline}</span>
          </div>
          <nav className="footer-links" aria-label="Footer">
            {links.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="footer-links">
            <a href={brand.instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={brand.vimeoUrl} target="_blank" rel="noreferrer">
              Vimeo
            </a>
            <a href={brand.youtubeUrl} target="_blank" rel="noreferrer">
              YouTube
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {brand.name}
          </span>
          <span>{t.footer.crafted}</span>
          <a href="#top">{t.footer.top} ↑</a>
        </div>
      </div>
    </footer>
  )
}
