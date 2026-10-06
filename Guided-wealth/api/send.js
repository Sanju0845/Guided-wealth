// Vercel serverless function -> GET /api/send  (triggered by Vercel Cron)
// Builds the digest (FMP), renders the HTML, and emails every subscriber via Brevo.
// Protected by CRON_SECRET (Vercel Cron sends it as Authorization: Bearer <secret>).
import { buildDigest } from '../subscriptionmails/lib/digest.js';
import { renderDigestHtml } from '../subscriptionmails/lib/template.js';
import { getListEmails, sendEmail } from '../subscriptionmails/lib/brevo.js';

export default async function handler(req, res) {
  const auth = req.headers.authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const secret = req.query.secret || bearer;
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  if (!process.env.BREVO_API_KEY) {
    res.status(500).json({ message: 'BREVO_API_KEY is not configured' });
    return;
  }
  try {
    const digest = await buildDigest();
    const subject =
      (req.body && req.body.subject) || `Guided Wealthy — Market Brief · ${digest.dateLabel}`;

    const emails = await getListEmails();
    let sent = 0;
    let failed = 0;
    for (const email of emails.slice(0, 90)) {
      try {
        const html = renderDigestHtml(digest, email);
        await sendEmail({ to: email, subject, html });
        sent += 1;
      } catch (e) {
        failed += 1;
        console.error('send failed for', email, e.message);
      }
    }
    res.status(200).json({ message: 'Dispatch finished', total: emails.length, sent, failed });
  } catch (e) {
    console.error('send error:', e);
    res.status(500).json({ message: 'Send failed', error: e.message });
  }
}
