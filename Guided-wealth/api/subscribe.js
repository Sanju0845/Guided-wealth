// Vercel serverless function -> POST /api/subscribe
// Adds the email to the Brevo contact list (Brevo is the subscriber store — no DB),
// then sends a welcome email AND the current market digest to the new subscriber.
import { addContact, sendEmail } from '../subscriptionmails/lib/brevo.js';
import { renderWelcomeHtml, renderDigestHtml } from '../subscriptionmails/lib/template.js';
import { buildDigest } from '../subscriptionmails/lib/digest.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { email, consent } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    res.status(400).json({ message: 'A valid email is required' });
    return;
  }
  if (!consent) {
    res.status(400).json({ message: 'Consent is required to subscribe' });
    return;
  }
  if (!process.env.BREVO_API_KEY) {
    res.status(500).json({ message: 'Newsletter is not configured yet.' });
    return;
  }
  try {
    const normalized = String(email).toLowerCase().trim();
    await addContact(normalized);
    // Send welcome email; don't fail the subscribe if this errors.
    try {
      await sendEmail({
        to: normalized,
        subject: 'Welcome to Guided Wealthy market updates',
        html: renderWelcomeHtml(),
      });
    } catch (e) {
      console.error('welcome email failed:', e.message);
    }
    // Also send the latest market digest immediately to the new subscriber.
    try {
      const digest = await buildDigest();
      await sendEmail({
        to: normalized,
        subject: `Guided Wealthy — Market Brief · ${digest.dateLabel}`,
        html: renderDigestHtml(digest, normalized),
      });
    } catch (e) {
      console.error('digest email failed:', e.message);
    }
    res.status(201).json({ message: "Subscribed! Check your inbox for a welcome note and your first market brief." });
  } catch (e) {
    console.error('subscribe error:', e);
    res.status(500).json({ message: 'Subscription failed. Please try again later.', error: e.message });
  }
}
