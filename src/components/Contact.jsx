import { useState } from 'react'

export default function Contact() {
  const [status, setStatus] = useState('idle')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Wire this up to your email service / form backend of choice
    // (e.g. Formspree, Resend, a serverless function).
    setStatus('sent')
  }

  return (
    <section id="contact" className="contact">
      <div className="wrap contact-grid">
        <div className="contact-info">
          <span className="eyebrow">Contact</span>
          <h2 className="section-heading">Let's talk about your day.</h2>
          <p>
            Tell us a little about your wedding and we'll get back to you within
            48 hours with availability and next steps.
          </p>

          <a className="contact-detail" href="mailto:hello@threadlinesfilms.com">
            <span className="contact-detail-label">Email</span>
            hello@threadlinesfilms.com
          </a>
          <a className="contact-detail" href="https://instagram.com" target="_blank" rel="noreferrer">
            <span className="contact-detail-label">Instagram</span>
            @threadlinesfilms
          </a>
          <div className="contact-detail">
            <span className="contact-detail-label">Location</span>
            Based worldwide — available for travel
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="date">Wedding Date</label>
              <input id="date" name="date" type="date" />
            </div>
            <div className="form-field">
              <label htmlFor="location">Wedding Location</label>
              <input id="location" name="location" type="text" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="budget">Budget (optional)</label>
            <input id="budget" name="budget" type="text" />
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required />
          </div>

          <button type="submit" className="btn contact-submit">
            {status === 'sent' ? "Sent — thank you" : "Let's Create Something Beautiful"}
          </button>
        </form>
      </div>
    </section>
  )
}
