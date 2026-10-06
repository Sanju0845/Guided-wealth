// Vercel serverless function -> GET /api/send  (triggered by Vercel Cron)
// Builds the digest (FMP), renders the HTML, and emails every subscriber via Brevo.
// Protected by CRON_SECRET (Vercel Cron sends it as Authorization: Bearer <secret>).
//
// Preview helpers (also need the secret, so strangers can't hit them):
//   /api/send?secret=...&preview=true        -> returns the HTML in the browser (no send)
//   /api/send?secret=...&test=you@mail.com   -> emails ONE test copy to that address
import { buildDigest } from '../subscriptionmails/lib/digest.js';
import { renderDigestHtml } from '../subscriptionmails/lib/template.js';
import { getListEmails, sendEmail } from '../subscriptionmails/lib/brevo.js';
import { debugFmp } from '../subscriptionmails/lib/fmp.js';

export default async function handler(req, res) {
  const auth = req.headers.authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const secret = req.query.secret || bearer;
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    // Debug: show raw FMP responses (why a section may be empty)
    if (req.query.debug === 'true') {
      res.status(200).json(await debugFmp());
      return;
    }

    const digest = await buildDigest();
    const subject =
      (req.body && req.body.subject) || `Guided Wealthy — Market Brief · ${digest.dateLabel}`;

    // 1) Preview in browser
    if (req.query.preview === 'true') {
      res.status(200).type('html').send(renderDigestHtml(digest, 'preview@example.com'));
      return;
    }

    if (!process.env.BREVO_API_KEY) {
      res.status(500).json({ message: 'BREVO_API_KEY is not configured' });
      return;
    }

    // 2) Send a single test email to one address
    if (req.query.test) {
      const to = String(req.query.test).toLowerCase().trim();
      await sendEmail({ to, subject, html: renderDigestHtml(digest, to) });
      res.status(200).json({ message: `Test email sent to ${to}`, digest });
      return;
    }

    // 3) Normal broadcast to the whole list
    const emails = await getListEmails();
    let sent = 0;
    let failed = 0;
    for (const email of emails.slice(0, 90)) {
      try {
        await sendEmail({ to: email, subject, html: renderDigestHtml(digest, email) });
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
