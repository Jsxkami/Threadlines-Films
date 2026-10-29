// Vercel serverless function: receives the contact form and emails it through a Hostinger mailbox (SMTP).
// Env vars (Vercel → Settings → Environment Variables):
//   SMTP_USER    required  – the Hostinger mailbox, e.g. hello@yourdomain.com
//   SMTP_PASS    required  – that mailbox's password
//   CONTACT_TO   optional  – inbox that receives the enquiries (defaults to SMTP_USER)
//   SMTP_HOST    optional  – defaults to smtp.hostinger.com
//   SMTP_PORT    optional  – defaults to 465 (SSL)
import nodemailer from 'nodemailer'

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const clip = (v, n) => String(v ?? '').trim().slice(0, n)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const REPLY = {
  en: {
    subject: 'We received your message — Threadline Films',
    hi: 'Hi',
    body: 'Thank you for writing to us. We have your message and will reply personally within 48 hours.\n\nIf it is urgent, just reply to this email.',
    sign: 'Threadline Films',
  },
  es: {
    subject: 'Recibimos tu mensaje — Threadline Films',
    hi: 'Hola',
    body: 'Gracias por escribirnos. Recibimos tu mensaje y te responderemos personalmente en un plazo de 48 horas.\n\nSi es urgente, responde directamente a este correo.',
    sign: 'Threadline Films',
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {}

  // Honeypot: real visitors never fill this field. Pretend success so bots move on.
  if (body.hp_field) {
    console.warn('Contact honeypot triggered')
    return res.status(200).json({ ok: true, skipped: true })
  }

  const data = {
    name: clip(body.name, 120),
    email: clip(body.email, 200),
    date: clip(body.date, 60),
    where: clip(body.where, 160),
    budget: clip(body.budget, 80),
    lang: body.lang === 'es' ? 'es' : 'en',
    message: clip(body.message, 5000),
  }

  if (!data.name || !data.message || !EMAIL.test(data.email)) {
    return res.status(400).json({ error: 'invalid' })
  }

  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) return res.status(503).json({ error: 'not_configured' })

  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Wedding date', data.date || '—'],
    ['Location', data.where || '—'],
    ['Budget', data.budget || '—'],
  ]
  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px">New enquiry — ${esc(data.name)}</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows.map(([k, v]) => `<tr><td style="color:#666">${k}</td><td>${esc(v)}</td></tr>`).join('')}
      </table>
      <p style="white-space:pre-wrap;margin-top:20px;padding-top:16px;border-top:1px solid #ddd">${esc(data.message)}</p>
    </div>`
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${data.message}`

  try {
    const port = Number(process.env.SMTP_PORT || 465)
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port,
      secure: port === 465,
      auth: { user, pass },
    })
    const info = await transport.sendMail({
      from: `Threadline Films <${user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: `${data.name.replace(/[<>",]/g, '')} <${data.email}>`,
      subject: `New enquiry — ${data.name}${data.date ? ` · ${data.date}` : ''}`,
      html,
      text,
    })
    if (!info.accepted?.length) {
      console.error('SMTP rejected recipients', info.rejected, info.response)
      return res.status(502).json({ error: 'rejected' })
    }
    console.log('Contact mail accepted', info.accepted, info.response)

    // Confirmation to the visitor. A failure here must not fail the enquiry itself.
    try {
      const copy = REPLY[data.lang]
      const first = esc(data.name.split(' ')[0])
      await transport.sendMail({
        from: `Threadline Films <${user}>`,
        to: data.email,
        replyTo: process.env.CONTACT_TO || user,
        subject: copy.subject,
        text: `${copy.hi} ${data.name.split(' ')[0]},

${copy.body}

${copy.sign}`,
        html: `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#111;max-width:520px">
          <p>${copy.hi} ${first},</p>
          ${copy.body.split(/\n{2}/).map((p) => `<p>${p}</p>`).join('')}
          <p style="margin-top:28px;color:#6b2c39;font-style:italic">${copy.sign}</p></div>`,
      })
    } catch (err) {
      console.error('Auto-reply failed', err)
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact handler failed', err)
    return res.status(502).json({ error: 'send_failed' })
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s)
  } catch {
    return {}
  }
}
