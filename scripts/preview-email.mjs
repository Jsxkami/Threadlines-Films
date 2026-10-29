// Writes the visitor confirmation email to email-preview-{en,es}.html so you can open it in a browser.
//   node scripts/preview-email.mjs
import { writeFileSync } from 'node:fs'
import { renderReplyEmail } from '../api/_replyEmail.js'

for (const lang of ['en', 'es']) {
  const { html } = renderReplyEmail({
    lang,
    name: 'Karina Morales',
    date: lang === 'en' ? 'June 14, 2027' : '14 de junio de 2027',
    where: 'Lake Como, Italy',
    budget: '$4,500',
    email: 'hello@threadlinefilms.com',
    siteUrl: 'https://www.threadlinefilms.com',
  })
  writeFileSync(`email-preview-${lang}.html`, html)
  console.log(`email-preview-${lang}.html`)
}
