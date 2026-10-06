// Vercel serverless function -> GET /api/unsubscribe?email=...
// Removes the email from the Brevo list and shows a simple confirmation page.
import { unsubscribeContact } from '../subscriptionmails/lib/brevo.js';

export default async function handler(req, res) {
  const email = req.query.email || (req.body && req.body.email);
  if (email && process.env.BREVO_API_KEY) {
    try {
      await unsubscribeContact(String(email).toLowerCase().trim());
    } catch (e) {
      console.error('unsubscribe error:', e.message);
    }
  }
  res
    .status(200)
    .type('html')
    .send(
      '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<body style="font-family:Arial,Helvetica,sans-serif;padding:48px;text-align:center;color:#111">' +
        '<h2>You have been unsubscribed</h2>' +
        '<p style="color:#666">You will no longer receive Guided Wealthy market updates.</p>' +
        '</body>'
    );
}
