import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

function VideoPlayer({ project }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const v = videoRef.current
    if (!v || !project.videoUrl) return
    setProgress(0)
    v.currentTime = 0
    v.play().catch(() => {})
  }, [project])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) v.pause()
    else v.play()
    setPlaying(!playing)
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !muted
    setMuted(!muted)
  }

  const onTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    setProgress((v.currentTime / v.duration) * 100)
  }

  const seek = (e) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    v.currentTime = ratio * v.duration
  }

  const goFullscreen = () => {
    const v = videoRef.current
    if (v?.requestFullscreen) v.requestFullscreen()
  }

  return (
    <div className="video-frame">
      {project.videoUrl ? (
        <video
          ref={videoRef}
          src={project.videoUrl}
          autoPlay
          muted={muted}
          playsInline
          loop
          onTimeUpdate={onTimeUpdate}
        />
      ) : (
        <div className="video-placeholder">
          <span>{project.title}</span>
          <span>Replace `videoUrl` in src/data/projects.js with your footage</span>
        </div>
      )}

      <div className="video-controls">
        <button onClick={togglePlay} aria-label="Play / Pause">
          {playing ? '❚❚' : '▶'}
        </button>
        <div className="video-progress" onClick={seek}>
          <div className="video-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <button onClick={toggleMute} aria-label="Toggle sound">
          {muted ? '🔇' : '🔊'}
        </button>
        <button onClick={goFullscreen} aria-label="Fullscreen">⛶</button>
      </div>
    </div>
  )
}

export default function ProjectModal({ project, onClose, onNext, onPrev }) {
  const backdropRef = useRef(null)
  const shellRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power3.out' }
    )
    gsap.fromTo(
      shellRef.current,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
    )
  }, [])

  useEffect(() => {
    // subtle cinematic transition when switching projects
    gsap.fromTo(
      shellRef.current,
      { opacity: 0.4 },
      { opacity: 1, duration: 0.5, ease: 'power3.out' }
    )
  }, [project])

  const handleClose = () => {
    gsap.to(shellRef.current, { opacity: 0, scale: 0.98, duration: 0.4, ease: 'power2.inOut' })
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: onClose,
    })
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  const onBackdropClick = (e) => {
    if (e.target === backdropRef.current) handleClose()
  }

  return (
    <div className="modal-backdrop" ref={backdropRef} onClick={onBackdropClick}>
      <div className="modal-shell" ref={shellRef}>
        <button className="modal-close" onClick={handleClose}>
          Close ✕
        </button>

        <div className={`modal-video-pane ${project.orientation === 'vertical' ? 'vertical' : ''}`}>
          <VideoPlayer project={project} />
        </div>

        <div className="modal-info-pane">
          <span className="modal-info-cat">{project.category} — {project.year}</span>
          <h3 className="modal-info-title">{project.title}</h3>

          <dl className="modal-info-table">
            <div>
              <dt>Client</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
            <div>
              <dt>Services</dt>
              <dd>{project.services.join(', ')}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>

          <p className="modal-info-desc">{project.description}</p>
          <p className="modal-info-notes">{project.notes}</p>

          <div className="modal-cta">
            <a href="#contact" className="btn" onClick={handleClose}>View Full Project</a>
          </div>

          <div className="modal-nav">
            <button onClick={onPrev}>← Previous Project</button>
            <button onClick={onNext}>Next Project →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
