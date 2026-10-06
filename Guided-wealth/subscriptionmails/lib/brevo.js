// Brevo helpers. Brevo acts as BOTH the subscriber store (a contact list) and
// the mail sender, so the feature needs no database at all.
const BASE = 'https://api.brevo.com/v3';

const headers = () => ({
  'api-key': process.env.BREVO_API_KEY,
  'content-type': 'application/json',
  accept: 'application/json',
});

const listId = () => Number(process.env.BREVO_LIST_ID);

// Create/update a contact and add them to the newsletter list.
export async function addContact(email) {
  const lid = listId();
  const body = {
    email,
    listIds: lid ? [lid] : [],
    includeListIds: lid ? [lid] : [],
    attributes: [{ variable: 'OPTIN', value: 'TRUE' }],
  };
  const r = await fetch(`${BASE}/contacts`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
  // 201 created, 204 updated, 409 already exists -> all count as success
  if (r.ok || r.status === 204 || r.status === 409) return true;
  const t = await r.text();
  throw new Error(`Brevo addContact failed: ${r.status} ${t}`);
}

export async function unsubscribeContact(email) {
  const lid = listId();
  if (lid) {
    await fetch(`${BASE}/contacts/lists/${lid}/contacts/remove`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ emails: [email] }),
    });
  }
  return true;
}

// All active emails in the newsletter list (used as the recipient list).
export async function getListEmails() {
  const lid = listId();
  if (!lid) return [];
  const emails = new Set();
  let offset = 0;
  const limit = 100;
  for (let page = 0; page < 5; page += 1) {
    const r = await fetch(`${BASE}/contacts/lists/${lid}/contacts?limit=${limit}&offset=${offset}`, { headers: headers() });
    if (!r.ok) break;
    const data = await r.json();
    const contacts = data.contacts || [];
    contacts.forEach((c) => c.email && emails.add(c.email));
    if (contacts.length < limit) break;
    offset += limit;
  }
  return [...emails];
}

export async function sendEmail({ to, subject, html }) {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'guidedwealthy@gmail.com';
  const body = {
    sender: { name: 'Guided Wealthy', email: senderEmail },
    replyTo: { email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };
  const r = await fetch(`${BASE}/smtp/email`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Brevo send failed: ${r.status} ${t}`);
  }
  return true;
}
