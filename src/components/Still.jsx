import { useState } from 'react'

// A "film still": the real image when it exists, otherwise a cinematic
// gradient placeholder so the site looks finished before media is added.
export default function Still({ src, hue = 20, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false)
  const showImg = Boolean(src) && !failed

  return (
    <div className={`still ${className}`} style={{ '--h': hue }}>
      <div className="still-gradient" />
      {showImg && <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />}
    </div>
  )
}
