import React, { useState } from 'react';
import axios from 'axios';

/* Self-contained "Market & SEBI updates" subscribe widget.
   All styles are scoped under .gws so nothing leaks into the rest of the site.
   It only depends on the public POST /api/newsletter/subscribe endpoint. */
const css = `
.gws{font-family:'Nunito Sans',system-ui,sans-serif;max-width:1020px;margin:0 auto 24px;padding:22px 24px;border:1px solid rgba(224,177,95,.42);border-radius:14px;background:rgba(255,255,255,.03);display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between}
.gws .txt{flex:1 1 260px}
.gws .txt h5{font:600 1.15rem 'Nunito Sans',sans-serif;color:#e0b15f;margin:0 0 4px}
.gws .txt p{color:rgba(222,232,248,.68);font-size:.88rem;margin:0}
.gws form{flex:1 1 340px;display:flex;flex-direction:column;gap:10px}
.gws .row{display:flex;gap:10px;flex-wrap:wrap}
.gws input[type=email]{flex:1 1 200px;padding:12px 16px;border-radius:999px;border:1px solid rgba(224,177,95,.42);background:rgba(4,10,24,.6);color:#e9eef8;font:inherit;font-size:.9rem}
.gws input[type=email]::placeholder{color:rgba(222,232,248,.4)}
.gws input[type=email]:focus{outline:2px solid #e0b15f;outline-offset:2px}
.gws button{padding:12px 22px;border-radius:999px;border:0;cursor:pointer;font:600 .72rem 'Montserrat',sans-serif;letter-spacing:.1em;text-transform:uppercase;background:linear-gradient(135deg,#f0cd85,#c9993f);color:#1a1307;transition:.25s}
.gws button:hover{box-shadow:0 8px 26px rgba(224,177,95,.35)}
.gws button:disabled{opacity:.6;cursor:default}
.gws label{display:flex;gap:8px;align-items:flex-start;font-size:.72rem;color:rgba(222,232,248,.6);line-height:1.4}
.gws label input{margin-top:2px;accent-color:#e0b15f}
.gws .msg{font-size:.8rem;margin:2px 0 0}
.gws .msg.ok{color:#4ade80}
.gws .msg.err{color:#f87171}
/* light theme variant (used above the footer / on light sections) */
.gws.light{background:#f4ead6;border-color:rgba(185,138,62,.35);color:#1a1a1a;box-shadow:0 10px 30px rgba(0,0,0,.06)}
.gws.light .txt h5{color:#b98a3e}
.gws.light .txt p{color:#5b5b5b}
.gws.light input[type=email]{background:#fff;color:#1a1a1a;border-color:rgba(185,138,62,.4)}
.gws.light input[type=email]::placeholder{color:#9a9a9a}
.gws.light label{color:#5b5b5b}
.gws.light .msg.ok{color:#16a34a}
.gws.light .msg.err{color:#dc2626}
`;

export default function SubscribeForm({
  theme = 'dark',
  source = 'footer',
}: {
  theme?: 'dark' | 'light';
  source?: string;
}) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setStatus('err');
      setMessage('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setStatus('err');
      setMessage('Please tick the consent box to subscribe.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');
    try {
      const res = await axios.post('/api/subscribe', {
        email: clean,
        consent: true,
        source,
      });
      setStatus('ok');
      setMessage(res.data?.message || "Subscribed! Watch your inbox for market updates.");
      setEmail('');
      setConsent(false);
    } catch (err: any) {
      setStatus('err');
      setMessage(err?.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`gws${theme === 'light' ? ' light' : ''}`}>
      <style>{css}</style>
      <div className="txt">
        <h5>Market &amp; SEBI updates</h5>
        <p>Weekly insights, straight to your inbox. No spam — unsubscribe anytime.</p>
      </div>
      <form onSubmit={onSubmit} noValidate>
        <div className="row">
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Subscribing…' : 'Subscribe'}
          </button>
        </div>
        <label>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>I agree to receive financial market and SEBI-related emails and accept the privacy policy.</span>
        </label>
        {status !== 'idle' && (
          <p className={`msg ${status === 'ok' ? 'ok' : 'err'}`}>{message}</p>
        )}
      </form>
    </div>
  );
}
