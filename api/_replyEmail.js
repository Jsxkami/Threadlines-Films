// Confirmation email sent to the visitor after they submit the contact form.
// Table layout + inline styles + bgcolor attributes so it renders in Gmail, Outlook and Apple Mail.
// The leading underscore keeps Vercel from exposing this file as an API route.

const INK = '#0a0a0a'
const PAPER = '#f7f5f1'
const SAND = '#efece6'
const LINE = '#d9d3c7'
const MUTED = '#6f6a62'
const ACCENT = '#6b2c39'
const SERIF = "'Fraunces', Georgia, 'Times New Roman', serif"
const MONO = "'Roboto Mono', 'Courier New', Courier, monospace"

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const COPY = {
  en: {
    subject: 'We received your message — Threadline Films',
    preheader: 'Thank you for writing to us. We will reply personally within 48 hours.',
    eyebrow: 'Message received',
    title: (n) => `Thank you, ${n}.`,
    intro:
      'Your message has reached us. Every wedding we film begins with a conversation, and we are glad yours has started. We will reply to you personally within 48 hours.',
    summary: 'Your enquiry',
    labels: { date: 'Wedding date', where: 'Location', budget: 'Budget' },
    next: 'What happens next',
    steps: [
      ['01', 'We read every word', 'We look at your date, your location and the story you would like told.'],
      ['02', 'We write back within 48 hours', 'A personal reply, not an automatic one, to confirm availability.'],
      ['03', 'We talk', 'A relaxed call to get to know the two of you and plan the day together.'],
    ],
    cta: 'See our recent films',
    urgent: 'If it is urgent, simply reply to this email.',
    sign: 'With warmth,',
    team: 'The Threadline Films team',
    footer: 'You are receiving this message because you contacted us through our website.',
  },
  es: {
    subject: 'Recibimos tu mensaje — Threadline Films',
    preheader: 'Gracias por escribirnos. Te responderemos personalmente en un plazo de 48 horas.',
    eyebrow: 'Mensaje recibido',
    title: (n) => `Gracias, ${n}.`,
    intro:
      'Tu mensaje ya está con nosotros. Cada boda que filmamos empieza con una conversación, y nos alegra que la tuya haya comenzado. Te responderemos personalmente en un plazo de 48 horas.',
    summary: 'Tu consulta',
    labels: { date: 'Fecha de la boda', where: 'Lugar', budget: 'Presupuesto' },
    next: 'Qué sigue',
    steps: [
      ['01', 'Leemos cada palabra', 'Revisamos tu fecha, tu lugar y la historia que quieres que contemos.'],
      ['02', 'Te escribimos en 48 horas', 'Una respuesta personal, no automática, para confirmar disponibilidad.'],
      ['03', 'Conversamos', 'Una llamada tranquila para conocerlos y planear el día juntos.'],
    ],
    cta: 'Ver nuestros films recientes',
    urgent: 'Si es urgente, responde directamente a este correo.',
    sign: 'Con cariño,',
    team: 'El equipo de Threadline Films',
    footer: 'Recibes este mensaje porque nos contactaste desde nuestro sitio web.',
  },
}

export function renderReplyEmail({ lang = 'en', name = '', date = '', where = '', budget = '', siteUrl, email }) {
  const c = COPY[lang] ?? COPY.en
  const site = (siteUrl || 'https://www.threadlinefilms.com').replace(/\/$/, '')
  const first = esc(name.trim().split(/\s+/)[0] || '')
  const title = c.title(first)

  const details = [
    [c.labels.date, date],
    [c.labels.where, where],
    [c.labels.budget, budget],
  ].filter(([, v]) => v)

  const summaryBlock = details.length
    ? `
          <tr>
            <td style="padding:0 48px 8px 48px;">
              <p style="margin:0 0 14px 0;font-family:${MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${ACCENT};">${c.summary}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
                ${details
                  .map(
                    ([k, v]) => `
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid ${LINE};font-family:${MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};width:42%;" valign="top">${esc(k)}</td>
                  <td style="padding:14px 0;border-bottom:1px solid ${LINE};font-family:${SERIF};font-size:17px;color:${INK};" valign="top">${esc(v)}</td>
                </tr>`,
                  )
                  .join('')}
              </table>
            </td>
          </tr>
          <tr><td style="height:36px;line-height:36px;font-size:0;">&nbsp;</td></tr>`
    : ''

  const steps = c.steps
    .map(
      ([n, h, p]) => `
                <tr>
                  <td width="56" valign="top" style="padding:0 0 22px 0;font-family:${SERIF};font-style:italic;font-size:22px;color:${ACCENT};">${n}</td>
                  <td valign="top" style="padding:0 0 22px 0;">
                    <p style="margin:0 0 4px 0;font-family:${SERIF};font-size:19px;color:${INK};">${h}</p>
                    <p style="margin:0;font-family:${SERIF};font-size:15px;line-height:24px;color:${MUTED};">${p}</p>
                  </td>
                </tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(c.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${SAND};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(c.preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SAND}" style="background-color:${SAND};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAPER}" style="width:100%;max-width:600px;background-color:${PAPER};">

          <!-- Wordmark -->
          <tr>
            <td align="center" style="padding:40px 48px 28px 48px;">
              <a href="${site}" style="text-decoration:none;color:${INK};font-family:${SERIF};font-style:italic;font-size:26px;letter-spacing:0.5px;">Threadline Films</a>
              <p style="margin:10px 0 0 0;font-family:${MONO};font-size:10px;letter-spacing:4px;text-transform:uppercase;color:${MUTED};">Cinematic wedding films</p>
            </td>
          </tr>

          <!-- Header illustration -->
          <tr>
            <td style="padding:0;" bgcolor="#f6ebe0">
              <a href="${site}"><img src="${site}/media/email/email-header-wedding.jpg" width="600" alt="Threadline Films" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a>
            </td>
          </tr>

          <tr><td style="height:48px;line-height:48px;font-size:0;">&nbsp;</td></tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding:0 48px;">
              <p style="margin:0 0 18px 0;font-family:${MONO};font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${ACCENT};">${c.eyebrow}</p>
              <h1 style="margin:0;font-family:${SERIF};font-weight:300;font-size:40px;line-height:46px;letter-spacing:-0.5px;color:${INK};">${title}</h1>
              <p style="margin:22px 0 0 0;font-family:${SERIF};font-size:12px;letter-spacing:10px;color:${ACCENT};">&#8212; &#9670; &#8212;</p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:26px 48px 40px 48px;">
              <p style="margin:0;font-family:${SERIF};font-size:18px;line-height:30px;color:${INK};text-align:center;">${c.intro}</p>
            </td>
          </tr>
          ${summaryBlock}

          <!-- Next steps -->
          <tr>
            <td style="padding:0 48px;">
              <p style="margin:0 0 22px 0;font-family:${MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${ACCENT};">${c.next}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${steps}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:18px 48px 12px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${INK}" style="background-color:${INK};">
                    <a href="${site}/#films" style="display:inline-block;padding:18px 34px;font-family:${MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${PAPER};text-decoration:none;">${c.cta}</a>
                  </td>
                </tr>
              </table>
              <p style="margin:26px 0 0 0;font-family:${SERIF};font-style:italic;font-size:15px;line-height:24px;color:${MUTED};">${c.urgent}</p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td align="center" style="padding:40px 48px 48px 48px;">
              <p style="margin:0;font-family:${SERIF};font-style:italic;font-size:17px;color:${MUTED};">${c.sign}</p>
              <p style="margin:6px 0 0 0;font-family:${SERIF};font-size:21px;color:${INK};">${c.team}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="${INK}" style="background-color:${INK};padding:30px 48px;">
              <p style="margin:0 0 10px 0;font-family:${SERIF};font-style:italic;font-size:18px;color:${PAPER};">Threadline Films</p>
              <p style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:1px;line-height:20px;color:#a9a39a;">
                ${email ? `<a href="mailto:${esc(email)}" style="color:#a9a39a;text-decoration:none;">${esc(email)}</a> &nbsp;&middot;&nbsp; ` : ''}<a href="${site}" style="color:#a9a39a;text-decoration:none;">${esc(site.replace(/^https?:\/\//, ''))}</a>
              </p>
              <p style="margin:16px 0 0 0;font-family:${SERIF};font-size:12px;line-height:18px;color:#7d776e;">${c.footer}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    title.replace(/&amp;/g, '&'),
    '',
    c.intro,
    '',
    ...details.map(([k, v]) => `${k}: ${v}`),
    ...(details.length ? [''] : []),
    c.next.toUpperCase(),
    ...c.steps.map(([n, h, p]) => `${n}. ${h} — ${p}`),
    '',
    `${c.cta}: ${site}/#films`,
    c.urgent,
    '',
    c.sign,
    c.team,
  ].join('\n')

  return { subject: c.subject, html, text }
}
