import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion'
import Loader from './components/Loader.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import CtaBar from './components/CtaBar.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Films from './sections/Films.jsx'
import Process from './sections/Process.jsx'
import Collections from './sections/Collections.jsx'
import Testimonials from './sections/Testimonials.jsx'
import Faq from './sections/Faq.jsx'
import Contact from './sections/Contact.jsx'
import Footer from './sections/Footer.jsx'

const loadFeatures = () => import('./motionFeatures.js').then((mod) => mod.default)

function alreadySeen() {
  try {
    return sessionStorage.getItem('intro-seen') === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [loading, setLoading] = useState(() => !alreadySeen())
  const [prefill, setPrefill] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  const finishLoading = useCallback(() => {
    try {
      sessionStorage.setItem('intro-seen', '1')
    } catch {
      /* storage unavailable */
    }
    setLoading(false)
  }, [])

  // Any section can push a pre-written message into the contact form.
  const sendToContact = useCallback((message) => {
    setPrefill(message)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <LazyMotion features={loadFeatures}>
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Loader key="loader" onDone={finishLoading} />}</AnimatePresence>
      <Cursor />
      <Nav open={menuOpen} setOpen={setMenuOpen} />
      <CtaBar menuOpen={menuOpen} />
      <main>
        <Hero />
        <About />
        <Films />
        <Process />
        <Collections onSend={sendToContact} />
        <Testimonials />
        <Faq />
        <Contact prefill={prefill} />
      </main>
      <Footer />
    </MotionConfig>
    </LazyMotion>
  )
}
