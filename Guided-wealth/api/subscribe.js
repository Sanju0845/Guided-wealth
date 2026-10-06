// Vercel serverless function -> POST /api/subscribe
// Adds the email to the Brevo contact list (Brevo is the subscriber store — no DB).
import { addContact } from '../subscriptionmails/lib/brevo.js';

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
    await addContact(String(email).toLowerCase().trim());
    res.status(201).json({ message: "Subscribed! You'll get our market & SEBI updates." });
  } catch (e) {
    console.error('subscribe error:', e);
    res.status(500).json({ message: 'Subscription failed. Please try again later.', error: e.message });
  }
}
