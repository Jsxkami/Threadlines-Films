import { useState } from 'react'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Collections', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav">
      <a href="#top" className="nav-logo">Threadlines Films</a>

      <ul className="nav-links">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="link-underline">{link.label}</a>
          </li>
        ))}
      </ul>

      <button className="nav-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? 'Close' : 'Menu'}
      </button>

      {open && (
        <ul
          className="nav-links"
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 76,
            right: 24,
            background: '#0a0a0a',
            padding: 24,
            gap: 20,
          }}
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="link-underline" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
